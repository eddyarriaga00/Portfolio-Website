/* ===========================
   GLOBAL VARIABLES
   =========================== */

let scrollSpeed = 0;
let lastScrollTime = Date.now();
let lastScrollTop = 0;

// Audio player variables
const audioPlayer = document.getElementById('audioPlayer');
let currentTrack = -1;
let isPlaying = false;
let volume = 0.7;

// Track data with local audio files
const tracks = [
    {
        title: "Chill Vibes",
        artist: "LoFi Artist",
        src: "./music/chill-vibes.mp3"
    },
    {
        title: "Study Session",
        artist: "Focus Beats",
        src: "./music/study-session.mp3"
    },
    {
        title: "Night Dreams",
        artist: "Ambient Sounds",
        src: "./music/night-dreams.mp3"
    },
    {
        title: "Coffee Morning",
        artist: "Cafe Beats",
        src: "./music/coffee-morning.mp3"
    },
    {
        title: "Rain Drops",
        artist: "Nature LoFi",
        src: "./music/rain-drops.mp3"
    }
];

/* ===========================
   AUDIO PLAYER FUNCTIONS
   =========================== */

// Initialize audio player
function initAudioPlayer() {
    audioPlayer.volume = volume;
    updateVolumeDisplay();
    
    // Audio event listeners
    audioPlayer.addEventListener('loadedmetadata', function() {
        document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
    });
    
    audioPlayer.addEventListener('timeupdate', function() {
        if (audioPlayer.duration) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            document.getElementById('progressFill').style.width = progressPercent + '%';
            document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
        }
    });
    
    audioPlayer.addEventListener('ended', function() {
        nextTrack();
    });
    
    audioPlayer.addEventListener('error', function(e) {
        console.error('Audio error:', e);
        showAudioError();
        setPlayButtonState(false);
    });
    
    audioPlayer.addEventListener('canplay', function() {
        hideAudioError();
    });
    
    audioPlayer.addEventListener('play', function() {
        setPlayButtonState(true);
    });
    
    audioPlayer.addEventListener('pause', function() {
        setPlayButtonState(false);
    });
}

// Show/hide audio error
function showAudioError() {
    document.getElementById('audioError').style.display = 'block';
}

function hideAudioError() {
    document.getElementById('audioError').style.display = 'none';
}

// Format time in MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// Update play button state
function setPlayButtonState(playing) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.textContent = playing ? '⏸' : '▶';
    isPlaying = playing;
}

// Load and play track
function loadTrack(trackIndex) {
    if (trackIndex < 0 || trackIndex >= tracks.length) return;
    
    currentTrack = trackIndex;
    const track = tracks[trackIndex];
    
    // Update UI
    document.getElementById('currentTrackTitle').textContent = track.title;
    document.getElementById('currentTrackArtist').textContent = track.artist;
    
    // Update playlist active state
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === trackIndex);
    });
    
    // Load audio
    audioPlayer.src = track.src;
    audioPlayer.load();
    
    // Reset progress
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('duration').textContent = '0:00';
}

// Play/pause functionality
function togglePlayPause() {
    if (currentTrack === -1) {
        loadTrack(0);
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Play failed:', error);
                showAudioError();
            });
        }
    }
}

// Next track
function nextTrack() {
    const nextIndex = (currentTrack + 1) % tracks.length;
    loadTrack(nextIndex);
    if (isPlaying) {
        setTimeout(() => audioPlayer.play().catch(e => console.error('Auto-play failed:', e)), 100);
    }
}

// Previous track
function prevTrack() {
    const prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    loadTrack(prevIndex);
    if (isPlaying) {
        setTimeout(() => audioPlayer.play().catch(e => console.error('Auto-play failed:', e)), 100);
    }
}

// Progress bar click
function seekTo(event) {
    if (audioPlayer.duration) {
        const progressBar = document.getElementById('progressBar');
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        audioPlayer.currentTime = audioPlayer.duration * percentage;
    }
}

// Volume control
function setVolume(event) {
    const volumeSlider = document.getElementById('volumeSlider');
    const rect = volumeSlider.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    volume = Math.max(0, Math.min(1, clickX / width));
    
    audioPlayer.volume = volume;
    updateVolumeDisplay();
}

function updateVolumeDisplay() {
    document.getElementById('volumeFill').style.width = (volume * 100) + '%';
    
    const volumeIcon = document.querySelector('.volume-icon');
    if (volume === 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 0.5) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

/* ===========================
   LOADING SCREEN
   =========================== */

window.addEventListener('load', function() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
    }, 3000);
});

/* ===========================
   CUSTOM CURSOR
   =========================== */

const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX - 8 + 'px';
        cursor.style.top = mouseY - 8 + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;
        
        follower.style.left = followerX - 18 + 'px';
        follower.style.top = followerY - 18 + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
}

// Hover effects for cursor
const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-content, .logo, .theme-option, .playlist-item, .control-btn');
hoverElements.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
        if (cursor && follower) {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.5)';
            follower.style.opacity = '0.8';
        }
    });
    el.addEventListener('mouseleave', function() {
        if (cursor && follower) {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.opacity = '0.6';
        }
    });
});

/* ===========================
   NAVIGATION & SCROLLING
   =========================== */

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    const currentTime = Date.now();
    const currentScrollTop = window.pageYOffset;
    
    const timeDelta = currentTime - lastScrollTime;
    const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
    scrollSpeed = scrollDelta / timeDelta;
    
    lastScrollTime = currentTime;
    lastScrollTop = currentScrollTop;
    
    if (nav) {
        if (currentScrollTop > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===========================
   SCROLL ANIMATIONS
   =========================== */

const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -10px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            const delay = scrollSpeed > 2 ? 0 : Math.min(entry.target.dataset.delay || 0, 300);
            
            setTimeout(function() {
                entry.target.classList.add('animated');
                
                if (entry.target.querySelector('.stat-number[data-target]')) {
                    animateNumbers(entry.target);
                }
            }, delay);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(function(el, index) {
    el.dataset.delay = index * 50;
    observer.observe(el);
});

// Animate number counters
function animateNumbers(container) {
    const numbers = container.querySelectorAll('.stat-number[data-target]');
    numbers.forEach(function(num) {
        const target = parseInt(num.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.floor(current) + (target > 10 ? '+' : '');
        }, 40);
    });
}

/* ===========================
   PARALLAX EFFECTS
   =========================== */

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.geometric-shape');
    
    shapes.forEach(function(shape, index) {
        const speed = 0.2 + (index * 0.1);
        const yPos = scrolled * speed;
        const rotation = scrolled * 0.05;
        shape.style.transform = 'translateY(' + yPos + 'px) rotate(' + rotation + 'deg)';
    });
});

/* ===========================
   TYPING ANIMATION
   =========================== */

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    setTimeout(function() {
        let i = 0;
        const typeInterval = setInterval(function() {
            heroTitle.textContent = titleText.slice(0, i);
            i++;
            if (i > titleText.length) {
                clearInterval(typeInterval);
            }
        }, 100);
    }, 1500);
}

/* ===========================
   3D TILT EFFECTS
   =========================== */

document.querySelectorAll('.project-card, .skill-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-12px)';
    });
    
    card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ===========================
   SETTINGS PANEL
   =========================== */

const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const themeOptions = document.querySelectorAll('.theme-option');

if (settingsBtn && settingsMenu) {
    settingsBtn.addEventListener('click', function() {
        settingsMenu.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!settingsBtn.contains(e.target) && !settingsMenu.contains(e.target)) {
            settingsMenu.classList.remove('active');
        }
    });
}

/* ===========================
   THEME SWITCHING
   =========================== */

function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('preferred-theme', themeName);
    
    themeOptions.forEach(function(option) {
        option.classList.remove('active');
    });
    
    const selectedOption = document.querySelector('[data-theme="' + themeName + '"]');
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
}

themeOptions.forEach(function(option) {
    option.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        setTheme(theme);
    });
});

// Load saved theme
const savedTheme = localStorage.getItem('preferred-theme');
if (savedTheme) {
    setTheme(savedTheme);
}

/* ===========================
   EVENT LISTENERS
   =========================== */

// Audio player controls
document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
document.getElementById('nextBtn').addEventListener('click', nextTrack);
document.getElementById('prevBtn').addEventListener('click', prevTrack);
document.getElementById('progressBar').addEventListener('click', seekTo);
document.getElementById('volumeSlider').addEventListener('click', setVolume);

// Playlist item clicks
document.querySelectorAll('.playlist-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        loadTrack(index);
    });
});

/* ===========================
   PERFORMANCE OPTIMIZATION
   =========================== */

// Disable heavy animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.querySelectorAll('.floating-code, .geometric-shape, .floating-tech-icon, .floating-symbols, .floating-contact-icons').forEach(function(el) {
        el.style.animation = 'none';
    });
}

/* ===========================
   INITIALIZATION
   =========================== */

// Initialize the audio player when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAudioPlayer();
});

// Initialize audio player as fallback
initAudioPlayer();