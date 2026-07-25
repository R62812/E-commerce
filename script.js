

// ✅ Global Variables
let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
// Admin Page Logic
let editingId = null;

function renderAdminProducts() {
  const container = document.getElementById('adminProductList');
  if (!container) return;

  container.innerHTML = '';
  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${prod.image}" />
      <h3>${prod.name}</h3>
      <p>₹${prod.price}</p>
      <p>Category: ${prod.category}</p>
      <button onclick="editProduct(${prod.id})">✏️ Edit</button>
      <button onclick="deleteProduct(${prod.id})">🗑 Delete</button>
    `;
    container.appendChild(card);
  });
}





/* ----------  Multilingual Dictionary  ---------- */
const i18n = {
  en: {
    home:"Home", shop:"Shop", cart:"Cart",
    track:"Track Order", return:"Return Product",
    heroTitle:"Find Your Next Gadget", addToCart:"Add to Cart",
    searchPH:"Search products...",
    category_All:"All", category_Mobile:"Mobiles", category_Laptop:"Laptops",
    category_Tablet:"Tablets", category_Headphones:"Headphones",
    category_Speakers:"Speakers", category_Camera:"Camera",
    category_Accessories:"Accessories", category_Wearables:"Wearables",
    trackBtn:"Track", submitReturn:"Submit Return",
    orderIdPH:"Enter Order ID", productNamePH:"Enter Product Name",
    reasonPH:"Reason for return..."
  },
  hi: { // Hindi
    home:"होम", shop:"दुकान", cart:"कार्ट",
    track:"ऑर्डर ट्रैक करें", return:"रिटर्न प्रोडक्ट",
    heroTitle:"अपना अगला गैजेट खोजें", addToCart:"कार्ट में जोड़ें",
    searchPH:"प्रोडक्ट खोजें...",
    category_All:"सभी", category_Mobile:"मोबाइल", category_Laptop:"लैपटॉप",
    category_Tablet:"टैबलेट", category_Headphones:"हेडफ़ोन",
    category_Speakers:"स्पीकर", category_Camera:"कैमरा",
    category_Accessories:"एक्सेसरीज़", category_Wearables:"वियरेबल्स",
    trackBtn:"ट्रैक करें", submitReturn:"रिटर्न सबमिट",
    orderIdPH:"ऑर्डर आईडी डालें", productNamePH:"प्रोडक्ट नाम", reasonPH:"रिटर्न का कारण..."
  },
  te: { // Telugu
    home:"హోమ్", shop:"షాప్", cart:"కార్ట్",
    track:"ఆర్డర్ ట్రాక్", return:"రిటర్న్ ఉత్పత్తి",
    heroTitle:"మీ తదుపరి గాడ్జెట్ కనుగొనండి", addToCart:"కార్ట్‌లో చేర్చండి",
    searchPH:"ఉత్పత్తిని శోధించండి...",
    category_All:"అన్నీ", category_Mobile:"మొబైల్స్", category_Laptop:"ల్యాప్‌టాప్‌లు",
    category_Tablet:"ట్యాబ్లెట్లు", category_Headphones:"హెడ్‌ఫోన్స్",
    category_Speakers:"స్పీకర్లు", category_Camera:"కెమెరా",
    category_Accessories:"ఆక్సెసరీస్", category_Wearables:"వియరబుల్స్",
    trackBtn:"ట్రాక్", submitReturn:"రిటర్న్ సమర్పించు",
    orderIdPH:"ఆర్డర్ ID నమోదు చేయండి", productNamePH:"ఉత్పత్తి పేరు", reasonPH:"రిటర్న్ కారణం..."
  },


   en: {
    home: "Home", shop: "Shop", wishlist: "Wishlist", cart: "Cart",
    login: "Login", contact: "Contact", review: "Review",
    // ...other keys
  },
  hi: {
    home: "होम", shop: "दुकान", wishlist: "इच्छा-सूची", cart: "कार्ट",
    login: "लॉगिन", contact: "संपर्क करें", review: "समीक्षा",
    // ...other keys
  },
  te: {
    home: "హోమ్", shop: "షాప్", wishlist: "కోరికల జాబితా", cart: "కార్ట్",
    login: "లాగిన్", contact: "సంప్రదించండి", review: "సమీక్ష",
    // ...other keys
  }
};

/* ----------  Language Helpers  ---------- */
function changeLanguage(lang){
  localStorage.setItem("lang", lang);
  translatePage(lang);
  document.getElementById("languageSelect").value = lang;
}

function translatePage(lang){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(i18n[lang][key]) el.innerText = i18n[lang][key];
  });
  // placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    const key = el.getAttribute("data-i18n-ph");
    if(i18n[lang][key]) el.placeholder = i18n[lang][key];
  });
}

/* ----------  Init on load  ---------- */
window.addEventListener("DOMContentLoaded",()=>{
  const lang = localStorage.getItem("lang") || "en";
  changeLanguage(lang); // this will also call translatePage
});


function showAddProductForm() {
  document.getElementById("formTitle").innerText = "Add Product";
  document.getElementById("prodName").value = '';
  document.getElementById("prodPrice").value = '';
  document.getElementById("prodCategory").value = '';
  document.getElementById("prodImage").value = '';
  editingId = null;
  document.getElementById("productForm").style.display = 'block';
}

function editProduct(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  document.getElementById("formTitle").innerText = "Edit Product";
  document.getElementById("prodName").value = prod.name;
  document.getElementById("prodPrice").value = prod.price;
  document.getElementById("prodCategory").value = prod.category;
  document.getElementById("prodImage").value = prod.image;
  editingId = id;
  document.getElementById("productForm").style.display = 'block';
}

function cancelForm() {
  document.getElementById("productForm").style.display = 'none';
}

function saveProduct() {
  const name = document.getElementById("prodName").value;
  const price = parseFloat(document.getElementById("prodPrice").value);
  const category = document.getElementById("prodCategory").value;
  const image = document.getElementById("prodImage").value;

  if (editingId) {
    const prod = products.find(p => p.id === editingId);
    prod.name = name;
    prod.price = price;
    prod.category = category;
    prod.image = image;
  } else {
    const newProd = {
      id: Date.now(),
      name,
      price,
      category,
      image
    };
    products.push(newProd);
  }

  filteredProducts = [...products];
  renderAdminProducts();
  document.getElementById("productForm").style.display = 'none';

  alert("⚠️ Changes are temporary! Edit products.json manually to save.");
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  products = products.filter(p => p.id !== id);
  filteredProducts = [...products];
  renderAdminProducts();
}
async function loadProducts() {
  try {
    const res = await fetch('products.json');
    products = await res.json();
    filteredProducts = [...products];

    if (document.getElementById('shopContainer')) {
      renderShop();
      renderCategories();
    }

    if (document.getElementById('cartContainer')) {
      renderCart();
    }

    // ─── INSERT CALL HERE ───
    if (document.getElementById('wishlistContainer')) {
      renderWishlist();
    }
    // ─────────────────────────

    updateCartCount();
  } catch (err) {
    console.error("Error loading products:", err);
  }
}
function renderWishlist() {
  console.log("Rendering wishlist...");

  const container = document.getElementById('wishlistContainer');
  if (!container) {
    console.warn("wishlistContainer not found");
    return;
  }

  const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
  console.log("Wishlist IDs:", wishlistIds);

  const items = products.filter(p => wishlistIds.includes(p.id));
  console.log("Wishlist Products:", items);

  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = "<p>No items in your wishlist 💔</p>";
    return;
  }

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price.toLocaleString()}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <button onclick="toggleWishlist(${product.id}); renderWishlist()">Remove 💔</button>
    `;
    container.appendChild(card);
  });
}



  




// ───── Render Wishlist ─────


function renderShop() {
  const container = document.getElementById('shopContainer');
  container.innerHTML = '';

  if (filteredProducts.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';

    // 🔽 PLACE THE FOLLOWING CODE HERE:
    const isInWishlist = wishlist.includes(product.id);
    const heart = isInWishlist ? "❤️" : "🤍";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price.toLocaleString()}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>

    
      <button onclick="toggleWishlist(${product.id})">${heart}</button>
    `;

    container.appendChild(card);
  });
}





// Render Category Tabs
function renderCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  const tabContainer = document.getElementById('categoryTabs');
  tabContainer.innerHTML = `<button onclick="filterByCategory('all')">All</button>`;
  categories.forEach(cat => {
    tabContainer.innerHTML += `<button onclick="filterByCategory('${cat}')">${cat}</button>`;
  });
}


// Filter by Category
function filterByCategory(category) {
  if (category === 'all') {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(p => p.category === category);
  }
  renderShop();
}


function toggleWishlist(id) {
  const exists = wishlist.includes(id);
  if (exists) {
    wishlist = wishlist.filter(pid => pid !== id);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderShop(); // Refresh cards after toggle
}
function sortByPrice(order) {
  if (order === 'asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (order === 'desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  renderShop(); // Re-render the shop with sorted products
}



// Search Function
function searchProducts(term) {
  const value = term.toLowerCase();
  filteredProducts = products.filter(p => p.name.toLowerCase().includes(value));
  renderShop();
}

// Cart Functions
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart!");
}

function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    countSpan.innerText = count;
  }
}

// Render Cart Page
function renderCart() {
  const container = document.getElementById('cartContainer');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        Price: $${item.price} x ${item.qty}
      </div>
      <div>
        <button onclick="updateQty(${item.id}, -1)">-</button>
        <button onclick="updateQty(${item.id}, 1)">+</button>
        <button onclick="removeItem(${item.id})">Remove</button>
      </div>
    `;
    container.appendChild(row);
  });

  const totalRow = document.createElement('div');
  totalRow.style = 'text-align:right; padding:10px; font-weight:bold;';
  totalRow.innerText = `Total: $${total.toFixed(2)}`;
  container.appendChild(totalRow);
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Load products on page ready
document.addEventListener('DOMContentLoaded', loadProducts);

  




  




 /* ───────────────  REVIEWS PAGE ONLY  ─────────────── */
function initReviewsPage() {
  // Star selection
  let selectedRating = 0;
  document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", () => {
      selectedRating = +star.dataset.value;
      document
        .querySelectorAll(".star")
        .forEach((s, i) => s.classList.toggle("selected", i < selectedRating));
    });
  });

  // Load existing reviews
  loadReviews();

  // Make submitReview globally available for the onclick in HTML
  window.submitReview = () => {
    const name = document.getElementById("reviewName").value.trim();
    const text = document.getElementById("reviewText").value.trim();

    if (!name || !text || selectedRating === 0) {
      alert("Please fill out all fields and choose a rating.");
      return;
    }

    const reviewObj = { name, text, rating: selectedRating };

    // 1️⃣ save
    const allReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    allReviews.push(reviewObj);
    localStorage.setItem("reviews", JSON.stringify(allReviews));

    // 2️⃣ render
    addReviewToDOM(reviewObj);

    // 3️⃣ reset form
    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";
    selectedRating = 0;
    document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));

    // 4️⃣ toast
    showThankYou();
  };

  /* helper – load all on page start */
  function loadReviews() {
    JSON.parse(localStorage.getItem("reviews") || "[]").forEach(addReviewToDOM);
  }

  /* helper – add one card to #reviewList */
  function addReviewToDOM({ name, text, rating }) {
    document.getElementById("reviewList").insertAdjacentHTML(
      "beforeend",
      `<div class="review-item">
         <strong>${name}</strong>
         <div class="star-display">${"★".repeat(rating)}</div>
         <p>${text}</p>
       </div>`
    );
  }

  /* helper – green toast */
  function showThankYou() {
    const toast = document.createElement("div");
    toast.className = "thank-you";
    toast.textContent = "✅  Thank you for your feedback!";
    document.querySelector(".rating-form").appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
}

/* ───────────  Initialise correct page  ─────────── */
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();               // your existing e‑commerce logic

  if (document.getElementById("reviewList")) {
    initReviewsPage();          // only on review.html
  }
});





function startMidnightCountdown() {
  const timerText = document.getElementById("timerText");
  const flashBox = document.getElementById("flashTimer");

  if (!timerText || !flashBox) return;

  function updateCountdown() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);  // Today 11:59:59 PM

    const diff = midnight - now;

    if (diff <= 0) {
      timerText.textContent = "⏰ Deal Ended";
      flashBox.classList.add("expired");
      return;
    }

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timerText.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown(); // Initial call
  setInterval(updateCountdown, 1000); // Repeat every second
}

document.addEventListener("DOMContentLoaded", startMidnightCountdown);


//


const orderDatabase = {
  "RUSH123": ["Order Placed", "Packed", "Shipped", "Out for Delivery"],
  "RUSH456": ["Order Placed", "Packed"],
  "RUSH789": ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"]
};

function trackOrder() {
  const input = document.getElementById("orderIdInput").value.trim().toUpperCase();
  const statusContainer = document.getElementById("orderStatusContainer");
  statusContainer.innerHTML = "";

  if (!input || !orderDatabase[input]) {
    statusContainer.innerHTML = `<p class="error">Invalid or Unknown Order ID</p>`;
    return;
  }

  const statuses = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const completedStages = orderDatabase[input];

  const statusHTML = statuses.map((status) => {
    const isActive = completedStages.includes(status);
    return `<div class="status-step ${isActive ? "active" : ""}">${status}</div>`;
  }).join("");

  statusContainer.innerHTML = `<div class="status-bar">${statusHTML}</div>`;
}
function submitReturn(e) {
  e.preventDefault();
  const orderId = document.getElementById("returnOrderId").value.trim();
  const product = document.getElementById("returnProductName").value.trim();
  const reason = document.getElementById("returnReason").value.trim();
  const message = document.getElementById("returnMessage");

  if (orderId && product && reason) {
    message.innerText = "✅ Return request submitted successfully!";
    message.style.color = "#00ffcc";
    document.querySelector("form").reset();
  } else {
    message.innerText = "❌ Please fill in all fields.";
    message.style.color = "red";
  }
}
/***** Product Data (exactly what you gave) *****/
const productList = [
  {
    id: 1,
    name: "iPhone 14",
    price: 79999,
    category: "Mobile",
    image: "images/iPhone14.webp"
  },
  {
    id: 2,
    name: "HP Pavilion Laptop",
    price: 59999,
    category: "Laptop",
    image: "images/hp pavilion.jpg"
  },
  {
    id: 3,
    name: "Sony WH-1000XM4 Headphones",
    price: 15999,
    category: "Headphones",
    image: "images/sony Headphones.jpg"
  },
  {
    id: 4,
    name: "Samsung Galaxy Tab S6",
    price: 49999,
    category: "Tablet",
    image: "images/samsung Galaxy.jpg"
  },
  {
    id: 5,
    name: "Logitech Wireless Mouse",
    price: 999,
    category: "Accessories",
    image: "images/logitech.jpg"
  },
  {
    id: 6,
    name: "Dell XPS Laptop",
    price: 94999,
    category: "Laptop",
    image: "images/dell laptop.jpg"
  },
  {
    id: 7,
    name: "Boat Bluetooth Speaker",
    price: 2999,
    category: "Speakers",
    image: "images/bluetooth speaker.webp"
  },
  {
    id: 8,
    name: "Canon DSLR Camera",
    price: 58999,
    category: "Camera",
    image: "images/camera.png"
  },
  {
    id: 9,
    name: "Realme Smartwatch",
    price: 3499,
    category: "Wearables",
    image: "images/smart watch.jpg"
  }
];

/***** State *****/
let currentCategory = "All";
const container = document.getElementById("shopContainer");

/***** Render Product Cards *****/
function renderGrid(products) {
  container.innerHTML = products.length
    ? products.map(p => `
        <div class="card">
          <img src="${p.image}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p class="price">₹${p.price.toLocaleString()}</p>
          <button onclick="addToCart('${p.name}')">Add to Cart</button>
        </div>
      `).join("")
    : `<p style="grid-column: 1/-1; color: #ccc; padding: 40px;">No products found.</p>`;
}

/***** Filter by Category *****/
function filterByCategory(category) {
  currentCategory = category;
  applyFilters();
}

/***** Live Search Filtering *****/
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestionsBox");

searchInput.addEventListener("input", () => {
  showSuggestions();
  applyFilters();
});

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = productList.filter(p => {
    const matchesText = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const matchesCategory = currentCategory === "All" || p.category === currentCategory;
    return matchesText && matchesCategory;
  });

  renderGrid(filtered);
}

/***** Show Suggestions Below Search *****/
function showSuggestions() {
  const query = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";
  if (!query) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = productList.filter(p =>
    p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );

  (matches.length ? matches : [{ name: "No matches found" }]).forEach(p => {
    const div = document.createElement("div");
    div.innerText = p.name;
    div.onclick = () => {
      searchInput.value = p.name;
      suggestionsBox.style.display = "none";
      applyFilters();
    };
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
}

/***** Initial Display *****/
renderGrid(productList);




form.innerHTML = `
  <div class="thank-you" id="thankMessage">
    ✅ Thank you for your order, <strong>${orderData.name}</strong>!<br/>
    📦 Order ID: <strong>${orderData.id}</strong><br/>
    🕒 Redirecting to homepage...
  </div>
`;

setTimeout(() => {
  const thankMsg = document.getElementById("thankMessage");
  if (thankMsg) thankMsg.style.display = "none";
}, 2000); // Hide in 2 seconds

setTimeout(() => {
  window.location.href = "index.html";
}, 3000); // Redirect in 3 seconds
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.querySelector("input[placeholder='Your name']").value;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const order = {
    id: "ORD" + Date.now(),
    name,
    total,
    date: new Date().toLocaleString(),
    items: cart,
    status: "Placed"
  };

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart"); // clear cart

  document.querySelector(".thank-you").innerHTML = `
    ✅ Thank you, <strong>${name}</strong>!<br/>
    📦 Order ID: <strong>${order.id}</strong><br/>
    🕒 Redirecting to homepage...`;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
});





     









// Load products on page ready
document.addEventListener('DOMContentLoaded', loadProducts);

  


