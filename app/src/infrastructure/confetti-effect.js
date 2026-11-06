/** Confetti loads lazily and is skipped when the user prefers reduced motion. */
export function createConfettiEffect() {
  return {
    async celebrate() {
      if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      try {
        const { default: confetti } = await import('canvas-confetti');
        const colors = ['#F2617A', '#00A389', '#F3A712', '#F8FAFC'];
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 }, colors });
        setTimeout(() => confetti({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0 }, colors }), 250);
        setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1 }, colors }), 250);
      } catch {
        // decoration only
      }
    },
  };
}
