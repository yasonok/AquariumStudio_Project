export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { products, categories, siteContent } = req.body;
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return res.status(500).json({ error: 'GitHub Token not configured' });
  }

  const repo = 'yasonok/AquariumStudio_Project';
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  try {
    if (products) {
      const pResp = await fetch(`https://api.github.com/repos/${repo}/contents/products.json`, { headers });
      const pData = await pResp.json();
      await fetch(`https://api.github.com/repos/${repo}/contents/products.json`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          message: `更新商品：${products.length}項`,
          content: Buffer.from(JSON.stringify(products, null, 2)).toString('base64'),
          sha: pData.sha
        })
      });
    }

    if (categories) {
      const cResp = await fetch(`https://api.github.com/repos/${repo}/contents/categories.json`, { headers });
      const cData = await cResp.json();
      await fetch(`https://api.github.com/repos/${repo}/contents/categories.json`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          message: `更新分類：${categories.length}個`,
          content: Buffer.from(JSON.stringify(categories, null, 2)).toString('base64'),
          sha: cData.sha
        })
      });
    }

    if (siteContent) {
      const sResp = await fetch(`https://api.github.com/repos/${repo}/contents/site_content.json`, { headers });
      const sData = await sResp.json();
      await fetch(`https://api.github.com/repos/${repo}/contents/site_content.json`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          message: '更新網站內容',
          content: Buffer.from(JSON.stringify(siteContent, null, 2)).toString('base64'),
          sha: sData.sha
        })
      });
    }

    res.status(200).json({ success: true, message: '已同步到 GitHub' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
