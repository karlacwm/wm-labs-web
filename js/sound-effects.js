/**
 * WM LABS - Web Audio Synthesizer for Retro Aquatic Sounds
 * 
 * Generates procedural 8-bit / aquatic audio tones using Web Audio API.
 * 100% dependency-free, no external mp3 assets needed.
 */

const SoundFX = (() => {
  let audioCtx = null;
  let isMuted = true;

  function getContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (!isMuted) {
      getContext();
      playBubble();
    }
    return !isMuted;
  }

  function playBubble() {
    if (isMuted) return;
    const ctx = getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch sweeps upwards like a bubble pop
      const startFreq = 300 + Math.random() * 200;
      const endFreq = startFreq + 350 + Math.random() * 150;

      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      // Audio context might be restricted
    }
  }

  function playNibble() {
    if (isMuted) return;
    const ctx = getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  }

  function playClick() {
    if (isMuted) return;
    const ctx = getContext();
    if (!ctx) return;

    try {
      // Friendly retro two-note sparkle chime
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.06, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.16);
      });
    } catch (e) {}
  }

  return {
    toggleMute,
    isMuted: () => isMuted,
    playBubble,
    playNibble,
    playClick
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SoundFX };
}
