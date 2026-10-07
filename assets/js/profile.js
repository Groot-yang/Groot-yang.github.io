/* Navigation and disclosure controls remain usable without JavaScript. */
const printButton = document.querySelector('.print-button');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}

/* Animate only when content enters view; content is visible by default. */
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealedElements = new WeakSet();
const activeReveals = new Set();
let revealObserver;

function settleReveals() {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = undefined;
  }
  for (const animation of activeReveals) animation.cancel();
  activeReveals.clear();
}

function linkedContent() {
  try {
    return document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  } catch {
    return null;
  }
}

function revealContent(element) {
  revealedElements.add(element);
  const anchor = linkedContent();
  if (anchor && (element.contains(anchor) || anchor.contains(element))) return;
  if (element.contains(document.activeElement)) return;

  const animation = element.animate(
    [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  );
  activeReveals.add(animation);
  const release = () => activeReveals.delete(animation);
  animation.addEventListener('finish', release, { once: true });
  animation.addEventListener('cancel', release, { once: true });
}

function observeContent() {
  if (
    motionPreference.matches ||
    typeof window.IntersectionObserver !== 'function' ||
    typeof Element.prototype.animate !== 'function'
  ) return;

  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      revealObserver.unobserve(entry.target);
      revealContent(entry.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll(
    '.profile-heading, .biography, .profile-links, .profile-avatar, ' +
    '.home-research > h2, .research-list article, ' +
    '.home-highlights .section-heading, .home-feature, ' +
    '.home-updates .section-heading, .home-update, ' +
    '.page-intro, .page-publications .section-heading, ' +
    '.page-publications .paper, .talk-row'
  ).forEach((element) => {
    if (!revealedElements.has(element)) revealObserver.observe(element);
  });
}

function settleRelatedReveals(target) {
  if (!target) return;
  for (const animation of activeReveals) {
    const element = animation.effect.target;
    if (element.contains(target) || target.contains(element)) animation.cancel();
  }
}

/* Reading, keyboard focus, printing, and motion preferences take priority. */
document.addEventListener('focusin', (event) => settleRelatedReveals(event.target));
window.addEventListener('hashchange', () => settleRelatedReveals(linkedContent()));
window.addEventListener('beforeprint', settleReveals);
window.addEventListener('afterprint', observeContent);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    settleReveals();
    observeContent();
  }
});
motionPreference.addEventListener('change', () => {
  settleReveals();
  observeContent();
});
observeContent();

/* Each research illustration loops in place; horizontal scrolling is user-controlled. */
const researchGallery = document.querySelector('.research-gallery');
if (researchGallery) {
  const sceneStrip = researchGallery.querySelector('.research-scenes');
  const scenes = [...sceneStrip.querySelectorAll('.research-scene')];
  const toggle = researchGallery.querySelector('.gallery-toggle');
  const arrows = [...researchGallery.querySelectorAll('.gallery-arrow')];
  const canObserve = typeof window.IntersectionObserver === 'function';
  let userPaused = false;
  let printing = false;

  function updateGalleryMotion() {
    const reduced = motionPreference.matches;
    const visible = scenes.some(scene => scene.classList.contains('is-visible'));
    researchGallery.dataset.motion = !userPaused && !reduced && !document.hidden && !printing && visible ? 'running' : 'paused';
    toggle.hidden = reduced || !canObserve;
    toggle.dataset.paused = String(userPaused);
    toggle.querySelector('span').textContent = userPaused ? toggle.dataset.playLabel : toggle.dataset.pauseLabel;
  }

  function updateGalleryArrows() {
    const maximum = sceneStrip.scrollWidth - sceneStrip.clientWidth;
    for (const arrow of arrows) {
      arrow.hidden = maximum <= 2;
      arrow.disabled = Number(arrow.dataset.direction) < 0 ? sceneStrip.scrollLeft <= 2 : sceneStrip.scrollLeft >= maximum - 2;
    }
  }

  for (const arrow of arrows) {
    arrow.addEventListener('click', () => {
      const step = scenes[0].getBoundingClientRect().width + parseFloat(getComputedStyle(sceneStrip).gap);
      let target = (Math.round(sceneStrip.scrollLeft / step) + Number(arrow.dataset.direction)) * step;
      const maximum = sceneStrip.scrollWidth - sceneStrip.clientWidth;
      if (maximum - target < step / 2) target = maximum;
      if (target < step / 2) target = 0;
      sceneStrip.scrollTo({ left: target, behavior: motionPreference.matches ? 'instant' : 'smooth' });
    });
  }
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    updateGalleryMotion();
  });
  sceneStrip.addEventListener('focusin', event => {
    const scene = event.target.closest('.research-scene');
    if (scene) scene.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  });
  sceneStrip.addEventListener('scroll', updateGalleryArrows, { passive: true });
  window.addEventListener('resize', updateGalleryArrows);
  document.addEventListener('visibilitychange', updateGalleryMotion);
  motionPreference.addEventListener('change', updateGalleryMotion);
  window.addEventListener('beforeprint', () => { printing = true; updateGalleryMotion(); });
  window.addEventListener('afterprint', () => { printing = false; updateGalleryMotion(); });
  window.addEventListener('pageshow', () => { updateGalleryMotion(); updateGalleryArrows(); });

  if (canObserve) {
    researchGallery.classList.add('gallery-ready');
    const sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-visible', entry.isIntersecting && entry.intersectionRatio >= 0.1);
      updateGalleryMotion();
    }, { threshold: [0, 0.1] });
    scenes.forEach(scene => sceneObserver.observe(scene));
  }
  updateGalleryMotion();
  updateGalleryArrows();
}
