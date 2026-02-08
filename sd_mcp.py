#!/usr/bin/env python3
"""
MCP-style HTTP Server for Stable Diffusion
Run this to enable OpenClaw to generate images
"""

from flask import Flask, request, jsonify
import sys
sys.path.insert(0, '/Users/ryanchiang/.openclaw/workspace')
from sd_generate import generate
import os

app = Flask(__name__)

@app.route('/generate', methods=['GET', 'POST'])
def generate_image():
    data = request.json if request.is_json else request.args
    
    prompt = data.get('prompt', '')
    output = data.get('output', '/tmp/sd_output.png')
    width = data.get('width', 512)
    height = data.get('height', 512)
    steps = data.get('steps', 50)
    
    if not prompt:
        return jsonify({'error': 'prompt is required'}), 400
    
    try:
        result = generate(prompt, output, width, height, steps)
        
        # Read image as base64
        with open(result, 'rb') as f:
            import base64
            img_b64 = base64.b64encode(f.read()).decode()
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_b64}',
            'path': result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("🎨 Stable Diffusion MCP Server")
    print("   URL: http://localhost:3000/generate")
    print("   Example: curl -X POST http://localhost:3000/generate -H 'Content-Type: application/json' -d '{\"prompt\": \"a cat\"}'")
    app.run(host='0.0.0.0', port=3000)
