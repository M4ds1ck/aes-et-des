/*
 * AUDIT LOG - useCipherSteps.js
 * [BUG] Failed computations cleared steps and reset navigation -> FIXED (retain last good steps).
 * [BUG] AES key typing triggered errors while length was incomplete -> FIXED (defer compute until key is valid).
 * [WARN] Returns empty steps when inputs missing; UI must handle gracefully -> NOTED.
 */
import { useEffect, useMemo, useRef } from 'react';
import { runDES } from '../utils/des';
import { buildSteps } from '../utils/stepBuilder';
import { runAES } from '../utils/aes';
import { buildAESsteps } from '../utils/aesStepBuilder';
import { isLikelyHexBlock, isLikelyHexBlockOfLength } from '../utils/binary';

function isValidAESKey(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return false;
  if (isLikelyHexBlockOfLength(trimmed, 32) || isLikelyHexBlockOfLength(trimmed, 48) || isLikelyHexBlockOfLength(trimmed, 64)) {
    return true;
  }
  return [16, 24, 32].includes(trimmed.length);
}

export function useCipherSteps(algorithm, plaintext, key) {
  const lastGoodRef = useRef({ steps: [], result: null });

  const computed = useMemo(() => {
    if (!plaintext || !key) {
      return { steps: [], result: null, error: null };
    }

    try {
      if (algorithm === 'aes') {
        if (!isValidAESKey(key)) {
          return {
            steps: lastGoodRef.current.steps,
            result: lastGoodRef.current.result,
            error: null,
            pending: true,
          };
        }
        const result = runAES(plaintext, key);
        return { steps: buildAESsteps(result), result, error: null };
      }

      if (!isLikelyHexBlock(key) && (key || '').trim().length === 0) {
        return { steps: [], result: null, error: null };
      }
      const result = runDES(plaintext, key);
      return { steps: buildSteps(result), result, error: null };
    } catch (err) {
      return {
        steps: lastGoodRef.current.steps,
        result: lastGoodRef.current.result,
        error: err.message,
        stale: true,
      };
    }
  }, [algorithm, key, plaintext]);

  useEffect(() => {
    if (!computed.error && computed.steps.length) {
      lastGoodRef.current = { steps: computed.steps, result: computed.result };
    }
  }, [computed]);

  return computed;
}
