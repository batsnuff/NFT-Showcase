// Modern NFT Showcase - Enhanced JavaScript
class NFTShowcase {
  constructor() {
    this.count = 0;
    this.counterElement = document.getElementById("counter");
    this.incrementButton = document.getElementById("incrementButton");
    this.modal = document.getElementById("myModal");
    this.alreadyClickedModal = document.getElementById("alreadyClickedModal");
    this.scrollToTopBtn = document.getElementById("scrollToTop");
    this.performanceIndicator = document.getElementById("performanceIndicator");
    this.performanceBar = document.querySelector(".performance-bar");
    this.particles = document.getElementById("particles");
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeCounter();
    this.setupScrollToTop();
    this.setupPerformanceMonitoring();
    this.setupParticleAnimation();
    this.animatePageElements();
  }

  setupEventListeners() {
    // Counter button
    this.incrementButton.addEventListener("click", () => this.incrementCounter());

    // Modal close buttons
    const closeBtn = document.querySelector(".close");
    const alreadyClickedCloseBtn = document.querySelector(".alreadyClickedClose");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal(this.modal));
    }

    if (alreadyClickedCloseBtn) {
      alreadyClickedCloseBtn.addEventListener("click", () => this.closeModal(this.alreadyClickedModal));
    }

    // Close modals when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeModal(this.modal);
      }
      if (event.target === this.alreadyClickedModal) {
        this.closeModal(this.alreadyClickedModal);
      }
    });

    // Video control buttons
    const playAllBtn = document.getElementById("playAll");
    const speedButton = document.getElementById("speedButton");
    const resetButton = document.getElementById("resetButton");

    if (playAllBtn) {
      playAllBtn.addEventListener("click", () => this.controlVideos("play-all"));
    }

    if (speedButton) {
      speedButton.addEventListener("click", () => this.controlVideos("speed-up"));
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => this.controlVideos("reset"));
    }
  }

  async incrementCounter() {
    try {
      const response = await fetch("/api/increment-counter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // New unique visitor
        this.showModal(this.modal, data.message);
        this.updateCounter(data.count);
        this.animateCounter();
      } else {
        // Returning visitor
        this.showModal(this.alreadyClickedModal, data.message);
        this.updateCounter(data.count);
      }
    } catch (error) {
      console.error("Error incrementing counter:", error);
      this.showModal(this.modal, "Error occurred. Please try again.");
    }
  }

  async initializeCounter() {
    try {
      const response = await fetch("/api/get-counter");
      const data = await response.json();
      this.count = data.count;
      this.updateCounter(this.count);
    } catch (error) {
      console.error("Error getting counter:", error);
    }
  }

  updateCounter(newCount) {
    this.count = newCount;
    if (this.counterElement) {
      this.counterElement.textContent = this.count;
    }
  }

  animateCounter() {
    if (this.counterElement) {
      this.counterElement.style.transform = "scale(1.2)";
      this.counterElement.style.color = "#ffed4e";
      
      setTimeout(() => {
        this.counterElement.style.transform = "scale(1)";
        this.counterElement.style.color = "";
      }, 300);
    }
  }

  showModal(modal, message) {
    if (modal) {
      const messageElement = modal.querySelector("p");
      if (messageElement) {
        messageElement.textContent = message;
      }
      modal.style.display = "block";
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.closeModal(modal);
      }, 3000);
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.style.display = "none";
    }
  }

  async controlVideos(action) {
    try {
      const response = await fetch(`/api/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        this.showNotification(data.message, "success");
      }
    } catch (error) {
      console.error(`Error with ${action}:`, error);
      this.showNotification("Error occurred. Please try again.", "error");
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 2rem",
      borderRadius: "10px",
      color: "#fff",
      fontWeight: "600",
      zIndex: "10000",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      maxWidth: "300px",
      wordWrap: "break-word"
    });

    // Set background color based on type
    switch (type) {
      case "success":
        notification.style.background = "linear-gradient(135deg, #28a745, #20c997)";
        break;
      case "error":
        notification.style.background = "linear-gradient(135deg, #dc3545, #e74c3c)";
        break;
      default:
        notification.style.background = "linear-gradient(135deg, #17a2b8, #6f42c1)";
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  setupScrollToTop() {
    if (this.scrollToTopBtn) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          this.scrollToTopBtn.classList.add("visible");
        } else {
          this.scrollToTopBtn.classList.remove("visible");
        }
      });

      this.scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  setupPerformanceMonitoring() {
    if (this.performanceIndicator && this.performanceBar) {
      // Monitor page load performance
      window.addEventListener("load", () => {
        setTimeout(() => {
          const loadTime = performance.now();
          const performanceScore = Math.min(100, Math.max(0, 100 - (loadTime / 100)));
          
          this.performanceBar.style.width = `${performanceScore}%`;
          
          // Color coding based on performance
          if (performanceScore >= 80) {
            this.performanceBar.style.background = "linear-gradient(90deg, #28a745, #20c997)";
          } else if (performanceScore >= 60) {
            this.performanceBar.style.background = "linear-gradient(90deg, #ffc107, #fd7e14)";
          } else {
            this.performanceBar.style.background = "linear-gradient(90deg, #dc3545, #e74c3c)";
          }
        }, 1000);
      });

      // Monitor scroll performance
      let scrollTimeout;
      window.addEventListener("scroll", () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
          const scrollPerformance = this.measureScrollPerformance();
          this.performanceBar.style.width = `${scrollPerformance}%`;
        }, 100);
      });
    }
  }

  measureScrollPerformance() {
    // Simple scroll performance measurement
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Return a performance score based on scroll position
    return Math.min(100, Math.max(0, 100 - scrollPercent * 0.1));
  }

  setupParticleAnimation() {
    if (this.particles) {
      // Add more particles dynamically
      this.addMoreParticles();
      
      // Animate particles on scroll
      window.addEventListener("scroll", () => {
        this.animateParticlesOnScroll();
      });
    }
  }

  addMoreParticles() {
    if (this.particles) {
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 10 + "s";
        particle.style.animationDuration = (Math.random() * 4 + 6) + "s";
        this.particles.appendChild(particle);
      }
    }
  }

  animateParticlesOnScroll() {
    if (this.particles) {
      const particles = this.particles.querySelectorAll(".particle");
      particles.forEach((particle, index) => {
        const scrollY = window.pageYOffset;
        const speed = scrollY * 0.1;
        particle.style.transform = `translateY(${speed}px)`;
      });
    }
  }

  animatePageElements() {
    // Animate elements on page load
    const animatedElements = document.querySelectorAll(".video-item, .header__welcome, .header__content");
    
    animatedElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      
      setTimeout(() => {
        element.style.transition = "all 0.8s ease";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200);
    });
  }

  addHoverEffects() {
    // Add enhanced hover effects to video items
    const videoItems = document.querySelectorAll(".video-item");
    
    videoItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.transform = "scale(1.05) translateY(-10px)";
        item.style.boxShadow = "0 20px 40px rgba(255, 215, 0, 0.3)";
      });
      
      item.addEventListener("mouseleave", () => {
        item.style.transform = "scale(1) translateY(0)";
        item.style.boxShadow = "";
      });
    });
  }

  setupIntersectionObserver() {
    // Lazy load and animate elements as they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all video items
    const videoItems = document.querySelectorAll(".video-item");
    videoItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(50px)";
      item.style.transition = "all 0.8s ease";
      observer.observe(item);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const nftShowcase = new NFTShowcase();
  
  // Add additional hover effects
  nftShowcase.addHoverEffects();
  
  // Setup intersection observer for scroll animations
  nftShowcase.setupIntersectionObserver();
  
  // Remove loading screen after initialization
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }, 2500);
});

// Performance optimization
window.addEventListener('load', () => {
  // Lazy load images and videos
  const lazyElements = document.querySelectorAll('[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.tagName === 'IMG') {
            element.src = element.dataset.src || element.src;
          }
          lazyObserver.unobserve(element);
        }
      });
    });
    
    lazyElements.forEach(element => lazyObserver.observe(element));
  }
});

// Add touch gesture support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe up - could trigger special action
      console.log('Swipe up detected');
    } else {
      // Swipe down - could trigger special action
      console.log('Swipe down detected');
    }
  }
}

