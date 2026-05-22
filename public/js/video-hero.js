/**
 * Home page — TCS-style fixed wedding video; content scrolls up and covers the hero.
 */
const HERO_VIDEO_URL = '/videos/hero-destination-wedding.mp4';

function pickHeroVideoUrl(videoEl) {
    return (
        videoEl?.dataset.srcHd ||
        videoEl?.dataset.srcSd ||
        HERO_VIDEO_URL
    );
}

function startHeroVideo(video) {
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const url = pickHeroVideoUrl(video);
    if (video.src !== url && !video.src.endsWith(url)) {
        video.src = url;
        video.load();
    }

    const tryPlay = () => {
        video.play()
            .then(() => video.classList.add('is-playing'))
            .catch(() => {});
    };

    if (video.readyState >= 2) {
        tryPlay();
    } else {
        video.addEventListener('loadeddata', tryPlay, { once: true });
        video.addEventListener('canplay', tryPlay, { once: true });
    }
}

function initVideoHero() {
    const fixed = document.getElementById('video-hero-fixed');
    const spacer = document.querySelector('.video-hero-scroll-space');
    const main = document.getElementById('home-start');
    const caption = document.getElementById('video-hero-caption');
    const toolbar = document.querySelector('.video-hero-toolbar');
    const nav = document.getElementById('navbar');
    const video = document.getElementById('video-hero-media');
    const pauseBtn = document.getElementById('video-hero-pause');

    if (!fixed || !spacer || !main || document.body.dataset.page !== 'home') return;

    if (nav) nav.classList.add('navbar-video-hero');

    const onScroll = () => {
        const scrollY = window.scrollY;
        const heroH = spacer.offsetHeight || window.innerHeight;
        const fadeEnd = heroH * 0.75;
        const fade = Math.max(0, 1 - scrollY / fadeEnd);

        if (caption) caption.style.opacity = String(fade);
        if (toolbar) toolbar.style.opacity = String(fade);

        if (nav) {
            nav.classList.toggle('navbar-solid', scrollY > heroH * 0.35);
        }

        fixed.classList.toggle('is-covered', scrollY >= heroH - 2);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    startHeroVideo(video);

    document.body.addEventListener(
        'click',
        () => {
            if (video && video.paused) startHeroVideo(video);
        },
        { once: true }
    );

    if (pauseBtn && video) {
        const iconPause = pauseBtn.querySelector('.video-hero-pause-icon--pause');
        const iconPlay = pauseBtn.querySelector('.video-hero-pause-icon--play');

        pauseBtn.addEventListener('click', () => {
            if (video.paused) {
                startHeroVideo(video);
                pauseBtn.setAttribute('aria-label', 'Pause video');
                iconPause?.removeAttribute('hidden');
                iconPlay?.setAttribute('hidden', '');
            } else {
                video.pause();
                video.classList.remove('is-playing');
                pauseBtn.setAttribute('aria-label', 'Play video');
                iconPause?.setAttribute('hidden', '');
                iconPlay?.removeAttribute('hidden');
            }
        });
    }

    document.querySelector('.video-hero-learn')?.addEventListener('click', (e) => {
        e.preventDefault();
        main.scrollIntoView({ behavior: 'smooth' });
    });
}
