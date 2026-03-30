/*
 * AUDIT LOG — CDSplit.jsx
 * [OK] Split visualization verified.
 */
import { motion } from 'framer-motion';
import BitGrid from '../UI/BitGrid';
export default function CDSplit({ data }) {
  return (
    <div className="space-y-6">
      <div className="panel rounded-3xl p-6">
        <BitGrid bits={data.full56} label="56-bit Key Schedule State" groupSize={7} showIndices />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div
          className="rounded-3xl border border-cyber-cyan/30 bg-cyber-cyan/10 p-5"
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BitGrid bits={data.c0} label="C₀ (Left 28 bits)" groupSize={7} variant="compact" />
        </motion.div>
        <motion.div
          className="rounded-3xl border border-cyber-green/30 bg-cyber-green/10 p-5"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BitGrid bits={data.d0} label="D₀ (Right 28 bits)" groupSize={7} variant="compact" />
        </motion.div>
      </div>
    </div>
  );
}
