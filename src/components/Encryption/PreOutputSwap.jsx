/*
 * AUDIT LOG — PreOutputSwap.jsx
 * [OK] Swap visualization verified.
 */
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';
export default function PreOutputSwap({ data }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr,120px,1fr]">
      <div className="space-y-4">
        <div className="rounded-3xl border border-cyber-cyan/25 bg-cyber-cyan/10 p-4">
          <BitGrid bits={data.l16} label="L16" groupSize={8} variant="compact" />
        </div>
        <div className="rounded-3xl border border-cyber-green/25 bg-cyber-green/10 p-4">
          <BitGrid bits={data.r16} label="R16" groupSize={8} variant="compact" />
        </div>
      </div>
      <div className="grid content-center justify-items-center">
        <Arrow direction="right" color="amber" animated label="Swap" />
      </div>
      <div className="rounded-3xl border border-cyber-amber/25 bg-cyber-amber/10 p-4">
        <BitGrid bits={data.combined} label="R16L16 Sent to IP^-1" groupSize={8} showIndices />
      </div>
    </div>
  );
}
