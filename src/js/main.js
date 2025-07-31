import '../scss/style.scss'
import './air-datepicker.js'
import { initializeReviewsSplide } from './splide_review.js';

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