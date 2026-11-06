/**
 * Safe DOM builder. Strings are always inserted as text nodes, never parsed
 * as HTML, so participant data cannot become markup (XSS guardrail).
 * Style is set through the CSSOM, which stays compatible with a strict CSP.
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs ?? {})) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'class') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      for (const [prop, v] of Object.entries(value)) el.style.setProperty(prop, v);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function replaceChildren(el, ...children) {
  el.replaceChildren();
  append(el, children);
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** SVG counterpart of `h()`. Attributes only; styling stays in CSS for CSP. */
export function s(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs ?? {})) {
    if (value !== undefined && value !== null && value !== false) el.setAttribute(key, String(value));
  }
  append(el, children);
  return el;
}
