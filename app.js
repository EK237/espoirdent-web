/**
 * EspoirDent - Interactive Website Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Navigation Menu Mobile & Scroll-Aware Header
    // ----------------------------------------------------
    const header = document.querySelector('.app-header');
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');
    let lastScrollY = window.scrollY;

    // Hamburger Toggle
    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // Scroll-aware Hide/Show Header
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Class toggling for scrolled state
        if (currentScrollY > 20) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('header-hidden');
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('open')) {
                burgerMenu.classList.remove('open');
                navMenu.classList.remove('open');
            }
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    });

    // ----------------------------------------------------
    // 2. Scroll Reveal Animations & Number Counters
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    const statsSection = document.querySelector('.stats-section');
    let countersAnimated = false;

    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.85;

        // General slide fade-in
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });

        // Number Counters
        if (statsSection) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < triggerBottom && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
            }
        }
    };

    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // ms
            const stepTime = 30; // ms
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target.toLocaleString();
                    if (counter.classList.contains('plus')) counter.innerText += '+';
                    if (counter.classList.contains('percent')) counter.innerText += '%';
                } else {
                    counter.innerText = Math.floor(current).toLocaleString();
                    if (counter.classList.contains('plus')) counter.innerText += '+';
                    if (counter.classList.contains('percent')) counter.innerText += '%';
                    setTimeout(updateCounter, stepTime);
                }
            };

            updateCounter();
        });
    };

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Initial check on load

    // ----------------------------------------------------
    // 3. FAQ Accordion (Accueil)
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all others
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                }
            });
        }
    });

    // ----------------------------------------------------
    // 4. Case Studies Filters (Page : Études de Cas)
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.chip');
    const caseCards = document.querySelectorAll('.case-card');

    if (filterButtons.length > 0 && caseCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set active class
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.getAttribute('data-category');

                caseCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                        // Add fade-in effect
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----------------------------------------------------
    // 5. B2B Contact / Devis Form & File Upload
    // ----------------------------------------------------
    const contactForm = document.getElementById('devis-form');
    const fileDropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('stl-file');
    const dropzonePrompt = document.getElementById('dropzone-prompt');
    const dropzonePreview = document.getElementById('dropzone-preview');
    const previewFilename = document.getElementById('preview-filename');
    const removeFileBtn = document.getElementById('remove-file');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    let selectedFile = null;

    // Load LocalStorage prefilled dentist info
    if (contactForm) {
        const savedName = localStorage.getItem('espoirdent_name');
        const savedPhone = localStorage.getItem('espoirdent_phone');
        const savedEmail = localStorage.getItem('espoirdent_email');
        const savedCity = localStorage.getItem('espoirdent_city');
        const savedScanner = localStorage.getItem('espoirdent_scanner');

        if (savedName) document.getElementById('doctor-name').value = savedName;
        if (savedPhone) document.getElementById('doctor-phone').value = savedPhone;
        if (savedEmail) document.getElementById('doctor-email').value = savedEmail;
        if (savedCity) document.getElementById('doctor-city').value = savedCity;
        if (savedScanner) document.getElementById('doctor-scanner').value = savedScanner;
    }

    // Trigger file select click
    if (fileDropzone && fileInput) {
        fileDropzone.addEventListener('click', (e) => {
            if (e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
                fileInput.click();
            }
        });

        // Drag & Drop event bindings
        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                fileDropzone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                fileDropzone.classList.remove('dragover');
            }, false);
        });

        // Handle file drop
        fileDropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        // Handle file click select
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleFileSelect(fileInput.files[0]);
            }
        });

        // Remove selected file
        removeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedFile = null;
            fileInput.value = '';
            dropzonePreview.style.display = 'none';
            dropzonePrompt.style.display = 'flex';
        });
    }

    const handleFileSelect = (file) => {
        // Validate file extensions
        const validExtensions = ['.stl', '.ply', '.obj', '.zip', '.pdf', '.rar'];
        const fileName = file.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext));

        if (!isValid) {
            alert('Format de fichier invalide. Veuillez sélectionner un fichier STL, PLY, OBJ, PDF ou ZIP.');
            return;
        }

        // Limit size (50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('Le fichier est trop volumineux. La taille maximale autorisée est de 50 Mo.');
            return;
        }

        selectedFile = file;
        previewFilename.innerText = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} Mo)`;
        dropzonePrompt.style.display = 'none';
        dropzonePreview.style.display = 'flex';
    };

    // Handle Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form fields
            const name = document.getElementById('doctor-name').value;
            const phone = document.getElementById('doctor-phone').value;
            const email = document.getElementById('doctor-email').value;
            const city = document.getElementById('doctor-city').value;
            const scanner = document.getElementById('doctor-scanner').value;
            const requestType = document.getElementById('request-type').value;
            const message = document.getElementById('doctor-message').value;
            const fileName = selectedFile ? selectedFile.name : 'Aucun fichier joint';

            // Store info in LocalStorage to prefill next time
            localStorage.setItem('espoirdent_name', name);
            localStorage.setItem('espoirdent_phone', phone);
            localStorage.setItem('espoirdent_email', email);
            localStorage.setItem('espoirdent_city', city);
            localStorage.setItem('espoirdent_scanner', scanner);

            // Simulation of uploading
            if (progressBarContainer && progressBar) {
                progressBarContainer.style.display = 'block';
                progressBar.style.width = '0%';
                
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 100) {
                        clearInterval(interval);
                        saveLeadAndRedirect();
                    } else {
                        width += 10;
                        progressBar.style.width = width + '%';
                    }
                }, 150);
            } else {
                saveLeadAndRedirect();
            }

            function saveLeadAndRedirect() {
                // Save leads in LocalStorage database for admin view
                const leads = JSON.parse(localStorage.getItem('espoirdent_leads') || '[]');
                const newLead = {
                    id: Date.now(),
                    name,
                    phone,
                    email,
                    city,
                    scanner,
                    requestType,
                    message,
                    fileName,
                    date: new Date().toLocaleString('fr-FR'),
                    status: 'new'
                };
                leads.push(newLead);
                localStorage.setItem('espoirdent_leads', JSON.stringify(leads));

                // Clean file display
                if (progressBarContainer) progressBarContainer.style.display = 'none';
                selectedFile = null;
                if (fileInput) fileInput.value = '';
                if (dropzonePreview) dropzonePreview.style.display = 'none';
                if (dropzonePrompt) dropzonePrompt.style.display = 'flex';
                contactForm.reset();

                alert('Votre demande a bien été enregistrée localement ! Vous allez maintenant être redirigé vers WhatsApp pour finaliser le contact avec notre équipe technique.');

                // WhatsApp redirection string
                const messageText = `Bonjour EspoirDent! Je suis le praticien ${name} de la clinique (${city}). Je viens de soumettre une demande sur le site:\n\n` +
                                    `- Type : ${requestType}\n` +
                                    `- Fichier : ${fileName}\n` +
                                    `- Équipement : ${scanner}\n` +
                                    `- Message : ${message}\n\n` +
                                    `Pouvez-vous valider et me recontacter ? Merci.`;

                const encodedText = encodeURIComponent(messageText);
                const whatsappUrl = `https://wa.me/237655080150?text=${encodedText}`;
                
                window.open(whatsappUrl, '_blank');
            }
        });
    }

    // ----------------------------------------------------
    // 6. Admin Panel Dashboard (Page : admin.html)
    // ----------------------------------------------------
    const adminTableBody = document.getElementById('admin-table-body');
    const emptyAdminMsg = document.getElementById('admin-empty-msg');
    const totalLeadsCount = document.getElementById('total-leads-count');
    const activeLeadsCount = document.getElementById('active-leads-count');
    const resetLeadsBtn = document.getElementById('reset-leads-btn');

    // Admin Tabs
    const tabLeads = document.getElementById('admin-tab-leads');
    const tabOrders = document.getElementById('admin-tab-orders');
    const countLeadsTab = document.getElementById('count-leads-tab');
    const countOrdersTab = document.getElementById('count-orders-tab');
    const adminTableThead = document.getElementById('admin-table-thead');

    // Admin Details Modal Elements
    const adminModal = document.getElementById('admin-modal');
    const adminModalOverlay = document.getElementById('admin-modal-overlay');
    const closeModalBtn = document.getElementById('close-admin-modal');

    let activeAdminTab = "leads"; // "leads" or "orders"

    const updateAdminTabCounts = () => {
        const leads = JSON.parse(localStorage.getItem('espoirdent_leads') || '[]');
        const orders = JSON.parse(localStorage.getItem('espoirdent_orders') || '[]');
        if (countLeadsTab) countLeadsTab.innerText = leads.length;
        if (countOrdersTab) countOrdersTab.innerText = orders.length;

        // Update top widgets stats
        if (totalLeadsCount) totalLeadsCount.innerText = leads.length + orders.length;
        if (activeLeadsCount) {
            const activeLeads = leads.filter(l => l.status === 'new').length;
            const activeOrders = orders.filter(o => o.status === 'new').length;
            activeLeadsCount.innerText = activeLeads + activeOrders;
        }
    };

    const renderAdminDashboard = () => {
        if (!adminTableBody) return;

        updateAdminTabCounts();

        adminTableBody.innerHTML = '';

        if (activeAdminTab === "leads") {
            // Render Leads
            const leads = JSON.parse(localStorage.getItem('espoirdent_leads') || '[]');
            
            // Set Table Head
            if (adminTableThead) {
                adminTableThead.innerHTML = `
                    <tr>
                        <th>Date de soumission</th>
                        <th>Praticien / Clinique</th>
                        <th>Ville</th>
                        <th>Objet</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                `;
            }

            if (leads.length === 0) {
                if (emptyAdminMsg) emptyAdminMsg.style.display = 'block';
                return;
            }
            if (emptyAdminMsg) emptyAdminMsg.style.display = 'none';

            // Render Rows
            [...leads].reverse().forEach(lead => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${lead.date}</td>
                    <td><strong>Dr. ${lead.name}</strong><br><small>${lead.email}</small></td>
                    <td>${lead.city}</td>
                    <td><small>${lead.requestType}</small></td>
                    <td><span class="badge-status ${lead.status}">${lead.status === 'new' ? 'Nouveau' : 'Traité'}</span></td>
                    <td>
                        <div class="admin-actions-cell">
                            <button class="admin-btn admin-btn-view" data-id="${lead.id}">Détails</button>
                            <button class="admin-btn admin-btn-delete" style="background-color: transparent; border: 1px solid #ef4444; color: #ef4444;" data-id="${lead.id}">Supprimer</button>
                        </div>
                    </td>
                `;
                adminTableBody.appendChild(tr);
            });

        } else {
            // Render Orders
            const orders = JSON.parse(localStorage.getItem('espoirdent_orders') || '[]');
            
            // Set Table Head
            if (adminTableThead) {
                adminTableThead.innerHTML = `
                    <tr>
                        <th>Date de commande</th>
                        <th>Clinique / Praticien</th>
                        <th>Ville</th>
                        <th>Total</th>
                        <th>Paiement</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                `;
            }

            if (orders.length === 0) {
                if (emptyAdminMsg) emptyAdminMsg.style.display = 'block';
                return;
            }
            if (emptyAdminMsg) emptyAdminMsg.style.display = 'none';

            // Render Rows
            [...orders].reverse().forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order.date}</td>
                    <td><strong>${order.name}</strong><br><small>${order.email}</small></td>
                    <td>${order.city}</td>
                    <td style="font-weight: 700; color: var(--accent-gold);">${order.total.toLocaleString()} FCFA</td>
                    <td><small>${order.paymentMethod}</small></td>
                    <td><span class="badge-status ${order.status}">${order.status === 'new' ? 'Nouveau' : 'Traité'}</span></td>
                    <td>
                        <div class="admin-actions-cell">
                            <button class="admin-btn admin-btn-view" data-id="${order.id}">Détails</button>
                            <button class="admin-btn admin-btn-delete" style="background-color: transparent; border: 1px solid #ef4444; color: #ef4444;" data-id="${order.id}">Supprimer</button>
                        </div>
                    </td>
                `;
                adminTableBody.appendChild(tr);
            });
        }

        bindAdminActions();
    };

    const bindAdminActions = () => {
        // View Details
        document.querySelectorAll('.admin-btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.getAttribute('data-id'), 10);
                showItemDetails(itemId);
            });
        });

        // Delete
        document.querySelectorAll('.admin-btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.getAttribute('data-id'), 10);
                const dbName = activeAdminTab === "leads" ? 'espoirdent_leads' : 'espoirdent_orders';
                const confirmMsg = activeAdminTab === "leads" 
                    ? 'Voulez-vous vraiment supprimer cette demande de devis ?' 
                    : 'Voulez-vous vraiment supprimer cette commande express ?';

                if (confirm(confirmMsg)) {
                    let items = JSON.parse(localStorage.getItem(dbName) || '[]');
                    items = items.filter(item => item.id !== itemId);
                    localStorage.setItem(dbName, JSON.stringify(items));
                    renderAdminDashboard();
                }
            });
        });
    };

    const showItemDetails = (itemId) => {
        const dbName = activeAdminTab === "leads" ? 'espoirdent_leads' : 'espoirdent_orders';
        const items = JSON.parse(localStorage.getItem(dbName) || '[]');
        const item = items.find(i => i.id === itemId);

        if (!item) return;

        // Populate common fields
        document.getElementById('modal-lead-date').innerText = item.date;
        document.getElementById('modal-lead-name').innerText = item.name;
        document.getElementById('modal-lead-phone').innerText = item.phone;
        document.getElementById('modal-lead-email').innerText = item.email;
        document.getElementById('modal-lead-city').innerText = item.city;
        document.getElementById('modal-lead-scanner').innerText = item.scanner;

        const typeContainer = document.getElementById('modal-lead-type-container');
        const fileLabel = document.getElementById('modal-lead-file');
        const orderSpecifics = document.getElementById('modal-order-specifics');
        const msgContainer = document.getElementById('modal-lead-msg-container');

        if (activeAdminTab === "leads") {
            // Show lead specifics
            if (typeContainer) typeContainer.style.display = 'block';
            document.getElementById('modal-lead-type').innerText = item.requestType;
            fileLabel.innerText = item.fileName || 'Aucun fichier joint';
            if (orderSpecifics) orderSpecifics.style.display = 'none';
            if (msgContainer) {
                msgContainer.style.display = 'block';
                document.getElementById('modal-lead-msg').innerText = item.message || 'Aucun message particulier.';
            }
        } else {
            // Show order specifics
            if (typeContainer) typeContainer.style.display = 'none';
            fileLabel.innerText = item.fileNameSTL || 'Aucun fichier STL';
            if (msgContainer) msgContainer.style.display = 'none';

            if (orderSpecifics) {
                orderSpecifics.style.display = 'block';
                document.getElementById('modal-order-total').innerText = `${item.total.toLocaleString()} FCFA`;
                document.getElementById('modal-order-paymethod').innerText = item.paymentMethod;
                
                const itemsDiv = document.getElementById('modal-order-items');
                if (itemsDiv) {
                    itemsDiv.innerHTML = item.items.map(it => `• ${it.name} (x${it.qty}) - ${(it.price * it.qty).toLocaleString()} FCFA`).join('<br>');
                }
                
                const proofSpan = document.getElementById('modal-order-proof');
                if (proofSpan) {
                    proofSpan.innerText = item.fileNameProof || 'N/A';
                }
            }
        }

        // Toggle status button in modal
        const toggleStatusBtn = document.getElementById('modal-toggle-status');
        if (toggleStatusBtn) {
            toggleStatusBtn.innerText = item.status === 'new' ? 'Marquer comme traité' : 'Marquer comme nouveau';
            toggleStatusBtn.onclick = () => {
                const db = JSON.parse(localStorage.getItem(dbName) || '[]');
                const idx = db.findIndex(i => i.id === itemId);
                if (idx !== -1) {
                    db[idx].status = db[idx].status === 'new' ? 'processed' : 'new';
                    localStorage.setItem(dbName, JSON.stringify(db));
                }
                closeModal();
                renderAdminDashboard();
            };
        }

        // Open modal
        if (adminModal && adminModalOverlay) {
            adminModal.classList.add('open');
            adminModalOverlay.classList.add('open');
        }
    };

    const closeModal = () => {
        if (adminModal && adminModalOverlay) {
            adminModal.classList.remove('open');
            adminModalOverlay.classList.remove('open');
        }
    };

    // Close buttons for modal
    if (closeModalBtn && adminModalOverlay) {
        closeModalBtn.addEventListener('click', closeModal);
        adminModalOverlay.addEventListener('click', closeModal);
    }

    // Reset local database
    if (resetLeadsBtn) {
        resetLeadsBtn.addEventListener('click', () => {
            const dbName = activeAdminTab === "leads" ? 'espoirdent_leads' : 'espoirdent_orders';
            const confirmMsg = activeAdminTab === "leads"
                ? 'Voulez-vous réinitialiser toutes les demandes de devis locales ?'
                : 'Voulez-vous réinitialiser toutes les commandes express locales ?';

            if (confirm(confirmMsg)) {
                localStorage.removeItem(dbName);
                renderAdminDashboard();
            }
        });
    }

    // Tabs Event Listeners
    if (tabLeads && tabOrders) {
        tabLeads.addEventListener('click', () => {
            activeAdminTab = "leads";
            tabLeads.classList.add('active');
            tabOrders.classList.remove('active');
            tabLeads.style.color = "var(--primary-green)";
            tabLeads.style.borderBottomColor = "var(--accent-gold)";
            tabOrders.style.color = "var(--text-muted)";
            tabOrders.style.borderBottomColor = "transparent";
            renderAdminDashboard();
        });

        tabOrders.addEventListener('click', () => {
            activeAdminTab = "orders";
            tabOrders.classList.add('active');
            tabLeads.classList.remove('active');
            tabOrders.style.color = "var(--primary-green)";
            tabOrders.style.borderBottomColor = "var(--accent-gold)";
            tabLeads.style.color = "var(--text-muted)";
            tabLeads.style.borderBottomColor = "transparent";
            renderAdminDashboard();
        });
    }

    // Initialize Admin dashboard
    renderAdminDashboard();

    // ----------------------------------------------------
    // 7. B2B online Shopping Cart Drawer (Take.app WhatsApp funnel)
    // ----------------------------------------------------
    const products = [
        { id: "zircone-ht", name: "Zircone HT", price: 55000 },
        { id: "ips-emax", name: "IPS e.max", price: 70000 },
        { id: "pmma", name: "PMMA", price: 20000 },
        { id: "guide-3d", name: "Guide 3D", price: 45000 },
        { id: "aligneur", name: "Aligneur", price: 35000 },
        { id: "stellite", name: "Stellite", price: 75000 }
    ];

    let cart = JSON.parse(localStorage.getItem('espoirdent_cart')) || [];
    let selectedPaymentMethod = "momo"; // default
    let currentCheckoutPath = "pay"; // "pay" or "contact"
    let uploadedSTLFile = null;
    let uploadedProofFile = null;

    const cartTrigger = document.getElementById('cart-trigger');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const checkoutFormSection = document.getElementById('checkout-form-section');

    const toggleCartDrawer = () => {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.toggle('open');
            cartOverlay.classList.toggle('open');
        }
    };

    if (cartTrigger) cartTrigger.addEventListener('click', toggleCartDrawer);
    if (closeCart) closeCart.addEventListener('click', toggleCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCartDrawer);

    const continueShopping = document.getElementById('continue-shopping');
    if (continueShopping) continueShopping.addEventListener('click', toggleCartDrawer);

    // Bind addToCart buttons on products grid
    const bindAddToCartButtons = () => {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.getAttribute('data-id');
                addToCart(productId);
            });
        });
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                qty: 1
            });
        }

        saveCart();
        updateCartUI();

        // Auto open drawer
        setTimeout(() => {
            if (cartDrawer && !cartDrawer.classList.contains('open')) {
                toggleCartDrawer();
            }
        }, 150);
    };

    const saveCart = () => {
        localStorage.setItem('espoirdent_cart', JSON.stringify(cart));
    };

    const updateCartUI = () => {
        const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
        const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

        if (cartCount) cartCount.innerText = totalItems;
        
        const subtotalEl = document.getElementById('summary-subtotal');
        const totalEl = document.getElementById('summary-total');
        if (subtotalEl) subtotalEl.innerText = `${subtotal.toLocaleString('fr-FR')} FCFA`;
        if (totalEl) totalEl.innerText = `${subtotal.toLocaleString('fr-FR')} FCFA`;

        // Update MOMO and Orange instructions placeholders
        document.querySelectorAll('.momo-total-placeholder').forEach(el => {
            el.innerText = `${subtotal.toLocaleString('fr-FR')} FCFA`;
        });
        document.querySelectorAll('.orange-total-placeholder').forEach(el => {
            el.innerText = `${subtotal.toLocaleString('fr-FR')} FCFA`;
        });

        if (totalItems === 0) {
            if (emptyCartMsg) emptyCartMsg.style.display = 'flex';
            if (checkoutFormSection) checkoutFormSection.style.display = 'none';
            if (cartItemsList) cartItemsList.style.display = 'none';
        } else {
            if (emptyCartMsg) emptyCartMsg.style.display = 'none';
            if (checkoutFormSection) checkoutFormSection.style.display = 'block';
            if (cartItemsList) {
                cartItemsList.style.display = 'block';
                renderCartItems();
            }
        }
    };

    const renderCartItems = () => {
        if (!cartItemsList) return;
        cartItemsList.innerHTML = '';

        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.padding = '12px 0';
            div.style.borderBottom = '1px solid var(--border-gold)';
            
            div.innerHTML = `
                <div class="cart-item-details" style="display: flex; flex-direction: column; gap: 4px;">
                    <span class="cart-item-title" style="font-weight: 700; font-size: 0.95rem;">${item.name}</span>
                    <span class="cart-item-price" style="font-size: 0.88rem; color: var(--accent-gold); font-weight: 600;">${(item.price * item.qty).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div class="cart-item-actions" style="display: flex; align-items: center; gap: 8px;">
                    <button type="button" class="qty-btn" data-id="${item.id}" data-action="minus">-</button>
                    <span class="cart-item-qty" style="font-size: 0.9rem; font-weight: 600; min-width: 16px; text-align: center;">${item.qty}</span>
                    <button type="button" class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
                    <button type="button" class="remove-item-btn" data-id="${item.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px;"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
            cartItemsList.appendChild(div);
        });

        // Add action listeners to qty buttons
        cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const action = btn.getAttribute('data-action');
                const item = cart.find(i => i.id === id);
                if (item) {
                    if (action === 'plus') {
                        item.qty += 1;
                    } else {
                        item.qty -= 1;
                        if (item.qty <= 0) {
                            cart = cart.filter(i => i.id !== id);
                        }
                    }
                    saveCart();
                    updateCartUI();
                }
            });
        });

        // Add action listeners to remove buttons
        cartItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                cart = cart.filter(i => i.id !== id);
                saveCart();
                updateCartUI();
            });
        });
    };

    // Tab buttons checkout paths
    const tabPayNow = document.getElementById('tab-pay-now');
    const tabContactFirst = document.getElementById('tab-contact-first');
    const pathPayNowContent = document.getElementById('path-pay-now-content');
    const pathContactFirstContent = document.getElementById('path-contact-first-content');

    if (tabPayNow && tabContactFirst) {
        tabPayNow.addEventListener('click', () => {
            tabPayNow.classList.add('active');
            tabContactFirst.classList.remove('active');
            if (pathPayNowContent) pathPayNowContent.style.display = 'block';
            if (pathContactFirstContent) pathContactFirstContent.style.display = 'none';
            currentCheckoutPath = "pay";
        });

        tabContactFirst.addEventListener('click', () => {
            tabPayNow.classList.remove('active');
            tabContactFirst.classList.add('active');
            if (pathPayNowContent) pathPayNowContent.style.display = 'none';
            if (pathContactFirstContent) pathContactFirstContent.style.display = 'block';
            currentCheckoutPath = "contact";
        });
    }

    // Payment methods toggles
    const paymentMethods = document.querySelectorAll('.payment-card-option input[type="radio"]');
    const instructionMomo = document.getElementById('instruction-momo');
    const instructionOrange = document.getElementById('instruction-orange');

    paymentMethods.forEach(radio => {
        radio.addEventListener('change', () => {
            selectedPaymentMethod = radio.value;
            document.querySelectorAll('.payment-card-option').forEach(card => {
                card.classList.remove('selected');
            });
            radio.closest('.payment-card-option').classList.add('selected');

            if (selectedPaymentMethod === 'momo') {
                if (instructionMomo) instructionMomo.style.display = 'block';
                if (instructionOrange) instructionOrange.style.display = 'none';
            } else {
                if (instructionMomo) instructionMomo.style.display = 'none';
                if (instructionOrange) instructionOrange.style.display = 'block';
            }
        });
    });

    // Copy to clipboard helper
    document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
            const num = copyBtn.getAttribute('data-copy');
            navigator.clipboard.writeText(num).then(() => {
                const originalHTML = copyBtn.outerHTML;
                copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                }, 1500);
            });
        }
    });

    // File Drag/Drop inside Cart Drawer (STL scan & Payment Proof)
    const bindCartDropzone = (dropzone, fileInput, promptEl, previewEl, filenameEl, removeBtn, acceptedTypes, onFileSelected) => {
        if (!dropzone || !fileInput) return;

        dropzone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleFile(fileInput.files[0]);
            }
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--accent-gold)';
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'rgba(176, 152, 82, 0.2)';
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'rgba(176, 152, 82, 0.2)';
            if (e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.value = '';
                if (promptEl) promptEl.style.display = 'flex';
                if (previewEl) previewEl.style.display = 'none';
                onFileSelected(null);
            });
        }

        const handleFile = (file) => {
            const fileName = file.name.toLowerCase();
            let isValid = false;

            if (acceptedTypes === 'image/*') {
                isValid = file.type.startsWith('image/');
            } else {
                const exts = acceptedTypes.split(',');
                isValid = exts.some(ext => fileName.endsWith(ext));
            }

            if (!isValid) {
                alert(`Format de fichier invalide. Types acceptés : ${acceptedTypes}`);
                return;
            }

            if (file.size > 50 * 1024 * 1024) {
                alert('Fichier trop volumineux. Limite de 50 Mo.');
                return;
            }

            if (filenameEl) filenameEl.innerText = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} Mo)`;
            if (promptEl) promptEl.style.display = 'none';
            if (previewEl) previewEl.style.display = 'flex';
            onFileSelected(file);
        };
    };

    const cartDropzoneSTL = document.getElementById('cart-dropzone-stl');
    const cartInputSTL = document.getElementById('cart-stl-file');
    const cartPromptSTL = document.getElementById('cart-prompt-stl');
    const cartPreviewSTL = document.getElementById('cart-preview-stl');
    const cartPreviewFilenameSTL = document.getElementById('cart-preview-filename-stl');
    const cartRemoveSTL = document.getElementById('cart-remove-stl');

    bindCartDropzone(cartDropzoneSTL, cartInputSTL, cartPromptSTL, cartPreviewSTL, cartPreviewFilenameSTL, cartRemoveSTL, '.stl,.ply,.obj,.zip', (file) => {
        uploadedSTLFile = file;
    });

    const cartDropzoneProof = document.getElementById('cart-dropzone-proof');
    const cartInputProof = document.getElementById('cart-proof-file');
    const cartPromptProof = document.getElementById('cart-prompt-proof');
    const cartPreviewProof = document.getElementById('cart-preview-proof');
    const cartPreviewFilenameProof = document.getElementById('cart-preview-filename-proof');
    const cartRemoveProof = document.getElementById('cart-remove-proof');

    bindCartDropzone(cartDropzoneProof, cartInputProof, cartPromptProof, cartPreviewProof, cartPreviewFilenameProof, cartRemoveProof, 'image/*', (file) => {
        uploadedProofFile = file;
    });

    // Form Submission for Order
    const cartForm = document.getElementById('cart-checkout-form');
    const cartProgressBarContainer = document.getElementById('cart-progress-bar-container');
    const cartProgressBar = document.getElementById('cart-progress-bar');
    const submitPayBtn = document.getElementById('btn-submit-pay');
    const submitContactBtn = document.getElementById('btn-submit-contact');

    const submitOrder = (isDiscussOnly) => {
        const name = document.getElementById('cart-client-name').value;
        const phone = document.getElementById('cart-client-whatsapp').value;
        const email = document.getElementById('cart-client-email').value;
        const city = document.getElementById('cart-client-city').value;
        const scanner = document.getElementById('cart-client-scanner').value;

        if (!name || !phone || !email || !city || !scanner) {
            alert('Veuillez renseigner tous les champs obligatoires (*).');
            return;
        }

        if (!isDiscussOnly && !uploadedProofFile) {
            alert('Veuillez attacher une capture d\'écran du reçu de transfert pour valider le paiement.');
            return;
        }

        const runSubmission = () => {
            const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
            const itemsListStr = cart.map(i => `- ${i.name} (x${i.qty}) : ${(i.price * i.qty).toLocaleString()} FCFA`).join('\n');
            const fileSTLName = uploadedSTLFile ? uploadedSTLFile.name : 'Aucun scan joint (Empreintes physiques)';
            const fileProofName = uploadedProofFile ? uploadedProofFile.name : 'N/A';

            // Save order in local storage (leads/orders database)
            const orders = JSON.parse(localStorage.getItem('espoirdent_orders') || '[]');
            const newOrder = {
                id: Date.now(),
                name,
                phone,
                email,
                city,
                scanner,
                items: cart,
                total: subtotal,
                paymentMethod: isDiscussOnly ? 'Discussion avant paiement' : selectedPaymentMethod.toUpperCase(),
                fileNameSTL: fileSTLName,
                fileNameProof: fileProofName,
                date: new Date().toLocaleString('fr-FR'),
                status: 'new'
            };
            orders.push(newOrder);
            localStorage.setItem('espoirdent_orders', JSON.stringify(orders));

            // Prefill dentist coordinates for next orders
            localStorage.setItem('espoirdent_name', name);
            localStorage.setItem('espoirdent_phone', phone);
            localStorage.setItem('espoirdent_email', email);
            localStorage.setItem('espoirdent_city', city);
            localStorage.setItem('espoirdent_scanner', scanner);

            // WhatsApp Message Compile
            let message = `🛒 *NOUVELLE COMMANDE - ESPOIRDENT B2B*\n`;
            message += `------------------------------------\n`;
            message += `👤 *Clinique* : ${name}\n`;
            message += `📞 *WhatsApp* : ${phone}\n`;
            message += `✉️ *Email* : ${email}\n`;
            message += `📍 *Ville* : ${city}\n`;
            message += `🔬 *Scanner* : ${scanner}\n\n`;
            message += `📦 *Prothèses Commandées* :\n${itemsListStr}\n\n`;
            message += `📎 *Scan STL* : ${fileSTLName}\n`;
            message += `💵 *Total Commande* : *${subtotal.toLocaleString()} FCFA*\n`;
            
            if (isDiscussOnly) {
                message += `💬 *Mode* : Discuter et valider avant paiement\n`;
            } else {
                message += `💳 *Mode de Règlement* : ${selectedPaymentMethod.toUpperCase()}\n`;
                message += `📸 *Preuve de Paiement* : ${fileProofName} (Envoyée ci-joint)\n`;
            }
            message += `------------------------------------\n`;
            message += `Ets Mr K • RCCM : RC/YAE/2023/A/2978`;

            const waUrl = `https://wa.me/237655080150?text=${encodeURIComponent(message)}`;
            
            alert('Votre récapitulatif de commande est validé localement. Vous allez être redirigé vers WhatsApp pour finaliser l\'envoi des fichiers et du paiement.');
            window.open(waUrl, '_blank');

            // Reset cart
            cart = [];
            saveCart();
            updateCartUI();
            toggleCartDrawer();

            // Reset file upload prompts
            uploadedSTLFile = null;
            uploadedProofFile = null;
            if (cartInputSTL) cartInputSTL.value = '';
            if (cartInputProof) cartInputProof.value = '';
            if (cartPreviewSTL) cartPreviewSTL.style.display = 'none';
            if (cartPreviewProof) cartPreviewProof.style.display = 'none';
            if (cartPromptSTL) cartPromptSTL.style.display = 'flex';
            if (cartPromptProof) cartPromptProof.style.display = 'flex';
            if (cartForm) cartForm.reset();
        };

        // Simulate upload bar
        if (cartProgressBarContainer && cartProgressBar) {
            cartProgressBarContainer.style.display = 'block';
            cartProgressBar.style.width = '0%';
            
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    cartProgressBarContainer.style.display = 'none';
                    runSubmission();
                } else {
                    width += 15;
                    cartProgressBar.style.width = width + '%';
                }
            }, 100);
        } else {
            runSubmission();
        }
    };

    if (cartForm) {
        cartForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitOrder(false);
        });
    }

    if (submitContactBtn) {
        submitContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            submitOrder(true);
        });
    }

    // Load prefilled client details in Cart
    const loadPrefilledCartFields = () => {
        const savedName = localStorage.getItem('espoirdent_name');
        const savedPhone = localStorage.getItem('espoirdent_phone');
        const savedEmail = localStorage.getItem('espoirdent_email');
        const savedCity = localStorage.getItem('espoirdent_city');
        const savedScanner = localStorage.getItem('espoirdent_scanner');

        if (savedName && document.getElementById('cart-client-name')) document.getElementById('cart-client-name').value = savedName;
        if (savedPhone && document.getElementById('cart-client-whatsapp')) document.getElementById('cart-client-whatsapp').value = savedPhone;
        if (savedEmail && document.getElementById('cart-client-email')) document.getElementById('cart-client-email').value = savedEmail;
        if (savedCity && document.getElementById('cart-client-city')) document.getElementById('cart-client-city').value = savedCity;
        if (savedScanner && document.getElementById('cart-client-scanner')) document.getElementById('cart-client-scanner').value = savedScanner;
    };

    loadPrefilledCartFields();
    bindAddToCartButtons();
    updateCartUI();
});
