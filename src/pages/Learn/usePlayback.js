/*
 * AUDIT LOG - usePlayback.js
 * [BUG] Play stayed active on single-phase visuals -> FIXED (auto-stop when phases <= 1).
 * [BUG] Phase index could exceed new phase count -> FIXED (clamp on change).
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const SPEED_MAP = {
  slow: 1200,
  normal: 700,
  fast: 350,
};

export function usePlayback(phases = 1) {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    setPhase(0);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (phases <= 1 && isPlaying) {
      setIsPlaying(false);
      setPhase(0);
    }
    if (phase > Math.max(phases - 1, 0)) {
      setPhase(0);
    }
  }, [isPlaying, phase, phases]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (phases <= 1) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setPhase((prev) => {
        if (prev >= phases - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, SPEED_MAP[speed] || SPEED_MAP.normal);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, phases, speed]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    phase,
    phases,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    reset,
  };
}
