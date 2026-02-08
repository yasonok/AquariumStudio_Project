# 🔐 Token 使用量監控系統

追蹤 Gemini 2.0 Flash 的每日使用量，確保不超過免費額度。

## 使用方式

### 查看當前狀態
```bash
node token-monitor.js status
```

### 記錄使用量
```bash
node token-monitor.js record <輸入tokens> <輸出tokens>
```

例如：
```bash
node token-monitor.js record 1500 2500  # 記錄一次 4000 tokens 的請求
```

### 生成每日報告
```bash
node token-monitor.js report
```

### 重設計數器
```bash
node token-monitor.js reset
```

## 檔案位置

| 檔案 | 位置 |
|------|------|
| 監控腳本 | `~/.openclaw/workspace/token-monitor.js` |
| 使用量數據 | `~/.openclaw/workspace/token-usage.json` |
| 使用日誌 | `~/.openclaw/logs/token-usage.log` |

## 限額設定

| 項目 | 上限 |
|------|------|
| 每日 Token | 100,000 |
| 每日請求 | 10 次 |
| 警告閾值 | 80% |
| 緊急閾值 | 95% |

## 整合到 Agent

Agent 可以透過以下方式記錄使用量：

```javascript
const { recordUsage } = require('./token-monitor');

// 記錄 API 調用
const result = recordUsage(inputTokens, outputTokens);

if (result.status === 'warning') {
  console.log('⚠️ 已使用超過 80% 額度');
} else if (result.status === 'critical') {
  console.log('🚨 已使用超過 95% 額度！');
}
```

## 自動報告

每天早上 8 點會自動生成 Token 使用報告，併發送到 Telegram。

報告格式：
```
📊 Gemini 2.0 Flash 每日使用報告 - 2026/2/8
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔢 今日使用量：15,000 / 100,000 tokens (15%)
📝 請求次數：5 / 10
📈 使用百分比：15.0%
⏳ 剩餘額度：85,000 tokens
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 狀態正常
```

## 自動追蹤

Agent 在每次使用 Gemini API 時應該記錄使用量：

1. 取得輸入/輸出 tokens 數量
2. 呼叫 `recordUsage(inputTokens, outputTokens)`
3. 系統會自動檢查是否超過限額
4. 超過 80% 會發出警告
5. 超過 95% 會發出緊急警報

---
