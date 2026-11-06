import './style.css';
import { createBindings } from '../../kernel/bind.js';
import { h } from '../../kernel/dom.js';

const FIELDS = [
  { name: 'name', label: 'lblName', ph: 'phName', type: 'text', autocomplete: 'off', max: 120 },
  { name: 'role', label: 'lblRole', ph: 'phRole', type: 'text', autocomplete: 'off', max: 120 },
  { name: 'company', label: 'lblCompany', ph: 'phCompany', type: 'text', autocomplete: 'off', max: 120 },
  { name: 'email', label: 'lblEmail', ph: 'phEmail', type: 'email', autocomplete: 'off', max: 254 },
  { name: 'phone', label: 'lblPhone', ph: 'phPhone', type: 'tel', autocomplete: 'off', max: 32 },
];

export function mount(host, ctx) {
  const { app, i18n, audio } = ctx;
  const b = createBindings(i18n);
  const errors = {};
  const inputs = {};
  const errorEls = {};

  const fieldRows = FIELDS.map((f) => {
    const id = `reg-${f.name}`;
    const input = h('input', {
      id,
      name: f.name,
      type: f.type,
      maxlength: f.max,
      autocomplete: f.autocomplete,
      autocapitalize: f.type === 'text' ? 'words' : 'off',
      inputmode: f.type === 'tel' ? 'tel' : f.type === 'email' ? 'email' : 'text',
      'aria-describedby': `${id}-error`,
      required: true,
    });
    b.attr(input, 'placeholder', f.ph);
    const error = h('p', { class: 'field__error', id: `${id}-error`, role: 'alert' });
    inputs[f.name] = input;
    errorEls[f.name] = error;
    return h(
      'div',
      { class: 'field' },
      h('label', { for: id }, b.text(h('span'), f.label), h('span', { class: 'req', 'aria-hidden': 'true' }, ' *')),
      input,
      error,
    );
  });

  const consent = h('input', { type: 'checkbox', id: 'reg-consent', required: true, 'aria-describedby': 'reg-consent-error' });
  const consentError = h('p', { class: 'field__error', id: 'reg-consent-error', role: 'alert' });
  const newsletter = h('input', { type: 'checkbox', id: 'reg-newsletter' });

  const checkRow = (input, titleKey, bodyKey, required) =>
    h(
      'label',
      { class: 'check', for: input.id },
      input,
      h(
        'span',
        {},
        h('strong', {}, b.text(h('span'), titleKey), required ? h('span', { class: 'req' }, ' *') : null),
        ' ',
        b.text(h('span'), bodyKey),
      ),
    );

  const form = h(
    'form',
    { class: 'card form', novalidate: true, onsubmit: onSubmit },
    h(
      'div',
      { class: 'hero' },
      b.text(h('p', { class: 'eyebrow' }), 'heroTag'),
      b.text(h('h1'), 'heroTitle'),
      b.text(h('p', { class: 'lede' }), 'heroDesc'),
      h('div', { class: 'badges' }, b.text(h('span', { class: 'badge' }), () => i18n.t('scoringBadge', { seconds: app.questionTimeSeconds })), b.text(h('span', { class: 'badge badge--swag' }), 'swagNotice')),
    ),
    h('div', { class: 'grid' }, fieldRows),
    checkRow(consent, 'consentTitle', 'consentBody', true),
    consentError,
    checkRow(newsletter, 'newsletterTitle', 'newsletterBody', false),
    b.text(h('p', { class: 'note' }), 'privacyNote'),
    b.text(h('button', { class: 'btn btn--primary', type: 'submit' }), 'btnStart'),
  );

  function paintErrors() {
    for (const f of FIELDS) {
      const key = errors[f.name];
      errorEls[f.name].textContent = key ? i18n.t(key) : '';
      if (key) inputs[f.name].setAttribute('aria-invalid', 'true');
      else inputs[f.name].removeAttribute('aria-invalid');
    }
    consentError.textContent = errors.consent ? i18n.t(errors.consent) : '';
  }

  function onSubmit(event) {
    event.preventDefault();
    audio.unlock();
    const result = app.register({
      name: inputs.name.value,
      role: inputs.role.value,
      company: inputs.company.value,
      email: inputs.email.value,
      phone: inputs.phone.value,
      consentShare: consent.checked,
      newsletterOptIn: newsletter.checked,
    });
    for (const key of Object.keys(errors)) delete errors[key];
    if (result.ok) {
      audio.play('click');
      return;
    }
    Object.assign(errors, result.errors);
    paintErrors();
    audio.play('wrong');
    const first = FIELDS.find((f) => errors[f.name]);
    (first ? inputs[first.name] : consent).focus();
  }

  host.append(form);
  const stop = i18n.subscribe(() => {
    b.refresh();
    paintErrors();
  });
  return () => {
    stop();
    host.replaceChildren();
  };
}
