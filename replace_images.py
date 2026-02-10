#!/usr/bin/env python3
import os
import re
import random

posts_dir = "/Users/ryanchiang/.openclaw/workspace/seo-blog/source/_posts"
images_dir = "/Users/ryanchiang/.openclaw/workspace/seo-blog/source/images"

# 收集所有 unique 圖片
unique_images = sorted([f for f in os.listdir(images_dir) if f.startswith('unique-')])
print(f"找到 {len(unique_images)} 張 unique 圖片")

# 統計每個圖片被使用的次數
usage = {}
for filename in os.listdir(posts_dir):
    if filename.endswith('.md'):
        with open(os.path.join(posts_dir, filename), 'r') as f:
            content = f.read()
            matches = re.findall(r'/images/photo-\d+\.jpg', content)
            for m in matches:
                usage[m] = usage.get(m, 0) + 1

# 找出重複使用的圖片
repeated = {k: v for k, v in usage.items() if v > 1}
print(f"找到 {len(repeated)} 張重複使用的圖片")

# 計算需要多少張新圖片
total_new_needed = sum(v - 1 for v in repeated.values())
print(f"需要 {total_new_needed} 張新圖片")

# 為每個重複圖片分配新圖片
image_map = {}  # old -> [new1, new2, ...]
counter = 0
for old_image, count in sorted(repeated.items(), key=lambda x: -x[1]):
    new_images = []
    for i in range(count - 1):  # 每個重複的除了第一個都需要替換
        if counter < len(unique_images):
            new_img = f"/images/{unique_images[counter]}"
            new_images.append(new_img)
            counter += 1
    image_map[old_image] = new_images

print(f"已分配 {counter} 張新圖片")

# 修改文章
for filename in os.listdir(posts_dir):
    if filename.endswith('.md'):
        filepath = os.path.join(posts_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        modified = False
        for old_image, new_images in image_map.items():
            if old_image in content:
                # 計算需要替換多少次
                count = content.count(old_image)
                if count > 0 and len(new_images) > 0:
                    # 每次出現時替換為不同的新圖片
                    for new_img in new_images[:count]:
                        if new_img in content:
                            continue  # 這個已經替換過了
                        content = content.replace(old_image, new_img, 1)
                        modified = True

        if modified:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"修改: {filename}")

print("完成!")
