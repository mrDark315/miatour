import '../scss/countries.scss'
import '../scss/splide-js.scss'
import { initializeReviewsSplide } from './splide_review.js'
import "flag-icons/css/flag-icons.min.css";

// INITIALIZE REVIEW SLIDER FROM splide.js
// document.addEventListener('DOMContentLoaded', () => {initializeReviewsSplide();});

// OUTPUT COUNTRY FROM JSON
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

document.addEventListener('DOMContentLoaded', async () => {
    const countries = await loadCountries();

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

                countryDiv.innerHTML = `
                    ${country.flag}
                    <h5>${country.name}</h5>
                `;

                container.appendChild(countryDiv);
            });
        }
    }
});