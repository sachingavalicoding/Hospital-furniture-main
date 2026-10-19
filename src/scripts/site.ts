// Small progressive enhancements shared by every page. Content works without them.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// Image placeholders: drop the shimmer once the image has loaded.
function markLoaded(img: HTMLImageElement) {
  const ph = img.closest('.img-ph');
  if (ph) ph.classList.add('loaded');
}
document.querySelectorAll<HTMLImageElement>('.img-ph img').forEach((img) => {
  if (img.complete) markLoaded(img);
  else img.addEventListener('load', () => markLoaded(img), { once: true });
});

// Header shadow and back-to-top visibility
const header = document.querySelector<HTMLElement>('[data-header]');
const toTop = document.querySelector<HTMLButtonElement>('[data-to-top]');
let ticking = false;
function onScroll() {
  ticking = false;
  const y = window.scrollY;
  header?.toggleAttribute('data-scrolled', y > 8);
  if (toTop) toTop.dataset.show = String(y > 900);
}
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true },
);
onScroll();
toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  document.getElementById('main')?.focus({ preventScroll: true });
});

// Swipeable sliders built on CSS scroll snap: [data-slider] > [data-track] > [data-slide]
document.querySelectorAll<HTMLElement>('[data-slider]').forEach((root) => {
  const track = root.querySelector<HTMLElement>('[data-track]');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-dot]'));
  const status = root.querySelector<HTMLElement>('[data-status]');
  let index = 0;

  const goTo = (i: number) => {
    const n = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[n].offsetLeft - track.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > 0.6) {
          index = slides.indexOf(e.target as HTMLElement);
          dots.forEach((d, j) => d.setAttribute('aria-current', String(j === index)));
          slides.forEach((s, j) => s.toggleAttribute('inert', j !== index && root.hasAttribute('data-single')));
          if (status) status.textContent = `Slide ${index + 1} of ${slides.length}`;
        }
      }
    },
    { root: track, threshold: [0.6] },
  );
  slides.forEach((s) => io.observe(s));

  root.querySelector('[data-prev]')?.addEventListener('click', () => { stop(); goTo(index - 1); });
  root.querySelector('[data-next]')?.addEventListener('click', () => { stop(); goTo(index + 1); });
  dots.forEach((d, j) => d.addEventListener('click', () => { stop(); goTo(j); }));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); stop(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); goTo(index - 1); }
  });

  // Gentle autoplay that stops for good once the visitor interacts.
  let timer: number | undefined;
  const delay = Number(root.dataset.autoplay || 0);
  const stop = () => { window.clearInterval(timer); timer = undefined; };
  const start = () => {
    if (!delay || reduceMotion || timer || root.dataset.stopped) return;
    timer = window.setInterval(() => goTo(index + 1), delay);
  };
  const halt = () => { root.dataset.stopped = '1'; stop(); };
  ['pointerdown', 'touchstart', 'wheel', 'focusin'].forEach((ev) => root.addEventListener(ev, halt, { passive: true, once: true }));
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
});
