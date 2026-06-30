import { useCallback, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useAudio() {
  const { soundEnabled, musicEnabled } = useGameStore();
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      bgMusicRef.current = new Audio('/assets/audio/bg-music.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.3;
      initialized.current = true;
    }

    if (musicEnabled && bgMusicRef.current) {
      bgMusicRef.current.play().catch(() => {
        // Autoplay blocked, will try on first interaction
      });
    } else if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, [musicEnabled]);

  const playSound = useCallback(
    (soundName: 'click' | 'success' | 'transition' | 'stamp') => {
      if (!soundEnabled) return;

      const audio = new Audio(`/assets/audio/${soundName}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    },
    [soundEnabled]
  );

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playSuccess = useCallback(() => playSound('success'), [playSound]);
  const playTransition = useCallback(() => playSound('transition'), [playSound]);
  const playStamp = useCallback(() => playSound('stamp'), [playSound]);

  return {
    playClick,
    playSuccess,
    playTransition,
    playStamp,
    soundEnabled,
    musicEnabled,
  };
}
