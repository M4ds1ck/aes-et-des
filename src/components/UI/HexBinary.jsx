/*
 * AUDIT LOG — HexBinary.jsx
 * [OK] Hex/binary toggle verified.
 */
import { useState } from 'react';
import { bitsToHex, bitsToString } from '../../utils/binary';
import BitGrid from './BitGrid';

export default function HexBinary({ bits = [], label = 'Representation', highlights = [] }) {
  const [mode, setMode] = useState('binary');
  const hex = bitsToHex(bits);
  const binary = bitsToString(bits);

  return (
    <div className="panel rounded-2xl p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base uppercase tracking-[0.24em] text-white/85">{label}</h3>
          <p className="text-xs text-white/45">Toggle between grouped binary and hexadecimal views.</p>
        </div>
        <div className="inline-grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
          {['binary', 'hex'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                mode === value ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-white/45 hover:text-white/80'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {mode === 'binary' ? (
        <BitGrid bits={bits} highlights={highlights} groupSize={8} showIndices />
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-cyber-green/25 bg-cyber-green/10 p-4 font-mono text-lg text-cyber-green">
            {hex}
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/65">
            {binary}
          </div>
        </div>
      )}
    </div>
  );
}
