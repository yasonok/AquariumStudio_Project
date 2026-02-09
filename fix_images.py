#!/usr/bin/env python3
"""
Download Unsplash images and replace URLs in markdown files
"""

import os
import re
import urllib.request
from pathlib import Path

BLOG_DIR = "/Users/ryanchiang/.openclaw/workspace/seo-blog"
IMAGES_DIR = f"{BLOG_DIR}/source/images"

def get_photo_id(url):
    """Extract photo ID from Unsplash URL"""
    match = re.search(r'photo-(\d+)', url)
    if match:
        return match.group(1)
    return None

def download_image(url, filename):
    """Download image to local directory"""
    filepath = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(filepath):
        print(f"  Already exists: {filename}")
        return True
    
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"  Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"  Failed: {filename} - {e}")
        return False

def replace_urls_in_file(filepath):
    """Replace Unsplash URLs with local paths in a markdown file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replaced_count = 0
    
    # Find all Unsplash image URLs in markdown image format
    # Pattern: ![alt](url)
    pattern = r'!\[([^\]]*)\]\((https://images\.unsplash\.com[^\s)]+)\)'
    
    def replace_match(match):
        nonlocal replaced_count
        alt_text = match.group(1)
        url = match.group(2)
        # Clean up URL (remove trailing ) if present)
        url = url.rstrip(')')
        photo_id = get_photo_id(url)
        
        if photo_id:
            new_path = f"/images/photo-{photo_id}.jpg"
            replaced_count += 1
            return f'![{alt_text}]({new_path})'
        return match.group(0)
    
    content = re.sub(pattern, replace_match, content)
    
    if replaced_count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Replaced {replaced_count} URLs in {os.path.basename(filepath)}")
    
    return replaced_count

def main():
    # Create images directory
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    # Get all markdown files
    posts_dir = f"{BLOG_DIR}/source/_posts"
    md_files = [f for f in os.listdir(posts_dir) if f.endswith('.md')]
    
    # Collect all unique image URLs
    all_urls = set()
    for md_file in md_files:
        filepath = os.path.join(posts_dir, md_file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find URLs in markdown image format
        pattern = r'https://images\.unsplash\.com[^\s)]+'
        urls = re.findall(pattern, content)
        
        for url in urls:
            if url.endswith(')'):
                url = url[:-1]  # Remove trailing )
            all_urls.add(url)
    
    print(f"Found {len(all_urls)} unique image URLs")
    
    # Download all images
    print("\nDownloading images...")
    for url in sorted(all_urls):
        photo_id = get_photo_id(url)
        if photo_id:
            filename = f"photo-{photo_id}.jpg"
            download_image(url, filename)
    
    # Replace URLs in all files
    print("\nReplacing URLs in markdown files...")
    total_replaced = 0
    for md_file in md_files:
        filepath = os.path.join(posts_dir, md_file)
        count = replace_urls_in_file(filepath)
        total_replaced += count
    
    print(f"\nTotal: Replaced {total_replaced} image URLs")

if __name__ == "__main__":
    main()
