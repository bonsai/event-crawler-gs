function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const row = [
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
  return ContentService.createTextOutput("AppSheet event receiver is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
