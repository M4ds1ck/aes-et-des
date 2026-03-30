/*
 * AUDIT LOG - PipelineMap.jsx
 * [BUG] Map was forced closed by a hard-coded open={false} prop -> FIXED (toggle state).
 */
import { useState } from 'react';

export default function PipelineMap({ title, steps = [], currentId, onJump }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps.length) return null;

  return (
    <details
      className="pipeline-map"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="pipeline-map__summary" title="Toggle pipeline map">
        {title}
      </summary>
      <div className="pipeline-map__grid">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            className={`pipeline-map__node ${currentId === step.id ? 'active' : ''}`}
            onClick={() => onJump?.(step.id)}
            title={step.tooltip || step.label}
          >
            {step.label}
          </button>
        ))}
      </div>
    </details>
  );
}
