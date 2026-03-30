import { useState } from 'react';
/*
 * AUDIT LOG — PBoxPermutation.jsx
 * [OK] Permutation visualization verified.
 */
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';
import PermutationTable from '../UI/PermutationTable';

export default function PBoxPermutation({ data }) {
  const [hovered, setHovered] = useState(null);
  const sourceIndex = hovered !== null ? data.table[hovered] - 1 : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr,220px,1fr]">
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.inputBits}
            label="S-Box Output (32 bits)"
            highlights={sourceIndex !== null ? [sourceIndex] : []}
            groupSize={8}
            showIndices
          />
        </div>
        <div className="grid content-center justify-items-center">
          <Arrow direction="right" color="amber" animated label="P" />
        </div>
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.outputBits}
            label="After P Permutation"
            highlights={hovered !== null ? [hovered] : []}
            groupSize={8}
            showIndices
          />
        </div>
      </div>
      <PermutationTable table={data.table} title="P-Box Table" columns={8} highlightIndex={hovered} onCellHover={setHovered} />
    </div>
  );
}
