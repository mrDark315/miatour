import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const basePath = import.meta.env.BASE_URL || '/';

// !!! ИСПРАВЛЕНО: используем basePath для создания правильных путей !!!
const reviewData = `${basePath}data/review.json`;
const starsRating = `${basePath}review_stars/`;
const clientImage = `${basePath}clients/`;

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
        });
        splideInstance.mount();
    }
}