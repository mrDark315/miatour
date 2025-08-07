import '../scss/style.scss'
import '../scss/splide_review.scss'
import '../scss/overlay.scss';
import './air-datepicker.js'
import { initializeReviewsSplide } from './splide_review.js'
import { initializeCountrySplide } from './splide_country.js';
import AOS from 'aos'
import 'aos/dist/aos.css'
import Swal from 'sweetalert2'

// HEADER ANCHOR LIMKS SCROLL
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('.anchor-link');
    const scrollOffset = 130;

    anchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.offsetTop - scrollOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const logoLink = document.getElementById('logo_link');

    if (logoLink) {
        logoLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


// HEADER BURGER MENU
const menu = document.querySelector('.hamburger')
const navMenu = document.querySelector('.nav_menu')
const navLinks = document.querySelectorAll('.nav_menu .anchor-link')
const body = document.body

menu.addEventListener("click", () => {
    menu.classList.toggle("active")
    navMenu.classList.toggle("active")
    body.classList.toggle("body_no_scroll");
})

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (navMenu.classList.contains("active")) {
            menu.classList.remove("active");
            navMenu.classList.remove("active");
            body.classList.remove("body_no_scroll");
        }
    });
});

document.addEventListener("click", (event) => {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnHamburger = menu.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains("active")) {
        menu.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("body_no_scroll");
    }
});

// TRAVEL REQUEST INPUT ANIMATION
document.addEventListener('DOMContentLoaded', () => {
    const inputWrappers = document.querySelectorAll('.input_wrapper');

    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input');

        if (!input) return;

        const updateState = () => {
            if (input.value.length > 0) {
                wrapper.classList.add('has-value');
            } else {
                wrapper.classList.remove('has-value');
            }
        };

        input.addEventListener('input', updateState)
        input.addEventListener('focus', () => {
            wrapper.classList.add('is-focused');
        });
        input.addEventListener('blur', () => {
            wrapper.classList.remove('is-focused');
            updateState();
        });

        updateState();
    })
})

// REQUEST TRAVEL INPUT FIELDS
document.addEventListener('DOMContentLoaded', () => {
    const sendRequestButton = document.getElementById('send_request');
    const checkInputs = document.querySelectorAll('.check_input');
    const warningMessage = document.querySelector('.input_warning');
    const form = document.querySelector('#travel_request_form');

    // CHECK INPUT VALUE
    if (sendRequestButton && checkInputs.length > 0 && warningMessage && form) {
        sendRequestButton.addEventListener('click', function(event) {
            event.preventDefault();

            let allFieldsFilled = true;
            checkInputs.forEach(input => {
                if (input.value.trim() === '') {
                    allFieldsFilled = false;
                    input.classList.add('warning_border');
                } else {
                    input.classList.remove('warning_border');
                }
            });

            if (!allFieldsFilled) {
                warningMessage.classList.add('visible');
            } else {
                warningMessage.classList.remove('visible');
                sendFormData();
            }
        });
    }

    // SEND DATA FROM INPUT
    async function sendFormData() {
    const formData = new FormData(form);
    const url = '/api/travel_request.php';

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Помилка мережі: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                title: 'Повідомлення надіслано',
                text: 'Ми зв\'яжемось з вами найближчим часом',
                icon: 'success',
                confirmButtonText: 'Закрити',
                theme: 'dark',
            });
            form.reset();
        }
    } catch (error) {
        console.error('Помилка при відправці:', error);
        Swal.fire({
            title: 'Виникла помилка під час відправлення запиту',
            text: 'Якщо помилка не зникне - зв\'яжіться з нами',
            icon: 'error',
            confirmButtonText: 'Закрити',
            theme: 'dark',
        });
    }
}
});

// INITIALIZE REVIEW SLIDER FROM splide.js
document.addEventListener('DOMContentLoaded', () => {initializeReviewsSplide();});

// INITIALIZE AOS LIBRARY
AOS.init({
    duration: 1200,
    anchorPlacement: 'center-bottom',
    // disable: 'mobile'
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
            theme: 'dark'
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