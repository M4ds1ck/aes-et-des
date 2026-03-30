/*
 * AUDIT LOG - AESSlides.jsx
 * [OK] Visual modules use live-trace data.
 */
import { getAESVisuals } from './AESVisuals';

export function getAESSlides(trace, onJump) {
  return getAESVisuals(trace, onJump);
}
