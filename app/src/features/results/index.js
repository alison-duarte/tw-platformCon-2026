import './style.css';
import { createBindings } from '../../kernel/bind.js';
import { h } from '../../kernel/dom.js';

const TIER_KEYS = { visionary: 'tierVisionary', hero: 'tierHero', explorer: 'tierExplorer' };

export function mount(host, ctx) {
  const { app, i18n, audio, effects } = ctx;
  const b = createBindings(i18n);
  const { result, session } = app.getState();
  let reviewDialog = null;

  const stat = (labelKey, value) =>
    h('div', { class: 'stat' }, b.text(h('p', { class: 'stat__label' }), labelKey), typeof value === 'function' ? b.text(h('p', { class: 'stat__value' }), value) : h('p', { class: 'stat__value' }, value));

  const saveWarning = b.text(h('p', { class: 'warning', role: 'alert', hidden: true }), 'saveFailed');
  const paintSaved = () => {
    saveWarning.hidden = app.getState().result?.saved !== false;
  };

  const view = h(
    'section',
    { class: 'card results' },
    h(
      'div',
      { class: 'hero' },
      b.text(h('p', { class: 'eyebrow eyebrow--ok' }), 'resultsBadge'),
      b.text(h('h1'), 'resultsTitle'),
      b.text(h('p', { class: 'lede' }), 'resultsDesc'),
    ),
    h(
      'div',
      { class: 'stats' },
      stat('statScore', result.score.toLocaleString()),
      stat('statAccuracy', `${result.accuracyPct}%`),
      stat('statStreak', String(result.maxStreak)),
      stat('statTier', () => i18n.t(TIER_KEYS[result.tier])),
    ),
    b.text(h('p', { class: 'callout' }), 'swagCallout'),
    saveWarning,
    h(
      'div',
      { class: 'actions' },
      b.text(h('button', { class: 'btn btn--ghost', type: 'button', onclick: openReview }), 'btnReview'),
      b.text(h('button', { class: 'btn btn--primary', type: 'button', onclick: onNext }), 'btnNext'),
    ),
  );
  host.append(view);
  paintSaved();

  function onNext() {
    audio.play('click');
    app.restart();
  }

  function openReview() {
    audio.play('click');
    reviewDialog?.remove();
    const rows = app.questions.map((question, index) => {
      const answer = session.answers[index];
      const verdictKey = answer.correct ? 'reviewYouCorrect' : answer.selectedIndex === null ? 'reviewTimeout' : 'reviewYouMissed';
      return h(
        'article',
        { class: 'review__item' },
        h('p', { class: `review__verdict review__verdict--${answer.correct ? 'ok' : 'bad'}` }, b.text(h('span'), verdictKey)),
        b.text(h('p', { class: 'eyebrow' }), () => i18n.pick(question.category)),
        b.text(h('h3'), () => i18n.pick(question.question)),
        b.text(h('p', { class: 'review__answer' }), () => `${i18n.t('correctAnswerIs')} ${i18n.pick(question.options[question.correctIndex])}`),
        b.text(h('p', { class: 'insight__text' }), () => i18n.pick(question.explanation)),
      );
    });
    reviewDialog = h(
      'dialog',
      { class: 'modal', 'aria-labelledby': 'review-title', onclose: () => reviewDialog?.remove() },
      h(
        'div',
        { class: 'modal__head' },
        h('div', {}, b.text(h('h2', { id: 'review-title' }), 'reviewTitle'), b.text(h('p', { class: 'note' }), 'reviewDesc')),
      ),
      h('div', { class: 'modal__body' }, rows),
      h('div', { class: 'modal__foot' }, b.text(h('button', { class: 'btn btn--primary', type: 'button', onclick: () => reviewDialog.close() }), 'close')),
    );
    host.append(reviewDialog);
    reviewDialog.showModal();
  }

  audio.play('fanfare');
  effects.celebrate();

  const stopApp = app.subscribe(paintSaved);
  const stopLang = b.follow();
  return () => {
    stopApp();
    stopLang();
    reviewDialog?.remove();
    host.replaceChildren();
  };
}
