'use strict';

let scrollSpeed = 0;
let lastScrollTime = Date.now();
let lastScrollTop = 0;

const audioPlayer = document.getElementById('audioPlayer');
let currentTrack = -1;
let isPlaying = false;
let volume = 0.7;
let audioInitialized = false;
let hasUserInteracted = false;

const tracks = [
    {
        title: "Say Slatt Say Ski",
        artist: "Lucki",
        src: "./music/sayslattsayskiLucki.mp3",
        duration: "3:09"
    },
    {
        title: "Limerence",
        artist: "Lucki",
        src: "./music/limerenceLucki.mp3",
        duration: "2:46"
    },
    {
        title: "Go Hard 2.0",
        artist: "Juice WRLD",
        src: "./music/gohardJuiceWRLD.mp3",
        duration: "3:34"
    }
];

const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window;
const mobileAnimationSpeed = 70;

const deviceType = (() => {
    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
})();

const elements = {};

let isLoadingComplete = false;

let currentSettingsSection = 'main';
let settings = {
    cursor: {
        enabled: !isMobile && !isTouch,
        size: 12,
        opacity: 100,
        followerSize: 36
    },
    performance: {
        showFloatingElements: !isMobile,
        showParticles: !isMobile,
        showCodeSnippets: !isMobile,
        showGeometricShapes: !isMobile,
        animationSpeed: isMobile ? mobileAnimationSpeed : (isLowEndDevice ? 50 : 100),
        parallaxIntensity: isMobile ? 0 : 100,
        batterySaver: false
    },
    accessibility: {
        reducedMotion: prefersReducedMotion || isLowEndDevice || isMobile,
        smoothScrolling: true,
        highContrast: false,
        focusVisible: true,
        screenReader: true
    },
    misc: {
        autoplayMusic: false,
        screenShake: !isMobile,
        typewriterSpeed: 100,
        debugMode: false
    }
};

const themeEmojis = {
    default: ['💻', '⚡', '🚀', '🔥', '✨', '💡', '🎯', '🌟', '⭐', '🎨'],
    discord: ['🎮', '🎯', '💬', '🔊', '🎵', '⚡', '🌟', '🎪', '🎭', '🎨'],
    spotify: ['🎵', '🎶', '🎧', '🎤', '🎸', '🥁', '🎹', '🎺', '🎻', '🎪'],
    vscode: ['💻', '⌨️', '🖥️', '📱', '⚡', '🔧', '⚙️', '🎯', '📊', '🚀'],
    ocean: ['🌊', '🐠', '🐙', '🦈', '🐢', '🌺', '🏝️', '⛵', '🌴', '🦑'],
    jojos: ['🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀']
};

function initializeApp() {
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
    fixMobileEventHandlers();
    initMobileOptimizations();
    initFloatingEmojis();

    if (isLowEndDevice || prefersReducedMotion || settings.accessibility.reducedMotion) {
        disableHeavyAnimations();
    }

    if (isMobile) {
        optimizeForMobile();
    }
}

function handleWindowLoad() {
    const loadingDelay = isMobile ? 1200 : 4500;
    setTimeout(() => {
        isLoadingComplete = true;
        hideLoadingScreen();

        if (settings.misc.autoplayMusic) {
            setTimeout(() => {
                tryAutoplay();
            }, 1000);
        }
    }, loadingDelay);
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
    elements.touchIndicator = document.querySelector('.mobile-touch-indicator');

    elements.mouseSection = document.getElementById('mouseSection');
    elements.themeSection = document.getElementById('themeSection');
    elements.musicSection = document.getElementById('musicSection');
    elements.performanceSection = document.getElementById('performanceSection');
    elements.accessibilitySection = document.getElementById('accessibilitySection');
    elements.miscSection = document.getElementById('miscSection');

    elements.cursorEnabled = document.getElementById('cursorEnabled');
    elements.cursorSize = document.getElementById('cursorSize');
    elements.cursorSizeValue = document.getElementById('cursorSizeValue');
    elements.cursorOpacity = document.getElementById('cursorOpacity');
    elements.cursorOpacityValue = document.getElementById('cursorOpacityValue');
    elements.followerSize = document.getElementById('followerSize');
    elements.followerSizeValue = document.getElementById('followerSizeValue');

    elements.showFloatingElements = document.getElementById('showFloatingElements');
    elements.showParticles = document.getElementById('showParticles');
    elements.showCodeSnippets = document.getElementById('showCodeSnippets');
    elements.showGeometricShapes = document.getElementById('showGeometricShapes');
    elements.animationSpeed = document.getElementById('animationSpeed');
    elements.animationSpeedValue = document.getElementById('animationSpeedValue');
    elements.parallaxIntensity = document.getElementById('parallaxIntensity');
    elements.parallaxIntensityValue = document.getElementById('parallaxIntensityValue');
    elements.batterySaver = document.getElementById('batterySaver');

    elements.reducedMotion = document.getElementById('reducedMotion');
    elements.smoothScrolling = document.getElementById('smoothScrolling');
    elements.highContrast = document.getElementById('highContrast');
    elements.focusVisible = document.getElementById('focusVisible');
    elements.screenReader = document.getElementById('screenReader');

    elements.autoplayMusic = document.getElementById('autoplayMusic');
    elements.screenShake = document.getElementById('screenShake');
    elements.typewriterSpeed = document.getElementById('typewriterSpeed');
    elements.typewriterSpeedValue = document.getElementById('typewriterSpeedValue');
    elements.debugMode = document.getElementById('debugMode');
    elements.resetSettings = document.getElementById('resetSettings');
}

function initAudioPlayer() {
    if (!elements.audioPlayer) return;

    elements.audioPlayer.volume = volume;
    elements.audioPlayer.preload = 'metadata';
    updateVolumeDisplay();

    elements.audioPlayer.addEventListener('loadedmetadata', handleMetadataLoaded);
    elements.audioPlayer.addEventListener('timeupdate', throttle(handleTimeUpdate, 100));
    elements.audioPlayer.addEventListener('ended', handleTrackEnded);
    elements.audioPlayer.addEventListener('error', handleAudioError);
    elements.audioPlayer.addEventListener('canplay', hideAudioError);
    elements.audioPlayer.addEventListener('play', () => setPlayButtonState(true));
    elements.audioPlayer.addEventListener('pause', () => setPlayButtonState(false));
    elements.audioPlayer.addEventListener('loadstart', () => {
        if (settings.misc.debugMode) console.log('Audio loading started...');
    });
    elements.audioPlayer.addEventListener('canplaythrough', () => {
        if (settings.misc.debugMode) console.log('Audio can play through');
        hideAudioError();
        audioInitialized = true;
    });

    document.addEventListener('click', enableAudioContext, { once: true });
    document.addEventListener('touchstart', enableAudioContext, { once: true });
    document.addEventListener('keydown', enableAudioContext, { once: true });
}

function enableAudioContext() {
    if (!audioInitialized) {
        if (elements.audioPlayer) {
            elements.audioPlayer.load();
            audioInitialized = true;
        }
    }
    hasUserInteracted = true;
}

function tryAutoplay() {
    if (settings.misc.autoplayMusic && audioInitialized && hasUserInteracted) {
        loadTrack(0);
        setTimeout(() => {
            const playPromise = elements.audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (settings.misc.debugMode) console.log('Autoplay failed - user interaction required:', error);
                });
            }
        }, 500);
    }
}

function handleMetadataLoaded() {
    if (elements.duration && elements.audioPlayer.duration) {
        elements.duration.textContent = formatTime(elements.audioPlayer.duration);
    }
    if (settings.misc.debugMode) console.log('Metadata loaded successfully');
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

    if (settings.misc.debugMode) {
        console.error('Audio error:', errorMessage, 'Track:', currentTrack >= 0 ? tracks[currentTrack].src : 'none');
    }
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
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
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

    if (settings.misc.debugMode) console.log('Loading track:', track.title, 'from:', track.src);

    if (elements.currentTrackTitle) elements.currentTrackTitle.textContent = track.title;
    if (elements.currentTrackArtist) elements.currentTrackArtist.textContent = track.artist;

    updatePlaylistActiveState(trackIndex);

    try {
        elements.audioPlayer.src = track.src;
        elements.audioPlayer.load();
        hideAudioError();
    } catch (error) {
        if (settings.misc.debugMode) console.error('Error loading track:', error);
        showAudioError('Failed to load audio file: ' + track.title);
    }

    resetProgressDisplay();
}

function updatePlaylistActiveState(activeIndex) {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
    });
}

function resetProgressDisplay() {
    if (elements.progressFill) elements.progressFill.style.width = '0%';
    if (elements.currentTime) elements.currentTime.textContent = '0:00';
    if (elements.duration) elements.duration.textContent = '0:00';
}

function togglePlayPause() {
    if (!audioInitialized) {
        enableAudioContext();
    }

    hasUserInteracted = true;

    if (currentTrack === -1) {
        loadTrack(0);
        const playPromise = elements.audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                if (settings.misc.debugMode) console.error('Play failed:', error);
                showAudioError('Playback failed. Please check if the audio file exists.');
            });
        }
        return;
    }

    if (isPlaying) {
        elements.audioPlayer.pause();
    } else {
        const playPromise = elements.audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                if (settings.misc.debugMode) console.error('Play failed:', error);
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
                if (settings.misc.debugMode) console.error('Auto-play failed:', e);
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
                if (settings.misc.debugMode) console.error('Auto-play failed:', e);
                showAudioError('Auto-play failed. Please try playing manually.');
            });
        }, 100);
    }
}

function seekTo(event) {
    if (elements.audioPlayer.duration) {
        const rect = elements.progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
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

function loadSettings() {
    const savedSettings = localStorage.getItem('portfolio-settings');
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            settings = { ...settings, ...parsed };
        } catch (e) {
            if (settings.misc.debugMode) console.warn('Failed to parse saved settings:', e);
        }
    }

    if (isMobile) {
        settings.cursor.enabled = false;
        settings.performance.parallaxIntensity = 0;
        settings.performance.animationSpeed = Math.min(settings.performance.animationSpeed, mobileAnimationSpeed);
        settings.misc.screenShake = false;
    }

    applyLoadedSettings();
}

function saveSettings() {
    try {
        localStorage.setItem('portfolio-settings', JSON.stringify(settings));
    } catch (e) {
        if (settings.misc.debugMode) console.warn('Failed to save settings:', e);
    }
}

function applyLoadedSettings() {
    if (settings.cursor) {
        updateCursorVariables();

        const cursorActive = settings.cursor.enabled && !isMobile && !isTouch;
        document.body.classList.toggle('custom-cursor-active', cursorActive);

        if (!cursorActive) {
            if (elements.cursor) elements.cursor.style.display = 'none';
            if (elements.follower) elements.follower.style.display = 'none';
            document.body.style.cursor = 'auto';
        }
    }

    if (settings.performance) {
        if (settings.accessibility.reducedMotion || settings.performance.batterySaver) {
            disableHeavyAnimations();
        }

        updateFloatingElementsVisibility();
        updateAnimationSpeed();
        updateParallaxIntensity();
    }

    if (settings.accessibility) {
        applyAccessibilitySettings();
    }

    if (settings.misc) {
        applyMiscSettings();
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

    floatingElements.forEach(el => {
        el.style.display = settings.performance.showFloatingElements ? '' : 'none';
    });

    emojis.forEach(el => {
        el.style.display = settings.performance.showFloatingElements ? '' : 'none';
    });

    if (settings.performance.showFloatingElements) {
        codeSnippets.forEach(el => {
            el.style.display = settings.performance.showCodeSnippets ? '' : 'none';
        });

        geometricShapes.forEach(el => {
            el.style.display = settings.performance.showGeometricShapes ? '' : 'none';
        });

        particles.forEach(el => {
            el.style.display = settings.performance.showParticles ? '' : 'none';
        });
    }
}

function updateAnimationSpeed() {
    const root = document.documentElement;
    const speed = settings.performance.animationSpeed / 100;
    root.style.setProperty('--animation-speed', speed);

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
    const intensity = settings.performance.parallaxIntensity / 100;
    root.style.setProperty('--parallax-intensity', intensity);
}

function applyAccessibilitySettings() {
    const html = document.documentElement;
    
    if (settings.accessibility.smoothScrolling) {
        html.classList.add('smooth-scrolling');
        html.classList.remove('no-smooth-scrolling');
    } else {
        html.classList.add('no-smooth-scrolling');
        html.classList.remove('smooth-scrolling');
    }

    if (settings.accessibility.highContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }

    if (settings.accessibility.focusVisible) {
        document.body.classList.add('focus-visible');
    } else {
        document.body.classList.remove('focus-visible');
    }
}

function applyMiscSettings() {
    if (settings.misc.debugMode) {
        console.log('Debug mode enabled');
    }
}

function initSettingsPanel() {
    if (!elements.settingsBtn || !elements.settingsMenu) return;

    const handleSettingsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSettings();
    };

    elements.settingsBtn.addEventListener('click', handleSettingsClick);

    if (isTouch) {
        elements.settingsBtn.addEventListener('touchend', handleSettingsClick);
    }

    document.addEventListener('click', (e) => {
        if (!isMobile && !elements.settingsBtn.contains(e.target) && !elements.settingsMenu.contains(e.target)) {
            closeSettings();
        }
    });

    if (isMobile) {
        elements.settingsMenu.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    showSettingsSection('main');
}

function fixMobileEventHandlers() {
    const mobileElements = document.querySelectorAll('.settings-category, .toggle-switch, .setting-slider, .reset-settings-btn, .playlist-item, .control-btn');

    mobileElements.forEach(element => {
        const handleInteraction = (e) => {
            e.preventDefault();
            e.stopPropagation();

            hasUserInteracted = true;

            if (settings.misc.screenShake && isMobile) {
                triggerScreenShake();
            }

            if (elements.touchIndicator && isMobile) {
                showTouchIndicator(e);
            }

            if (element.classList.contains('settings-category')) {
                const section = element.getAttribute('data-section');
                if (section) showSettingsSection(section);
            }

            if (element.classList.contains('reset-settings-btn')) {
                resetAllSettings();
            }
        };

        element.addEventListener('click', handleInteraction);

        if (isTouch) {
            element.addEventListener('touchend', handleInteraction);
        }
    });
}

function showTouchIndicator(event) {
    if (!elements.touchIndicator) return;

    const touch = event.touches ? event.touches[0] : event;
    const x = touch.clientX || touch.pageX;
    const y = touch.clientY || touch.pageY;

    elements.touchIndicator.style.left = x + 'px';
    elements.touchIndicator.style.top = y + 'px';
    elements.touchIndicator.classList.add('active');

    setTimeout(() => {
        elements.touchIndicator.classList.remove('active');
    }, 300);
}

function triggerScreenShake() {
    document.body.classList.add('screen-shake');
    setTimeout(() => {
        document.body.classList.remove('screen-shake');
    }, 600);
}

function showSettingsSection(sectionName) {
    if (settings.misc.debugMode) console.log('Showing section:', sectionName);
    
    document.querySelectorAll('.settings-section-view').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    if (sectionName === 'main') {
        if (elements.settingsMainMenu) {
            elements.settingsMainMenu.classList.add('active');
            elements.settingsMainMenu.style.display = 'block';
        }
    } else {
        if (elements.settingsMainMenu) {
            elements.settingsMainMenu.classList.remove('active');
            elements.settingsMainMenu.style.display = 'none';
        }

        const target = document.getElementById(sectionName + 'Section');
        if (target) {
            target.classList.add('active');
            target.style.display = 'block';
        } else {
            if (settings.misc.debugMode) console.error('Section not found:', sectionName + 'Section');
        }
    }

    currentSettingsSection = sectionName;

    const scrollContainer = document.querySelector('.settings-scroll-container');
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
}

function initAdvancedSettings() {
    initSettingsNavigation();
    initCursorSettings();
    initPerformanceSettings();
    initAccessibilitySettings();
    initMiscSettings();
    populateSettingsValues();
}

function initSettingsNavigation() {
    const settingsCategories = document.querySelectorAll('.settings-category');
    settingsCategories.forEach(category => {
        const handleCategoryClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const section = category.getAttribute('data-section');
            if (settings.misc.debugMode) console.log('Category clicked:', section);
            if (section) {
                showSettingsSection(section);
            }
        };

        category.addEventListener('click', handleCategoryClick);
        if (isTouch) {
            category.addEventListener('touchend', handleCategoryClick);
        }
    });

    const backButtons = document.querySelectorAll('.settings-back-btn');
    backButtons.forEach(btn => {
        const handleBackClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSettingsSection('main');
        };

        btn.addEventListener('click', handleBackClick);
        if (isTouch) {
            btn.addEventListener('touchend', handleBackClick);
        }
    });

    if (elements.settingsCloseBtn) {
        const handleCloseClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSettings();
        };

        elements.settingsCloseBtn.addEventListener('click', handleCloseClick);
        if (isTouch) {
            elements.settingsCloseBtn.addEventListener('touchend', handleCloseClick);
        }
    }
}

function initPerformanceSettings() {
    const setupToggle = (element, settingPath, callback) => {
        if (!element) return;

        const updateSettingValue = (checked) => {
            const keys = settingPath.split('.');
            let current = settings;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = checked;

            if (callback) callback(checked);
            saveSettings();
        };

        const handleChange = (e) => {
            e.stopPropagation();
            updateSettingValue(element.checked);
        };

        element.addEventListener('change', handleChange);

        if (isTouch) {
            const toggleSwitch = element.closest('.toggle-switch');
            if (toggleSwitch) {
                toggleSwitch.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newValue = !element.checked;
                    element.checked = newValue;
                    updateSettingValue(newValue);
                });
            }
        }
    };

    setupToggle(elements.showFloatingElements, 'performance.showFloatingElements', (checked) => {
        updateFloatingElementsVisibility();
        if (checked) {
            initFloatingEmojis();
        } else {
            removeFloatingEmojis();
        }
    });

    setupToggle(elements.showParticles, 'performance.showParticles', () => {
        updateFloatingElementsVisibility();
    });

    setupToggle(elements.showCodeSnippets, 'performance.showCodeSnippets', () => {
        updateFloatingElementsVisibility();
    });

    setupToggle(elements.showGeometricShapes, 'performance.showGeometricShapes', () => {
        updateFloatingElementsVisibility();
    });

    setupToggle(elements.batterySaver, 'performance.batterySaver', (checked) => {
        if (checked) {
            document.body.classList.add('battery-saver');
            disableHeavyAnimations();
        } else {
            document.body.classList.remove('battery-saver');
            if (!settings.accessibility.reducedMotion) {
                enableHeavyAnimations();
            }
        }
    });

    if (elements.animationSpeed) {
        const handleSpeedChange = (e) => {
            const value = parseInt(e.target.value);
            settings.performance.animationSpeed = value;
            if (elements.animationSpeedValue) {
                elements.animationSpeedValue.textContent = value + '%';
            }
            updateAnimationSpeed();
            saveSettings();
        };

        elements.animationSpeed.addEventListener('input', handleSpeedChange);
        elements.animationSpeed.addEventListener('change', handleSpeedChange);

        if (isTouch) {
            elements.animationSpeed.addEventListener('touchmove', handleSpeedChange);
        }
    }

    if (elements.parallaxIntensity) {
        const handleParallaxChange = (e) => {
            const value = parseInt(e.target.value);
            settings.performance.parallaxIntensity = value;
            if (elements.parallaxIntensityValue) {
                elements.parallaxIntensityValue.textContent = value + '%';
            }
            updateParallaxIntensity();
            saveSettings();
        };

        elements.parallaxIntensity.addEventListener('input', handleParallaxChange);
        elements.parallaxIntensity.addEventListener('change', handleParallaxChange);

        if (isTouch) {
            elements.parallaxIntensity.addEventListener('touchmove', handleParallaxChange);
        }
    }
}

function initAccessibilitySettings() {
    const setupToggle = (element, settingPath, callback) => {
        if (!element) return;

        const updateSettingValue = (checked) => {
            const keys = settingPath.split('.');
            let current = settings;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = checked;

            if (callback) callback(checked);
            saveSettings();
        };

        const handleChange = (e) => {
            e.stopPropagation();
            updateSettingValue(element.checked);
        };

        element.addEventListener('change', handleChange);

        if (isTouch) {
            const toggleSwitch = element.closest('.toggle-switch');
            if (toggleSwitch) {
                toggleSwitch.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newValue = !element.checked;
                    element.checked = newValue;
                    updateSettingValue(newValue);
                });
            }
        }
    };

    setupToggle(elements.reducedMotion, 'accessibility.reducedMotion', (checked) => {
        if (checked) {
            disableHeavyAnimations();
        } else {
            if (!settings.performance.batterySaver) {
                enableHeavyAnimations();
            }
        }
    });

    setupToggle(elements.smoothScrolling, 'accessibility.smoothScrolling', () => {
        applyAccessibilitySettings();
    });

    setupToggle(elements.highContrast, 'accessibility.highContrast', () => {
        applyAccessibilitySettings();
    });

    setupToggle(elements.focusVisible, 'accessibility.focusVisible', () => {
        applyAccessibilitySettings();
    });

    setupToggle(elements.screenReader, 'accessibility.screenReader', () => {
        applyAccessibilitySettings();
    });
}

function initMiscSettings() {
    const setupToggle = (element, settingPath, callback) => {
        if (!element) return;

        const updateSettingValue = (checked) => {
            const keys = settingPath.split('.');
            let current = settings;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = checked;

            if (callback) callback(checked);
            saveSettings();
        };

        const handleChange = (e) => {
            e.stopPropagation();
            updateSettingValue(element.checked);
        };

        element.addEventListener('change', handleChange);

        if (isTouch) {
            const toggleSwitch = element.closest('.toggle-switch');
            if (toggleSwitch) {
                toggleSwitch.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newValue = !element.checked;
                    element.checked = newValue;
                    updateSettingValue(newValue);
                });
            }
        }
    };

    setupToggle(elements.autoplayMusic, 'misc.autoplayMusic');
    setupToggle(elements.screenShake, 'misc.screenShake');
    setupToggle(elements.debugMode, 'misc.debugMode', () => {
        applyMiscSettings();
    });

    if (elements.typewriterSpeed) {
        const handleTypewriterChange = (e) => {
            const value = parseInt(e.target.value);
            settings.misc.typewriterSpeed = value;
            if (elements.typewriterSpeedValue) {
                elements.typewriterSpeedValue.textContent = value + '%';
            }
            saveSettings();
        };

        elements.typewriterSpeed.addEventListener('input', handleTypewriterChange);
        elements.typewriterSpeed.addEventListener('change', handleTypewriterChange);

        if (isTouch) {
            elements.typewriterSpeed.addEventListener('touchmove', handleTypewriterChange);
        }
    }

    if (elements.resetSettings) {
        const handleReset = (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetAllSettings();
        };

        elements.resetSettings.addEventListener('click', handleReset);

        if (isTouch) {
            elements.resetSettings.addEventListener('touchend', handleReset);
        }
    }
}

function initCursorSettings() {
    if (!elements.cursorEnabled) return;

    elements.cursorEnabled.addEventListener('change', (e) => {
        settings.cursor.enabled = e.target.checked;
        document.body.classList.toggle('custom-cursor-active', settings.cursor.enabled && !isMobile && !isTouch);

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

function populateSettingsValues() {
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

    if (elements.showFloatingElements) {
        elements.showFloatingElements.checked = settings.performance.showFloatingElements;
    }

    if (elements.showParticles) {
        elements.showParticles.checked = settings.performance.showParticles;
    }

    if (elements.showCodeSnippets) {
        elements.showCodeSnippets.checked = settings.performance.showCodeSnippets;
    }

    if (elements.showGeometricShapes) {
        elements.showGeometricShapes.checked = settings.performance.showGeometricShapes;
    }

    if (elements.animationSpeed) {
        elements.animationSpeed.value = settings.performance.animationSpeed;
        if (elements.animationSpeedValue) {
            elements.animationSpeedValue.textContent = settings.performance.animationSpeed + '%';
        }
    }

    if (elements.parallaxIntensity) {
        elements.parallaxIntensity.value = settings.performance.parallaxIntensity;
        if (elements.parallaxIntensityValue) {
            elements.parallaxIntensityValue.textContent = settings.performance.parallaxIntensity + '%';
        }
    }

    if (elements.batterySaver) {
        elements.batterySaver.checked = settings.performance.batterySaver;
    }

    if (elements.reducedMotion) {
        elements.reducedMotion.checked = settings.accessibility.reducedMotion;
    }

    if (elements.smoothScrolling) {
        elements.smoothScrolling.checked = settings.accessibility.smoothScrolling;
    }

    if (elements.highContrast) {
        elements.highContrast.checked = settings.accessibility.highContrast;
    }

    if (elements.focusVisible) {
        elements.focusVisible.checked = settings.accessibility.focusVisible;
    }

    if (elements.screenReader) {
        elements.screenReader.checked = settings.accessibility.screenReader;
    }

    if (elements.autoplayMusic) {
        elements.autoplayMusic.checked = settings.misc.autoplayMusic;
    }

    if (elements.screenShake) {
        elements.screenShake.checked = settings.misc.screenShake;
    }

    if (elements.typewriterSpeed) {
        elements.typewriterSpeed.value = settings.misc.typewriterSpeed;
        if (elements.typewriterSpeedValue) {
            elements.typewriterSpeedValue.textContent = settings.misc.typewriterSpeed + '%';
        }
    }

    if (elements.debugMode) {
        elements.debugMode.checked = settings.misc.debugMode;
    }
}

function resetAllSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
        localStorage.removeItem('portfolio-settings');
        localStorage.removeItem('preferred-theme');
        localStorage.removeItem('custom-theme');

        settings = {
            cursor: {
                enabled: !isMobile && !isTouch,
                size: 12,
                opacity: 100,
                followerSize: 36
            },
            performance: {
                showFloatingElements: !isMobile,
                showParticles: !isMobile,
                showCodeSnippets: !isMobile,
                showGeometricShapes: !isMobile,
                animationSpeed: isMobile ? mobileAnimationSpeed : (isLowEndDevice ? 50 : 100),
                parallaxIntensity: isMobile ? 0 : 100,
                batterySaver: false
            },
            accessibility: {
                reducedMotion: prefersReducedMotion || isLowEndDevice || isMobile,
                smoothScrolling: true,
                highContrast: false,
                focusVisible: true,
                screenReader: true
            },
            misc: {
                autoplayMusic: false,
                screenShake: !isMobile,
                typewriterSpeed: 100,
                debugMode: false
            }
        };

        location.reload();
    }
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
    elements.settingsMenu.setAttribute('aria-hidden', 'false');
    elements.settingsBtn.setAttribute('aria-expanded', 'true');
    showSettingsSection('main');

    if (isMobile) {
        document.body.style.overflow = 'hidden';
    }
}

function closeSettings() {
    elements.settingsMenu.classList.remove('active');
    elements.settingsMenu.setAttribute('aria-hidden', 'true');
    elements.settingsBtn.setAttribute('aria-expanded', 'false');

    if (isMobile) {
        document.body.style.overflow = '';
    }
}

function initAudioControls() {
    if (elements.playPauseBtn) {
        const handlePlayPause = (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlayPause();
        };

        elements.playPauseBtn.addEventListener('click', handlePlayPause);
        if (isTouch) {
            elements.playPauseBtn.addEventListener('touchend', handlePlayPause);
        }
    }

    if (elements.nextBtn) {
        const handleNext = (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextTrack();
        };

        elements.nextBtn.addEventListener('click', handleNext);
        if (isTouch) {
            elements.nextBtn.addEventListener('touchend', handleNext);
        }
    }

    if (elements.prevBtn) {
        const handlePrev = (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevTrack();
        };

        elements.prevBtn.addEventListener('click', handlePrev);
        if (isTouch) {
            elements.prevBtn.addEventListener('touchend', handlePrev);
        }
    }

    if (elements.progressBar) {
        const handleSeek = (e) => {
            e.preventDefault();
            e.stopPropagation();
            seekTo(e);
        };

        elements.progressBar.addEventListener('click', handleSeek);

        if (isTouch) {
            elements.progressBar.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const touch = e.changedTouches[0];
                const rect = elements.progressBar.getBoundingClientRect();
                const clickX = touch.clientX - rect.left;
                const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                if (elements.audioPlayer.duration) {
                    elements.audioPlayer.currentTime = elements.audioPlayer.duration * percentage;
                }
            });
        }
    }

    if (elements.volumeSlider) {
        const handleVolumeChange = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setVolume(parseFloat(e.target.value));
        };

        elements.volumeSlider.addEventListener('input', handleVolumeChange);
        elements.volumeSlider.addEventListener('change', handleVolumeChange);

        if (isTouch) {
            elements.volumeSlider.addEventListener('touchmove', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const touch = e.touches[0];
                const rect = elements.volumeSlider.getBoundingClientRect();
                const percentage = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                const value = percentage * 100;
                setVolume(value);
            });
        }
    }

    initPlaylistControls();
}

function initPlaylistControls() {
    document.querySelectorAll('.playlist-item').forEach((item) => {
        const handlePlaylistClick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            hasUserInteracted = true;

            const index = parseInt(item.getAttribute('data-index'));
            if (!isNaN(index)) {
                loadTrack(index);

                setTimeout(() => {
                    const playPromise = elements.audioPlayer.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            if (settings.misc.debugMode) console.error('Play failed:', error);
                            showAudioError('Playback failed. Please try again.');
                        });
                    }
                }, 200);
            }
        };

        item.removeEventListener('click', handlePlaylistClick);
        item.removeEventListener('touchend', handlePlaylistClick);

        item.addEventListener('click', handlePlaylistClick);

        if (isTouch) {
            item.addEventListener('touchend', handlePlaylistClick);
        }
    });
}

function initFloatingEmojis() {
    createFloatingEmojis();
    document.removeEventListener('themeChanged', updateFloatingEmojis);
    document.addEventListener('themeChanged', updateFloatingEmojis);
}

function createFloatingEmojis() {
    document.querySelectorAll('.floating-emoji').forEach(el => el.remove());

    if (!settings.performance.showFloatingElements) return;

    const currentTheme = document.body.getAttribute('data-theme') || 'default';
    const emojis = themeEmojis[currentTheme] || themeEmojis.default;

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

        const emojiCount = isMobile ?
            (currentTheme === 'jojos' ? 8 : 6) :
            (currentTheme === 'jojos' ? 15 : 10);

        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.className = `floating-emoji ${currentTheme}-${i + 1}`;
            emoji.textContent = emojis[i % emojis.length];

            emoji.style.position = 'absolute';
            emoji.style.left = Math.random() * 90 + '%';
            emoji.style.top = Math.random() * 90 + '%';
            emoji.style.animationDelay = Math.random() * 25 + 's';
            emoji.style.animationDuration = (Math.random() * 10 + 25) + 's';
            emoji.style.pointerEvents = 'none';
            emoji.style.userSelect = 'none';
            emoji.style.zIndex = '1';

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
    if (!settings.performance.showFloatingElements) {
        return;
    }

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

function setupDeviceOptimizations() {
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
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
        }

        const passiveEvents = ['touchstart', 'touchmove', 'touchend'];
        passiveEvents.forEach(event => {
            document.addEventListener(event, () => { }, { passive: true });
        });

        addTouchFeedback();
    }
}

function addTouchFeedback() {
    const touchElements = document.querySelectorAll(`
        button, 
        .nav-link, 
        .mobile-nav-link, 
        .contact-link, 
        .project-link, 
        .settings-category, 
        .theme-option, 
        .playlist-item, 
        .control-btn,
        .toggle-switch,
        .settings-back-btn,
        .mobile-close-btn
    `);

    touchElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            if (!this.classList.contains('no-touch-feedback')) {
                this.style.transform = 'scale(0.95)';
                this.style.transition = 'transform 0.1s ease';
            }
        }, { passive: true });

        element.addEventListener('touchend', function(e) {
            if (!this.classList.contains('no-touch-feedback')) {
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.transition = '';
                }, 150);
            }
        }, { passive: true });

        element.addEventListener('touchcancel', function(e) {
            if (!this.classList.contains('no-touch-feedback')) {
                this.style.transform = '';
                this.style.transition = '';
            }
        }, { passive: true });
    });
}

function optimizeForMobile() {
    if (elements.cursor) elements.cursor.style.display = 'none';
    if (elements.follower) elements.follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.body.classList.remove('custom-cursor-active');

    document.body.classList.add('mobile-device');

    const passiveOptions = { passive: true };
    document.addEventListener('touchstart', () => { }, passiveOptions);
    document.addEventListener('touchmove', () => { }, passiveOptions);
    document.addEventListener('touchend', () => { }, passiveOptions);

    settings.performance.parallaxIntensity = 0;
    settings.misc.screenShake = false;

    if (settings.accessibility.reducedMotion || settings.performance.batterySaver) {
        disableHeavyAnimations();
    } else {
        updateFloatingElementsVisibility();
    }
}

function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.add('fade-out');

        setTimeout(() => {
            if (elements.loadingScreen.parentNode) {
                elements.loadingScreen.parentNode.removeChild(elements.loadingScreen);
            }
        }, 1000);
    }
}

function initCustomCursor() {
    if (!elements.cursor || !elements.follower || isMobile || isTouch || !settings.cursor.enabled) {
        return;
    }

    document.body.classList.add('custom-cursor-active');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isMoving = false;

    document.addEventListener('mousemove', throttle((e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;

        const halfSize = settings.cursor.size / 2;
        elements.cursor.style.transform = `translate3d(${mouseX - halfSize}px, ${mouseY - halfSize}px, 0)`;
    }, 16), { passive: true });

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

function initNavigation() {
    window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
}

function handleScroll() {
    const currentTime = Date.now();
    const currentScrollTop = window.pageYOffset;

    const timeDelta = currentTime - lastScrollTime;
    const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
    scrollSpeed = timeDelta > 0 ? scrollDelta / timeDelta : 0;

    lastScrollTime = currentTime;
    lastScrollTop = currentScrollTop;

    if (elements.navbar) {
        if (currentScrollTop > 100) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }
}

function handleAnchorClick(e) {
    const href = this.getAttribute('href');
    if (!href) {
        return;
    }
    if (href === '#') {
        e.preventDefault();
        return;
    }

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
        closeMobileMenu();
        closeSettings();

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

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

function initParallax() {
    if (isLowEndDevice || prefersReducedMotion || isMobile || settings.accessibility.reducedMotion || settings.performance.parallaxIntensity === 0) return;

    window.addEventListener('scroll', throttle(handleParallax, 16), { passive: true });
}

function handleParallax() {
    if (settings.performance.parallaxIntensity === 0) return;

    const scrolled = window.pageYOffset;
    const intensity = settings.performance.parallaxIntensity / 100;
    const shapes = document.querySelectorAll('.geometric-shape');

    shapes.forEach((shape, index) => {
        const speed = (0.2 + (index * 0.1)) * intensity;
        const yPos = scrolled * speed;
        const rotation = scrolled * 0.05 * intensity;
        shape.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
    });
}

function initTypingAnimation() {
    if (!elements.heroTitle || isMobile || prefersReducedMotion || settings.accessibility.reducedMotion) return;

    const titleText = elements.heroTitle.textContent.trim();
    elements.heroTitle.textContent = '';
    elements.heroTitle.style.opacity = '1';
    elements.heroTitle.classList.add('typewriter-cursor');

    setTimeout(() => {
        let i = 0;
        const speed = 120 - (settings.misc.typewriterSpeed / 100 * 70);
        const typeInterval = setInterval(() => {
            elements.heroTitle.textContent = titleText.slice(0, i);
            i++;
            if (i > titleText.length) {
                clearInterval(typeInterval);
                elements.heroTitle.textContent = titleText;
                elements.heroTitle.classList.remove('typewriter-cursor');
            }
        }, speed);
    }, 1500);
}

function init3DTiltEffects() {
    if (isLowEndDevice || prefersReducedMotion || isMobile || isTouch || settings.accessibility.reducedMotion) return;

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

function initMobileMenu() {
    if (!elements.mobileMenuBtn || !elements.mobileMenu) return;

    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    elements.mobileMenu.addEventListener('click', (e) => {
        if (e.target === elements.mobileMenu) {
            closeMobileMenu();
        }
    });

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
    elements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    elements.mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    elements.mobileMenu.focus();
}

function closeMobileMenu() {
    elements.mobileMenuBtn.classList.remove('active');
    elements.mobileMenu.classList.remove('active');
    elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    elements.mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function initBackToTop() {
    if (!elements.backToTop) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            elements.backToTop.classList.add('show');
        } else {
            elements.backToTop.classList.remove('show');
        }
    }, 100), { passive: true });

    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initThemeSystem() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeGrid = document.querySelector('.theme-grid');
    const handleThemeSelect = (event) => {
        const option = event.target.closest('.theme-option');
        if (!option) return;
        event.preventDefault();
        const theme = option.getAttribute('data-theme');
        if (theme) {
            setTheme(theme);
        }
    };

    if (themeGrid && window.PointerEvent) {
        themeGrid.addEventListener('pointerup', handleThemeSelect);
    } else if (themeGrid) {
        themeGrid.addEventListener('click', handleThemeSelect);
    } else {
        themeOptions.forEach(option => {
            option.addEventListener('click', handleThemeSelect);
        });
    }

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
        if (settings.misc.debugMode) console.warn('Failed to save theme preference:', e);
    }

    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    const selectedOption = document.querySelector(`[data-theme="${themeName}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }

    if (themeName !== 'custom') {
        try {
            localStorage.removeItem('custom-theme');
        } catch (e) {
            if (settings.misc.debugMode) console.warn('Failed to remove custom theme:', e);
        }
    }

    if (previousTheme !== themeName && settings.performance.showFloatingElements) {
        updateFloatingEmojis();
    }

    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName, previousTheme } }));
}

function initCustomThemeMaker() {
    if (!elements.primaryColorPicker || !elements.accentColorPicker || !elements.applyCustomThemeBtn) return;

    elements.applyCustomThemeBtn.addEventListener('click', applyCustomTheme);

    try {
        const savedCustomTheme = localStorage.getItem('custom-theme');
        if (savedCustomTheme) {
            const customTheme = JSON.parse(savedCustomTheme);
            elements.primaryColorPicker.value = customTheme.primary;
            elements.accentColorPicker.value = customTheme.accent;
        }
    } catch (e) {
        if (settings.misc.debugMode) console.warn('Failed to load custom theme:', e);
    }
}

function applyCustomTheme() {
    const primaryColor = elements.primaryColorPicker.value;
    const accentColor = elements.accentColorPicker.value;

    const customTheme = generateCustomTheme(primaryColor, accentColor);

    applyThemeVariables(customTheme);

    try {
        localStorage.setItem('custom-theme', JSON.stringify({
            primary: primaryColor,
            accent: accentColor
        }));
    } catch (e) {
        if (settings.misc.debugMode) console.warn('Failed to save custom theme:', e);
    }

    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    document.body.setAttribute('data-theme', 'custom');

    try {
        localStorage.setItem('preferred-theme', 'custom');
    } catch (e) {
        if (settings.misc.debugMode) console.warn('Failed to save theme preference:', e);
    }

    elements.applyCustomThemeBtn.textContent = 'Applied!';
    setTimeout(() => {
        elements.applyCustomThemeBtn.textContent = 'Apply Custom Theme';
    }, 2000);
}

function generateCustomTheme(primaryColor, accentColor) {
    const primaryRGB = hexToRgb(primaryColor);
    const accentRGB = hexToRgb(accentColor);

    const secondaryColor = darkenColor(primaryColor, 0.1);
    const tertiaryColor = lightenColor(primaryColor, 0.1);
    const quaternaryColor = lightenColor(primaryColor, 0.2);

    const primaryTextColor = getContrastColor(primaryColor);
    const secondaryTextColor = blendColors(primaryTextColor, accentColor, 0.7);
    const tertiaryTextColor = blendColors(primaryTextColor, accentColor, 0.4);

    return {
        '--primary-bg': primaryColor,
        '--primary-bg-rgb': primaryRGB ? `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}` : '0, 0, 0',
        '--secondary-bg': secondaryColor,
        '--tertiary-bg': tertiaryColor,
        '--quaternary-bg': quaternaryColor,
        '--primary-text': primaryTextColor,
        '--secondary-text': secondaryTextColor,
        '--tertiary-text': tertiaryTextColor,
        '--accent-color': accentColor,
        '--border-color': `${accentColor}33`,
        '--hover-bg': `${accentColor}1A`,
        '--shadow-light': `${accentColor}4D`,
        '--shadow-dark': `${primaryColor}CC`,
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

    document.documentElement.style.setProperty('--animation-duration', '0.1s');

    settings.performance.showFloatingElements = false;
    settings.performance.showParticles = false;
    settings.performance.showCodeSnippets = false;
    settings.performance.showGeometricShapes = false;

    updateFloatingElementsVisibility();
    removeFloatingEmojis();
}

function enableHeavyAnimations() {
    const heavyAnimationElements = document.querySelectorAll('.floating-element, .floating-emoji');

    heavyAnimationElements.forEach(el => {
        el.style.animation = '';
        el.style.display = '';
    });

    updateFloatingElementsVisibility();
    updateAnimationSpeed();

    document.documentElement.style.removeProperty('--animation-duration');

    if (settings.performance.showFloatingElements) {
        initFloatingEmojis();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    hasUserInteracted = true;

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

function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width >= 768) {
        closeMobileMenu();
    }

    if (width < 768 && elements.settingsMenu.classList.contains('active')) {
        showSettingsSection(currentSettingsSection);
    }

    if (isMobile) {
        document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);

        if (elements.settingsMenu.classList.contains('active')) {
            setTimeout(() => {
                showSettingsSection(currentSettingsSection);
            }, 100);
        }
    }

    updateFloatingElementsVisibility();

    if (settings.performance.showFloatingElements) {
        setTimeout(createFloatingEmojis, 250);
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        handleResize();
    }, 100);
});

window.addEventListener('error', (e) => {
    if (settings.misc.debugMode) console.error('JavaScript error:', e.error);

    if (e.error && e.error.message) {
        if (e.error.message.includes('audioPlayer')) {
            showAudioError('Audio player encountered an error. Please refresh the page.');
        }
    }
});

window.addEventListener('unhandledrejection', (e) => {
    if (settings.misc.debugMode) console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

window.addEventListener('beforeunload', () => {
    saveSettings();

    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);

    if (elements.audioPlayer) {
        elements.audioPlayer.pause();
        elements.audioPlayer.src = '';
        elements.audioPlayer.load();
    }

    removeFloatingEmojis();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (isPlaying && elements.audioPlayer) {
            elements.audioPlayer.pause();
        }

        if (settings.performance.showFloatingElements) {
            const animatedElements = document.querySelectorAll('.floating-element, .floating-emoji');
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        }
    } else {
        if (settings.performance.showFloatingElements && !settings.accessibility.reducedMotion && !settings.performance.batterySaver) {
            const animatedElements = document.querySelectorAll('.floating-element, .floating-emoji');
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    }
});

document.addEventListener('focusin', (e) => {
    if (!e.target.matches('a, button, input, select, textarea, [tabindex]')) {
        return;
    }

    if (settings.accessibility.focusVisible) {
        e.target.style.outline = '2px solid var(--accent-color)';
        e.target.style.outlineOffset = '2px';
        e.target.style.borderRadius = '4px';
    }
});

document.addEventListener('focusout', (e) => {
    if (settings.accessibility.focusVisible) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

if (document.readyState === 'complete') {
    handleWindowLoad();
} else {
    window.addEventListener('load', handleWindowLoad);
}

if (window.performance && window.performance.measure) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (settings.misc.debugMode) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('🚀 Portfolio Performance Stats:');
                console.log(`📊 DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
                console.log(`📊 Page Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
                console.log(`📊 Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
            }
        }, 1000);
    });
}

if (settings.misc.debugMode) {
    console.log('🚀 Enhanced mobile-optimized portfolio script loaded successfully!');
    console.log('📱 Device optimizations active for:', deviceType);
    console.log('⚡ Performance mode:', isLowEndDevice ? 'Low-end device detected' : 'Standard performance');
    console.log('🎀 JoJo\'s theme with enhanced floating emojis ready!');
    console.log('🎵 Audio system with autoplay fixes initialized!');
}
