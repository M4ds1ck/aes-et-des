/*
 * AUDIT LOG - AESVisuals.jsx
 * [BUG] Non-ASCII arrows and emoji rendered as garbled text -> FIXED (ASCII labels).
 */
import BitString from './BitString';
import LearnVisualFrame from './LearnVisualFrame';
import PipelineMap from './PipelineMap';
import StateMatrix from './StateMatrix';

const AES_STEPS = [
  { id: 'aes-input-setup', label: 'Input + State', tooltip: 'Plaintext into state matrix.' },
  { id: 'aes-key-expansion', label: 'Key Expansion', tooltip: 'Generate round keys.' },
  { id: 'aes-round0', label: 'AddRoundKey (Round 0)', tooltip: 'Initial key mixing.' },
  { id: 'aes-subbytes', label: 'SubBytes', tooltip: 'S-box substitution.' },
  { id: 'aes-shiftrows', label: 'ShiftRows', tooltip: 'Row shifts.' },
  { id: 'aes-mixcolumns', label: 'MixColumns', tooltip: 'Column mixing.' },
  { id: 'aes-addroundkey', label: 'AddRoundKey (Round N)', tooltip: 'Key mixing in rounds.' },
  { id: 'aes-final', label: 'Final Output', tooltip: 'Ciphertext output.' },
  { id: 'aes-map', label: 'Pipeline Map', tooltip: 'Full AES flow.' },
];

function AESInputSetup({ trace, onJump }) {
  return (
    <LearnVisualFrame
      title="AES Input Setup & State Matrix"
      subtitle="Plaintext bytes flow into the 4x4 state matrix"
      phases={3}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-input-setup" onJump={onJump} />
          <div className="visual-grid two-col">
            <BitString bits={trace.input.plaintext128} group={8} color="blue" label="Plaintext (128 bits)" tooltip="Input plaintext bytes" />
            <BitString bits={trace.input.keyBits} group={8} color="red" label="Key (128/192/256 bits)" tooltip="Key bytes" />
          </div>
          <div className={`visual-grid two-col ${phase >= 1 ? 'active' : ''}`}>
            <StateMatrix bytes={trace.input.plaintextBytes} label="State Matrix" color="blue" tooltip="State matrix filled column by column" />
            <StateMatrix bytes={trace.input.keyBytes} label="Key Matrix" color="red" tooltip="Key bytes arranged for XOR" />
          </div>
          <div className="note-box">
            AES operates on a 4x4 matrix of bytes called the State. Bytes fill column-by-column.
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESKeyExpansion({ trace, onJump }) {
  return (
    <LearnVisualFrame
      title="Key Expansion"
      subtitle="Generate round keys using RotWord, SubWord, and Rcon"
      phases={4}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-key-expansion" onJump={onJump} />
          <div className="visual-grid">
            <StateMatrix bytes={trace.input.keyBytes} label="Original Key (W0-W3)" color="red" tooltip="Base key words" />
          </div>
          <div className={`key-expansion ${phase >= 1 ? 'active' : ''}`}>
            <div className="key-expansion__row">
              <div className="key-step" title="RotWord">RotWord</div>
              <div className="key-step" title="SubWord">SubWord (S-Box)</div>
              <div className="key-step" title="Rcon XOR">XOR Rcon[1]</div>
              <div className="key-step" title="XOR with W0">XOR W0</div>
              <div className="key-step key-step--out" title="W4">W4</div>
            </div>
          </div>
          <div className={`timeline ${phase >= 2 ? 'active' : ''}`} title="Round keys">
            {trace.keyExpansion.roundKeys.map((_, index) => (
              <span key={`rk-${index}`} className="timeline__tick">RK{index}</span>
            ))}
            <div className="timeline__sweep">Generated</div>
          </div>
          <div className="note-box">
            AES-128 has 11 round keys (RK0-RK10). AES-192 has 13. AES-256 has 15.
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESRound0({ trace, onJump }) {
  return (
    <LearnVisualFrame
      title="Initial AddRoundKey (Round 0)"
      subtitle="Plaintext state XORed with round key 0"
      phases={3}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-round0" onJump={onJump} />
          <div className="visual-grid three-col">
            <StateMatrix bytes={trace.encryption.inputState} label="State" color="blue" tooltip="Input state" />
            <StateMatrix bytes={trace.encryption.round0Key} label="Round Key 0" color="red" tooltip="Initial key" />
            <StateMatrix bytes={trace.encryption.stateAfterRound0} label="Output State" color="yellow" tooltip="After AddRoundKey" />
          </div>
          <div className={`xor-legend ${phase >= 1 ? 'active' : ''}`}>XOR each cell with the key (shown for first column)</div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESSubBytes({ trace, onJump }) {
  const round = trace.encryption.rounds[0];
  const exampleByte = round.startState[0][0];
  const exampleRow = (exampleByte >> 4).toString(16).toUpperCase();
  const exampleCol = (exampleByte & 0x0f).toString(16).toUpperCase();
  const exampleOut = round.subBytes[0][0].toString(16).toUpperCase().padStart(2, '0');
  return (
    <LearnVisualFrame
      title="SubBytes"
      subtitle="Apply the AES S-Box to every byte"
      phases={3}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-subbytes" onJump={onJump} />
          <div className="visual-grid two-col">
            <StateMatrix bytes={round.startState} label="Before SubBytes" color="yellow" tooltip="Input state" />
            <StateMatrix bytes={round.subBytes} label="After SubBytes" color="yellow" tooltip="S-box output" />
          </div>
          <div className={`sbox-grid ${phase >= 1 ? 'active' : ''}`} title="AES S-Box (16x16)">
            {trace.constants.aesSBox.map((value, index) => (
              <span key={`sbox-${index}`}>{value.toString(16).toUpperCase().padStart(2, '0')}</span>
            ))}
          </div>
          <div className="note-box">
            Example: byte 0x{exampleByte.toString(16).toUpperCase().padStart(2, '0')} to row {exampleRow}, column {exampleCol} to 0x{exampleOut}.
          </div>
          <div className="note-box">
            SubBytes replaces each byte using a fixed nonlinear S-Box (confusion).
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESShiftRows({ trace, onJump }) {
  const round = trace.encryption.rounds[0];
  return (
    <LearnVisualFrame
      title="ShiftRows"
      subtitle="Rotate rows left by 0, 1, 2, and 3 bytes"
      phases={4}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-shiftrows" onJump={onJump} />
          <StateMatrix bytes={round.shiftRows} label="After ShiftRows" color="yellow" tooltip="Rows shifted left" />
          <div className="shiftrows-legend">
            <span className={phase >= 1 ? 'active' : ''}>Row 0: no shift</span>
            <span className={phase >= 2 ? 'active' : ''}>Row 1: shift by 1</span>
            <span className={phase >= 3 ? 'active' : ''}>Row 2: shift by 2</span>
            <span className={phase >= 4 ? 'active' : ''}>Row 3: shift by 3</span>
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESMixColumns({ trace, onJump }) {
  const round = trace.encryption.rounds[0];
  const column = round.shiftRows.map((row) => row[0]);
  const [a0, a1, a2, a3] = column.map((value) => value.toString(16).toUpperCase().padStart(2, '0'));
  return (
    <LearnVisualFrame
      title="MixColumns"
      subtitle="Mix each column using GF(2^8) matrix"
      phases={4}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-mixcolumns" onJump={onJump} />
          <div className="visual-grid two-col">
            <StateMatrix bytes={round.shiftRows} label="Input Column" color="yellow" tooltip="Column before MixColumns" />
            <StateMatrix bytes={round.mixColumns || round.shiftRows} label="After MixColumns" color="green" tooltip="Column after MixColumns" />
          </div>
          <div className={`mix-matrix ${phase >= 1 ? 'active' : ''}`} title="MixColumns matrix">
            <div>[2 3 1 1]</div>
            <div>[1 2 3 1]</div>
            <div>[1 1 2 3]</div>
            <div>[3 1 1 2]</div>
          </div>
          <div className="note-box">
            Column example: [0x{a0}, 0x{a1}, 0x{a2}, 0x{a3}] is mixed using GF(2^8) multiplication.
          </div>
          <div className="note-box">
            MixColumns mixes bytes within each column using finite field arithmetic. The final round skips this step.
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESAddRoundKey({ trace, onJump }) {
  const round = trace.encryption.rounds[0];
  const totalRounds = trace.encryption.rounds.length;
  return (
    <LearnVisualFrame
      title="AddRoundKey (Round 1)"
      subtitle="XOR state with round key"
      phases={3}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-addroundkey" onJump={onJump} />
          <div className="visual-grid three-col">
            <StateMatrix bytes={round.mixColumns} label="State Before XOR" color="yellow" tooltip="After MixColumns" />
            <StateMatrix bytes={round.roundKey} label="Round Key 1" color="red" tooltip="Round key" />
            <StateMatrix bytes={round.outputState} label="State After XOR" color="yellow" tooltip="After AddRoundKey" />
          </div>
          <div className="round-summary">
            One full AES round: SubBytes to ShiftRows to MixColumns to AddRoundKey (final round skips MixColumns).
          </div>
          <div className="timeline" title="Round loop summary">
            {Array.from({ length: totalRounds }, (_, index) => (
              <span key={`round-${index + 1}`} className="timeline__tick" title={`Round ${index + 1}`}>
                Round {index + 1}
              </span>
            ))}
            <div className="timeline__sweep">Repeat</div>
          </div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESFinalOutput({ trace, onJump }) {
  return (
    <LearnVisualFrame
      title="AES Final Output"
      subtitle="State matrix serialized into ciphertext"
      phases={2}
      className="visual-aes"
    >
      {({ phase }) => (
        <div className="visual-stack">
          <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-final" onJump={onJump} />
          <div className="visual-grid two-col">
            <StateMatrix bytes={trace.encryption.ciphertextBytes} label="Final State" color="green" tooltip="Final state" />
            <BitString bits={trace.encryption.ciphertextBits} group={8} color="green" label="Ciphertext (128 bits)" tooltip="Final ciphertext" />
          </div>
          <div className="badge-lock">Encrypted!</div>
        </div>
      )}
    </LearnVisualFrame>
  );
}

function AESPipelineOverview({ onJump }) {
  return (
    <LearnVisualFrame
      title="AES Pipeline Overview"
      subtitle="Full AES data path"
      phases={1}
      className="visual-aes"
    >
      <div className="visual-stack">
        <PipelineMap title="AES Pipeline Map" steps={AES_STEPS} currentId="aes-map" onJump={onJump} />
        <div className="pipeline-flow">
          <div className="pipeline-row">
            <span className="pipeline-node" title="Plaintext input">Plaintext</span>
            <span className="pipeline-node" title="State matrix">State Matrix</span>
            <span className="pipeline-node" title="Initial AddRoundKey">AddRoundKey (RK0)</span>
            <span className="pipeline-node" title="Repeated rounds">Rounds 1..N-1</span>
            <span className="pipeline-node" title="Final round (no MixColumns)">Final Round</span>
            <span className="pipeline-node" title="Ciphertext output">Ciphertext</span>
          </div>
          <div className="pipeline-row">
            <span className="pipeline-node" title="Key input">Key</span>
            <span className="pipeline-node" title="Key schedule">Key Expansion</span>
            <span className="pipeline-node" title="Round keys">RK0..RKN</span>
          </div>
        </div>
      </div>
    </LearnVisualFrame>
  );
}

export function getAESVisuals(trace) {
  return [
    {
      id: 'aes-input-setup',
      title: 'Input Setup & State Matrix',
      subtitle: 'Plaintext and key enter AES',
      visual: ({ onJump }) => <AESInputSetup trace={trace} onJump={onJump} />,
      body: 'AES loads 16 bytes into a 4x4 state matrix and aligns the key.',
    },
    {
      id: 'aes-key-expansion',
      title: 'Key Expansion',
      subtitle: 'Derive round keys',
      visual: ({ onJump }) => <AESKeyExpansion trace={trace} onJump={onJump} />,
      body: 'Key expansion produces round keys using RotWord, SubWord, and Rcon.',
    },
    {
      id: 'aes-round0',
      title: 'Round 0 AddRoundKey',
      subtitle: 'Initial key mixing',
      visual: ({ onJump }) => <AESRound0 trace={trace} onJump={onJump} />,
      body: 'The plaintext state is XORed with round key 0.',
    },
    {
      id: 'aes-subbytes',
      title: 'SubBytes',
      subtitle: 'Byte substitution',
      visual: ({ onJump }) => <AESSubBytes trace={trace} onJump={onJump} />,
      body: 'Each byte is substituted through the AES S-Box.',
    },
    {
      id: 'aes-shiftrows',
      title: 'ShiftRows',
      subtitle: 'Row rotations',
      visual: ({ onJump }) => <AESShiftRows trace={trace} onJump={onJump} />,
      body: 'Rows shift left by 0, 1, 2, and 3 positions.',
    },
    {
      id: 'aes-mixcolumns',
      title: 'MixColumns',
      subtitle: 'Column mixing',
      visual: ({ onJump }) => <AESMixColumns trace={trace} onJump={onJump} />,
      body: 'Columns are mixed using GF(2^8) multiplication.',
    },
    {
      id: 'aes-addroundkey',
      title: 'AddRoundKey',
      subtitle: 'Key mixing per round',
      visual: ({ onJump }) => <AESAddRoundKey trace={trace} onJump={onJump} />,
      body: 'Each round ends by XORing the state with the round key.',
    },
    {
      id: 'aes-final',
      title: 'Final Output',
      subtitle: 'Ciphertext block',
      visual: ({ onJump }) => <AESFinalOutput trace={trace} onJump={onJump} />,
      body: 'The final state is serialized to 16 ciphertext bytes.',
    },
    {
      id: 'aes-map',
      title: 'AES Pipeline Map',
      subtitle: 'Full algorithm overview',
      visual: ({ onJump }) => <AESPipelineOverview onJump={onJump} />,
      body: 'Use this map to navigate the AES pipeline.',
    },
  ];
}
