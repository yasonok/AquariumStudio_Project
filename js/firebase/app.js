/**
 * Aquarium Studio - Firebase 模組
 * 負責處理所有資料的讀寫操作
 */

const AquariumFirebase = {
  db: null,
  initialized: false,
  useFirebase: false,
  
  // 初始化 Firebase
  async init() {
    if (this.initialized) return;
    
    // 檢查是否啟用 Firebase
    if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE) {
      try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        
        // 初始化 Firebase
        initializeApp(firebaseConfig);
        this.db = getFirestore();
        this.useFirebase = true;
        this.initialized = true;
        this.firestore = { collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc, updateDoc, serverTimestamp };
        console.log('✅ Firebase 已啟用 - 資料將同步到雲端');
      } catch (error) {
        console.warn('Firebase 初始化失敗，使用本地儲存：', error.message);
        this.useFirebase = false;
        this.initialized = true;
      }
    } else {
      console.log('📦 Firebase 未啟用，使用本地儲存 (localStorage)');
      this.useFirebase = false;
      this.initialized = true;
    }
  },
  
  // ===== 商品操作 =====
  products: {
    async getAll() {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          const snapshot = await AquariumFirebase.firestore.getDocs(
            AquariumFirebase.firestore.collection(AquariumFirebase.db, 'products')
          );
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.warn('Firebase 讀取失敗，切換到 localStorage：', error.message);
        }
      }
      
      // 回退到 localStorage
      return JSON.parse(localStorage.getItem('aquarium_products') || '[]');
    },
    
    async getById(id) {
      const products = await this.getAll();
      return products.find(p => p.id == id || p.id === id);
    },
    
    async save(product) {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          const productData = {
            ...product,
            updated_at: AquariumFirebase.firestore.serverTimestamp()
          };
          await AquariumFirebase.firestore.setDoc(
            AquariumFirebase.firestore.doc(AquariumFirebase.db, 'products', String(product.id)),
            productData
          );
          console.log('✅ 商品已儲存到 Firebase');
          return true;
        } catch (error) {
          console.warn('Firebase 儲存失敗：', error.message);
        }
      }
      
      // 回退到 localStorage
      const products = JSON.parse(localStorage.getItem('aquarium_products') || '[]');
      const index = products.findIndex(p => p.id == product.id);
      if (index >= 0) {
        products[index] = product;
      } else {
        products.push(product);
      }
      localStorage.setItem('aquarium_products', JSON.stringify(products));
      return true;
    },
    
    async delete(id) {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          await AquariumFirebase.firestore.deleteDoc(
            AquariumFirebase.firestore.doc(AquariumFirebase.db, 'products', String(id))
          );
          console.log('✅ 商品已從 Firebase 刪除');
          return true;
        } catch (error) {
          console.warn('Firebase 刪除失敗：', error.message);
        }
      }
      
      // 回退到 localStorage
      const products = JSON.parse(localStorage.getItem('aquarium_products') || '[]');
      const filtered = products.filter(p => p.id != id && p.id !== id);
      localStorage.setItem('aquarium_products', JSON.stringify(filtered));
      return true;
    },
    
    // 即時監聽商品變化
    onChange(callback) {
      AquariumFirebase.init().then(() => {
        if (AquariumFirebase.useFirebase) {
          return AquariumFirebase.firestore.onSnapshot(
            AquariumFirebase.firestore.collection(AquariumFirebase.db, 'products'),
            (snapshot) => {
              const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              callback(products);
            },
            (error) => {
              console.warn('Firebase 監聽失敗：', error.message);
              // 回退到 localStorage
              callback(JSON.parse(localStorage.getItem('aquarium_products') || '[]'));
            }
          );
        } else {
          // 使用 localStorage 監聽
          const originalGetItem = localStorage.getItem;
          const self = this;
          localStorage.getItem = function(key) {
            if (key === 'aquarium_products') {
              callback(JSON.parse(originalGetItem.call(localStorage, key) || '[]'));
            }
            return originalGetItem.call(localStorage, key);
          };
          
          // 初始載入
          callback(JSON.parse(localStorage.getItem('aquarium_products') || '[]'));
          
          // 返回取消監聽函數
          return () => {
            localStorage.getItem = originalGetItem;
          };
        }
      });
    }
  },
  
  // ===== 分類操作 =====
  categories: {
    async getAll() {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          const snapshot = await AquariumFirebase.firestore.getDocs(
            AquariumFirebase.firestore.collection(AquariumFirebase.db, 'categories')
          );
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.warn('Firebase 讀取失敗：', error.message);
        }
      }
      
      const cats = JSON.parse(localStorage.getItem('aquarium_categories') || '[]');
      if (cats.length === 0) {
        // 預設分類
        const defaults = [
          { id: '1', name: '孔雀魚', icon: '🐟' },
          { id: '2', name: '設備', icon: '⚙️' },
          { id: '3', name: '飼料', icon: '🦐' },
          { id: '4', name: '水質', icon: '💧' }
        ];
        localStorage.setItem('aquarium_categories', JSON.stringify(defaults));
        return defaults;
      }
      return cats;
    },
    
    async save(category) {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          await AquariumFirebase.firestore.setDoc(
            AquariumFirebase.firestore.doc(AquariumFirebase.db, 'categories', String(category.id)),
            category
          );
          return true;
        } catch (error) {
          console.warn('Firebase 儲存失敗：', error.message);
        }
      }
      
      const cats = JSON.parse(localStorage.getItem('aquarium_categories') || '[]');
      const index = cats.findIndex(c => c.id == category.id);
      if (index >= 0) {
        cats[index] = category;
      } else {
        cats.push(category);
      }
      localStorage.setItem('aquarium_categories', JSON.stringify(cats));
      return true;
    },
    
    async delete(id) {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          await AquariumFirebase.firestore.deleteDoc(
            AquariumFirebase.firestore.doc(AquariumFirebase.db, 'categories', String(id))
          );
          return true;
        } catch (error) {
          console.warn('Firebase 刪除失敗：', error.message);
        }
      }
      
      const cats = JSON.parse(localStorage.getItem('aquarium_categories') || '[]');
      const filtered = cats.filter(c => c.id != id);
      localStorage.setItem('aquarium_categories', JSON.stringify(filtered));
      return true;
    }
  },
  
  // ===== 購物車操作 =====
  cart: {
    async getAll() {
      await AquariumFirebase.init();
      if (AquariumFirebase.useFirebase) {
        // Firebase 版本可以實現跨設備同步
        // 目前先使用 localStorage
      }
      return JSON.parse(localStorage.getItem('aquarium_cart') || '[]');
    },
    
    async save(cart) {
      await AquariumFirebase.init();
      localStorage.setItem('aquarium_cart', JSON.stringify(cart));
      return true;
    },
    
    async clear() {
      await AquariumFirebase.init();
      localStorage.removeItem('aquarium_cart');
      return true;
    }
  }
};

// 匯出給全域使用
window.AquariumFirebase = AquariumFirebase;
