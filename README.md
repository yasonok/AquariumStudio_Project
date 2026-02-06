# 🐟 瑞安水族 - 孔雀魚電商網站

專業的孔雀魚線上購物平台，結合 OpenClaw Agent 管理系統！

## ✨ 功能特色

### 🛒 買家功能
- 📱 完全手機響應式設計
- 🔍 商品搜尋和分類篩選
- 🛒 購物車功能
- 📲 一鍵透過 LINE 訂購
- 🎬 影片展示功能

### ⚙️ 管理員功能
- 📱 手機上架 - 拍照即可上架商品
- 📦 商品管理（新增/編輯/刪除/影片）
- 📋 訂單管理
- 📊 庫存追蹤

### 🎛️ Agent 系統
- 🤖 Main Agent（主代理）- 總管理
- 🚀 Sub Agents（子代理）- 獨立任務
- 📁 獨立 Workspace 設計
- 🔄 自動化營運

## 📁 檔案結構

```
AquariumStudio_Project/
├── agent-dashboard.html    ← Agent 管理儀表板
├── AGENTS.md              ← Agent 系統說明
├── index.html             ← 首頁（熱門商品展示）
├── shop.html              ← 商店（完整商品列表）
├── cart.html              ← 購物車
├── admin.html             ← 管理後台（電腦版）
├── mobile-upload.html     ← 手機上架頁面
├── products.json         ← 商品資料庫
├── css/                  ← 樣式表
├── js/                   ← JavaScript
└── images/               ← 圖片
```

## 🚀 快速開始

### 本機預覽

```bash
# 使用 Python 伺服器
python3 -m http.server 8000

# 然後打開瀏覽器
# http://localhost:8000
```

### 打開 Agent Dashboard

```bash
# 用瀏覽器打開
open agent-dashboard.html
```

## 🎛️ Agent 系統使用

### 創建 Sub Agent

1. 打開 `agent-dashboard.html`
2. 填寫 Agent 名稱、工作目錄、任務描述
3. 點擊「創建 Agent」

### 執行 Agent

```bash
# 使用 OpenClaw 指令
/claw spawn \
  --task "每日檢查 Aquarium 網站訂單" \
  --label "水族訂單管理" \
  --workspace "/Users/ryanchiang/Desktop/AquariumStudio_Project"
```

詳細說明請參考 [AGENTS.md](AGENTS.md)

## 📱 使用說明

### 買家購物
1. 在首頁或商店瀏覽商品
2. 加入購物車或立即購買
3. 點擊「透過 LINE 訂購」
4. 自動開啟 LINE，發送訂單資訊給管理員
5. 管理員確認後出貨

### 管理員操作
1. 打開 `admin.html`
2. 密碼：`admin123`
3. 可新增、編輯、刪除商品（含影片）
4. 查看訂單狀態

## 🔧 自訂設定

### 修改 LINE 帳號
在 `js/app.js` 中修改：
```javascript
const APP_CONFIG = {
  LINE_ID: 'yasonok02061',
  ...
};
```

### 修改商店名稱
搜尋「瑞安水族」並替換。

## 📊 Agent 架構

```
🤖 Main Agent（主代理）
   │
   ├── 🚀 Sub Agent: 水族網站管理
   │      └── workspace: AquariumStudio_Project/
   │
   ├── 📦 Sub Agent: 訂單管理
   │      └── workspace: orders/
   │
   └── 🔔 Sub Agent: 客戶通知
          └── workspace: notifications/
```

---

**🎯 目標：打造台灣最專業的孔雀魚線上購物平台！**
