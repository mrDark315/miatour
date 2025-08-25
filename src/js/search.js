// src/js/search.js
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.search input[type="search"]');
  if (!input) return;

  // селекторы ровно под твою разметку регионов
  // (используем те же контейнеры, куда countries.js кладёт .country)
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

  // актуальный список карточек стран (будем обновлять, когда DOM поменяется)
  let countryEls = Array.from(document.querySelectorAll('.country'));

  const normalize = (s) => (s ?? '')
    .toString()
    .trim()
    .toLocaleLowerCase('uk-UA'); // корректно для кириллицы

  const getName = (el) => el.querySelector('h5')?.textContent ?? '';

  function applyFilter(rawQuery) {
    const q = normalize(rawQuery);
    const empty = q.length === 0;

    // 1) фильтруем сами страны
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

    // 2) показываем/скрываем регионы целиком
    regionEls.forEach(region => {
      const hasVisible = region.querySelector('.country:not([data-hidden="1"])');
      if (empty) {
        region.style.display = '';
        // можно не трогать класс 'open'; если хочется — раскрывать при поиске:
        // region.classList.remove('open');
      } else {
        region.style.display = hasVisible ? '' : 'none';
        if (hasVisible) region.classList.add('open'); // чтобы список был раскрыт
      }
    });
  }

  // реагируем на ввод
  input.addEventListener('input', (e) => applyFilter(e.target.value));

  // важное: countries.js рендерит .country асинхронно из JSON.
  // ловим появление карточек и обновляем список + применяем текущий фильтр.
  const host = document.querySelector('.countries_all') || document.body;
  const mo = new MutationObserver(() => {
    countryEls = Array.from(document.querySelectorAll('.country'));
    applyFilter(input.value);
  });
  mo.observe(host, { childList: true, subtree: true });

  // первоначальный вызов (если страны уже в DOM)
  applyFilter('');
});
