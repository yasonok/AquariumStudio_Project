# 🎨 100% Free Image Generator

完全免費的 AI 圖片生成

## 使用方式

### 1. 申請免費額度
1. 打開 https://replicate.com
2. 註冊帳號（用 GitHub）
3. 取得 API Token
4. 新帳號有免費額度

### 2. 設定環境
```bash
export REPLICATE_API_TOKEN="你的_token"
```

### 3. 啟動伺服器
```bash
node ~/.openclaw/workspace/free-image-gen.js
```

### 4. 生成圖片
```bash
curl "http://localhost:3000/generate?prompt=一隻貓"
```

## 優勢

✅ 完全免費（新帳號有額度）
✅ 無需顯卡
✅ 雲端運算
✅ Stable Diffusion XL 模型

## 問題

HuggingFace 免費 API 現在需要認證
Replicate 提供新帳號免費額度
