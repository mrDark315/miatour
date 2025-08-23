// // HEADER BURGER MENU
// const menu = document.querySelector('.hamburger');
// const navMenu = document.querySelector('.nav_menu');
// const navLinks = document.querySelectorAll('.nav_menu .anchor-link');
// const body = document.body;
// const htmlEl = document.documentElement;

// const OPEN_CLASS = 'is-menu-open';
// const NO_SCROLL_CLASS = 'body_no_scroll';

// function getScrollbarWidth() {
//     return window.innerWidth - htmlEl.clientWidth;
// }

// /* Lock page scroll without shifting layout */
// function lockScroll() {
//     const sbw = getScrollbarWidth();
//     body.classList.add(NO_SCROLL_CLASS);
//     if (sbw > 0) body.style.paddingRight = sbw + 'px';
//     htmlEl.style.overflowX = 'hidden';
// }

// function unlockScroll() {
//     body.classList.remove(NO_SCROLL_CLASS);
//     body.style.paddingRight = '';
//     htmlEl.style.overflowX = 'clip';
// }

// function openMenu() {
//     menu.classList.add('active');
//     navMenu.classList.add('active');
//     htmlEl.classList.add(OPEN_CLASS);
//     lockScroll();
// }

// function closeMenu() {
//     menu.classList.remove('active');
//     navMenu.classList.remove('active');
//     htmlEl.classList.remove(OPEN_CLASS);
//     unlockScroll();
// }

// function toggleMenu() {
//     if (htmlEl.classList.contains(OPEN_CLASS)) closeMenu();
//     else openMenu();
// }

// if (menu) {
//     menu.addEventListener('click', (e) => {
//         e.stopPropagation();
//         toggleMenu();
//     });
// }

// navLinks.forEach((link) => {
//     link.addEventListener('click', () => {
//         if (htmlEl.classList.contains(OPEN_CLASS)) closeMenu();
//     });
// });

// document.addEventListener('click', (event) => {
//     const clickInsideMenu = navMenu && navMenu.contains(event.target);
//     const clickOnHamburger = menu && menu.contains(event.target);
//     if (!clickInsideMenu && !clickOnHamburger && htmlEl.classList.contains(OPEN_CLASS)) {
//         closeMenu();
//     }
// });

// window.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && htmlEl.classList.contains(OPEN_CLASS)) {
//         closeMenu();
//     }
// });

// window.addEventListener('resize', () => {
//     if (htmlEl.classList.contains(OPEN_CLASS)) {
//         body.style.paddingRight = '';
//         const sbw = getScrollbarWidth();
//         if (sbw > 0) body.style.paddingRight = sbw + 'px';
//     }
// });


// HEADER BURGER MENU — общий для index.html и countries.html

const menu = document.querySelector('.hamburger');
const htmlEl = document.documentElement;
const body = document.body;

const OPEN_CLASS = 'is-menu-open';
const NO_SCROLL_CLASS = 'body_no_scroll';

// ✅ меню-обёртка: сперва пробуем .nav_menu (index.html), иначе <nav> в .header_countries (countries.html)
const navMenu =
  document.querySelector('.nav_menu') ||
  document.querySelector('.header_countries nav');

// ссылки внутри меню (на index это .anchor-link, на countries — обычные <a>)
const navLinks = navMenu ? navMenu.querySelectorAll('a, .anchor-link') : [];

function getScrollbarWidth() {
  return window.innerWidth - htmlEl.clientWidth;
}

/* Lock page scroll without shifting layout */
function lockScroll() {
  const sbw = getScrollbarWidth();
  body.classList.add(NO_SCROLL_CLASS);
  if (sbw > 0) body.style.paddingRight = sbw + 'px';
  htmlEl.style.overflowX = 'hidden';
}

function unlockScroll() {
  body.classList.remove(NO_SCROLL_CLASS);
  body.style.paddingRight = '';
  htmlEl.style.overflowX = 'clip';
}

function openMenu() {
  if (menu) menu.classList.add('active');
  if (navMenu) navMenu.classList.add('active');
  htmlEl.classList.add(OPEN_CLASS);
  lockScroll();
}

function closeMenu() {
  if (menu) menu.classList.remove('active');
  if (navMenu) navMenu.classList.remove('active');
  htmlEl.classList.remove(OPEN_CLASS);
  unlockScroll();
}

function toggleMenu() {
  if (htmlEl.classList.contains(OPEN_CLASS)) closeMenu();
  else openMenu();
}

if (menu) {
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (htmlEl.classList.contains(OPEN_CLASS)) closeMenu();
  });
});

document.addEventListener('click', (event) => {
  const clickInsideMenu = navMenu && navMenu.contains(event.target);
  const clickOnHamburger = menu && menu.contains(event.target);
  if (!clickInsideMenu && !clickOnHamburger && htmlEl.classList.contains(OPEN_CLASS)) {
    closeMenu();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && htmlEl.classList.contains(OPEN_CLASS)) {
    closeMenu();
  }
});

window.addEventListener('resize', () => {
  if (htmlEl.classList.contains(OPEN_CLASS)) {
    body.style.paddingRight = '';
    const sbw = getScrollbarWidth();
    if (sbw > 0) body.style.paddingRight = sbw + 'px';
  }
});
