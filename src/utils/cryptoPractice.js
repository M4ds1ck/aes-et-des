/*
 * AUDIT LOG — cryptoPractice.js
 * [BUG] AES decrypt output ignored ASCII post-processing from PKCS#7 -> FIXED.
 */
import { bitsToAscii, isLikelyHexBlock, isLikelyHexBlockOfLength } from './binary';
import { decryptAESBlock, encryptAESBlock } from './aes';
import { decryptDESBlock, encryptDESBlock } from './des';

export function runPracticeCrypto({ algorithm, mode, input, key }) {
  const trimmedInput = (input || '').trim();
  const trimmedKey = (key || '').trim();
  const normalizedInput =
    algorithm === 'aes'
      ? (isLikelyHexBlockOfLength(trimmedInput, 32) ? trimmedInput : input)
      : (isLikelyHexBlock(trimmedInput) ? trimmedInput : input);
  const normalizedKey =
    algorithm === 'aes'
      ? (isLikelyHexBlockOfLength(trimmedKey, 32) || isLikelyHexBlockOfLength(trimmedKey, 48) || isLikelyHexBlockOfLength(trimmedKey, 64)
          ? trimmedKey
          : key)
      : (isLikelyHexBlock(trimmedKey) ? trimmedKey : key);

  if (algorithm === 'aes') {
    const result = mode === 'decrypt' ? decryptAESBlock(normalizedInput, normalizedKey) : encryptAESBlock(normalizedInput, normalizedKey);
    return {
      hex: result.hex,
      ascii: result.ascii || bitsToAscii(result.bits),
    };
  }

  const result = mode === 'decrypt' ? decryptDESBlock(normalizedInput, normalizedKey) : encryptDESBlock(normalizedInput, normalizedKey);
  return {
    hex: result.hex,
    ascii: bitsToAscii(result.bits),
  };
}
