function fetchAndProcessRSS() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const urls = [
    "https://your-connpass-group.connpass.com/your-group-id/feed/rss/",
    // 他のURLをここに追加
  ];
  
  // 既存のGUIDをロード（重複排除用）
  const data = sheet.getDataRange().getValues();
  const existingGuids = data.map(row => row[2]); // C列にGUIDが入っていると想定

  urls.forEach(url => {
    const xml = UrlFetchApp.fetch(url).getContentText();
    const document = XmlService.parse(xml);
    const items = document.getRootElement().getChild("channel").getChildren("item");

    items.forEach(item => {
      const title = item.getChildText("title");
      const link = item.getChildText("link");
      const guid = item.getChildText("guid") || link; // GUIDがない場合はlinkで代用

      // PlaggerのFilter::Deduped相当
      if (existingGuids.includes(guid)) return;

      // PlaggerのFilter::Rule相当 (Tech または Startup を含む)
      if (title.match(/Tech|Startup/i)) {
        sheet.appendRow([new Date(), title, guid, link, "未対応"]);
        existingGuids.push(guid);
      }
    });
  });
}
