import './style.css';
import { createBindings } from '../../kernel/bind.js';
import { h } from '../../kernel/dom.js';

/**
 * Login gate: the first screen until a team account is validated on this iPad.
 * One generic message for a wrong email or password, so the screen never says
 * which one is wrong. The password field is cleared after every attempt.
 */
export function mount(host, ctx) {
  const { app, i18n, audio } = ctx;
  const b = createBindings(i18n);
  let busy = false;

  const emailInput = h('input', {
    id: 'login-email', name: 'email', type: 'email', autocomplete: 'username',
    autocapitalize: 'off', inputmode: 'email', required: true, 'aria-describedby': 'login-error',
  });
  const passwordInput = h('input', {
    id: 'login-password', name: 'password', type: 'password', autocomplete: 'current-password',
    required: true, 'aria-describedby': 'login-error',
  });
  const error = h('p', { class: 'login__error', id: 'login-error', role: 'alert' });
  const submit = b.text(h('button', { class: 'btn btn--primary', type: 'submit' }), 'btnLogin');

  const form = h(
    'form',
    { class: 'login__form', novalidate: true, onsubmit: onSubmit },
    h('div', { class: 'login__field' },
      b.text(h('label', { for: 'login-email' }), 'lblLoginEmail'),
      emailInput),
    h('div', { class: 'login__field' },
      b.text(h('label', { for: 'login-password' }), 'lblLoginPass'),
      passwordInput),
    error,
    h('div', { class: 'login__actions' }, submit),
  );

  const section = h(
    'section',
    { class: 'card login' },
    h('div', { class: 'hero' },
      b.text(h('p', { class: 'eyebrow' }), 'loginTag'),
      b.text(h('h1'), 'loginTitle'),
      b.text(h('p', { class: 'lede' }), 'loginDesc')),
    form,
  );
  host.append(section);
  emailInput.focus();

  async function onSubmit(event) {
    event.preventDefault();
    if (busy) return;
    busy = true;
    submit.disabled = true;
    error.textContent = '';
    const outcome = await app.login(emailInput.value.trim(), passwordInput.value);
    passwordInput.value = '';
    if (outcome.ok) {
      audio.play('click');
      return; // the shell replaces this view
    }
    busy = false;
    submit.disabled = false;
    audio.play('wrong');
    error.textContent = outcome.reason === 'locked'
      ? i18n.t('loginLocked', { seconds: outcome.retryInSeconds })
      : i18n.t('loginInvalid');
    passwordInput.focus();
  }

  const stop = i18n.subscribe(() => {
    b.refresh();
    error.textContent = '';
  });

  return () => {
    stop();
    host.replaceChildren();
  };
}
