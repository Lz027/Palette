import { useCallback, useRef } from 'react';
import { FocusMode } from '@/contexts/FocusContext';

// Sound frequencies for each focus mode
const modeFrequencies: Record<FocusMode, number[]> = {
  productive: [440, 523, 659], // A4, C5, E5 - warm chord
  design: [523, 659, 784], // C5, E5, G5 - bright chord
  tech: [329, 440, 523], // E4, A4, C5 - deep chord
};

export function useFocusSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playFocusSound = useCallback((mode: FocusMode) => {
    try {
      // Create audio context on first use
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const frequencies = modeFrequencies[mode];
      const now = ctx.currentTime;

      frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        // Stagger the notes slightly for echo effect
        const startTime = now + i * 0.05;
        const duration = 0.3;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (e) {
      // Silently fail if audio is not supported
      console.warn('Audio playback failed:', e);
    }
  }, []);

  return { playFocusSound };
}
