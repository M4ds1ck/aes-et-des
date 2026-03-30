/*
 * AUDIT LOG - EncryptionVisualizer.jsx
 * [BUG] Step rendering could crash when step data was missing -> FIXED (guard + placeholder).
 */
import { AnimatePresence, motion } from 'framer-motion';
import ExpansionPermutation from './ExpansionPermutation';
import FeistelRound from './FeistelRound';
import FinalPermutation from './FinalPermutation';
import InitialPermutation from './InitialPermutation';
import LRSplit from './LRSplit';
import LRRoundSummary from './LRRoundSummary';
import PBoxPermutation from './PBoxPermutation';
import PreOutputSwap from './PreOutputSwap';
import SBoxSubstitution from './SBoxSubstitution';
import XorOperation from './XorOperation';
import HexBinary from '../UI/HexBinary';
import StepExplainer from '../UI/StepExplainer';

function StepContent({ step }) {
  if (!step?.data) return null;
  if (step.id === 'plaintext-input') {
    return <HexBinary bits={step.data.bits} label="Plaintext Block" />;
  }
  if (step.id === 'ip') return <InitialPermutation data={step.data} />;
  if (step.id === 'lr-split') return <LRSplit data={step.data} />;
  if (step.id.includes('-expansion')) return <ExpansionPermutation data={step.data} />;
  if (step.id.includes('-xor-key')) {
    return (
      <XorOperation
        data={step.data}
        topLabel={`E(R${step.data.roundNum - 1})`}
        bottomLabel={step.data.subkeyLabel}
        resultLabel="48-bit XOR Output"
      />
    );
  }
  if (step.id.includes('-sbox')) return <SBoxSubstitution data={step.data} />;
  if (step.id.includes('-pbox')) return <PBoxPermutation data={step.data} />;
  if (step.id.includes('-xor-left')) {
    return <XorOperation data={step.data} topLabel={step.data.aLabel} bottomLabel={step.data.bLabel} resultLabel={step.data.resultLabel} />;
  }
  if (step.id.includes('-result')) return <FeistelRound data={step.data} />;
  if (step.id === 'lr-rounds-summary') return <LRRoundSummary data={step.data} />;
  if (step.id === 'preoutput-swap') return <PreOutputSwap data={step.data} />;
  if (step.id === 'fp') return <FinalPermutation data={step.data} />;
  return null;
}

export default function EncryptionVisualizer({ step }) {
  if (!step?.data) {
    return (
      <div className="panel rounded-3xl p-6 text-sm text-white/60">
        This step is missing data. Update the inputs to regenerate the encryption trace.
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
          <StepContent step={step} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
