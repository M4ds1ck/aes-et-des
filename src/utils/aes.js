/*
 * AUDIT LOG — aes.js
 * [BUG] Key expansion only supported AES-128, causing incorrect output for 192/256-bit keys -> FIXED (generalized Nk/Nr).
 * [BUG] Decrypt/encrypt helpers ignored key size -> FIXED.
 * [BUG] ASCII normalization used malformed display glyphs and padded silently without validation -> FIXED.
 * [WARN] PKCS#7 padding for exact-block plaintext is not applied to avoid multi-block expansion -> NOTED.
 */
import {
  bitsToHex,
  bitsToInt,
  hexToBitsWithLength,
  intToBits,
  isLikelyHexBlockOfLength,
  padStringToNBytes,
  stringToBitsWithLength,
  xorBits,
} from './binary.js';

export const AES_SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

const RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d];
const AES_INV_SBOX = (() => {
  const inv = Array(256).fill(0);
  AES_SBOX.forEach((value, index) => {
    inv[value] = index;
  });
  return inv;
})();

function bitsToBytes(bits) {
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    bytes.push(bitsToInt(bits.slice(i, i + 8)));
  }
  return bytes;
}

function bytesToBits(bytes) {
  return bytes.flatMap((value) => intToBits(value, 8));
}

function bytesToState(bytes) {
  const state = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 4; row += 1) {
      state[row][col] = bytes[col * 4 + row];
    }
  }
  return state;
}

function stateToBytes(state) {
  const bytes = [];
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 4; row += 1) {
      bytes.push(state[row][col]);
    }
  }
  return bytes;
}

function cloneState(state) {
  return state.map((row) => [...row]);
}

function gfMul(a, b) {
  let result = 0;
  let multiplicand = a;
  let multiplier = b;

  for (let i = 0; i < 8; i += 1) {
    if (multiplier & 1) result ^= multiplicand;
    const highBit = multiplicand & 0x80;
    multiplicand = (multiplicand << 1) & 0xff;
    if (highBit) multiplicand ^= 0x1b;
    multiplier >>= 1;
  }

  return result;
}

function subBytesState(state) {
  return state.map((row) => row.map((value) => AES_SBOX[value]));
}

function invSubBytesState(state) {
  return state.map((row) => row.map((value) => AES_INV_SBOX[value]));
}

function shiftRowsState(state) {
  return state.map((row, rowIndex) => row.map((_, colIndex) => row[(colIndex + rowIndex) % 4]));
}

function invShiftRowsState(state) {
  return state.map((row, rowIndex) => row.map((_, colIndex) => row[(colIndex - rowIndex + 4) % 4]));
}

function mixColumnsState(state) {
  const mixed = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let col = 0; col < 4; col += 1) {
    const [s0, s1, s2, s3] = [state[0][col], state[1][col], state[2][col], state[3][col]];
    mixed[0][col] = gfMul(s0, 2) ^ gfMul(s1, 3) ^ s2 ^ s3;
    mixed[1][col] = s0 ^ gfMul(s1, 2) ^ gfMul(s2, 3) ^ s3;
    mixed[2][col] = s0 ^ s1 ^ gfMul(s2, 2) ^ gfMul(s3, 3);
    mixed[3][col] = gfMul(s0, 3) ^ s1 ^ s2 ^ gfMul(s3, 2);
  }
  return mixed;
}

function invMixColumnsState(state) {
  const mixed = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let col = 0; col < 4; col += 1) {
    const [s0, s1, s2, s3] = [state[0][col], state[1][col], state[2][col], state[3][col]];
    mixed[0][col] = gfMul(s0, 14) ^ gfMul(s1, 11) ^ gfMul(s2, 13) ^ gfMul(s3, 9);
    mixed[1][col] = gfMul(s0, 9) ^ gfMul(s1, 14) ^ gfMul(s2, 11) ^ gfMul(s3, 13);
    mixed[2][col] = gfMul(s0, 13) ^ gfMul(s1, 9) ^ gfMul(s2, 14) ^ gfMul(s3, 11);
    mixed[3][col] = gfMul(s0, 11) ^ gfMul(s1, 13) ^ gfMul(s2, 9) ^ gfMul(s3, 14);
  }
  return mixed;
}

function addRoundKeyState(state, roundKeyBytes) {
  const stateBytes = stateToBytes(state);
  const xorResult = xorBits(bytesToBits(stateBytes), bytesToBits(roundKeyBytes));
  return bytesToState(bitsToBytes(xorResult));
}

function subWord(word) {
  return word.map((value) => AES_SBOX[value]);
}

function rotWord(word) {
  return [...word.slice(1), word[0]];
}

function xorWords(a, b) {
  return a.map((value, index) => value ^ b[index]);
}

function expandKey(keyBytes) {
  const keySize = keyBytes.length;
  const nk = keySize / 4;
  const nr = nk + 6;
  const words = [];

  for (let i = 0; i < nk; i += 1) {
    words.push(keyBytes.slice(i * 4, i * 4 + 4));
  }

  const totalWords = 4 * (nr + 1);
  for (let i = nk; i < totalWords; i += 1) {
    let temp = [...words[i - 1]];
    if (i % nk === 0) {
      temp = subWord(rotWord(temp));
      temp[0] ^= RCON[(i / nk) - 1];
    } else if (nk > 6 && i % nk === 4) {
      temp = subWord(temp);
    }
    words.push(xorWords(words[i - nk], temp));
  }

  const roundKeys = [];
  for (let round = 0; round <= nr; round += 1) {
    roundKeys.push(words.slice(round * 4, round * 4 + 4).flat());
  }

  return { words, roundKeys, nk, nr };
}

function normalizeAESInput(input, label) {
  const trimmed = (input || '').trim();
  if (isLikelyHexBlockOfLength(trimmed, 32)) {
    const bits = hexToBitsWithLength(trimmed, 32);
    return {
      bits,
      bytes: bitsToBytes(bits),
      mode: 'hex',
      display: trimmed.toUpperCase(),
      normalized: trimmed.toUpperCase(),
      label,
    };
  }

  const normalized = padStringToNBytes(input || '', 16);
  const bits = stringToBitsWithLength(input || '', 16);
  return {
    bits,
    bytes: bitsToBytes(bits),
    mode: 'ascii',
    display: normalized.replace(/\0/g, '.'),
    normalized,
    label,
  };
}

function describeColumns(state) {
  return Array.from({ length: 4 }, (_, col) => state.map((row) => row[col]));
}

function normalizeAESKey(input) {
  const trimmed = (input || '').trim();
  if (isLikelyHexBlockOfLength(trimmed, 32) || isLikelyHexBlockOfLength(trimmed, 48) || isLikelyHexBlockOfLength(trimmed, 64)) {
    const hexLength = trimmed.length;
    const bits = hexToBitsWithLength(trimmed, hexLength);
    const bytes = bitsToBytes(bits);
    return {
      bits,
      bytes,
      mode: 'hex',
      display: trimmed.toUpperCase(),
      normalized: trimmed.toUpperCase(),
      size: bytes.length,
    };
  }

  const ascii = input || '';
  if (![16, 24, 32].includes(ascii.length)) {
    throw new Error('AES key must be 16, 24, or 32 bytes (or 32/48/64 hex characters).');
  }
  const normalized = padStringToNBytes(ascii, ascii.length);
  const bits = stringToBitsWithLength(ascii, ascii.length);
  const bytes = bitsToBytes(bits);
  return {
    bits,
    bytes,
    mode: 'ascii',
    display: normalized.replace(/\0/g, '.'),
    normalized,
    size: bytes.length,
  };
}

function applyPkcs7Padding(bytes, blockSize) {
  const padLength = blockSize - (bytes.length % blockSize);
  if (padLength === blockSize) return bytes;
  return [...bytes, ...Array.from({ length: padLength }, () => padLength)];
}

function stripPkcs7Padding(bytes) {
  if (!bytes.length) return bytes;
  const padLength = bytes[bytes.length - 1];
  if (padLength < 1 || padLength > 16) return bytes;
  const tail = bytes.slice(-padLength);
  if (!tail.every((value) => value === padLength)) return bytes;
  return bytes.slice(0, -padLength);
}

export function runAES(plaintextStr, keyStr) {
  const plaintextInput = normalizeAESInput(plaintextStr, 'plaintext');
  const keyInput = normalizeAESKey(keyStr);
  const { words, roundKeys, nr } = expandKey(keyInput.bytes);

  const initialState = bytesToState(plaintextInput.bytes);
  const round0State = addRoundKeyState(initialState, roundKeys[0]);

  const rounds = [];
  let currentState = round0State;
  for (let round = 1; round <= nr; round += 1) {
    const startState = cloneState(currentState);
    const subBytes = subBytesState(startState);
    const shiftRows = shiftRowsState(subBytes);
    const mixColumns = round === nr ? null : mixColumnsState(shiftRows);
    const beforeKey = mixColumns || shiftRows;
    const afterAddRoundKey = addRoundKeyState(beforeKey, roundKeys[round]);
    currentState = afterAddRoundKey;

    rounds.push({
      roundNum: round,
      startState,
      subBytes,
      shiftRows,
      mixColumns,
      roundKey: roundKeys[round],
      outputState: afterAddRoundKey,
      roundKeyColumns: describeColumns(bytesToState(roundKeys[round])),
    });
  }

  const ciphertextBytes = stateToBytes(currentState);
  const ciphertextBits = bytesToBits(ciphertextBytes);

  return {
    algorithm: `AES-${keyInput.size * 8}`,
    input: {
      plaintext128: plaintextInput.bits,
      keyBits: keyInput.bits,
      plaintextBytes: plaintextInput.bytes,
      keyBytes: keyInput.bytes,
      plaintextSource: plaintextInput.display,
      keySource: keyInput.display,
      plaintextMode: plaintextInput.mode,
      keyMode: keyInput.mode,
    },
    keyExpansion: {
      originalKey: keyInput.bytes,
      words,
      roundKeys,
      roundKeyBits: roundKeys.map((bytes) => bytesToBits(bytes)),
      rounds: nr,
    },
    encryption: {
      inputState: initialState,
      round0Key: roundKeys[0],
      stateAfterRound0: round0State,
      rounds,
      ciphertextBytes,
      ciphertextBits,
      ciphertextHex: bitsToHex(ciphertextBits),
    },
  };
}

// BUG FIX: Add AES decrypt helper for practice mode, using inverse round transformations.
export function encryptAESBlock(plaintextStr, keyStr) {
  const keyInput = normalizeAESKey(keyStr);
  const { roundKeys, nr } = expandKey(keyInput.bytes);
  const input = normalizeAESInput(plaintextStr, 'plaintext');
  const paddedBytes = input.mode === 'ascii' ? applyPkcs7Padding(input.bytes, 16) : input.bytes;
  const plaintextBytes = paddedBytes.slice(0, 16);

  let state = bytesToState(plaintextBytes);
  state = addRoundKeyState(state, roundKeys[0]);

  for (let round = 1; round <= nr; round += 1) {
    state = subBytesState(state);
    state = shiftRowsState(state);
    if (round !== nr) {
      state = mixColumnsState(state);
    }
    state = addRoundKeyState(state, roundKeys[round]);
  }

  const ciphertextBytes = stateToBytes(state);
  const ciphertextBits = bytesToBits(ciphertextBytes);
  return {
    bits: ciphertextBits,
    hex: bitsToHex(ciphertextBits),
  };
}

export function decryptAESBlock(ciphertextStr, keyStr) {
  const cipherInput = normalizeAESInput(ciphertextStr, 'ciphertext');
  const keyInput = normalizeAESKey(keyStr);
  const { roundKeys, nr } = expandKey(keyInput.bytes);

  let state = bytesToState(cipherInput.bytes);
  state = addRoundKeyState(state, roundKeys[nr]);

  for (let round = nr - 1; round >= 1; round -= 1) {
    state = invShiftRowsState(state);
    state = invSubBytesState(state);
    state = addRoundKeyState(state, roundKeys[round]);
    state = invMixColumnsState(state);
  }

  state = invShiftRowsState(state);
  state = invSubBytesState(state);
  state = addRoundKeyState(state, roundKeys[0]);

  const plaintextBytes = stripPkcs7Padding(stateToBytes(state));
  const plaintextBits = bytesToBits(plaintextBytes);

  return {
    bits: plaintextBits,
    hex: bitsToHex(plaintextBits),
    ascii: plaintextBytes.map((byte) => (byte === 0 ? '.' : String.fromCharCode(byte))).join(''),
  };
}
