/*
 * AUDIT LOG — DESVisualizer.jsx
 * [BUG] Overview clicks could leave view mode stale -> FIXED via navigation.goTo wiring in parent (see App.jsx).
 * [BUG] Visualizer could render without steps and crash -> FIXED (guard empty steps).
 */
import AESVisualizer from './AES/AESVisualizer';
import EncryptionVisualizer from './Encryption/EncryptionVisualizer';
import KeyGenerationVisualizer from './KeyGeneration/KeyGenerationVisualizer';
import ModeSelector from './ModeSelector';
import Overview from './Overview';
import ProgressBar from './UI/ProgressBar';
import StepNavigation from './UI/StepNavigation';

export default function DESVisualizer({
  algorithm = 'des',
  steps,
  currentStep,
  navigation,
  viewMode,
  onViewModeChange,
}) {
  const step = steps[currentStep];
  if (!steps || steps.length === 0 || !step) {
    return (
      <div className="panel rounded-3xl p-6 text-sm text-white/60">
        Steps are unavailable for the current inputs. Update the plaintext or key to generate a valid visualization.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-3 py-4 sm:px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-cyber-cyan">
            {algorithm === 'aes' ? 'Interactive AES Simulator' : 'Interactive DES Simulator'}
          </p>
          <h1 className="font-display text-2xl uppercase tracking-[0.14em] text-white">
            {algorithm === 'aes' ? 'AES-128 Structure Walkthrough' : 'Step-by-Step Encryption Walkthrough'}
          </h1>
        </div>
        <ModeSelector activeMode={viewMode} onChange={onViewModeChange} algorithm={algorithm} />
      </div>

      <ProgressBar steps={steps} currentStep={currentStep} />

      {algorithm === 'aes' ? (
        <AESVisualizer
          step={step}
          steps={steps}
          onGoToStep={navigation.goTo}
          isOverview={viewMode === 'overview'}
        />
      ) : viewMode === 'overview' ? (
        <Overview steps={steps} onJump={navigation.goTo} />
      ) : step?.phase === 'keyGen' ? (
        <KeyGenerationVisualizer step={step} steps={steps} onGoToStep={navigation.goTo} />
      ) : (
        <EncryptionVisualizer step={step} />
      )}

      <StepNavigation steps={steps} currentStep={currentStep} navigation={navigation} />
    </div>
  );
}
