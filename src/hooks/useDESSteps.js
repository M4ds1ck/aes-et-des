/*
 * AUDIT LOG — useDESSteps.js
 * [WARN] Kept for compatibility; not used in current flow -> NOTED.
 */
import { useMemo } from 'react';
import { runDES } from '../utils/des';
import { buildSteps } from '../utils/stepBuilder';

export function useDESSteps(plaintext, key) {
  return useMemo(() => {
    if (!plaintext || !key) {
      return { steps: [], desResult: null, error: null };
    }

    try {
      const desResult = runDES(plaintext, key);
      const steps = buildSteps(desResult);
      return { steps, desResult, error: null };
    } catch (err) {
      return { steps: [], desResult: null, error: err.message };
    }
  }, [plaintext, key]);
}
