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

    // Admin Details Modal Elements
    const adminModal = document.getElementById('admin-modal');
    const adminModalOverlay = document.getElementById('admin-modal-overlay');
    const closeModalBtn = document.getElementById('close-admin-modal');

    const renderAdminDashboard = () => {
        if (!adminTableBody) return;

        const leads = JSON.parse(localStorage.getItem('espoirdent_leads') || '[]');
        
        // Update stats counters
        if (totalLeadsCount) totalLeadsCount.innerText = leads.length;
        if (activeLeadsCount) {
            const activeCount = leads.filter(l => l.status === 'new').length;
            activeLeadsCount.innerText = activeCount;
        }

        // Render list
        adminTableBody.innerHTML = '';
        if (leads.length === 0) {
            if (emptyAdminMsg) emptyAdminMsg.style.display = 'block';
            return;
        }

        if (emptyAdminMsg) emptyAdminMsg.style.display = 'none';

        // Display newest first
        leads.reverse().forEach(lead => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${lead.date}</td>
                <td><strong>${lead.name}</strong><br><small>${lead.email}</small></td>
                <td>${lead.city}</td>
                <td><small>${lead.requestType}</small></td>
                <td><span class="badge-status ${lead.status}">${lead.status === 'new' ? 'Nouveau' : 'Traité'}</span></td>
                <td>
                    <div class="admin-actions-cell">
                        <button class="admin-btn admin-btn-view" data-id="${lead.id}">Détails</button>
                        <button class="admin-btn admin-btn-delete" style="background-color: transparent;" data-id="${lead.id}">Supprimer</button>
                    </div>
                </td>
            `;
            adminTableBody.appendChild(tr);
        });

        // Re-bind actions
        bindAdminActions();
    };

    const bindAdminActions = () => {
        // Details Button
        document.querySelectorAll('.admin-btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const leadId = parseInt(btn.getAttribute('data-id'), 10);
                showLeadDetails(leadId);
            });
        });

        // Delete Button
        document.querySelectorAll('.admin-btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Voulez-vous vraiment supprimer cette demande ?')) {
                    const leadId = parseInt(btn.getAttribute('data-id'), 10);
                    let leads = JSON.parse(localStorage.getItem('espoirdent_leads') || '[]');
                    leads = leads.filter(l => l.id !== leadId);
                    localStorage.setItem('espoirdent_leads', JSON.stringify(leads));
                    renderAdminDashboard();
                }
            });
        });
    };

    const showLeadDetails = (leadId) => {
        const leads = JSON.parse(localStorage.getItem('espoirdent_leads') || '[]');
        const lead = leads.find(l => l.id === leadId);

        if (!lead) return;

        // Populate modal text
        document.getElementById('modal-lead-date').innerText = lead.date;
        document.getElementById('modal-lead-name').innerText = lead.name;
        document.getElementById('modal-lead-phone').innerText = lead.phone;
        document.getElementById('modal-lead-email').innerText = lead.email;
        document.getElementById('modal-lead-city').innerText = lead.city;
        document.getElementById('modal-lead-scanner').innerText = lead.scanner;
        document.getElementById('modal-lead-type').innerText = lead.requestType;
        document.getElementById('modal-lead-file').innerText = lead.fileName;
        document.getElementById('modal-lead-msg').innerText = lead.message || 'Aucun message particulier.';

        // Toggle status action button in modal
        const toggleStatusBtn = document.getElementById('modal-toggle-status');
        if (toggleStatusBtn) {
            toggleStatusBtn.innerText = lead.status === 'new' ? 'Marquer comme traité' : 'Marquer comme nouveau';
            toggleStatusBtn.onclick = () => {
                // Toggle status
                const leadsDb = JSON.parse(localStorage.getItem('espoirdent_leads') || '[]');
                const targetIdx = leadsDb.findIndex(l => l.id === leadId);
                if (targetIdx !== -1) {
                    leadsDb[targetIdx].status = leadsDb[targetIdx].status === 'new' ? 'processed' : 'new';
                    localStorage.setItem('espoirdent_leads', JSON.stringify(leadsDb));
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

    if (closeModalBtn && adminModalOverlay) {
        closeModalBtn.addEventListener('click', closeModal);
        adminModalOverlay.addEventListener('click', closeModal);
    }

    // Reset Dashboard Button
    if (resetLeadsBtn) {
        resetLeadsBtn.addEventListener('click', () => {
            if (confirm('Voulez-vous réinitialiser toutes les données ? Cette action effacera toutes les demandes enregistrées.')) {
                localStorage.removeItem('espoirdent_leads');
                renderAdminDashboard();
            }
        });
    }

    // Init Admin view if we are on admin page
    renderAdminDashboard();
});
