# 🚀 Deploy to GitHub + Decap CMS

## 方法一：GitHub Pages + Netlify（推薦）

### 步驟 1：上傳到 GitHub

```bash
# 1. 建立 GitHub 倉庫
# 前往 https://github.com/new
# 創建新倉庫，例如：AquariumStudio_Project

# 2. 本地初始化
cd ~/Desktop/AquariumStudio_Project
git init
git add .
git commit -m "Initial commit"

# 3. 連接 GitHub
git remote add origin https://github.com/你的帳號/AquariumStudio_Project.git
git branch -M main
git push -u origin main
```

### 步驟 2：連接 Netlify（免費托管 CMS）

1. 前往 https://app.netlify.com
2. 「Add new site」→「Import an existing project」
3. 選擇你的 GitHub 倉庫
4. Netlify 會自動偵測設定
5. Deploy！

### 步驟 3：啟用 CMS

1. Netlify → Site settings → Identity → Enable Identity
2. Git Gateway → Enable Git Gateway
3.前往 `你的網址/admin`
4. 用 GitHub 帳號登入
5. 開始管理商品！

---

## 方法二：純 GitHub Pages（需要手動更新）

```bash
# 1. 前往 GitHub 倉庫
# Settings → Pages
# Source: Deploy from a branch
# Branch: main → /(root)
# Save

# 2. 網址會是：
https://你的帳號.github.io/AquariumStudio_Project/
```

**注意**：純 GitHub Pages 不能使用 CMS 上傳功能！

---

## 📁 資料夾結構

```
AquariumStudio_Project/
├── index.html          ← 首頁
├── shop.html          ← 商店
├── cart.html          ← 購物車
├── admin.html         ← WordPress 風格後台（手機用）
├── admin/
│   ├── index.html     ← Decap CMS 入口
│   └── config.yml     ← CMS 設定
├── products.json      ← 商品資料
├── css/               ← 樣式表
├── js/                ← JavaScript
└── images/products/   ← 商品圖片
```

---

## 📱 手機後台使用

### 管理後台（推薦）
```
你的網址/admin.html
```
- WordPress 風格介面
- 手機瀏覽器最佳化
- 可新增/編輯/刪除商品
- 上傳圖片/影片

### Decap CMS（進階）
```
你的網址/admin
```
- GitHub 風格介面
- 需要 Netlify 托管
- 圖片自動 commit 到 GitHub

---

## 🎯 部署檢查清單

- [ ] 上傳到 GitHub 倉庫
- [ ] 啟用 GitHub Pages
- [ ] 測試首頁：`https://你的帳號.github.io/AquariumStudio_Project/`
- [ ] 測試後台：`https://你的帳號.github.io/AquariumStudio_Project/admin.html`
- [ ] 測試購物車功能
- [ ] 測試 LINE 訂購功能

---

## 🔧 常見問題

### Q: 圖片上傳失敗？
A: 確保使用 Netlify 托管，才能使用 CMS 上傳功能

### Q: 手機後台無法儲存？
A: 資料存在瀏覽器 localStorage，請定期備份 products.json

### Q: 如何更新商品？
A: 
- 方式一：用手機後台（admin.html）
- 方式二：用 Decap CMS（需要 Netlify）

---

## 📞 支援

需要幫助請聯絡！
