/*
 * AUDIT LOG - useStepNavigation.js
 * [BUG] Next could set index to -1 when totalSteps=0 -> FIXED (guard + clamp).
 * [BUG] Index not clamped when step count changes -> FIXED (sync on totalSteps change).
 */
import { useCallback, useEffect, useState } from 'react';

export function useStepNavigation(totalSteps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = useCallback(() => {
    if (totalSteps <= 0) return;
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    if (totalSteps <= 0) return;
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [totalSteps]);

  const goTo = useCallback(
    (index) => {
      if (totalSteps <= 0) {
        setCurrentStep(0);
        return;
      }
      setCurrentStep(Math.max(0, Math.min(index, totalSteps - 1)));
    },
    [totalSteps],
  );

  useEffect(() => {
    if (totalSteps <= 0) {
      setCurrentStep(0);
      return;
    }
    setCurrentStep((prev) => Math.min(prev, totalSteps - 1));
  }, [totalSteps]);

  return {
    currentStep,
    isFirst: currentStep === 0,
    isLast: totalSteps <= 0 ? true : currentStep === totalSteps - 1,
    goNext,
    goPrev,
    goTo,
    progress: totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0,
  };
}
