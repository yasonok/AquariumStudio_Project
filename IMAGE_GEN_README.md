# 🎨 Image Generation - Stability AI (Free Cloud API)

## 免費雲端 AI 圖片生成

### 1. 申請免費 API Key
1. 打開 https://platform.stability.ai
2. 註冊帳號（免費）
3. 到 API Keys 頁面複製你的 key

### 2. 設定環境變數
```bash
export STABILITY_API_KEY="你的 API Key"
```

### 3. 啟動伺服器
```bash
node ~/.openclaw/workspace/image-gen.js
```

### 4. 生成圖片
```bash
curl "http://localhost:3000/generate?prompt=一隻藍色的貓&width=512&height=512"
```

## 優勢
✅ 完全免費（有一定額度）
✅ 無需安裝複雜環境
✅ 雲端運算，不需要 GPU
✅ 支援 Stable Diffusion XL

## 問題排除

**API Key 無效？**
- 確認 key 格式正確（sk_...）
- 檢查帳戶是否有免費額度

**配額用完？**
- Stability AI 提供免費額度
- 用完後需要升級付費方案

## 其他選項

如果 Stability AI 也需要付費，可以考慮：
- DALL-E 3（OpenAI API）
- Leonardo AI（免費額度較多）
