/*
 * AUDIT LOG — LRRoundSummary.jsx
 * [OK] Summary table verified.
 */
import { bitsToHex } from '../../utils/binary';
export default function LRRoundSummary({ data }) {
  return (
    <div className="panel rounded-3xl p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg uppercase tracking-[0.16em] text-white">L/R Round Summary</h3>
          <p className="text-xs text-white/45">All Feistel round outputs after round 1.</p>
        </div>
        <span className="rounded-full border border-cyber-green/25 bg-cyber-green/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyber-green">
          16 rounds
        </span>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-left text-xs text-white/70">
          <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            <tr>
              <th className="px-3 py-2">Round</th>
              <th className="px-3 py-2">L n</th>
              <th className="px-3 py-2">R n</th>
            </tr>
          </thead>
          <tbody>
            {data.rounds.map((round) => (
              <tr key={`lr-${round.roundNum}`} className="border-t border-white/8">
                <td className="px-3 py-2 font-display text-cyber-amber">R{round.roundNum}</td>
                <td className="px-3 py-2 font-mono text-cyber-cyan">{bitsToHex(round.lBits)}</td>
                <td className="px-3 py-2 font-mono text-cyber-green">{bitsToHex(round.rBits)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
