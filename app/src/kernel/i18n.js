/**
 * Dictionary-based i18n. All UI text lives in dictionaries keyed by language.
 * Static bilingual content (questions) uses `pick({ pt, en })`.
 */
export function createI18n(dictionaries, initial = 'pt') {
  let lang = initial;
  const subscribers = new Set();

  const api = {
    get lang() {
      return lang;
    },
    languages: Object.keys(dictionaries),
    setLang(next) {
      if (!dictionaries[next] || next === lang) return;
      lang = next;
      subscribers.forEach((fn) => fn(lang));
    },
    toggle() {
      const i = api.languages.indexOf(lang);
      api.setLang(api.languages[(i + 1) % api.languages.length]);
    },
    t(key, params = {}) {
      const template = dictionaries[lang][key];
      if (template === undefined) return key;
      return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
    },
    pick(localized) {
      return localized[lang];
    },
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
  };
  return api;
}
