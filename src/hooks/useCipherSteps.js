/*
 * AUDIT LOG — useCipherSteps.js
 * [WARN] Returns empty steps when inputs missing; UI must handle gracefully -> NOTED.
 */
import { useMemo } from 'react';
import { runDES } from '../utils/des';
import { buildSteps } from '../utils/stepBuilder';
import { runAES } from '../utils/aes';
import { buildAESsteps } from '../utils/aesStepBuilder';

export function useCipherSteps(algorithm, plaintext, key) {
  return useMemo(() => {
    if (!plaintext || !key) {
      return { steps: [], result: null, error: null };
    }

    try {
      if (algorithm === 'aes') {
        const result = runAES(plaintext, key);
        return { steps: buildAESsteps(result), result, error: null };
      }

      const result = runDES(plaintext, key);
      return { steps: buildSteps(result), result, error: null };
    } catch (err) {
      return { steps: [], result: null, error: err.message };
    }
  }, [algorithm, key, plaintext]);
}
