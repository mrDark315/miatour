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

document.addEventListener('DOMContentLoaded', () => {
    const logoLink = document.getElementById('logo_link');

    if (logoLink) {
        logoLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// HEADER BURGER MENU
const menu = document.querySelector('.hamburger')
const navMenu = document.querySelector('.nav_menu')
const navLinks = document.querySelectorAll('.nav_menu .anchor-link')
const body = document.body

menu.addEventListener("click", () => {
    menu.classList.toggle("active")
    navMenu.classList.toggle("active")
    body.classList.toggle("body_no_scroll");
})

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (navMenu.classList.contains("active")) {
            menu.classList.remove("active");
            navMenu.classList.remove("active");
            body.classList.remove("body_no_scroll");
        }
    });
});

document.addEventListener("click", (event) => {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnHamburger = menu.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains("active")) {
        menu.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("body_no_scroll");
    }
});