// ===== NFT UNIVERSE - MODERN JAVASCRIPT =====

// Global Variables
let count = 0;
let isMusicPlayerMinimized = false;
let currentViewMode = 'grid';
let currentFilter = 'all';

// DOM Elements
const counterElement = document.getElementById("counter");
const incrementButton = document.getElementById("incrementButton");
const modal = document.getElementById("myModal");
const alreadyClickedModal = document.getElementById("alreadyClickedModal");
const span = document.getElementsByClassName("close")[0];
const alreadyClickedSpan = document.getElementsByClassName("alreadyClickedClose")[0];
const loadingScreen = document.getElementById("loadingScreen");
const musicPlayer = document.querySelector(".floating-music-player");
const minimizeBtn = document.querySelector(".minimize-btn");
const musicPlayerContent = document.querySelector(".music-player-content");
const viewModeButton = document.getElementById("viewMode");
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryGrid = document.getElementById("galleryGrid");
const galleryItems = document.querySelectorAll(".gallery-item");

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize counter
    initializeCounter();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize gallery filters
    initializeGalleryFilters();
    
    // Hide loading screen after everything is ready
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
}

// ===== LOADING SCREEN =====
function showLoadingScreen() {
    loadingScreen.style.display = 'flex';
    loadingScreen.classList.remove('hidden');
}

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// ===== COUNTER SYSTEM =====
function initializeCounter() {
    // Check if the count value is already stored in localStorage
    const storedCount = localStorage.getItem("visitorCount");
    
    if (storedCount) {
        count = parseInt(storedCount);
    } else {
        localStorage.setItem("visitorCount", count);
    }
    
    updateCounter();
}

function updateCounter() {
    counterElement.textContent = count;
    
    // Add animation class
    counterElement.classList.add('counter-update');
    setTimeout(() => {
        counterElement.classList.remove('counter-update');
    }, 500);
}

function incrementCounter() {
    // Check if 'hasClicked' exists in localStorage
    if (localStorage.getItem("hasClicked")) {
        // If it exists, display the "You did it! 😏" modal
        showModal(alreadyClickedModal);
    } else {
        // If it doesn't exist, increment the counter and display the modal
        count++;
        localStorage.setItem("hasClicked", true);
        localStorage.setItem("visitorCount", count);
        updateCounter();
        showModal(modal);
        
        // Add celebration effect
        addCelebrationEffect();
    }
}

function addCelebrationEffect() {
    // Create confetti effect
    createConfetti();
    
    // Add button animation
    incrementButton.classList.add('celebrating');
    setTimeout(() => {
        incrementButton.classList.remove('celebrating');
    }, 1000);
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10000';
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// ===== MODAL SYSTEM =====
function showModal(modalElement) {
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
    
    // Add backdrop click effect
    modalElement.classList.add('clicked');
    setTimeout(() => {
        modalElement.classList.remove('clicked');
    }, 200);
}

function hideModal(modalElement) {
    modalElement.classList.add('hide');
    setTimeout(() => {
        modalElement.style.display = 'none';
        modalElement.classList.remove('hide');
    }, 300);
}

// ===== MUSIC PLAYER =====
function initializeMusicPlayer() {
    minimizeBtn.addEventListener('click', toggleMusicPlayer);
    
    // Make music player draggable
    makeDraggable(musicPlayer);
}

function toggleMusicPlayer() {
    if (isMusicPlayerMinimized) {
        musicPlayerContent.style.display = 'block';
        minimizeBtn.textContent = '−';
        isMusicPlayerMinimized = false;
        musicPlayer.classList.remove('minimized');
    } else {
        musicPlayerContent.style.display = 'none';
        minimizeBtn.textContent = '+';
        isMusicPlayerMinimized = true;
        musicPlayer.classList.add('minimized');
    }
}

function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    element.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === element) {
            isDragging = true;
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, element);
        }
    }
    
    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}

// ===== VIDEO CONTROLS =====
function initializeVideoControls() {
    // Play All Videos
    document.getElementById("playAll").addEventListener("click", playAllVideos);
    
    // Speed Up Videos
    document.getElementById("speedButton").addEventListener("click", speedUpVideos);
    
    // Reset Videos
    document.getElementById("resetButton").addEventListener("click", resetVideos);
    
    // View Mode Toggle
    viewModeButton.addEventListener("click", toggleViewMode);
}

function playAllVideos() {
    const videos = document.querySelectorAll("video");
    let delay = 0;
    
    videos.forEach((video, index) => {
        setTimeout(() => {
            video.play();
            addVideoPlayEffect(video);
        }, delay);
        delay += 100; // Stagger the start
    });
    
    // Add button feedback
    addButtonFeedback(document.getElementById("playAll"));
}

function speedUpVideos() {
    const videos = document.querySelectorAll("video");
    
    videos.forEach((video) => {
        video.playbackRate = 1.5;
        addVideoSpeedEffect(video);
    });
    
    addButtonFeedback(document.getElementById("speedButton"));
}

function resetVideos() {
    const videos = document.querySelectorAll("video");
    
    videos.forEach((video) => {
        video.playbackRate = 1;
        video.pause();
        video.currentTime = 0;
        addVideoResetEffect(video);
    });
    
    addButtonFeedback(document.getElementById("resetButton"));
}

function toggleViewMode() {
    if (currentViewMode === 'grid') {
        currentViewMode = 'list';
        galleryGrid.classList.add('list-view');
        viewModeButton.querySelector('span').textContent = 'Grid View';
        viewModeButton.querySelector('.button-icon').textContent = '⊞';
    } else {
        currentViewMode = 'grid';
        galleryGrid.classList.remove('list-view');
        viewModeButton.querySelector('span').textContent = 'List View';
        viewModeButton.querySelector('.button-icon').textContent = '👁️';
    }
    
    addButtonFeedback(viewModeButton);
}

// ===== GALLERY FILTERS =====
function initializeGalleryFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterGallery(category);
            updateActiveFilter(button);
        });
    });
}

function filterGallery(category) {
    currentFilter = category;
    
    galleryItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.classList.add('fade-in');
        } else {
            item.style.display = 'none';
            item.classList.remove('fade-in');
        }
    });
    
    // Add filter animation
    addFilterAnimation();
}

function updateActiveFilter(activeButton) {
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function addFilterAnimation() {
    galleryGrid.classList.add('filtering');
    setTimeout(() => {
        galleryGrid.classList.remove('filtering');
    }, 500);
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe gallery items
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

// ===== EFFECTS =====
function addVideoPlayEffect(video) {
    video.style.transform = 'scale(1.05)';
    video.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.6)';
    
    setTimeout(() => {
        video.style.transform = 'scale(1)';
        video.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
    }, 300);
}

function addVideoSpeedEffect(video) {
    video.style.filter = 'brightness(1.2) contrast(1.3)';
    
    setTimeout(() => {
        video.style.filter = 'brightness(1) contrast(1)';
    }, 500);
}

function addVideoResetEffect(video) {
    video.style.transform = 'scale(0.95)';
    video.style.opacity = '0.7';
    
    setTimeout(() => {
        video.style.transform = 'scale(1)';
        video.style.opacity = '1';
    }, 300);
}

function addButtonFeedback(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200);
}

// ===== MOUSE TRACKING FOR GALLERY ITEMS =====
function initializeMouseTracking() {
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Counter button
    incrementButton.addEventListener("click", incrementCounter);
    
    // Modal close buttons
    span.addEventListener("click", () => hideModal(modal));
    alreadyClickedSpan.addEventListener("click", () => hideModal(alreadyClickedModal));
    
    // Close modals when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            hideModal(modal);
        }
        if (event.target === alreadyClickedModal) {
            hideModal(alreadyClickedModal);
        }
    });
    
    // Touch events for mobile
    initializeTouchEvents();
    
    // Initialize other systems
    initializeMusicPlayer();
    initializeVideoControls();
    initializeMouseTracking();
}

// ===== TOUCH EVENTS =====
function initializeTouchEvents() {
    let startX, startY;
    
    document.addEventListener("touchstart", function (e) {
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
    });
    
    document.addEventListener("touchend", function (e) {
        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;
        
        if (Math.abs(endX - startX) < 10 && Math.abs(endY - startY) < 10) {
            if (modal.style.display === "block") {
                hideModal(modal);
            }
            if (alreadyClickedModal.style.display === "block") {
                hideModal(alreadyClickedModal);
            }
        }
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizePerformance() {
    // Lazy load videos
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.src = video.dataset.src;
                videoObserver.unobserve(video);
            }
        });
    });
    
    document.querySelectorAll('video[data-src]').forEach(video => {
        videoObserver.observe(video);
    });
}

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

// ===== KEYBOARD NAVIGATION =====
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Escape':
                if (modal.style.display === 'block') hideModal(modal);
                if (alreadyClickedModal.style.display === 'block') hideModal(alreadyClickedModal);
                break;
            case 'Enter':
                if (document.activeElement === incrementButton) incrementCounter();
                break;
        }
    });
}

// ===== ERROR HANDLING =====
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = 'Something went wrong. Please try again.';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// ===== INITIALIZE KEYBOARD NAVIGATION =====
initializeKeyboardNavigation();

// ===== PERFORMANCE OPTIMIZATION =====
optimizePerformance();

// ===== ERROR HANDLING WRAPPER =====
window.addEventListener('error', (e) => {
    handleError(e.error, 'Global Error');
});

window.addEventListener('unhandledrejection', (e) => {
    handleError(e.reason, 'Unhandled Promise Rejection');
});
