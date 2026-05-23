# event-crawler-gs

Google Apps Script — AppSheet からのイベントデータを受け取る Webhook エンドポイント。

## 役割

- **AppSheet** の Bot/Automation から POST されるイベント JSON を受信
- Google Spreadsheet に追記保存

## デプロイ

1. Google Spreadsheet を作成
2. 拡張機能 → Apps Script で Code.gs を貼り付け
3. デプロイ → 新しいデプロイ → Web アプリ（アクセス権: 全員）
4. 発行された URL を AppSheet の Webhook 先に設定

## POST 形式

```json
{
  "title": "イベント名",
  "guid": "unique-id",
  "link": "https://...",
  "source": "connpass",
  "status": "new"
}
```

## 関連

- [event-crawler.agent](https://github.com/bonsai/event-crawler.agent) — フィード収集パイプライン全体の設計・管理エージェント
