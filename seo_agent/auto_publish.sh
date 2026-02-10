#!/bin/bash

# SEO Blog Auto-Publish Script
# 自動發布文章到 SEO Blog
# 作者：OpenClaw SEO Agent
# 日期：2026-02-11

# 設定路徑
BLOG_DIR="/Users/ryanchiang/.openclaw/workspace/seo-blog"
AGENT_DIR="/Users/ryanchiang/.openclaw/workspace/seo_agent"
LOG_FILE="$AGENT_DIR/auto_publish.log"

# 記錄日誌
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# 檢查是否有新文章
check_new_articles() {
    # 獲取最新的 md 檔案
    NEW_ARTICLES=$(find "$BLOG_DIR/source/_posts" -name "*.md" -newer "$AGENT_DIR/last_check.txt" 2>/dev/null)
    if [ -n "$NEW_ARTICLES" ]; then
        echo "$NEW_ARTICLES"
        return 0
    else
        return 1
    fi
}

# 部署到 GitHub
deploy_to_github() {
    log "開始部署到 GitHub..."
    cd "$BLOG_DIR"
    
    # 添加所有變更
    git add -A
    
    # 檢查是否有變更
    if git diff --cached --quiet; then
        log "沒有新變更，跳過部署"
        return 0
    fi
    
    # 提交
    COMMIT_MSG="Auto-publish: $(date '+%Y-%m-%d %H:%M')"
    git commit -m "$COMMIT_MSG"
    
    # 推送到 GitHub
    git push origin main
    
    if [ $? -eq 0 ]; then
        log "部署成功！"
        return 0
    else
        log "部署失敗！"
        return 1
    fi
}

# 生成文章摘要
generate_summary() {
    echo "========================================="
    echo "SEO Blog 自動發布報告"
    echo "時間：$(date '+%Y-%m-%d %H:%M:%S')"
    echo "========================================="
    echo ""
    echo "已發布文章："
    ls -1 "$BLOG_DIR/source/_posts" | tail -5
    echo ""
    echo "Git Commit：$(git log -1 --oneline)"
}

# 主程式
main() {
    log "=== 開始自動發布程序 ==="
    
    # 檢查新文章
    if check_new_articles; then
        log "發現新文章，準備部署..."
        deploy_to_github
        generate_summary
    else
        log "沒有新文章，檢查是否需要更新 sitemap..."
        # 這裡可以加入 sitemap 更新邏輯
    fi
    
    log "=== 完成 ==="
}

# 更新檢查時間
touch "$AGENT_DIR/last_check.txt"

# 執行主程式
main
