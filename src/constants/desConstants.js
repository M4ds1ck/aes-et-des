/*
 * AUDIT LOG — desConstants.js
 * [OK] Constant definitions validated.
 */
export const PHASE = {
  INPUT: 'input',
  KEY_GENERATION: 'key_generation',
  ENCRYPTION: 'encryption',
  RESULT: 'result',
};

export const KEY_GEN_STEPS = {
  INITIAL_KEY_64: 'initial_key_64',
  PC1_PERMUTATION: 'pc1_permutation',
  CD_SPLIT: 'cd_split',
  BIT_SHIFT: 'bit_shift',
  PC2_PERMUTATION: 'pc2_permutation',
  SUBKEYS_SUMMARY: 'subkeys_summary',
};

export const ENCRYPTION_STEPS = {
  PLAINTEXT_64: 'plaintext_64',
  IP_PERMUTATION: 'ip_permutation',
  LR_SPLIT: 'lr_split',
  ROUND_START: 'round_start',
  EXPANSION_E: 'expansion_e',
  XOR_KEY: 'xor_key',
  SBOX_SUBSTITUTION: 'sbox_substitution',
  PBOX_PERMUTATION: 'pbox_permutation',
  XOR_LEFT: 'xor_left',
  SWAP_LR: 'swap_lr',
  FINAL_PERMUTATION: 'final_permutation',
};
