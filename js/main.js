// Serkan Parla Otomotiv - Main JavaScript

(function() {
    'use strict';

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('mainNavbar');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // ==================== SMOOTH SCROLL FOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // ==================== VEHICLE FILTERING ====================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vehicleItems = document.querySelectorAll('.vehicle-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter vehicles
            vehicleItems.forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hide');
                    setTimeout(() => {
                        item.style.display = '';
                    }, 10);
                } else {
                    if (item.classList.contains(filter)) {
                        item.classList.remove('hide');
                        setTimeout(() => {
                            item.style.display = '';
                        }, 10);
                    } else {
                        item.classList.add('hide');
                    }
                }
            });
        });
    });

    // ==================== SCROLL TO TOP BUTTON ====================
    const scrollTopBtn = document.getElementById('scrollTop');
    
    function toggleScrollTopButton() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', toggleScrollTopButton);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==================== FORM VALIDATION & HANDLING ====================
    
    // Evaluation Form
    const evaluationForm = document.getElementById('evaluationForm');
    if (evaluationForm) {
        evaluationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Basic validation
            if (!data.brand || !data.model || !data.year || !data.km || !data.phone) {
                alert('Lütfen tüm zorunlu alanları doldurun.');
                return;
            }
            
            // Phone validation (basic)
            const phonePattern = /^[0-9]{10,11}$/;
            const cleanPhone = data.phone.replace(/\s/g, '');
            if (!phonePattern.test(cleanPhone)) {
                alert('Lütfen geçerli bir telefon numarası girin.');
                return;
            }
            
            // Success message
            alert('Talebiniz alındı! En kısa sürede size dönüş yapacağız.\n\nMarka: ' + data.brand + '\nModel: ' + data.model + '\nYıl: ' + data.year + '\nKM: ' + data.km);
            
            // Reset form
            this.reset();
            
            // In production, you would send this data to a server
            // fetch('your-endpoint.php', {
            //     method: 'POST',
            //     body: formData
            // });
        });
    }

    // Sell Form
    const sellForm = document.getElementById('sellForm');
    if (sellForm) {
        sellForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Basic validation
            if (!data.fullname || !data.phone || !data.brand) {
                alert('Lütfen tüm zorunlu (*) alanları doldurun.');
                return;
            }
            
            // Phone validation
            const phonePattern = /^[0-9]{10,11}$/;
            const cleanPhone = data.phone.replace(/\s/g, '');
            if (!phonePattern.test(cleanPhone)) {
                alert('Lütfen geçerli bir telefon numarası girin.');
                return;
            }
            
            // Email validation (if provided)
            if (data.email) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(data.email)) {
                    alert('Lütfen geçerli bir email adresi girin.');
                    return;
                }
            }
            
            // Success message
            alert('Araç satış talebiniz alındı! En kısa sürede size dönüş yapacağız.\n\nAd Soyad: ' + data.fullname + '\nMarka: ' + data.brand);
            
            // Reset form
            this.reset();
            
            // In production, send to server
            // This form has action="mail.php" so it would normally submit there
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Basic validation
            if (!data.name || !data.phone || !data.email || !data.message) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(data.email)) {
                alert('Lütfen geçerli bir email adresi girin.');
                return;
            }
            
            // Phone validation
            const phonePattern = /^[0-9]{10,11}$/;
            const cleanPhone = data.phone.replace(/\s/g, '');
            if (!phonePattern.test(cleanPhone)) {
                alert('Lütfen geçerli bir telefon numarası girin.');
                return;
            }
            
            // Success message
            alert('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.\n\nİsim: ' + data.name + '\nİlgilenilen Araç: ' + data.vehicle);
            
            // Reset form
            this.reset();
        });
    }

    // ==================== ACTIVE NAV LINK ON SCROLL ====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    function setActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
        
        // Set home as active if at top
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', setActiveNavLink);

    // ==================== PHONE NUMBER FORMATTING ====================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 11 digits
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            this.value = value;
        });
    });

    // ==================== ANIMATION ON SCROLL ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Observe step cards
    document.querySelectorAll('.step-card').forEach(card => {
        observer.observe(card);
    });

    // Observe vehicle cards
    document.querySelectorAll('.vehicle-card').forEach(card => {
        observer.observe(card);
    });

    // ==================== INITIALIZE ====================
    // Set initial states
    handleScroll();
    toggleScrollTopButton();
    setActiveNavLink();

    console.log('Serkan Parla Otomotiv - Website initialized');
})();
