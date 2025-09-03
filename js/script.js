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
    
    // Initialize click-to-play functionality first
    initializeClickToPlay();
    
    // Initialize random collections in background cards
    updateRandomCards();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize gallery filters
    initializeGalleryFilters();
    
    // Wait for all media files to load
    waitForAllMediaToLoad();
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

// ===== MEDIA LOADING SYSTEM =====
function waitForAllMediaToLoad() {
    const videos = document.querySelectorAll('video');
    const images = document.querySelectorAll('img');
    const iframes = document.querySelectorAll('iframe');
    
    let totalMedia = videos.length + images.length + iframes.length;
    let loadedMedia = 0;
    
    // Update loading progress
    function updateLoadingProgress() {
        const progress = (loadedMedia / totalMedia) * 100;
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.querySelector('.loading-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (loadingText) {
            loadingText.textContent = `Loading media files... ${Math.round(progress)}%`;
        }
        
        if (loadedMedia >= totalMedia) {
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        }
    }
    
    // Handle video loading
    videos.forEach(video => {
        if (video.readyState >= 3) { // HAVE_FUTURE_DATA
            loadedMedia++;
            updateLoadingProgress();
        } else {
            video.addEventListener('canplaythrough', () => {
                loadedMedia++;
                updateLoadingProgress();
            });
            video.addEventListener('error', () => {
                loadedMedia++;
                updateLoadingProgress();
            });
        }
    });
    
    // Handle image loading
    images.forEach(img => {
        if (img.complete) {
            loadedMedia++;
            updateLoadingProgress();
        } else {
            img.addEventListener('load', () => {
                loadedMedia++;
                updateLoadingProgress();
            });
            img.addEventListener('error', () => {
                loadedMedia++;
                updateLoadingProgress();
            });
        }
    });
    
    // Handle iframe loading (Spotify player)
    iframes.forEach(iframe => {
        iframe.addEventListener('load', () => {
            loadedMedia++;
            updateLoadingProgress();
        });
        iframe.addEventListener('error', () => {
            loadedMedia++;
            updateLoadingProgress();
        });
    });
    
    // Fallback timeout in case some media fails to load
    setTimeout(() => {
        if (loadedMedia < totalMedia) {
            console.log('Some media files failed to load, proceeding anyway...');
            hideLoadingScreen();
        }
    }, 10000); // 10 second timeout
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
    
    // Music player is now fixed in position - no dragging
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



// ===== VIDEO CONTROLS =====
function initializeVideoControls() {
    // Speed Up Videos
    document.getElementById("speedButton").addEventListener("click", speedUpVideos);
    
    // View Mode Toggle
    viewModeButton.addEventListener("click", toggleViewMode);
}

function speedUpVideos() {
    const videos = document.querySelectorAll("video");
    
    videos.forEach((video) => {
        video.playbackRate = 1.5;
        addVideoSpeedEffect(video);
    });
    
    addButtonFeedback(document.getElementById("speedButton"));
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

// ===== RANDOM COLLECTIONS =====
const collections = [
    { src: "images/Funko Pop/WB Horror/WB Horror.mp4", title: "WB Horror", description: "Classic horror collection" },
    { src: "images/Funko Pop/IT/IT.mp4", title: "IT", description: "Pennywise collection" },
    { src: "images/Funko Pop/Scooby Doo/Scooby-Dooo.mp4", title: "Scooby Doo", description: "Mystery gang" },
    { src: "images/Funko Pop/Adventure Time/Adventure Time.mp4", title: "Adventure Time", description: "Mathematical adventures" },
    { src: "images/Funko Pop/Flintstones/Flintstones.mp4", title: "Flintstones", description: "Stone age family" },
    { src: "images/Funko Pop/DC/DC Superheroes.mp4", title: "DC Superheroes", description: "Justice League" },
    { src: "images/Funko Pop/DC/DC Supervillain.mp4", title: "DC Supervillains", description: "Dark side of DC" },
    { src: "images/Funko Pop/Teen Titans/Teen Titans.mp4", title: "Teen Titans", description: "Young heroes" },
    { src: "images/Funko Pop/Dungeon & Dragons/Dungeons & Dragons.mp4", title: "D&D", description: "Fantasy adventures" },
    { src: "images/Funko Pop/Avatar Legends/Avatar.mp4", title: "Avatar", description: "Elemental bending" },
    { src: "images/Funko Pop/Looney Tunes/Looney Tunes.mp4", title: "Looney Tunes", description: "Classic cartoons" },
    { src: "images/Funko Pop/Hanna Barbera/Hanna Barbera.mp4", title: "Hanna Barbera", description: "Animation legends" },
    { src: "images/Funko Pop/WB100th/WB100th.mp4", title: "WB 100th", description: "Century celebration" },
    { src: "images/Funko Pop/Back To The Future/Back to the future.mp4", title: "Back to the Future", description: "Time travel adventures" },
    { src: "images/Funko Pop/Squid Games/Squid Games.mp4", title: "Squid Games", description: "Survival games" },
    { src: "images/Funko Pop/Power Rangers/Power Rangers.mp4", title: "Power Rangers", description: "Mighty morphin" },
    { src: "images/Funko Pop/Stranger Things/Stranger Things.mp4", title: "Stranger Things", description: "Upside down" },
    { src: "images/Funko Pop/Games of Thrones/Game of Thrones.mp4", title: "Game of Thrones", description: "Iron throne" },
    { src: "images/Funko Pop/Matrix/Matrix.mp4", title: "Matrix", description: "Digital reality" },
    { src: "images/Funko Pop/Jurasic Park/Jurasic Park.mp4", title: "Jurassic Park", description: "Dinosaur world" },
    { src: "images/Funko Pop/Retro/Retro comics.mp4", title: "Retro Comics", description: "Vintage heroes" },
    { src: "images/Funko Pop/Nicktoones/Nicktoones.mp4", title: "Nicktoons", description: "Nickelodeon classics" },
    { src: "images/Funko Pop/Plastic Fantastic/Plastic Fantastic.mp4", title: "Plastic Fantastic", description: "Plastic art" },
    { src: "images/Funko Pop/Star Trek/Star Trek.mp4", title: "Star Trek", description: "Space exploration" },
    { src: "images/Funko Pop/April's Fools/April Fools.mp4", title: "April's Fools", description: "Prank collection" },
    { src: "images/Funko Pop/Halloween/Halloween.mp4", title: "Halloween", description: "Spooky season" },
    { src: "images/Funko Pop/Bob Ross/Bob Ross.mp4", title: "Bob Ross", description: "Happy little trees" }
];

function getRandomCollections() {
    // Shuffle array and pick 2 random collections
    const shuffled = [...collections].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
}

function updateRandomCards() {
    const randomCollections = getRandomCollections();
    
    // Update card 1
    const card1 = document.querySelector('.card-1');
    if (card1 && randomCollections[0]) {
        const video = card1.querySelector('.card-video');
        const overlay = card1.querySelector('.card-overlay');
        
        if (video) {
            video.src = randomCollections[0].src;
        }
        if (overlay) {
            overlay.querySelector('h3').textContent = randomCollections[0].title;
            overlay.querySelector('p').textContent = randomCollections[0].description;
        }
    }
    
    // Update card 2
    const card2 = document.querySelector('.card-2');
    if (card2 && randomCollections[1]) {
        const video = card2.querySelector('.card-video');
        const overlay = card2.querySelector('.card-overlay');
        
        if (video) {
            video.src = randomCollections[1].src;
        }
        if (overlay) {
            overlay.querySelector('h3').textContent = randomCollections[1].title;
            overlay.querySelector('p').textContent = randomCollections[1].description;
        }
    }
    
    // Card 3 keeps Royal Panda Collection (no changes needed)
}

// ===== CLICK TO PLAY FUNCTIONALITY =====
function initializeClickToPlay() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Remove default controls
        video.controls = false;
        
        // Add click event listener
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
        
        // Add visual feedback on hover
        video.style.cursor = 'pointer';
        
        // Add play overlay when paused
        const overlay = document.createElement('div');
        overlay.className = 'video-play-overlay';
        overlay.innerHTML = '▶️';
        overlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        // Make video container relative for overlay positioning
        const container = video.parentNode;
        if (container.classList.contains('item-container')) {
            container.style.position = 'relative';
            container.appendChild(overlay);
        }
        
        // Show/hide overlay based on video state
        video.addEventListener('play', () => {
            overlay.style.opacity = '0';
        });
        
        video.addEventListener('pause', () => {
            overlay.style.opacity = '1';
        });
        
        // Initial state - check if video has autoplay
        if (video.hasAttribute('autoplay')) {
            // For autoplay videos, start with overlay hidden
            overlay.style.opacity = '0';
        } else {
            // For non-autoplay videos, show overlay if paused
            if (video.paused) {
                overlay.style.opacity = '1';
            } else {
                overlay.style.opacity = '0';
            }
        }
    });
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
    // All media files are now loaded immediately without lazy loading
    console.log('Performance optimization: All media files loaded immediately');
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
