// HEADER BURGER MENU (with scrollbar compensation)
const menu = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav_menu');
const navLinks = document.querySelectorAll('.nav_menu .anchor-link');
const body = document.body;
const htmlEl = document.documentElement;

const OPEN_CLASS = 'is-menu-open';      // service class on <html>
const NO_SCROLL_CLASS = 'body_no_scroll'; // your existing class on <body>

/* Get OS scrollbar width so we can compensate layout shift */
function getScrollbarWidth() {
  return window.innerWidth - htmlEl.clientWidth;
}

/* Lock page scroll without shifting layout */
function lockScroll() {
  const sbw = getScrollbarWidth();
  body.classList.add(NO_SCROLL_CLASS);         // your CSS likely sets overflow:hidden here
  if (sbw > 0) body.style.paddingRight = sbw + 'px'; // compensate lost scrollbar
  htmlEl.style.overflowX = 'hidden';           // avoid horizontal scroll while menu is open
}

/* Restore scroll and cleanup inline styles */
// В header.js — замените только эту функцию
function unlockScroll() {
  body.classList.remove(NO_SCROLL_CLASS);
  body.style.paddingRight = '';
  // Оставляем горизонтальный скролл клипнутым после закрытия
  // (безопасно для лендинга; если нужно — можно потом вернуть '')
  htmlEl.style.overflowX = 'clip';
}


/* Open/close helpers keep state centralized */
function openMenu() {
  menu.classList.add('active');
  navMenu.classList.add('active');
  htmlEl.classList.add(OPEN_CLASS);
  lockScroll();
}

function closeMenu() {
  menu.classList.remove('active');
  navMenu.classList.remove('active');
  htmlEl.classList.remove(OPEN_CLASS);
  unlockScroll();
}

function toggleMenu() {
  if (htmlEl.classList.contains(OPEN_CLASS)) closeMenu();
  else openMenu();
}

/* Click on hamburger toggles menu */
if (menu) {
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });
}

/* Click on anchor inside menu closes it */
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (htmlEl.classList.contains(OPEN_CLASS)) closeMenu();
  });
});

/* Click outside menu closes it */
document.addEventListener('click', (event) => {
  const clickInsideMenu = navMenu && navMenu.contains(event.target);
  const clickOnHamburger = menu && menu.contains(event.target);
  if (!clickInsideMenu && !clickOnHamburger && htmlEl.classList.contains(OPEN_CLASS)) {
    closeMenu();
  }
});

/* ESC closes menu */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && htmlEl.classList.contains(OPEN_CLASS)) {
    closeMenu();
  }
});

/* Recompute compensation on resize while open */
window.addEventListener('resize', () => {
  if (htmlEl.classList.contains(OPEN_CLASS)) {
    // refresh padding-right according to new scrollbar width
    body.style.paddingRight = '';
    const sbw = getScrollbarWidth();
    if (sbw > 0) body.style.paddingRight = sbw + 'px';
  }
});
