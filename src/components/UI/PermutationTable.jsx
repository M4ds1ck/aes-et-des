/*
 * AUDIT LOG — PermutationTable.jsx
 * [OK] Table rendering verified.
 */
export default function PermutationTable({
  table = [],
  title,
  columns = 8,
  highlightIndex = null,
  onCellHover,
}) {
  const columnClass = {
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
  }[columns] || 'grid-cols-8';

  return (
    <div className="panel rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-sm uppercase tracking-[0.32em] text-white/70">{title}</h3>
        <span className="text-[10px] uppercase tracking-[0.24em] text-white/35">{table.length} entries</span>
      </div>
      <div className={`grid gap-2 ${columnClass}`}>
        {table.map((value, index) => {
          const isActive = index === highlightIndex;
          return (
            <button
              key={`${title}-${index}`}
              type="button"
              className={`rounded-lg border px-2 py-2 text-xs transition ${
                isActive
                  ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan shadow-cyan'
                  : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-cyber-amber/60 hover:text-cyber-amber'
              }`}
              onMouseEnter={() => onCellHover?.(index)}
              onMouseLeave={() => onCellHover?.(null)}
              title={`Output position ${index + 1} pulls from input position ${value}`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
