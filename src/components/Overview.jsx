/*
 * AUDIT LOG — Overview.jsx
 * [BUG] Non-ASCII arrow glyphs rendered inconsistently -> FIXED.
 */
// BUG FIX: Replaced non-ASCII arrow glyphs that rendered inconsistently.
import { motion } from 'framer-motion';

function MapNode({ title, subtitle, color = 'cyan', onClick, compact = false }) {
  const colorClasses = {
    cyan: 'border-cyber-cyan/45 bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/15',
    green: 'border-cyber-green/45 bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/15',
    amber: 'border-cyber-amber/45 bg-cyber-amber/10 text-cyber-amber hover:bg-cyber-amber/15',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-3 text-left transition hover:scale-[1.01] ${colorClasses[color]} ${
        compact ? 'min-h-[68px]' : 'min-h-[84px]'
      }`}
    >
      <div className={`${compact ? 'text-[11px]' : 'text-xs'} font-display uppercase tracking-[0.16em]`}>
        {title}
      </div>
      {subtitle ? <div className="mt-1 text-[10px] leading-5 text-white/65">{subtitle}</div> : null}
    </button>
  );
}

function FlowArrow({ label, vertical = false }) {
  return (
    <div className={`grid place-items-center ${vertical ? 'py-1' : 'px-1'}`}>
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</div>
      <div className={`text-cyber-amber ${vertical ? 'text-lg' : 'text-xl'}`}>{vertical ? 'v' : '->'}</div>
    </div>
  );
}

function FeistelStage({ title, bits, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-cyber-amber/35 bg-cyber-amber/10 px-3 py-3 text-left transition hover:border-cyber-amber hover:bg-cyber-amber/15"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-[11px] uppercase tracking-[0.16em] text-cyber-amber">{title}</span>
        <span className="text-[10px] text-white/45">{bits}</span>
      </div>
    </button>
  );
}

export default function Overview({ steps, onJump }) {
  const stepIndex = (id) => steps.findIndex((step) => step.id === id);

  return (
    <motion.div
      className="panel rounded-[2rem] p-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-[0.16em] text-white">DES Flow Map</h2>
          <p className="mt-2 max-w-4xl text-[13px] leading-6 text-white/60">
            This overview is now a real DES schematic: data flow in the center-left, key schedule on the right, and the
            final swap plus permutation at the bottom. Every box is clickable.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[11px] leading-6 text-white/55">
          Click a box to open that exact visualization step.
        </div>
      </div>

      <div className="hidden gap-5 xl:grid xl:grid-cols-[1.05fr,1.55fr,1.05fr]">
        <div className="space-y-3">
          <MapNode
            title="Plaintext Input"
            subtitle="64-bit source block"
            color="cyan"
            onClick={() => onJump(stepIndex('plaintext-input'))}
          />
          <FlowArrow label="IP" vertical />
          <MapNode
            title="Initial Permutation"
            subtitle="Reorder plaintext bits"
            color="cyan"
            onClick={() => onJump(stepIndex('ip'))}
          />
          <FlowArrow label="Split" vertical />
          <div className="grid grid-cols-2 gap-3">
            <MapNode title="L0" subtitle="Left 32 bits" color="cyan" compact onClick={() => onJump(stepIndex('lr-split'))} />
            <MapNode title="R0" subtitle="Right 32 bits" color="green" compact onClick={() => onJump(stepIndex('lr-split'))} />
          </div>
          <FlowArrow label="Round 1 Result" vertical />
          <div className="grid grid-cols-2 gap-3">
            <MapNode title="L1" subtitle="= old R0" color="cyan" compact onClick={() => onJump(stepIndex('round-1-result'))} />
            <MapNode title="R1" subtitle="f(R0,K1) XOR L0" color="green" compact onClick={() => onJump(stepIndex('round-1-result'))} />
          </div>
          <FlowArrow label="Rounds 2..16" vertical />
          <MapNode
            title="All L/R States"
            subtitle="Compact summary through L16 and R16"
            color="green"
            onClick={() => onJump(stepIndex('lr-rounds-summary'))}
          />
        </div>

        <div className="rounded-[2rem] border border-cyber-amber/25 bg-[#21140f]/70 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="font-display text-lg uppercase tracking-[0.16em] text-white">Feistel Round Structure</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">Detailed in Round 1</div>
          </div>

          <div className="grid gap-3">
            <div className="grid grid-cols-[1fr,52px,1fr] items-center gap-3">
              <MapNode
                title="Previous Left"
                subtitle="L(i-1)"
                color="cyan"
                compact
                onClick={() => onJump(stepIndex('lr-split'))}
              />
              <FlowArrow label="Feed" />
              <MapNode
                title="Previous Right"
                subtitle="R(i-1)"
                color="green"
                compact
                onClick={() => onJump(stepIndex('round-1-expansion'))}
              />
            </div>

            <div className="rounded-[1.5rem] border border-cyber-amber/30 bg-black/25 p-4">
              <div className="grid gap-2">
                <FeistelStage title="Expansion Permutation" bits="32 -> 48" onClick={() => onJump(stepIndex('round-1-expansion'))} />
                <FlowArrow label="XOR K1" vertical />
                <FeistelStage title="Key Mixing" bits="48" onClick={() => onJump(stepIndex('round-1-xor-key'))} />
                <FlowArrow label="S-Boxes" vertical />
                <FeistelStage title="Keyed Substitution" bits="48 -> 32" onClick={() => onJump(stepIndex('round-1-sbox'))} />
                <FlowArrow label="P-Box" vertical />
                <FeistelStage title="Permutation P" bits="32" onClick={() => onJump(stepIndex('round-1-pbox'))} />
                <FlowArrow label="XOR Left" vertical />
                <FeistelStage title="Make New Right Half" bits="32" onClick={() => onJump(stepIndex('round-1-xor-left'))} />
              </div>
            </div>

            <div className="grid grid-cols-[1fr,52px,1fr] items-center gap-3">
              <MapNode
                title="R16L16 Swap"
                subtitle="Swap before final output"
                color="amber"
                compact
                onClick={() => onJump(stepIndex('preoutput-swap'))}
              />
              <FlowArrow label="IP^-1" />
              <MapNode
                title="Ciphertext"
                subtitle="Final 64-bit encrypted block"
                color="green"
                compact
                onClick={() => onJump(stepIndex('fp'))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <MapNode
            title="Key Input"
            subtitle="Original 64-bit key"
            color="cyan"
            onClick={() => onJump(stepIndex('key-input'))}
          />
          <FlowArrow label="PC-1" vertical />
          <MapNode
            title="PC-1 Output"
            subtitle="Parity removed, 56 bits"
            color="cyan"
            onClick={() => onJump(stepIndex('pc1'))}
          />
          <FlowArrow label="Split" vertical />
          <div className="grid grid-cols-2 gap-3">
            <MapNode title="C0" subtitle="Left key half" color="cyan" compact onClick={() => onJump(stepIndex('cd-split'))} />
            <MapNode title="D0" subtitle="Right key half" color="green" compact onClick={() => onJump(stepIndex('cd-split'))} />
          </div>
          <FlowArrow label="Shift 1" vertical />
          <div className="grid grid-cols-2 gap-3">
            <MapNode title="C1" subtitle="After round 1 shift" color="cyan" compact onClick={() => onJump(stepIndex('shift-round-1'))} />
            <MapNode title="D1" subtitle="After round 1 shift" color="green" compact onClick={() => onJump(stepIndex('shift-round-1'))} />
          </div>
          <FlowArrow label="Shift 2" vertical />
          <div className="grid grid-cols-2 gap-3">
            <MapNode title="C2" subtitle="After round 2 shift" color="cyan" compact onClick={() => onJump(stepIndex('shift-round-2'))} />
            <MapNode title="D2" subtitle="After round 2 shift" color="green" compact onClick={() => onJump(stepIndex('shift-round-2'))} />
          </div>
          <FlowArrow label="PC-2" vertical />
          <div className="grid grid-cols-2 gap-3">
            <MapNode title="K1" subtitle="From C1D1" color="amber" compact onClick={() => onJump(stepIndex('pc2-round-1'))} />
            <MapNode title="K2" subtitle="From C2D2" color="amber" compact onClick={() => onJump(stepIndex('pc2-round-2'))} />
          </div>
          <FlowArrow label="Background Rounds" vertical />
          <MapNode
            title="C/D Summary and K1..K16"
            subtitle="All later key schedule states and subkeys"
            color="green"
            onClick={() => onJump(stepIndex('subkeys-summary'))}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:hidden">
        <MapNode
          title="Plaintext -> IP -> L0/R0"
          subtitle="Input data enters the DES network and splits into left and right halves."
          color="cyan"
          onClick={() => onJump(stepIndex('lr-split'))}
        />
        <MapNode
          title="Round 1 Feistel Function"
          subtitle="Expansion, XOR with K1, S-boxes, P-box, then make L1/R1."
          color="amber"
          onClick={() => onJump(stepIndex('round-1-expansion'))}
        />
        <MapNode
          title="Key Schedule"
          subtitle="Key input, PC-1, C/D shifts, PC-2, then all subkeys."
          color="green"
          onClick={() => onJump(stepIndex('subkeys-summary'))}
        />
        <MapNode
          title="L/R Summary -> Swap -> Final Permutation"
          subtitle="Later rounds run in the background, then R16L16 is sent into IP^-1."
          color="green"
          onClick={() => onJump(stepIndex('fp'))}
        />
      </div>
    </motion.div>
  );
}
