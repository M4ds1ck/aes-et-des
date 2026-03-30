// BUG FIX: Corrected step labels and removed malformed round labels.
/*
 * AUDIT LOG — stepBuilder.js
 * [BUG] Subkey summary label typo (K116) -> FIXED.
 * [WARN] DES visualization shows only round 1 in detail -> NOTED.
 */
import { E, FP, IP, P, PC1, PC2, SBOXES, SHIFT_SCHEDULE } from '../constants/permutationTables.js';

export function buildSteps(desResult) {
  const steps = [];
  const firstRound = desResult.keyGen.rounds[0];
  const secondRound = desResult.keyGen.rounds[1];
  const firstEncryptionRound = desResult.encryption.rounds[0];

  steps.push({
    id: 'key-input',
    phase: 'keyGen',
    title: '64-bit Key Input',
    subtitle: 'Your key padded to exactly 64 bits (8 bytes)',
    explanation:
      'DES requires a 64-bit (8-byte) key. Your input is converted to binary using ASCII encoding or taken directly as a 16-hex-digit block. Every text character becomes 8 bits. Bits 8, 16, 24, 32, 40, 48, 56, and 64 are parity bits and are discarded by PC-1.',
    data: { bits: desResult.input.key64, highlight: [7, 15, 23, 31, 39, 47, 55, 63] },
  });

  steps.push({
    id: 'pc1',
    phase: 'keyGen',
    title: 'PC-1 Permutation',
    subtitle: '64 bits -> 56 bits (parity bits removed)',
    explanation:
      'PC-1 reorders the full 64-bit key and drops the eight parity bits, leaving a 56-bit working key. That 56-bit output becomes the raw material for all sixteen DES round subkeys.',
    data: {
      inputBits: desResult.input.key64,
      outputBits: desResult.keyGen.afterPC1,
      table: PC1,
    },
  });

  steps.push({
    id: 'cd-split',
    phase: 'keyGen',
    title: 'Split into C0 and D0',
    subtitle: '56 bits split into two 28-bit halves',
    explanation:
      'The 56-bit key schedule state is split down the middle. The left half becomes C0 and the right half becomes D0. Every round rotates both halves before compressing them into a 48-bit subkey.',
    data: {
      full56: desResult.keyGen.afterPC1,
      c0: desResult.keyGen.c0,
      d0: desResult.keyGen.d0,
    },
  });

  steps.push({
    id: 'shift-round-1',
    phase: 'keyGen',
    title: 'Round 1 Shift: C1 and D1',
    subtitle: 'Build the first rotated key halves',
    explanation:
      'DES round 1 rotates both halves by 1 bit. This is the first visible key-schedule transformation and produces C1 and D1 from C0 and D0.',
    data: {
      roundNum: firstRound.roundNum,
      shiftAmount: firstRound.shiftAmount,
      cPrev: firstRound.cPrev,
      dPrev: firstRound.dPrev,
      cAfter: firstRound.cAfterShift,
      dAfter: firstRound.dAfterShift,
      shiftSchedule: SHIFT_SCHEDULE,
      currentRoundIndex: 0,
    },
  });

  steps.push({
    id: 'shift-round-2',
    phase: 'keyGen',
    title: 'Round 2 Shift: C2 and D2',
    subtitle: 'Second rotation before key compression',
    explanation:
      'Round 2 also rotates by 1 bit. After this, the same pattern continues in the background for later rounds using the DES shift schedule.',
    data: {
      roundNum: secondRound.roundNum,
      shiftAmount: secondRound.shiftAmount,
      cPrev: secondRound.cPrev,
      dPrev: secondRound.dPrev,
      cAfter: secondRound.cAfterShift,
      dAfter: secondRound.dAfterShift,
      shiftSchedule: SHIFT_SCHEDULE,
      currentRoundIndex: 1,
    },
  });

  steps.push({
    id: 'cd-rounds-summary',
    phase: 'keyGen',
    title: 'All Cn and Dn States',
    subtitle: 'Background key-schedule rounds summarized',
    explanation:
      'After showing C1D1 and C2D2 in detail, the remaining rotations continue in the background. This table lists the resulting Cn and Dn states for all 16 rounds.',
    data: {
      rounds: desResult.keyGen.rounds.map((round) => ({
        roundNum: round.roundNum,
        shiftAmount: round.shiftAmount,
        cBits: round.cAfterShift,
        dBits: round.dAfterShift,
      })),
    },
  });

  steps.push({
    id: 'pc2-round-1',
    phase: 'keyGen',
    title: 'Round 1 PC-2 to Make K1',
    subtitle: 'Compress C1D1 from 56 bits to 48 bits',
    explanation:
      'PC-2 selects and reorders 48 positions from C1D1 to produce the first round subkey K1.',
    data: {
      roundNum: firstRound.roundNum,
      cdCombined: firstRound.cdCombined,
      subkey: firstRound.subkey,
      table: PC2,
    },
  });

  steps.push({
    id: 'pc2-round-2',
    phase: 'keyGen',
    title: 'Round 2 PC-2 to Make K2',
    subtitle: 'Compress C2D2 from 56 bits to 48 bits',
    explanation:
      'The same PC-2 compression is applied to C2D2 to produce K2. The later subkeys are generated the same way in the background.',
    data: {
      roundNum: secondRound.roundNum,
      cdCombined: secondRound.cdCombined,
      subkey: secondRound.subkey,
      table: PC2,
    },
  });

  steps.push({
    id: 'subkeys-summary',
    phase: 'keyGen',
    title: 'All 16 Subkeys Generated',
    subtitle: 'K1 through K16 ready for encryption rounds',
    explanation:
      'DES now has its full round-key schedule. Each round subkey is 48 bits. Encryption uses them in ascending order; decryption uses the exact same keys in reverse.',
    data: { subkeys: desResult.keyGen.allSubkeys },
  });

  steps.push({
    id: 'plaintext-input',
    phase: 'encryption',
    title: 'Plaintext Input (64 bits)',
    subtitle: 'Your message represented as one 64-bit DES block',
    explanation: `The plaintext source "${desResult.input.plaintextSource}" is encoded as a single 64-bit block. Text input is ASCII padded with null bytes if needed. A full 16-digit hex block is used directly.`,
    data: { bits: desResult.encryption.plaintext64 },
  });

  steps.push({
    id: 'ip',
    phase: 'encryption',
    title: 'Initial Permutation (IP)',
    subtitle: '64 bits -> 64 bits (reordered)',
    explanation:
      'DES starts by permuting the plaintext with the fixed Initial Permutation table. This rearranges bit positions only; it does not change the number of bits.',
    data: {
      inputBits: desResult.encryption.plaintext64,
      outputBits: desResult.encryption.afterIP,
      table: IP,
    },
  });

  steps.push({
    id: 'lr-split',
    phase: 'encryption',
    title: 'Split into L0 and R0',
    subtitle: '64 bits -> two 32-bit halves',
    explanation:
      'The permuted block is split into two equal halves. L0 is the left 32 bits and R0 is the right 32 bits. These feed into the 16-round Feistel structure.',
    data: {
      full64: desResult.encryption.afterIP,
      l0: desResult.encryption.l0,
      r0: desResult.encryption.r0,
    },
  });

  steps.push({
    id: 'round-1-expansion',
    phase: 'encryption',
    title: 'Round 1: Expansion E',
    subtitle: 'Expand R0 from 32 bits to 48 bits',
    explanation:
      'The first round is shown in detail. DES expands R0 to 48 bits so it can be mixed with K1.',
    data: {
      roundNum: 1,
      inputBits: desResult.encryption.r0,
      outputBits: firstEncryptionRound.expanded,
      table: E,
      subkey: firstEncryptionRound.subkey,
    },
  });

  steps.push({
    id: 'round-1-xor-key',
    phase: 'encryption',
    title: 'Round 1: XOR with K1',
    subtitle: 'Mix the expanded right half with the first subkey',
    explanation:
      'The expanded R0 bits are XORed with K1. This produces the 48-bit value that enters the S-boxes.',
    data: {
      roundNum: 1,
      a: firstEncryptionRound.expanded,
      b: firstEncryptionRound.subkey,
      result: firstEncryptionRound.xorWithKey,
      subkeyLabel: 'K1',
    },
  });

  steps.push({
    id: 'round-1-sbox',
    phase: 'encryption',
    title: 'Round 1: S-Box Substitution',
    subtitle: 'Shrink 48 bits back to 32 bits',
    explanation:
      'The eight S-boxes are the core nonlinear part of DES. They transform the 48-bit XOR result into a new 32-bit block.',
    data: {
      roundNum: 1,
      inputBits: firstEncryptionRound.xorWithKey,
      sboxGroups: firstEncryptionRound.sboxGroups,
      outputBits: firstEncryptionRound.sboxOutput,
      sboxTables: SBOXES,
    },
  });

  steps.push({
    id: 'round-1-pbox',
    phase: 'encryption',
    title: 'Round 1: P-Box Permutation',
    subtitle: 'Diffuse the S-box output before the Feistel XOR',
    explanation:
      'The 32-bit S-box output is permuted through P. This spreads bit influence before it is XORed with L0.',
    data: {
      roundNum: 1,
      inputBits: firstEncryptionRound.sboxOutput,
      outputBits: firstEncryptionRound.afterP,
      table: P,
    },
  });

  steps.push({
    id: 'round-1-xor-left',
    phase: 'encryption',
    title: 'Round 1: XOR with L0',
    subtitle: 'Create the new right half R1',
    explanation:
      'The Feistel function output is XORed with L0 to make R1. This is the last arithmetic step of round 1.',
    data: {
      roundNum: 1,
      a: firstEncryptionRound.afterP,
      b: desResult.encryption.l0,
      result: firstEncryptionRound.newR,
      aLabel: 'f(R0, K1)',
      bLabel: 'L0',
      resultLabel: 'R1',
    },
  });

  steps.push({
    id: 'round-1-result',
    phase: 'encryption',
    title: 'Round 1 Result: L1 and R1',
    subtitle: 'Finish the first Feistel round in detail',
    explanation:
      'Round 1 completes with L1 = R0 and the new R1 from the XOR step. The remaining rounds continue with the same pattern in the background.',
    data: {
      roundNum: 1,
      newL: firstEncryptionRound.newL,
      newR: firstEncryptionRound.newR,
      prevL: desResult.encryption.l0,
      prevR: desResult.encryption.r0,
      subkey: firstEncryptionRound.subkey,
      afterP: firstEncryptionRound.afterP,
      isLastRound: false,
    },
  });

  steps.push({
    id: 'lr-rounds-summary',
    phase: 'encryption',
    title: 'All L and R States Through Round 16',
    subtitle: 'Background Feistel rounds summarized',
    explanation:
      'After showing round 1 in detail, the remaining Feistel rounds run in the background using the same sequence of expansion, XOR, substitution, permutation, and swap. This table lists the resulting Ln and Rn pairs through round 16.',
    data: {
      rounds: desResult.encryption.rounds.map((round) => ({
        roundNum: round.roundNum,
        lBits: round.newL,
        rBits: round.newR,
      })),
    },
  });

  steps.push({
    id: 'preoutput-swap',
    phase: 'encryption',
    title: 'Swap L16 and R16 Before Output',
    subtitle: 'DES places R16 before L16 before the final permutation',
    explanation:
      'DES does not send L16R16 directly into the final permutation. It first swaps the halves to form R16L16, and only then applies the inverse permutation.',
    data: {
      l16: desResult.encryption.preOutputL,
      r16: desResult.encryption.preOutputR,
      combined: desResult.encryption.combined,
    },
  });

  steps.push({
    id: 'fp',
    phase: 'encryption',
    title: 'Final Permutation (IP^-1)',
    subtitle: 'R16L16 -> 64-bit ciphertext',
    explanation:
      'DES finishes by swapping the halves one last time and applying the inverse initial permutation. The final 64-bit block is the ciphertext.',
    data: {
      inputBits: desResult.encryption.combined,
      outputBits: desResult.encryption.ciphertext,
      table: FP,
      ciphertextHex: desResult.encryption.ciphertextHex,
    },
  });

  return steps;
}






