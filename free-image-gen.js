#!/usr/bin/env node

/**
 * 100% Free Image Generation using Replicate
 * No GPU required - runs in the cloud
 */

const https = require('https');

// Replicate API - Has free trial credits
const API_TOKEN = process.env.REPLICATE_API_TOKEN || '';

async function generateImage(prompt, width = 512, height = 512) {
  if (!API_TOKEN) {
    return { 
      error: 'API token required',
      message: 'Get free token at https://replicate.com/account/api-tokens',
      note: 'New accounts get free trial credits'
    };
  }

  const payload = {
    version: "stability-ai/stable-diffusion:27ff9a72a5833d9835e4a936df4a562f5b50114af7c889fc625e78d96d8de1f",
    input: {
      prompt: prompt,
      width: parseInt(width),
      height: parseInt(height),
      num_outputs: 1
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.replicate.com',
      port: 443,
      path: '/v1/predictions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
        'Prefer': 'wait'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.output) {
            resolve({
              success: true,
              image: json.output[0].startsWith('data:') ? json.output[0] : `data:image/png;base64,${json.output[0]}`
            });
          } else if (json.error) {
            resolve({ error: json.error });
          } else {
            resolve({ status: json.status, id: json.id });
          }
        } catch (e) {
          resolve({ error: 'Parse error', raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

// HTTP Server
const http = require('http');
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const url = new URL(req.url, `http://localhost:3000`);
    
    if (url.pathname === '/health') {
      res.end(JSON.stringify({ 
        status: 'ok', 
        provider: 'replicate (free trial)',
        note: API_TOKEN ? 'API token configured' : 'Token not set - get free credits at https://replicate.com'
      }));
    } else if (url.pathname === '/generate') {
      const prompt = url.searchParams.get('prompt');
      const width = url.searchParams.get('width') || 512;
      const height = url.searchParams.get('height') || 512;
      
      if (!prompt) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'prompt is required' }));
        return;
      }
      
      const result = await generateImage(prompt, width, height);
      res.end(JSON.stringify(result));
    } else if (url.pathname === '/help') {
      res.end(JSON.stringify({
        endpoints: ['/health', '/generate?prompt=...'],
        usage: 'curl "http://localhost:3000/generate?prompt=cat"',
        setup: 'export REPLICATE_API_TOKEN=your_token'
      }));
    } else {
      res.end(JSON.stringify({ error: 'Unknown endpoint', help: 'Visit /help' }));
    }
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎨 Free Image Generator`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`\n⚠️  Setup required:`);
  console.log(`   1. Go to https://replicate.com`);
  console.log(`   2. Sign up and get free trial credits`);
  console.log(`   3. Export: export REPLICATE_API_TOKEN=your_token`);
});
