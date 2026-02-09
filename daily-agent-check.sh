#!/bin/bash

# Daily Agent Optimization & Check Script
# Runs at 6 AM daily for all agents

DATE=$(date +"%Y-%m-%d %H:%M:%S")
echo "🔍 開始每日 Agent 優化與檢查 - $DATE"

# Function to check agent and report
check_agent() {
    local agent_name=$1
    local group_id=$2
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔎 檢查 $agent_name (Group: $group_id)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Get session status
    openclaw sessions list | grep "$group_id" || echo "會話不存在或已結束"
    
    # Check workspace files
    local workspace="~/.openclaw/workspace/"
    if [ "$agent_name" = "AQUABOT" ]; then
        ls -la ~/.openclaw/workspace/project_5192/ 2>/dev/null || echo "無獨立工作區"
    elif [ "$agent_name" = "Seo_agent" ]; then
        echo "文章數量: $(ls ~/.openclaw/workspace/seo-blog/source/_posts/*.md 2>/dev/null | wc -l)"
    fi
}

# Check all agents
check_agent "AQUABOT" "-5192967461"
check_agent "Daily_news" "-5144687626"
check_agent "Seo_agent" "-5215480233"

echo ""
echo "✅ 每日檢查完成！"
