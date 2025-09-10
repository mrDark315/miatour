document.addEventListener('DOMContentLoaded', () => {
const input = document.querySelector('.search input[type="search"]');
if (!input) return;

const REGION_SELECTORS = [
    '.europe',
    '.asia',
    '.africa',
    '.north_america',
    '.central_america',
    '.south_america',
    '.australia_oceania',
    '.caribbean',
];

const regionEls = REGION_SELECTORS
.map(sel => document.querySelector(sel))
.filter(Boolean);

let countryEls = Array.from(document.querySelectorAll('.country'));

const normalize = (s) => (s ?? '')
.toString()
.trim()
.toLocaleLowerCase('uk-UA');

const getName = (el) => el.querySelector('h5')?.textContent ?? '';

function applyFilter(rawQuery) {
const q = normalize(rawQuery);
const empty = q.length === 0;

// filter countries
countryEls.forEach(el => {
    const name = normalize(getName(el));
    const match = empty || name.startsWith(q);
    el.style.display = match ? '' : 'none';

    if (match) {
        el.removeAttribute('data-hidden');
    } else {
        el.setAttribute('data-hidden', '1');
    }
});

// show/hide regions
regionEls.forEach(region => {
    const hasVisible = region.querySelector('.country:not([data-hidden="1"])');

    if (empty) {
        region.style.display = '';
    } else {
        region.style.display = hasVisible ? '' : 'none';
        if (hasVisible) region.classList.add('open');
    }
});
}

input.addEventListener('input', (e) => applyFilter(e.target.value));

const host = document.querySelector('.countries_all') || document.body;
const mo = new MutationObserver(() => {
    countryEls = Array.from(document.querySelectorAll('.country'));
    applyFilter(input.value);
});
mo.observe(host, { childList: true, subtree: true });

applyFilter('');
});
