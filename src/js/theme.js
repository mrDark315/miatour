// src/js/theme.js

// --- БЛОК 1: Мгновенное применение темы ---
// Этот код выполняется немедленно при загрузке скрипта, еще до отрисовки страницы.
(function() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Применяем класс к <html>, чтобы избежать "мерцания"
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
})();


// --- БЛОК 2: Логика для интерактивных кнопок ---
// Эта функция будет "оживлять" кнопки переключения, если они есть на странице.
function initializeThemeSwitcher() {
    const themeSwitchers = document.querySelectorAll('.theme_switcher, .theme_switcher_mobile');

    // Если на странице нет кнопок, функция просто ничего не делает.
    if (themeSwitchers.length === 0) return;

    const lightIcons = document.querySelectorAll('.light-icon');
    const darkIcons = document.querySelectorAll('.dark-icon');

    // Функция, которая меняет тему и обновляет иконки
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            lightIcons.forEach(icon => icon.classList.add('active'));
            darkIcons.forEach(icon => icon.classList.remove('active'));
        } else {
            document.documentElement.classList.remove('dark-theme');
            darkIcons.forEach(icon => icon.classList.add('active'));
            lightIcons.forEach(icon => icon.classList.remove('active'));
        }
        localStorage.setItem('theme', theme);
    };

    // Добавляем обработчик клика на каждую найденную кнопку
    themeSwitchers.forEach(switcher => {
        switcher.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    });

    // Устанавливаем правильные иконки при загрузке страницы, где есть кнопка
    const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    applyTheme(currentTheme);
}

// Запускаем интерактивную часть после загрузки всего контента
document.addEventListener('DOMContentLoaded', initializeThemeSwitcher);