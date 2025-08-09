import Swal from 'sweetalert2'

// TRAVEL REQUEST INPUT ANIMATION
document.addEventListener('DOMContentLoaded', () => {
    const inputWrappers = document.querySelectorAll('.input_wrapper');

    inputWrappers.forEach(wrapper => {
        const field = wrapper.querySelector('input, textarea');

        if (!field) return;

        const updateState = () => {
            if (field.value.trim().length > 0) {
                wrapper.classList.add('has-value');
            } else {
                wrapper.classList.remove('has-value');
            }
        };

        field.addEventListener('input', updateState);
        field.addEventListener('focus', () => {
            wrapper.classList.add('is-focused');
        });
        field.addEventListener('blur', () => {
            wrapper.classList.remove('is-focused');
            updateState();
        });

        updateState();
    });
});

// SEND INPUTS VALUE TO EMAIL
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

//AUTORESIZE LABEL FONT SIZE
function autoResizeLabels() {
    const wrappers = document.querySelectorAll('.input_wrapper');

    wrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input, textarea');
        const label = wrapper.querySelector('label');

        if (!input || !label) return;

        const width = input.offsetWidth;
        const minFont = 10;
        const maxFont = 18;
        const scaleFactor = 0.08;

        let fontSize = width * scaleFactor / 1;
        fontSize = Math.max(minFont, Math.min(maxFont, fontSize));

        label.style.fontSize = `${fontSize}px`;
    });
}

document.addEventListener('DOMContentLoaded', autoResizeLabels);
window.addEventListener('resize', autoResizeLabels);
