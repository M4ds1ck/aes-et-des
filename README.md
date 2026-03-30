# DES Visualizer

Interactive DES encryption simulator built with React 18, Vite 5, Tailwind CSS v3, and Framer Motion.

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Keyboard Shortcuts

- `Enter`: start the simulation from the input screen
- `Left Arrow`: previous step
- `Right Arrow`: next step

## What It Shows

- 64-bit plaintext and key preparation
- PC-1, C/D split, per-round shifts, and PC-2 subkey generation
- Initial permutation, L/R split, and all 16 Feistel rounds
- Expansion, XOR, S-box row/column lookup, P permutation, and round swap
- Final permutation with ciphertext in binary, hex, and base64

## DES Overview

DES is a 64-bit block cipher with a 56-bit effective key. It starts with an initial permutation, runs 16 Feistel rounds, swaps the final halves, and applies the inverse permutation. Each round uses a 48-bit subkey derived from the original key through PC-1, left rotations, and PC-2. The non-linear S-box stage is the core source of confusion in the cipher, while the permutations and repeated mixing create diffusion across the block.
