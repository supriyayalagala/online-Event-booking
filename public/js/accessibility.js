const A11Y_STORAGE_KEY = 'ticketflow_a11y_settings';

const A11Y_DEFAULTS = {
    theme: 'default',
    fontLevel: 0,
    lineLevel: 0,
    widgetHidden: false
};

const FONT_LABELS = ['Small', 'Normal', 'Large', 'Extra large'];
const LINE_LABELS = ['Compact', 'Normal', 'Relaxed', 'Spacious'];

function loadA11ySettings() {
    try {
        const raw = localStorage.getItem(A11Y_STORAGE_KEY);
        return raw ? { ...A11Y_DEFAULTS, ...JSON.parse(raw) } : { ...A11Y_DEFAULTS };
    } catch {
        return { ...A11Y_DEFAULTS };
    }
}

function saveA11ySettings(settings) {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
}

function clampLevel(level, min = -1, max = 2) {
    return Math.max(min, Math.min(max, level));
}

function levelToScale(level, step = 0.125) {
    return 1 + level * step;
}

function applyA11ySettings(settings) {
    const html = document.documentElement;
    const fontScale = levelToScale(settings.fontLevel);
    const lineScale = levelToScale(settings.lineLevel, 0.15);

    html.style.setProperty('--a11y-font-scale', fontScale);
    html.style.setProperty('--a11y-line-scale', lineScale);

    html.classList.toggle('a11y-dark', settings.theme === 'dark');
    html.classList.toggle('a11y-font-active', settings.fontLevel !== 0);
    html.classList.toggle('a11y-line-active', settings.lineLevel !== 0);

    const fab = document.getElementById('a11y-fab');
    if (fab) {
        fab.style.display = settings.widgetHidden ? 'none' : 'flex';
    }

    updateA11yUI(settings);
}

function updateA11yUI(settings) {
    const panel = document.getElementById('a11y-panel');
    if (!panel) return;

    panel.querySelectorAll('[data-a11y-theme]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.a11yTheme === settings.theme);
    });
    panel.querySelectorAll('.a11y-segment-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.a11yTheme === settings.theme);
    });

    const fontLabel = document.getElementById('a11y-font-label');
    const lineLabel = document.getElementById('a11y-line-label');
    if (fontLabel) fontLabel.textContent = FONT_LABELS[settings.fontLevel + 1] || 'Normal';
    if (lineLabel) lineLabel.textContent = LINE_LABELS[settings.lineLevel + 1] || 'Normal';

    const fontMinus = document.getElementById('a11y-font-minus');
    const fontPlus = document.getElementById('a11y-font-plus');
    const lineMinus = document.getElementById('a11y-line-minus');
    const linePlus = document.getElementById('a11y-line-plus');

    if (fontMinus) fontMinus.disabled = settings.fontLevel <= -1;
    if (fontPlus) fontPlus.disabled = settings.fontLevel >= 2;
    if (lineMinus) lineMinus.disabled = settings.lineLevel <= -1;
    if (linePlus) linePlus.disabled = settings.lineLevel >= 2;
}

function injectAccessibilityWidget() {
    if (document.getElementById('a11y-widget-root')) return;

    const root = document.createElement('div');
    root.id = 'a11y-widget-root';
    root.innerHTML = `
        <button type="button" id="a11y-fab" class="a11y-fab" aria-label="Open accessibility options" title="Accessibility options">
            <span class="a11y-fab-icon" aria-hidden="true">♿</span>
        </button>

        <div id="a11y-panel" class="a11y-panel" role="dialog" aria-label="Accessibility options" aria-hidden="true">
            <div class="a11y-panel-header">
                <div class="a11y-panel-brand">
                    <span class="a11y-panel-logo">TF</span>
                    <div>
                        <strong>Accessibility</strong>
                        <span>Customize your view</span>
                    </div>
                </div>
                <button type="button" class="a11y-close" id="a11y-close" aria-label="Close">×</button>
            </div>

            <div class="a11y-panel-body">
                <div class="a11y-card">
                    <p class="a11y-card-title">Color theme</p>
                    <div class="a11y-segment" role="group" aria-label="Color theme">
                        <button type="button" class="a11y-segment-btn active" data-a11y-theme="default">
                            <span class="a11y-segment-icon">☀️</span> Light
                        </button>
                        <button type="button" class="a11y-segment-btn" data-a11y-theme="dark">
                            <span class="a11y-segment-icon">🌙</span> Dark
                        </button>
                    </div>
                </div>

                <div class="a11y-card">
                    <p class="a11y-card-title">Text size</p>
                    <div class="a11y-control-row">
                        <button type="button" class="a11y-ctrl-btn" id="a11y-font-minus" aria-label="Smaller text">−</button>
                        <span class="a11y-ctrl-value" id="a11y-font-label">Normal</span>
                        <button type="button" class="a11y-ctrl-btn" id="a11y-font-plus" aria-label="Larger text">+</button>
                    </div>
                </div>

                <div class="a11y-card">
                    <p class="a11y-card-title">Line spacing</p>
                    <div class="a11y-control-row">
                        <button type="button" class="a11y-ctrl-btn" id="a11y-line-minus" aria-label="Tighter spacing">−</button>
                        <span class="a11y-ctrl-value" id="a11y-line-label">Normal</span>
                        <button type="button" class="a11y-ctrl-btn" id="a11y-line-plus" aria-label="Looser spacing">+</button>
                    </div>
                </div>
            </div>

            <div class="a11y-panel-footer">
                <button type="button" class="a11y-footer-link" id="a11y-reset">Reset all</button>
                <button type="button" class="a11y-footer-link muted" id="a11y-hide">Hide button</button>
            </div>
        </div>
    `;

    document.body.appendChild(root);
}

function initAccessibility() {
    injectAccessibilityWidget();

    let settings = loadA11ySettings();
    applyA11ySettings(settings);

    const fab = document.getElementById('a11y-fab');
    const panel = document.getElementById('a11y-panel');
    const closeBtn = document.getElementById('a11y-close');

    const openPanel = () => {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        fab.setAttribute('aria-expanded', 'true');
    };

    const closePanel = () => {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        fab.setAttribute('aria-expanded', 'false');
    };

    fab.addEventListener('click', () => {
        panel.classList.contains('open') ? closePanel() : openPanel();
    });

    closeBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });

    document.getElementById('a11y-reset').addEventListener('click', () => {
        settings = { ...A11Y_DEFAULTS };
        saveA11ySettings(settings);
        applyA11ySettings(settings);
    });

    document.getElementById('a11y-hide').addEventListener('click', () => {
        settings.widgetHidden = true;
        saveA11ySettings(settings);
        closePanel();
        applyA11ySettings(settings);
    });

    panel.querySelectorAll('[data-a11y-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            settings.theme = btn.dataset.a11yTheme;
            saveA11ySettings(settings);
            applyA11ySettings(settings);
        });
    });

    document.getElementById('a11y-font-minus').addEventListener('click', () => {
        settings.fontLevel = clampLevel(settings.fontLevel - 1);
        saveA11ySettings(settings);
        applyA11ySettings(settings);
    });

    document.getElementById('a11y-font-plus').addEventListener('click', () => {
        settings.fontLevel = clampLevel(settings.fontLevel + 1);
        saveA11ySettings(settings);
        applyA11ySettings(settings);
    });

    document.getElementById('a11y-line-minus').addEventListener('click', () => {
        settings.lineLevel = clampLevel(settings.lineLevel - 1);
        saveA11ySettings(settings);
        applyA11ySettings(settings);
    });

    document.getElementById('a11y-line-plus').addEventListener('click', () => {
        settings.lineLevel = clampLevel(settings.lineLevel + 1);
        saveA11ySettings(settings);
        applyA11ySettings(settings);
    });
}

// Apply saved settings immediately (reduce flash)
(function applyA11yEarly() {
    const s = loadA11ySettings();
    document.documentElement.style.setProperty('--a11y-font-scale', levelToScale(s.fontLevel));
    document.documentElement.style.setProperty('--a11y-line-scale', levelToScale(s.lineLevel, 0.15));
    if (s.theme === 'dark') document.documentElement.classList.add('a11y-dark');
})();

document.addEventListener('DOMContentLoaded', initAccessibility);
