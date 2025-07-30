import '../scss/style.scss'
import './air-datepicker.js'

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
    // Получаем кнопку отправки запроса
    const sendRequestButton = document.getElementById('send_request');

    // Получаем все инпуты, которые нужно проверять
    const checkInputs = document.querySelectorAll('.check_input');

    // Получаем div для общего предупреждения
    const warningMessageDiv = document.querySelector('.input_warning');

    // Убедимся, что все элементы найдены перед привязкой слушателя
    if (sendRequestButton && checkInputs.length > 0 && warningMessageDiv) {
        sendRequestButton.addEventListener('click', function(event) {
            event.preventDefault(); // Предотвращаем стандартную отправку формы

            let allFieldsFilled = true; // Флаг, который станет false, если найдено пустое поле

            // Проходимся по каждому инпуту с классом .check_input
            checkInputs.forEach(input => {
                // Если поле пустое (после удаления пробелов)
                if (input.value.trim() === '') {
                    allFieldsFilled = false; // Устанавливаем флаг в false
                    // Дополнительно: можно добавить класс для визуального выделения пустого инпута
                    input.classList.add('error-border');
                } else {
                    // Если поле заполнено, убираем класс ошибки (если он был)
                    input.classList.remove('error-border');
                }
            });

            if (!allFieldsFilled) {
                // Если хоть одно поле пустое, показываем общее предупреждение
                warningMessageDiv.classList.add('visible');
            } else {
                // Если все поля заполнены, скрываем общее предупреждение
                warningMessageDiv.classList.remove('visible');
                // Здесь можно добавить логику для отправки формы, например:
                // event.target.closest('form').submit();
                console.log('Все обязательные поля заполнены. Форма готова к отправке!');
                alert('Форма успешно отправлена (это только демонстрация)');
            }
        });

        // Добавляем слушатели к каждому обязательному полю для скрытия предупреждения
        // как только пользователь начинает вводить текст
        checkInputs.forEach(input => {
            input.addEventListener('input', () => {
                // Если предупреждение видно и пользователь начал вводить текст в любое обязательное поле,
                // скрываем предупреждение и убираем красную рамку с текущего поля.
                // Полное скрытие предупреждения произойдет только если ВСЕ поля заполнятся.
                if (warningMessageDiv.classList.contains('visible') && input.value.trim() !== '') {
                    // Пока не скрываем warningMessageDiv полностью, так как другие поля могут быть пусты
                    // Просто убираем красную рамку с текущего поля
                    input.classList.remove('error-border');
                }
            });

            // Дополнительно: при уходе с поля, если оно пустое, снова подсвечиваем
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.classList.add('error-border');
                }
            });
        });
    } else {
        console.error('Не найдены все элементы для валидации формы: кнопка отправки, инпуты или предупреждение.');
    }
});