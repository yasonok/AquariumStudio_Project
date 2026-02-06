# 🎛️ Agent Dashboard 使用說明

## 📁 檔案位置

```
AquariumStudio_Project/
├── agent-dashboard.html    ← Agent 管理儀表板
├── index.html             ← 水族商店首頁
├── admin.html             ← 商品管理後台
├── shop.html              ← 商品列表
├── cart.html              ← 購物車
├── mobile-upload.html     ← 手機上架
├── js/                    ← JavaScript
├── css/                   ← 樣式表
├── images/                ← 圖片
└── products.json          ← 商品資料
```

---

## 🚀 快速開始

### 1. 打開 Agent Dashboard

```bash
# 用瀏覽器打開
open aquarium/agent-dashboard.html
```

### 2. 創建 Sub Agent

在 Dashboard 中填寫：
- **Agent 名稱**：例如「水族訂單管理」
- **Workspace**：獨立工作目錄
- **任務描述**：這個 Agent 要做什麼

### 3. 執行 Sub Agent

使用 OpenClaw 指令：

```bash
# 創建並執行
/claw spawn --task "每日檢查訂單、更新庫存" --workspace "/path/to/workspace" --label "水族訂單管理"

# 查看所有 sessions
/claw sessions list

# 發訊息給 Sub Agent
/claw send "水族訂單管理" "有新訂單！"
```

---

## 📐 Agent 架構

```
🤖 Main Agent（主代理）
   │
   ├── 📦 Sub Agent: 水族網站管理
   │      └── workspace: AquariumStudio_Project/
   │
   ├── 📋 Sub Agent: 訂單管理  
   │      └── workspace: orders/
   │
   └── 🔔 Sub Agent: 客戶通知
          └── workspace: notifications/
```

---

## 💡 常見任務範例

### 任務 1：每日訂單檢查

```bash
/claw spawn \
  --task "每日檢查 Aquarium 網站訂單，發送到 LINE" \
  --label "水族每日訂單" \
  --workspace "/Users/ryanchiang/Desktop/AquariumStudio_Project"
```

### 任務 2：庫存警報

```bash
/claw spawn \
  --task "監控商品庫存，低於 5 隻時發出警報" \
  --label "水族庫存警報" \
  --workspace "/Users/ryanchiang/Desktop/AquariumStudio_Project"
```

### 任務 3：自動更新商品

```bash
/claw spawn \
  --task "從 Google Sheets 更新商品資料到網站" \
  --label "水族商品同步" \
  --workspace "/Users/ryanchiang/Desktop/AquariumStudio_Project"
```

---

## 🔧 OpenClaw 常用指令

| 指令 | 說明 |
|------|------|
| `/claw sessions list` | 查看所有 Agent |
| `/claw spawn --task "..." --label "..."` | 創建新 Agent |
| `/claw send "標籤" "訊息"` | 發訊息給 Agent |
| `/claw history --limit 10` | 查看歷史記錄 |

---

## 🎯 最佳實踐

1. **每個 Agent 一個專門任務**
   - 不要讓一個 Agent 做太多事
   
2. **Workspace 分開管理**
   - 每個 Agent 有獨立資料夾
   - 避免資料混亂

3. **定期檢查執行狀態**
   - 用 Dashboard 監控
   - 確保任務正常運行

---

## 📞 支援

如有問題，問 Main Agent（我）！

---
 
**🎉 祝你管理順利！**
