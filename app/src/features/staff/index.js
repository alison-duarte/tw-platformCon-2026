import './style.css';
import { createBindings } from '../../kernel/bind.js';
import { h } from '../../kernel/dom.js';

const CONFIRM_WINDOW_MS = 5000;

/** Staff panel micro-frontend. Renders participant data with text nodes only. */
export function mount(host, ctx, props = {}) {
  const { app, i18n, audio } = ctx;
  const b = createBindings(i18n);
  let records = [];
  let confirming = false;
  let confirmTimer = null;
  let statusKey = null;

  const status = h('p', { class: 'note', role: 'status' });
  const stats = h('div', { class: 'stats stats--compact' });
  const tableWrap = h('div', { class: 'table-wrap' });
  const exportButton = b.text(h('button', { class: 'btn btn--primary', type: 'button', onclick: onExport }), 'exportCsv');
  const clearButton = h('button', { class: 'btn btn--danger', type: 'button', onclick: onClear });
  const signOutButton = b.text(h('button', { class: 'btn btn--ghost', type: 'button', onclick: onSignOut }), 'btnLogout');

  const dialog = h(
    'dialog',
    { class: 'modal modal--wide', 'aria-labelledby': 'staff-title', onclose: () => props.onClose?.() },
    h('div', { class: 'modal__head' }, h('div', {}, b.text(h('h2', { id: 'staff-title' }), 'staffTitle'), b.text(h('p', { class: 'note' }), 'staffHint'))),
    h('div', { class: 'modal__body' }, stats, tableWrap, status),
    h('div', { class: 'modal__foot' }, signOutButton, clearButton, exportButton, b.text(h('button', { class: 'btn btn--ghost', type: 'button', onclick: () => dialog.close() }), 'close')),
  );
  host.append(dialog);
  dialog.showModal();

  const stat = (labelKey, value) => h('div', { class: 'stat' }, b.text(h('p', { class: 'stat__label' }), labelKey), h('p', { class: 'stat__value' }, value));
  const locale = () => (i18n.lang === 'pt' ? 'pt-BR' : 'en-US');

  function render() {
    const count = records.length;
    const total = records.reduce((sum, r) => sum + r.score, 0);
    const avg = count ? Math.round(total / count) : 0;
    const top = count ? Math.max(...records.map((r) => r.score)) : 0;
    stats.replaceChildren(stat('staffCount', String(count)), stat('staffAvg', avg.toLocaleString()), stat('staffTop', top.toLocaleString()));

    if (count === 0) {
      tableWrap.replaceChildren(b.text(h('p', { class: 'empty' }), 'staffEmpty'));
    } else {
      const head = ['colName', 'colCompany', 'colRole', 'colScore', 'colAccuracy', 'colTime'];
      const rows = [...records].reverse().map((r) =>
        h('tr', {}, h('td', {}, r.name), h('td', {}, r.company), h('td', {}, r.role), h('td', { class: 'num' }, r.score.toLocaleString()), h('td', { class: 'num' }, `${r.accuracyPct}%`), h('td', {}, new Date(r.createdAt).toLocaleString(locale()))),
      );
      tableWrap.replaceChildren(
        h('table', { class: 'table' }, h('thead', {}, h('tr', {}, head.map((key) => h('th', { scope: 'col' }, i18n.t(key))))), h('tbody', {}, rows)),
      );
    }
    exportButton.disabled = count === 0;
    clearButton.disabled = count === 0;
    clearButton.textContent = i18n.t(confirming ? 'clearConfirm' : 'clearAll');
    status.textContent = statusKey ? i18n.t(statusKey) : '';
  }

  async function refresh() {
    records = await app.listParticipants();
    render();
  }

  async function onExport() {
    audio.play('click');
    const result = await app.exportCsv();
    statusKey = result.ok ? 'exportDone' : 'staffEmpty';
    render();
  }

  async function onClear() {
    audio.play('click');
    if (!confirming) {
      confirming = true;
      statusKey = (await app.hasUnexportedParticipants()) ? 'clearNoExport' : null;
      clearTimeout(confirmTimer);
      confirmTimer = setTimeout(() => {
        confirming = false;
        statusKey = null;
        render();
      }, CONFIRM_WINDOW_MS);
      render();
      return;
    }
    clearTimeout(confirmTimer);
    confirming = false;
    await app.clearParticipants();
    statusKey = 'clearDone';
    await refresh();
  }

  /** Signing out ends the team session; the shell then shows the login screen. */
  function onSignOut() {
    audio.play('click');
    app.lock();
  }

  const stop = i18n.subscribe(() => {
    b.refresh();
    render();
  });
  refresh();

  return () => {
    stop();
    clearTimeout(confirmTimer);
    if (dialog.open) dialog.close();
    dialog.remove();
  };
}
