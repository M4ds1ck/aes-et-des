/*
 * AUDIT LOG - KeyGenerationVisualizer.jsx
 * [BUG] Step rendering could crash when step data was missing -> FIXED (guard + placeholder).
 */
import { AnimatePresence, motion } from 'framer-motion';
import BitShift from './BitShift';
import CDSplit from './CDSplit';
import CDRoundSummary from './CDRoundSummary';
import PC1Permutation from './PC1Permutation';
import PC2Permutation from './PC2Permutation';
import SubkeyDisplay from './SubkeyDisplay';
import HexBinary from '../UI/HexBinary';
import StepExplainer from '../UI/StepExplainer';
import InlineErrorBoundary from '../UI/InlineErrorBoundary';

function StepContent({ step }) {
  if (!step?.data) return null;
  if (step.id === 'key-input') {
    return <HexBinary bits={step.data.bits} highlights={step.data.highlight} label="64-bit Key Input" />;
  }
  if (step.id === 'pc1') return <PC1Permutation data={step.data} />;
  if (step.id === 'cd-split') return <CDSplit data={step.data} />;
  if (step.id === 'cd-rounds-summary') return <CDRoundSummary data={step.data} />;
  if (step.id.startsWith('shift-round-')) return <BitShift data={step.data} />;
  if (step.id.startsWith('pc2-round-')) return <PC2Permutation data={step.data} />;
  if (step.id === 'subkeys-summary') return <SubkeyDisplay data={step.data} />;
  return null;
}

export default function KeyGenerationVisualizer({ step, steps, onGoToStep }) {
  if (!step?.data) {
    return (
      <div className="panel rounded-3xl p-6 text-sm text-white/60">
        This step is missing data. Update the inputs to regenerate the key schedule trace.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <StepExplainer title={step.title} subtitle={step.subtitle} explanation={step.explanation} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <InlineErrorBoundary resetKey={step.id}>
            <StepContent step={step} onGoToStep={onGoToStep} steps={steps} />
          </InlineErrorBoundary>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
