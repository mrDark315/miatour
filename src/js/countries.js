import '../scss/countries.scss'
import "flag-icons/css/flag-icons.min.css";
import { initializeCountrySplide } from './splide_country.js';

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

// Запускаємо код після повного завантаження сторінки
document.addEventListener('DOMContentLoaded', async () => {
    const countries = await loadCountries();

    const overlayWindow = document.querySelector('.overlay_window');
    const overlay_content = document.querySelector('.overlay_content');
    const basePath = import.meta.env.BASE_URL || '/';

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
        if (clickedCountry) {
            const countryId = parseInt(clickedCountry.dataset.countryId);
            const countryData = countries.find(c => c.id === countryId);

            if (countryData && overlay_content) {
                const photosHTML = countryData.photo.map(photoName => {
                    return `
                        <li class="splide__slide">
                            <img src="${basePath}countries/${photoName}" alt="Фото ${countryData.name}">
                        </li>
                    `;
                }).join('');

                overlay_content.innerHTML = `
                    <div class="splide country-splide">
                        <div class="splide__track">
                            <ul class="splide__list">
                                ${photosHTML}
                            </ul>
                        </div>
                    </div>
                    <div class="info">
                        <h2>${countryData.name}</h2>
                        <div>
                            <h5>Чи потрібна віза?</h5>
                            <h6>${countryData.visa}</h6>
                        </div>
                        <p>${countryData.description}</p>
                    </div>
                `;

                overlayWindow.classList.add('active');
                document.body.classList.add('body_no_scroll');

                setTimeout(() => {
                    initializeCountrySplide('.country-splide');
                }, 20);
            }
        }
    });

    // close overlay
    document.addEventListener('click', (event) => {
        if (event.target.closest('.fa-xmark') || event.target.classList.contains('background')) {
            overlayWindow.classList.remove('active');
            document.body.classList.remove('body_no_scroll');
            initializeCountrySplide('.country-splide');
        }
    });

    // close overlay with ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlayWindow.classList.contains('active')) {
            overlayWindow.classList.remove('active');
            document.body.classList.remove('body_no_scroll');
        }
    });
});