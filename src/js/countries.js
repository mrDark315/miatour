import '../scss/countries.scss'
import '../scss/overlay.scss';
import "flag-icons/css/flag-icons.min.css";
import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';
import './header.js';

// Асинхронна функція для завантаження JSON-файлу
async function loadCountries() {
    const basePath = import.meta.env.BASE_URL || '/';
    const countriesDataPath = `${basePath}data/countries_list.json`;

    try {
        const response = await fetch(countriesDataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load countries:', error);
        return [];
    }
}

// OVERLAY POPULAR COUNTRIES
let overlayMainKeen = null;
let overlayThumbsKeen = null;

function initializeCountryKeen(mainSel, thumbsSel) {
    const mainEl = document.querySelector(mainSel);
    const thumbsEl = document.querySelector(thumbsSel);
    if (!mainEl || !thumbsEl) return;

    const setActiveThumb = (rel) => {
        Array.from(thumbsEl.children).forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === rel);
        });
    };

    const setActiveDot = (rel, dots) => {
        dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === rel);
        });
    };

    overlayThumbsKeen = new KeenSlider(thumbsEl, {
        renderMode: 'performance',
        drag: true,
        slides: {
            perView: 3,
            spacing: 10,
        },
        created(slider) {
        slider.slides.forEach((slide, idx) => {
            slide.addEventListener('click', () => {
            overlayMainKeen?.moveToIdx(idx);
            });
        });
        },
    });

    // Main slider (sync with thumbs)
    overlayMainKeen = new KeenSlider(mainEl, {
        loop: true,
        renderMode: 'performance',
        drag: true,
        slides: { perView: 1, spacing: 10, origin: 'auto' },
        created(s) {
        setActiveThumb(s.track.details.rel);
        mainEl.querySelectorAll('img').forEach((img) => {
            if (!img.complete) {
            img.addEventListener('load', () => s.update());
            img.addEventListener('error', () => s.update());
            }
        });
        },
        slideChanged(s) {
        const rel = s.track.details.rel;
        setActiveThumb(rel);

        const perView = overlayThumbsKeen?.options?.slides?.perView || 5;
        const start = overlayThumbsKeen.track.details.rel;
        const end = start + perView - 1;
        if (rel < start) overlayThumbsKeen.moveToIdx(rel);
        else if (rel > end) overlayThumbsKeen.moveToIdx(rel - perView + 1);
        },
    });
}

function destroyCountryKeen() {
    try { overlayMainKeen?.destroy(); } catch (e) {}
    try { overlayThumbsKeen?.destroy(); } catch (e) {}
    overlayMainKeen = null;
    overlayThumbsKeen = null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const countries = await loadCountries();
    const basePath = import.meta.env.BASE_URL || '/';

    const overlayWindow = document.querySelector('.overlay_window');
    const overlay_content = document.querySelector('.overlay_content');

    if (!countries || countries.length === 0) {
        console.error('No countries data loaded.');
        return;
    }

    const regionMapping = {
        'europe': '.europe',
        'asia': '.asia',
        'north_america': '.north_america',
        'central_america': '.central_america',
        'south_america': '.south_america',
        'africa': '.africa',
        'australia_oceania': '.australia_oceania',
        'caribbean': '.caribbean'
    };

    for (const regionName in regionMapping) {
        const containerSelector = regionMapping[regionName];
        const container = document.querySelector(containerSelector);

        if (container) {
            const regionCountries = countries.filter(country => country.region === regionName);

            regionCountries.forEach(country => {
                const countryDiv = document.createElement('div');
                countryDiv.classList.add('country');
                countryDiv.dataset.countryId = country.id;

                countryDiv.innerHTML = `
                    ${country.flag}
                    <h5>${country.name}</h5>
                `;
                container.appendChild(countryDiv);
            });
        }
    }

    // open overlay
    document.addEventListener('click', (event) => {
        const clickedCountry = event.target.closest('.country');
        if (!clickedCountry) return;

        const countryId = parseInt(clickedCountry.dataset.countryId);
        const countryData = countries.find((c) => c.id === countryId);
        if (!countryData || !overlay_content) return;

        // Build slides from JSON photos
        const photos = Array.isArray(countryData.photo) ? countryData.photo : [];
        const mainSlides = photos
        .map(
            (p) => `
            <div class="keen-slider__slide">
                <img src="${basePath}countries/${p}" alt="Фото ${countryData.name}">
            </div>`
        )
        .join('');
        const thumbSlides = photos
        .map(
            (p) => `
            <div class="keen-slider__slide">
                <img src="${basePath}countries/${p}" alt="Thumb ${countryData.name}">
            </div>`
        )
        .join('');

        overlay_content.innerHTML = `
            <div class="info_left">
                <h2>${countryData.name}</h2>
                <div class="keen_gallery">
                    <div class="keen-slider main-slider">
                        ${mainSlides}
                    </div>
                    <div class="keen-slider thumb-slider">
                        ${thumbSlides}
                    </div>
                </div>
            </div>
            <div class="info_right">
                <div>
                    <h5>Чи потрібна віза?</h5>
                    <h6>${countryData.visa}</h6>
                </div>
                <p>${countryData.description}</p>
            </div>
        `;

        // Show overlay & lock scroll
        overlayWindow?.classList.add('active');
        document.body.classList.add('body_no_scroll');

        // Init keen after DOM injection
        initializeCountryKeen('.main-slider', '.thumb-slider');
    });

    // CLOSE overlay helpers (background / close icon / ESC)
    function closeOverlay() {
        if (overlayWindow) {
        overlayWindow.classList.remove('active');
        document.body.classList.remove('body_no_scroll');
        destroyCountryKeen(); // destroy instances when closing
        }
    }

    document.addEventListener('click', (event) => {
        if (event.target.closest('.fa-xmark') || event.target.classList.contains('background')) {
        closeOverlay();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlayWindow?.classList.contains('active')) {
        closeOverlay();
        }
    });
    });



//
document.querySelectorAll('.countries_all div h1').forEach(h1 => {
    h1.addEventListener('click', () => {
        const region = h1.parentElement;
        region.classList.toggle('open');

        const list = region.querySelector('.country');
        if (!list) return;
    });
});
