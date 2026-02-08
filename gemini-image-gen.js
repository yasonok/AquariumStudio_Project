#!/usr/bin/env node

/**
 * Gemini Image Generator for Seo_agent
 * Generates images using Google Gemini 2.0 Flash
 */

const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

async function generateImage(prompt) {
  const payload = {
    contents: [{
      parts: [{
        text: `Generate an image with this Parti Prompt (high quality, realistic): ${prompt}`
      }]
    }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"]
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: '/v1beta/models/gemini-2.0-flash-exp:generateContent',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates?.[0]?.content?.parts) {
            const parts = json.candidates[0].content.parts;
            // Check for inline data (image)
            const imagePart = parts.find(p => p.inlineData);
            if (imagePart) {
              resolve({
                success: true,
                image: `data:image/png;base64,${imagePart.inlineData.data}`
              });
            } else {
              // Check for text response (model might not support image gen yet)
              resolve({
                success: false,
                text: parts.map(p => p.text || '').join('\n')
              });
            }
          } else {
            resolve({ error: 'No image generated', raw: json });
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

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const prompt = args.join(' ');
  
  if (!prompt) {
    console.log('Usage: node gemini-image-gen.js "image description prompt"');
    process.exit(1);
  }
  
  console.log('🎨 Generating image...');
  generateImage(prompt).then(result => {
    if (result.success) {
      console.log('✅ Image generated!');
      console.log(`data:image/png;base64,... (${result.image.length} chars)`);
    } else {
      console.log('❌ Error:', result.error || result.text);
    }
  }).catch(e => console.error('Error:', e.message));
}

module.exports = { generateImage };
