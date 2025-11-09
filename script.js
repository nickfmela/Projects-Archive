// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    // Debounce function for performance optimization
    function debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // ==========================================================================
    // ROTATING HERO SUBTITLE ANIMATION
    // ==========================================================================
    
    function initRotatingSubtitle() {
        const rotatingElement = document.getElementById('rotating-subtitle');
        const textElement = document.querySelector('.rotating-text');
        
        if (!rotatingElement || !textElement) return;
        
        const words = ['GRADUATION', 'ENGAGEMENTS', 'WEDDINGS', 'PORTRAITS'];
        let currentWordIndex = 0;
        let isAnimating = false;
        
        // Function to measure text width for dynamic border sizing
        function getTextWidth(text, fontSize, fontFamily, letterSpacing) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = `700 ${fontSize} ${fontFamily}`;
            const metrics = context.measureText(text);
            
            // Add letter spacing calculation
            const letterSpacingPixels = parseFloat(letterSpacing) || 0;
            const additionalWidth = (text.length - 1) * letterSpacingPixels;
            
            return Math.ceil(metrics.width + additionalWidth);
        }
        
        // Function to update border width
        function updateBorderWidth(text) {
            const computedStyle = window.getComputedStyle(rotatingElement);
            const fontSize = computedStyle.fontSize;
            const fontFamily = computedStyle.fontFamily;
            const letterSpacing = computedStyle.letterSpacing;
            const padding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
            
            const textWidth = getTextWidth(text, fontSize, fontFamily, letterSpacing);
            const totalWidth = textWidth + padding;
            
            rotatingElement.style.width = `${totalWidth}px`;
        }
        
        // Function to change text with upward slide animation
        function changeText() {
            if (isAnimating) return;
            
            isAnimating = true;
            const nextWordIndex = (currentWordIndex + 1) % words.length;
            const nextWord = words[nextWordIndex];
            
            // Start slide out animation
            textElement.classList.add('text-slide-up-out');
            
            setTimeout(() => {
                // Change text and update border width
                textElement.textContent = nextWord;
                updateBorderWidth(nextWord);
                
                // Remove old animation class and add slide in
                textElement.classList.remove('text-slide-up-out');
                textElement.classList.add('text-slide-up-in');
                
                setTimeout(() => {
                    // Clean up animation classes
                    textElement.classList.remove('text-slide-up-in');
                    currentWordIndex = nextWordIndex;
                    isAnimating = false;
                }, 500); // Match CSS animation duration
                
            }, 250); // Halfway through the slide out animation
        }
        
        // Initialize with proper width for first word
        updateBorderWidth(words[currentWordIndex]);
        
        // Start rotation cycle after 3 seconds, then every 3 seconds
        setTimeout(() => {
            changeText();
            setInterval(changeText, 3000);
        }, 3000);
        
        // Handle window resize to recalculate widths
        window.addEventListener('resize', debounce(() => {
            const currentText = textElement.textContent;
            updateBorderWidth(currentText);
        }, 250));
    }
    
    // ==========================================================================
    // NAVIGATION FUNCTIONALITY
    // ==========================================================================
    
    // Hamburger Menu Toggle
    function initHamburgerMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const headerNav = document.getElementById('headerNav');
        const navOverlay = document.getElementById('navOverlay');
        
        if (!hamburgerMenu || !headerNav) return;
        
        function closeMenu() {
            hamburgerMenu.classList.remove('active');
            headerNav.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        function openMenu() {
            hamburgerMenu.classList.add('active');
            headerNav.classList.add('active');
            if (navOverlay) navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Toggle menu on hamburger click
        hamburgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            if (headerNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }
        
        // Close menu when clicking on a nav item
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburgerMenu.contains(e.target) && !headerNav.contains(e.target)) {
                if (headerNav.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && headerNav.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ==========================================================================
    // CONTACT FORM FUNCTIONALITY
    // ==========================================================================
    
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                datetime: formData.get('datetime'),
                message: formData.get('message')
            };
            
            // Simple validation
            if (!data.firstName || !data.lastName || !data.email) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form handling)
            const submitButton = contactForm.querySelector('.contact-submit-btn');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'SENDING...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // For now, just show success message
                // In production, you would send this data to your server
                console.log('Form submitted:', data);
                
                showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
            text-align: center;
            ${type === 'success' 
                ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
                : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        // Insert message after the form
        const contactForm = document.getElementById('contactForm');
        contactForm.appendChild(messageDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    // ==========================================================================
    // WORK GALLERY SCROLL FUNCTIONALITY
    // ==========================================================================
    
    function initWorkGalleryScroll() {
        const workGallery = document.getElementById('workGallery');
        const scrollBtnLeft = document.getElementById('scrollBtnLeft');
        const scrollBtnRight = document.getElementById('scrollBtnRight');
        
        if (!workGallery || !scrollBtnLeft || !scrollBtnRight) return;
        
        const scrollAmount = 630; // Width of work item + gap (610px + 20px gap)
        
        // Function to update button states
        function updateScrollButtons() {
            const maxScrollLeft = workGallery.scrollWidth - workGallery.clientWidth;
            const currentScrollLeft = workGallery.scrollLeft;
            
            // Enable/disable left button
            scrollBtnLeft.disabled = currentScrollLeft <= 5;
            
            // Enable/disable right button  
            scrollBtnRight.disabled = currentScrollLeft >= maxScrollLeft - 5;
        }
        
        // Smooth scroll function
        function smoothScroll(element, target, duration = 300) {
            const start = element.scrollLeft;
            const distance = target - start;
            const startTime = performance.now();
            
            function animation(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeInOutCubic = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                element.scrollLeft = start + distance * easeInOutCubic;
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    updateScrollButtons();
                }
            }
            
            requestAnimationFrame(animation);
        }
        
        // Right scroll button
        scrollBtnRight.addEventListener('click', function() {
            if (!this.disabled) {
                const targetScroll = Math.min(
                    workGallery.scrollLeft + scrollAmount,
                    workGallery.scrollWidth - workGallery.clientWidth
                );
                smoothScroll(workGallery, targetScroll);
            }
        });
        
        // Left scroll button
        scrollBtnLeft.addEventListener('click', function() {
            if (!this.disabled) {
                const targetScroll = Math.max(workGallery.scrollLeft - scrollAmount, 0);
                smoothScroll(workGallery, targetScroll);
            }
        });
        
        // Touch/swipe handling for mobile
        let touchStartX = 0;
        let touchStartScrollLeft = 0;
        let isScrolling = false;
        
        workGallery.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartScrollLeft = workGallery.scrollLeft;
            isScrolling = true;
        }, { passive: true });
        
        workGallery.addEventListener('touchmove', function(e) {
            if (!isScrolling) return;
            
            const touchX = e.touches[0].clientX;
            const walk = (touchStartX - touchX) * 1.5;
            workGallery.scrollLeft = touchStartScrollLeft + walk;
        }, { passive: true });
        
        workGallery.addEventListener('touchend', function() {
            isScrolling = false;
            updateScrollButtons();
        });
        
        // Update buttons on scroll
        workGallery.addEventListener('scroll', debounce(updateScrollButtons, 16), { passive: true });
        
        // Initial button state
        updateScrollButtons();
        
        // Update on window resize
        window.addEventListener('resize', debounce(updateScrollButtons, 250));
    }
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Initialize rotating subtitle animation (only on main page)
    initRotatingSubtitle();
    
    // Initialize contact form (only on main page)
    initContactForm();
    
    // Initialize work gallery scroll functionality
    initWorkGalleryScroll();
    
    // Performance monitoring in development
    if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
        console.log('Photography Portfolio initialized successfully!');
        console.log('Performance: Initial load completed in', performance.now().toFixed(2), 'ms');
    }
});
