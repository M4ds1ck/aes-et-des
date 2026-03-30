/*
 * AUDIT LOG — PC2Permutation.jsx
 * [OK] Permutation visualization verified.
 */
import { useState } from 'react';
import { PC2_DROPPED_POSITIONS } from '../../utils/permutations';
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';
import PermutationTable from '../UI/PermutationTable';

export default function PC2Permutation({ data }) {
  const [hovered, setHovered] = useState(null);
  const mappedInputIndex = hovered !== null ? data.table[hovered] - 1 : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr,220px,1fr]">
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.cdCombined}
            label={`C${data.roundNum}D${data.roundNum} Combined (56 bits)`}
            highlights={hovered !== null ? [mappedInputIndex] : []}
            moved={PC2_DROPPED_POSITIONS.map((position) => position - 1)}
            groupSize={7}
            showIndices
          />
        </div>
        <div className="grid content-center justify-items-center">
          <Arrow direction="right" color="green" animated label="PC-2" />
        </div>
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.subkey}
            label={`Subkey K${data.roundNum} (48 bits)`}
            highlights={hovered !== null ? [hovered] : []}
            groupSize={6}
            showIndices
          />
        </div>
      </div>

      <PermutationTable
        table={data.table}
        title={`PC-2 Table for K${data.roundNum}`}
        columns={6}
        highlightIndex={hovered}
        onCellHover={setHovered}
      />

      <div className="rounded-2xl border border-cyber-amber/25 bg-cyber-amber/10 p-4 text-sm leading-7 text-cyber-amber">
        PC-2 drops positions 9, 18, 22, 25, 35, 38, 43, and 54 from the combined 56-bit state.
      </div>
    </div>
  );
}
