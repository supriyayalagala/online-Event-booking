/**
 * Small event video clips on cards, rails, and featured panels.
 */
const CATEGORY_DEFAULT_VIDEOS = {
    Wedding: '/videos/wedding-card.mp4',
    Birthday: 'https://videos.pexels.com/video-files/1093661/1093661-sd_640_360_30fps.mp4',
    Corporate: 'https://videos.pexels.com/video-files/1093662/1093662-sd_640_360_30fps.mp4',
    'Mature/Family Function': 'https://videos.pexels.com/video-files/1093666/1093666-sd_640_360_30fps.mp4',
    Other: 'https://videos.pexels.com/video-files/3209833/3209833-sd_640_360_30fps.mp4'
};

function escMedia(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderEventCardMedia(event, options = {}) {
    const poster = escMedia(event.imageUrl || '');
    const videoUrl = escMedia(event.videoUrl || '');
    const title = escMedia(event.title || 'Event');
    const imgClass = options.imgClass || 'ticket-event-card-img';
    const wrapClass = options.wrapClass || 'event-media-wrap';
    const videoClass = options.videoClass || 'event-card-video';

    if (!videoUrl) {
        return `<img src="${poster}" alt="${title}" class="${imgClass}" loading="lazy">`;
    }

    return `
        <div class="${wrapClass}">
            <video
                class="${videoClass} event-card-video"
                muted
                loop
                playsinline
                preload="none"
                poster="${poster}"
                data-src="${videoUrl}"
                aria-label="${title}"
            ></video>
        </div>
    `;
}

let eventVideoObserver;

function initLazyEventVideos(root = document) {
    const scope = root && root.querySelectorAll ? root : document;
    const videos = scope.querySelectorAll('video.event-card-video[data-src]:not([data-video-ready])');
    if (!videos.length) return;

    if (!eventVideoObserver) {
        eventVideoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        if (!video.dataset.videoReady) {
                            video.src = video.dataset.src;
                            video.dataset.videoReady = '1';
                        }
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            },
            { rootMargin: '80px', threshold: 0.2 }
        );
    }

    videos.forEach((video) => {
        if (!video.dataset.videoObserved) {
            video.dataset.videoObserved = '1';
            eventVideoObserver.observe(video);
        }
    });
}

function playFeaturedEventVideo(videoEl, event) {
    if (!videoEl || !event) return;
    const poster = event.imageUrl || '';
    const src = event.videoUrl || '';
    videoEl.poster = poster;
    if (!src) {
        videoEl.removeAttribute('src');
        videoEl.pause();
        return;
    }
    if (videoEl.dataset.src !== src) {
        videoEl.dataset.src = src;
        videoEl.src = src;
        videoEl.dataset.videoReady = '1';
    }
    videoEl.play().catch(() => {});
}
