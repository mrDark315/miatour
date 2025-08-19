import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';

const basePath = import.meta.env.BASE_URL || '/';
const reviewData = `${basePath}data/review.json`;
const clientImage = `${basePath}clients/`;

// CREATE ARROWS & PAGINATIONS DOTS
function navigationPlugin(slider) {
    let wrapper, dots, arrowLeft, arrowRight;

    function createDiv(className) {
        const div = document.createElement("div");
        div.className = className;
        return div;
    }

    function createMarkup() {
        wrapper = createDiv("navigation-wrapper");
        slider.container.parentNode.appendChild(wrapper);
        wrapper.appendChild(slider.container);

        // create arrows
        arrowLeft = createDiv("arrow arrow--left");
        arrowLeft.innerHTML = '<i class="fa-solid fa-chevron-left fa-2xl"></i>';
        arrowLeft.addEventListener("click", () => slider.prev());

        arrowRight = createDiv("arrow arrow--right");
        arrowRight.innerHTML = '<i class="fa-solid fa-chevron-right fa-2xl"></i>';
        arrowRight.addEventListener("click", () => slider.next());

        wrapper.appendChild(arrowLeft);
        wrapper.appendChild(arrowRight);

        // create dots
        dots = createDiv("dots");
        slider.track.details.slides.forEach((_e, idx) => {
            const dot = document.createElement("button");
            dot.classList.add("dot");
            dot.addEventListener("click", () => slider.moveToIdx(idx));
            dots.appendChild(dot);
        });
        wrapper.appendChild(dots);
    }

    // update active classes
    function updateClasses() {
        const slide = slider.track.details.rel;

        // update active dot
        Array.from(dots.children).forEach((dot, idx) => {
            dot.classList.toggle("dot--active", idx === slide);
        });
    }

    slider.on("created", () => {
        createMarkup();
        updateClasses();
    });
    slider.on("slideChanged", updateClasses);
}


// KEEN SLIDER INITIALIZATION
export async function initializeReviewsSlider() {
    const track = document.getElementById('reviewsSlider');
    if (!track) return;

    await renderSlides(track);

    new KeenSlider(track, {
        loop: true,
        renderMode: 'performance',
        drag: true,
        slides: {
            perView: 2,
            spacing: 30,
            origin: "center",
        },
        breakpoints: {
            '(max-width: 991.98px)': {
                slides: {
                    perView: 1,
                    spacing: 15,
                    origin: "auto"
                }
            }
        }
    }, [navigationPlugin,]);
}

// CREATE SLIDES
async function renderSlides(container) {
    try {
        const res = await fetch(reviewData);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const reviews = await res.json();

        container.innerHTML = reviews.map((r) => {
            const img = r.clientImage ? `<img src="${clientImage}${r.clientImage}" alt="${r.clientName+" фото" || ''}">` : '';
            return `
                <div class="keen-slider__slide">
                    <div class="review_item">

                        <div class="review_header">
                            <div>
                                <p class="location">${r.location || ''}</p>
                                <p class="hotel_name">${r.hotel || ''}</p>
                            </div>
                            <i class="fa-solid fa-quote-right"></i>
                        </div>

                        <p class="review_text">${r.reviewText || ''}</p>

                        <div class="review_footer">
                            ${img}
                            <div>
                                <p>${r.clientName || ''}</p>
                                <div class="review-rating-container">
                                <img src="/src/img/hotel_stars/stars_${r.rating}.svg" alt="${r.rating} зірок">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }).join('');
    } catch (error) {
        console.error('Error rendering slides:', error);
    }
}