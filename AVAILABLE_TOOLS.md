# 🎨 已安裝工具清單

所有 Agent 均可使用的工具與資源。

---

## ✅ 已安裝的應用程式

| 工具 | 狀態 | 用途 |
|------|------|------|
| ✅ DiffusionBee | 已安裝 | 本地 AI 圖片生成（Stable Diffusion） |
| ✅ VS Code | 已安裝 | 萬用程式碼編輯器 |
| ✅ Figma | 已安裝 | UI/UX 設計 |
| ✅ Bitwarden | 已安裝 | 免費密碼管理 |
| ✅ Postman | 已安裝 | API 測試 |
| ✅ GIMP | 已安裝 | 專業圖片編輯 |
| ✅ Audacity | 已安裝 | 音頻編輯 |
| ✅ HandBrake | 已安裝 | 影片轉檔 |

---

## 🤖 AI 模型

| 模型 | 狀態 | 用途 | 每日限額 |
|------|------|------|----------|
| ✅ Gemini 2.0 Flash | 已設定 | Seo_agent 使用 | **100,000 tokens** |
| ✅ MiniMax-M2.1 | 已設定 | 主 Agent 使用 | 無限制 |

### 🔐 Gemini 2.0 Flash 嚴格限額

| 項目 | 上限 | 說明 |
|------|------|------|
| 每日 Token | 100,000 | 輸入 + 輸出 |
| 每日請求 | 10 次 | 每篇最多 8000 tokens |
| 單次輸入 | 50,000 tokens | 避免超長 prompt |
| 單次輸出 | 8,000 tokens | 避免過長回應 |
| 警告閾值 | 80% | 超過 80,000 tokens 警告 |

**🔍 監控系統**：
- 位置：`~/.openclaw/workspace/token-monitor.js`
- 追蹤檔案：`~/.openclaw/workspace/token-usage.json`
- 日誌檔案：`~/.openclaw/logs/token-usage.log`

**監控指令**：
```bash
node token-monitor.js status   # 查看當前使用量
node token-monitor.js report   # 生成每日報告
node token-monitor.js record <input> <output>  # 記錄使用量
```

**使用建議**：
- 每篇 SEO 文章約 2000-4000 tokens
- 每天最多 10 篇 SEO 文章
- 圖片生成提示約 500 tokens/張

詳細規範：見 `API_LIMITS.md`

---

## ⏳ 待手動安裝

| 工具 | 說明 |
|------|------|
| DaVinci Resolve | 專業影片剪輯，需從官網下載：https://www.blackmagicdesign.com/products/davinciresolve |

---

## 📓 Notion（已設定）
- **Database**：https://www.notion.so/3000c44dac01801b8740f1eb94ceb847
- **用途**：Agent 進度追蹤、專案管理

---

## 🤖 OpenClaw Agent 系統

### 已配置的 SubAgent

| Agent | Group ID | 任務 | Workspace | 模型 |
|-------|----------|------|-----------|------|
| AQUABOT | -5192967461 | 桌上型水族網站製作 | 獨立 | MiniMax-M2.1 |
| Daily_news | -5144687626 | 每日新聞與星座運勢 | 共享 | MiniMax-M2.1 |
| Seo_agent | -5215480233 | SEO 網站架設 | 獨立 | **Gemini 2.0 Flash** |

---

## 📊 自動排程

| 任務 | 時間 | 內容 |
|------|------|------|
| 每日進度報告 | 每天早上 8:00 | 同步 Agent 進度到 Notion |

---

## 💡 Agent 可用工具

當需要：
- **生成圖片**：使用 DiffusionBee 或 Gemini 2.0 Flash
- **圖片編輯**：使用 GIMP
- **程式開發**：使用 VS Code
- **API 測試**：使用 Postman
- **密碼管理**：使用 Bitwarden
- **影片剪輯**：下載 DaVinci Resolve
- **UI 設計**：使用 Figma

---

*文件更新時間：2026-02-08*
