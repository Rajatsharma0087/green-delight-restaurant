// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

// ===== NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');
let counterAnimated = false;

function animateCounters() {
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const increment = target / 100;
        let count = 0;

        const updateCounter = () => {
            if (count < target) {
                count += increment;
                // Handle decimals
                if (target % 1 !== 0) {
                    counter.textContent = count.toFixed(1);
                } else {
                    counter.textContent = Math.ceil(count);
                }
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target % 1 !== 0 ? target.toFixed(1) : target;
            }
        };

        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                animateCounters();
                counterAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ===== MENU FILTER =====
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter menu cards
        menuCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== ADD TO CART ANIMATION =====
const addToCartButtons = document.querySelectorAll('.btn-add-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const originalText = this.innerHTML;
        
        // Change button text
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.background = '#27ae60';

        // Reset after 2 seconds
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = '';
        }, 2000);

        // Optional: Add to cart logic here
        console.log('Item added to cart');
    });
});

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => item.querySelector('img').src);

// Open lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(galleryImages[currentImageIndex]);
    });
});

function openLightbox(imageSrc) {
    lightbox.classList.add('active');
    lightboxImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

// Close lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate lightbox
lightboxPrev.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
});

lightboxNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        lightboxPrev.click();
    } else if (e.key === 'ArrowRight') {
        lightboxNext.click();
    }
});

// ===== FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
        showFormStatus('Please fill in all required fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormStatus('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission (replace with actual FormSpree when ready)
    try {
        showFormStatus('Sending your message...', 'success');
        

        // if (response.ok) {
        setTimeout(() => {
            showFormStatus('Thank you! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        }, 1000);
        // } else {
        //     showFormStatus('Oops! Something went wrong. Please try again.', 'error');
        // }
    } catch (error) {
        showFormStatus('Oops! Something went wrong. Please try again.', 'error');
    }
});

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    
    setTimeout(() => {
        formStatus.className = 'form-status';
    }, 5000);
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;

        if (email) {
            alert(`Thank you for subscribing with ${email}!`);
            newsletterForm.reset();
        }
    });
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.menu-card, .review-card, .gallery-item, .about-content').forEach(el => {
    observer.observe(el);
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== LAZY LOADING IMAGES =====
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== PARALLAX EFFECT (SUBTLE) =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.backgroundPositionY = `${scrolled * speed}px`;
    });
});

// ===== CLICK TO CALL TRACKING =====
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
        console.log('Phone call initiated');
        // Add analytics tracking here if needed
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
function reveal() {
    const reveals = document.querySelectorAll('.about-content, .menu-card, .review-card, .stat-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// ===== ACCESSIBILITY: SKIP TO MAIN CONTENT =====
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 10000;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ===== PERFORMANCE: PRELOAD IMAGES =====
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        // Add more critical images
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Preload after page load
window.addEventListener('load', preloadImages);

// ===== CONSOLE EASTER EGG =====
console.log(
    '%c🍃 Green Delight Restaurant 🍃',
    'color: #2ecc71; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cLooking for something? Check out our menu!',
    'color: #27ae60; font-size: 14px;'
);
console.log(
    '%cMade with 💚 by Rajat Sharma',
    'color: #7f8c8d; font-size: 12px;'
);


/*
const ratingStars = document.querySelectorAll('.rating-star');
let selectedRating = 0;

ratingStars.forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateStars();
    });

    star.addEventListener('mouseover', () => {
        highlightStars(index + 1);
    });

    star.addEventListener('mouseout', () => {
        highlightStars(selectedRating);
    });
});

function updateStars() {
    ratingStars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function highlightStars(count) {
    ratingStars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }
    });
}
*/
