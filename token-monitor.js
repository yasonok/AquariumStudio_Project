#!/usr/bin/env node

/**
 * Token Usage Monitor for Gemini 2.0 Flash
 * Tracks daily usage and warns when limits are exceeded
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  modelId: 'gemini-2.0-flash-exp',
  dailyLimit: 100000,
  requestLimit: 10,
  warningPercent: 80, // 80%
  alertPercent: 95    // 95%
};

const USAGE_FILE = path.join(process.env.HOME, '.openclaw', 'workspace', 'token-usage.json');
const LOG_FILE = path.join(process.env.HOME, '.openclaw', 'logs', 'token-usage.log');

function loadUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading usage file:', e.message);
  }
  return {};
}

function saveUsage(data) {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving usage file:', e.message);
  }
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${message}\n`;
  console.log(message);
  try {
    fs.appendFileSync(LOG_FILE, logMsg);
  } catch (e) {}
}

function checkAndResetDaily() {
  const today = new Date().toISOString().split('T')[0];
  let usage = loadUsage();
  
  if (!usage[CONFIG.modelId] || usage[CONFIG.modelId].date !== today) {
    // Reset for new day
    log(`📊 New day ${today} - Resetting token counters`);
    usage[CONFIG.modelId] = {
      date: today,
      totalTokens: 0,
      totalRequests: 0,
      warningSent: false,
      history: []
    };
    saveUsage(usage);
    return true; // Reset occurred
  }
  return false;
}

function recordUsage(inputTokens, outputTokens) {
  checkAndResetDaily();
  
  const usage = loadUsage();
  const modelData = usage[CONFIG.modelId];
  
  const requestTokens = inputTokens + outputTokens;
  const newTotal = modelData.totalTokens + requestTokens;
  const newRequests = modelData.totalRequests + 1;
  
  // Update usage
  modelData.totalTokens = newTotal;
  modelData.totalRequests = newRequests;
  modelData.history.push({
    timestamp: new Date().toISOString(),
    input: inputTokens,
    output: outputTokens,
    total: requestTokens
  });
  
  // Keep only last 100 history entries
  if (modelData.history.length > 100) {
    modelData.history = modelData.history.slice(-100);
  }
  
  saveUsage(usage);
  
  // Check limits
  const percentUsed = (newTotal / CONFIG.dailyLimit) * 100;
  const requestsRemaining = CONFIG.requestLimit - newRequests;
  const tokensRemaining = CONFIG.dailyLimit - newTotal;
  
  let status = 'normal';
  let alertMsg = '';
  
  if (percentUsed >= CONFIG.alertPercent) {
    status = 'critical';
    alertMsg = `🚨 CRITICAL: ${percentUsed.toFixed(1)}% used (${newTotal.toLocaleString()}/${CONFIG.dailyLimit.toLocaleString()})`;
  } else if (percentUsed >= CONFIG.warningPercent) {
    if (!modelData.warningSent) {
      status = 'warning';
      alertMsg = `⚠️ WARNING: ${percentUsed.toFixed(1)}% used (${newTotal.toLocaleString()}/${CONFIG.dailyLimit.toLocaleString()})`;
    }
  }
  
  log(`📊 Token usage: ${newTotal.toLocaleString()} (${percentUsed.toFixed(1)}%) | Requests: ${newRequests}/${CONFIG.requestLimit}`);
  
  return {
    success: true,
    currentUsage: newTotal,
    usagePercent: percentUsed,
    requestsRemaining,
    tokensRemaining,
    status,
    alertMsg
  };
}

function getStatus() {
  checkAndResetDaily();
  const usage = loadUsage();
  const modelData = usage[CONFIG.modelId];
  
  if (!modelData) {
    return { status: 'unknown', message: 'No usage data' };
  }
  
  const percentUsed = (modelData.totalTokens / CONFIG.dailyLimit) * 100;
  
  return {
    date: modelData.date,
    totalTokens: modelData.totalTokens,
    totalRequests: modelData.totalRequests,
    usagePercent: percentUsed,
    requestsRemaining: CONFIG.requestLimit - modelData.totalRequests,
    tokensRemaining: CONFIG.dailyLimit - modelData.totalTokens,
    status: percentUsed >= CONFIG.alertPercent ? 'critical' : (percentUsed >= CONFIG.warningPercent ? 'warning' : 'normal')
  };
}

function generateReport() {
  const status = getStatus();
  const usage = loadUsage();
  const modelData = usage[CONFIG.modelId];
  
  const today = new Date().toLocaleDateString('zh-TW');
  
  let report = `📊 Gemini 2.0 Flash 每日使用報告 - ${today}\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  report += `🔢 今日使用量：${status.totalTokens?.toLocaleString() || 0} tokens\n`;
  report += `📝 請求次數：${status.totalRequests || 0} / ${CONFIG.requestLimit}\n`;
  report += `📈 使用百分比：${status.usagePercent?.toFixed(1) || 0}%\n`;
  report += `⏳ 剩餘額度：${status.tokensRemaining?.toLocaleString() || CONFIG.dailyLimit.toLocaleString()} tokens\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  
  if (status.usagePercent >= 80) {
    report += `⚠️ 警告：已使用超過 80% 額度\n`;
  }
  
  if (status.usagePercent >= 95) {
    report += `🚨 緊急：已使用超過 95% 額度，請減少使用\n`;
  }
  
  return report;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  
  if (command === 'status') {
    const status = getStatus();
    console.log(generateReport());
  } else if (command === 'record') {
    const input = parseInt(args[1]) || 0;
    const output = parseInt(args[2]) || 0;
    const result = recordUsage(input, output);
    console.log(JSON.stringify(result, null, 2));
  } else if (command === 'report') {
    console.log(generateReport());
  } else if (command === 'reset') {
    checkAndResetDaily();
    console.log('✅ Counter reset for today');
  } else {
    console.log(`
Token Usage Monitor

Usage:
  node token-monitor.js status    - Show current usage
  node token-monitor.js record <input> <output> - Record token usage
  node token-monitor.js report    - Generate daily report
  node token-monitor.js reset     - Reset counter for new day
`);
  }
}

module.exports = {
  recordUsage,
  getStatus,
  generateReport,
  checkAndResetDaily,
  CONFIG
};
