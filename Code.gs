var CONFIG = {
  feeds: [
    "https://your-connpass-group.connpass.com/your-group-id/feed/rss/",
    "https://example.peatix.com/feed.rss",
    "https://lu.ma/example-calendar.rss",
    "https://doorkeeper.jp/groups/example/feed",
    "https://techplay.jp/events.rss?tag=example",
    "https://prtimes.jp/main/search/rss?keyword=example",
    "https://atnd.org/events.rss",
    "https://eventregista.com/events.rss?tag=example",
    "https://blog.example.com/category/events/feed/"
  ],
  dedup: { use: "guid" },
  filter: {
    rules: [
      { field: "title", pattern: "Tech|Startup", action: "keep" }
    ]
  },
  publish: {
    sheet: {
      columns: ["timestamp", "title", "guid", "link", "source", "status"]
    }
  }
};

function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.mode === "run") {
      return runPipeline();
    }
    return jsonResponse(CONFIG);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.mode === "run") {
      return runPipeline();
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.timestamp || new Date(),
      data.title,
      data.guid,
      data.link,
      data.source || "",
      data.status || "new"
    ]);
    return jsonResponse({ result: "ok" });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function runPipeline() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "events_" + Utilities.formatDate(new Date(), "JST", "yyyyMMdd_HHmmss");
  var sheet = ss.insertSheet(sheetName);
  var header = CONFIG.publish.sheet.columns;
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  sheet.setFrozenRows(1);

  var seen = {};
  var rowIndex = 2;

  CONFIG.feeds.forEach(function (url) {
    try {
      var xml = UrlFetchApp.fetch(url).getContentText();
      var doc = XmlService.parse(xml);
      var items = doc.getRootElement().getChild("channel").getChildren("item");

      items.forEach(function (item) {
        var title = item.getChildText("title");
        var link = item.getChildText("link");
        var guid = item.getChildText("guid") || link;

        if (seen[guid]) return;
        seen[guid] = true;

        var matched = CONFIG.filter.rules.length === 0 ||
          CONFIG.filter.rules.some(function (rule) {
            var val = title;
            if (rule.field === "link") val = link;
            return new RegExp(rule.pattern, "i").test(val);
          });

        if (!matched) return;

        sheet.getRange(rowIndex, 1, 1, header.length).setValues([[
          new Date(), title, guid, link, extractSource(url), "new"
        ]]);
        rowIndex++;
      });
    } catch (err) {
      console.error("Failed to fetch " + url + ": " + err.message);
    }
  });

  return jsonResponse({
    result: "ok",
    sheet: sheetName,
    entries: rowIndex - 2
  });
}

function extractSource(url) {
  var m = url.match(/https?:\/\/([^.]+)/);
  return m ? m[1] : "";
}

function jsonResponse(data, code) {
  var output = ContentService.createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
  if (code) {
    output.setStatusCode(code);
  }
  return output;
}
