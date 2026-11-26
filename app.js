const menu = document.querySelector('#menu');
const burger = document.querySelector('.burger');
function closeMenu() {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
  burger.setAttribute('aria-expanded', String(menu.classList.toggle('open')));
});
menu.addEventListener('click', closeMenu);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    closeMenu();
    burger.focus();
  }
});
const filters = document.querySelectorAll('[data-filter]');
function filterProducts(value) {
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
  document.querySelectorAll('.product').forEach(product => {
    product.hidden = value !== 'Все' && value !== product.dataset.type;
  });
}
filters.forEach(button => button.addEventListener('click', () => filterProducts(button.dataset.filter)));
document.querySelector('[data-filter-to]').addEventListener('click', event => filterProducts(event.currentTarget.dataset.filterTo));
const model = document.querySelector('#model');
document.querySelectorAll('[data-choice]').forEach(link => link.addEventListener('click', () => {
  model.value = link.dataset.choice;
}));
document.querySelector('form').addEventListener('submit', () => {
  const wish = document.querySelector('#wish').value.trim();
  document.querySelector('#draft').value = 'Здравствуйте! ' +
    (model.selectedIndex ? 'Меня интересует украшение «' + model.value + '».' : 'Помогите выбрать украшение.') +
    (wish ? ' ' + wish : '');
});
const video = document.querySelector('.main-video');
const play = document.querySelector('.play');
function reflectPlayback() {
  const paused = video.paused;
  video.parentElement.classList.toggle('playing', !paused);
  play.setAttribute('aria-label', paused ? 'Воспроизвести видео' : 'Пауза');
  play.querySelector('path').setAttribute('d', paused ? 'M11 6L26 16 11 26Z' : 'M9 7h5v18H9zM19 7h5v18h-5z');
}
async function togglePlayback() {
  if (!video.paused) return video.pause();
  try { await video.play(); }
  catch { play.setAttribute('aria-label', 'Повторить загрузку видео'); }
}
play.addEventListener('click', togglePlayback);
video.addEventListener('click', togglePlayback);
['play','pause','ended'].forEach(type => video.addEventListener(type, reflectPlayback));
const reviewCards = [
  [
    "Анна",
    "Браслет с речным жемчугом",
    "Очень нежный браслет. Больше всего нравится, как жемчуг выглядит при дневном свете: каждая бусинка немного разная, и в этом всё очарование."
  ],
  [
    "Екатерина",
    "Парные браслеты",
    "Для нас это маленькое напоминание друг о друге. Светлый и тёмный браслеты так красиво смотрятся рядом — именно такую пару и хотелось."
  ],
  [
    "Мария",
    "Колье с речным жемчугом",
    "Представляю это колье и с простым белым платьем, и с любимым джемпером. Украшение с характером, которое не хочется прятать до особого случая."
  ],
  [
    "Ольга",
    "Браслет с сердечками",
    "Сердечки и маленький крест — очень трогательное сочетание. Такой браслет хочется выбрать в подарок человеку, которому сложно сказать всё словами."
  ],
  [
    "Софья",
    "Колье с крестом",
    "Мне близки лаконичные украшения со смыслом. Здесь нравится баланс: жемчуг привлекает внимание, а крест остаётся деликатной деталью."
  ],
  [
    "Ирина",
    "Браслет с башмачком",
    "Небольшая подвеска делает браслет особенным. Хочется рассматривать детали и носить его каждый день, как что-то очень личное."
  ],
  [
    "Александр",
    "Мужской браслет",
    "Нравится сдержанное сочетание тёмных бусин и креста. Без лишних деталей — такой браслет легко представить частью повседневного образа."
  ],
  [
    "Дарья",
    "Украшение в подарок",
    "Здесь привлекает сама идея подарка: выбрать не просто красивую вещь, а украшение с тёплым смыслом. Жемчуг особенно нежно смотрится на фотографиях."
  ],
  [
    "Татьяна",
    "Жемчужная коллекция",
    "В коллекции есть ощущение спокойствия. Особенно нравятся неровные жемчужины: благодаря им украшения выглядят живыми и совсем не строгими."
  ]
];
let currentReview = 0;
const reviewMedia = matchMedia('(max-width:740px)');
function showReview(step) {
  const count = reviewMedia.matches ? 1 : 3;
  const pages = Math.ceil(reviewCards.length / count);
  currentReview = (currentReview + step + pages) % pages;
  const cards = reviewCards.slice(currentReview * count, currentReview * count + count).map(([name,modelName,quote]) => {
    const card = document.createElement('article'); card.className = 'review-card';
    const decoration = document.createElement('img'); decoration.src = 'assets/flower.svg'; decoration.alt = ''; decoration.className = 'review-flower';
    const text = document.createElement('p'); text.textContent = quote;
    const author = document.createElement('strong'); author.textContent = name;
    const model = document.createElement('span'); model.textContent = modelName;
    const example = document.createElement('small'); example.textContent = 'Пример отзыва';
    card.append(decoration,text,author,model,example); return card;
  });
  document.querySelector('.review-window').replaceChildren(...cards);
  document.querySelector('.page-num').textContent = (currentReview + 1) + ' / ' + pages;
}
showReview(0);
document.querySelector('.previous').addEventListener('click', () => showReview(-1));
document.querySelector('.next').addEventListener('click', () => showReview(1));
reviewMedia.addEventListener('change', () => { currentReview = 0; showReview(0); });
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const word = document.querySelector('h1 em');
  const letters = [...word.textContent];
  word.setAttribute('aria-label', word.textContent);
  word.replaceChildren(...letters.map((letter,index) => {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden','true');
    span.className = 'char';
    span.style.setProperty('--n',index);
    span.textContent = letter;
    return span;
  }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('entered');
        observer.unobserve(entry.target);
      }
    }));
    document.querySelectorAll('.product-img,.spread,.details-grid figure').forEach(item => observer.observe(item));
  }
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const button = document.querySelector('.hero .btn');
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      button.style.transform = 'translate(' + ((event.clientX-rect.left-rect.width/2)*.045) + 'px,' + ((event.clientY-rect.top-rect.height/2)*.08) + 'px)';
    });
    button.addEventListener('pointerleave', () => button.style.removeProperty('transform'));
  }
}

// Живой подбор и общая система появления секций.
const previewImage = document.querySelector('#selected-image');
function updateSelection() {
  const product = [...document.querySelectorAll('.product')].find(item => item.querySelector('h3').textContent === model.value);
  const source = product?.querySelector('img');
  previewImage.src = source?.getAttribute('src') || 'assets/video-poster.webp';
  previewImage.alt = model.value;
  document.querySelector('#selected-name').textContent = model.value;
  document.querySelector('#selected-price').textContent = product?.querySelector('strong').textContent || 'Подберём вместе с мастером';
  document.querySelectorAll('[data-model]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.model === model.value)));
}
model.addEventListener('change', updateSelection);
document.querySelectorAll('[data-choice]').forEach(link => link.addEventListener('click', updateSelection));
document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => {
  model.value = button.dataset.model;
  updateSelection();
}));
updateSelection();
document.querySelector('.fullscreen-video').addEventListener('click', async () => {
  try {
    if (video.requestFullscreen) await video.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    await video.play();
  } catch { play.focus(); }
});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const ambient = document.querySelector('.ambient-video');
const ambientButton = document.querySelector('.ambient-toggle');
let ambientManualPause = false;
function ambientLabel() { ambientButton.textContent = ambient.paused ? 'Смотреть в движении' : 'Пауза'; ambientButton.setAttribute('aria-label', ambient.paused ? 'Воспроизвести фоновое видео' : 'Приостановить фоновое видео'); }
ambientButton.addEventListener('click', async () => {
  if (ambient.paused) { ambientManualPause = false; try { await ambient.play(); } catch {} }
  else { ambientManualPause = true; ambient.pause(); }
});
ambient.addEventListener('play', ambientLabel);
ambient.addEventListener('pause', ambientLabel);
const videoVisibility = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.target === ambient && entry.isIntersecting && !reducedMotion.matches && !ambientManualPause) ambient.play().catch(() => {});
  else if (!entry.isIntersecting) entry.target.pause();
}), {threshold:.12});
document.querySelectorAll('video').forEach(item => videoVisibility.observe(item));
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); }
  }), {threshold:.07});
  document.querySelectorAll('section > :not(.grid), .product, .details-grid figure, footer, .ribbon').forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--delay', (item.classList.contains('product') ? index % 4 * 65 : 0) + 'ms');
    reveals.observe(item);
  });
  const progress = document.createElement('div'); progress.className = 'scroll-progress'; progress.setAttribute('aria-hidden','true'); document.body.append(progress);
  let framePending = false;
  const renderScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? scrollY/max : 0) + ')';
    framePending = false;
  };
  addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(renderScroll); } }, {passive:true});
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.btn,.header-link').forEach(button => button.addEventListener('pointermove', event => {
      const bounds = button.getBoundingClientRect(); button.style.setProperty('--mx', (event.clientX-bounds.left)+'px'); button.style.setProperty('--my', (event.clientY-bounds.top)+'px');
    }));
  }
}
