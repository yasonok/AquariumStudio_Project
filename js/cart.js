// Aquarium Studio - Cart Page Logic

document.addEventListener('DOMContentLoaded', function() {
  initializeCartPage();
});

function initializeCartPage() {
  renderCart();
  setupCheckoutForm();
}

function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    // Disable button to prevent double submit
    submitBtn.disabled = true;
    submitBtn.textContent = '處理中...';
    
    // Collect form data
    const customerInfo = {
      name: document.getElementById('customer-name').value,
      phone: document.getElementById('customer-phone').value,
      address: document.getElementById('customer-address').value,
      note: document.getElementById('customer-note').value
    };
    
    // Create order message
    const cart = JSON.parse(localStorage.getItem('aquarium_cart') || '[]');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderMessage = `🐟 Aquarium Studio 訂單

👤 顧客資料:
- 姓名: ${customerInfo.name}
- 電話: ${customerInfo.phone}
- 地址: ${customerInfo.address}
${customerInfo.note ? `- 備註: ${customerInfo.note}` : ''}

🛒 訂單內容:
${cart.map(item => `- ${item.name} x ${item.quantity} = $${item.price * item.quantity}`).join('\n')}

💰 總金額: $${total}

---
請確認訂單，謝謝！`;

    // Create LINE URL with message
    const lineUrl = `https://line.me/R/ti/p/tsAGZrm9vt?text=${encodeURIComponent(orderMessage)}`;
    
    // Open LINE
    window.open(lineUrl, '_blank');
    
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = '💬 確認訂單並開啟 LINE';
    
    // Clear cart and show confirmation
    setTimeout(() => {
      if (confirm('訂單已開啟 LINE！\n\n點擊「確定」清除購物車並回到商店\n點擊「取消」繼續購物')) {
        clearCartAndClose();
      }
    }, 500);
  });
}

function showCopyDialog(orderMessage, customerInfo, cart, total) {
  const modal = document.getElementById('order-modal');
  const content = document.getElementById('order-modal-content');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 15px;">📋 訂單內容</h2>
      <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">
        請複製以下訂單內容，然後開啟 LINE 貼給管理員
      </p>
      
      <textarea id="order-copy-text" style="
        width: 100%;
        height: 250px;
        padding: 15px;
        border: 2px solid #667eea;
        border-radius: 10px;
        font-size: 14px;
        font-family: inherit;
        resize: none;
        margin-bottom: 15px;
      ">${orderMessage}</textarea>
      
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button onclick="copyOrderText()" class="btn btn-primary" style="flex: 1;">
          📋 複製訂單內容
        </button>
        <a href="https://line.me/R/ti/p/@yasonok02061" target="_blank" class="btn btn-secondary" style="flex: 1;">
          💬 開啟 LINE
        </a>
      </div>
      
      <p id="copy-success" style="
        color: #198754;
        text-align: center;
        margin-top: 15px;
        font-weight: bold;
        display: none;
      ">✅ 已複製！請開啟 LINE 並貼上訂單內容</p>
      
      <button onclick="clearCartAndClose()" class="btn btn-outline" style="width: 100%; margin-top: 15px;">
        完成訂單（清除購物車）
      </button>
    </div>
  `;
  
  modal.style.display = 'flex';
}

function copyOrderText() {
  const textarea = document.getElementById('order-copy-text');
  textarea.select();
  document.execCommand('copy');
  
  const successMsg = document.getElementById('copy-success');
  if (successMsg) {
    successMsg.style.display = 'block';
  }
}

function clearCartAndClose() {
  localStorage.removeItem('aquarium_cart');
  window.location.href = 'shop.html';
}

function showOrderConfirmation(order) {
  const modal = document.getElementById('order-modal');
  const content = document.getElementById('order-modal-content');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
      <h2 style="color: #198754; margin-bottom: 15px;">訂單已成立！</h2>
      <p style="color: #6c757d; margin-bottom: 10px;">訂單編號: <strong>${order.id}</strong></p>
      <p style="margin-bottom: 20px;">總金額: <strong>$${order.total}</strong></p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: left; margin-bottom: 20px;">
        <h4 style="margin-bottom: 15px;">📋 訂單摘要</h4>
        ${(order.items || []).map(item => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${item.price * item.quantity}</span>
          </div>
        `).join('')}
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #dee2e6;">
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>總計</span>
          <span>$${order.total}</span>
        </div>
      </div>
      
      <p style="color: #6c757d; font-size: 0.9rem; margin-bottom: 20px;">
        訂單通知已發送至管理員<br>
        管理員將透過 LINE 與您聯繫確認訂單
      </p>
      
      <a href="shop.html" class="btn btn-primary btn-lg" style="margin-right: 10px;">繼續購物</a>
      <button onclick="document.getElementById('order-modal').style.display='none'" class="btn btn-secondary btn-lg">關閉</button>
    </div>
  `;
  
  modal.style.display = 'flex';
}
