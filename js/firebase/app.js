/**
 * Aquarium Studio - Firebase 模組
 * 負責處理所有資料的讀寫操作
 */

const AquariumFirebase = {
  initialized: false,
  
  // 初始化
  async init() {
    if (this.initialized) return;
    
    // 檢查 Firebase 是否啟用
    const useFB = typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE;
    
    if (useFB) {
      try {
        // Firebase 模式
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        
        initializeApp(firebaseConfig);
        this.db = getFirestore();
        this.useFirebase = true;
        this.firestore = { collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc, updateDoc, serverTimestamp };
        this.initialized = true;
        console.log('✅ Firebase 已啟用');
      } catch (e) {
        console.warn('Firebase 載入失敗，使用本地模式：', e.message);
        this.useFirebase = false;
        this.initialized = true;
      }
    } else {
      // 本地模式
      this.useFirebase = false;
      this.initialized = true;
      console.log('📦 使用本地儲存模式');
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
          console.warn('Firebase 讀取失敗：', error.message);
        }
      }
      
      // 本地模式
      return JSON.parse(localStorage.getItem('aquarium_products') || '[]');
    },
    
    async save(product) {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          const productData = { ...product, updated_at: new Date().toISOString() };
          await AquariumFirebase.firestore.setDoc(
            AquariumFirebase.firestore.doc(AquariumFirebase.db, 'products', String(product.id)),
            productData
          );
          return true;
        } catch (error) {
          console.warn('Firebase 儲存失敗：', error.message);
        }
      }
      
      // 本地模式
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
          return true;
        } catch (error) {
          console.warn('Firebase 刪除失敗：', error.message);
        }
      }
      
      // 本地模式
      const products = JSON.parse(localStorage.getItem('aquarium_products') || '[]');
      const filtered = products.filter(p => p.id != id);
      localStorage.setItem('aquarium_products', JSON.stringify(filtered));
      return true;
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
    
    async save(cat) {
      await AquariumFirebase.init();
      
      if (AquariumFirebase.useFirebase) {
        try {
          await AquariumFirebase.firestore.setDoc(
            AquariumFirebase.firestore.doc(AquariumFirebase.db, 'categories', String(cat.id)),
            cat
          );
          return true;
        } catch (error) {
          console.warn('Firebase 儲存失敗：', error.message);
        }
      }
      
      const cats = JSON.parse(localStorage.getItem('aquarium_categories') || '[]');
      const index = cats.findIndex(c => c.id == cat.id);
      if (index >= 0) {
        cats[index] = cat;
      } else {
        cats.push(cat);
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
  }
};
