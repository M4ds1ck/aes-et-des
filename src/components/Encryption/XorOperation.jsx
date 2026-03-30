/*
 * AUDIT LOG - XorOperation.jsx
 * [BUG] Missing XOR data could crash rendering -> FIXED (guard + placeholder).
 */
import BitGrid from '../UI/BitGrid';

export default function XorOperation({
  data,
  topLabel = 'A',
  bottomLabel = 'B',
  resultLabel = 'Result',
}) {
  if (!data?.result || !data?.a || !data?.b) {
    return (
      <div className="panel rounded-3xl p-5 text-sm text-white/60">
        XOR data is unavailable for this step.
      </div>
    );
  }

  const changedIndices = data.result.reduce((indices, bit, index) => {
    if (bit === 1) indices.push(index);
    return indices;
  }, []);

  return (
    <div className="panel rounded-3xl p-5">
      <div className="grid gap-4">
        <BitGrid bits={data.a} label={topLabel} groupSize={8} />
        <div className="text-center font-display text-3xl text-cyber-amber">XOR</div>
        <BitGrid bits={data.b} label={bottomLabel} groupSize={8} />
        <div className="text-center font-display text-3xl text-cyber-cyan">=</div>
        <BitGrid bits={data.result} moved={changedIndices} label={resultLabel} groupSize={8} />
      </div>
    </div>
  );
}
