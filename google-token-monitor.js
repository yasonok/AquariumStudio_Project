#!/usr/bin/env node

/**
 * Google Model Token Monitor
 * 監控 Google 模型的 Token 使用量，確保在免費額度內
 */

const fs = require('fs');
const path = require('path');

const USAGE_FILE = path.join(process.env.HOME, '.openclaw', 'workspace', 'google-token-usage.json');
const LOG_DIR = path.join(process.env.HOME, '.openclaw', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'google-token-usage.log');

// Google Free Tier Limits (per day)
const LIMITS = {
  'gemini-2.0-flash': {
    dailyTokens: 1000000,    // 1M tokens/day
    dailyRequests: 1500,      // 1500 requests/day
    rpm: 15,                  // 15 requests per minute
    tpm: 1000000              // 1M tokens per minute
  },
  'gemini-1.5-flash': {
    dailyTokens: 1000000,
    dailyRequests: 1500,
    rpm: 15,
    tpm: 1000000
  },
  'gemini-1.5-pro': {
    dailyTokens: 32000,
    dailyRequests: 50,
    rpm: 2,
    tpm: 32000
  },
  'claude-opus-4-5-thinking': {  // via google-antigravity
    dailyTokens: 500000,      // Conservative estimate
    dailyRequests: 500,
    rpm: 10,
    tpm: 100000
  },
  'default': {
    dailyTokens: 100000,      // Conservative default
    dailyRequests: 100,
    rpm: 10,
    tpm: 50000
  }
};

// Warning thresholds
const WARNING_THRESHOLD = 0.80;   // 80%
const CRITICAL_THRESHOLD = 0.95;  // 95%

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function loadUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));
      const today = new Date().toISOString().split('T')[0];
      
      // Reset if new day
      if (data.date !== today) {
        return createNewUsage(today);
      }
      return data;
    }
  } catch (e) {
    console.error('Error loading usage:', e.message);
  }
  return createNewUsage(new Date().toISOString().split('T')[0]);
}

function createNewUsage(date) {
  return {
    date,
    models: {},
    totalTokens: 0,
    totalRequests: 0,
    history: []
  };
}

function saveUsage(usage) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
}

function log(message) {
  ensureLogDir();
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logLine);
}

function getModelLimits(modelName) {
  // Find matching model limits
  for (const [key, limits] of Object.entries(LIMITS)) {
    if (modelName.toLowerCase().includes(key.toLowerCase())) {
      return limits;
    }
  }
  return LIMITS.default;
}

function recordUsage(modelName, inputTokens, outputTokens) {
  const usage = loadUsage();
  const totalTokens = inputTokens + outputTokens;
  const limits = getModelLimits(modelName);
  
  // Initialize model entry if not exists
  if (!usage.models[modelName]) {
    usage.models[modelName] = {
      tokens: 0,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0
    };
  }
  
  // Update usage
  usage.models[modelName].tokens += totalTokens;
  usage.models[modelName].requests += 1;
  usage.models[modelName].inputTokens += inputTokens;
  usage.models[modelName].outputTokens += outputTokens;
  
  usage.totalTokens += totalTokens;
  usage.totalRequests += 1;
  
  // Add to history
  usage.history.push({
    timestamp: new Date().toISOString(),
    model: modelName,
    input: inputTokens,
    output: outputTokens,
    total: totalTokens
  });
  
  // Keep only last 100 entries
  if (usage.history.length > 100) {
    usage.history = usage.history.slice(-100);
  }
  
  saveUsage(usage);
  
  // Check thresholds
  const modelUsage = usage.models[modelName];
  const usagePercent = modelUsage.tokens / limits.dailyTokens;
  const requestPercent = modelUsage.requests / limits.dailyRequests;
  
  let status = 'normal';
  let alertMsg = '';
  
  if (usagePercent >= CRITICAL_THRESHOLD || requestPercent >= CRITICAL_THRESHOLD) {
    status = 'critical';
    alertMsg = `🚨 警告：${modelName} 已使用 ${(Math.max(usagePercent, requestPercent) * 100).toFixed(1)}% 額度！`;
    log(`CRITICAL: ${modelName} at ${(usagePercent * 100).toFixed(1)}% tokens, ${(requestPercent * 100).toFixed(1)}% requests`);
  } else if (usagePercent >= WARNING_THRESHOLD || requestPercent >= WARNING_THRESHOLD) {
    status = 'warning';
    alertMsg = `⚠️ 注意：${modelName} 已使用超過 80% 額度`;
    log(`WARNING: ${modelName} at ${(usagePercent * 100).toFixed(1)}% tokens, ${(requestPercent * 100).toFixed(1)}% requests`);
  }
  
  const result = {
    success: true,
    model: modelName,
    currentUsage: modelUsage.tokens,
    usagePercent: usagePercent * 100,
    requestsUsed: modelUsage.requests,
    requestsPercent: requestPercent * 100,
    tokensRemaining: limits.dailyTokens - modelUsage.tokens,
    requestsRemaining: limits.dailyRequests - modelUsage.requests,
    status,
    alertMsg
  };
  
  console.log(`📊 ${modelName}: ${modelUsage.tokens.toLocaleString()} tokens (${(usagePercent * 100).toFixed(1)}%) | ${modelUsage.requests}/${limits.dailyRequests} requests`);
  if (alertMsg) console.log(alertMsg);
  
  return result;
}

function getStatus(modelName = null) {
  const usage = loadUsage();
  const today = usage.date;
  
  console.log(`\n📊 Google 模型使用報告 - ${today}`);
  console.log('━'.repeat(50));
  
  if (modelName && usage.models[modelName]) {
    // Single model status
    const model = usage.models[modelName];
    const limits = getModelLimits(modelName);
    const tokenPercent = (model.tokens / limits.dailyTokens * 100).toFixed(1);
    const requestPercent = (model.requests / limits.dailyRequests * 100).toFixed(1);
    
    console.log(`\n🤖 ${modelName}`);
    console.log(`   Tokens: ${model.tokens.toLocaleString()} / ${limits.dailyTokens.toLocaleString()} (${tokenPercent}%)`);
    console.log(`   Requests: ${model.requests} / ${limits.dailyRequests} (${requestPercent}%)`);
    console.log(`   Input: ${model.inputTokens.toLocaleString()} | Output: ${model.outputTokens.toLocaleString()}`);
  } else {
    // All models status
    if (Object.keys(usage.models).length === 0) {
      console.log('\n✅ 今天尚未使用任何 Google 模型');
    } else {
      for (const [name, model] of Object.entries(usage.models)) {
        const limits = getModelLimits(name);
        const tokenPercent = (model.tokens / limits.dailyTokens * 100).toFixed(1);
        const requestPercent = (model.requests / limits.dailyRequests * 100).toFixed(1);
        
        let statusEmoji = '✅';
        if (tokenPercent >= 95 || requestPercent >= 95) statusEmoji = '🚨';
        else if (tokenPercent >= 80 || requestPercent >= 80) statusEmoji = '⚠️';
        
        console.log(`\n${statusEmoji} ${name}`);
        console.log(`   Tokens: ${model.tokens.toLocaleString()} / ${limits.dailyTokens.toLocaleString()} (${tokenPercent}%)`);
        console.log(`   Requests: ${model.requests} / ${limits.dailyRequests} (${requestPercent}%)`);
      }
    }
    
    console.log('\n' + '━'.repeat(50));
    console.log(`📈 總計: ${usage.totalTokens.toLocaleString()} tokens | ${usage.totalRequests} requests`);
  }
  
  console.log('━'.repeat(50));
  
  return usage;
}

function generateReport() {
  const usage = loadUsage();
  const today = usage.date;
  
  let report = `📊 Google 模型每日報告 - ${today}\n`;
  report += '━'.repeat(40) + '\n\n';
  
  if (Object.keys(usage.models).length === 0) {
    report += '✅ 今天尚未使用任何 Google 模型\n';
  } else {
    for (const [name, model] of Object.entries(usage.models)) {
      const limits = getModelLimits(name);
      const tokenPercent = (model.tokens / limits.dailyTokens * 100).toFixed(1);
      const requestPercent = (model.requests / limits.dailyRequests * 100).toFixed(1);
      
      let statusEmoji = '✅';
      if (tokenPercent >= 95 || requestPercent >= 95) statusEmoji = '🚨';
      else if (tokenPercent >= 80 || requestPercent >= 80) statusEmoji = '⚠️';
      
      report += `${statusEmoji} **${name}**\n`;
      report += `   • Tokens: ${model.tokens.toLocaleString()} / ${limits.dailyTokens.toLocaleString()} (${tokenPercent}%)\n`;
      report += `   • Requests: ${model.requests} / ${limits.dailyRequests} (${requestPercent}%)\n\n`;
    }
  }
  
  report += '━'.repeat(40) + '\n';
  report += `📈 總計: ${usage.totalTokens.toLocaleString()} tokens | ${usage.totalRequests} requests\n`;
  
  // Check for warnings
  let hasWarning = false;
  for (const [name, model] of Object.entries(usage.models)) {
    const limits = getModelLimits(name);
    if (model.tokens / limits.dailyTokens >= WARNING_THRESHOLD || 
        model.requests / limits.dailyRequests >= WARNING_THRESHOLD) {
      hasWarning = true;
      break;
    }
  }
  
  if (hasWarning) {
    report += '\n⚠️ 警告：部分模型接近每日限額！\n';
  } else {
    report += '\n✅ 狀態正常\n';
  }
  
  console.log(report);
  return report;
}

function reset() {
  const today = new Date().toISOString().split('T')[0];
  const usage = createNewUsage(today);
  saveUsage(usage);
  log('Usage reset manually');
  console.log('✅ Google 模型使用量已重置');
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  
  switch (command) {
    case 'status':
      getStatus(args[1]);
      break;
    case 'record':
      const model = args[1] || 'gemini-2.0-flash';
      const input = parseInt(args[2]) || 0;
      const output = parseInt(args[3]) || 0;
      if (!input && !output) {
        console.log('Usage: node google-token-monitor.js record <model> <input_tokens> <output_tokens>');
        console.log('Example: node google-token-monitor.js record gemini-2.0-flash 1000 500');
      } else {
        recordUsage(model, input, output);
      }
      break;
    case 'report':
      generateReport();
      break;
    case 'reset':
      reset();
      break;
    case 'limits':
      console.log('\n📋 Google 模型免費額度：\n');
      for (const [name, limits] of Object.entries(LIMITS)) {
        console.log(`${name}:`);
        console.log(`  每日 Tokens: ${limits.dailyTokens.toLocaleString()}`);
        console.log(`  每日 Requests: ${limits.dailyRequests}`);
        console.log(`  RPM: ${limits.rpm} | TPM: ${limits.tpm.toLocaleString()}\n`);
      }
      break;
    default:
      console.log('Google Token Monitor - 監控 Google 模型使用量\n');
      console.log('Commands:');
      console.log('  status [model]  - 查看使用狀態');
      console.log('  record <model> <input> <output> - 記錄使用量');
      console.log('  report          - 生成每日報告');
      console.log('  reset           - 重置計數器');
      console.log('  limits          - 顯示免費額度');
  }
}

module.exports = { recordUsage, getStatus, generateReport, reset };
