import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import '../scss/air-datepicker.scss';
import localeUk from 'air-datepicker/locale/uk';

const dateInput = document.getElementById('date');
let datepicker;

if (dateInput) {
    const wrapper = dateInput.closest('.input_wrapper');

    function initializeDatepicker() {
        const screenWidth = window.innerWidth;
        const position = screenWidth <= 575.98 ? 'bottom left' : 'bottom center';

        if (datepicker) {
            datepicker.destroy();
        }

        datepicker = new AirDatepicker(dateInput, {
            locale: localeUk,
            position: position,
            minDate: new Date(),
            buttons: ['clear'],
            autoClose: true,

            onSelect({formattedDate}) {
                if (formattedDate) {
                    wrapper.classList.add('has-value');
                } else {
                    wrapper.classList.remove('has-value');
                }
            },

            onShow() {
                wrapper.classList.add('is-focused');
            },
            onHide() {
                wrapper.classList.remove('is-focused');
            }
        });

        if (dateInput.value.trim() !== '') {
            wrapper.classList.add('has-value');
        }
    }

    initializeDatepicker();
    window.addEventListener('resize', initializeDatepicker);
}