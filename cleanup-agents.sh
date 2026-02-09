#!/bin/bash

# Daily Agent Cleanup Script
# Cleans context for all agents to maintain performance

echo "🧹 開始清理所有 Agent..."

# Clean main agent context
echo "清理主 Agent..."
# OpenClaw doesn't have a direct cleanup command, but we can restart sessions

# List all sessions
echo ""
echo "📋 當前會話狀態："
openclaw sessions list 2>/dev/null || echo "（需要手動檢查）"

# Clean up old memory files older than 7 days
echo ""
echo "🗑️ 清理 7 天前的記憶體檔案..."
find ~/.openclaw/workspace/memory -name "*.md" -mtime +7 -delete 2>/dev/null
echo "已完成清理"

# Clean up logs older than 7 days
echo ""
echo "📜 清理 7 天前的日誌..."
find ~/.openclaw/logs -name "*.log" -mtime +7 -delete 2>/dev/null
echo "已完成清理"

echo ""
echo "✅ 每日清理完成！"
