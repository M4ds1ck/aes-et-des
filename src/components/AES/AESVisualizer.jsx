/*
 * AUDIT LOG — AESVisualizer.jsx
 * [WARN] Map labels still assume AES-128 in text; functional logic supports 192/256 -> NOTED.
 */
import { motion } from 'framer-motion';
import ByteMatrix from '../UI/ByteMatrix';
import HexBinary from '../UI/HexBinary';
import StepExplainer from '../UI/StepExplainer';

const focusMap = {
  overview: { scale: 0.93, x: 0, y: 0, rotateX: 0, rotateY: 0 },
  input: { scale: 1.08, x: 140, y: 90, rotateX: 6, rotateY: -8 },
  keyInput: { scale: 1.08, x: -150, y: 90, rotateX: 6, rotateY: 8 },
  keyExpansion: { scale: 1.12, x: -250, y: -10, rotateX: 5, rotateY: 10 },
  round0: { scale: 1.12, x: 0, y: 110, rotateX: 6, rotateY: 0 },
  round1: { scale: 1.16, x: 0, y: 20, rotateX: 4, rotateY: 0 },
  round2: { scale: 1.16, x: 0, y: -90, rotateX: 4, rotateY: 0 },
  roundsSummary: { scale: 1.12, x: 0, y: -210, rotateX: 3, rotateY: 0 },
  finalRound: { scale: 1.16, x: 0, y: -330, rotateX: 5, rotateY: 0 },
  ciphertext: { scale: 1.1, x: 0, y: -430, rotateX: 6, rotateY: 0 },
};

function Node({ title, subtitle, color = 'cyan', onClick, small = false }) {
  const classes = {
    cyan: 'border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan',
    green: 'border-cyber-green/40 bg-cyber-green/10 text-cyber-green',
    amber: 'border-cyber-amber/40 bg-cyber-amber/10 text-cyber-amber',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-3 text-left transition hover:scale-[1.02] ${classes[color]} ${
        small ? 'min-h-[64px]' : 'min-h-[76px]'
      }`}
    >
      <div className={`${small ? 'text-[10px]' : 'text-[11px]'} font-display uppercase tracking-[0.14em]`}>{title}</div>
      {subtitle ? <div className="mt-1 text-[10px] leading-5 text-white/65">{subtitle}</div> : null}
    </button>
  );
}

function Arrow({ label }) {
  return (
    <div className="grid place-items-center py-1">
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/35">{label}</div>
          <div className="text-cyber-amber">v</div>
    </div>
  );
}

function KeyScheduleSummary({ roundKeys }) {
  return (
    <div className="panel rounded-3xl p-4">
      <div className="mb-3 font-display text-base uppercase tracking-[0.14em] text-white">Round Keys</div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {roundKeys.map((keyBytes, index) => (
          <div key={`rk-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyber-cyan">
              {index === 0 ? 'Round 0 Key' : `Round ${index} Key`}
            </div>
            <div className="break-all font-mono text-[11px] text-cyber-green">
              {keyBytes.map((value) => value.toString(16).toUpperCase().padStart(2, '0')).join('')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoundSummary({ rounds }) {
  const label =
    rounds && rounds.length ? `Rounds ${rounds[0].roundNum} to ${rounds[rounds.length - 1].roundNum}` : 'Background Rounds';
  return (
    <div className="panel rounded-3xl p-4">
      <div className="mb-3 font-display text-base uppercase tracking-[0.14em] text-white">{label}</div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-xs text-white/70">
          <thead className="text-[10px] uppercase tracking-[0.14em] text-white/40">
            <tr>
              <th className="px-2 py-2">Round</th>
              <th className="px-2 py-2">Output State</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr key={`aes-round-${round.roundNum}`} className="border-t border-white/8">
                <td className="px-2 py-2 font-display text-cyber-amber">R{round.roundNum}</td>
                <td className="px-2 py-2 font-mono text-cyber-green">
                  {round.outputState.flat().map((value) => value.toString(16).toUpperCase().padStart(2, '0')).join(' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StepDetails({ step }) {
  const { data } = step;

  if (step.id === 'aes-plaintext') {
    return <HexBinary bits={data.bits} label="AES Plaintext Bits" />;
  }

  if (step.id === 'aes-key') {
    return <HexBinary bits={data.bits} label="AES Key Bits" />;
  }

  if (step.id === 'aes-key-expansion') {
    return <KeyScheduleSummary roundKeys={data.roundKeys} />;
  }

  if (step.id === 'aes-rounds-summary') {
    return <RoundSummary rounds={data.rounds} />;
  }

  if (step.id === 'aes-result') {
    return (
      <div className="grid gap-4 xl:grid-cols-[auto,1fr]">
        <ByteMatrix bytes={data.state} label="Final State" color="green" />
        <div className="panel rounded-3xl p-4">
          <div className="mb-2 font-display text-base uppercase tracking-[0.14em] text-white">Ciphertext</div>
          <div className="mb-3 break-all font-mono text-lg text-cyber-green">{data.ciphertextHex}</div>
          <HexBinary bits={data.ciphertextBits} label="Ciphertext Bits" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {'inputState' in data ? <ByteMatrix bytes={data.inputState} label="Input State" color="cyan" /> : null}
      {'startState' in data ? <ByteMatrix bytes={data.startState} label="Start State" color="cyan" /> : null}
      {'subBytes' in data ? <ByteMatrix bytes={data.subBytes} label="After SubBytes" color="amber" /> : null}
      {'shiftRows' in data ? <ByteMatrix bytes={data.shiftRows} label="After ShiftRows" color="amber" /> : null}
      {'mixColumns' in data && data.mixColumns ? <ByteMatrix bytes={data.mixColumns} label="After MixColumns" color="amber" /> : null}
      {'roundKey' in data ? <ByteMatrix bytes={data.roundKey} label="Round Key" color="green" /> : null}
      {'outputState' in data ? <ByteMatrix bytes={data.outputState} label="Output State" color="green" /> : null}
    </div>
  );
}

function AESMap({ steps, onGoToStep, focusKey }) {
  const focus = focusMap[focusKey] || focusMap.overview;
  const stepIndex = (id) => steps.findIndex((step) => step.id === id);
  const summaryStep = steps.find((step) => step.id === 'aes-rounds-summary');
  const summaryRounds = summaryStep?.data?.rounds || [];
  const summaryLabel =
    summaryRounds.length ? `Rounds ${summaryRounds[0].roundNum}..${summaryRounds[summaryRounds.length - 1].roundNum}` : 'Background Rounds';
  const finalRoundNum = steps.find((step) => step.id === 'aes-final-round')?.data?.roundNum || 10;

  return (
    <div className="panel overflow-hidden rounded-[2rem] p-4 [perspective:1200px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="font-display text-lg uppercase tracking-[0.14em] text-white">AES Structure Map</div>
        <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">Camera animates by focused step</div>
      </div>
      <div className="relative h-[680px] overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#07181c]">
        <motion.div
          className="aes-camera absolute left-1/2 top-1/2 w-[1000px] -translate-x-1/2 -translate-y-1/2"
          animate={focus}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        >
          <div className="grid grid-cols-[250px,1fr,260px] gap-6">
            <div className="space-y-3">
              <Node title="Plaintext" subtitle="16 bytes / 128 bits" color="cyan" onClick={() => onGoToStep(stepIndex('aes-plaintext'))} />
              <Arrow label="State" />
              <Node title="Input State" subtitle="4x4 byte matrix" color="cyan" small onClick={() => onGoToStep(stepIndex('aes-plaintext'))} />
              <Arrow label="Round 0" />
              <Node title="Initial Transformation" subtitle="AddRoundKey only" color="amber" onClick={() => onGoToStep(stepIndex('aes-round0'))} />
              <Arrow label="Round 1" />
              <Node title="Round 1 Output" subtitle="4 transformations" color="green" onClick={() => onGoToStep(stepIndex('aes-round1'))} />
              <Arrow label="Round 2" />
              <Node title="Round 2 Output" subtitle="4 transformations" color="green" onClick={() => onGoToStep(stepIndex('aes-round2'))} />
              <Arrow label={summaryLabel} />
              <Node
                title="Background Rounds"
                subtitle={`Summary of ${summaryLabel.toLowerCase()}`}
                color="amber"
                onClick={() => onGoToStep(stepIndex('aes-rounds-summary'))}
              />
              <Arrow label={`Round ${finalRoundNum}`} />
              <Node title="Final Round" subtitle="No MixColumns" color="amber" onClick={() => onGoToStep(stepIndex('aes-final-round'))} />
              <Arrow label="Ciphertext" />
              <Node title="Final State" subtitle="Encrypted 16-byte block" color="green" onClick={() => onGoToStep(stepIndex('aes-result'))} />
            </div>

            <div className="rounded-[1.75rem] border border-cyber-amber/30 bg-[#1a120d]/70 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <div className="mb-4 font-display text-lg uppercase tracking-[0.14em] text-white">Round Core</div>
              <div className="grid gap-3">
                <Node title="SubBytes" subtitle="Byte substitution using the AES S-box" color="amber" onClick={() => onGoToStep(stepIndex('aes-round1'))} />
                <Arrow label="ShiftRows" />
                <Node title="ShiftRows" subtitle="Rows rotate left by different offsets" color="amber" onClick={() => onGoToStep(stepIndex('aes-round1'))} />
                <Arrow label="MixColumns" />
                <Node title="MixColumns" subtitle="Column mixing in GF(2^8)" color="amber" onClick={() => onGoToStep(stepIndex('aes-round1'))} />
                <Arrow label="AddRoundKey" />
                <Node title="AddRoundKey" subtitle="XOR with the round key" color="green" onClick={() => onGoToStep(stepIndex('aes-round1'))} />
              </div>
            </div>

            <div className="space-y-3">
              <Node title="AES Key" subtitle="16 bytes / 128 bits" color="cyan" onClick={() => onGoToStep(stepIndex('aes-key'))} />
              <Arrow label="Expand" />
              <Node title="Key Expansion" subtitle="Generate round keys 0 to 10" color="green" onClick={() => onGoToStep(stepIndex('aes-key-expansion'))} />
              <Arrow label="Round Key 0" />
              <Node title="Round 0 Key" subtitle="Used in initial AddRoundKey" color="green" small onClick={() => onGoToStep(stepIndex('aes-round0'))} />
              <Arrow label="Round Key 1" />
              <Node title="Round 1 Key" subtitle="Feeds round 1" color="green" small onClick={() => onGoToStep(stepIndex('aes-round1'))} />
              <Arrow label="Round Key 2" />
              <Node title="Round 2 Key" subtitle="Feeds round 2" color="green" small onClick={() => onGoToStep(stepIndex('aes-round2'))} />
              <Arrow label="Later Keys" />
              <Node
                title={`Rounds 3..${finalRoundNum} Keys`}
                subtitle="Background key schedule summary"
                color="green"
                onClick={() => onGoToStep(stepIndex('aes-key-expansion'))}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AESVisualizer({ step, steps, onGoToStep, isOverview = false }) {
  return (
    <div className="space-y-4">
      <StepExplainer
        title={isOverview ? 'AES Flow Overview' : step.title}
        subtitle={isOverview ? 'Zoom map of AES-128 structure' : step.subtitle}
        explanation={
          isOverview
            ? 'AES is shown as a zoomable map. Use Next and Back to move through the important regions: input, key expansion, round 0, round 1, round 2, background rounds, final round, and ciphertext.'
            : step.explanation
        }
      />
      <AESMap steps={steps} onGoToStep={onGoToStep} focusKey={isOverview ? 'overview' : step.focus} />
      {!isOverview ? <StepDetails step={step} /> : null}
    </div>
  );
}
