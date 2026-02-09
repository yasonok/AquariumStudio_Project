# 🤖 OpenClaw Agent 系統

## 📱 所有 Agent 統一呼叫方式

**使用 @Ryan_assistant 呼叫所有 Agent**

在 Telegram 群組中輸入 `@Ryan_assistant` + 指令即可召喚 Agent。

範例：
```
@Ryan_assistant 幫我寫一篇 SEO 文章
@Ryan_assistant 今天的水族市場新聞
@Ryan_assistant 檢查 SEO 網站流量
```

---

## 🎯 已配置 SubAgent

| Group ID | 專案 | 任務 | 狀態 |
|----------|------|------|------|
| -5192967461 | 桌上型水族網站製作 | 開發 Aquarium Studio 電商網站 | 上線 |
| -5144687626 | 每日新聞與星座運勢 | 每天抓取台灣新聞與星座，早上 8 點發送 | 待命 |
| -5215480233 | SEO 網站架設 | 架設 SEO 網站，每天發布一篇優化文章 | 進行中 |

---

## 📁 Workspace 結構

```
~/.openclaw/workspace/
├── AVAILABLE_TOOLS.md     ← 可用工具清單（所有 Agent 可讀）
├── SOUL.md               ← 主 Agent 靈魂
├── USER.md               ← 用戶資訊
├── MEMORY.md             ← 共享記憶
├── AGENTS.md             ← Agent 系統文件
│
├── project_5192/         ← AQUABOT 獨立空間
│
├── daily_news/           ← Daily_news 獨立空間
│
└── seo_agent/            ← Seo_agent 獨立空間
```

---

## 🛠️ 可用工具

### Notion（已設定）
- **Database**：https://www.notion.so/3000c44dac01801b8740f1eb94ceb847
- **功能**：Agent 進度追蹤、專案管理
- **使用**：更新 Agent 進度時使用

### DiffusionBee（下載中）
- **用途**：本地 AI 圖片生成
- **狀態**：安裝中（~312MB）
- **功能**：Stable Diffusion 圖片生成

---

## 📊 自動排程

| 任務 | 時間 | 內容 |
|------|------|------|
| 每日進度報告 | 每天 08:00 | 同步 Agent 進度到 Notion |

---

## 💡 Agent 行為準則

1. **優先使用 Notion 儲存資料**
2. **圖片生成使用 DiffusionBee**（安裝完成後）
3. **所有進度同步到 Notion**
4. **遵守 `SOUL.md` 中的原則**

---

## 📖 相關文件

- `AVAILABLE_TOOLS.md` - 所有可用工具清單
- `SOUL.md` - 主 Agent 靈魂與原則
- `USER.md` - 用戶資訊

---

*文件更新時間：2026-02-08*
