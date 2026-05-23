# event-crawler-gs

GAS API Server — RSSフィード収集 + AppSheet Webhook エンドポイント。

## API

| Method | Query | 動作 |
|--------|-------|------|
| `GET` | — | 設定 (CONFIG) を JSON で返す |
| `GET` | `?mode=run` | 全フィードを取得 → フィルタ → 新規シート生成 |
| `POST` | — | AppSheet からのイベントデータを受信・追記 |
| `POST` | `{"mode":"run"}` | GET ?mode=run と同様 |

## デプロイ

1. Google Spreadsheet を作成
2. 拡張機能 → Apps Script で Code.gs を貼り付け
3. デプロイ → 新しいデプロイ → Web アプリ（アクセス権: 全員）
4. 発行された URL を利用

## 設定

`Code.gs` 先頭の `CONFIG` 変数で全設定を JSON 管理:

| キー | 内容 |
|------|------|
| `feeds` | RSSフィードURL一覧 |
| `dedup` | GUID 重複排除 |
| `filter.rules` | タイトル/リンクの正規表現フィルタ |
| `publish.sheet.columns` | 出力カラム定義 |

## POST 形式 (AppSheet)

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
