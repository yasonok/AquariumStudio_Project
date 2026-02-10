# SEO 文章生成腳本
# 用於自動生成新的 SEO 優化文章

## 系統狀態
- **狀態：** 已就緒
- **最後執行：** 2026-02-11 01:25

---

## 待生成文章清單

### Day 6 (02/13)
- [ ] 主題：晨間習慣完整指南
- [ ] 關鍵字：晨間習慣、早起、 morning routine

### Day 7 (02/14)
- [ ] 主題：GTD 時間管理完整教學
- [ ] 關鍵字：GTD、Getting Things Done、任務管理

### Day 8 (02/15)
- [ ] 主題：專注冥想完整指南
- [ ] 關鍵字：冥想、正念、mindfulness

---

## 文章模板結構

每篇文章都包含：
1. **標題**（包含主要關鍵字）
2. **摘要**（150-200 字）
3. **目錄**（3-5 個主要段落）
4. **正文**（1500-2500 字）
5. **FAQ**（常見問題）
6. **結論與行動呼籲**
7. **標籤和分類**

---

## 自動化腳本

### 執行方式
```bash
cd /Users/ryanchiang/.openclaw/workspace/seo_agent
chmod +x generate_article.sh
./generate_article.sh "文章標題" "關鍵字"
```

### 部署方式
```bash
cd /Users/ryanchiang/.openclaw/workspace/seo_blog
git add .
git commit -m "Add new article: 文章標題"
git push origin main
```

---

## 成功指標
- **每日目標：** 1-2 篇新文章
- **關鍵字涵蓋：** 每篇文章至少 3 個主要關鍵字
- **發布頻率：** 每週 7-14 篇
