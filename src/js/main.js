import './input.js';
import './header.js';
import '../scss/style.scss';
import '../scss/overlay.scss';
import './air-datepicker.js';
import { initializeReviewsSlider } from './slider-review.js';

import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';

import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';

// INITIALIZATION AOS
AOS.init({
    duration: 1200,
    anchorPlacement: 'center-bottom',
});

// INITIALIZATION REVIEW SLIDER
document.addEventListener('DOMContentLoaded', () => {
    initializeReviewsSlider();
});

// SWEET ALERT 2 (footer email)
document.addEventListener('DOMContentLoaded', () => {
    const myButton = document.getElementById('myButton');
    if (myButton) {
        myButton.addEventListener('click', () => {
        Swal.fire({
            title: 'mia@miatour.com.ua',
            text: 'Якщо виникнуть питання/пропозиції щодо сайту - website@miatour.com.ua',
            icon: 'info',
            confirmButtonText: 'Добре',
            theme: 'light',
        });
        });
    }
});

// LOAD POPULAR COUNTRIES
async function loadCountries() {
    const basePath = import.meta.env.BASE_URL || '/';
    const countriesDataPath = `${basePath}data/countries_list.json`;

    try {
        const response = await fetch(countriesDataPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load countries:', error);
        return [];
    }
}
    // show popular countries
function displayPopularCountries(countries, basePath) {
    const popularCountriesContainer = document.querySelector('.popular_countries');
    if (!popularCountriesContainer) return;

    const popularCountries = countries.filter((country) => country.popular === 'top');
    popularCountries.forEach((country) => {
        const countryDiv = document.createElement('div');
        countryDiv.classList.add('country');
        countryDiv.dataset.countryId = country.id;

        const firstPhoto = country.photo && country.photo[0];
        const photoSrc = firstPhoto ? `${basePath}countries/${firstPhoto}` : '';

        countryDiv.innerHTML = `
        <div class="img_container">
            <img src="${photoSrc}" alt="${country.name}">
        </div>
        <p>${country.name}</p>
        `;
        popularCountriesContainer.appendChild(countryDiv);
    });
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

    if (countries.length > 0) {
        displayPopularCountries(countries, basePath);
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

        // Inject overlay content: info_left (keen gallery) + info_right (description)
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
            <p>${countryData.description || ''}</p>
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


// FONT AUTO RESIZE
function autoResizeTextForButtonsAndLinks() {
    const elements = document.querySelectorAll('button, .next_page');
    elements.forEach((el) => {
        const width = el.offsetWidth;
        const minFont = 14;
        const maxFont = 20;
        const scaleFactor = 0.08;
        let fontSize = width * scaleFactor;
        fontSize = Math.max(minFont, Math.min(maxFont, fontSize));
        el.style.fontSize = `${fontSize}px`;
    });
}
document.addEventListener('DOMContentLoaded', autoResizeTextForButtonsAndLinks);
window.addEventListener('resize', autoResizeTextForButtonsAndLinks);