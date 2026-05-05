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

auth.onAuthStateChanged((user) => {
  const authBtn = document.getElementById('authBtn');
  const authLabel = document.getElementById('authLabel');
  const adminBtn = document.getElementById('adminBtn');
  const accountBtn = document.getElementById('accountBtn');

  if (user) {
    // Show first name
    const name = user.displayName || user.email.split('@')[0];
    const firstName = name.split(' ')[0];

    if (authBtn) {
      authBtn.href = "account.html";
      if (authLabel) authLabel.textContent = firstName;
    }
    if (accountBtn) {
      accountBtn.style.display = 'flex';
      const lbl = document.getElementById('accountLabel');
      if (lbl) lbl.textContent = firstName;
    }
    // Admin button only for admin
    if (adminBtn && user.email === ADMIN_EMAIL) {
      adminBtn.style.display = 'flex';
    }
  } else {
    if (authBtn) {
      authBtn.href = "auth.html";
      if (authLabel) authLabel.textContent = "Sign In";
    }
    if (accountBtn) accountBtn.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
  }
});
