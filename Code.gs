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

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var row = [
      data.timestamp || new Date(),
      data.title,
      data.guid,
      data.link,
      data.source || "",
      data.status || "new"
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify(CONFIG, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
