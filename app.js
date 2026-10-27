// Import Firebase SDKs via Web CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    serverTimestamp,
    query,
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your exact Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGeta_tSwDhcGu4Wwnfnv2fElaqx1ekY0",
  authDomain: "souklocal-2fce9.firebaseapp.com",
  projectId: "souklocal-2fce9",
  storageBucket: "souklocal-2fce9.firebasestorage.app",
  messagingSenderId: "820268611237",
  appId: "1:820268611237:web:4175208f983ffb1fb33f4c",
  measurementId: "G-0MSCKJZ99M"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsRef = collection(db, "products");

// App State
let allProducts = [];
let currentSellerStore = null;

// HTML Elements
const productGrid = document.getElementById("productGrid");
const postModal = document.getElementById("postModal");
const postForm = document.getElementById("postForm");
const openPostBtn = document.getElementById("openPostBtn");
const closePostBtn = document.getElementById("closePostBtn");
const storeHeaderBanner = document.getElementById("storeHeaderBanner");
const storeTitle = document.getElementById("storeTitle");
const resetStoreBtn = document.getElementById("resetStoreBtn");

// --- REAL-TIME FIRESTORE DATA SYNC ---
const q = query(productsRef, orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    renderProducts();
}, (error) => {
    console.error("Error fetching live data: ", error);
});

// --- RENDER PRODUCTS & STORE DASHBOARD ---
function renderProducts() {
    if (!productGrid) return;

    let filtered = currentSellerStore 
        ? allProducts.filter(p => p.sellerName?.toLowerCase() === currentSellerStore.toLowerCase())
        : allProducts;

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <h3>No items found</h3>
                <p>${currentSellerStore ? 'This store has no active listings.' : 'Be the first to post something!'}</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filtered.map(item => {
        const isOwner = currentSellerStore && item.sellerName?.toLowerCase() === currentSellerStore.toLowerCase();
        
        return `
            <div class="product-card">
                <div class="product-img-wrapper">
                    <img src="${item.imageUrl || 'https://via.placeholder.com/300'}" class="product-img" alt="${item.title}">
                    <span class="product-cat-badge">${item.category || 'General'}</span>
                </div>
                <div class="product-body">
                    <span class="store-tag" onclick="viewStore('${item.sellerName}')">
                        🏪 ${item.sellerName || 'Anonymous Seller'}
                    </span>
                    <h3 class="product-title">${item.title}</h3>
                    <div class="product-price">${item.price} MRU</div>
                    <div class="product-loc">📍 ${item.location || 'Nouakchott'}</div>
                    
                    <div class="card-actions">
                        <a href="https://wa.me/${item.whatsapp}?text=Hi,%20I'm%20interested%20in%20your%20item:%20${encodeURIComponent(item.title)}" 
                           target="_blank" class="wa-btn">
                           💬 WhatsApp
                        </a>
                        ${isOwner ? `
                            <button class="delete-card-btn" onclick="deleteProduct('${item.id}')">
                                🗑️ Delete / Sold
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// --- STORE PROFILE CONTROLS ---
window.viewStore = (sellerName) => {
    currentSellerStore = sellerName;
    if (storeHeaderBanner && storeTitle) {
        storeTitle.textContent = `${sellerName}'s Store Profile`;
        storeHeaderBanner.style.display = "flex";
    }
    renderProducts();
};

if (resetStoreBtn) {
    resetStoreBtn.addEventListener("click", () => {
        currentSellerStore = null;
        if (storeHeaderBanner) storeHeaderBanner.style.display = "none";
        renderProducts();
    });
}

// --- ADD NEW PRODUCT TO FIRESTORE ---
if (postForm) {
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const newProduct = {
            title: document.getElementById("prodTitle").value,
            price: Number(document.getElementById("prodPrice").value),
            category: document.getElementById("prodCategory").value,
            location: document.getElementById("prodLocation").value,
            whatsapp: document.getElementById("prodWhatsapp").value,
            sellerName: document.getElementById("prodSeller").value,
            imageUrl: document.getElementById("prodImage").value || "https://via.placeholder.com/300",
            createdAt: serverTimestamp()
        };

        try {
            await addDoc(productsRef, newProduct);
            postForm.reset();
            closeModal();
            viewStore(newProduct.sellerName);
        } catch (err) {
            console.error("Error adding product: ", err);
            alert("Could not post item. Check your connection or Firestore rules!");
        }
    });
}

// --- DELETE / SOLD PRODUCT FROM FIRESTORE ---
window.deleteProduct = async (productId) => {
    if (confirm("Mark this item as sold and delete listing?")) {
        try {
            await deleteDoc(doc(db, "products", productId));
        } catch (err) {
            console.error("Error deleting product: ", err);
        }
    }
};

// --- MODAL CONTROLS ---
function openModal() { if (postModal) postModal.classList.add("open"); }
function closeModal() { if (postModal) postModal.classList.remove("open"); }

if (openPostBtn) openPostBtn.addEventListener("click", openModal);
if (closePostBtn) closePostBtn.addEventListener("click", closeModal);
