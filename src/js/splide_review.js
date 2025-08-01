import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const reviewData = '/data/review.json';
const starsRating = '/review_stars/';
const clientImage = '/clients/';

function generateStarsHtml(rating) {
    const starSvgPath = `${starsRating}stars_${rating}.svg`;
    return `<img src="${starSvgPath}" alt="Рейтинг: ${rating} звезд" class="review-rating-svg">`;
}

export async function initializeReviewsSplide() {
    const reviewsListElement = document.getElementById('reviews_list');

    const response = await fetch(reviewData);
    const reviews = await response.json();

    let reviewsHtml = '';
    reviews.forEach(review => {
        const starsSvg = generateStarsHtml(review.rating);
        const clientImagePath = review.clientImage ? `${clientImage}${review.clientImage}` : '';

        reviewsHtml += `
            <li class="splide__slide">
                <div class="review_item">
                    <div class="review_header">
                        <p>${review.clientName || 'N/A'}</p>
                        ${clientImagePath ? `<img src="${clientImagePath}" alt="Фото клієнта">` : ''}
                        <p>${review.location || 'Не указано'}</p>
                    </div>
                    <div class="review_info">
                        <p class="hotel_name">${review.hotel || 'Не указан'}</p>
                        <div class="review-rating-container">${starsSvg}</div>
                        <p class="review_text">${review.reviewText || 'Отзыв отсутствует'}</p>
                    </div>
                </div>
            </li>
        `;
    });

    reviewsListElement.innerHTML = reviewsHtml;

    // create splide
    const reviewSplideElement = document.querySelector('.splide[aria-label="Відгуки клієнтів"]');

    if (reviewSplideElement) {
        const splideInstance = new Splide(reviewSplideElement, {
            type: 'slide',
            rewind: true,
            rewindByDrag: true,
            drag: true,
            gap: '10vw',
            speed: 700,
            arrows: true,
            pagination: false,
            paginationKeyboard: false,
            autoHeight: true,
            // breakpoints: {
            //     1024: { perPage: 2, gap: '1rem' },
            //     768: { perPage: 1, gap: '.7rem' },
            //     480: { perPage: 1, gap: '.5rem', arrows: false, pagination: true },
            // },
        });
        splideInstance.mount();
    }
}