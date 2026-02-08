#!/usr/bin/env python3
"""
Stable Diffusion Image Generator for OpenClaw
"""

import torch
from diffusers import StableDiffusionPipeline
import os
import sys

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load model
model_id = "stabilityai/stable-diffusion-xl-base-1.0"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id, 
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    use_safetensors=True
)
pipe = pipe.to(device)

def generate(prompt, output_file="output.png", width=512, height=512, steps=50):
    """Generate image from prompt"""
    print(f"Generating: {prompt}")
    
    image = pipe(
        prompt,
        width=int(width),
        height=int(height),
        num_inference_steps=int(steps),
        guidance_scale=7.5
    ).images[0]
    
    image.save(output_file)
    print(f"Saved: {output_file}")
    return output_file

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: sd_generate.py 'prompt' [--output file.png] [--width 512] [--height 512] [--steps 50]")
        sys.exit(1)
    
    prompt = sys.argv[1]
    output = "output.png"
    width, height, steps = 512, 512, 50
    
    i = 2
    while i < len(sys.argv):
        if sys.argv[i] == "--output" and i + 1 < len(sys.argv):
            output = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == "--width" and i + 1 < len(sys.argv):
            width = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == "--height" and i + 1 < len(sys.argv):
            height = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == "--steps" and i + 1 < len(sys.argv):
            steps = sys.argv[i + 1]
            i += 2
        else:
            i += 1
    
    generate(prompt, output, width, height, steps)
