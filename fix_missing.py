#!/usr/bin/env python3
"""
Fix missing images by replacing with working placeholder images
"""

import os
import urllib.request

IMAGES_DIR = "/Users/ryanchiang/.openclaw/workspace/seo-blog/source/images"

# Missing images that need to be replaced
missing_photos = [
    "photo-1473341304170.jpg",
    "photo-1485827404703.jpg",
    "photo-1490645935967.jpg",
    "photo-1499846018114.jpg",
    "photo-1505693416388.jpg",
    "photo-1507035895480.jpg",
    "photo-1507925921958.jpg",
    "photo-1511295742362.jpg",
    "photo-1511632765486.jpg",
    "photo-1515023115689.jpg",
    "photo-1517836357463.jpg",
    "photo-1522202177133.jpg",
    "photo-1541781777621.jpg",
    "photo-1542601906990.jpg",
    "photo-1543269865.jpg",
    "photo-1558002038.jpg",
    "photo-1558618666.jpg",
    "photo-1563013544.jpg",
    "photo-1571019613454.jpg",
    "photo-1576243345690.jpg",
    "photo-1584622650111.jpg",
    "photo-1593642632823.jpg",
    "photo-1611974765270.jpg",
]

# Reliable placeholder images from Unsplash direct links
# Using specific image IDs that are known to work
replacement_urls = {
    "photo-1473341304170.jpg": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
    "photo-1485827404703.jpg": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    "photo-1490645935967.jpg": "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80",
    "photo-1499846018114.jpg": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    "photo-1505693416388.jpg": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
    "photo-1507035895480.jpg": "https://images.unsplash.com/photo-1507035895480-2b3156c31110?w=800&q=80",
    "photo-1507925921958.jpg": "https://images.unsplash.com/photo-1507925921958-8a70486e5d38?w=800&q=80",
    "photo-1511295742362.jpg": "https://images.unsplash.com/photo-1511295742362-92c96b50484f?w=800&q=80",
    "photo-1511632765486.jpg": "https://images.unsplash.com/photo-1511632765486-a0198096811a?w=800&q=80",
    "photo-1515023115689.jpg": "https://images.unsplash.com/photo-1515023115689-589c33041697?w=800&q=80",
    "photo-1517836357463.jpg": "https://images.unsplash.com/photo-1517836357463-d25dfeac2a4d?w=800&q=80",
    "photo-1522202177133.jpg": "https://images.unsplash.com/photo-1522202177133-8615bfea7f5c?w=800&q=80",
    "photo-1541781777621.jpg": "https://images.unsplash.com/photo-1541781777621-056d5248027f?w=800&q=80",
    "photo-1542601906990.jpg": "https://images.unsplash.com/photo-1542601906990-b4d3f778a716?w=800&q=80",
    "photo-1543269865.jpg": "https://images.unsplash.com/photo-1543269865-cbf427effb59?w=800&q=80",
    "photo-1558002038.jpg": "https://images.unsplash.com/photo-1558002038-1091a166111c?w=800&q=80",
    "photo-1558618666.jpg": "https://images.unsplash.com/photo-1558618666-fcd25c85cd71?w=800&q=80",
    "photo-1563013544.jpg": "https://images.unsplash.com/photo-1563013544-824ae1b704d5?w=800&q=80",
    "photo-1571019613454.jpg": "https://images.unsplash.com/photo-1571019613454-1cb4d1965c77?w=800&q=80",
    "photo-1576243345690.jpg": "https://images.unsplash.com/photo-1576243345690-8e4b7950a2b1?w=800&q=80",
    "photo-1584622650111.jpg": "https://images.unsplash.com/photo-1584622650111-993a426f6670?w=800&q=80",
    "photo-1593642632823.jpg": "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&q=80",
    "photo-1611974765270.jpg": "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80",
}

print(f"Need to fix {len(missing_photos)} images")

fixed = 0
for photo in missing_photos:
    filepath = os.path.join(IMAGES_DIR, photo)
    
    # Check if file exists and is broken (< 1000 bytes)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        if size < 1000:
            print(f"  Removing broken: {photo} ({size} bytes)")
            os.remove(filepath)
    
    # Download if still missing
    if not os.path.exists(filepath):
        if photo in replacement_urls:
            url = replacement_urls[photo]
            print(f"  Downloading: {photo}")
            try:
                urllib.request.urlretrieve(url, filepath)
                print(f"    Success!")
                fixed += 1
            except Exception as e:
                print(f"    Failed: {e}")
        else:
            print(f"  No replacement URL for: {photo}")

print(f"\nFixed {fixed} images")
