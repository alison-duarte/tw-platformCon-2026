import './style.css';
import { createBindings } from '../../kernel/bind.js';
import { h } from '../../kernel/dom.js';

const LONG_PRESS_MS = 1500;

/**
 * Shell micro-frontend: header, language and sound toggles, screen outlet, and
 * the hidden staff entry (long-press on the logo). It mounts other features
 * through `ctx.screens`, lazy loaders provided by the composition root.
 */
export function mount(host, ctx) {
  const { app, i18n, audio, screens } = ctx;
  const b = createBindings(i18n);

  let pressTimer = null;
  let currentView = null;
  let loadToken = 0;
  let disposeScreen = null;
  let disposeStaff = null;

  const cancelPress = () => clearTimeout(pressTimer);
  const logo = h(
    'div',
    {
      class: 'logo',
      onpointerdown: () => {
        cancelPress();
        pressTimer = setTimeout(openStaff, LONG_PRESS_MS);
      },
      onpointerup: cancelPress,
      onpointerleave: cancelPress,
      onpointercancel: cancelPress,
      oncontextmenu: (event) => event.preventDefault(),
    },
    h('span', { class: 'logo__mark', 'aria-hidden': 'true' }, '/'),
    h('span', { class: 'logo__word' }, 'thoughtworks'),
    h('span', { class: 'logo__descriptor' }, 'Design. Engineering. AI.'),
  );

  const subtitle = b.text(h('span', { class: 'nav__subtitle' }), 'navSubtitle');

  const soundButton = h('button', { class: 'chip', type: 'button', onclick: toggleSound });
  const langButton = h('button', { class: 'chip', type: 'button', onclick: toggleLanguage });
  const flag = h('span', { 'aria-hidden': 'true' });
  const langLabel = h('span');
  langButton.append(flag, langLabel);
  b.attr(langButton, 'aria-label', 'langSwitch');

  function paintToggles() {
    flag.textContent = i18n.lang === 'pt' ? '🇧🇷' : '🇺🇸';
    langLabel.textContent = i18n.lang.toUpperCase();
    soundButton.textContent = audio.muted ? '🔇' : '🔊';
    soundButton.setAttribute('aria-label', i18n.t(audio.muted ? 'audioOff' : 'audioOn'));
    document.documentElement.lang = i18n.lang === 'pt' ? 'pt-BR' : 'en';
    document.title = i18n.t('documentTitle');
  }

  function toggleSound() {
    audio.unlock();
    audio.toggleMute();
    paintToggles();
    audio.play('click');
  }

  function toggleLanguage() {
    audio.unlock();
    i18n.toggle();
    audio.play('click');
  }

  const outlet = h('main', { class: 'outlet', id: 'screen' });
  const overlay = h('div', { class: 'overlay' });
  const footer = h(
    'footer',
    { class: 'footer' },
    h('span', {}, `© ${new Date().getFullYear()} Thoughtworks`),
    b.text(h('span'), () => `• ${i18n.t('navSubtitle')}`),
  );

  host.replaceChildren(
    h(
      'div',
      { class: 'shell' },
      h('header', { class: 'nav' }, logo, subtitle, h('div', { class: 'nav__tools' }, soundButton, langButton)),
      outlet,
      footer,
      overlay,
    ),
  );

  async function show(view) {
    const token = ++loadToken;
    const module = await screens[view]();
    if (token !== loadToken) return;
    disposeScreen?.();
    outlet.replaceChildren();
    disposeScreen = module.mount(outlet, ctx);
    window.scrollTo({ top: 0 });
  }

  /** The staff panel opens only inside an unlocked session. */
  async function openStaff() {
    if (disposeStaff || !app.isUnlocked()) return;
    audio.play('click');
    const module = await screens.staff();
    disposeStaff = module.mount(overlay, ctx, {
      onClose: () => {
        disposeStaff?.();
        disposeStaff = null;
      },
    });
  }

  function closeStaff() {
    disposeStaff?.();
    disposeStaff = null;
  }

  const unsubscribeApp = app.subscribe((state) => {
    if (state.view !== currentView) {
      currentView = state.view;
      if (currentView === 'login') closeStaff();
      show(currentView);
    }
  });
  const unsubscribeLang = i18n.subscribe(() => {
    b.refresh();
    paintToggles();
  });

  paintToggles();
  currentView = app.getState().view;
  show(currentView);

  return () => {
    cancelPress();
    unsubscribeApp();
    unsubscribeLang();
    disposeScreen?.();
    closeStaff();
    host.replaceChildren();
  };
}
