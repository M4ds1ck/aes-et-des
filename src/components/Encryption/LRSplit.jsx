/*
 * AUDIT LOG — LRSplit.jsx
 * [OK] Split visualization verified.
 */
import { motion } from 'framer-motion';
import BitGrid from '../UI/BitGrid';
export default function LRSplit({ data }) {
  return (
    <div className="space-y-6">
      <div className="panel rounded-3xl p-6">
        <BitGrid bits={data.full64} label="After IP (64 bits)" groupSize={8} showIndices />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div
          className="rounded-3xl border border-cyber-cyan/30 bg-cyber-cyan/10 p-5"
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BitGrid bits={data.l0} label="L₀" groupSize={8} variant="compact" />
        </motion.div>
        <motion.div
          className="rounded-3xl border border-cyber-green/30 bg-cyber-green/10 p-5"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BitGrid bits={data.r0} label="R₀" groupSize={8} variant="compact" />
        </motion.div>
      </div>
    </div>
  );
}
