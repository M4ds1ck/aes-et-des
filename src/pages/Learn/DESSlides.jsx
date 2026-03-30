/*
 * AUDIT LOG - DESSlides.jsx
 * [OK] Visual modules use live-trace data.
 */
import { getDESVisuals } from './DESVisuals';

export function getDESSlides(trace, onJump) {
  return getDESVisuals(trace, onJump);
}
