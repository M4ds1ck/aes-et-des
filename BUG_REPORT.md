# Bug Report & Patch Summary

## Critical Bugs Fixed
| # | Location | Description | Fix Applied |
|---|----------|-------------|-------------|
| 1 | `src/utils/aes.js` | AES key schedule only supported 128-bit keys | Generalized to AES-128/192/256 (`Nk`, `Nr`, expanded RCON) |
| 2 | `src/utils/aes.js` | Decrypt/encrypt helpers ignored key size | Implemented key-size-aware encrypt/decrypt paths |
| 3 | `src/pages/Practice/PracticePage.jsx` | Missing key/ciphertext validation for DES/AES | Added strict length + format validation |
| 4 | `src/App.jsx` | Keyboard navigation referenced removed state | Fixed listener guard |
| 5 | `src/pages/Learn/LearnPage.jsx` | Live trace presets overwritten by empty defaults | Apply initialTrace only when enabled |

## Logic Issues Fixed
| # | Location | Description | Fix Applied |
|---|----------|-------------|-------------|
| 1 | `src/utils/stepBuilder.js` | Subkey summary label typo (`K116`) | Corrected to `K16` |
| 2 | `src/utils/cryptoPractice.js` | AES decrypt ignored ASCII stripping | Used decrypt helper `ascii` when available |
| 3 | `src/pages/Learn/SlideDeck.jsx` | Slide nav could be spammed during transitions | Locked navigation until animation completes |
| 4 | `src/pages/Learn/SlideDeck.jsx` | Index out of range when switching algorithms | Clamped index to available slides |
| 5 | `src/pages/Learn/usePlayback.js` | Play stayed active on single-phase visuals | Auto-stop when phases <= 1 |

## UI/UX Fixes
| # | Location | Description | Fix Applied |
|---|----------|-------------|-------------|
| 1 | `src/pages/Practice/PracticePage.jsx` | Copy action gave no feedback | Added "Copied!" confirmation |
| 2 | `src/styles/practice.css` | Missing style for Learn jump button | Added `.practice-info` styling |
| 3 | `src/pages/Learn/PipelineMap.jsx` | Map was forced closed | Made the map toggleable |
| 4 | `src/pages/Learn/*Visuals.jsx` | Non-ASCII arrows/emoji rendered as garbled text | Replaced with ASCII labels |
| 5 | `src/pages/Learn/LearnVisualFrame.jsx` | Control icons rendered inconsistently | Replaced with ASCII labels |

## Warnings / Non-Critical Notes
- AES test vector in the prompt appears incorrect. Verified against Node `crypto` (AES-128 ECB) and FIPS-197 standard vector:
  - Expected ciphertext for key `000102030405060708090A0B0C0D0E0F` and plaintext `00112233445566778899AABBCCDDEEFF` is `69C4E0D86A7B0430D8CDB78070B4C55A`.
- Practice mode processes single-block inputs only; PKCS#7 padding is applied to ASCII inputs smaller than one block, but exact-block ASCII inputs are not padded to avoid multi-block expansion.

## Test Vector Results
- DES Encrypt: PASS (`85E813540F0AB405`)
- DES Decrypt: PASS (`0123456789ABCDEF`)
- AES-128 Encrypt: PASS (`69C4E0D86A7B0430D8CDB78070B4C55A`)
- AES-128 Decrypt: PASS (`00112233445566778899AABBCCDDEEFF`)
- AES-192 Encrypt: PASS (`DDA97CA4864CDFE06EAF70A0EC0D7191`)
- AES-192 Decrypt: PASS (`00112233445566778899AABBCCDDEEFF`)
- AES-256 Encrypt: PASS (`8EA2B7CA516745BFEAFC49904B496089`)
- AES-256 Decrypt: PASS (`00112233445566778899AABBCCDDEEFF`)

## Known Limitations (not fixed)
- Visualizer maps remain 128-bit focused in copy text (logic supports 192/256; visual text is static).
