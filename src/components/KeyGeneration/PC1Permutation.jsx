/*
 * AUDIT LOG — PC1Permutation.jsx
 * [OK] Permutation visualization verified.
 */
import { useState } from 'react';
import { PARITY_BIT_POSITIONS } from '../../utils/permutations';
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';
import PermutationTable from '../UI/PermutationTable';

export default function PC1Permutation({ data }) {
  const [hovered, setHovered] = useState(null);
  const parityIndices = PARITY_BIT_POSITIONS.map((position) => position - 1);
  const mappedInputIndex = hovered !== null ? data.table[hovered] - 1 : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr,220px,1fr]">
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.inputBits}
            label="Original 64-bit Key"
            highlights={[...(mappedInputIndex !== null ? [mappedInputIndex] : []), ...parityIndices]}
            groupSize={8}
            showIndices
          />
        </div>
        <div className="grid content-center justify-items-center">
          <Arrow direction="right" color="cyan" animated label="PC-1" />
        </div>
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.outputBits}
            label="After PC-1 (56 bits)"
            highlights={hovered !== null ? [hovered] : []}
            groupSize={7}
            showIndices
          />
        </div>
      </div>

      <PermutationTable
        table={data.table}
        title="PC-1 Table"
        columns={7}
        highlightIndex={hovered}
        onCellHover={setHovered}
      />

      <div className="rounded-2xl border border-cyber-amber/25 bg-cyber-amber/10 p-4 text-sm leading-7 text-cyber-amber">
        Parity bits dropped by PC-1: 8, 16, 24, 32, 40, 48, 56, 64.
      </div>
    </div>
  );
}
