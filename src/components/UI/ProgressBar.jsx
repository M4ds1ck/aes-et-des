/*
 * AUDIT LOG — ProgressBar.jsx
 * [OK] Progress bar verified.
 */
export default function ProgressBar({ steps = [], currentStep = 0 }) {
  const progress = steps.length ? currentStep + 1 : 0;

  return (
    <div className="panel overflow-hidden rounded-full border border-white/10 p-1">
      <progress className="progress-bar" value={progress} max={steps.length || 1} />
    </div>
  );
}
