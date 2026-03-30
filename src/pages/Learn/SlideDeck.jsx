/*
 * AUDIT LOG - SlideDeck.jsx
 * [BUG] Navigation could be spammed during transitions -> FIXED (lock buttons while animating).
 * [BUG] Visuals could not jump via pipeline map -> FIXED.
 * [BUG] Slide index could go out of range when switching algorithms -> FIXED (clamp on slide change).
 */
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SlideDeck({ slides = [], initialSlideId, onSlideChange, trace }) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!initialSlideId || !slides.length) return;
    const targetIndex = slides.findIndex((slide) => slide.id === initialSlideId);
    if (targetIndex >= 0) {
      setIndex(targetIndex);
      setIsAnimating(false);
    }
  }, [initialSlideId, slides]);

  useEffect(() => {
    if (!slides.length) return;
    if (index > slides.length - 1) {
      setIndex(0);
      setIsAnimating(false);
      return;
    }
    onSlideChange?.(slides[index] || slides[0]);
  }, [index, onSlideChange, slides]);

  const current = slides[index] || slides[0];
  const progressLabel = useMemo(
    () => (slides.length ? `${index + 1} / ${slides.length}` : '0 / 0'),
    [index, slides.length],
  );

  const goNext = () => {
    if (!slides.length || isAnimating) return;
    const nextIndex = Math.min(index + 1, slides.length - 1);
    setIndex(nextIndex);
    setIsAnimating(true);
  };

  const goPrev = () => {
    if (!slides.length || isAnimating) return;
    const prevIndex = Math.max(index - 1, 0);
    setIndex(prevIndex);
    setIsAnimating(true);
  };

  const goToId = (id) => {
    if (!slides.length || isAnimating) return;
    const targetIndex = slides.findIndex((slide) => slide.id === id);
    if (targetIndex >= 0) {
      setIndex(targetIndex);
      setIsAnimating(true);
    }
  };

  if (!current) {
    return (
      <div className="learn-deck">
        <div className="learn-deck__header">
          <div className="learn-deck__title">No slides available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="learn-deck">
      <div className="learn-deck__header">
        <div>
          <div className="learn-deck__title">{current.title}</div>
          <div className="learn-deck__subtitle">{current.subtitle}</div>
        </div>
        <div className="learn-deck__progress">
          <span>{progressLabel}</span>
        </div>
      </div>

      <div className="learn-deck__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onAnimationComplete={() => setIsAnimating(false)}
            className="learn-slide"
          >
            <div className="learn-slide__visual">
              {typeof current.visual === 'function'
                ? current.visual({ trace, onJump: goToId })
                : current.visual}
            </div>
            <p className="learn-slide__body">{current.body}</p>
            {current.quiz ? <div className="learn-slide__quiz">{current.quiz}</div> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="learn-deck__nav">
        <button type="button" className="btn-secondary" onClick={goPrev} disabled={index === 0 || isAnimating}>
          Previous
        </button>
        <div className="learn-deck__dots">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.id}
              type="button"
              className={`learn-dot ${dotIndex === index ? 'learn-dot--active' : ''}`}
              onClick={() => {
                if (isAnimating) return;
                setIndex(dotIndex);
                setIsAnimating(true);
              }}
              aria-label={`Go to slide ${dotIndex + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={goNext}
          disabled={index === slides.length - 1 || isAnimating}
        >
          Next
        </button>
      </div>
    </div>
  );
}
