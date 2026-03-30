/*
 * AUDIT LOG — useAnimation.js
 * [OK] Timing hook verified.
 */
import { useEffect, useState } from 'react';

export function useAnimation(trigger, duration = 400) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), duration);
    return () => clearTimeout(timer);
  }, [trigger, duration]);

  return isAnimating;
}
