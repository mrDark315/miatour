import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import '../scss/air-datepicker.scss';
import localeUk from 'air-datepicker/locale/uk';

new AirDatepicker('#date', {
    locale: localeUk,
    position: 'bottom center',
    minDate: new Date(),
    buttons: ['clear']
})