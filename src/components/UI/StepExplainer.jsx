/*
 * AUDIT LOG — StepExplainer.jsx
 * [OK] Explainer card verified.
 */
import { motion } from 'framer-motion';

export default function StepExplainer({ title, subtitle, explanation, tip }) {
  return (
    <motion.div
      className="panel rounded-3xl p-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="space-y-3">
        <div>
          <p className="font-display text-xl uppercase tracking-[0.14em] text-white">{title}</p>
          <p className="mt-1.5 text-xs uppercase tracking-[0.16em] text-cyber-cyan/80">{subtitle}</p>
        </div>
        <p className="max-w-5xl text-[13px] leading-6 text-white/70">{explanation}</p>
        {tip ? (
          <div className="rounded-2xl border border-cyber-amber/35 bg-cyber-amber/10 p-3 text-[13px] leading-6 text-cyber-amber">
            {tip}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
