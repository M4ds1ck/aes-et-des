import { useState } from 'react';
/*
 * AUDIT LOG — SBoxSubstitution.jsx
 * [BUG] Non-ASCII arrows in labels -> FIXED.
 */
import BitGrid from '../UI/BitGrid';

function SBoxTable({ table, row, col, title }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-display text-sm uppercase tracking-[0.2em] text-cyber-cyan">{title}</span>
        <span className="text-[10px] text-white/35">row {row}, col {col}</span>
      </div>
      <div className="grid grid-cols-16 gap-1">
        {table.map((tableRow, rowIndex) =>
          tableRow.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`rounded-md px-1 py-1 text-center text-[10px] ${
                rowIndex === row && colIndex === col
                  ? 'bg-cyber-amber/25 text-cyber-amber'
                  : rowIndex === row || colIndex === col
                    ? 'bg-cyber-cyan/10 text-cyber-cyan/70'
                    : 'bg-white/[0.03] text-white/45'
              }`}
            >
              {value}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

export default function SBoxSubstitution({ data }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const group = data.sboxGroups[activeGroup];

  return (
    <div className="space-y-6">
      <div className="panel rounded-3xl p-5">
        <BitGrid bits={data.inputBits} label="48-bit Input to S-Boxes" groupSize={6} showIndices />
      </div>

      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
        {data.sboxGroups.map((item, index) => (
          <button
            key={`group-${index + 1}`}
            type="button"
            onClick={() => setActiveGroup(index)}
            className={`rounded-2xl border p-4 text-left transition ${
              activeGroup === index
                ? 'border-cyber-amber bg-cyber-amber/10'
                : 'border-white/10 bg-white/[0.03] hover:border-cyber-cyan/40'
            }`}
          >
            <div className="mb-2 font-display text-sm uppercase tracking-[0.18em] text-white">S{index + 1}</div>
            <div className="mb-2 text-sm text-white/70">{item.input6.join('')}</div>
            <div className="text-[11px] leading-6 text-white/45">
              Row {item.row}, Col {item.col}, Out {item.output4.join('')}
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
        <div className="panel rounded-3xl p-5">
          <h3 className="mb-4 font-display text-lg uppercase tracking-[0.18em] text-white">Selected 6-bit Group</h3>
          <BitGrid bits={group.input6} label={`Input to S${group.boxIndex}`} groupSize={6} variant="compact" />
          <div className="mt-4 rounded-2xl border border-cyber-green/30 bg-cyber-green/10 p-4 text-sm leading-7 text-white/75">
            <div>Outer bits: {group.input6[0]} and {group.input6[5]} to row {group.row}</div>
            <div>Inner bits: {group.input6.slice(1, 5).join('')} to column {group.col}</div>
            <div>Lookup result: {group.output4.join('')}</div>
          </div>
        </div>
        <SBoxTable
          table={data.sboxTables[group.boxIndex - 1]}
          row={group.row}
          col={group.col}
          title={`S${group.boxIndex} Lookup Table`}
        />
      </div>

      <div className="panel rounded-3xl p-5">
        <BitGrid bits={data.outputBits} label="Combined 32-bit S-Box Output" groupSize={4} />
      </div>
    </div>
  );
}
