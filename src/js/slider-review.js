import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';

const basePath = import.meta.env.BASE_URL || '/';
const reviewData = `${basePath}data/review.json`;
const clientImage = `${basePath}clients/`;
const starsDir   = `${basePath}img/hotel_stars/`;

// CREATE ARROWS & DOTS
function navigationPlugin(slider) {
    let wrapper, dots, arrowLeft, arrowRight;

    function createDiv(className) {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    function createMarkup() {

        wrapper = createDiv('navigation-wrapper');
        slider.container.parentNode.appendChild(wrapper);
        wrapper.appendChild(slider.container);

        // create arrows
        arrowLeft = createDiv('arrow arrow--left');
        arrowLeft.innerHTML = '<i class="fa-solid fa-chevron-left fa-2xl"></i>';
        arrowLeft.addEventListener('click', () => slider.prev());

        arrowRight = createDiv('arrow arrow--right');
        arrowRight.innerHTML = '<i class="fa-solid fa-chevron-right fa-2xl"></i>';
        arrowRight.addEventListener('click', () => slider.next());

        wrapper.appendChild(arrowLeft);
        wrapper.appendChild(arrowRight);

        // create dots
        dots = createDiv('dots');
        slider.track.details.slides.forEach((_e, idx) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.addEventListener('click', () => slider.moveToIdx(idx));
        dots.appendChild(dot);
        });
        wrapper.appendChild(dots);
    }

    function updateActiveDot() {
        const rel = slider.track.details.rel;
        Array.from(dots.children).forEach((dot, idx) => {
        dot.classList.toggle('dot--active', idx === rel);
        });
    }

    slider.on('created', () => {
        createMarkup();
        updateActiveDot();
    });

    slider.on('slideChanged', updateActiveDot);
}

// ADAPTIVE HEAIGHT FOR ARROWS & DOTS
function adaptiveHeightPlugin(slider) {
    let ro;

    const getVisibleIndexes = () => {
        const details = slider.track?.details;
        if (!details || !details.slides) return [];
        return details.slides
        .map((s, i) => ({ i, portion: s.portion }))
        .filter((o) => o.portion > 0.001)
        .map((o) => o.i);
    };

    const measureAndSet = () => {
        const c = slider.container;
        const idxs = getVisibleIndexes();
        const indexes = idxs.length ? idxs : [slider.track.details.rel];

        let maxH = 0;
        indexes.forEach((i) => {
        const slide = slider.slides[i];
        if (!slide) return;
        const box = slide.querySelector('.review_item') || slide;
        const h = box.getBoundingClientRect().height;
        if (h > maxH) maxH = h;
        });

        if (maxH > 0) {
        c.style.height = Math.ceil(maxH) + 'px';
        } else {
        c.style.removeProperty('height');
        }
    };

    const observeImages = () => {
        const imgs = slider.container.querySelectorAll('img');
        imgs.forEach((img) => {
        if (!img.complete) {
            img.addEventListener('load', measureAndSet, { once: true });
            img.addEventListener('error', measureAndSet, { once: true });
        }
        });
    };

    const observeVisibleBoxes = () => {
        if (ro) ro.disconnect();
        ro = new ResizeObserver(measureAndSet);
        const idxs = getVisibleIndexes();
        idxs.forEach((i) => {
        const slide = slider.slides[i];
        const box = slide && (slide.querySelector('.review_item') || slide);
        if (box) ro.observe(box);
        });
    };

    slider.on('created', () => {
        requestAnimationFrame(() => {
            observeImages();
            observeVisibleBoxes();
            // ДАДИМ AutoHeightOnce выставить стартовую высоту, затем — первый честный замер
            setTimeout(() => {
            const h = parseFloat(getComputedStyle(slider.container).height) || 0;
            if (!h) measureAndSet(); // если подпорки нет — подстрахуемся
            else measureAndSet();    // мягко синхронизируемся со стартовой высотой
            }, 80);
        });
        window.addEventListener('resize', measureAndSet);
    });

    slider.on('slideChanged', () => {
        observeVisibleBoxes();
        measureAndSet();
    });

    slider.on('updated', () => {
        observeImages();
        observeVisibleBoxes();
        measureAndSet();
    });

    slider.on('animationEnded', measureAndSet);

    slider.on('destroyed', () => {
        window.removeEventListener('resize', measureAndSet);
        if (ro) {
        ro.disconnect();
        ro = null;
        }
    });
}

function waitImages(el) {
    const imgs = Array.from(el.querySelectorAll('img'));
    return Promise.all(
        imgs.map(img =>
        img.complete && img.naturalHeight
            ? Promise.resolve()
            : new Promise(res => img.addEventListener('load', res, { once: true }))
        )
    );
}

// Плагин: подгоняем высоту контейнера под активный слайд
// ставим максимальную из текущих высот один раз после created
function AutoHeightOnce(slider) {
    slider.on('created', () => {
        const bootstrap = () => {
        let maxH = 0;
        for (const s of slider.slides) {
            const box = s.querySelector('.review_item') || s;
            if (!box) continue;
            const h = box.scrollHeight;
            if (h > maxH) maxH = h;
        }
        if (maxH > 0) {
            slider.container.style.height = Math.ceil(maxH) + 'px';
            // форсируем перерисовку:
            void slider.container.offsetHeight;
            slider.update();
        }
        };
        // даём DOM/шрифтам примениться
        requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            bootstrap();
            setTimeout(bootstrap, 60);
        });
        });
    });
}


function whenVisible(el, cb) {
    if (!('IntersectionObserver' in window)) return cb();
    const io = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
        io.disconnect();
        cb();
        }
    }, { root: null, threshold: 0.15 });
    io.observe(el);
}


// KEEN SLIDER INITIALIZATION
export async function initializeReviewsSlider() {
    const track = document.getElementById('reviewsSlider');
    if (!track) return;

    await renderSlides(track);
    await waitImages(track);

    if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch {}
    }

    whenVisible(track, () => {
        const slider = new KeenSlider(
        track,
        {
        loop: true,
        renderMode: 'performance',
        slides: {
            perView: 2,
            spacing: 30,
        },
        breakpoints: {
            '(max-width: 991.98px)': {
                slides: {
                    perView: 1,
                    spacing: 15,
                },
            },
        },
        },
        [navigationPlugin, AutoHeightOnce, adaptiveHeightPlugin]
    );
    requestAnimationFrame(() => slider.update());
    window.addEventListener('load', () => slider.update(), { once: true });
    window.addEventListener('resize', () => slider.update());
    })
}

// CREATE SLIDES
async function renderSlides(container) {
    try {
        const res = await fetch(reviewData);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const reviews = await res.json();

        container.innerHTML = reviews
        .map((r) => {
            const img = r.clientImage
            ? `<img src="${clientImage}${r.clientImage}" alt="${(r.clientName || '') + ' фото'}">`
            : '';
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
                                <img src="${starsDir}stars_${r.rating}.svg" alt="${r.rating} зірок">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        })
        .join('');
    } catch (error) {
        console.error('Error rendering slides:', error);
    }
}