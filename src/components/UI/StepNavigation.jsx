/*
 * AUDIT LOG - StepNavigation.jsx
 * [BUG] Navigation could render with empty steps and crash -> FIXED (empty-state guard).
 * [WARN] Large step counts may crowd dot list on narrow screens -> NOTED.
 */
export default function StepNavigation({ steps = [], currentStep = 0, navigation }) {
  if (!steps.length) {
    return (
      <div className="panel rounded-3xl p-4 text-sm text-white/50">
        No steps are available for navigation yet.
      </div>
    );
  }

  const current = steps[currentStep];
  const phaseLabel =
    current?.phase === 'keyGen'
      ? 'Key Generation'
      : current?.phase === 'aes'
        ? 'AES Flow'
        : 'Encryption';

  return (
    <div className="panel sticky bottom-4 z-20 rounded-3xl p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">{phaseLabel}</p>
          <p className="font-display text-lg uppercase tracking-[0.18em] text-white">
            Step {currentStep + 1} / {steps.length}
          </p>
        </div>
        <p className="text-xs text-white/45">Keyboard: left = previous, right = next</p>
      </div>

      <div className="mb-4 grid grid-cols-[auto,1fr,auto] items-center gap-3">
        <button
          type="button"
          onClick={navigation.goPrev}
          disabled={navigation.isFirst}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:border-cyber-cyan hover:text-cyber-cyan disabled:cursor-not-allowed disabled:opacity-35"
        >
          Back
        </button>
        <div className="flex flex-wrap items-center gap-1">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => navigation.goTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === currentStep
                  ? 'bg-cyber-amber shadow-amber'
                  : step.phase === 'keyGen'
                    ? 'bg-cyber-cyan/35 hover:bg-cyber-cyan/70'
                    : step.phase === 'aes'
                      ? 'bg-cyber-blue/35 hover:bg-cyber-blue/70'
                      : 'bg-cyber-green/35 hover:bg-cyber-green/70'
              }`}
              title={`${index + 1}. ${step.title}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={navigation.goNext}
          disabled={navigation.isLast}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:border-cyber-green hover:text-cyber-green disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next
        </button>
      </div>
    </div>
  );
}
