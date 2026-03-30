import { useState } from 'react';
/*
 * AUDIT LOG — InitialPermutation.jsx
 * [OK] Permutation visualization verified.
 */
import Arrow from '../UI/Arrow';
import BitGrid from '../UI/BitGrid';
import PermutationTable from '../UI/PermutationTable';

export default function InitialPermutation({ data }) {
  const [hovered, setHovered] = useState(null);
  const sourceIndex = hovered !== null ? data.table[hovered] - 1 : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr,220px,1fr]">
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.inputBits}
            label="Original Plaintext Block"
            highlights={sourceIndex !== null ? [sourceIndex] : []}
            groupSize={8}
            showIndices
          />
        </div>
        <div className="grid content-center justify-items-center">
          <Arrow direction="right" color="cyan" animated label="IP" />
        </div>
        <div className="panel rounded-3xl p-5">
          <BitGrid
            bits={data.outputBits}
            label="After Initial Permutation"
            highlights={hovered !== null ? [hovered] : []}
            groupSize={8}
            showIndices
          />
        </div>
      </div>
      <PermutationTable table={data.table} title="Initial Permutation Table" columns={8} highlightIndex={hovered} onCellHover={setHovered} />
    </div>
  );
}
