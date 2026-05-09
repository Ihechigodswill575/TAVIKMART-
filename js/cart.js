// ===== CART MANAGER =====
const Cart = {
  get() { return JSON.parse(localStorage.getItem('tavik_cart') || '[]'); },
  save(items) { localStorage.setItem('tavik_cart', JSON.stringify(items)); this.updateCount(); },
  add(product) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) { existing.qty += 1; } else { items.push({ ...product, qty: 1 }); }
    this.save(items);
    showToast(`"${product.name}" added to cart 🛒`);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  updateQty(id, qty) {
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = qty; if (item.qty <= 0) return this.remove(id); }
    this.save(items);
  },
  clear() { localStorage.removeItem('tavik_cart'); this.updateCount(); },
  total() { return this.get().reduce((s, i) => s + (i.price * i.qty), 0); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  updateCount() { const el = document.getElementById('cartCount'); if (el) el.textContent = this.count() || 0; }
};

document.addEventListener('DOMContentLoaded', () => Cart.updateCount());

// ===== TOAST =====
function showToast(msg, type = 'success') {
  let toast = document.getElementById('globalToast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'globalToast'; toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.style.borderLeftColor = type === 'error' ? 'var(--red)' : type === 'warning' ? 'var(--orange)' : 'var(--accent)';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== FORMAT PRICE =====
function formatPrice(amount) { return '₦' + Number(amount).toLocaleString('en-NG'); }

// ===== LAZY IMAGE LOADER =====
const imgObserver = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('img-loading');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' })
  : null;

function observeImages(container) {
  const imgs = (container || document).querySelectorAll('img[data-src]');
  imgs.forEach(img => {
    if (imgObserver) imgObserver.observe(img);
    else { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); img.classList.remove('img-loading'); }
  });
}

// ===== WISHLIST =====
const Wishlist = {
  get() { return JSON.parse(localStorage.getItem('tavik_wishlist') || '[]'); },
  has(id) { return this.get().some(i => i.id === id); },
  toggle(product, btn) {
    let wl = this.get();
    if (this.has(product.id)) {
      wl = wl.filter(i => i.id !== product.id);
      if (btn) { btn.textContent = '🤍'; btn.classList.remove('active'); }
      showToast('Removed from wishlist');
    } else {
      wl.push(product);
      if (btn) { btn.textContent = '❤️'; btn.classList.add('active'); }
      showToast('Added to wishlist ❤️');
    }
    localStorage.setItem('tavik_wishlist', JSON.stringify(wl));
  }
};

// ===== SESSION CACHE =====
const Cache = {
  get(key) {
    try {
      const raw = sessionStorage.getItem('tc_' + key);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > 5 * 60 * 1000) { sessionStorage.removeItem('tc_' + key); return null; }
      return data;
    } catch { return null; }
  },
  set(key, data) {
    try { sessionStorage.setItem('tc_' + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
  },
  clear(key) { sessionStorage.removeItem('tc_' + key); }
};

// ===== RENDER PRODUCT CARD =====
function renderProductCard(product) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  const inWl = Wishlist.has(product.id);
  const safeName = product.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  const safeImg = (product.image || '').replace(/'/g, "\\'");
  const safeCat = (product.category || '').replace(/'/g, "\\'");
  const isFlash = product.flashSale === true;

  return `
    <div class="product-card" onclick="window.location='product.html?id=${product.id}'">
      <div class="product-img-wrap">
        <img src="assets/placeholder.svg" data-src="${product.image || 'assets/placeholder.svg'}"
          alt="${product.name}" class="img-loading" onerror="this.src='assets/placeholder.svg'"/>
        ${isFlash ? `<span class="product-badge flash">⚡ SALE</span>` : discount ? `<span class="product-badge deal">-${discount}%</span>` : ''}
        ${product.isNew ? `<span class="product-badge" style="top:8px;right:44px;left:auto">NEW</span>` : ''}
        <button class="wishlist-btn ${inWl ? 'active' : ''}"
          onclick="event.stopPropagation();Wishlist.toggle({id:'${product.id}',name:'${safeName}',price:${product.price},image:'${safeImg}',category:'${safeCat}'},this)"
          title="${inWl ? 'Remove from wishlist' : 'Save to wishlist'}">
          ${inWl ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category || 'General'}</p>
        <p class="product-name">${product.name}</p>
        <div class="product-price-row">
          <div>
            <span class="product-price">${formatPrice(isFlash && product.flashPrice ? product.flashPrice : product.price)}</span>
            ${(product.oldPrice || (isFlash && product.flashPrice)) ? `<span class="product-old-price">${formatPrice(product.price)}</span>` : ''}
          </div>
          <button class="add-cart-btn"
            onclick="event.stopPropagation();Cart.add({id:'${product.id}',name:'${safeName}',price:${isFlash && product.flashPrice ? product.flashPrice : product.price},image:'${safeImg}',category:'${safeCat}'})"
            title="Add to cart">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </div>`;
}

// ===== SKELETON CARDS =====
function renderSkeletons(count = 8) {
  return Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text-sm"></div>
      <div class="skeleton skeleton-price"></div>
    </div>`).join('');
}

// ===== SEARCH =====
function handleSearch() {
  const q = document.getElementById('searchInput')?.value.trim();
  if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
}
document.getElementById('searchInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleSearch(); });
