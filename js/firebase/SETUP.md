// Firebase 設定指南（Ryan 專用）
// 請按照以下步驟設定：

// ===========================================
// 步驟 1：建立 Firebase 專案
// ===========================================
// 1. 打開 https://console.firebase.google.com/
// 2. 點擊「建立專案」
// 3. 輸入專案名稱，例如：「aquarium-studio」
// 4. 等待專案建立完成

// ===========================================
// 步驟 2：啟用 Firestore 資料庫
// ===========================================
// 1. 在 Firebase Console 左側選單點「建立」→「Firestore Database」
// 2. 點「建立資料庫」
// 3. 選擇位置（建議選 asia-southeast1 新加坡 或 asia-east1 台灣）
// 4. 選擇「以測試模式啟用」（方便開發，之後可以改規則）

// ===========================================
// 步驟 3：取得 Firebase 設定
// ===========================================
// 1. 點擊齒輪圖示 → 「專案設定」
// 2. 往下找到「你的應用程式」
// 3. 點選 "</>" 網頁圖示
// 4. 輸入暱稱（例如：「admin」）
// 5. 點「註冊應用程式」
// 6. 你會看到 firebaseConfig 物件，把裡面的值複製到下方

// ===========================================
// 步驟 4：填入你的 Firebase 設定
// ===========================================

const firebaseConfig = {
  // 範例格式（這是假的，請替換成你的）：
  // apiKey: "AIzaSyBlaBlaBlaBla...",
  // authDomain: "你的專案名稱.firebaseapp.com",
  // projectId: "你的專案名稱",
  // storageBucket: "你的專案名稱.appspot.com",
  // messagingSenderId: "123456789",
  // appId: "1:123456789:web:abc123"
  
  // 從 Firebase Console 複製過來的格式：
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// 重要：把這行改為 true 才能啟用 Firebase！
const USE_FIREBASE = false;

// ===========================================
// 驗證規則（測試模式）
// ===========================================
// 在 Firebase Console → Firestore Database → 規則
// 測試模式下規則如下（允許讀寫）：
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/
// 之後上線時要改成更嚴格的規則
