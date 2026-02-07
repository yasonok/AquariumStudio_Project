# 📓 Notion Skill for OpenClaw

## 設定狀態
✅ API Token 已儲存
✅ Database 已連接

## 已配置的 Database
- **ID**: 3000c44dac01801b8740f1eb94ceb847
- **連結**: https://www.notion.so/3000c44dac01801b8740f1eb94ceb847

## 使用方式

### 每日自動同步
每天早上 8 點會自動將 Agent 進度同步到 Notion。

### 手動同步
```bash
cd ~/.openclaw/workspace/notion
node notion-cli.js create-agent-dashboard
```

### 指令列表
```bash
notion create-agent-dashboard  # 建立 Dashboard
notion query                   # 查詢現有頁面
notion search <關鍵字>         # 搜尋頁面
notion config --token <token>  # 更新 Token
```

## 資料結構（Notion Database）
每筆 Agent 資料會顯示：
- 名稱
- 專案
- 任務描述
- 當前階段
- 進度百分比
- 工作項目清單
- Workspace 路徑
- 備註

## 檔案位置
- CLI 工具：`~/.openclaw/workspace/notion/notion-cli.js
- 設定檔：`~/.openclaw/notion-config.json`
