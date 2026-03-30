import { motion } from 'framer-motion';
/*
 * AUDIT LOG — BitShift.jsx
 * [BUG] Non-ASCII arrows in titles -> FIXED.
 */
import BitGrid from '../UI/BitGrid';

function scheduleLabel(value, index, currentIndex) {
  return (
    <div
      key={`${value}-${index}`}
      className={`rounded-xl border px-3 py-2 text-center text-sm ${
        index === currentIndex
          ? 'border-cyber-amber bg-cyber-amber/15 text-cyber-amber'
          : 'border-white/10 bg-white/[0.03] text-white/55'
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.2em]">R{index + 1}</div>
      <div>{value}</div>
    </div>
  );
}

function ShiftPair({ title, beforeBits, afterBits, shiftAmount, colorClass }) {
  const movedBefore = Array.from({ length: shiftAmount }, (_, index) => index);
  const movedAfter = Array.from({ length: shiftAmount }, (_, index) => afterBits.length - shiftAmount + index);

  return (
    <div className={`rounded-3xl border p-5 ${colorClass}`}>
      <h3 className="mb-4 font-display text-lg uppercase tracking-[0.18em] text-white">{title}</h3>
      <div className="grid gap-5">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <BitGrid bits={beforeBits} moved={movedBefore} label="Before Shift" groupSize={7} variant="compact" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <BitGrid bits={afterBits} moved={movedAfter} label="After Shift" groupSize={7} variant="compact" />
        </motion.div>
      </div>
    </div>
  );
}

export default function BitShift({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ShiftPair
          title={`C${data.roundNum - 1} -> C${data.roundNum}`}
          beforeBits={data.cPrev}
          afterBits={data.cAfter}
          shiftAmount={data.shiftAmount}
          colorClass="border-cyber-cyan/30 bg-cyber-cyan/10"
        />
        <ShiftPair
          title={`D${data.roundNum - 1} -> D${data.roundNum}`}
          beforeBits={data.dPrev}
          afterBits={data.dAfter}
          shiftAmount={data.shiftAmount}
          colorClass="border-cyber-green/30 bg-cyber-green/10"
        />
      </div>
      <div className="panel rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg uppercase tracking-[0.18em] text-white">Shift Schedule</h3>
          <p className="text-sm text-cyber-amber">Round {data.roundNum} shifts by {data.shiftAmount}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-8">
          {data.shiftSchedule.map((value, index) => scheduleLabel(value, index, data.currentRoundIndex))}
        </div>
      </div>
    </div>
  );
}
