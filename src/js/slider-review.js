import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';

const basePath = import.meta.env.BASE_URL || '/';
const reviewData = `${basePath}data/review.json`;
const starsRating = `${basePath}review_stars/`;
const clientImage = `${basePath}clients/`;

function starsHtml(rating) {
    return `<img src="${starsRating}stars_${rating}.svg" alt="${rating} зірок" class="review-rating-svg">`;
}

async function renderSlides(container) {
    const res = await fetch(reviewData);
    const reviews = await res.json();

    container.innerHTML = reviews
        .map((r) => {
        const img = r.clientImage ? `<img src="${clientImage}${r.clientImage}" alt="${r.clientName || ''}">` : '';

        return `
            <div class="keen-slider__slide">
            <div class="review_item">
                <div class="review_header">
                <p>${r.clientName || ''}</p>
                ${img}
                <p>${r.location || ''}</p>
                </div>
                <div class="review_info">
                <p class="hotel_name">${r.hotel || ''}</p>
                <div class="review-rating-container">${starsHtml(r.rating)}</div>
                <p class="review_text">${r.reviewText || ''}</p>
                </div>
            </div>
            </div>
        `;
        })
        .join('');
}

export async function initializeReviewsSplide() {
    const section = document.querySelector('.reviews-slider');
    const track = document.getElementById('reviewsSlider');
    if (!section || !track) return;

    await renderSlides(track);

    // keen slider initialization
    const slider = new KeenSlider(track, {
        loop: true,
        renderMode: 'performance',
        drag: true,

    });

    // arrows
    const prevBtn = section.querySelector('.ks-arrow--prev');
    const nextBtn = section.querySelector('.ks-arrow--next');
    if (prevBtn) prevBtn.addEventListener('click', () => slider.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => slider.next());

    // 5) точки (опционально)
    const dotsRoot = document.getElementById('reviewsDots');
    if (dotsRoot) {
        const makeDots = () => {
        dotsRoot.innerHTML = '';
        slider.track.details.slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = 'ks-dot';
            dot.type = 'button';
            dot.addEventListener('click', () => slider.moveToIdx(idx));
            dotsRoot.appendChild(dot);
        });
        };
        const setActive = () => {
        const rel = slider.track.details.rel;
        [...dotsRoot.children].forEach((d, i) => d.classList.toggle('is-active', i === rel));
        };
        slider.on('created', () => { makeDots(); setActive(); });
        slider.on('slideChanged', setActive);
        slider.on('updated', setActive);
    }
}
