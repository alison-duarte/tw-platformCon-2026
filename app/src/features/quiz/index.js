import './style.css';
import { createBindings } from '../../kernel/bind.js';
import { h } from '../../kernel/dom.js';

const LETTERS = ['A', 'B', 'C', 'D'];
const URGENT_AT = 5;

export function mount(host, ctx) {
  const { app, i18n, audio } = ctx;
  const SECONDS = app.questionTimeSeconds;
  const b = createBindings(i18n);
  const { session } = app.getState();
  const question = app.questions[session.index];

  const deadline = performance.now() + SECONDS * 1000;
  let lastShown = SECONDS;
  let answered = false;

  const timerText = h('span', { class: 'timer__value' });
  const timerBar = h('div', { class: 'timer__bar' });
  const timer = h(
    'div',
    { class: 'timer', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': SECONDS },
    h('div', { class: 'timer__track' }, timerBar),
  );
  b.attr(timer, 'aria-label', 'timeLeft');

  const buttons = question.options.map((option, index) => {
    const button = h(
      'button',
      { class: 'option', type: 'button', onclick: () => choose(index) },
      h('span', { class: 'option__letter', 'aria-hidden': 'true' }, LETTERS[index]),
      b.text(h('span', { class: 'option__text' }), () => i18n.pick(option)),
    );
    b.attr(button, 'aria-label', () => `${i18n.t('optionLabel', { letter: LETTERS[index] })}: ${i18n.pick(option)}`);
    return button;
  });

  const progress = h(
    'div',
    { class: 'steps', 'aria-hidden': 'true' },
    app.questions.map((_, i) => h('span', { class: i < session.index ? 'step step--done' : i === session.index ? 'step step--now' : 'step' })),
  );

  const view = h(
    'section',
    { class: 'card quiz' },
    h(
      'div',
      { class: 'quiz__top' },
      h('div', {}, b.text(h('p', { class: 'eyebrow' }), () => i18n.pick(question.category)), b.text(h('p', { class: 'quiz__count' }), () => i18n.t('questionOf', { n: session.index + 1, total: session.total }))),
      h('div', { class: 'quiz__score' }, b.text(h('span', { class: 'quiz__score-label' }), 'scoreLabel'), h('strong', {}, session.score.toLocaleString())),
    ),
    progress,
    b.text(h('h2', { class: 'quiz__question' }), () => i18n.pick(question.question)),
    h('div', { class: 'timer-row' }, b.text(h('span', { class: 'timer__label' }), 'timeLeft'), timer, timerText),
    h('div', { class: 'options' }, buttons),
    b.text(h('p', { class: 'note' }), 'speedHint'),
  );
  host.append(view);

  function remainingSeconds() {
    return Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
  }

  function paintTimer() {
    const left = Math.max(0, deadline - performance.now());
    const seconds = remainingSeconds();
    timerBar.style.setProperty('width', `${(left / (SECONDS * 1000)) * 100}%`);
    timerText.textContent = i18n.t('secondsShort', { n: seconds });
    timer.setAttribute('aria-valuenow', String(seconds));
    timer.classList.toggle('timer--urgent', seconds <= URGENT_AT);
    if (seconds !== lastShown && seconds <= URGENT_AT && seconds > 0) audio.play('tick');
    lastShown = seconds;
    if (left <= 0 && !answered) {
      answered = true;
      app.timeout();
    }
  }

  function choose(index) {
    if (answered) return;
    answered = true;
    buttons.forEach((button) => {
      button.disabled = true;
    });
    app.answer(index, remainingSeconds());
  }

  paintTimer();
  const interval = setInterval(paintTimer, 200);
  const stop = b.follow();
  return () => {
    clearInterval(interval);
    stop();
    host.replaceChildren();
  };
}
