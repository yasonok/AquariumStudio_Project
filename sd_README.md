# 🎨 Stable Diffusion for OpenClaw

本地 AI 圖片生成（無需 GitHub）

## 安裝狀態
✅ Python 環境已設定
⏳ 首次運行會自動下載模型（約 6GB）

## 使用方式

### 1. 啟動 MCP 伺服器
```bash
source ~/.venv/sd/bin/activate
python3 ~/.openclaw/workspace/sd_mcp.py
```

### 2. 生成圖片
```bash
# HTTP API
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "一隻可愛的貓咪", "width": 512, "height": 512}'

# 直接使用 Python
source ~/.venv/sd/bin/activate
python3 ~/.openclaw/workspace/sd_generate.py "一隻藍色的貓" --output ~/cat.png
```

### 3. OpenClaw 集成（待完成）
未來可直接在對話中生成圖片。

## 文件位置
- 生成腳本：`~/.openclaw/workspace/sd_generate.py`
- MCP 伺服器：`~/.openclaw/workspace/sd_mcp.py`
- 虛擬環境：`~/.venv/sd/`
