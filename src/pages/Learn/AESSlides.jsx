/*
 * AUDIT LOG - AESSlides.jsx
 * [OK] Visual modules use live-trace data.
 */
import { getAESVisuals } from './AESVisuals';

export function getAESSlides(trace, displayMode = 'hex') {
  return getAESVisuals(trace, displayMode);
}
