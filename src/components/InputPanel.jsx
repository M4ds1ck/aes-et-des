/*
 * AUDIT LOG — InputPanel.jsx
 * [WARN] Legacy input panel retained for compatibility; Practice page is primary flow -> NOTED.
 */
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  bitsToHex,
  hexToBits,
  hexToBitsWithLength,
  isLikelyHexBlock,
  isLikelyHexBlockOfLength,
  stringToBits,
  stringToBitsWithLength,
} from '../utils/binary';
import BitGrid from './UI/BitGrid';

function previewBits(value, algorithm) {
  if (!value) return [];
  if (algorithm === 'aes') {
    return isLikelyHexBlockOfLength(value.trim(), 32) ? hexToBitsWithLength(value.trim(), 32) : stringToBitsWithLength(value, 16);
  }
  return isLikelyHexBlock(value.trim()) ? hexToBits(value.trim()) : stringToBits(value);
}

export default function InputPanel({
  algorithm,
  setAlgorithm,
  plaintext,
  keyValue,
  setPlaintext,
  setKey,
  onStart,
}) {

  const isAES = algorithm === 'aes';
  const plaintextPreview = previewBits(plaintext, algorithm);
  const keyPreview = previewBits(keyValue, algorithm);
  const plaintextTruncated = plaintext.length > (isAES ? 16 : 8) && !(isAES ? isLikelyHexBlockOfLength(plaintext.trim(), 32) : isLikelyHexBlock(plaintext.trim()));
  const keyTruncated = keyValue.length > (isAES ? 16 : 8) && !(isAES ? isLikelyHexBlockOfLength(keyValue.trim(), 32) : isLikelyHexBlock(keyValue.trim()));

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Enter' && plaintext && keyValue) {
        onStart();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keyValue, onStart, plaintext]);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 terminal-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 terminal-glow" />

      <div className="relative mx-auto max-w-6xl space-y-6">
        <div className="xl:hidden rounded-2xl border border-cyber-amber/25 bg-cyber-amber/10 p-4 text-sm text-cyber-amber">
          Best viewed on desktop at 1280px or wider, but the simulator remains usable on smaller screens.
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
          <motion.div
            className="panel rounded-[2rem] p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <div className="mb-3 text-xs uppercase tracking-[0.45em] text-cyber-cyan">Cryptography Lab</div>
              <h1 className="font-display text-4xl uppercase tracking-[0.16em] text-white sm:text-5xl">
                {isAES ? 'AES VISUALIZER' : 'DES VISUALIZER'}
              </h1>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-white/65">
                {isAES
                  ? 'Choose AES-128 to explore a zoomable structure map with round focus transitions. The simulator shows the first two rounds in detail, summarizes the rest, and finishes on the final ciphertext.'
                  : 'Choose DES to walk through key scheduling, the first Feistel round in detail, compact later-round summaries, and the final ciphertext.'}
              </p>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-3 text-xs uppercase tracking-[0.24em] text-white/45">Algorithm</div>
                <div className="inline-grid grid-cols-2 rounded-full border border-white/10 bg-black/20 p-1">
                  {[
                    { id: 'des', label: 'DES' },
                    { id: 'aes', label: 'AES-128' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAlgorithm(item.id)}
                      className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                        algorithm === item.id ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-white/45 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/45">Plaintext</span>
                <input
                  value={plaintext}
                  onChange={(event) => setPlaintext(event.target.value)}
                  placeholder={isAES ? 'Two One Nine Two or 00112233445566778899AABBCCDDEEFF' : 'Hello! or 0123456789ABCDEF'}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-cyber-cyan focus:shadow-cyan"
                />
                <div className="mt-2 flex justify-between text-xs text-white/40">
                  <span>
                    {isAES
                      ? isLikelyHexBlockOfLength(plaintext.trim(), 32)
                        ? 'Hex block mode'
                        : 'ASCII mode'
                      : isLikelyHexBlock(plaintext.trim())
                        ? 'Hex block mode'
                        : 'ASCII mode'}
                  </span>
                  <span>{plaintext.length} chars</span>
                </div>
                {plaintextTruncated ? (
                  <p className="mt-2 text-xs text-cyber-amber">
                    ASCII input longer than {isAES ? 16 : 8} characters will be truncated to {isAES ? 16 : 8} bytes.
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/45">Key</span>
                <input
                  value={keyValue}
                  onChange={(event) => setKey(event.target.value)}
                  placeholder={isAES ? 'Thats my Kung Fu or 000102030405060708090A0B0C0D0E0F' : 'DESKEY01 or 133457799BBCDFF1'}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-cyber-green focus:shadow-green"
                />
                <div className="mt-2 flex justify-between text-xs text-white/40">
                  <span>
                    {isAES
                      ? isLikelyHexBlockOfLength(keyValue.trim(), 32)
                        ? 'Hex block mode'
                        : 'ASCII mode'
                      : isLikelyHexBlock(keyValue.trim())
                        ? 'Hex block mode'
                        : 'ASCII mode'}
                  </span>
                  <span>{keyValue.length} chars</span>
                </div>
                {keyTruncated ? (
                  <p className="mt-2 text-xs text-cyber-amber">
                    ASCII key longer than {isAES ? 16 : 8} characters will be truncated to {isAES ? 16 : 8} bytes.
                  </p>
                ) : null}
              </label>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/45">Mode</span>
                  <span className="rounded-full border border-cyber-cyan/20 bg-cyber-cyan/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyber-cyan">
                    {isAES ? 'AES-128 single block' : 'DES ECB single block'}
                  </span>
                </div>
                <p className="text-sm leading-7 text-white/60">
                  {isAES
                    ? 'Single-block AES-128 visualization. Exactly one 128-bit block is processed at a time.'
                    : 'Single-block DES visualization. Exactly one 64-bit block is processed at a time.'}
                </p>
              </div>

              <motion.button
                type="button"
                onClick={onStart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                disabled={!plaintext || !keyValue}
                className="w-full rounded-2xl border border-cyber-cyan/40 bg-gradient-to-r from-cyber-cyan/20 via-cyber-amber/10 to-cyber-green/20 px-5 py-3 font-display text-base uppercase tracking-[0.2em] text-white transition hover:shadow-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                Start Simulation
              </motion.button>
              <p className="text-center text-xs uppercase tracking-[0.24em] text-white/35">Press Enter to start</p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="panel rounded-[2rem] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg uppercase tracking-[0.16em] text-white">Plaintext Preview</h2>
                <span className="text-xs text-cyber-cyan">{plaintextPreview.length ? bitsToHex(plaintextPreview) : 'Awaiting input'}</span>
              </div>
              {plaintextPreview.length ? (
                <BitGrid
                  bits={plaintextPreview}
                  label={`${isAES ? '128-bit' : '64-bit'} plaintext block`}
                  groupSize={8}
                  showIndices
                  animated={false}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-white/35">
                  Type plaintext to see the live {isAES ? '128-bit' : '64-bit'} block preview.
                </div>
              )}
            </div>

            <div className="panel rounded-[2rem] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg uppercase tracking-[0.16em] text-white">Key Preview</h2>
                <span className="text-xs text-cyber-green">{keyPreview.length ? bitsToHex(keyPreview) : 'Awaiting input'}</span>
              </div>
              {keyPreview.length ? (
                <BitGrid
                  bits={keyPreview}
                  label={`${isAES ? '128-bit' : '64-bit'} key block`}
                  groupSize={8}
                  showIndices
                  animated={false}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-white/35">
                  Type a key to see its live binary representation.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
