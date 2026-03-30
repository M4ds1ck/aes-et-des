/*
 * AUDIT LOG — aesStepBuilder.js
 * [BUG] AES steps assumed 10 rounds and 128-bit keys only -> FIXED (dynamic rounds/key sizes).
 */
function matrixToHexRows(state) {
  return state.map((row) => row.map((value) => value.toString(16).toUpperCase().padStart(2, '0')));
}

export function buildAESsteps(aesResult) {
  const round1 = aesResult.encryption.rounds[0];
  const round2 = aesResult.encryption.rounds[1];
  const totalRounds = aesResult.encryption.rounds.length;
  const finalRound = aesResult.encryption.rounds[totalRounds - 1];

  return [
    {
      id: 'aes-plaintext',
      phase: 'aes',
      title: 'AES Plaintext Block',
      subtitle: 'Input is prepared as one 128-bit state',
      explanation:
        'AES operates on 16-byte blocks. Your input is normalized to 128 bits, then arranged as a 4x4 byte state matrix in column-major order.',
      focus: 'input',
      data: {
        bytes: aesResult.input.plaintextBytes,
        bits: aesResult.input.plaintext128,
        source: aesResult.input.plaintextSource,
      },
    },
    {
      id: 'aes-key',
      phase: 'aes',
      title: 'AES Key Input',
      subtitle: `The selected key is normalized to ${aesResult.input.keyBytes.length * 8} bits`,
      explanation:
        'AES keys can be 128, 192, or 256 bits. The selected key is expanded into the full round-key schedule.',
      focus: 'keyInput',
      data: {
        bytes: aesResult.input.keyBytes,
        bits: aesResult.input.keyBits,
        source: aesResult.input.keySource,
      },
    },
    {
      id: 'aes-key-expansion',
      phase: 'aes',
      title: 'Key Expansion',
      subtitle: 'Round keys are derived from the original key bytes',
      explanation:
        'AES key expansion uses RotWord, SubWord, and Rcon to derive round keys. Here we show round keys 0, 1, and 2 explicitly, and list the rest in compact form.',
      focus: 'keyExpansion',
      data: {
        roundKeys: aesResult.keyExpansion.roundKeys,
      },
    },
    {
      id: 'aes-round0',
      phase: 'aes',
      title: 'Initial Transformation',
      subtitle: 'Round 0 is AddRoundKey only',
      explanation:
        'Before the numbered rounds begin, AES XORs the input state with round key 0. This creates the working state for round 1.',
      focus: 'round0',
      data: {
        inputState: aesResult.encryption.inputState,
        roundKey: aesResult.encryption.round0Key,
        outputState: aesResult.encryption.stateAfterRound0,
      },
    },
    {
      id: 'aes-round1',
      phase: 'aes',
      title: 'Round 1 In Detail',
      subtitle: 'SubBytes, ShiftRows, MixColumns, AddRoundKey',
      explanation:
        'Round 1 shows the complete AES round structure. Each byte is substituted, rows are shifted, columns are mixed, and the result is combined with round key 1.',
      focus: 'round1',
      data: {
        roundNum: 1,
        startState: round1.startState,
        subBytes: round1.subBytes,
        shiftRows: round1.shiftRows,
        mixColumns: round1.mixColumns,
        roundKey: round1.roundKey,
        outputState: round1.outputState,
      },
    },
    {
      id: 'aes-round2',
      phase: 'aes',
      title: 'Round 2 In Detail',
      subtitle: 'The second full AES round',
      explanation:
        'Round 2 repeats the same four transformations with a new round key. After this point, the same pattern continues in the background.',
      focus: 'round2',
      data: {
        roundNum: 2,
        startState: round2.startState,
        subBytes: round2.subBytes,
        shiftRows: round2.shiftRows,
        mixColumns: round2.mixColumns,
        roundKey: round2.roundKey,
        outputState: round2.outputState,
      },
    },
    {
      id: 'aes-rounds-summary',
      phase: 'aes',
      title: 'Background Rounds Summary',
      subtitle: `Rounds 3 through ${Math.max(totalRounds - 1, 3)} continue off-screen`,
      explanation:
        'To keep the map compact, later rounds are summarized here. They follow the same AES round pattern as rounds 1 and 2.',
      focus: 'roundsSummary',
      data: {
        rounds: aesResult.encryption.rounds.slice(2, Math.max(totalRounds - 1, 3)).map((round) => ({
          roundNum: round.roundNum,
          outputState: round.outputState,
        })),
      },
    },
    {
      id: 'aes-final-round',
      phase: 'aes',
      title: 'Final AES Round',
      subtitle: `Round ${totalRounds} omits MixColumns`,
      explanation:
        'The last AES round performs SubBytes, ShiftRows, and AddRoundKey, but MixColumns is skipped. This produces the final state.',
      focus: 'finalRound',
      data: {
        roundNum: totalRounds,
        startState: finalRound.startState,
        subBytes: finalRound.subBytes,
        shiftRows: finalRound.shiftRows,
        roundKey: finalRound.roundKey,
        outputState: finalRound.outputState,
      },
    },
    {
      id: 'aes-result',
      phase: 'aes',
      title: 'AES Ciphertext',
      subtitle: 'The final 128-bit state is emitted as ciphertext',
      explanation:
        'Once the last round key is applied, the state is serialized back into a 16-byte ciphertext block.',
      focus: 'ciphertext',
      data: {
        ciphertextBits: aesResult.encryption.ciphertextBits,
        ciphertextBytes: aesResult.encryption.ciphertextBytes,
        ciphertextHex: aesResult.encryption.ciphertextHex,
        state: finalRound.outputState,
      },
    },
  ].map((step) => ({
    ...step,
    data: {
      ...step.data,
      matrixRows: step.data?.outputState ? matrixToHexRows(step.data.outputState) : undefined,
    },
  }));
}
