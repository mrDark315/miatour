// APPLYING THEME
(function() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
})();


//
function initializeThemeSwitcher() {
    const themeSwitchers = document.querySelectorAll('.theme_switcher, .theme_switcher_mobile');
    if (themeSwitchers.length === 0) return;

    const lightIcons = document.querySelectorAll('.light-icon');
    const darkIcons = document.querySelectorAll('.dark-icon');

    // change theme & update icons
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
        // save theme mode
        localStorage.setItem('theme', theme);
    };

    // add click handler
    themeSwitchers.forEach(switcher => {
        switcher.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    });

    const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    applyTheme(currentTheme);
}

document.addEventListener('DOMContentLoaded', initializeThemeSwitcher);