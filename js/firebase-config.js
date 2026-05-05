// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyCTJ5ffPLkZbEoNmjQxOpvELXRI8Ti8xGE",
  authDomain: "my-whatsapp-2c1af.firebaseapp.com",
  databaseURL: "https://my-whatsapp-2c1af-default-rtdb.firebaseio.com",
  projectId: "my-whatsapp-2c1af",
  storageBucket: "my-whatsapp-2c1af.firebasestorage.app",
  messagingSenderId: "1089455460888",
  appId: "1:1089455460888:web:cd99432cc76e5399ebe96d"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_EMAIL = "ihechigodswill575@gmail.com";

// Auth state listener — runs on every page
auth.onAuthStateChanged((user) => {
  const authBtn = document.getElementById('authBtn');
  const authLabel = document.getElementById('authLabel');
  const adminBtn = document.getElementById('adminBtn');

  if (user) {
    if (authBtn) {
      authBtn.href = "orders.html";
      if (authLabel) authLabel.textContent = user.displayName || "Account";
    }
    // Show admin button only for admin
    if (adminBtn && user.email === ADMIN_EMAIL) {
      adminBtn.style.display = 'flex';
    }
  } else {
    if (authBtn) {
      authBtn.href = "auth.html";
      if (authLabel) authLabel.textContent = "Sign In";
    }
    if (adminBtn) adminBtn.style.display = 'none';
  }
});
