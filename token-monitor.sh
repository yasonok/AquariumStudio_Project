#!/bin/bash

# Gemini Token Usage Monitor Wrapper

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONITOR="$SCRIPT_DIR/token-monitor.js"

case "$1" in
  status)
    node "$MONITOR" status
    ;;
  record)
    node "$MONITOR" record "${2:-0}" "${3:-0}"
    ;;
  report)
    node "$MONITOR" report
    ;;
  reset)
    node "$MONITOR" reset
    ;;
  *)
    echo "Gemini Token Usage Monitor"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  status    - Show current usage"
    echo "  record <input> <output> - Record token usage"
    echo "  report    - Generate daily report"
    echo "  reset     - Reset counter for new day"
    ;;
esac
