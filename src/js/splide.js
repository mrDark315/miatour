import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

const reviewSlider = new Splide('.splide', {
    type: 'slide',
    rewind: true,
    rewindByDrag: true,
    width: '100%',
    height: '400px',
    perPage: '2'
})
reviewSlider.mount()


export async function initializeReviewsSplide() {
    const reviewsListElement = document.getElementById('reviews-list');

    try {
        const response = await fetch('/reviews.json');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        const reviews = await response.json();

        // Генерируем HTML для каждого отзыва
        let reviewsHtml = '';
        reviews.forEach(review => {
            // Генерируем звездочки рейтинга (&#9733; - заполненная звезда, &#9734; - пустая)
            const stars = '&#9733;'.repeat(review.rating) + '&#9734;'.repeat(5 - review.rating);

            reviewsHtml += `
                <li class="splide__slide">
                    <div class="review-card">
                        ${review.image ? `<img src="${review.image}" alt="Фото ${review.clientName}" class="review-client-image">` : ''}
                        <h3>${review.clientName}</h3>
                        <p>"${review.reviewText}"</p>
                        <div class="review-rating">${stars}</div>
                    </div>
                </li>
            `;
        });

        // Вставляем сгенерированный HTML в список
        reviewsListElement.innerHTML = reviewsHtml;

        // Инициализируем Splide только после того, как слайды добавлены в DOM
        const reviewSplideElement = document.querySelector('.splide[aria-label="Карусель с отзывами клиентов"]');
        if (reviewSplideElement) {
            new Splide(reviewSplideElement, {
                type: 'loop', // Бесконечная прокрутка
                perPage: 3, // Сколько слайдов видно одновременно (для десктопа)
                gap: '1.5rem', // Промежуток между слайдами
                autoplay: true, // Автоматическое воспроизведение
                interval: 4000, // Интервал между слайдами в мс
                pauseOnHover: true, // Пауза при наведении мыши
                arrows: true, // Показать стрелки навигации
                pagination: true, // Показать точки пагинации
                drag: 'free', // Свободный драг
                snap: true, // Привязка к слайдам
                breakpoints: {
                    1024: { // Для экранов до 1024px шириной
                        perPage: 2,
                        gap: '1rem',
                    },
                    768: { // Для экранов до 768px шириной
                        perPage: 1,
                        gap: '.7rem',
                    },
                    480: { // Для экранов до 480px шириной
                        perPage: 1,
                        gap: '.5rem',
                        arrows: false, // Скрыть стрелки на мобильных
                    },
                },
            }).mount();
        }

    } catch (error) {
        console.error('Ошибка загрузки или обработки отзывов:', error);
    }
}