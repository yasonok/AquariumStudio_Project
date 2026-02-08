# Aquarium Studio 專案記憶

## 網站部署
- **平台**：Netlify（已從 GitHub Pages 搬遷）
- **網址**：https://leafy-klepon-147cf0.netlify.app
- **管理後台**：https://leafy-klepon-147cf0.netlify.app/admin.html
- **商店**：https://leafy-klepon-147cf0.netlify.app/shop.html

## Netlify 設定
- **Token**: nfp_xi4s3cMAoCkxY3kPxnu5RrJsXRnrLyJWa36b
- **Site ID**: 63aea190-293b-49a7-83d6-08d6e4ac546a

## 更新方式
未來修改網站後：
1. 修改程式碼
2. `cd /Users/ryanchiang/.openclaw/workspace`
3. `git add -A && git commit -m "說明" && git push`
4. 執行 deploy 腳本或手動 zip 上傳

## 商品管理 (admin.html)
- **後台**：admin.html（簡化管理介面）
- **功能**：新增/編輯/刪除商品、圖片上傳、庫存管理
- **資料儲存**：localStorage (key: `aquarium_products`)

## 圖片處理
- 自動偵測大於 200KB 的圖片
- 自動壓縮到最大 400px
- 自動轉 JPEG（品質 70%）
- 解決 iPhone HEIC/大圖上傳問題

## 網站內容管理
- **儲存 key**: `site_content`
- **可編輯項目**：
  - 商店名稱
  - 副標題
  - 商店描述
  - 聯絡電話
  - 地址
- **影響頁面**：首頁、商店頁面會自動讀取並顯示

## GitHub
- **Repo**: yasonok/AquariumStudio_Project
- **分支**: main

## 待辦
- [ ] 建立自動 deploy 腳本
- [ ] 設定 GitHub webhook 自動部署
- [ ] 考慮未來改用雲端資料庫（Firebase/Supabase）以便跨裝置同步
