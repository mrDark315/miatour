import './input.js'
import './header.js'
import '../scss/style.scss'
import '../scss/overlay.scss';
import './air-datepicker.js'
import { initializeReviewsSlider } from './slider-review.js';
import AOS from 'aos'
import 'aos/dist/aos.css'
import Swal from 'sweetalert2'

// INITIALIZE AOS LIBRARY
AOS.init({
    duration: 1200,
    anchorPlacement: 'center-bottom',
});

// INITIALIZE REVIEW KEEN-SLIDER
document.addEventListener('DOMContentLoaded', () => {
    initializeReviewsSlider();
});

//INITIALIZE SWEET ALERT 2
// if (!localStorage.getItem('isFirstVisit')) {
//     Swal.fire({
//         title: 'Сайт ще в розробці!',
//         text: 'Деякі функції або стронінки можуть не працювати',
//         icon: 'info',
//         confirmButtonText: 'Закрити',
//         theme: 'dark',
//         input: "checkbox",
//         inputValue: 0,
//         inputPlaceholder: `Я згоден/згодна`,
//         preConfirm: (result) => {
//             if (result) {
//                 localStorage.setItem('isFirstVisit', 'true');
//                 return true;
//             } else {
//                 Swal.showValidationMessage('Будь ласка, прийміть тимчасові умови.');
//                 return false;
//             }
//         }
//     });
// }

// SWEET ALERT 2 IN FOOTER (EMAIL CONTACT)
document.addEventListener('DOMContentLoaded', () => {
    const myButton = document.getElementById('myButton');

    myButton.addEventListener('click', () => {
        Swal.fire({
            title: 'mia@miatour.com.ua',
            text: 'Якщо виникнуть питання/пропозиції щодо сайту - website@miatour.com.ua',
            icon: 'info',
            confirmButtonText: 'Добре',
            theme: 'light'
        });
    });
});


// OUTPUT POPULAR COUNTRIES FROM JSON
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
        console.error("Failed to load countries:", error);
        return [];
    }
}

function displayPopularCountries(countries, basePath) {
    const popularCountriesContainer = document.querySelector('.popular_countries');
    if (popularCountriesContainer) {
        const popularCountries = countries.filter(country => country.popular === "top");
        popularCountries.forEach(country => {
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
}

document.addEventListener('DOMContentLoaded', async () => {
    const countries = await loadCountries();
    const basePath = import.meta.env.BASE_URL || '/';

    const overlayWindow = document.querySelector('.overlay_window');
    const overlay_content = document.querySelector('.overlay_content');

    if (countries.length > 0) {
        displayPopularCountries(countries, basePath);
    }

    // Обработчик открытия оверлея
    document.addEventListener('click', (event) => {
        const clickedCountry = event.target.closest('.country');
        if (clickedCountry) {
            const countryId = parseInt(clickedCountry.dataset.countryId);
            const countryData = countries.find(c => c.id === countryId);

            if (countryData && overlay_content) {
                const photosHTML = countryData.photo.map(photoName => {
                    return `<li class="splide__slide"><img src="${basePath}countries/${photoName}" alt="Фото ${countryData.name}"></li>`;
                }).join('');

                overlay_content.innerHTML = `
                    <div class="info_left">
                    <h2>${countryData.name}</h2>
                        <div class="splide country-splide">
                            <div class="splide__track">
                                <ul class="splide__list">
                                    ${photosHTML}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="info_right">
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
    function closeOverlay() {
        if (overlayWindow) {
            overlayWindow.classList.remove('active');
            document.body.classList.remove('body_no_scroll');
        }
    }

    document.addEventListener('click', (event) => {
        if (event.target.closest('.fa-xmark') || event.target.classList.contains('background')) {
            closeOverlay();
        }
    });

    // close overlay with ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlayWindow.classList.contains('active')) {
            closeOverlay();
        }
    });
});
