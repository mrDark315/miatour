import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import '../scss/air-datepicker.scss';
import localeUk from 'air-datepicker/locale/uk';

let myDatePicker;

function initializeDatePicker() {
    // Определяем позицию на основе ширины экрана
    const screenWidth = window.innerWidth;
    const position = screenWidth <= 575.98 ? 'bottom left' : 'bottom center';

    // Если экземпляр уже существует, обновляем его
    if (myDatePicker) {
        myDatePicker.update({ position: position });
    } else {
        // Если нет, создаем новый
        myDatePicker = new AirDatepicker('#date', {
            locale: localeUk,
            position: position,
            minDate: new Date(),
            buttons: ['clear']
        });
    }
}

// Инициализируем календарь при первой загрузке
initializeDatePicker();

// Добавляем обработчик события для изменения размера экрана
window.addEventListener('resize', initializeDatePicker);