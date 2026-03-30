/*
 * AUDIT LOG - LearnVisualFrame.jsx
 * [BUG] Non-ASCII control icons rendered as garbled symbols -> FIXED (ASCII labels).
 */
import { usePlayback } from './usePlayback';

export default function LearnVisualFrame({ title, subtitle, phases = 1, children, className = '' }) {
  const playback = usePlayback(phases);
  const { phase, isPlaying, speed, setSpeed, play, pause, reset } = playback;

  return (
    <div className={`learn-visual ${className} phase-${phase} ${isPlaying ? 'is-playing' : ''} speed-${speed}`}>
      <div className="learn-visual__header">
        <div>
          <div className="learn-visual__title" title={title}>
            {title}
          </div>
          {subtitle ? (
            <div className="learn-visual__subtitle" title={subtitle}>
              {subtitle}
            </div>
          ) : null}
        </div>
        <div className="learn-visual__controls">
          <div className="learn-visual__counter">Step {phase + 1} of {phases}</div>
          <div className="learn-visual__buttons">
            <button type="button" className="btn-secondary" onClick={play} disabled={isPlaying}>
              Play
            </button>
            <button type="button" className="btn-secondary" onClick={pause} disabled={!isPlaying}>
              Pause
            </button>
            <button type="button" className="btn-secondary" onClick={reset}>
              Reset
            </button>
          </div>
          <label className="learn-visual__speed">
            <span>Speed</span>
            <select value={speed} onChange={(event) => setSpeed(event.target.value)}>
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </label>
        </div>
      </div>
      <div className="learn-visual__body">
        {typeof children === 'function' ? children(playback) : children}
      </div>
    </div>
  );
}
