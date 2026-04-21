/*
 * AUDIT LOG - App.jsx
 * [BUG] Keyboard navigation referenced removed state -> FIXED.
 * [BUG] Deep linking/back-button were unsupported -> FIXED (sync URL with section/algorithm).
 * [BUG] Learn trace default state overwrote presets with empty values -> FIXED (nullable trace + guard).
 * [BUG] Practice UI disappeared on transient step-builder errors -> FIXED (always render PracticePage with banner).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import LearnPage from './pages/Learn/LearnPage';
import PracticePage from './pages/Practice/PracticePage';
import { useCipherSteps } from './hooks/useCipherSteps';
import { useStepNavigation } from './hooks/useStepNavigation';

export default function App() {
  const [section, setSection] = useState('practice');
  const [algorithm, setAlgorithm] = useState('des');
  const [plaintext, setPlaintext] = useState('Hello!');
  const [key, setKey] = useState('DESKEY01');
  const [mode, setMode] = useState('encrypt');
  const [viewMode, setViewMode] = useState('overview');
  const [learnSlideId, setLearnSlideId] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [learnTrace, setLearnTrace] = useState(null);

  const { steps, error, pending } = useCipherSteps(algorithm, plaintext, key);
  const navigation = useStepNavigation(steps.length);

  const firstKeyStep = useMemo(() => steps.findIndex((step) => step.phase === 'keyGen'), [steps]);
  const firstEncryptionStep = useMemo(() => steps.findIndex((step) => step.phase === 'encryption'), [steps]);
  const currentStepData = steps[navigation.currentStep];

  useEffect(() => {
    if (algorithm === 'aes') {
      setPlaintext('Two One Nine Two');
      setKey('Thats my Kung Fu');
    } else {
      setPlaintext('Hello!');
      setKey('DESKEY01');
    }
    setViewMode('overview');
    navigation.goTo(0);
  }, [algorithm, navigation.goTo]);

  useEffect(() => {
    const parseLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const location = path + (hash ? `#${hash}` : '');
      const nextSection = location.includes('learn') ? 'learn' : 'practice';
      const nextAlgorithm = location.includes('aes') ? 'aes' : 'des';
      return { nextSection, nextAlgorithm };
    };

    const { nextSection, nextAlgorithm } = parseLocation();
    setSection(nextSection);
    setAlgorithm(nextAlgorithm);
    setBootstrapped(true);

    const handlePop = () => {
      const parsed = parseLocation();
      setSection(parsed.nextSection);
      setAlgorithm(parsed.nextAlgorithm);
    };
    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', handlePop);
    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('hashchange', handlePop);
    };
  }, []);

  useEffect(() => {
    if (!bootstrapped) return;
    const base = section === 'learn' ? `/learn/${algorithm}` : `/practice/${algorithm}`;
    window.history.pushState({}, '', base);
  }, [algorithm, bootstrapped, section]);

  const getViewModeForStep = useCallback((index) => {
    if (algorithm === 'aes') return 'encryption';
    return steps[index]?.phase === 'keyGen' ? 'keyGen' : 'encryption';
  }, [algorithm, steps]);

  const goToStep = useCallback((index) => {
    if (!steps.length || index < 0) return;
    navigation.goTo(index);
    setViewMode(getViewModeForStep(index));
  }, [getViewModeForStep, navigation, steps.length]);

  const goNextStep = useCallback(() => {
    if (!steps.length) return;
    const nextIndex = Math.min(navigation.currentStep + 1, steps.length - 1);
    navigation.goTo(nextIndex);
    setViewMode(getViewModeForStep(nextIndex));
  }, [getViewModeForStep, navigation, steps.length]);

  const goPrevStep = useCallback(() => {
    if (!steps.length) return;
    const prevIndex = Math.max(navigation.currentStep - 1, 0);
    navigation.goTo(prevIndex);
    setViewMode(getViewModeForStep(prevIndex));
  }, [getViewModeForStep, navigation, steps.length]);

  const handleViewModeChange = useCallback((modeValue) => {
    if (algorithm === 'aes') {
      setViewMode(modeValue);
      return;
    }

    if (modeValue === 'overview') {
      setViewMode('overview');
      return;
    }

    if (modeValue === 'keyGen') {
      const targetIndex =
        currentStepData?.phase === 'keyGen' ? navigation.currentStep : Math.max(firstKeyStep, 0);
      navigation.goTo(targetIndex);
      setViewMode('keyGen');
      return;
    }

    const targetIndex =
      currentStepData?.phase === 'encryption' ? navigation.currentStep : Math.max(firstEncryptionStep, 0);
    navigation.goTo(targetIndex);
    setViewMode('encryption');
  }, [algorithm, currentStepData?.phase, firstEncryptionStep, firstKeyStep, navigation, navigation.currentStep]);

  useEffect(() => {
    function onKeyDown(event) {
      if (section !== 'practice') return;
      if (event.key === 'ArrowLeft') goPrevStep();
      if (event.key === 'ArrowRight') goNextStep();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNextStep, goPrevStep, section]);

  return (
    <main className="min-h-screen pb-12">
      <header className="site-nav">
        <div className="site-nav__brand">Crypto Studio</div>
        <nav className="site-nav__tabs">
          <button
            type="button"
            className={`site-nav__tab ${section === 'learn' ? 'active' : ''}`}
            onClick={() => {
              setSection('learn');
              setLearnSlideId(null);
              setLearnTrace(null);
            }}
          >
            Learn
          </button>
          <button
            type="button"
            className={`site-nav__tab ${section === 'practice' ? 'active' : ''}`}
            onClick={() => setSection('practice')}
          >
            Practice
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6 lg:px-8">
        {section === 'learn' ? (
          <LearnPage
            algorithm={algorithm}
            setAlgorithm={(value) => {
              setAlgorithm(value);
              setLearnSlideId(null);
            }}
            initialSlideId={learnSlideId}
            initialTrace={learnTrace}
          />
        ) : (
          <>
            {error && !pending ? (
              <div className="mx-auto max-w-3xl rounded-3xl border border-cyber-red/40 bg-cyber-red/10 p-6 text-sm text-cyber-red">
                {error}
              </div>
            ) : null}
            <PracticePage
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              plaintext={plaintext}
              setPlaintext={setPlaintext}
              keyValue={key}
              setKey={setKey}
              mode={mode}
              setMode={setMode}
              steps={steps}
              navigation={{
                ...navigation,
                goNext: goNextStep,
                goPrev: goPrevStep,
                goTo: goToStep,
              }}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onLearnJump={({ algorithm: algo, plaintext: input, key: keyValue, stepId }) => {
                setAlgorithm(algo);
                setLearnSlideId(stepId || (algo === 'aes' ? 'aes-input-setup' : 'des-input-setup'));
                setLearnTrace({ enabled: true, plaintext: input, key: keyValue });
                setSection('learn');
              }}
            />
          </>
        )}
      </div>
    </main>
  );
}
