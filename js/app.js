// ===== HOME PAGE APP =====

async function loadFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  try {
    const snap = await db.collection('products')
      .where('featured', '==', true)
      .limit(8)
      .get();

    if (snap.empty) {
      container.innerHTML = `<div class="empty-state"><h3>No products yet</h3><p>Check back soon!</p></div>`;
      return;
    }

    container.innerHTML = snap.docs.map(doc => {
      return renderProductCard({ id: doc.id, ...doc.data() });
    }).join('');
  } catch (err) {
    console.error('Error loading products:', err);
    container.innerHTML = `<div class="empty-state"><h3>Couldn't load products</h3><p>${err.message}</p></div>`;
  }
}

async function loadNewArrivals() {
  const container = document.getElementById('newArrivals');
  if (!container) return;

  try {
    const snap = await db.collection('products')
      .orderBy('createdAt', 'desc')
      .limit(8)
      .get();

    if (snap.empty) {
      container.innerHTML = `<div class="empty-state"><h3>No products yet</h3></div>`;
      return;
    }

    container.innerHTML = snap.docs.map(doc => {
      const data = doc.data();
      return renderProductCard({ id: doc.id, ...data, isNew: true });
    }).join('');
  } catch (err) {
    console.error('Error loading arrivals:', err);
    // Fallback: show featured products instead
    loadFeaturedProducts();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
  loadNewArrivals();
});
