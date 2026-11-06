/**
 * Sound effects. Tone.js is imported on the first user gesture so it stays out
 * of the initial bundle. Audio is optional: any failure is swallowed.
 */
export function createToneAudio() {
  let tone = null;
  let synth = null;
  let loading = null;
  let muted = false;

  const NOTES = {
    click: [['C6', 0.04, 0]],
    tick: [['A5', 0.04, 0]],
    correct: [['C5', 0.1, 0], ['E5', 0.1, 0.1], ['G5', 0.2, 0.2]],
    wrong: [['E3', 0.2, 0], ['C3', 0.3, 0.2]],
    fanfare: [['C5', 0.12, 0], ['E5', 0.12, 0.12], ['G5', 0.12, 0.24], ['C6', 0.35, 0.36]],
  };

  async function load() {
    loading ??= import('tone').then(async (mod) => {
      await mod.start();
      tone = mod;
      synth = new mod.Synth({ volume: -12 }).toDestination();
    });
    return loading;
  }

  return {
    get muted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    /** Call from a user gesture (browser autoplay policy). */
    unlock() {
      load().catch(() => {});
    },
    play(name) {
      if (muted || !synth) return;
      try {
        const start = tone.now();
        for (const [note, length, offset] of NOTES[name] ?? []) {
          synth.triggerAttackRelease(note, length, start + offset);
        }
      } catch {
        // audio is a nice-to-have
      }
    },
  };
}
