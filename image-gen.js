#!/usr/bin/env node

/**
 * Free Image Generation using Stability AI API
 * No GPU required - runs in the cloud
 */

const https = require('https');

// Stability AI API (Free tier available)
const API_KEY = process.env.STABILITY_API_KEY || '';
const API_HOST = 'api.stability.ai';
const API_VERSION = 'v1';

async function generateImage(prompt, width = 512, height = 512) {
  if (!API_KEY) {
    return { 
      error: 'API key not configured',
      message: 'Set STABILITY_API_KEY environment variable or sign up at https://platform.stability.ai'
    };
  }

  const payload = {
    text_prompts: [{ text: prompt }],
    cfg_scale: 7,
    width: parseInt(width),
    height: parseInt(height),
    samples: 1,
    steps: 30
  };

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: API_HOST,
      port: 443,
      path: `/${API_VERSION}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.images) {
            resolve({
              success: true,
              image: `data:image/png;base64,${json.images[0]}`,
              seed: json.seed
            });
          } else {
            resolve({ error: json.error?.message || 'Unknown error', raw: json });
          }
        } catch (e) {
          resolve({ error: 'Failed to parse response', raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

// Simple HTTP server
const http = require('http');
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const url = new URL(req.url, `http://localhost:3000`);
    
    if (url.pathname === '/health') {
      res.end(JSON.stringify({ status: 'ok', provider: 'stability-ai' }));
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
    } else {
      res.end(JSON.stringify({ 
        error: 'Unknown endpoint',
        endpoints: ['/health', '/generate?prompt=...&width=512&height=512']
      }));
    }
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎨 Image Generation Server`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Endpoint: POST /generate?prompt=...`);
  console.log(`\n⚠️  API key required!`);
  console.log(`   Get free key: https://platform.stability.ai`);
  console.log(`   Then run: export STABILITY_API_KEY=your_key_here`);
});
