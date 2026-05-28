// K-Digital Store Configuration & Logic
const MERCHANT_PHONE = "237655080150"; // Updated WhatsApp number for ETS Mr K

// 9 Premium Digital Products List
const products = [
    {
        id: "office365-onedrive-lifetime",
        name: "Office 365 Pro Plus + OneDrive 5TB (Lifetime)",
        category: "productivity",
        image: "assets/office365_onedrive_banner.png",
        description: "Stockage cloud sécurisé à vie. Dites adieu aux abonnements mensuels. Espace privé de 5 To accessible sur tous vos appareils(jusqu'a 5).",
        features: [
            "5 To (5000 Go) de stockage",
            "Accès à vie sans frais mensuels",
            "Compatible PC, Mac, Android, iOS",
            "Partage sécurisé de fichiers",
            "Templates et formation complete en microsoft office"
        ],
        price: 8500
    },
    {
        id: "gemini-pro",
        name: "Google Gemini 3.1 Pro (18 Mois)",
        category: "ai",
        image: "assets/gemini_banner.png",
        description: "Accédez au modèle d'IA le plus puissant de Google. Analyse avancée de code, de textes volumineux et raisonnement logique. Generation dimages et de video. 5 To de stockage inclus.",
        features: [
            "Accès au modèle Gemini Pro",
            "Acces a Antigravity (le claude code/codex Google)",
            "10$ de credit mensuel API Google AIStudio",
            "1000 token de AI credit si tu epuise tes tokens",
            "Credit mensuel d'apprentissage et de certification Google",
            "Fenêtre contextuelle géante (Gemini 1.5/2)",
            "Génération de code, d'images et video avancée",
            "Intégration de gemini a lecosystem Google",
            "Formation complète en IA (prompting, creation sites/app, autom.)",
            "Formation Veo 3"
        ],
        price: 25000
    },
    {
        id: "chatgpt-plus",
        name: "ChatGPT Plus (1 An)",
        category: "ai",
        image: "assets/chatgpt_banner.png",
        description: "La meilleure IA generaliste. Profitez de l'accès prioritaire au futurs modèles GPT-5, aux outils de création de GPTs personnalisés et au mode voix avancé.",
        features: [
            "Priorité d'accès aux nouveaux modèles (GPT-5, GPT-4o)",
            "Acces a codex (le claude code/codex de chez open ai)",
            "Génération de code et d'images et video avancée",
            "Création et utilisation des GPTs",
            "Mode voix avancé hyper-réaliste",
            "Plus de limites de messages",
            "Formation complète en IA (prompting, creation sites/app, autom.)"
        ],
        price: 55000
    },
    {
        id: "biblical-cartoons",
        name: "500 Dessins Animés Bibliques",
        category: "entertainment",
        image: "assets/bible_cartoons_banner.png",
        description: "Découvrez 500 dessins animés bibliques complets pour enfants. Un contenu éducatif de qualité pour transmettre les valeurs chrétiennes de façon ludique.",
        features: [
            "500 épisodes complets en HD",
            "Noah's Ark, Moses, David, Jesus and more",
            "Accès illimité et à vie en téléchargement",
            "Idéal pour l'éducation chrétienne et familiale"
        ],
        price: 5500
    },
    {
        id: "canva-lifetime",
        name: "Canva Pro à Vie",
        category: "productivity",
        image: "assets/canva_banner.png",
        description: "Libérez votre potentiel créatif. Profitez de toutes les fonctionnalités professionnelles de Canva sans aucun abonnement récurrent.",
        features: [
            "Accès Canva Pro à vie",
            "Modèles et designs premium illimités",
            "Suppression d'arrière-plan instantanée en 1 clic",
            "Identité visuelle et kits de marque intégrés"
        ],
        price: 15000
    },
    {
        id: "earn-money-pack",
        name: "Pack Formation Gagner sa vie en ligne",
        category: "productivity",
        image: "assets/training_pack_banner.png",
        description: "Le pack ultime regroupant 8 formations clés en business en ligne pour lancer des sources de revenus durables sur internet.",
        features: [
            "Marketing 360°",
            "Trading des indices synthétiques",
            "Art Oratoire",
            "Création des bots whatsapp",
            "Achat en Chine",
            "Machine à Cash",
            "REVENTE PRODUITS DIGITAUX",
            "CRÉATION CONTENU AVEC IA"
        ],
        price: 5000
    },
    {
        id: "crunchyroll-6m",
        name: "Crunchyroll Premium (6 Mois)",
        category: "entertainment",
        image: "assets/crunchyroll_banner.png",
        description: "Regardez vos animés préférés en haute définition (HD) sans aucune publicité. Accès illimité au catalogue complet en simulcast.",
        features: ["Abonnement Mega Fan de 6 Mois", "Pas de publicités", "Lecture hors-ligne (téléchargement)", "Accès immédiat après diffusion au Japon"],
        price: 5000
    },
    {
        id: "idm-1year",
        name: "Internet Download Manager (1 An)",
        category: "utility",
        image: "assets/idm_banner.png",
        description: "Le meilleur accélérateur de téléchargement au monde. Multiplie votre vitesse de téléchargement par 5. Clé d'activation officielle.",
        features: ["Licence officielle d'un an", "Vitesse de téléchargement augmentée de 500%", "Reprise des téléchargements interrompus", "Intégration transparente aux navigateurs"],
        price: 4000
    },
    {
        id: "perplexity-pro",
        name: "Perplexity Pro (1 An)",
        category: "ai",
        image: "assets/perplexity_banner.png",
        description: "Le moteur de recherche IA par excellence. Réponses précises avec citations. Accès à Claude 3.5 Sonnet, GPT-4o et recherche Web en direct.",
        features: ["Recherche Copilot illimitée", "Choix du modèle d'IA (Claude, GPT)", "Upload de documents (PDF, images, etc.)", "Génération d'images et de code"],
        price: 12000
    }
];

// App State Management
let cart = JSON.parse(localStorage.getItem("k_store_cart")) || [];
let activeCategory = "all";
let searchQuery = "";
let selectedPaymentMethod = "momo"; // default
let currentCheckoutPath = "pay"; // "pay" or "contact"
let uploadedProofFile = null;
let redirectUrl = "";

// DOM Elements
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const filterChips = document.querySelectorAll(".chip");
const cartTrigger = document.getElementById("cart-trigger");
const closeCartBtn = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const cartCount = document.getElementById("cart-count");
const emptyCartMsg = document.getElementById("empty-cart-msg");
const cartItemsList = document.getElementById("cart-items-list");
const checkoutFormSection = document.getElementById("checkout-form-section");
const continueShoppingBtn = document.getElementById("continue-shopping");

const summarySubtotal = document.getElementById("summary-subtotal");
const summaryTotal = document.getElementById("summary-total");
const checkoutForm = document.getElementById("checkout-form");
const clientName = document.getElementById("client-name");
const clientWhatsapp = document.getElementById("client-whatsapp");
const clientEmail = document.getElementById("client-email");
const countryCode = document.getElementById("country-code");

const tabPayNow = document.getElementById("tab-pay-now");
const tabContactFirst = document.getElementById("tab-contact-first");
const pathPayNowContent = document.getElementById("path-pay-now-content");
const pathContactFirstContent = document.getElementById("path-contact-first-content");

const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
const paymentInstructionMomo = document.getElementById("instruction-momo");
const paymentInstructionOrange = document.getElementById("instruction-orange");
const momoTotalPlaceholders = document.querySelectorAll(".momo-total-placeholder");
const orangeTotalPlaceholders = document.querySelectorAll(".orange-total-placeholder");

const dropzone = document.getElementById("dropzone");
const proofFileInput = document.getElementById("proof-file");
const dropzonePrompt = document.getElementById("dropzone-prompt");
const dropzonePreview = document.getElementById("dropzone-preview");
const previewImage = document.getElementById("preview-image");
const previewFilename = document.getElementById("preview-filename");
const removeProofBtn = document.getElementById("remove-proof");

const btnSubmitPay = document.getElementById("btn-submit-pay");
const btnSubmitContact = document.getElementById("btn-submit-contact");

const modalOverlay = document.getElementById("modal-overlay");
const instructionModal = document.getElementById("instruction-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const whatsappRedirectBtn = document.getElementById("whatsapp-redirect-btn");
const toast = document.getElementById("toast-notification");
const proofStepInstruction = document.querySelector(".proof-step-instruction");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();
    setupEventListeners();
});

// Event Listeners Configuration
function setupEventListeners() {
    // Search
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
    });

    // Categories
    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            filterChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            activeCategory = chip.dataset.category;
            renderProducts();
        });
    });

    // Drawer triggers
    cartTrigger.addEventListener("click", openDrawer);
    closeCartBtn.addEventListener("click", closeDrawer);
    cartOverlay.addEventListener("click", closeDrawer);
    continueShoppingBtn.addEventListener("click", closeDrawer);

    // Path switching (Pay Now vs Contact Seller)
    tabPayNow.addEventListener("click", () => setCheckoutPath("pay"));
    tabContactFirst.addEventListener("click", () => setCheckoutPath("contact"));

    // Payment methods
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            setPaymentMethod(e.target.value);
        });
    });

    // Custom copy code listener
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("copy-btn")) {
            const textToCopy = e.target.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast("Copié dans le presse-papiers !");
            });
        }
    });

    // File Drag & Drop Handlers
    dropzone.addEventListener("click", () => proofFileInput.click());
    
    proofFileInput.addEventListener("change", (e) => {
        handleFileSelect(e.target.files[0]);
    });

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    removeProofBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid triggering file selection dialog
        clearProofFile();
    });

    // Form Submission
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        processOrder();
    });

    btnSubmitContact.addEventListener("click", () => {
        if (validateContactFields()) {
            processOrderInquiry();
        }
    });

    // Modal controls
    closeModalBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);
    whatsappRedirectBtn.addEventListener("click", () => {
        window.open(redirectUrl, "_blank");
        closeModal();
    });
}

// Render product list dynamically
function renderProducts() {
    productGrid.innerHTML = "";
    
    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === "all" || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products-msg">
                <i class="fa-solid fa-face-frown"></i>
                <p>Aucun produit ne correspond à votre recherche.</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        const featuresHTML = p.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join("");

        card.innerHTML = `
            <div class="product-card-header">
                <span class="category-badge">${p.category.toUpperCase()}</span>
                <img src="${p.image}" alt="${p.name}" class="product-banner-img">
                <div class="product-header-overlay">
                    <span class="overlay-price">${formatCFA(p.price)}</span>
                    <div class="overlay-right-info">
                        <div class="overlay-payment-icons">
                            <i class="fa-solid fa-mobile-screen-button" title="Mobile Money (MoMo/Orange)"></i>
                            <i class="fa-solid fa-credit-card" title="Carte Bancaire (Visa/Mastercard)"></i>
                        </div>
                        <div class="overlay-contact">
                            <i class="fa-brands fa-whatsapp"></i> +237 655080150
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-card-body">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-description">${p.description}</p>
                <ul class="product-features">
                    ${featuresHTML}
                </ul>
                <div class="product-card-footer">
                    <div class="price-container">
                        <span class="price-label">Prix</span>
                        <span class="product-price">${formatCFA(p.price)}</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${p.id}')">
                        <i class="fa-solid fa-cart-plus"></i> Ajouter
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Cart State Controllers
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} ajouté au panier !`);
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem("k_store_cart", JSON.stringify(cart));
}

// UI State Updates
function updateCartUI() {
    // Cart Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";

    if (cart.length === 0) {
        emptyCartMsg.style.display = "flex";
        cartItemsList.style.display = "none";
        checkoutFormSection.style.display = "none";
    } else {
        emptyCartMsg.style.display = "none";
        cartItemsList.style.display = "block";
        checkoutFormSection.style.display = "block";

        // Render Cart Items
        cartItemsList.innerHTML = "";
        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatCFA(item.price)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button type="button" class="quantity-btn" onclick="updateQuantity('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                    <span class="quantity-num">${item.quantity}</span>
                    <button type="button" class="quantity-btn" onclick="updateQuantity('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button type="button" class="remove-item-btn" onclick="removeFromCart('${item.id}')" aria-label="Supprimer"><i class="fa-solid fa-trash-can"></i></button>
            `;
            cartItemsList.appendChild(itemElement);
        });

        // Summary Calculations
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const formattedTotal = formatCFA(total);
        
        summarySubtotal.innerText = formattedTotal;
        summaryTotal.innerText = formattedTotal;

        // Update Dial instructions placeholders
        momoTotalPlaceholders.forEach(el => el.innerText = formattedTotal);
        orangeTotalPlaceholders.forEach(el => el.innerText = formattedTotal);
    }
}

// Format currency in CFA
function formatCFA(value) {
    return new Intl.NumberFormat('fr-FR').format(value) + " FCFA";
}

// Drawer Visibility Helpers
function openDrawer() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // disable scroll
}

function closeDrawer() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

// Toast notification trigger
function showToast(message) {
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Toggle checkout tab path (Direct pay vs chat first)
function setCheckoutPath(path) {
    currentCheckoutPath = path;
    
    if (path === "pay") {
        tabPayNow.classList.add("active");
        tabContactFirst.classList.remove("active");
        pathPayNowContent.style.display = "block";
        pathContactFirstContent.style.display = "none";
        
        // Make proof file required again
        proofFileInput.required = true;
    } else {
        tabPayNow.classList.remove("active");
        tabContactFirst.classList.add("active");
        pathPayNowContent.style.display = "none";
        pathContactFirstContent.style.display = "block";
        
        // Disable required inputs for payment path
        proofFileInput.required = false;
    }
}

// Handle payment option toggle
function setPaymentMethod(method) {
    selectedPaymentMethod = method;
    const cards = document.querySelectorAll(".payment-card-option");
    
    cards.forEach(card => {
        const input = card.querySelector('input');
        if (input.value === method) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });

    if (method === "momo") {
        paymentInstructionMomo.style.display = "block";
        paymentInstructionOrange.style.display = "none";
    } else {
        paymentInstructionMomo.style.display = "none";
        paymentInstructionOrange.style.display = "block";
    }
}

// Upload handlers
function handleFileSelect(file) {
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
        showToast("L'image est trop volumineuse (Max 5Mo)");
        return;
    }

    uploadedProofFile = file;
    previewFilename.innerText = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        dropzonePrompt.style.display = "none";
        dropzonePreview.style.display = "flex";
        proofFileInput.required = false; // satisfied
    };
    reader.readAsDataURL(file);
}

function clearProofFile() {
    uploadedProofFile = null;
    proofFileInput.value = "";
    previewImage.src = "";
    previewFilename.innerText = "";
    dropzonePrompt.style.display = "flex";
    dropzonePreview.style.display = "none";
    
    if (currentCheckoutPath === "pay") {
        proofFileInput.required = true;
    }
}

// Validate Contact Input Fields manually for "Contact First" path
function validateContactFields() {
    if (!clientName.value.trim()) {
        showToast("Veuillez saisir votre nom.");
        clientName.focus();
        return false;
    }
    if (!clientWhatsapp.value.trim()) {
        showToast("Veuillez saisir votre numéro WhatsApp.");
        clientWhatsapp.focus();
        return false;
    }
    return true;
}

// Compile order text and handle submission
function processOrder() {
    if (currentCheckoutPath === "pay" && !uploadedProofFile) {
        showToast("Veuillez importer votre capture d'écran de paiement.");
        return;
    }

    const name = clientName.value.trim();
    const phone = countryCode.value + " " + clientWhatsapp.value.trim();
    const email = clientEmail.value.trim();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const itemsText = cart.map(item => `- ${item.quantity}x ${item.name} (${formatCFA(item.price * item.quantity)})`).join("\n");

    const paymentLabel = selectedPaymentMethod === "momo" 
        ? "MTN MoMo (Darius Valere)" 
        : "Orange Money (ETS Mr K)";

    const message = `🛍️ *Nouvelle Commande - K-Digital Store*
------------------------------------
👤 *Client:* ${name}
📞 *WhatsApp:* ${phone}
📧 *Email:* ${email}
💰 *Mode de paiement:* ${paymentLabel}
📸 *Preuve de paiement:* [Screenshot importé. Pièce jointe dans la discussion.]

🛒 *Articles:*
${itemsText}

💵 *Total:* ${formatCFA(total)}
------------------------------------
Veuillez me fournir mes accès/codes d'activation. Merci !`;

    redirectUrl = `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`;
    
    // Show proof step description in instructions modal
    proofStepInstruction.style.display = "flex";
    
    openModal();
}

// Compile inquiry text and redirect
function processOrderInquiry() {
    const name = clientName.value.trim();
    const phone = countryCode.value + " " + clientWhatsapp.value.trim();
    const itemsText = cart.map(item => `- ${item.quantity}x ${item.name}`).join("\n");

    const message = `👋 *Demande d'information - K-Digital Store*
------------------------------------
👤 *Client:* ${name}
📞 *WhatsApp:* ${phone}

🛒 *Articles d'intérêt:*
${itemsText}

💬 *Message:* Bonjour, je souhaite en savoir plus sur ces produits et finaliser mon achat avec vous directement.`;

    redirectUrl = `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`;
    
    // Hide proof step instruction in the instructions modal
    proofStepInstruction.style.display = "none";
    
    openModal();
}

// Modal handling logic
function openModal() {
    instructionModal.classList.add("active");
    modalOverlay.classList.add("active");
}

function closeModal() {
    instructionModal.classList.remove("active");
    modalOverlay.classList.remove("active");
    
    // Empty the cart after successful order initialization
    cart = [];
    saveCart();
    updateCartUI();
    closeDrawer();
}
