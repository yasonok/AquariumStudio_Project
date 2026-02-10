// Firebase 配置 - 請填入你的 Firebase 設定
// 取得方式：https://console.firebase.google.com/

const firebaseConfig = {
  // ===== 從 Firebase Console 取得 =====
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// ===== 是否啟用 Firebase =====
const USE_FIREBASE = false;  // 設為 true 並填入上方資料後即可啟用

// 如果 Firebase 未啟用，會自動使用 localStorage
