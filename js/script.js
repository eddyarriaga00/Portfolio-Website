/* ===========================
   COMPLETE MOBILE-OPTIMIZED PORTFOLIO SCRIPT WITH ENHANCED SETTINGS
   =========================== */

'use strict';

// ===========================
// GLOBAL VARIABLES
// ===========================

let scrollSpeed = 0;
let lastScrollTime = Date.now();
let lastScrollTop = 0;

// Audio player variables
const audioPlayer = document.getElementById('audioPlayer');
let currentTrack = -1;
let isPlaying = false;
let volume = 0.7;

// Updated track data with corrected file paths
const tracks = [
    {
        title: "Say Slatt Say Ski",
        artist: "Lucki",
        src: "./music/sayslattsayskiLucki.mp3"
    },
    {
        title: "Limerence",
        artist: "Lucki",
        src: "./music/limerenceLucki.mp3"
    },
    {
        title: "Go Hard 2.0",
        artist: "Juice WRLD",
        src: "./music/gohardJuiceWRLD.mp3"
    }
];

// Performance optimization flags
const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /iPad|Android(?=.*Mobile)/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window;

// Device type detection
const deviceType = (() => {
    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
})();

// Cached DOM elements
const elements = {};

// Loading state
let isLoadingComplete = false;

// Settings state
let currentSettingsSection = 'main';
let settings = {
    cursor: {
        enabled: !isMobile && !isTouch,
        size: 12,
        opacity: 100,
        followerSize: 36
    },
    misc: {
        reducedMotion: prefersReducedMotion || isLowEndDevice,
        autoplayMusic: false,
        showFloatingElements: true,
        showParticles: true,
        showCodeSnippets: !isMobile,
        showGeometricShapes: !isMobile,
        animationSpeed: isLowEndDevice ? 50 : 100,
        parallaxIntensity: isMobile ? 0 : 100
    }
};

// Enhanced floating emoji data for different themes
const themeEmojis = {
    default: ['💻', '⚡', '🚀', '🔥', '✨', '💡', '🎯', '🌟', '⭐', '🎨'],
    github: ['🐙', '🔀', '📝', '🔧', '⚙️', '📊', '🎯', '✅', '🚀', '🌟'],
    discord: ['🎮', '🎯', '💬', '🔊', '🎵', '⚡', '🌟', '🎪', '🎭', '🎨'],
    spotify: ['🎵', '🎶', '🎧', '🎤', '🎸', '🥁', '🎹', '🎺', '🎻', '🎪'],
    vscode: ['💻', '⌨️', '🖥️', '📱', '⚡', '🔧', '⚙️', '🎯', '📊', '🚀'],
    ocean: ['🌊', '🐠', '🐙', '🦈', '🐢', '🌺', '🏝️', '⛵', '🌴', '🦑'],
    jojos: ['🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀'] // Only pink bow for JoJo's theme
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('load', handleWindowLoad);

function initializeApp() {
    console.log('🚀 Initializing portfolio app...');
    console.log('Device type:', deviceType);
    console.log('Is mobile:', isMobile);
    console.log('Is tablet:', isTablet);
    console.log('Is touch device:', isTouch);

    cacheElements();
    loadSettings();
    setupDeviceOptimizations();
    initCustomCursor();
    initNavigation();
    initScrollAnimations();
    initParallax();
    initTypingAnimation();
    init3DTiltEffects();
    initSettingsPanel();
    initThemeSystem();
    initCustomThemeMaker();
    initAudioPlayer();
    initAudioControls();
    initMobileMenu();
    initBackToTop();
    initAdvancedSettings();
    initMobileOptimizations();
    initFloatingEmojis();

    // Performance optimization
    if (isLowEndDevice || prefersReducedMotion || settings.misc.reducedMotion) {
        disableHeavyAnimations();
    }

    if (isMobile) {
        optimizeForMobile();
    }

    console.log('✅ Portfolio app initialized successfully');
}

function handleWindowLoad() {
    // Fixed timing: ensure loading screen shows for full duration
    setTimeout(() => {
        isLoadingComplete = true;
        hideLoadingScreen();
    }, 4500);
}

function cacheElements() {
    elements.loadingScreen = document.getElementById('loadingScreen');
    elements.navbar = document.getElementById('navbar');
    elements.cursor = document.querySelector('.custom-cursor');
    elements.follower = document.querySelector('.cursor-follower');
    elements.heroTitle = document.querySelector('.hero-title');
    elements.settingsBtn = document.getElementById('settingsBtn');
    elements.settingsMenu = document.getElementById('settingsMenu');
    elements.settingsMainMenu = document.getElementById('settingsMainMenu');
    elements.settingsCloseBtn = document.getElementById('settingsCloseBtn');
    elements.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    elements.mobileMenu = document.getElementById('mobileMenu');
    elements.audioPlayer = document.getElementById('audioPlayer');
    elements.playPauseBtn = document.getElementById('playPauseBtn');
    elements.prevBtn = document.getElementById('prevBtn');
    elements.nextBtn = document.getElementById('nextBtn');
    elements.progressBar = document.getElementById('progressBar');
    elements.progressFill = document.getElementById('progressFill');
    elements.volumeSlider = document.getElementById('volumeSlider');
    elements.volumeSliderFill = document.getElementById('volumeSliderFill');
    elements.currentTime = document.getElementById('currentTime');
    elements.duration = document.getElementById('duration');
    elements.currentTrackTitle = document.getElementById('currentTrackTitle');
    elements.currentTrackArtist = document.getElementById('currentTrackArtist');
    elements.audioError = document.getElementById('audioError');
    elements.playlist = document.getElementById('playlist');
    elements.primaryColorPicker = document.getElementById('primaryColor');
    elements.accentColorPicker = document.getElementById('accentColor');
    elements.applyCustomThemeBtn = document.getElementById('applyCustomTheme');
    elements.backToTop = document.getElementById('backToTop');

    // Settings elements
    elements.mouseSection = document.getElementById('mouseSection');
    elements.themeSection = document.getElementById('themeSection');
    elements.musicSection = document.getElementById('musicSection');
    elements.miscSection = document.getElementById('miscSection');

    // Cursor settings
    elements.cursorEnabled = document.getElementById('cursorEnabled');
    elements.cursorSize = document.getElementById('cursorSize');
    elements.cursorSizeValue = document.getElementById('cursorSizeValue');
    elements.cursorOpacity = document.getElementById('cursorOpacity');
    elements.cursorOpacityValue = document.getElementById('cursorOpacityValue');
    elements.followerSize = document.getElementById('followerSize');
    elements.followerSizeValue = document.getElementById('followerSizeValue');

    // Enhanced misc settings
    elements.reducedMotion = document.getElementById('reducedMotion');
    elements.autoplayMusic = document.getElementById('autoplayMusic');
    elements.showFloatingElements = document.getElementById('showFloatingElements');
    elements.showParticles = document.getElementById('showParticles');
    elements.showCodeSnippets = document.getElementById('showCodeSnippets');
    elements.showGeometricShapes = document.getElementById('showGeometricShapes');
    elements.animationSpeed = document.getElementById('animationSpeed');
    elements.animationSpeedValue = document.getElementById('animationSpeedValue');
    elements.parallaxIntensity = document.getElementById('parallaxIntensity');
    elements.parallaxIntensityValue = document.getElementById('parallaxIntensityValue');
    elements.resetSettings = document.getElementById('resetSettings');
}

// ===========================
// FLOATING EMOJIS SYSTEM
// ===========================

function initFloatingEmojis() {
    // Always create floating emojis, just adjust for mobile
    createFloatingEmojis();
    
    // Update emojis when theme changes
    document.addEventListener('themeChanged', updateFloatingEmojis);
}

function createFloatingEmojis() {
    // Remove existing emoji elements
    document.querySelectorAll('.floating-emoji').forEach(el => el.remove());

    const currentTheme = document.body.getAttribute('data-theme') || 'default';
    const emojis = themeEmojis[currentTheme] || themeEmojis.default;
    
    // Create emoji containers for each section
    const sections = [
        { selector: '.hero-section', container: '.floating-elements' },
        { selector: '.about-section', container: null },
        { selector: '.skills-section', container: null },
        { selector: '.projects-section', container: null },
        { selector: '.contact-section', container: null }
    ];

    sections.forEach((section, sectionIndex) => {
        const sectionElement = document.querySelector(section.selector);
        if (!sectionElement) return;

        let container;
        if (section.container) {
            container = sectionElement.querySelector(section.container);
        } else {
            // Create floating container for sections without one
            container = document.createElement('div');
            container.className = 'floating-elements';
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '1';
            container.style.display = 'block';
            sectionElement.style.position = 'relative';
            sectionElement.appendChild(container);
        }

        if (!container) return;

        // Number of emojis per section - more for mobile visibility
        const emojiCount = isMobile ? 
            (currentTheme === 'jojos' ? 20 : 15) : 
            (currentTheme === 'jojos' ? 15 : 10);
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.className = `floating-emoji ${currentTheme}-${i + 1}`;
            emoji.textContent = emojis[i % emojis.length];
            
            // Random positioning
            emoji.style.position = 'absolute';
            emoji.style.left = Math.random() * 90 + '%';
            emoji.style.top = Math.random() * 90 + '%';
            emoji.style.animationDelay = Math.random() * 25 + 's';
            emoji.style.animationDuration = (Math.random() * 10 + 25) + 's';
            emoji.style.pointerEvents = 'none';
            emoji.style.userSelect = 'none';
            emoji.style.zIndex = '1';
            
            // Enhanced mobile visibility
            if (isMobile) {
                emoji.style.fontSize = (Math.random() * 0.8 + 1.5) + 'rem';
                emoji.style.opacity = Math.random() * 0.3 + 0.8;
                emoji.style.animationDuration = (Math.random() * 15 + 30) + 's';
            } else {
                emoji.style.fontSize = (Math.random() * 0.5 + 1) + 'rem';
                emoji.style.opacity = Math.random() * 0.4 + 0.3;
            }
            
            container.appendChild(emoji);
        }
    });
}

function updateFloatingEmojis() {
    if (!settings.misc.showFloatingElements || isMobile) {
        return;
    }
    
    // Smooth transition: fade out old emojis, create new ones
    const existingEmojis = document.querySelectorAll('.floating-emoji');
    existingEmojis.forEach(emoji => {
        emoji.style.transition = 'opacity 0.5s ease-out';
        emoji.style.opacity = '0';
    });
    
    setTimeout(() => {
        createFloatingEmojis();
    }, 500);
}

function removeFloatingEmojis() {
    document.querySelectorAll('.floating-emoji').forEach(el => el.remove());
}

// ===========================
// DEVICE OPTIMIZATIONS
// ===========================

function setupDeviceOptimizations() {
    // Add device-specific classes
    document.body.classList.add(`device-${deviceType}`);

    if (isMobile) {
        document.body.classList.add('mobile-device');
    }

    if (isTouch) {
        document.body.classList.add('touch-device');
    }

    if (isLowEndDevice) {
        document.body.classList.add('low-end-device');
    }
}

function initMobileOptimizations() {
    if (isMobile) {
        // Optimize viewport
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        }

        // Prevent bounce scrolling on iOS
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });

        // Optimize touch events
        const passiveEvents = ['touchstart', 'touchmove', 'touchend'];
        passiveEvents.forEach(event => {
            document.addEventListener(event, () => { }, { passive: true });
        });

        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add visual feedback for touch interactions
        addTouchFeedback();
    }
}

function addTouchFeedback() {
    const touchElements = document.querySelectorAll('button, .nav-link, .mobile-nav-link, .contact-link, .project-link, .settings-category, .theme-option, .playlist-item, .control-btn');

    touchElements.forEach(element => {
        element.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });

        element.addEventListener('touchend', function () {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
    });
}

// ===========================
// SETTINGS MANAGEMENT (ENHANCED)
// ===========================

function loadSettings() {
    const savedSettings = localStorage.getItem('portfolio-settings');
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            settings = { ...settings, ...parsed };
        } catch (e) {
            console.warn('Failed to parse saved settings:', e);
        }
    }

    // Apply device-specific defaults
    if (isMobile) {
        settings.cursor.enabled = false;
        settings.misc.showFloatingElements = true;
        settings.misc.showParticles = true;
        settings.misc.parallaxIntensity = 0;
    }

    applyLoadedSettings();
}

function saveSettings() {
    try {
        localStorage.setItem('portfolio-settings', JSON.stringify(settings));
    } catch (e) {
        console.warn('Failed to save settings:', e);
    }
}

function applyLoadedSettings() {
    // Apply cursor settings
    if (settings.cursor) {
        updateCursorVariables();

        if (!settings.cursor.enabled || isMobile || isTouch) {
            if (elements.cursor) elements.cursor.style.display = 'none';
            if (elements.follower) elements.follower.style.display = 'none';
            document.body.style.cursor = 'auto';
        }
    }

    // Apply misc settings
    if (settings.misc) {
        if (settings.misc.reducedMotion) {
            disableHeavyAnimations();
        }

        updateFloatingElementsVisibility();
        updateAnimationSpeed();
        updateParallaxIntensity();
    }
}

function updateCursorVariables() {
    const root = document.documentElement;
    root.style.setProperty('--cursor-size', settings.cursor.size + 'px');
    root.style.setProperty('--cursor-opacity', settings.cursor.opacity / 100);
    root.style.setProperty('--follower-size', settings.cursor.followerSize + 'px');
}

function updateFloatingElementsVisibility() {
    const floatingElements = document.querySelectorAll('.floating-element');
    const codeSnippets = document.querySelectorAll('.floating-code');
    const geometricShapes = document.querySelectorAll('.geometric-shape');
    const particles = document.querySelectorAll('.floating-tech-icon, .floating-symbols, .floating-contact-icons');
    const emojis = document.querySelectorAll('.floating-emoji');

    // Show/hide all floating elements
    floatingElements.forEach(el => {
        el.style.display = settings.misc.showFloatingElements ? '' : 'none';
    });

    // Show/hide emojis
    emojis.forEach(el => {
        el.style.display = settings.misc.showFloatingElements ? '' : 'none';
    });

    // Show/hide specific element types
    if (settings.misc.showFloatingElements) {
        codeSnippets.forEach(el => {
            el.style.display = settings.misc.showCodeSnippets ? '' : 'none';
        });

        geometricShapes.forEach(el => {
            el.style.display = settings.misc.showGeometricShapes ? '' : 'none';
        });

        particles.forEach(el => {
            el.style.display = settings.misc.showParticles ? '' : 'none';
        });
    }
}

function updateAnimationSpeed() {
    const root = document.documentElement;
    const speed = settings.misc.animationSpeed / 100;
    root.style.setProperty('--animation-speed', speed);

    // Update individual animation durations
    const animatedElements = document.querySelectorAll('.floating-element, .floating-emoji');
    animatedElements.forEach(el => {
        if (el.style.animationDuration) {
            const baseDuration = parseFloat(el.style.animationDuration) || 25;
            el.style.animationDuration = `${baseDuration / speed}s`;
        }
    });
}

function updateParallaxIntensity() {
    const root = document.documentElement;
    const intensity = settings.misc.parallaxIntensity / 100;
    root.style.setProperty('--parallax-intensity', intensity);
}

function resetAllSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
        localStorage.removeItem('portfolio-settings');
        localStorage.removeItem('preferred-theme');
        localStorage.removeItem('custom-theme');

        // Reset to defaults with device considerations
        settings = {
            cursor: {
                enabled: !isMobile && !isTouch,
                size: 12,
                opacity: 100,
                followerSize: 36
            },
            misc: {
                reducedMotion: prefersReducedMotion || isLowEndDevice,
                autoplayMusic: false,
                showFloatingElements: !isMobile,
                showParticles: !isMobile,
                showCodeSnippets: !isMobile,
                showGeometricShapes: !isMobile,
                animationSpeed: isLowEndDevice ? 50 : 100,
                parallaxIntensity: isMobile ? 0 : 100
            }
        };

        // Reload page to apply all changes
        location.reload();
    }
}

// ===========================
// ENHANCED SETTINGS SYSTEM
// ===========================

function initAdvancedSettings() {
    initSettingsNavigation();
    initCursorSettings();
    initEnhancedMiscSettings();
    populateSettingsValues();
}

function initSettingsNavigation() {
    // Category navigation
    const settingsCategories = document.querySelectorAll('.settings-category');
    settingsCategories.forEach(category => {
        category.addEventListener('click', () => {
            const section = category.getAttribute('data-section');
            if (section) {
                showSettingsSection(section);
            }
        });
    });

    // Back buttons
    const backButtons = document.querySelectorAll('.settings-back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-back');
            if (target === 'main') {
                showSettingsSection('main');
            }
        });
    });

    // Close button for mobile
    if (elements.settingsCloseBtn) {
        elements.settingsCloseBtn.addEventListener('click', closeSettings);
    }
}

function showSettingsSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.settings-section-view').forEach(section => {
        section.classList.remove('active');
    });

    // Toggle visibility based on what was clicked
    if (sectionName === 'main') {
        elements.settingsMainMenu.classList.add('active');
    } else {
        elements.settingsMainMenu.classList.remove('active');

        const target = document.getElementById(sectionName + 'Section');
        if (target) {
            target.classList.add('active');
        }
    }

    currentSettingsSection = sectionName;

    // Scroll to top for better UX
    const scrollContainer = document.querySelector('.settings-scroll-container');
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
}

function initCursorSettings() {
    if (!elements.cursorEnabled) return;

    // Cursor enabled toggle
    elements.cursorEnabled.addEventListener('change', (e) => {
        settings.cursor.enabled = e.target.checked;

        if (!isMobile && !isTouch) {
            if (settings.cursor.enabled) {
                if (elements.cursor) elements.cursor.style.display = 'block';
                if (elements.follower) elements.follower.style.display = 'block';
                document.body.style.cursor = 'none';
            } else {
                if (elements.cursor) elements.cursor.style.display = 'none';
                if (elements.follower) elements.follower.style.display = 'none';
                document.body.style.cursor = 'auto';
            }
        }

        saveSettings();
    });

    // Cursor size slider
    if (elements.cursorSize) {
        elements.cursorSize.addEventListener('input', (e) => {
            settings.cursor.size = parseInt(e.target.value);
            if (elements.cursorSizeValue) {
                elements.cursorSizeValue.textContent = settings.cursor.size + 'px';
            }
            updateCursorVariables();
            saveSettings();
        });
    }

    // Cursor opacity slider
    if (elements.cursorOpacity) {
        elements.cursorOpacity.addEventListener('input', (e) => {
            settings.cursor.opacity = parseInt(e.target.value);
            if (elements.cursorOpacityValue) {
                elements.cursorOpacityValue.textContent = settings.cursor.opacity + '%';
            }
            updateCursorVariables();
            saveSettings();
        });
    }

    // Follower size slider
    if (elements.followerSize) {
        elements.followerSize.addEventListener('input', (e) => {
            settings.cursor.followerSize = parseInt(e.target.value);
            if (elements.followerSizeValue) {
                elements.followerSizeValue.textContent = settings.cursor.followerSize + 'px';
            }
            updateCursorVariables();
            saveSettings();
        });
    }
}

function initEnhancedMiscSettings() {
    if (!elements.reducedMotion) return;

    // Reduced motion toggle
    elements.reducedMotion.addEventListener('change', (e) => {
        settings.misc.reducedMotion = e.target.checked;

        if (settings.misc.reducedMotion) {
            disableHeavyAnimations();
        } else {
            enableHeavyAnimations();
        }

        saveSettings();
    });

    // Autoplay music toggle
    if (elements.autoplayMusic) {
        elements.autoplayMusic.addEventListener('change', (e) => {
            settings.misc.autoplayMusic = e.target.checked;
            saveSettings();
        });
    }

    // Show floating elements toggle
    if (elements.showFloatingElements) {
        elements.showFloatingElements.addEventListener('change', (e) => {
            settings.misc.showFloatingElements = e.target.checked;
            updateFloatingElementsVisibility();
            
            if (e.target.checked) {
                initFloatingEmojis();
            } else {
                removeFloatingEmojis();
            }
            
            saveSettings();
        });
    }

    // Show particles toggle
    if (elements.showParticles) {
        elements.showParticles.addEventListener('change', (e) => {
            settings.misc.showParticles = e.target.checked;
            updateFloatingElementsVisibility();
            saveSettings();
        });
    }

    // Show code snippets toggle
    if (elements.showCodeSnippets) {
        elements.showCodeSnippets.addEventListener('change', (e) => {
            settings.misc.showCodeSnippets = e.target.checked;
            updateFloatingElementsVisibility();
            saveSettings();
        });
    }

    // Show geometric shapes toggle
    if (elements.showGeometricShapes) {
        elements.showGeometricShapes.addEventListener('change', (e) => {
            settings.misc.showGeometricShapes = e.target.checked;
            updateFloatingElementsVisibility();
            saveSettings();
        });
    }

    // Animation speed slider
    if (elements.animationSpeed) {
        elements.animationSpeed.addEventListener('input', (e) => {
            settings.misc.animationSpeed = parseInt(e.target.value);
            if (elements.animationSpeedValue) {
                elements.animationSpeedValue.textContent = settings.misc.animationSpeed + '%';
            }
            updateAnimationSpeed();
            saveSettings();
        });
    }

    // Parallax intensity slider
    if (elements.parallaxIntensity) {
        elements.parallaxIntensity.addEventListener('input', (e) => {
            settings.misc.parallaxIntensity = parseInt(e.target.value);
            if (elements.parallaxIntensityValue) {
                elements.parallaxIntensityValue.textContent = settings.misc.parallaxIntensity + '%';
            }
            updateParallaxIntensity();
            saveSettings();
        });
    }

    // Reset settings button
    if (elements.resetSettings) {
        elements.resetSettings.addEventListener('click', resetAllSettings);
    }
}

function populateSettingsValues() {
    // Populate cursor settings
    if (elements.cursorEnabled) {
        elements.cursorEnabled.checked = settings.cursor.enabled;
    }

    if (elements.cursorSize) {
        elements.cursorSize.value = settings.cursor.size;
        if (elements.cursorSizeValue) {
            elements.cursorSizeValue.textContent = settings.cursor.size + 'px';
        }
    }

    if (elements.cursorOpacity) {
        elements.cursorOpacity.value = settings.cursor.opacity;
        if (elements.cursorOpacityValue) {
            elements.cursorOpacityValue.textContent = settings.cursor.opacity + '%';
        }
    }

    if (elements.followerSize) {
        elements.followerSize.value = settings.cursor.followerSize;
        if (elements.followerSizeValue) {
            elements.followerSizeValue.textContent = settings.cursor.followerSize + 'px';
        }
    }

    // Populate enhanced misc settings
    if (elements.reducedMotion) {
        elements.reducedMotion.checked = settings.misc.reducedMotion;
    }

    if (elements.autoplayMusic) {
        elements.autoplayMusic.checked = settings.misc.autoplayMusic;
    }

    if (elements.showFloatingElements) {
        elements.showFloatingElements.checked = settings.misc.showFloatingElements;
    }

    if (elements.showParticles) {
        elements.showParticles.checked = settings.misc.showParticles;
    }

    if (elements.showCodeSnippets) {
        elements.showCodeSnippets.checked = settings.misc.showCodeSnippets;
    }

    if (elements.showGeometricShapes) {
        elements.showGeometricShapes.checked = settings.misc.showGeometricShapes;
    }

    if (elements.animationSpeed) {
        elements.animationSpeed.value = settings.misc.animationSpeed;
        if (elements.animationSpeedValue) {
            elements.animationSpeedValue.textContent = settings.misc.animationSpeed + '%';
        }
    }

    if (elements.parallaxIntensity) {
        elements.parallaxIntensity.value = settings.misc.parallaxIntensity;
        if (elements.parallaxIntensityValue) {
            elements.parallaxIntensityValue.textContent = settings.misc.parallaxIntensity + '%';
        }
    }
}

function enableHeavyAnimations() {
    const heavyAnimationElements = document.querySelectorAll('.floating-element, .floating-emoji');

    heavyAnimationElements.forEach(el => {
        el.style.animation = '';
    });

    updateFloatingElementsVisibility();
    updateAnimationSpeed();

    // Reset animation durations
    document.documentElement.style.removeProperty('--animation-duration');
    
    // Re-initialize emojis if floating elements are enabled
    if (settings.misc.showFloatingElements) {
        initFloatingEmojis();
    }
}

// ===========================
// LOADING SCREEN
// ===========================

function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.add('fade-out');

        // Remove from DOM after animation completes
        setTimeout(() => {
            if (elements.loadingScreen.parentNode) {
                elements.loadingScreen.parentNode.removeChild(elements.loadingScreen);
            }
        }, 1000);
    }
}

// ===========================
// BACK TO TOP FUNCTIONALITY
// ===========================

function initBackToTop() {
    if (!elements.backToTop) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            elements.backToTop.classList.add('show');
        } else {
            elements.backToTop.classList.remove('show');
        }
    }, 100), { passive: true });

    // Smooth scroll to top when clicked
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================
// MOBILE OPTIMIZATIONS
// ===========================

function optimizeForMobile() {
    // Disable cursor on mobile
    if (elements.cursor) elements.cursor.style.display = 'none';
    if (elements.follower) elements.follower.style.display = 'none';
    document.body.style.cursor = 'auto';

    // Add mobile class for specific styling
    document.body.classList.add('mobile-device');

    // Optimize touch events with passive listeners
    const passiveOptions = { passive: true };
    document.addEventListener('touchstart', () => { }, passiveOptions);
    document.addEventListener('touchmove', () => { }, passiveOptions);
    document.addEventListener('touchend', () => { }, passiveOptions);

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Keep floating elements on mobile but optimized
    settings.misc.showFloatingElements = true;
    settings.misc.showParticles = true;
    settings.misc.showCodeSnippets = true;
    settings.misc.showGeometricShapes = true;
    settings.misc.parallaxIntensity = 0; // Still disable parallax

    updateFloatingElementsVisibility();
}

// ===========================
// MOBILE MENU (ENHANCED)
// ===========================

function initMobileMenu() {
    if (!elements.mobileMenuBtn || !elements.mobileMenu) return;

    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    elements.mobileMenu.addEventListener('click', (e) => {
        if (e.target === elements.mobileMenu) {
            closeMobileMenu();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const isActive = elements.mobileMenu.classList.contains('active');

    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    elements.mobileMenuBtn.classList.add('active');
    elements.mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    elements.mobileMenu.focus();
}

function closeMobileMenu() {
    elements.mobileMenuBtn.classList.remove('active');
    elements.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===========================
// AUDIO PLAYER FUNCTIONS (ENHANCED)
// ===========================

function initAudioPlayer() {
    if (!elements.audioPlayer) return;

    elements.audioPlayer.volume = volume;
    updateVolumeDisplay();

    // Audio event listeners with optimized handling
    elements.audioPlayer.addEventListener('loadedmetadata', handleMetadataLoaded);
    elements.audioPlayer.addEventListener('timeupdate', throttle(handleTimeUpdate, 100));
    elements.audioPlayer.addEventListener('ended', handleTrackEnded);
    elements.audioPlayer.addEventListener('error', handleAudioError);
    elements.audioPlayer.addEventListener('canplay', hideAudioError);
    elements.audioPlayer.addEventListener('play', () => setPlayButtonState(true));
    elements.audioPlayer.addEventListener('pause', () => setPlayButtonState(false));

    // Better error handling for load failures
    elements.audioPlayer.addEventListener('loadstart', () => {
        console.log('Audio loading started...');
    });

    elements.audioPlayer.addEventListener('canplaythrough', () => {
        console.log('Audio can play through');
        hideAudioError();
    });
}

function handleMetadataLoaded() {
    if (elements.duration) {
        elements.duration.textContent = formatTime(elements.audioPlayer.duration);
    }
    console.log('Metadata loaded successfully');
}

function handleTimeUpdate() {
    if (elements.audioPlayer.duration && elements.progressFill && elements.currentTime) {
        const progressPercent = (elements.audioPlayer.currentTime / elements.audioPlayer.duration) * 100;
        elements.progressFill.style.width = progressPercent + '%';
        elements.currentTime.textContent = formatTime(elements.audioPlayer.currentTime);
    }
}

function handleTrackEnded() {
    nextTrack();
}

function handleAudioError(e) {
    const error = e.target.error;
    let errorMessage = 'Audio file could not be loaded. ';

    if (error) {
        switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
                errorMessage += 'Playback was aborted.';
                break;
            case error.MEDIA_ERR_NETWORK:
                errorMessage += 'Network error occurred.';
                break;
            case error.MEDIA_ERR_DECODE:
                errorMessage += 'Audio file format not supported.';
                break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage += 'Audio file not found or format not supported.';
                break;
            default:
                errorMessage += 'Unknown error occurred.';
                break;
        }
    }

    console.error('Audio error:', errorMessage, 'Track:', currentTrack >= 0 ? tracks[currentTrack].src : 'none');
    showAudioError(errorMessage);
    setPlayButtonState(false);
}

function showAudioError(message = null) {
    if (elements.audioError) {
        if (message) {
            elements.audioError.textContent = message;
        }
        elements.audioError.classList.remove('hidden');
    }
}

function hideAudioError() {
    if (elements.audioError) {
        elements.audioError.classList.add('hidden');
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function setPlayButtonState(playing) {
    if (elements.playPauseBtn) {
        const playIcon = elements.playPauseBtn.querySelector('.play-icon');
        const pauseIcon = elements.playPauseBtn.querySelector('.pause-icon');

        if (playIcon && pauseIcon) {
            if (playing) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        }
    }
    isPlaying = playing;
}

function loadTrack(trackIndex) {
    if (trackIndex < 0 || trackIndex >= tracks.length) return;

    currentTrack = trackIndex;
    const track = tracks[trackIndex];

    console.log('Loading track:', track.title, 'from:', track.src);

    // Update UI
    if (elements.currentTrackTitle) elements.currentTrackTitle.textContent = track.title;
    if (elements.currentTrackArtist) elements.currentTrackArtist.textContent = track.artist;

    // Update playlist active state
    updatePlaylistActiveState(trackIndex);

    // Load audio with better error handling
    try {
        elements.audioPlayer.src = track.src;
        elements.audioPlayer.load();
        hideAudioError();
    } catch (error) {
        console.error('Error loading track:', error);
        showAudioError('Failed to load audio file: ' + track.title);
    }

    // Reset progress
    resetProgressDisplay();
}

function updatePlaylistActiveState(activeIndex) {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
    });
}

function resetProgressDisplay() {
    if (elements.progressFill) elements.progressFill.style.width = '0%';
    if (elements.currentTime) elements.currentTime.textContent = '0:00';
    if (elements.duration) elements.duration.textContent = '0:00';
}

function togglePlayPause() {
    if (currentTrack === -1) {
        loadTrack(0);
        return;
    }

    if (isPlaying) {
        elements.audioPlayer.pause();
    } else {
        const playPromise = elements.audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Play failed:', error);
                showAudioError('Playback failed. Please check if the audio file exists.');
            });
        }
    }
}

function nextTrack() {
    const nextIndex = (currentTrack + 1) % tracks.length;
    loadTrack(nextIndex);
    if (isPlaying) {
        setTimeout(() => {
            elements.audioPlayer.play().catch(e => {
                console.error('Auto-play failed:', e);
                showAudioError('Auto-play failed. Please try playing manually.');
            });
        }, 100);
    }
}

function prevTrack() {
    const prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    loadTrack(prevIndex);
    if (isPlaying) {
        setTimeout(() => {
            elements.audioPlayer.play().catch(e => {
                console.error('Auto-play failed:', e);
                showAudioError('Auto-play failed. Please try playing manually.');
            });
        }, 100);
    }
}

function seekTo(event) {
    if (elements.audioPlayer.duration) {
        const rect = elements.progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        elements.audioPlayer.currentTime = elements.audioPlayer.duration * percentage;
    }
}

function setVolume(value) {
    volume = Math.max(0, Math.min(1, value / 100));
    elements.audioPlayer.volume = volume;
    updateVolumeDisplay();
}

function updateVolumeDisplay() {
    if (elements.volumeSliderFill) {
        elements.volumeSliderFill.style.width = (volume * 100) + '%';
    }

    if (elements.volumeSlider) {
        elements.volumeSlider.value = volume * 100;
    }

    // Update volume icon based on level
    const volumeIcon = document.querySelector('.volume-icon-container svg');
    if (volumeIcon) {
        const paths = volumeIcon.querySelectorAll('path');
        paths.forEach(path => {
            if (volume === 0) {
                path.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
            } else if (volume < 0.5) {
                path.setAttribute('d', 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z');
            } else {
                path.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
            }
        });
    }
}

// ===========================
// CUSTOM CURSOR (ENHANCED FOR DESKTOP ONLY)
// ===========================

function initCustomCursor() {
    // Only initialize on non-touch devices
    if (!elements.cursor || !elements.follower || isMobile || isTouch || !settings.cursor.enabled) {
        return;
    }

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isMoving = false;

    // Optimized mouse move handler with RAF
    document.addEventListener('mousemove', throttle((e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;

        const halfSize = settings.cursor.size / 2;
        elements.cursor.style.transform = `translate3d(${mouseX - halfSize}px, ${mouseY - halfSize}px, 0)`;
    }, 16), { passive: true });

    // Smooth follower animation with RAF
    function animateFollower() {
        if (isMoving) {
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;

            const halfFollowerSize = settings.cursor.followerSize / 2;
            elements.follower.style.transform = `translate3d(${followerX - halfFollowerSize}px, ${followerY - halfFollowerSize}px, 0)`;
        }

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Enhanced hover effects for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-content, .logo-container, .theme-option, .playlist-item, .control-btn, .settings-category, input[type="range"], .toggle-switch');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (elements.cursor && elements.follower) {
                elements.cursor.style.transform += ' scale(1.5)';
                elements.follower.style.transform += ' scale(1.5)';
                elements.follower.style.opacity = '0.8';
            }
        });

        el.addEventListener('mouseleave', () => {
            if (elements.cursor && elements.follower) {
                elements.cursor.style.transform = elements.cursor.style.transform.replace(' scale(1.5)', '');
                elements.follower.style.transform = elements.follower.style.transform.replace(' scale(1.5)', '');
                elements.follower.style.opacity = 'calc(var(--cursor-opacity) * 0.6)';
            }
        });
    });

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
        if (elements.cursor && elements.follower) {
            elements.cursor.style.opacity = '0';
            elements.follower.style.opacity = '0';
        }
    });

    document.addEventListener('mouseenter', () => {
        if (elements.cursor && elements.follower) {
            elements.cursor.style.opacity = 'var(--cursor-opacity)';
            elements.follower.style.opacity = 'calc(var(--cursor-opacity) * 0.6)';
        }
    });
}

// ===========================
// NAVIGATION & SCROLLING (ENHANCED)
// ===========================

function initNavigation() {
    // Optimized scroll handler with passive listener
    window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
}

function handleScroll() {
    const currentTime = Date.now();
    const currentScrollTop = window.pageYOffset;

    const timeDelta = currentTime - lastScrollTime;
    const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
    scrollSpeed = scrollDelta / timeDelta;

    lastScrollTime = currentTime;
    lastScrollTop = currentScrollTop;

    // Update navbar with enhanced animation
    if (elements.navbar) {
        if (currentScrollTop > 100) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }
}

function handleAnchorClick(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        // Close mobile menu if open
        closeMobileMenu();

        // Close settings if open
        closeSettings();

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===========================
// SCROLL ANIMATIONS (ENHANCED)
// ===========================

function initScrollAnimations() {
    const observerOptions = {
        threshold: isMobile ? 0.1 : 0.05,
        rootMargin: isMobile ? '20px 0px -20px 0px' : '0px 0px -10px 0px'
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        el.dataset.delay = isMobile ? Math.min(index * 25, 150) : index * 50;
        observer.observe(el);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = scrollSpeed > 2 ? 0 : Math.min(entry.target.dataset.delay || 0, isMobile ? 150 : 300);

            setTimeout(() => {
                entry.target.classList.add('animated');

                // Animate numbers if present
                const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
                if (statNumbers.length > 0) {
                    animateNumbers(statNumbers);
                }
            }, delay);
        }
    });
}

function animateNumbers(numbers) {
    numbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        let current = 0;
        const increment = target / (isMobile ? 30 : 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.floor(current) + (target > 10 ? '+' : '');
        }, isMobile ? 60 : 40);
    });
}

// ===========================
// PARALLAX EFFECTS (DESKTOP ONLY)
// ===========================

function initParallax() {
    if (isLowEndDevice || prefersReducedMotion || isMobile || settings.misc.reducedMotion || settings.misc.parallaxIntensity === 0) return;

    window.addEventListener('scroll', throttle(handleParallax, 16), { passive: true });
}

function handleParallax() {
    if (settings.misc.parallaxIntensity === 0) return;

    const scrolled = window.pageYOffset;
    const intensity = settings.misc.parallaxIntensity / 100;
    const shapes = document.querySelectorAll('.geometric-shape');

    shapes.forEach((shape, index) => {
        const speed = (0.2 + (index * 0.1)) * intensity;
        const yPos = scrolled * speed;
        const rotation = scrolled * 0.05 * intensity;
        shape.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
    });
}

// ===========================
// TYPING ANIMATION (ENHANCED)
// ===========================

function initTypingAnimation() {
    if (!elements.heroTitle || prefersReducedMotion || settings.misc.reducedMotion) return;

    const titleText = elements.heroTitle.textContent.trim();
    elements.heroTitle.textContent = '';
    elements.heroTitle.style.opacity = '1'; // Show container immediately

    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            elements.heroTitle.textContent = titleText.slice(0, i);
            i++;
            if (i > titleText.length) {
                clearInterval(typeInterval);
                elements.heroTitle.textContent = titleText;
            }
        }, isMobile ? 120 : 100);
    }, 1500);
}

// ===========================
// 3D TILT EFFECTS (DESKTOP ONLY)
// ===========================

function init3DTiltEffects() {
    if (isLowEndDevice || prefersReducedMotion || isMobile || isTouch || settings.misc.reducedMotion) return;

    const tiltElements = document.querySelectorAll('.project-card, .skill-card');

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
}

function resetTilt() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
}

// ===========================
// SETTINGS PANEL (ENHANCED MOBILE SUPPORT)
// ===========================

function initSettingsPanel() {
    if (!elements.settingsBtn || !elements.settingsMenu) return;

    elements.settingsBtn.addEventListener('click', toggleSettings);

    // Click outside to close (but not on mobile)
    document.addEventListener('click', (e) => {
        if (!isMobile && !elements.settingsBtn.contains(e.target) && !elements.settingsMenu.contains(e.target)) {
            closeSettings();
        }
    });

    // Enhanced mobile handling
    if (isMobile) {
        // Add touch event handling
        elements.settingsBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggleSettings();
        });

        // Prevent body scroll when settings open
        elements.settingsMenu.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    // Show main menu by default
    showSettingsSection('main');
}

function toggleSettings() {
    if (elements.settingsMenu.classList.contains('active')) {
        closeSettings();
    } else {
        openSettings();
    }
}

function openSettings() {
    elements.settingsMenu.classList.add('active');
    showSettingsSection('main');

    // Prevent body scroll on mobile when settings are open
    if (isMobile) {
        document.body.style.overflow = 'hidden';
    }
}

function closeSettings() {
    elements.settingsMenu.classList.remove('active');

    // Restore body scroll
    if (isMobile) {
        document.body.style.overflow = '';
    }
}

// ===========================
// THEME SYSTEM (ENHANCED WITH JOJOS)
// ===========================

function initThemeSystem() {
    const themeOptions = document.querySelectorAll('.theme-option');

    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            if (theme) {
                setTheme(theme);
            }
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
}

function setTheme(themeName) {
    const previousTheme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', themeName);

    try {
        localStorage.setItem('preferred-theme', themeName);
    } catch (e) {
        console.warn('Failed to save theme preference:', e);
    }

    // Update active theme option
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    const selectedOption = document.querySelector(`[data-theme="${themeName}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }

    // Clear custom theme if switching to preset
    if (themeName !== 'custom') {
        try {
            localStorage.removeItem('custom-theme');
        } catch (e) {
            console.warn('Failed to remove custom theme:', e);
        }
    }

    // Update floating emojis if theme changed and they're visible
    if (previousTheme !== themeName && settings.misc.showFloatingElements && !isMobile) {
        updateFloatingEmojis();
    }

    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName, previousTheme } }));
}

// ===========================
// CUSTOM THEME MAKER (ENHANCED)
// ===========================

function initCustomThemeMaker() {
    if (!elements.primaryColorPicker || !elements.accentColorPicker || !elements.applyCustomThemeBtn) return;

    elements.applyCustomThemeBtn.addEventListener('click', applyCustomTheme);

    // Load saved custom theme
    try {
        const savedCustomTheme = localStorage.getItem('custom-theme');
        if (savedCustomTheme) {
            const customTheme = JSON.parse(savedCustomTheme);
            elements.primaryColorPicker.value = customTheme.primary;
            elements.accentColorPicker.value = customTheme.accent;
        }
    } catch (e) {
        console.warn('Failed to load custom theme:', e);
    }
}

function applyCustomTheme() {
    const primaryColor = elements.primaryColorPicker.value;
    const accentColor = elements.accentColorPicker.value;

    // Generate custom theme CSS variables
    const customTheme = generateCustomTheme(primaryColor, accentColor);

    // Apply custom theme
    applyThemeVariables(customTheme);

    // Save custom theme
    try {
        localStorage.setItem('custom-theme', JSON.stringify({
            primary: primaryColor,
            accent: accentColor
        }));
    } catch (e) {
        console.warn('Failed to save custom theme:', e);
    }

    // Update theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    // Add custom theme to body
    document.body.setAttribute('data-theme', 'custom');

    try {
        localStorage.setItem('preferred-theme', 'custom');
    } catch (e) {
        console.warn('Failed to save theme preference:', e);
    }

    // Visual feedback
    elements.applyCustomThemeBtn.textContent = 'Applied!';
    setTimeout(() => {
        elements.applyCustomThemeBtn.textContent = 'Apply Custom Theme';
    }, 2000);
}

function generateCustomTheme(primaryColor, accentColor) {
    // Convert hex to RGB for calculations
    const primaryRGB = hexToRgb(primaryColor);
    const accentRGB = hexToRgb(accentColor);

    // Generate color variations
    const secondaryColor = darkenColor(primaryColor, 0.1);
    const tertiaryColor = lightenColor(primaryColor, 0.1);
    const quaternaryColor = lightenColor(primaryColor, 0.2);

    // Calculate appropriate text colors
    const primaryTextColor = getContrastColor(primaryColor);
    const secondaryTextColor = blendColors(primaryTextColor, accentColor, 0.7);
    const tertiaryTextColor = blendColors(primaryTextColor, accentColor, 0.4);

    return {
        '--primary-bg': primaryColor,
        '--secondary-bg': secondaryColor,
        '--tertiary-bg': tertiaryColor,
        '--quaternary-bg': quaternaryColor,
        '--primary-text': primaryTextColor,
        '--secondary-text': secondaryTextColor,
        '--tertiary-text': tertiaryTextColor,
        '--accent-color': accentColor,
        '--border-color': `${accentColor}33`, // 20% opacity
        '--hover-bg': `${accentColor}1A`, // 10% opacity
        '--shadow-light': `${accentColor}4D`, // 30% opacity
        '--shadow-dark': `${primaryColor}CC`, // 80% opacity
        '--gradient-primary': `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        '--gradient-secondary': `linear-gradient(135deg, ${secondaryColor} 0%, ${tertiaryColor} 100%)`,
        '--gradient-accent': `linear-gradient(135deg, ${accentColor} 0%, ${lightenColor(accentColor, 0.1)} 100%)`
    };
}

function applyThemeVariables(themeVariables) {
    const root = document.documentElement;
    Object.entries(themeVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function darkenColor(hex, factor) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    return rgbToHex(
        Math.round(rgb.r * (1 - factor)),
        Math.round(rgb.g * (1 - factor)),
        Math.round(rgb.b * (1 - factor))
    );
}

function lightenColor(hex, factor) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    return rgbToHex(
        Math.round(rgb.r + (255 - rgb.r) * factor),
        Math.round(rgb.g + (255 - rgb.g) * factor),
        Math.round(rgb.b + (255 - rgb.b) * factor)
    );
}

function getContrastColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#ffffff';

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

function blendColors(color1, color2, ratio) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    return rgbToHex(
        Math.round(rgb1.r * ratio + rgb2.r * (1 - ratio)),
        Math.round(rgb1.g * ratio + rgb2.g * (1 - ratio)),
        Math.round(rgb1.b * ratio + rgb2.b * (1 - ratio))
    );
}

// ===========================
// AUDIO CONTROLS (ENHANCED)
// ===========================

function initAudioControls() {
    if (elements.playPauseBtn) elements.playPauseBtn.addEventListener('click', togglePlayPause);
    if (elements.nextBtn) elements.nextBtn.addEventListener('click', nextTrack);
    if (elements.prevBtn) elements.prevBtn.addEventListener('click', prevTrack);
    if (elements.progressBar) {
        elements.progressBar.addEventListener('click', seekTo);

        // Add touch support for mobile
        if (isTouch) {
            elements.progressBar.addEventListener('touchend', seekTo);
        }
    }

    // Enhanced volume slider handling
    if (elements.volumeSlider) {
        elements.volumeSlider.addEventListener('input', (e) => {
            setVolume(parseFloat(e.target.value));
        });

        elements.volumeSlider.addEventListener('change', (e) => {
            setVolume(parseFloat(e.target.value));
        });

        // Touch support
        if (isTouch) {
            elements.volumeSlider.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = elements.volumeSlider.getBoundingClientRect();
                const percentage = (touch.clientX - rect.left) / rect.width;
                const value = Math.max(0, Math.min(100, percentage * 100));
                setVolume(value);
            });
        }
    }

    // Playlist item clicks with enhanced mobile support
    document.querySelectorAll('.playlist-item').forEach((item) => {
        const clickHandler = () => {
            const index = parseInt(item.getAttribute('data-index'));
            if (!isNaN(index)) {
                loadTrack(index);
            }
        };

        item.addEventListener('click', clickHandler);

        // Touch support
        if (isTouch) {
            item.addEventListener('touchend', (e) => {
                e.preventDefault();
                clickHandler();
            });
        }
    });
}

// ===========================
// PERFORMANCE OPTIMIZATIONS (ENHANCED)
// ===========================

function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();

        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function disableHeavyAnimations() {
    const heavyAnimationElements = document.querySelectorAll('.floating-element, .floating-emoji');

    heavyAnimationElements.forEach(el => {
        el.style.animation = 'none';
        el.style.display = 'none';
    });

    // Reduce animation durations globally
    document.documentElement.style.setProperty('--animation-duration', '0.1s');

    // Update settings state
    settings.misc.showFloatingElements = false;
    settings.misc.showParticles = false;
    settings.misc.showCodeSnippets = false;
    settings.misc.showGeometricShapes = false;

    updateFloatingElementsVisibility();
    removeFloatingEmojis();
}

// ===========================
// INTERSECTION OBSERVER OPTIMIZATIONS
// ===========================

// Use a single observer for better performance
const globalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, {
    threshold: isMobile ? 0.05 : 0.1,
    rootMargin: isMobile ? '20px' : '50px'
});

// Observe elements that need scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observeElements = document.querySelectorAll('.skill-card, .project-card, .timeline-item');
    observeElements.forEach(el => globalObserver.observe(el));
});

// ===========================
// KEYBOARD NAVIGATION (ENHANCED)
// ===========================

// Enhanced keyboard navigation for accessibility and audio controls
document.addEventListener('keydown', (e) => {
    // Don't interfere with form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowRight':
            if (e.ctrlKey) {
                e.preventDefault();
                nextTrack();
            }
            break;
        case 'ArrowLeft':
            if (e.ctrlKey) {
                e.preventDefault();
                prevTrack();
            }
            break;
        case 'Escape':
            e.preventDefault();
            closeSettings();
            closeMobileMenu();
            break;
        case 'Home':
            if (e.ctrlKey) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            break;
        case 'KeyS':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleSettings();
            }
            break;
        case 'KeyM':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleMobileMenu();
            }
            break;
    }
});

// ===========================
// RESPONSIVE BREAKPOINT HANDLING (ENHANCED)
// ===========================

function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Close mobile menu on resize to desktop
    if (width >= 768) {
        closeMobileMenu();
    }

    // Adjust settings menu on resize
    if (width < 768 && elements.settingsMenu.classList.contains('active')) {
        // Keep settings open but adjust position
        showSettingsSection(currentSettingsSection);
    }

    // Handle orientation change on mobile
    if (isMobile) {
        // Adjust viewport height for mobile browsers
        document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);

        // Recalculate settings menu position
        if (elements.settingsMenu.classList.contains('active')) {
            setTimeout(() => {
                showSettingsSection(currentSettingsSection);
            }, 100);
        }
    }

    // Update floating elements based on new screen size
    updateFloatingElementsVisibility();
    
    // Recreate emojis on significant size changes
    if (settings.misc.showFloatingElements && !isMobile) {
        setTimeout(createFloatingEmojis, 250);
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// Handle orientation change specifically
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        handleResize();
    }, 100);
});

// ===========================
// ACCESSIBILITY IMPROVEMENTS (ENHANCED)
// ===========================

// Enhanced focus management for keyboard navigation
document.addEventListener('focusin', (e) => {
    if (!e.target.matches('a, button, input, select, textarea, [tabindex]')) {
        return;
    }

    // Add focus indicator for keyboard navigation
    e.target.style.outline = '2px solid var(--accent-color)';
    e.target.style.outlineOffset = '2px';
    e.target.style.borderRadius = '4px';
});

document.addEventListener('focusout', (e) => {
    e.target.style.outline = '';
    e.target.style.outlineOffset = '';
});

// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#about';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'sr-only';
skipLink.style.position = 'absolute';
skipLink.style.top = '-40px';
skipLink.style.left = '6px';
skipLink.style.zIndex = '10000';
skipLink.style.background = 'var(--accent-color)';
skipLink.style.color = 'var(--primary-bg)';
skipLink.style.padding = '8px';
skipLink.style.textDecoration = 'none';
skipLink.style.borderRadius = '4px';

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.appendChild(skipLink);

// ===========================
// ERROR HANDLING & GRACEFUL DEGRADATION (ENHANCED)
// ===========================

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);

    // Graceful degradation for specific components
    if (e.error && e.error.message) {
        if (e.error.message.includes('audioPlayer')) {
            showAudioError('Audio player encountered an error. Please refresh the page.');
        }
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Service worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator && !isMobile) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===========================
// MEMORY MANAGEMENT (ENHANCED)
// ===========================

// Enhanced cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Save settings before unloading
    saveSettings();

    // Remove all event listeners to prevent memory leaks
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);

    // Pause and cleanup audio
    if (elements.audioPlayer) {
        elements.audioPlayer.pause();
        elements.audioPlayer.src = '';
        elements.audioPlayer.load();
    }

    // Clear any running intervals and timeouts
    clearInterval();
    clearTimeout();

    // Disconnect observers
    if (globalObserver) {
        globalObserver.disconnect();
    }

    // Clean up floating emojis
    removeFloatingEmojis();
});

// Cleanup on page hide (for mobile)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations and audio when page is hidden
        if (isPlaying && elements.audioPlayer) {
            elements.audioPlayer.pause();
        }

        // Reduce CPU usage by pausing animations
        if (settings.misc.showFloatingElements) {
            const animatedElements = document.querySelectorAll('.floating-element, .floating-emoji');
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        }
    } else {
        // Resume animations when page is visible again
        if (settings.misc.showFloatingElements && !settings.misc.reducedMotion) {
            const animatedElements = document.querySelectorAll('.floating-element, .floating-emoji');
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    }
});

// ===========================
// FINAL INITIALIZATION CHECK
// ===========================

// Ensure everything is loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Initialize load handler
if (document.readyState === 'complete') {
    handleWindowLoad();
} else {
    window.addEventListener('load', handleWindowLoad);
}

// Performance monitoring (development only)
if (window.performance && window.performance.measure) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('🚀 Portfolio Performance Stats:');
            console.log(`📊 DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
            console.log(`📊 Page Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            console.log(`📊 Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }, 1000);
    });
}

console.log('🚀 Enhanced mobile-optimized portfolio script loaded successfully!');
console.log('📱 Device optimizations active for:', deviceType);
console.log('⚡ Performance mode:', isLowEndDevice ? 'Low-end device detected' : 'Standard performance');
console.log('🎀 JoJo\'s theme with enhanced floating emojis ready!');