/*
 * AUDIT LOG — FinalPermutation.jsx
 * [BUG] Malformed glyphs in labels -> FIXED earlier.
 */
import { motion } from 'framer-motion';
import { bitsToBytes } from '../../utils/binary';
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';
import HexBinary from '../UI/HexBinary';
import PermutationTable from '../UI/PermutationTable';

function toBase64(bits) {
  const bytes = bitsToBytes(bits);
  return btoa(String.fromCharCode(...bytes));
}

export default function FinalPermutation({ data }) {
  const base64 = toBase64(data.outputBits);

  return (
    <div className="space-y-4">
      <motion.div
        className="rounded-3xl border border-cyber-green/30 bg-cyber-green/10 p-4"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl uppercase tracking-[0.16em] text-white">Ciphertext Ready</h3>
            <p className="text-xs text-white/50">The DES block is complete after the inverse permutation.</p>
          </div>
          <div className="animate-glow-pulse rounded-full border border-cyber-green/40 bg-cyber-green/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyber-green">
            Complete
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-[1fr,160px,1fr]">
          <div className="panel rounded-3xl p-4">
            <BitGrid bits={data.inputBits} label="Pre-output Swap (R16L16)" groupSize={8} showIndices />
          </div>
          <div className="grid content-center justify-items-center">
            <Arrow direction="right" color="green" animated label="IP^-1" />
          </div>
          <div className="panel rounded-3xl p-4">
            <BitGrid bits={data.outputBits} label="Final Ciphertext Bits" groupSize={8} showIndices />
          </div>
        </div>
      </motion.div>

      <PermutationTable table={data.table} title="Final Permutation Table (IP^-1)" columns={8} />

      <div className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
        <HexBinary bits={data.outputBits} label="Ciphertext Views" />
        <div className="panel rounded-3xl p-4">
          <h3 className="mb-3 font-display text-base uppercase tracking-[0.16em] text-white">Encoded Forms</h3>
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl border border-cyber-cyan/25 bg-cyber-cyan/10 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-cyber-cyan">Hex</div>
              <div className="break-all font-mono text-sm text-white">{data.ciphertextHex}</div>
            </div>
            <div className="rounded-2xl border border-cyber-purple/25 bg-cyber-purple/10 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-cyber-purple">Base64</div>
              <div className="break-all font-mono text-sm text-white">{base64}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






