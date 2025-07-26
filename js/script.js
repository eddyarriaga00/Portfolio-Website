/* ===========================
   COMPLETE OPTIMIZED PORTFOLIO SCRIPT
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

// Optimized track data - exactly 3 songs
const tracks = [
    {
        title: "Say Slatt Say Ski",
        artist: "Lucki",
        src: "music/sayslattsayskiLucki.mp3"
    },
    {
        title: "Study Session",
        artist: "Focus Beats",
        src: "music/study-session.mp3"
    },
    {
        title: "Night Dreams",
        artist: "Ambient Sounds",
        src: "music/night-dreams.mp3"
    }
];

// Performance optimization flags
const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Cached DOM elements
const elements = {};

// Loading state
let isLoadingComplete = false;

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('load', handleWindowLoad);

function initializeApp() {
    cacheElements();
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

    // Performance optimization
    if (isLowEndDevice || prefersReducedMotion) {
        disableHeavyAnimations();
    }

    if (isMobile) {
        optimizeForMobile();
    }
}

function handleWindowLoad() {
    // Fixed timing: ensure loading screen shows for full duration
    setTimeout(() => {
        isLoadingComplete = true;
        hideLoadingScreen();
    }, 4500); // Increased to 4.5 seconds to match loading bar animation
}

function cacheElements() {
    elements.loadingScreen = document.getElementById('loadingScreen');
    elements.navbar = document.getElementById('navbar');
    elements.cursor = document.querySelector('.custom-cursor');
    elements.follower = document.querySelector('.cursor-follower');
    elements.heroTitle = document.querySelector('.hero-title');
    elements.settingsBtn = document.getElementById('settingsBtn');
    elements.settingsMenu = document.getElementById('settingsMenu');
    elements.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    elements.mobileMenu = document.getElementById('mobileMenu');
    elements.audioPlayer = document.getElementById('audioPlayer');
    elements.playPauseBtn = document.getElementById('playPauseBtn');
    elements.prevBtn = document.getElementById('prevBtn');
    elements.nextBtn = document.getElementById('nextBtn');
    elements.progressBar = document.getElementById('progressBar');
    elements.progressFill = document.getElementById('progressFill');
    elements.volumeSlider = document.getElementById('volumeSlider');
    elements.volumeFill = document.getElementById('volumeFill');
    elements.currentTime = document.getElementById('currentTime');
    elements.duration = document.getElementById('duration');
    elements.currentTrackTitle = document.getElementById('currentTrackTitle');
    elements.currentTrackArtist = document.getElementById('currentTrackArtist');
    elements.audioError = document.getElementById('audioError');
    elements.playlist = document.getElementById('playlist');
    elements.primaryColorPicker = document.getElementById('primaryColor');
    elements.accentColorPicker = document.getElementById('accentColor');
    elements.applyCustomThemeBtn = document.getElementById('applyCustomTheme');
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
// MOBILE OPTIMIZATIONS
// ===========================

function optimizeForMobile() {
    // Disable cursor on mobile
    if (elements.cursor) elements.cursor.style.display = 'none';
    if (elements.follower) elements.follower.style.display = 'none';
    document.body.style.cursor = 'auto';

    // Add mobile class for specific styling
    document.body.classList.add('mobile-device');

    // Optimize touch events
    document.addEventListener('touchstart', () => { }, { passive: true });
    document.addEventListener('touchmove', () => { }, { passive: true });

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// ===========================
// MOBILE MENU
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
}

function closeMobileMenu() {
    elements.mobileMenuBtn.classList.remove('active');
    elements.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===========================
// AUDIO PLAYER FUNCTIONS
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
}

function handleMetadataLoaded() {
    if (elements.duration) {
        elements.duration.textContent = formatTime(elements.audioPlayer.duration);
    }
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
    console.error('Audio error:', e);
    showAudioError();
    setPlayButtonState(false);
}

function showAudioError() {
    if (elements.audioError) {
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
        elements.playPauseBtn.textContent = playing ? '⏸' : '▶';
    }
    isPlaying = playing;
}

function loadTrack(trackIndex) {
    if (trackIndex < 0 || trackIndex >= tracks.length) return;

    currentTrack = trackIndex;
    const track = tracks[trackIndex];

    // Update UI
    if (elements.currentTrackTitle) elements.currentTrackTitle.textContent = track.title;
    if (elements.currentTrackArtist) elements.currentTrackArtist.textContent = track.artist;

    // Update playlist active state
    updatePlaylistActiveState(trackIndex);

    // Load audio
    elements.audioPlayer.src = track.src;
    elements.audioPlayer.load();

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
                showAudioError();
            });
        }
    }
}

function nextTrack() {
    const nextIndex = (currentTrack + 1) % tracks.length;
    loadTrack(nextIndex);
    if (isPlaying) {
        setTimeout(() => elements.audioPlayer.play().catch(e => console.error('Auto-play failed:', e)), 100);
    }
}

function prevTrack() {
    const prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    loadTrack(prevIndex);
    if (isPlaying) {
        setTimeout(() => elements.audioPlayer.play().catch(e => console.error('Auto-play failed:', e)), 100);
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

function setVolume(event) {
    const rect = elements.volumeSlider.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    volume = Math.max(0, Math.min(1, clickX / rect.width));

    elements.audioPlayer.volume = volume;
    updateVolumeDisplay();
}

function updateVolumeDisplay() {
    if (elements.volumeFill) {
        elements.volumeFill.style.width = (volume * 100) + '%';
    }

    const volumeIcon = document.querySelector('.volume-icon');
    if (volumeIcon) {
        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
}

// ===========================
// CUSTOM CURSOR
// ===========================

function initCustomCursor() {
    if (!elements.cursor || !elements.follower || isMobile) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Optimized mouse move handler
    document.addEventListener('mousemove', throttle((e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        elements.cursor.style.transform = `translate3d(${mouseX - 8}px, ${mouseY - 8}px, 0)`;
    }, 16));

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;

        elements.follower.style.transform = `translate3d(${followerX - 18}px, ${followerY - 18}px, 0)`;

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-content, .logo-container, .theme-option, .playlist-item, .control-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            elements.cursor.style.transform += ' scale(1.5)';
            elements.follower.style.transform += ' scale(1.5)';
            elements.follower.style.opacity = '0.8';
        });
        el.addEventListener('mouseleave', () => {
            elements.cursor.style.transform = elements.cursor.style.transform.replace(' scale(1.5)', '');
            elements.follower.style.transform = elements.follower.style.transform.replace(' scale(1.5)', '');
            elements.follower.style.opacity = '0.6';
        });
    });
}

// ===========================
// NAVIGATION & SCROLLING
// ===========================

function initNavigation() {
    // Optimized scroll handler
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

    // Update navbar
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

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===========================
// SCROLL ANIMATIONS
// ===========================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -10px 0px'
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        el.dataset.delay = index * 50;
        observer.observe(el);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = scrollSpeed > 2 ? 0 : Math.min(entry.target.dataset.delay || 0, 300);

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
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.floor(current) + (target > 10 ? '+' : '');
        }, 40);
    });
}

// ===========================
// PARALLAX EFFECTS
// ===========================

function initParallax() {
    if (isLowEndDevice || prefersReducedMotion || isMobile) return;

    window.addEventListener('scroll', throttle(handleParallax, 16), { passive: true });
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.geometric-shape');

    shapes.forEach((shape, index) => {
        const speed = 0.2 + (index * 0.1);
        const yPos = scrolled * speed;
        const rotation = scrolled * 0.05;
        shape.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
    });
}

// ===========================
// TYPING ANIMATION
// ===========================

function initTypingAnimation() {
    if (!elements.heroTitle || prefersReducedMotion) return;

    const titleText = elements.heroTitle.textContent.trim();
    elements.heroTitle.textContent = '';

    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            elements.heroTitle.textContent = titleText.slice(0, i);
            i++;
            if (i > titleText.length) {
                clearInterval(typeInterval);
                // Remove any cursor after typing is complete
                elements.heroTitle.textContent = titleText;
            }
        }, 100);
    }, 1500);
}

// ===========================
// 3D TILT EFFECTS
// ===========================

function init3DTiltEffects() {
    if (isLowEndDevice || prefersReducedMotion || isMobile) return;

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
// SETTINGS PANEL
// ===========================

function initSettingsPanel() {
    if (!elements.settingsBtn || !elements.settingsMenu) return;

    elements.settingsBtn.addEventListener('click', toggleSettings);

    document.addEventListener('click', (e) => {
        if (!elements.settingsBtn.contains(e.target) && !elements.settingsMenu.contains(e.target)) {
            elements.settingsMenu.classList.remove('active');
        }
    });
}

function toggleSettings() {
    elements.settingsMenu.classList.toggle('active');
}

// ===========================
// THEME SYSTEM
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
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('preferred-theme', themeName);

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
        localStorage.removeItem('custom-theme');
    }
}

// ===========================
// CUSTOM THEME MAKER
// ===========================

function initCustomThemeMaker() {
    if (!elements.primaryColorPicker || !elements.accentColorPicker || !elements.applyCustomThemeBtn) return;

    elements.applyCustomThemeBtn.addEventListener('click', applyCustomTheme);

    // Load saved custom theme
    const savedCustomTheme = localStorage.getItem('custom-theme');
    if (savedCustomTheme) {
        const customTheme = JSON.parse(savedCustomTheme);
        elements.primaryColorPicker.value = customTheme.primary;
        elements.accentColorPicker.value = customTheme.accent;
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
    localStorage.setItem('custom-theme', JSON.stringify({
        primary: primaryColor,
        accent: accentColor
    }));

    // Update theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    // Add custom theme to body
    document.body.setAttribute('data-theme', 'custom');
    localStorage.setItem('preferred-theme', 'custom');

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
// AUDIO CONTROLS
// ===========================

function initAudioControls() {
    if (elements.playPauseBtn) elements.playPauseBtn.addEventListener('click', togglePlayPause);
    if (elements.nextBtn) elements.nextBtn.addEventListener('click', nextTrack);
    if (elements.prevBtn) elements.prevBtn.addEventListener('click', prevTrack);
    if (elements.progressBar) elements.progressBar.addEventListener('click', seekTo);
    if (elements.volumeSlider) elements.volumeSlider.addEventListener('click', setVolume);

    // Playlist item clicks
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            loadTrack(index);
        });
    });
}

// ===========================
// PERFORMANCE OPTIMIZATIONS
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
    const heavyAnimationElements = document.querySelectorAll(
        '.floating-code, .geometric-shape, .floating-tech-icon, .floating-symbols, .floating-contact-icons'
    );

    heavyAnimationElements.forEach(el => {
        el.style.animation = 'none';
        el.style.display = 'none';
    });

    // Reduce animation durations
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
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
    threshold: 0.1,
    rootMargin: '50px'
});

// Observe elements that need scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observeElements = document.querySelectorAll('.skill-card, .project-card, .timeline-item');
    observeElements.forEach(el => globalObserver.observe(el));
});

// ===========================
// KEYBOARD NAVIGATION
// ===========================

// Keyboard navigation for audio controls and accessibility
document.addEventListener('keydown', (e) => {
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
            elements.settingsMenu.classList.remove('active');
            closeMobileMenu();
            break;
    }
});

// ===========================
// RESPONSIVE BREAKPOINT HANDLING
// ===========================

function handleResize() {
    const width = window.innerWidth;

    // Close mobile menu on resize to desktop
    if (width >= 768) {
        closeMobileMenu();
    }

    // Adjust settings panel position on smaller screens
    if (width < 400 && elements.settingsMenu) {
        elements.settingsMenu.style.width = '280px';
    } else if (elements.settingsMenu) {
        elements.settingsMenu.style.width = '';
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// ===========================
// ACCESSIBILITY IMPROVEMENTS
// ===========================

// Respect reduced motion preference
if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
}

// Focus management for keyboard navigation
document.addEventListener('focusin', (e) => {
    if (!e.target.matches('a, button, input, select, textarea, [tabindex]')) {
        return;
    }

    // Add focus indicator for keyboard navigation
    e.target.style.outline = '2px solid var(--accent-color)';
    e.target.style.outlineOffset = '2px';
});

document.addEventListener('focusout', (e) => {
    e.target.style.outline = '';
    e.target.style.outlineOffset = '';
});

// ===========================
// ERROR HANDLING & GRACEFUL DEGRADATION
// ===========================

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Graceful degradation - continue without the failing feature
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent the default unhandled rejection behavior
});

// ===========================
// MEMORY MANAGEMENT
// ===========================

// Clean up event listeners on page unload
window.addEventListener('beforeunload', () => {
    // Remove all event listeners to prevent memory leaks
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);

    // Pause audio to free resources
    if (elements.audioPlayer) {
        elements.audioPlayer.pause();
        elements.audioPlayer.src = '';
    }

    // Clear any running intervals
    clearInterval();
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

console.log('🚀 Portfolio script loaded successfully!');