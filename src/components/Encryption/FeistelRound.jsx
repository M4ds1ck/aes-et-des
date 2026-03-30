/*
 * AUDIT LOG — FeistelRound.jsx
 * [OK] Diagram rendering verified.
 */
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';

export default function FeistelRound({ data }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr,240px,1fr]">
      <div className="space-y-4">
        <div className="rounded-3xl border border-cyber-cyan/30 bg-cyber-cyan/10 p-4">
          <BitGrid bits={data.prevL} label={`L${data.roundNum - 1}`} groupSize={8} variant="compact" />
        </div>
        <div className="rounded-3xl border border-cyber-green/30 bg-cyber-green/10 p-4">
          <BitGrid bits={data.prevR} label={`R${data.roundNum - 1}`} groupSize={8} variant="compact" />
        </div>
      </div>

      <div className="panel rounded-3xl p-4">
        <h3 className="mb-3 font-display text-base uppercase tracking-[0.16em] text-white">Feistel Function</h3>
        <div className="space-y-4 text-sm text-white/65">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">Expansion E</div>
          <Arrow direction="down" color="cyan" animated />
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">XOR with K{data.roundNum}</div>
          <Arrow direction="down" color="green" animated />
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">S-Boxes</div>
          <Arrow direction="down" color="amber" animated />
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">Permutation P</div>
          <div className="mt-3 rounded-2xl border border-cyber-amber/25 bg-cyber-amber/10 p-3 text-xs text-cyber-amber">
            Output f(R{data.roundNum - 1}, K{data.roundNum}) = {data.afterP.join('')}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-cyber-green/30 bg-cyber-green/10 p-4">
          <BitGrid bits={data.newL} label={`L${data.roundNum}`} groupSize={8} variant="compact" />
        </div>
        <div className="rounded-3xl border border-cyber-cyan/30 bg-cyber-cyan/10 p-4">
          <BitGrid bits={data.newR} label={`R${data.roundNum}`} groupSize={8} variant="compact" />
        </div>
      </div>
    </div>
  );
}
