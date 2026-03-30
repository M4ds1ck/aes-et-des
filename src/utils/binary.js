/*
 * AUDIT LOG — binary.js
 * [WARN] normalizeHex trims/pads to fixed length; caller must validate length -> NOTED.
 */
export function normalizeHex(hex, length = 16) {
  return (hex || '')
    .replace(/^0x/i, '')
    .replace(/[^0-9a-f]/gi, '')
    .toUpperCase()
    .slice(0, length)
    .padEnd(length, '0');
}

export function padStringToNBytes(str, length) {
  return (str || '').slice(0, length).padEnd(length, '\0');
}

export function padStringTo8Bytes(str) {
  return padStringToNBytes(str, 8);
}

export function padStringTo16Bytes(str) {
  return padStringToNBytes(str, 16);
}

export function stringToBitsWithLength(str, byteLength) {
  const padded = padStringToNBytes(str, byteLength);
  return [...padded].flatMap((char) => intToBits(char.charCodeAt(0) & 0xff, 8));
}

export function stringToBits(str) {
  return stringToBitsWithLength(str, 8);
}

export function bitsToHex(bits) {
  return splitBits(bits, 4)
    .map((chunk) => bitsToInt(chunk).toString(16).toUpperCase())
    .join('');
}

export function hexToBitsWithLength(hex, hexLength) {
  return [...normalizeHex(hex, hexLength)].flatMap((char) => intToBits(parseInt(char, 16), 4));
}

export function hexToBits(hex) {
  return hexToBitsWithLength(hex, 16);
}

export function permute(bits, table) {
  return table.map((position) => bits[position - 1]);
}

export function leftRotate(bits, n) {
  const offset = n % bits.length;
  return [...bits.slice(offset), ...bits.slice(0, offset)];
}

export function xorBits(a, b) {
  if (a.length !== b.length) {
    throw new Error('Bit arrays must be the same length for XOR.');
  }
  return a.map((bit, index) => bit ^ b[index]);
}

export function splitBits(bits, n) {
  const chunks = [];
  for (let i = 0; i < bits.length; i += n) {
    chunks.push(bits.slice(i, i + n));
  }
  return chunks;
}

export function bitsToInt(bits) {
  return bits.reduce((value, bit) => (value << 1) | bit, 0);
}

export function intToBits(n, length) {
  return Array.from({ length }, (_, index) => (n >> (length - index - 1)) & 1);
}

export function bitsToString(bits) {
  return splitBits(bits, 8).map((chunk) => chunk.join('')).join(' ');
}

export function bitsToBytes(bits) {
  return splitBits(bits, 8).map((chunk) => bitsToInt(chunk));
}

export function bitsToAscii(bits) {
  return bitsToBytes(bits)
    .map((byte) => (byte === 0 ? '.' : String.fromCharCode(byte)))
    .join('');
}

export function isLikelyHexBlock(value) {
  return /^[0-9a-fA-F]{16}$/.test((value || '').trim());
}

export function isLikelyHexBlockOfLength(value, hexLength) {
  const pattern = new RegExp(`^[0-9a-fA-F]{${hexLength}}$`);
  return pattern.test((value || '').trim());
}

