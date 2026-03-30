/*
 * AUDIT LOG — BitGrid.jsx
 * [OK] Grid rendering verified.
 */
import BitBlock from './BitBlock';

function chunk(items, size) {
  const groups = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
}

export default function BitGrid({
  bits = [],
  highlights = [],
  moved = [],
  label,
  groupSize = 8,
  showIndices = false,
  variant = 'spacious',
  animated = true,
}) {
  const highlightSet = new Set(highlights);
  const movedSet = new Set(moved);
  const groups = chunk(bits, groupSize);
  const gapClass = variant === 'compact' ? 'gap-1.5' : 'gap-2.5';
  const columnClass = {
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
  }[groupSize] || 'grid-cols-8';

  return (
    <div className="space-y-3">
      {label ? (
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[10px] uppercase tracking-[0.24em] text-white/55">{label}</h3>
          <span className="text-[10px] text-white/30">{bits.length} bits</span>
        </div>
      ) : null}
      <div className={`grid ${gapClass}`}>
        {groups.map((group, groupIndex) => (
          <div
            key={`${label || 'grid'}-${groupIndex}`}
            className={`grid gap-0.5 rounded-xl border border-white/8 bg-white/[0.02] p-1.5 ${columnClass}`}
          >
            {group.map((bit, localIndex) => {
              const bitIndex = groupIndex * groupSize + localIndex;
              let bitVariant = 'default';

              if (highlightSet.has(bitIndex)) bitVariant = 'highlighted';
              if (movedSet.has(bitIndex)) bitVariant = 'moved';

              return (
                <BitBlock
                  key={`${bitIndex}-${bit}`}
                  value={bit}
                  index={bitIndex}
                  variant={bitVariant}
                  size="md"
                  animated={animated}
                  label={showIndices ? String(bitIndex + 1) : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
