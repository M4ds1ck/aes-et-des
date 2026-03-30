/*
 * AUDIT LOG — SubkeyDisplay.jsx
 * [OK] Subkey list verified.
 */
import { bitsToHex } from '../../utils/binary';

export default function SubkeyDisplay({ data, onSelectRound }) {
  return (
    <div className="panel rounded-3xl p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg uppercase tracking-[0.16em] text-white">Subkey Schedule</h3>
          <p className="text-xs text-white/45">All 16 generated subkeys, compacted into a single view.</p>
        </div>
        <span className="rounded-full border border-cyber-green/30 bg-cyber-green/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyber-green">
          16 subkeys
        </span>
      </div>
      <div className="grid max-h-[32rem] gap-2 overflow-auto pr-1 md:grid-cols-2 xl:grid-cols-4">
        {data.subkeys.map((subkey, index) => (
          <div
            key={`subkey-${index + 1}`}
            onClick={() => onSelectRound?.(index + 1)}
            className={`rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition ${
              onSelectRound ? 'cursor-pointer hover:border-cyber-cyan hover:bg-cyber-cyan/10' : ''
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="font-display text-xs uppercase tracking-[0.18em] text-cyber-cyan">K{index + 1}</span>
              <span className="text-[10px] text-white/35">48 bits</span>
            </div>
            <div className="mb-1 break-all font-mono text-xs text-cyber-green">{bitsToHex(subkey)}</div>
            <div className="break-all text-[10px] leading-5 text-white/50">{subkey.join('')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
