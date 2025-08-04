import '../scss/style.scss'
import '../scss/splide-js.scss'
import './air-datepicker.js'
import { initializeReviewsSplide } from './splide_review.js';
import AOS from 'aos';
import 'aos/dist/aos.css'

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

// HEADER BURGER MENU
const menu = document.querySelector('.hamburger')
const navMenu = document.querySelector('.nav_menu')
const navLinks = document.querySelectorAll('.nav_menu .anchor-link');

menu.addEventListener("click", () => {
    menu.classList.toggle("active")
    navMenu.classList.toggle("active")
})

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (navMenu.classList.contains("active")) {
            menu.classList.remove("active");
            navMenu.classList.remove("active");

        }
    });
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

// CHECK EMPTY INPUT IN REQUEST TRAVEL
document.addEventListener('DOMContentLoaded', () => {
const sendRequestButton = document.getElementById('send_request');
const checkInputs = document.querySelectorAll('.check_input');
const warningMessage = document.querySelector('.input_warning');

    if (sendRequestButton && checkInputs.length > 0 && warningMessage) {
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
            }
        });
    }
});

// INITIALIZE REVIEW SLIDER FROM splide.js
document.addEventListener('DOMContentLoaded', () => {
    initializeReviewsSplide();
});

//INITIALIZE AOS LIBRARY
AOS.init({
    duration: 1200,
    anchorPlacement: 'center-bottom',
    disable: 'mobile',
    once: true
});