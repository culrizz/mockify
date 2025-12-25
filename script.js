// MOCKIFY - Main Application Script

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeMobileMenu();
    initializeToast();
    initializeActiveNav();
    initializeSmoothScroll();
    initializeGenerators();
});

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    // Check saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('mockify-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
    
    // Theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mockify-theme', newTheme);
    updateThemeIcon(newTheme);
    
    showToast(`Switched to ${newTheme} theme`);
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'var(--light)';
                navLinks.style.padding = 'var(--spacing-md)';
                navLinks.style.boxShadow = 'var(--shadow-lg)';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.style.display = 'none';
            }
        });
    }
}

// ===== TOAST NOTIFICATION =====
function initializeToast() {
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            toast.classList.remove('show');
        });
    }
}

function showToast(message, duration = 3000) {
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// ===== ACTIVE NAVIGATION =====
function initializeActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === 'index.html') ||
            (currentPage.includes(link.getAttribute('href').replace('.html', '')))) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks && window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
}

// ===== GENERATORS PREVIEW =====
function initializeGenerators() {
    const generatorCards = document.querySelectorAll('.generator-card');
    
    generatorCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const app = this.href.split('=')[1];
            updateHeroPreview(app);
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset to default preview after delay
            setTimeout(() => {
                if (!document.querySelector('.generator-card:hover')) {
                    updateHeroPreview('whatsapp');
                }
            }, 100);
        });
    });
}

function updateHeroPreview(app) {
    const previewScreen = document.querySelector('.device-screen');
    if (!previewScreen) return;
    
    let previewHTML = '';
    
    switch(app) {
        case 'whatsapp':
            previewHTML = `
                <div class="whatsapp-preview">
                    <div class="whatsapp-header">
                        <div class="contact-avatar">W</div>
                        <div>
                            <div class="contact-name">WhatsApp</div>
                            <div class="contact-status">online</div>
                        </div>
                    </div>
                    <div class="chat-messages">
                        <div class="message received">Check out Mockify!</div>
                        <div class="message sent">Looks amazing! ⚡</div>
                    </div>
                </div>
            `;
            break;
            
        case 'instagram':
            previewHTML = `
                <div class="instagram-preview">
                    <div class="instagram-header">
                        <div class="contact-avatar">I</div>
                        <div>
                            <div class="contact-name">Instagram</div>
                            <div class="contact-status">Active now</div>
                        </div>
                    </div>
                    <div class="instagram-content">
                        <div class="story-highlights"></div>
                        <div class="post-preview"></div>
                    </div>
                </div>
            `;
            break;
            
        case 'facebook':
            previewHTML = `
                <div class="facebook-preview">
                    <div class="facebook-header">
                        <div class="contact-avatar">F</div>
                        <div>
                            <div class="contact-name">Facebook</div>
                            <div class="contact-status">10m ago</div>
                        </div>
                    </div>
                    <div class="facebook-content">
                        <div class="post">Creating amazing mockups with Mockify!</div>
                    </div>
                </div>
            `;
            break;
            
        default:
            previewHTML = `
                <div class="whatsapp-preview">
                    <div class="whatsapp-header">
                        <div class="contact-avatar">M</div>
                        <div>
                            <div class="contact-name">Mockify</div>
                            <div class="contact-status">online</div>
                        </div>
                    </div>
                    <div class="chat-messages">
                        <div class="message received">Try ${app} generator!</div>
                        <div class="message sent">Creating realistic mockups 🎨</div>
                    </div>
                </div>
            `;
    }
    
    previewScreen.innerHTML = previewHTML;
}

// ===== DEVICE PREVIEW ANIMATION =====
function animateDevicePreview() {
    const deviceMockup = document.querySelector('.device-mockup');
    if (deviceMockup) {
        setInterval(() => {
            deviceMockup.style.animation = 'none';
            setTimeout(() => {
                deviceMockup.style.animation = 'float 3s ease-in-out infinite';
            }, 10);
        }, 3000);
    }
}

// ===== STATS COUNTER =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toString();
        }, 30);
    });
}

// ===== INITIALIZE ANIMATIONS =====
window.addEventListener('load', function() {
    animateDevicePreview();
    
    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EXPORT FOR USE IN OTHER FILES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        toggleTheme,
        debounce,
        throttle
    };
}
