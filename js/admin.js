// Aquarium Studio - Admin Panel Logic

const ADMIN_CONFIG = {
  DEFAULT_PASSWORD: 'aquarium123',
  STORAGE_KEYS: {
    PRODUCTS: 'aquarium_products',
    ORDERS: 'aquarium_orders',
    SETTINGS: 'aquarium_settings'
  }
};

document.addEventListener('DOMContentLoaded', function() {
  initializeAdmin();
});

function initializeAdmin() {
  if (!checkAuth()) {
    showLoginModal();
    return;
  }

  loadDashboardData();
  loadProductsForAdmin();
  loadOrdersForAdmin();
  setupUploadForm();
}

function checkAuth() {
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
  sessionStorage.setItem('admin_auth', 'true');
  document.getElementById('login-modal').style.display = 'none';
  initializeAdmin();
}

function doLogout() {
  sessionStorage.removeItem('admin_auth');
  location.reload();
}

function loadDashboardData() {
  const products = getProducts();
  const orders = getOrders();
  
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);
  
  updateElement('stat-products', products.length);
  updateElement('stat-orders', orders.length);
  updateElement('stat-revenue', formatCurrency(totalRevenue));
  updateElement('stat-pending', pendingOrders);
  updateElement('stat-stock', lowStockProducts.length);
}

function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatCurrency(amount) {
  return '$' + amount.toLocaleString();
}

// Products Functions
function getProducts() {
  const stored = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.PRODUCTS);
  if (!stored) return [];
  
  const products = JSON.parse(stored);
  
  // Remove video fields from cached products
  return products.map(p => {
    const { video, ...rest } = p;
    return rest;
  });
}

function getOrders() {
  return JSON.parse(localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.ORDERS) || '[]');
}

function loadProductsForAdmin() {
  const products = getProducts();
  const container = document.getElementById('admin-products-list');
  
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>尚未有商品</p></div>';
    return;
  }
  
  container.innerHTML = products.map(p => `
    <div class="product-item">
      <img src="${p.image || 'images/products/default-guppy.svg'}" 
           alt="${p.name}" class="product-thumb"
           onerror="this.src='images/products/default-guppy.svg'">
      <div class="product-info">
        <h4>${p.name}</h4>
        <p>$${p.price} • ${p.category} • 庫存: ${p.stock}</p>
      </div>
      <div class="product-actions">
        <button class="btn btn-edit" onclick="editProduct(${p.id})">✏️</button>
        <button class="btn btn-delete" onclick="deleteProduct(${p.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

function loadOrdersForAdmin() {
  const orders = getOrders();
  const container = document.getElementById('admin-orders-list');
  
  if (!container) return;
  
  if (orders.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>尚未有訂單</p></div>';
    return;
  }
  
  container.innerHTML = orders.map(o => `
    <div class="order-item">
      <div class="order-header">
        <span class="order-id">#${o.id}</span>
        <span class="order-status">${o.status}</span>
      </div>
      <div class="order-details">
        <p>顧客: ${o.customer?.name || '未知'}</p>
        <p>總金額: $${o.total}</p>
        <p>時間: ${new Date(o.createdAt).toLocaleString()}</p>
      </div>
    </div>
  `).join('');
}

// Upload Form Setup
function setupUploadForm() {
  const form = document.getElementById('product-upload-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const products = getProducts();
  const imageFile = document.getElementById('product-image').files[0];
  const productId = document.getElementById('product-id').value;
  
  const productData = {
    id: productId ? parseInt(productId) : Date.now(),
    name: document.getElementById('product-name').value,
    price: parseInt(document.getElementById('product-price').value),
    stock: parseInt(document.getElementById('product-stock').value),
    category: document.getElementById('product-category').value,
    description: document.getElementById('product-description').value,
    featured: document.getElementById('product-featured').checked,
    updated_at: new Date().toISOString()
  };
  
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      productData.image = e.target.result;
      saveProductData(products, productData, productId);
    };
    reader.readAsDataURL(imageFile);
  } else {
    productData.image = document.getElementById('original-image')?.value || 'images/products/default-guppy.svg';
    saveProductData(products, productData, productId);
  }
}

function saveProductData(products, productData, productId) {
  if (productId) {
    const index = products.findIndex(p => p.id == productId);
    if (index !== -1) {
      productData.image = productData.image || products[index].image;
      products[index] = productData;
    }
  } else {
    productData.image = productData.image || 'images/products/default-guppy.svg';
    products.push(productData);
  }
  
  localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  
  closeModal();
  loadProductsForAdmin();
  loadDashboardData();
  
  alert(productId ? '✅ 商品已更新！' : '✅ 商品已新增！');
}

function editProduct(id) {
  const products = getProducts();
  const product = products.find(p => p.id == id);
  if (!product) return;
  
  document.getElementById('modalTitle').textContent = '編輯商品';
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('original-image').value = product.image || '';
  
  const preview = document.getElementById('image-preview');
  if (preview && product.image) {
    preview.src = product.image;
    preview.style.display = 'block';
  }
  
  document.getElementById('productModal').classList.add('active');
}

function deleteProduct(id) {
  if (!confirm('確定要刪除這個商品嗎？')) return;
  
  let products = getProducts();
  products = products.filter(p => p.id != id);
  localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  
  loadProductsForAdmin();
  loadDashboardData();
}

function closeModal() {
  document.getElementById('productModal')?.classList.remove('active');
  document.getElementById('product-upload-form')?.reset();
  document.getElementById('image-preview').style.display = 'none';
}

// Image preview function
function previewImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('image-preview');
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Initialize dashboard
if (typeof initializeDashboard === 'undefined') {
  document.addEventListener('DOMContentLoaded', loadDashboardData);
}
