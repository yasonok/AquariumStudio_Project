#!/usr/bin/env node

/**
 * Notion CLI for OpenClaw - Database Dashboard Mode
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(process.env.HOME, '.openclaw', 'notion-config.json');
let config = {};

if (fs.existsSync(CONFIG_FILE)) {
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading config:', e.message);
  }
}

const notion = new Client({
  auth: config.apiToken,
  notionVersion: config.version || '2022-06-28'
});

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  try {
    switch (command) {
      case 'sync':
      case 'create-agent-dashboard':
        await createAgentDashboard();
        break;
      case 'query':
        await cmdQuery();
        break;
      case 'get':
        await cmdGet(args[1]);
        break;
      case 'create':
        await cmdCreate(args);
        break;
      case 'search':
        await cmdSearch(args[1]);
        break;
      case 'config':
        await cmdConfig(args);
        break;
      case 'help':
      default:
        showHelp();
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function createAgentDashboard() {
  const databaseId = config.databaseId;
  
  if (!databaseId) {
    console.error('Please configure a database ID first');
    return;
  }
  
  // SubAgent configurations
  const subagents = {
    'main': {
      name: 'OpenClaw',
      agentSelect: 'OpenClaw',
      project: '主管理 Agent',
      task: '負責管理所有 SubAgent',
      workspace: '預設',
      phase: '上線中',
      progress: 100
    },
    '-5192967461': {
      name: 'AQUABOT',
      agentSelect: 'AQUABOT',
      project: '桌上型水族網站製作',
      task: '開發 Aquarium Studio 電子商務網站',
      workspace: '/workspace/project_5192',
      phase: '進行中',
      progress: 60
    },
    '-5144687626': {
      name: 'Daily_news',
      agentSelect: 'Daily_news',
      project: '每日新聞與星座運勢',
      task: '每天抓取台灣最新新聞與星座運勢，早上 8 點發送',
      workspace: '/workspace/daily_news',
      phase: '待命',
      progress: 0
    },
    '-5215480233': {
      name: 'Seo_agent',
      agentSelect: 'Seo_agent',
      project: 'SEO 網站架設',
      task: '架設 SEO 網站，每天發布一篇優化文章',
      workspace: '/workspace/seo_agent',
      phase: '進行中',
      progress: 30
    }
  };
  
  console.log('📊 Syncing', Object.keys(subagents).length, 'agents to Notion...');
  
  // Create or update entries in database
  for (const [id, agent] of Object.entries(subagents)) {
    try {
      // Check if entry exists
      const existing = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Agent',
          select: { equals: agent.agentSelect }
        }
      });
      
      const now = new Date().toISOString();
      
      const properties = {
        'Name': {
          title: [{ text: { content: agent.name } }]
        },
        'Agent': {
          select: { name: agent.agentSelect }
        },
        '專案': {
          rich_text: [{ text: { content: agent.project } }]
        },
        '任務': {
          rich_text: [{ text: { content: agent.task } }]
        },
        '階段': {
          select: { name: agent.phase }
        },
        '進度': {
          number: agent.progress
        },
        'Workspace': {
          rich_text: [{ text: { content: agent.workspace } }]
        },
        '更新時間': {
          date: { start: now }
        }
      };
      
      if (existing.results.length > 0) {
        // Update existing
        const pageId = existing.results[0].id;
        await notion.pages.update({
          page_id: pageId,
          properties
        });
        console.log(`✅ Updated: ${agent.name}`);
      } else {
        // Create new
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties
        });
        console.log(`✅ Created: ${agent.name}`);
      }
    } catch (e) {
      console.error(`❌ Error with ${agent.name}:`, e.message);
    }
  }
  
  console.log('\n🎉 Agent Dashboard sync complete!');
}

async function cmdQuery() {
  const databaseId = config.databaseId;
  
  if (!databaseId) {
    console.error('Please configure a database ID first');
    return;
  }
  
  const response = await notion.databases.query({ database_id: databaseId });
  
  console.log('📋 Database entries:', response.results.length);
  response.results.forEach(page => {
    const title = getPageTitle(page);
    const agent = page.properties.Agent?.select?.name || '-';
    const phase = page.properties.階段?.select?.name || '-';
    const progress = page.properties.進度?.number || 0;
    console.log(`• ${title} [${agent}] - ${phase} ${progress}%`);
  });
}

async function cmdGet(pageId) {
  if (!pageId) {
    console.error('Usage: notion get <page-id>');
    return;
  }
  
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log(JSON.stringify(response, null, 2));
}

async function cmdCreate(args) {
  const parseArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx > -1 ? args[idx + 1] : null;
  };
  
  const parentId = parseArg('--parent-id') || parseArg('-p');
  const title = parseArg('--title') || parseArg('-t');
  const content = parseArg('--content') || parseArg('-c');
  
  if (!parentId) {
    console.error('Usage: notion create --parent-id <id> --title "Title" --content "Markdown"');
    return;
  }
  
  const properties = {};
  if (title) {
    properties.Title = { title: [{ text: { content: title } }] };
  }
  
  const response = await notion.pages.create({
    parent: { page_id: parentId },
    properties,
    children: content ? markdownToBlocks(content) : []
  });
  
  console.log(`Created: ${response.id}`);
}

async function cmdSearch(query) {
  if (!query) {
    console.error('Usage: notion search <query>');
    return;
  }
  
  const response = await notion.search({
    query,
    filter: { property: 'object', value: 'page' }
  });
  
  response.results.forEach(page => {
    const title = getPageTitle(page);
    console.log(`• ${page.id} - ${title || 'Untitled'}`);
  });
}

async function cmdConfig(args) {
  const parseArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx > -1 ? args[idx + 1] : null;
  };
  
  const token = parseArg('--token') || parseArg('-t');
  const dbId = parseArg('--database-id') || parseArg('-d');
  
  if (token) config.apiToken = token;
  if (dbId) config.databaseId = dbId;
  
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log('Config saved:', JSON.stringify(config, null, 2));
}

function showHelp() {
  console.log(`
Notion CLI for OpenClaw

Usage: notion <command> [options]

Commands:
  sync                     Sync agents to Notion Database
  query                    List all entries in database
  get <page-id>           Get a page
  create --parent-id <id> --title "Title" --content "Markdown"
  search <query>           Search pages
  config --token <token> --database-id <id>  Configure

Examples:
  notion sync
  notion query
  notion config --token "secret_xxx..." --database-id "xxx..."
`);
}

function getPageTitle(page) {
  const titleProp = Object.values(page.properties).find(p => p.type === 'title');
  if (titleProp && titleProp.title.length > 0) {
    return titleProp.title[0].plain_text;
  }
  return null;
}

function markdownToBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  
  lines.forEach(line => {
    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading_1', heading_1: { rich_text: [{ text: { content: line.slice(2) } }] } });
    } else if (line.startsWith('## ')) {
      blocks.push({ type: 'heading_2', heading_2: { rich_text: [{ text: { content: line.slice(3) } }] } });
    } else if (line.startsWith('- ')) {
      blocks.push({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ text: { content: line.slice(2) } }] } });
    } else if (line.trim()) {
      blocks.push({ type: 'paragraph', paragraph: { rich_text: [{ text: { content: line } }] } });
    }
  });
  
  return blocks.map(b => ({ object: 'block', ...b }));
}

main();
