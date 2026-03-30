/*
 * AUDIT LOG — CDRoundSummary.jsx
 * [OK] Summary table verified.
 */
import { bitsToHex } from '../../utils/binary';
export default function CDRoundSummary({ data }) {
  return (
    <div className="panel rounded-3xl p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg uppercase tracking-[0.16em] text-white">C/D Round Summary</h3>
          <p className="text-xs text-white/45">All rotated halves after the background rounds.</p>
        </div>
        <span className="rounded-full border border-cyber-cyan/25 bg-cyber-cyan/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyber-cyan">
          16 rounds
        </span>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-left text-xs text-white/70">
          <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            <tr>
              <th className="px-3 py-2">Round</th>
              <th className="px-3 py-2">Shift</th>
              <th className="px-3 py-2">C n</th>
              <th className="px-3 py-2">D n</th>
            </tr>
          </thead>
          <tbody>
            {data.rounds.map((round) => (
              <tr key={`cd-${round.roundNum}`} className="border-t border-white/8">
                <td className="px-3 py-2 font-display text-cyber-cyan">R{round.roundNum}</td>
                <td className="px-3 py-2">{round.shiftAmount}</td>
                <td className="px-3 py-2 font-mono text-cyber-cyan">{bitsToHex(round.cBits)}</td>
                <td className="px-3 py-2 font-mono text-cyber-green">{bitsToHex(round.dBits)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
