/**
 * Lazy registry of feature micro-frontends. Each feature becomes its own chunk,
 * loaded on first use. Features never import each other; the shell mounts them
 * through this registry.
 */
export const screens = Object.freeze({
  login: () => import('../features/login/index.js'),
  registration: () => import('../features/registration/index.js'),
  question: () => import('../features/quiz/index.js'),
  feedback: () => import('../features/feedback/index.js'),
  results: () => import('../features/results/index.js'),
  staff: () => import('../features/staff/index.js'),
});
