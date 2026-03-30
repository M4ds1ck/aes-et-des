/*
 * AUDIT LOG — permutations.js
 * [OK] Table helpers verified.
 */
import { E, FP, IP, P, PC1, PC2 } from '../constants/permutationTables.js';

export const PARITY_BIT_POSITIONS = [8, 16, 24, 32, 40, 48, 56, 64];
export const PC2_DROPPED_POSITIONS = [9, 18, 22, 25, 35, 38, 43, 54];

export function inferColumns(length) {
  if (length === 64) return 8;
  if (length === 56) return 7;
  if (length === 48) return 6;
  if (length === 32) return 8;
  return 8;
}

export const TABLE_MAP = {
  IP,
  FP,
  PC1,
  PC2,
  E,
  P,
};
