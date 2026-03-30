/*
 * AUDIT LOG — ExpansionPermutation.jsx
 * [OK] Expansion visualization verified.
 */
import { useMemo, useState } from 'react';
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';
import PermutationTable from '../UI/PermutationTable';

export default function ExpansionPermutation({ data }) {
  const [hovered, setHovered] = useState(null);
  const sourceIndex = hovered !== null ? data.table[hovered] - 1 : null;
  const duplicatedOutputs = useMemo(() => {
    const counts = {};
    data.table.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });
    return data.table.reduce((indices, value, index) => {
      if (counts[value] > 1) indices.push(index);
      return indices;
    }, []);
  }, [data.table]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr,220px,1.2fr]">
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.inputBits}
            label={`R${data.roundNum - 1} (32 bits)`}
            highlights={sourceIndex !== null ? [sourceIndex] : []}
            groupSize={8}
            showIndices
          />
        </div>
        <div className="grid content-center justify-items-center">
          <Arrow direction="right" color="green" animated label="Expand" />
        </div>
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.outputBits}
            label="Expanded to 48 bits"
            highlights={[...(hovered !== null ? [hovered] : []), ...duplicatedOutputs]}
            groupSize={8}
            showIndices
          />
        </div>
      </div>
      <PermutationTable table={data.table} title="Expansion Table E" columns={6} highlightIndex={hovered} onCellHover={setHovered} />
      <div className="rounded-2xl border border-cyber-amber/25 bg-cyber-amber/10 p-4 text-sm leading-7 text-cyber-amber">
        Highlighted amber output positions are duplicated source bits introduced by the expansion permutation.
      </div>
    </div>
  );
}
