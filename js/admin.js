// Aquarium Studio - Admin Panel Logic

// Admin Configuration
const ADMIN_CONFIG = {
  DEFAULT_PASSWORD: 'admin123',
  STORAGE_KEYS: {
    PRODUCTS: 'aquarium_products',
    ORDERS: 'aquarium_orders',
    SETTINGS: 'aquarium_settings'
  }
};

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
  initializeAdmin();
});

function initializeAdmin() {
  // Check authentication
  if (!checkAuth()) {
    showLoginModal();
    return;
  }

  // Setup tabs
  setupAdminTabs();
  
  // Load initial data
  loadDashboardData();
  loadProductsForAdmin();
  loadOrdersForAdmin();
  
  // Setup upload form
  setupUploadForm();
}

function checkAuth() {
  // Simple auth check (in production, use proper authentication)
  const auth = sessionStorage.getItem('admin_auth');
  return auth === 'true';
}

function showLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function doLogin(password) {
  // Accept any password for demo (in production, validate properly)
  sessionStorage.setItem('admin_auth', 'true');
  document.getElementById('login-modal').style.display = 'none';
  initializeAdmin();
}

function doLogout() {
  sessionStorage.removeItem('admin_auth');
  location.reload();
}

// Tab Navigation
function setupAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const contents = document.querySelectorAll('.admin-content-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (!target) return;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update content
      contents.forEach(c => {
        c.style.display = c.id === `section-${target}` ? 'block' : 'none';
      });
    });
  });
}

// Dashboard Functions
function loadDashboardData() {
  // Stats
  const products = getProducts();
  const orders = getOrders();
  
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);
  
  // Update stat cards
  const productsEl = document.getElementById('stat-products');
  const ordersEl = document.getElementById('stat-orders');
  const revenueEl = document.getElementById('stat-revenue');
  const pendingEl = document.getElementById('stat-pending');
  
  if (productsEl) productsEl.textContent = products.length;
  if (ordersEl) ordersEl.textContent = orders.length;
  if (revenueEl) revenueEl.textContent = `$${totalRevenue}`;
  if (pendingEl) pendingEl.textContent = pendingOrders;
  
  // Update low stock warning
  const lowStockEl = document.getElementById('stat-lowstock');
  const lowStockCard = lowStockEl?.closest('.stat-card');
  if (lowStockEl) lowStockEl.textContent = lowStockProducts.length;
  if (lowStockCard && lowStockProducts.length > 0) {
    lowStockCard.classList.add('warning');
  }
}

function getProducts() {
  const products = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.PRODUCTS);
  return products ? JSON.parse(products) : [];
}

function getOrders() {
  const orders = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.ORDERS);
  return orders ? JSON.parse(orders) : [];
}

// Product Management
function loadProductsForAdmin(filter = 'all') {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  let products = getProducts();
  
  if (filter !== 'all') {
    products = products.filter(p => p.category === filter);
  }

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: #6c757d;">
          暫無商品資料
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map((product, index) => {
    const statusClass = product.stock <= 0 ? 'status-out' : product.stock <= 5 ? 'status-low' : 'status-available';
    const statusText = product.stock <= 0 ? '缺貨' : product.stock <= 5 ? '低庫存' : '有貨';
    
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <img src="${product.image || 'images/products/default-guppy.svg'}" 
               style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
               onerror="this.src='images/products/default-guppy.svg'">
        </td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price}</td>
        <td>
          <span class="status-badge ${statusClass}">${statusText}</span>
          <small style="display: block; color: #6c757d;">${product.stock} 隻</small>
        </td>
        <td>
          <div class="action-btns">
            <button class="action-btn action-btn-edit" onclick="editProduct(${product.id})">編輯</button>
            <button class="action-btn action-btn-delete" onclick="deleteProduct(${product.id})">刪除</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function saveProducts(products) {
  localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  loadProductsForAdmin();
  loadDashboardData();
}

function addProduct(productData) {
  const products = getProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct = {
    id: newId,
    ...productData,
    status: productData.stock > 0 ? 'available' : 'out',
    created_at: new Date().toISOString()
  };
  
  products.push(newProduct);
  saveProducts(products);
  AquariumApp.showToast('商品已新增', 'success');
  return newProduct;
}

function updateProduct(id, productData) {
  let products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...productData,
    status: productData.stock > 0 ? 'available' : 'out',
    updated_at: new Date().toISOString()
  };
  
  saveProducts(products);
  AquariumApp.showToast('商品已更新', 'success');
  return products[index];
}

function deleteProduct(id) {
  if (!confirm('確定要刪除此商品嗎？')) return;
  
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  AquariumApp.showToast('商品已刪除', 'success');
}

function editProduct(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) return;
  
  // Populate edit modal
  document.getElementById('edit-product-id').value = product.id;
  document.getElementById('edit-product-name').value = product.name;
  document.getElementById('edit-product-price').value = product.price;
  document.getElementById('edit-product-stock').value = product.stock;
  document.getElementById('edit-product-category').value = product.category;
  document.getElementById('edit-product-description').value = product.description || '';
  document.getElementById('edit-product-image').value = product.image || '';
  
  // Show image preview
  const preview = document.getElementById('edit-image-preview');
  if (product.image) {
    preview.innerHTML = `<img src="${product.image}" alt="商品圖片" style="width: 100%; height: 100%; object-fit: cover;">`;
  } else {
    preview.innerHTML = `
      <div class="upload-preview-text">
        <p>📷 點擊更換圖片</p>
        <p style="font-size: 0.8rem; color: #666;">支援 JPG, PNG</p>
      </div>
    `;
  }
  
  // Show video preview
  const videoPreview = document.getElementById('edit-product-video-preview');
  if (product.video) {
    videoPreview.innerHTML = `<video src="${product.video}" style="width: 100%; height: 100%; object-fit: cover;"></video>`;
    videoPreview.style.background = '#000';
  } else {
    videoPreview.innerHTML = `
      <div class="upload-preview-text">
        <p>🎥 點擊更換影片</p>
        <p style="font-size: 0.8rem; color: #666;">支援 MP4, MOV (最大 50MB)</p>
      </div>
    `;
    videoPreview.style.background = 'var(--background)';
  }
  
  // Store current video base64 in hidden field
  let videoBase64Input = document.getElementById('edit-video-base64');
  if (!videoBase64Input) {
    videoBase64Input = document.createElement('input');
    videoBase64Input.type = 'hidden';
    videoBase64Input.id = 'edit-video-base64';
    document.getElementById('edit-product-form').appendChild(videoBase64Input);
  }
  videoBase64Input.value = product.video || '';
  
  // Show modal
  document.getElementById('edit-product-modal').style.display = 'flex';
}

// Handle image upload for edit modal
function handleEditImageUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageBase64 = e.target.result;
      document.getElementById('edit-product-image').value = imageBase64;
      
      const preview = document.getElementById('edit-image-preview');
      preview.innerHTML = `<img src="${imageBase64}" alt="商品圖片" style="width: 100%; height: 100%; object-fit: cover;">`;
    };
    reader.readAsDataURL(file);
  }
}

// Update the edit form handler to handle image and video
document.getElementById('edit-product-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const id = parseInt(document.getElementById('edit-product-id').value);
  const currentProduct = getProducts().find(p => p.id === id);
  
  // Get video from hidden field
  const videoBase64Input = document.getElementById('edit-video-base64');
  const video = videoBase64Input ? videoBase64Input.value : (currentProduct?.video || '');
  
  const formData = {
    name: document.getElementById('edit-product-name').value,
    price: parseInt(document.getElementById('edit-product-price').value),
    stock: parseInt(document.getElementById('edit-product-stock').value),
    category: document.getElementById('edit-product-category').value,
    description: document.getElementById('edit-product-description').value,
    image: document.getElementById('edit-product-image').value || currentProduct?.image || 'images/products/default-guppy.svg',
    video: video
  };
  
  AdminApp.updateProduct(id, formData);
  document.getElementById('edit-product-modal').style.display = 'none';
});

// Order Management
function loadOrdersForAdmin(filter = 'all') {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;

  let orders = getOrders();
  
  if (filter !== 'all') {
    orders = orders.filter(o => o.status === filter);
  }
  
  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
          暫無訂單
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders.map((order, index) => {
    const statusBadge = getStatusBadge(order.status);
    
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <strong>${order.id}</strong><br>
          <small style="color: #6c757d;">${new Date(order.created_at).toLocaleString('zh-TW')}</small>
        </td>
        <td>
          ${order.customer?.name || '未提供'}<br>
          <small style="color: #6c757d;">${order.customer?.phone || ''}</small>
        </td>
        <td>
          ${order.items?.length || 0} 項商品<br>
          <small style="color: #6c757d;">$${order.total}</small>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn action-btn-view" onclick="viewOrder('${order.id}')">查看</button>
            <button class="action-btn action-btn-edit" onclick="updateOrderStatus('${order.id}')">更新</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBadge(status) {
  const badges = {
    'pending': '<span class="status-badge" style="background: rgba(255,193,7,0.1); color: #b38600;">待處理</span>',
    'processing': '<span class="status-badge" style="background: rgba(13,110,253,0.1); color: #0d6efd;">處理中</span>',
    'completed': '<span class="status-badge" style="background: rgba(25,135,84,0.1); color: #198754;">已完成</span>',
    'cancelled': '<span class="status-badge" style="background: rgba(220,53,69,0.1); color: #dc3545;">已取消</span>'
  };
  return badges[status] || badges.pending;
}

function viewOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return;
  
  const content = document.getElementById('view-order-content');
  if (!content) return;
  
  content.innerHTML = `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <h3>訂單 ${order.id}</h3>
        ${getStatusBadge(order.status)}
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin-bottom: 10px;">顧客資料</h4>
        <p><strong>姓名:</strong> ${order.customer?.name || '未提供'}</p>
        <p><strong>電話:</strong> ${order.customer?.phone || '未提供'}</p>
        <p><strong>地址:</strong> ${order.customer?.address || '未提供'}</p>
        ${order.customer?.note ? `<p><strong>備註:</strong> ${order.customer.note}</p>` : ''}
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <h4 style="margin-bottom: 10px;">訂單內容</h4>
        ${(order.items || []).map(item => `
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid #dee2e6;">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${item.price * item.quantity}</span>
          </div>
        `).join('')}
        <div style="display: flex; justify-content: space-between; padding-top: 15px; font-weight: bold; font-size: 1.1rem;">
          <span>總金額</span>
          <span style="color: #0d6efd;">$${order.total}</span>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('view-order-modal').style.display = 'flex';
}

function updateOrderStatus(orderId) {
  const newStatus = prompt('輸入新狀態 (pending/processing/completed/cancelled):');
  if (!newStatus) return;
  
  let orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  
  if (index === -1) return;
  
  orders[index].status = newStatus;
  localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  
  loadOrdersForAdmin();
  loadDashboardData();
  AquariumApp.showToast('訂單狀態已更新', 'success');
}

// Upload Form
function setupUploadForm() {
  const form = document.getElementById('product-upload-form');
  if (!form) return;

  const imageInput = document.getElementById('product-image');
  const preview = document.getElementById('image-preview');
  
  // Image preview
  imageInput?.addEventListener('change', function() {
    preview.innerHTML = '';
    
    Array.from(this.files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('product-name').value,
      price: parseInt(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value),
      category: document.getElementById('product-category').value,
      description: document.getElementById('product-description').value
    };
    
    // Handle image upload
    const imageFiles = imageInput?.files;
    if (imageFiles && imageFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = function(e) {
        formData.image = e.target.result;
        addProduct(formData);
        form.reset();
        if (preview) preview.innerHTML = '';
      };
      reader.readAsDataURL(imageFiles[0]);
    } else {
      formData.image = 'images/products/default-guppy.svg';
      addProduct(formData);
      form.reset();
    }
  });
}

// Mobile Upload Page
function setupMobileUpload() {
  const form = document.getElementById('mobile-upload-form');
  if (!form) return;

  // Image handling
  const imageInput = document.getElementById('mobile-product-image');
  const preview = document.getElementById('mobile-image-preview');
  const uploadArea = document.getElementById('mobile-upload-area');
  
  // Click to select
  uploadArea?.addEventListener('click', function() {
    if (imageInput) imageInput.click();
  });
  
  imageInput?.addEventListener('change', function() {
    preview.innerHTML = '';
    
    if (this.files.length > 0 && uploadArea) {
      uploadArea.querySelector('.upload-text').textContent = `已選擇 ${this.files.length} 張圖片`;
    }
    
    Array.from(this.files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // Camera capture for mobile
  const cameraBtn = document.getElementById('camera-capture-btn');
  if (cameraBtn && 'mediaDevices' in navigator) {
    cameraBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        // Capture frame
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        
        setTimeout(() => {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg');
          
          const img = document.createElement('img');
          img.src = dataUrl;
          preview.innerHTML = '';
          preview.appendChild(img);
          
          // Stop camera
          stream.getTracks().forEach(track => track.stop());
          
          // Store for form submission
          const blob = dataURLtoBlob(dataUrl);
          const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
          
          // Create a DataTransfer to set the file input
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          if (imageInput) imageInput.files = dataTransfer.files;
          
          if (uploadArea) {
            uploadArea.querySelector('.upload-text').textContent = '已拍照';
          }
        }, 1000);
        
      } catch (err) {
        console.error('Camera error:', err);
        AquariumApp.showToast('無法開啟相機', 'error');
      }
    });
  }

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span> 上傳中...';
    }
    
    setTimeout(() => {
      // Get video from hidden field
      const videoBase64Input = document.getElementById('mobile-video-base64');
      const video = videoBase64Input ? videoBase64Input.value : '';
      
      const formData = {
        name: document.getElementById('mobile-product-name').value,
        price: parseInt(document.getElementById('mobile-product-price').value),
        stock: parseInt(document.getElementById('mobile-product-stock').value),
        category: document.getElementById('mobile-product-category').value,
        description: document.getElementById('mobile-product-description').value,
        video: video
      };
      
      const imageFiles = imageInput?.files;
      if (imageFiles && imageFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
          formData.image = e.target.result;
          addProduct(formData);
          form.reset();
          preview.innerHTML = '';
          if (uploadArea) {
            uploadArea.querySelector('.upload-text').textContent = '點擊選擇圖片';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '➕ 新增商品';
          }
          AquariumApp.showToast('商品已成功上傳！', 'success');
        };
        reader.readAsDataURL(imageFiles[0]);
      } else {
        formData.image = 'images/products/default-guppy.svg';
        addProduct(formData);
        form.reset();
        preview.innerHTML = '';
        if (uploadArea) {
          uploadArea.querySelector('.upload-text').textContent = '點擊選擇圖片';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '➕ 新增商品';
        }
        AquariumApp.showToast('商品已成功上傳！', 'success');
      }
    }, 500);
  });
}

function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const binary = atob(parts[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}

// Export for global use
window.AdminApp = {
  getProducts,
  getOrders,
  addProduct,
  updateProduct,
  deleteProduct,
  loadDashboardData,
  loadProductsForAdmin,
  loadOrdersForAdmin,
  doLogin,
  doLogout,
  setupMobileUpload
};

// Export helper functions globally
window.handleEditImageUpload = handleEditImageUpload;
window.handleVideoUpload = handleVideoUpload;
window.handleMobileVideoUpload = handleMobileVideoUpload;

// Video upload handler for admin
function handleVideoUpload(input, previewId) {
  const file = input.files[0];
  if (!file) return;
  
  // Check file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    if (typeof AquariumApp !== 'undefined') {
      AquariumApp.showToast('影片太大，請選擇小於 50MB 的檔案', 'error');
    } else {
      alert('影片太大，請選擇小於 50MB 的檔案');
    }
    input.value = '';
    return;
  }
  
  // Check file type
  if (!file.type.startsWith('video/')) {
    if (typeof AquariumApp !== 'undefined') {
      AquariumApp.showToast('請選擇影片檔案', 'error');
    } else {
      alert('請選擇影片檔案');
    }
    input.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    
    // Store base64 in hidden input
    let base64Input = document.getElementById('video-base64');
    if (!base64Input) {
      base64Input = document.createElement('input');
      base64Input.type = 'hidden';
      base64Input.id = 'video-base64';
      input.form.appendChild(base64Input);
    }
    base64Input.value = base64;
    
    // Show video preview
    const preview = document.getElementById(previewId);
    if (preview) {
      preview.innerHTML = `
        <video src="${base64}" style="width: 100%; height: 100%; object-fit: cover;"></video>
        <div style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px;">
          🎬 已選擇影片
        </div>
      `;
      preview.style.background = '#000';
    }
  };
  reader.readAsDataURL(file);
}

// Mobile video upload handler
function handleMobileVideoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  
  if (file.size > 50 * 1024 * 1024) {
    if (typeof AquariumApp !== 'undefined') {
      AquariumApp.showToast('影片太大，請選擇小於 50MB', 'error');
    } else {
      alert('影片太大');
    }
    input.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('mobile-video-base64').value = e.target.result;
    
    const preview = document.getElementById('mobile-video-preview');
    if (preview) {
      preview.innerHTML = `<video src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;"></video>`;
      preview.style.background = '#000';
    }
  };
  reader.readAsDataURL(file);
}
