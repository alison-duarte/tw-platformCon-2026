import './style.css';
import { createBindings } from '../../kernel/bind.js';
import { h, s } from '../../kernel/dom.js';

const LETTERS = ['A', 'B', 'C', 'D'];
const POP_MS = 1400;

// Icon paths on a 52x52 grid: check (right), cross (wrong), clock (time expired).
const ICONS = {
  ok: 'M14 27l8 8 16-17',
  bad: 'M16 16l20 20M36 16L16 36',
  late: 'M26 13v14l9 6',
};

export function mount(host, ctx) {
  const { app, i18n, audio } = ctx;
  const b = createBindings(i18n);
  const { session } = app.getState();
  const question = app.questions[session.index];
  const answer = session.lastAnswer;
  const timedOut = answer.selectedIndex === null;
  const isLast = session.index + 1 >= session.total;
  const tone = answer.correct ? 'ok' : timedOut ? 'late' : 'bad';

  const titleKey = answer.correct ? 'correctTitle' : timedOut ? 'timeoutTitle' : 'wrongTitle';
  const banner = h(
    'div',
    { class: `banner banner--${tone}`, role: 'status' },
    h('span', { class: 'banner__icon', 'aria-hidden': 'true' }, answer.correct ? '✓' : timedOut ? '⏱' : '✕'),
    h(
      'div',
      {},
      b.text(h('p', { class: 'banner__title' }), titleKey),
      b.text(h('p', { class: 'banner__points' }), () => (answer.correct ? i18n.t('pointsEarned', { points: answer.points.toLocaleString() }) : i18n.t('pointsNone'))),
      answer.correct && session.streak >= 2 ? b.text(h('p', { class: 'banner__streak' }), () => `🔥 ${i18n.t('streakNote', { n: session.streak })}`) : null,
    ),
  );

  const options = question.options.map((option, index) => {
    const state = index === question.correctIndex ? 'right' : index === answer.selectedIndex ? 'wrong' : 'idle';
    return h(
      'li',
      { class: `answer answer--${state}` },
      h('span', { class: 'option__letter', 'aria-hidden': 'true' }, LETTERS[index]),
      b.text(h('span', { class: 'option__text' }), () => i18n.pick(option)),
    );
  });

  const nextButton = b.text(
    h('button', { class: 'btn btn--primary', type: 'button', onclick: onNext }),
    isLast ? 'viewResults' : 'nextQuestion',
  );

  host.append(
    h(
      'section',
      { class: `card feedback feedback--${tone}` },
      banner,
      b.text(h('h2', { class: 'quiz__question' }), () => i18n.pick(question.question)),
      h('ol', { class: 'answers' }, options),
      h(
        'aside',
        { class: 'insight' },
        b.text(h('p', { class: 'eyebrow' }), 'insightTitle'),
        b.text(h('p', { class: 'insight__text' }), () => i18n.pick(question.explanation)),
      ),
      nextButton,
    ),
  );

  const pop = h(
    'div',
    { class: `pop pop--${tone}`, 'aria-hidden': 'true' },
    h(
      'div',
      { class: 'pop__badge' },
      s('svg', { viewBox: '0 0 52 52' }, s('circle', { class: 'pop__ring', cx: 26, cy: 26, r: 24 }), s('path', { class: 'pop__mark', d: ICONS[tone] })),
    ),
  );
  host.append(pop);
  const popTimer = setTimeout(() => pop.remove(), POP_MS);

  audio.play(answer.correct ? 'correct' : 'wrong');
  nextButton.focus({ preventScroll: true });

  function onNext() {
    nextButton.disabled = true;
    audio.play('click');
    app.next();
  }

  const stop = b.follow();
  return () => {
    clearTimeout(popTimer);
    stop();
    host.replaceChildren();
  };
}
