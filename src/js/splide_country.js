import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

export function initializeCountrySplide(selector) {
    if (document.querySelector(selector)) {
        new Splide(selector, {
            type: 'loop',
            perPage: 1,
            gap: '30px',
            autoplay: true,
            pauseOnHover: true,
            pagination: true,
            arrows: true,
        }).mount();
    }
}