// Sample product data
const products = [
  {
    id: 1,
    title: "Handcrafted Leather Bag",
    category: "fashion",
    price: "1,200 MRU",
    location: "Ksar, Nouakchott",
    phone: "22200000000", // Replace with real vendor phone number
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"
  },
  {
    id: 2,
    title: "Wireless Earbuds Pro",
    category: "electronics",
    price: "850 MRU",
    location: "Tevragh Zeina",
    phone: "22200000000",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"
  }
];

function renderProducts(items) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  items.forEach(p => {
    // Generate WhatsApp direct link with pre-filled message
    const message = encodeURIComponent(`Hi! I am interested in buying "${p.title}" listed for ${p.price} on Souk Local.`);
    const waLink = `https://wa.me/${p.phone}?text=${message}`;

    grid.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="${p.title}">
        <div class="card-info">
          <div class="price">${p.price}</div>
          <div class="title">${p.title}</div>
          <div class="location">📍 ${p.location}</div>
          <a href="${waLink}" target="_blank" class="wa-btn">💬 Order via WhatsApp</a>
        </div>
      </div>
    `;
  });
}

// Initial render
renderProducts(products);

// Live search logic
document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(term));
  renderProducts(filtered);
});