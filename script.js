// Global products array synced from Firebase
let products = [];

// Render products function (supports filtering for search)
function renderProducts(items = products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #666; padding: 20px;">No products found yet. Be the first to post! 🚀</p>';
        return;
    }

    items.forEach(p => {
        // Fallback phone/location if not provided in cloud doc
        const phone = p.phone || "22200000000";
        const location = p.location || "Nouakchott";
        
        // Generate WhatsApp direct link with pre-filled message
        const message = encodeURIComponent(`Hi! I am interested in buying "${p.title}" listed for ${p.price} on Souk Local.`);
        const waLink = `https://wa.me/${phone}?text=${message}`;

        grid.innerHTML += `
            <div class="card">
                <img src="${p.image}" alt="${p.title}">
                <div class="card-info">
                    <div class="price">${p.price}</div>
                    <div class="title">${p.title}</div>
                    <div class="location">📍 ${location}</div>
                    <a href="${waLink}" target="_blank" class="wa-btn">💬 Order via WhatsApp</a>
                </div>
            </div>
        `;
    });
}

// Live search logic for cloud products
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.title.toLowerCase().includes(term));
        renderProducts(filtered);
    });
}