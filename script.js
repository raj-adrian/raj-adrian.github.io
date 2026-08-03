// ===== NAVIGATION MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.style.animation = 'pulse 0.3s ease';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        updateActiveLink();
    });
});

// ===== UPDATE ACTIVE LINK =====
function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

updateActiveLink();

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== PARTICLES ANIMATION =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.delay = Math.random() * 5 + 's';
        particle.style.duration = (Math.random() * 10 + 20) + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ===== FADE IN ELEMENTS ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===== TYPING ANIMATION =====
function typeText(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

const typingElement = document.querySelector('.typing-text');
if (typingElement) {
    const text = typingElement.textContent;
    typeText(typingElement, text, 50);
}

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Create mailto link
        const mailtoLink = `mailto:rajesteban013@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        
        // Show success message
        showNotification('Message prepared! Opening your email client...', 'success');
        
        // Open email client
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1000);
        
        // Reset form
        setTimeout(() => {
            contactForm.reset();
        }, 2000);
    });
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00d97e' : type === 'error' ? '#ff4757' : '#00d4ff'};
        color: #0f1419;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ===== FILTER FUNCTIONALITY FOR ACHIEVEMENTS =====
const filterButtons = document.querySelectorAll('.filter-btn');
const achievementCards = document.querySelectorAll('.achievement-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter cards
        const filterValue = button.getAttribute('data-filter');
        achievementCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else if (card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== MODAL FUNCTIONALITY =====
const modal = document.getElementById('achievementModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.modal-close');

const achievementDetails = {
    1: {
        title: 'With Honors',
        category: 'Academic Excellence',
        image: 'WithHonors2.jpg',
        description: 'Recognition for outstanding academic performance and dedication to studies. Achieved consistent high grades and demonstrated excellence in criminology coursework.',
    },
    2: {
        title: 'Loyalty Award',
        category: 'Service Excellence',
        description: 'Recognition for dedicated service and unwavering commitment to professional responsibilities. Acknowledged for reliability and consistent excellence in work performance.',
    },
    3: {
        title: 'ROTC Participation',
        category: 'Military Training',
        description: 'Active participation in Reserve Officer Training Course with focus on leadership development, military discipline, and professional conduct.',
    }
};

document.querySelectorAll('.achievement-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const achievementId = btn.getAttribute('data-achievement');
        const achievement = achievementDetails[achievementId];
        
        if (achievement) {
            modalBody.innerHTML = `
                <img src="${achievement.image}" alt="${achievement.title}" class="modal-achievement-image">
            
                <h3>${achievement.title}</h3>
                <p><strong>Category:</strong> ${achievement.category}</p>
                <p>${achievement.description}</p>
                <p>${achievement.details}</p>
            `;
            modal.style.display = 'block';
        }
    });
});

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== ANIMATED COUNTER =====
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    function update() {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// Trigger counter animations on scroll
const counterElements = document.querySelectorAll('.summary-number');
let countersAnimated = false;

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            counterElements.forEach(el => {
                const target = parseInt(el.textContent);
                animateCounter(el, target);
            });
            countersAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (counterElements.length > 0) {
    counterObserver.observe(counterElements[0].parentElement);
}

// ===== PROJECT VIEW FUNCTIONALITY =====
document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Project details coming soon!', 'info');
    });
});

// ===== CUSTOM SCROLL BEHAVIOR =====
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // Scroll down
        navbar.style.opacity = '0.95';
    } else {
        // Scroll up
        navbar.style.opacity = '1';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===== ADD STYLES FOR ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.animation = 'fadeInUp 0.8s ease';
});

// ===== ACCESSIBILITY: KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// ===== PRELOAD IMAGES =====
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preload = new Image();
            preload.src = src;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}

// ===== LOG INITIALIZATION =====
console.log('Portfolio loaded successfully!');

// ===== BACKGROUND MUSIC =====
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

if (music && musicBtn) {
    musicBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            musicBtn.classList.add("playing");
            musicBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        } else {
            music.pause();
            musicBtn.classList.remove("playing");
            musicBtn.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
        }
    });
}
