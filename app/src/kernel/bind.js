/**
 * Keeps translated text in sync without re-rendering, so language toggling never
 * resets form input or a running timer. A source is an i18n key or a function
 * returning a string.
 */
export function createBindings(i18n) {
  const updaters = [];
  const resolve = (source) => (typeof source === 'function' ? source() : i18n.t(source));
  return {
    text(el, source) {
      const update = () => {
        el.textContent = resolve(source);
      };
      updaters.push(update);
      update();
      return el;
    },
    attr(el, name, source) {
      const update = () => el.setAttribute(name, resolve(source));
      updaters.push(update);
      update();
      return el;
    },
    refresh() {
      updaters.forEach((fn) => fn());
    },
    /** Re-run on language change; returns the unsubscribe function. */
    follow() {
      return i18n.subscribe(() => updaters.forEach((fn) => fn()));
    },
  };
}
