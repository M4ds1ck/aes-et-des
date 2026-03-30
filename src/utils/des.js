/*
 * AUDIT LOG — des.js
 * [BUG] Key/plaintext display used malformed glyphs -> FIXED.
 * [WARN] DES practice mode operates on a single 64-bit block only -> NOTED.
 */
import { E, FP, IP, P, PC1, PC2, SBOXES, SHIFT_SCHEDULE } from '../constants/permutationTables.js';
import {
  bitsToHex,
  bitsToInt,
  hexToBits,
  intToBits,
  isLikelyHexBlock,
  leftRotate,
  bitsToAscii,
  padStringTo8Bytes,
  permute,
  splitBits,
  stringToBits,
  xorBits,
} from './binary.js';

function resolveInputBits(input) {
  const trimmed = (input || '').trim();
  if (isLikelyHexBlock(trimmed)) {
    return {
      bits: hexToBits(trimmed),
      mode: 'hex',
      display: trimmed.toUpperCase(),
      normalized: trimmed.toUpperCase(),
    };
  }

  const normalized = padStringTo8Bytes(input || '');
  return {
    bits: stringToBits(input || ''),
    mode: 'ascii',
    display: normalized.replace(/\0/g, '.'),
    normalized,
  };
}

function processSBoxGroups(bits48) {
  return splitBits(bits48, 6).map((input6, index) => {
    const row = bitsToInt([input6[0], input6[5]]);
    const col = bitsToInt(input6.slice(1, 5));
    const outputValue = SBOXES[index][row][col];
    const output4 = intToBits(outputValue, 4);
    return {
      input6,
      row,
      col,
      output4,
      boxIndex: index + 1,
    };
  });
}

// BUG FIX: Add standalone DES encrypt/decrypt helpers for practice mode without disturbing the visualization pipeline.
function buildSubkeys(keyStr) {
  const keyInput = resolveInputBits(keyStr);
  const key64 = keyInput.bits;
  const afterPC1 = permute(key64, PC1);
  let currentC = afterPC1.slice(0, 28);
  let currentD = afterPC1.slice(28);

  return SHIFT_SCHEDULE.map((shiftAmount) => {
    currentC = leftRotate(currentC, shiftAmount);
    currentD = leftRotate(currentD, shiftAmount);
    return permute([...currentC, ...currentD], PC2);
  });
}

function feistelBlock(inputBits, subkeys) {
  const afterIP = permute(inputBits, IP);
  let left = afterIP.slice(0, 32);
  let right = afterIP.slice(32);

  subkeys.forEach((subkey) => {
    const expanded = permute(right, E);
    const xorWithKey = xorBits(expanded, subkey);
    const sboxGroups = processSBoxGroups(xorWithKey);
    const sboxOutput = sboxGroups.flatMap((group) => group.output4);
    const afterP = permute(sboxOutput, P);
    const newRight = xorBits(afterP, left);
    left = right;
    right = newRight;
  });

  const combined = [...right, ...left];
  return permute(combined, FP);
}

export function encryptDESBlock(plaintextStr, keyStr) {
  const plaintextInput = resolveInputBits(plaintextStr);
  const subkeys = buildSubkeys(keyStr);
  const ciphertext = feistelBlock(plaintextInput.bits, subkeys);
  return {
    bits: ciphertext,
    hex: bitsToHex(ciphertext),
    ascii: bitsToAscii(ciphertext),
  };
}

export function decryptDESBlock(ciphertextStr, keyStr) {
  const cipherInput = resolveInputBits(ciphertextStr);
  const subkeys = buildSubkeys(keyStr).reverse();
  const plaintextBits = feistelBlock(cipherInput.bits, subkeys);
  return {
    bits: plaintextBits,
    hex: bitsToHex(plaintextBits),
    ascii: bitsToAscii(plaintextBits),
  };
}

export function runDES(plaintextStr, keyStr) {
  const plaintextInput = resolveInputBits(plaintextStr);
  const keyInput = resolveInputBits(keyStr);

  const key64 = keyInput.bits;
  const afterPC1 = permute(key64, PC1);
  const c0 = afterPC1.slice(0, 28);
  const d0 = afterPC1.slice(28);

  let currentC = c0;
  let currentD = d0;

  const keyRounds = SHIFT_SCHEDULE.map((shiftAmount, index) => {
    const cPrev = currentC;
    const dPrev = currentD;
    const cAfterShift = leftRotate(cPrev, shiftAmount);
    const dAfterShift = leftRotate(dPrev, shiftAmount);
    const cdCombined = [...cAfterShift, ...dAfterShift];
    const subkey = permute(cdCombined, PC2);

    currentC = cAfterShift;
    currentD = dAfterShift;

    return {
      roundNum: index + 1,
      shiftAmount,
      cPrev,
      dPrev,
      cAfterShift,
      dAfterShift,
      cdCombined,
      subkey,
    };
  });

  const allSubkeys = keyRounds.map((round) => round.subkey);

  const plaintext64 = plaintextInput.bits;
  const afterIP = permute(plaintext64, IP);
  const l0 = afterIP.slice(0, 32);
  const r0 = afterIP.slice(32);

  let currentL = l0;
  let currentR = r0;

  const encryptionRounds = allSubkeys.map((subkey, index) => {
    const lPrev = currentL;
    const rPrev = currentR;
    const expanded = permute(rPrev, E);
    const xorWithKey = xorBits(expanded, subkey);
    const sboxGroups = processSBoxGroups(xorWithKey);
    const sboxOutput = sboxGroups.flatMap((group) => group.output4);
    const afterP = permute(sboxOutput, P);
    const newR = xorBits(afterP, lPrev);
    const newL = [...rPrev];

    currentL = newL;
    currentR = newR;

    return {
      roundNum: index + 1,
      lPrev,
      rPrev,
      subkey,
      expanded,
      xorWithKey,
      sboxGroups,
      sboxOutput,
      afterP,
      newR,
      newL,
    };
  });

  const preOutputL = currentL;
  const preOutputR = currentR;
  const combined = [...preOutputR, ...preOutputL];
  const ciphertext = permute(combined, FP);
  const ciphertextHex = bitsToHex(ciphertext);

  return {
    input: {
      plaintext64,
      key64,
      plaintextSource: plaintextInput.display,
      keySource: keyInput.display,
      plaintextMode: plaintextInput.mode,
      keyMode: keyInput.mode,
      plaintextNormalized: plaintextInput.normalized,
      keyNormalized: keyInput.normalized,
    },
    keyGen: {
      key64,
      afterPC1,
      c0,
      d0,
      rounds: keyRounds,
      allSubkeys,
    },
    encryption: {
      plaintext64,
      afterIP,
      l0,
      r0,
      rounds: encryptionRounds,
      preOutputL,
      preOutputR,
      combined,
      ciphertext,
      ciphertextHex,
    },
  };
}
