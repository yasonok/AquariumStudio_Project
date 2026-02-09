#!/bin/bash
# Download all Unsplash images to local

IMAGES_DIR="/Users/ryanchiang/.openclaw/workspace/seo-blog/source/images"
mkdir -p "$IMAGES_DIR"

# Get all unique URLs
urls=(
"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
"https://images.unsplash.com/photo-1473341304170-971dccb5ac13?w=800&q=80"
"https://images.unsplash.com/photo-1473341304170-971dccb5bc33?w=800&q=80"
"https://images.unsplash.com/photo-1485827404703-89b55fcc2e3b?w=800&q=80"
"https://images.unsplash.com/photo-1490645935967-10de3baa40b1?w=800&q=80"
"https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80"
"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
"https://images.unsplash.com/photo-1499209974431-9dddcece7f5c?w=800&q=80"
"https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80"
"https://images.unsplash.com/photo-1499846018114-3805d84905e3?w=800&q=80"
"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
"https://images.unsplash.com/photo-1505693416388-b0346efee539?w=800&q=80"
"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
"https://images.unsplash.com/photo-1507035895480-2b3156c31110?w=800&q=80"
"https://images.unsplash.com/photo-1507925921958-8a70486e5d38?w=800&q=80"
"https://images.unsplash.com/photo-1511295742362-92c96b50484f?w=800&q=80"
"https://images.unsplash.com/photo-1511632765486-a0198096811a?w=800&q=80"
"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
"https://images.unsplash.com/photo-1515023115689-589c33041697?w=800&q=80"
"https://images.unsplash.com/photo-1517836357463-d25dfeac2a4d?w=800&q=80"
"https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&q=80"
"https://images.unsplash.com/photo-1522202177133-8615bfea7f5c?w=800&q=80"
"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
"https://images.unsplash.com/photo-1541781777621-056d5248027f?w=800&q=80"
"https://images.unsplash.com/photo-1542601906990-b4d3f778a716?w=800&q=80"
"https://images.unsplash.com/photo-1543269865-cbf427effb59?w=800&q=80"
"https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80"
"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80"
"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
"https://images.unsplash.com/photo-1558002038-1091a166111c?w=800&q=80"
"https://images.unsplash.com/photo-1558618666-fcd25c85cd71?w=800&q=80"
"https://images.unsplash.com/photo-1563013544-824ae1b704d5?w=800&q=80"
"https://images.unsplash.com/photo-1571019613454-1cb4d1965c77?w=800&q=80"
"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
"https://images.unsplash.com/photo-1576243345690-8e4b7950a2b1?w=800&q=80"
"https://images.unsplash.com/photo-1584622650111-993a426f6670?w=800&q=80"
"https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80"
"https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&q=80"
"https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80"
"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
"https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80"
"https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80"
"https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80"
)

# Download images in parallel
for url in "${urls[@]}"; do
    # Extract photo ID from URL
    filename=$(echo "$url" | grep -oP 'photo-\d+' | head -1)
    filepath="$IMAGES_DIR/$filename.jpg"
    
    if [ ! -f "$filepath" ]; then
        curl -sL "$url" -o "$filepath" &
    fi
done

wait
echo "Download complete!"
ls -la "$IMAGES_DIR" | wc -l
