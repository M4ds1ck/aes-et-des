/*
 * AUDIT LOG - DESVisuals.jsx
 * [BUG] Non-ASCII arrows and emoji rendered as garbled text -> FIXED (ASCII labels).
 */
import BitString from './BitString';
import LearnVisualFrame from './LearnVisualFrame';
import PipelineMap from './PipelineMap';
import { E, P, PC1, PC2, SBOXES } from '../../constants/permutationTables';

const DES_STEPS = [
  { id: 'des-input-setup', label: 'Input Setup', tooltip: 'Plaintext + key entering DES.' },
  { id: 'des-ip', label: 'Initial Permutation', tooltip: 'IP reorders the 64-bit block.' },
  { id: 'des-split', label: 'L/R Split', tooltip: 'Split into L0 and R0.' },
  { id: 'des-key-schedule', label: 'Key Schedule', tooltip: 'PC-1, shifts, PC-2 -> subkeys.' },
  { id: 'des-round', label: 'Round 1 Detail', tooltip: 'Full Feistel round.' },
  { id: 'des-final', label: 'Swap + Final Permutation', tooltip: 'Swap then IP^-1.' },
  { id: 'des-map', label: 'Full Pipeline Map', tooltip: 'Overview of the full DES flow.' },
];

function ReferenceGrid({ title, values, columns = 8 }) {
  const columnClass = columns === 6 ? 'ref-cols-6' : columns === 7 ? 'ref-cols-7' : 'ref-cols-8';
  return (
    <div className="reference-grid" title={title}>
      <div className="reference-title">{title}</div>
      <div className={`reference-cells ${columnClass}`}>
        {values.map((value, index) => (
          <span key={`ref-${index}`}>{value}</span>
        ))}
      </div>
    </div>
  );
}

function SBoxTable({ row, col }) {
  const table = SBOXES[0];
  return (
    <div className="sbox-table" title="S1 S-Box table">
      {table.map((tableRow, rowIndex) => (
        <div key={`sbox-row-${rowIndex}`} className="sbox-table__row">
          {tableRow.map((value, colIndex) => {
            const active = rowIndex === row && colIndex === col;
            return (
              <span
                key={`sbox-cell-${rowIndex}-${colIndex}`}
                className={`sbox-table__cell ${active ? 'active' : ''}`}
                title={`Row ${rowIndex}, Col ${colIndex}`}
              >
                {value}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function FlowArrow({ label }) {
  return (
    <div className="flow-arrow" title={label}>
      <span>{label}</span>
      <svg viewBox="0 0 80 20" aria-hidden="true">
        <line className="flow-line" x1="4" y1="10" x2="68" y2="10" />
        <polygon className="flow-head" points="68,4 78,10 68,16" />
      </svg>
    </div>
  );
}

function DESInputSetup({ trace, onJump }) {
  return (
    <LearnVisualFrame
      title="DES Input Setup"
      subtitle="64-bit plaintext and 64-bit key enter the DES engine"
      phases={2}
      className="visual-des"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="DES Pipeline Map" steps={DES_STEPS} currentId="des-input-setup" onJump={onJump} />
          <div className="visual-grid">
            <BitString bits={trace.input.plaintext64} group={8} color="blue" label="Plaintext (64 bits)" tooltip="64-bit plaintext input" />
            <BitString bits={trace.input.key64} group={8} color="red" label="Key (64 bits)" tooltip="64-bit key input" />
          </div>
          <div className={`engine-box ${phase >= 1 ? 'active' : ''}`} title="DES Engine (IP to 16 rounds to FP)">
            <div className="engine-label">DES ENGINE</div>
            <div className="engine-map">
              <div className="engine-node">IP</div>
              <div className="engine-node">16 Rounds</div>
              <div className="engine-node">FP</div>
            </div>
            <div className="engine-flow">
              <svg viewBox="0 0 200 40" aria-hidden="true">
                <path className="flow-line" d="M10 20 H190" />
              </svg>
            </div>
          </div>
          <div className="flow-row">
            <FlowArrow label="Bits flow into DES engine" />
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function DESInitialPermutation({ trace, onJump }) {
  const sampleLines = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    x1: 10 + index * 10,
    y1: 10,
    x2: 30 + index * 12,
    y2: 70,
  }));
  return (
    <LearnVisualFrame
      title="Initial Permutation (IP)"
      subtitle="Reorders the 64-bit plaintext block using the IP table"
      phases={3}
      className="visual-des"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="DES Pipeline Map" steps={DES_STEPS} currentId="des-ip" onJump={onJump} />
          <div className="visual-grid two-col">
            <BitString bits={trace.encryption.plaintext64} group={8} color="blue" label="Plaintext bits (1..64)" tooltip="Numbered input bits" showIndices />
            <BitString bits={trace.encryption.afterIP} group={8} color="yellow" label="After IP (64 bits)" tooltip="Permuted output" />
          </div>
          <div className="perm-visual">
            <svg viewBox="0 0 200 100" aria-hidden="true">
              {sampleLines.map((line) => (
                <line key={line.id} className={`perm-line ${phase >= 1 ? 'active' : ''}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
              ))}
            </svg>
            <div className={`perm-output ${phase >= 2 ? 'active' : ''}`}>Output assembles left to right</div>
          </div>
          <ReferenceGrid title="IP Table (8x8)" values={trace.constants.ip.slice(0, 64)} columns={8} />
          <div className="note-box">
            This step does not change the bit values - only their positions. It is the same fixed table used for every DES encryption.
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function DESLRSplit({ trace, onJump }) {
  return (
    <LearnVisualFrame
      title="Split into L0 and R0"
      subtitle="The permuted 64-bit block is divided into two 32-bit halves"
      phases={3}
      className="visual-des"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="DES Pipeline Map" steps={DES_STEPS} currentId="des-split" onJump={onJump} />
          <BitString bits={trace.encryption.afterIP} group={8} color="yellow" label="After IP (64 bits)" tooltip="Input to L/R split" />
          <div className={`split-line ${phase >= 1 ? 'active' : ''}`} title="Split at bit 32" />
          <div className={`visual-grid two-col ${phase >= 2 ? 'active' : ''}`}>
            <BitString bits={trace.encryption.l0} group={8} color="blue" label="L0 (32 bits)" tooltip="Left half" />
            <BitString bits={trace.encryption.r0} group={8} color="yellow" label="R0 (32 bits)" tooltip="Right half" />
          </div>
          <div className="flow-row">
            <FlowArrow label="Feed into Round 1" />
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function DESKeySchedule({ trace, onJump }) {
  const round1 = trace.keyGen.rounds[0];
  return (
    <LearnVisualFrame
      title="Key Schedule (PC-1 -> C/D -> PC-2)"
      subtitle="Generate subkey K1 (later rounds repeat with different shifts)"
      phases={4}
      className="visual-des"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="DES Pipeline Map" steps={DES_STEPS} currentId="des-key-schedule" onJump={onJump} />
          <div className="visual-grid">
            <BitString bits={trace.input.key64} group={8} color="red" label="Key (64 bits)" tooltip="Original key bits" />
            <div className="parity-strip" title="Parity bits dropped">Parity bits removed</div>
            <BitString bits={trace.keyGen.afterPC1} group={7} color="red" label="After PC-1 (56 bits)" tooltip="PC-1 output" />
          </div>
          <ReferenceGrid title="PC-1 Table (8x7)" values={PC1} columns={7} />
          <div className={`visual-grid two-col ${phase >= 1 ? 'active' : ''}`}>
            <BitString bits={trace.keyGen.c0} group={7} color="red" label="C0 (28 bits)" tooltip="Left half" />
            <BitString bits={trace.keyGen.d0} group={7} color="orange" label="D0 (28 bits)" tooltip="Right half" />
          </div>
          <div className={`visual-grid two-col ${phase >= 2 ? 'active' : ''}`}>
            <BitString bits={round1.cAfterShift} group={7} color="red" label="C1 (shifted left by 1)" tooltip="Round 1 shift" />
            <BitString bits={round1.dAfterShift} group={7} color="orange" label="D1 (shifted left by 1)" tooltip="Round 1 shift" />
          </div>
          <BitString bits={round1.subkey} group={6} color="red" label="Subkey K1 (48 bits)" tooltip="PC-2 output" />
          <ReferenceGrid title="PC-2 Table (8x6)" values={PC2} columns={6} />
          <div className={`timeline ${phase >= 3 ? 'active' : ''}`} title="Subkeys K1..K16 generated">
            {trace.keyGen.allSubkeys.map((_, index) => (
              <span key={`k-${index}`} className="timeline__tick">K{index + 1}</span>
            ))}
            <div className="timeline__sweep">Generated</div>
          </div>
          <div className="note-box">
            This process repeats 16 times - one subkey per round. Shift schedule: [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1].
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function DESFeistelRound({ trace, onJump }) {
  const round = trace.encryption.rounds[0];
  return (
    <LearnVisualFrame
      title="Round 1 Feistel Function (Full Detail)"
      subtitle="Expansion, XOR with K1, S-boxes, P-box, and XOR with L0"
      phases={6}
      className="visual-des"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="DES Pipeline Map" steps={DES_STEPS} currentId="des-round" onJump={onJump} />
          <div className="visual-grid three-col">
            <BitString bits={trace.encryption.l0} group={8} color="blue" label="L0 (32 bits)" tooltip="Left half" />
            <BitString bits={trace.encryption.r0} group={8} color="yellow" label="R0 (32 bits)" tooltip="Right half" />
            <BitString bits={round.subkey} group={6} color="red" label="K1 (48 bits)" tooltip="Subkey K1" />
          </div>
          <div className={`stage stage-1 ${phase >= 1 ? 'active' : ''}`}>
            <BitString bits={round.expanded} group={6} color="yellow" label="E(R0) (48 bits)" tooltip="Expansion output" />
            <div className="stage-label">Expansion E: 32 to 48 bits</div>
            <ReferenceGrid title="E Table (8x6)" values={E} columns={6} />
          </div>
          <div className={`stage stage-2 ${phase >= 2 ? 'active' : ''}`}>
            <BitString bits={round.xorWithKey} group={6} color="orange" label="E(R0) XOR K1 (48 bits)" tooltip="Key mixing result" />
            <div className="stage-label">XOR mixes data with the round key</div>
          </div>
          <div className={`stage stage-3 ${phase >= 3 ? 'active' : ''}`}>
            <BitString bits={round.sboxOutput} group={8} color="green" label="S-Box Output (32 bits)" tooltip="After substitution" />
            <div className="stage-label">S-Boxes: 8 groups of 6 bits to 32 bits</div>
            <div className="note-box">
              Example S1: row {round.sboxGroups[0].row}, col {round.sboxGroups[0].col} to {round.sboxGroups[0].output4.join('')}
            </div>
            <SBoxTable row={round.sboxGroups[0].row} col={round.sboxGroups[0].col} />
          </div>
          <div className={`stage stage-4 ${phase >= 4 ? 'active' : ''}`}>
            <BitString bits={round.afterP} group={8} color="yellow" label="P-Box Output (32 bits)" tooltip="After permutation P" />
            <div className="stage-label">P-Box permutes bits for diffusion</div>
            <ReferenceGrid title="P Table (4x8)" values={P} columns={8} />
          </div>
          <div className={`stage stage-5 ${phase >= 5 ? 'active' : ''}`}>
            <BitString bits={round.newR} group={8} color="green" label="R1 (32 bits)" tooltip="New right half" />
            <div className="stage-label">R1 = L0 XOR P(S(E(R0) XOR K1))</div>
          </div>
          <div className="round-summary">
            Round 1 complete: L1 = R0, R1 = L0 XOR F(R0, K1)
          </div>
          <div className="timeline" title="Round loop summary">
            {trace.keyGen.allSubkeys.map((_, index) => (
              <span key={`round-${index + 1}`} className="timeline__tick" title={`Round ${index + 1}`}>
                Round {index + 1}
              </span>
            ))}
            <div className="timeline__sweep">Repeat</div>
          </div>
          <div className="note-box">
            This exact process repeats for rounds 2-16, each time using the next subkey. After round 16, L16 and R16 feed the final permutation.
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function DESSwapFinal({ trace, onJump }) {
  return (
    <LearnVisualFrame
      title="Swap + Final Permutation"
      subtitle="R16L16 passes through IP^-1 to create ciphertext"
      phases={3}
      className="visual-des"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="DES Pipeline Map" steps={DES_STEPS} currentId="des-final" onJump={onJump} />
          <div className="visual-grid two-col">
            <BitString bits={trace.encryption.preOutputL} group={8} color="blue" label="L16" tooltip="Final left half" />
            <BitString bits={trace.encryption.preOutputR} group={8} color="yellow" label="R16" tooltip="Final right half" />
          </div>
          <div className={`swap-row ${phase >= 1 ? 'active' : ''}`}>
            <BitString bits={trace.encryption.combined} group={8} color="yellow" label="R16L16 (swap)" tooltip="Pre-output swap" />
          </div>
          <div className={`final-output ${phase >= 2 ? 'active' : ''}`}>
            <BitString bits={trace.encryption.ciphertext} group={8} color="green" label="Ciphertext (64 bits)" tooltip="Final output" />
            <div className="badge-lock">Encrypted!</div>
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function DESPipelineOverview({ onJump }) {
  return (
    <LearnVisualFrame
      title="DES Full Pipeline Overview"
      subtitle="Plaintext to Ciphertext with key schedule"
      phases={1}
      className="visual-des"
    >
      <div className="visual-stack">
        <PipelineMap title="DES Pipeline Map" steps={DES_STEPS} currentId="des-map" onJump={onJump} />
        <div className="pipeline-flow">
          <div className="pipeline-row">
            <span className="pipeline-node" title="Plaintext input">Plaintext</span>
            <span className="pipeline-node" title="Initial Permutation">IP</span>
            <span className="pipeline-node" title="Split halves">L0 | R0</span>
            <span className="pipeline-node" title="Round 1 uses K1">Round 1 (K1)</span>
            <span className="pipeline-node" title="Round 2 uses K2">Round 2 (K2)</span>
            <span className="pipeline-node" title="Rounds 3-15">...</span>
            <span className="pipeline-node" title="Final round uses K16">Round 16 (K16)</span>
            <span className="pipeline-node" title="Swap halves">Swap</span>
            <span className="pipeline-node" title="Final Permutation">FP</span>
            <span className="pipeline-node" title="Ciphertext output">Ciphertext</span>
          </div>
          <div className="pipeline-row">
            <span className="pipeline-node" title="Key input">Key</span>
            <span className="pipeline-node" title="PC-1 permutation">PC-1</span>
            <span className="pipeline-node" title="Split halves">C0 | D0</span>
            <span className="pipeline-node" title="Rotate + PC-2 per round">Rotate + PC-2 x16</span>
            <span className="pipeline-node" title="Subkeys">K1..K16</span>
          </div>
        </div>
      </div>
    </LearnVisualFrame>
  );
}

export function getDESVisuals(trace) {
  return [
    {
      id: 'des-input-setup',
      title: 'Input Setup',
      subtitle: 'Plaintext + key entering DES',
      visual: ({ onJump }) => <DESInputSetup trace={trace} onJump={onJump} />,
      body: 'DES begins by loading a 64-bit plaintext block and a 64-bit key into the engine.',
    },
    {
      id: 'des-ip',
      title: 'Initial Permutation',
      subtitle: 'Reorder 64 bits',
      visual: ({ onJump }) => <DESInitialPermutation trace={trace} onJump={onJump} />,
      body: 'The IP table rearranges the input bits before the Feistel rounds begin.',
    },
    {
      id: 'des-split',
      title: 'L0/R0 Split',
      subtitle: 'Split into two halves',
      visual: ({ onJump }) => <DESLRSplit trace={trace} onJump={onJump} />,
      body: 'The permuted block is divided into L0 and R0 for the Feistel network.',
    },
    {
      id: 'des-key-schedule',
      title: 'Key Schedule',
      subtitle: 'PC-1, shifts, PC-2',
      visual: ({ onJump }) => <DESKeySchedule trace={trace} onJump={onJump} />,
      body: 'The key schedule produces K1-K16. We show round 1 in detail and summarize the rest.',
    },
    {
      id: 'des-round',
      title: 'Round 1 Detail',
      subtitle: 'Full Feistel round',
      visual: ({ onJump }) => <DESFeistelRound trace={trace} onJump={onJump} />,
      body: 'Round 1 shows expansion, XOR with key, S-box substitution, P-box, and XOR with L0.',
    },
    {
      id: 'des-final',
      title: 'Swap + Final Permutation',
      subtitle: 'R16L16 -> Ciphertext',
      visual: ({ onJump }) => <DESSwapFinal trace={trace} onJump={onJump} />,
      body: 'After round 16, the halves are swapped and the final permutation creates ciphertext.',
    },
    {
      id: 'des-map',
      title: 'DES Pipeline Map',
      subtitle: 'Full algorithm overview',
      visual: ({ onJump }) => <DESPipelineOverview onJump={onJump} />,
      body: 'Use this map to orient yourself in the full DES pipeline.',
    },
  ];
}
