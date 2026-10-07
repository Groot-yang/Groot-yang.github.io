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
    !('IntersectionObserver' in window) ||
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
