import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import '../scss/air-datepicker.scss';
import localeUk from 'air-datepicker/locale/uk';

const startInput = document.getElementById('start_date');
let datepickerStart;

if (startInput) {
    const wrapper = startInput.closest('.input_wrapper');

    function initializeDatepicker() {
        const screenWidth = window.innerWidth;
        const position = screenWidth <= 575.98 ? 'bottom left' : 'bottom right';

        if (datepickerStart) {
            datepickerStart.destroy();
        }

        datepickerStart = new AirDatepicker(startInput, {
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

        if (startInput.value.trim() !== '') {
            wrapper.classList.add('has-value');
        }
    }

    initializeDatepicker();
    window.addEventListener('resize', initializeDatepicker);
}

const finishInput = document.getElementById('finish_date');
let datepickerFinish;

if (finishInput) {
    const wrapper = finishInput.closest('.input_wrapper');

    function initializeDatepicker() {
        if (datepickerFinish) {
            datepickerFinish.destroy();
        }

        datepickerFinish = new AirDatepicker(finishInput, {
            locale: localeUk,
            position: 'bottom right',
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

        if (finishInput.value.trim() !== '') {
            wrapper.classList.add('has-value');
        }
    }

    initializeDatepicker();
    window.addEventListener('resize', initializeDatepicker);
}