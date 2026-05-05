// ===== CART MANAGER =====

const Cart = {
  get() {
    return JSON.parse(localStorage.getItem('tavik_cart') || '[]');
  },

  save(items) {
    localStorage.setItem('tavik_cart', JSON.stringify(items));
    this.updateCount();
  },

  add(product) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    this.save(items);
    showToast(`"${product.name}" added to cart 🛒`);
  },

  remove(id) {
    const items = this.get().filter(i => i.id !== id);
    this.save(items);
  },

  updateQty(id, qty) {
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = qty;
      if (item.qty <= 0) return this.remove(id);
    }
    this.save(items);
  },

  clear() {
    localStorage.removeItem('tavik_cart');
    this.updateCount();
  },

  total() {
    return this.get().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  count() {
    return this.get().reduce((sum, i) => sum + i.qty, 0);
  },

  updateCount() {
    const el = document.getElementById('cartCount');
    if (el) el.textContent = this.count();
  }
};

// Init count on page load
document.addEventListener('DOMContentLoaded', () => Cart.updateCount());

// Toast notification
function showToast(msg, type = 'success') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.borderLeftColor = type === 'error' ? '#e03131' : 'var(--accent)';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Format price in Naira
function formatPrice(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG');
}

// Render a product card
function renderProductCard(product) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return `
    <div class="product-card" onclick="window.location='product.html?id=${product.id}'">
      <div class="product-img-wrap">
        <img src="${product.image || 'assets/placeholder.png'}" alt="${product.name}" loading="lazy"
          onerror="this.src='assets/placeholder.png'" />
        ${discount ? `<span class="product-badge deal">-${discount}%</span>` : ''}
        ${product.isNew ? `<span class="product-badge" style="top:10px;right:10px;left:auto">NEW</span>` : ''}
      </div>
      <div class="product-info">
        <p class="product-category">${product.category || 'General'}</p>
        <p class="product-name">${product.name}</p>
        <div class="product-price-row">
          <div>
            <span class="product-price">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="event.stopPropagation(); Cart.add({id:'${product.id}',name:'${product.name.replace(/'/g,"\\'")}',price:${product.price},image:'${product.image || ''}',category:'${product.category || ''}'})"
            title="Add to cart">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleSearch() {
  const q = document.getElementById('searchInput')?.value.trim();
  if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
}

document.getElementById('searchInput')?.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleSearch();
});
