/*
 * AUDIT LOG - LearnPage.jsx
 * [BUG] Live trace presets were overwritten by empty default values -> FIXED (only apply initialTrace when enabled).
 * [BUG] Algorithm switch forced presets even in live trace -> FIXED (do not override when live trace is on).
 */
import { useEffect, useMemo, useState } from 'react';
import SlideDeck from './SlideDeck';
import { getDESSlides } from './DESSlides';
import { getAESSlides } from './AESSlides';
import { runDES } from '../../utils/des';
import { runAES, AES_SBOX } from '../../utils/aes';
import { IP } from '../../constants/permutationTables';
import { isLikelyHexBlock, isLikelyHexBlockOfLength } from '../../utils/binary';

const DES_PRESET = {
  plaintext: '0123456789ABCDEF',
  key: '133457799BBCDFF1',
};

const AES_PRESET = {
  plaintext: '00112233445566778899AABBCCDDEEFF',
  key: '000102030405060708090A0B0C0D0E0F',
};

function validateTraceInput(plaintext, key, algorithm) {
  if (!plaintext || !key) return 'Plaintext and key are required.';
  if (algorithm === 'des') {
    if (!isLikelyHexBlock(plaintext.trim())) return 'DES trace expects a 16-hex-character plaintext.';
    if (!isLikelyHexBlock(key.trim())) return 'DES trace expects a 16-hex-character key.';
    return null;
  }
  if (!isLikelyHexBlockOfLength(plaintext.trim(), 32)) return 'AES trace expects a 32-hex-character plaintext.';
  if (!isLikelyHexBlockOfLength(key.trim(), 32)) return 'AES trace expects a 32-hex-character key.';
  return null;
}

export default function LearnPage({ algorithm, setAlgorithm, initialSlideId, initialTrace }) {
  const [activeSlide, setActiveSlide] = useState(null);
  const [liveTrace, setLiveTrace] = useState(Boolean(initialTrace?.enabled));
  const [plaintext, setPlaintext] = useState(
    initialTrace?.plaintext || (algorithm === 'aes' ? AES_PRESET.plaintext : DES_PRESET.plaintext),
  );
  const [key, setKey] = useState(
    initialTrace?.key || (algorithm === 'aes' ? AES_PRESET.key : DES_PRESET.key),
  );

  useEffect(() => {
    if (!initialTrace?.enabled) return;
    setLiveTrace(true);
    setPlaintext(initialTrace.plaintext);
    setKey(initialTrace.key);
  }, [initialTrace]);

  useEffect(() => {
    if (liveTrace) return;
    if (algorithm === 'aes') {
      setPlaintext(AES_PRESET.plaintext);
      setKey(AES_PRESET.key);
    } else {
      setPlaintext(DES_PRESET.plaintext);
      setKey(DES_PRESET.key);
    }
  }, [algorithm, liveTrace]);

  const traceError = useMemo(() => {
    if (!liveTrace) return null;
    return validateTraceInput(plaintext, key, algorithm);
  }, [algorithm, key, liveTrace, plaintext]);

  const trace = useMemo(() => {
    const usePlaintext = liveTrace
      ? plaintext.trim()
      : algorithm === 'aes'
        ? AES_PRESET.plaintext
        : DES_PRESET.plaintext;
    const useKey = liveTrace ? key.trim() : algorithm === 'aes' ? AES_PRESET.key : DES_PRESET.key;
    let result;
    try {
      result = algorithm === 'aes' ? runAES(usePlaintext, useKey) : runDES(usePlaintext, useKey);
    } catch (err) {
      result = algorithm === 'aes' ? runAES(AES_PRESET.plaintext, AES_PRESET.key) : runDES(DES_PRESET.plaintext, DES_PRESET.key);
    }
    return {
      ...result,
      constants: {
        ip: IP,
        aesSBox: AES_SBOX,
      },
    };
  }, [algorithm, key, liveTrace, plaintext]);

  const slides = useMemo(() => {
    return algorithm === 'aes' ? getAESSlides(trace) : getDESSlides(trace);
  }, [algorithm, trace]);

  return (
    <div className="learn-page">
      <div className="learn-page__header">
        <div>
          <div className="learn-page__eyebrow">Learn</div>
          <h2 className="learn-page__title">{algorithm === 'aes' ? 'AES Learning Path' : 'DES Learning Path'}</h2>
          <p className="learn-page__subtitle">
            Follow the real data path with animated, bit-accurate visuals. Use Live Trace to plug in your own inputs.
          </p>
        </div>
        <div className="learn-page__tabs">
          <button
            type="button"
            className={`learn-tab ${algorithm === 'des' ? 'learn-tab--active' : ''}`}
            onClick={() => setAlgorithm('des')}
          >
            DES
          </button>
          <button
            type="button"
            className={`learn-tab ${algorithm === 'aes' ? 'learn-tab--active' : ''}`}
            onClick={() => setAlgorithm('aes')}
          >
            AES
          </button>
        </div>
      </div>

      <div className="live-trace">
        <div className="live-trace__header">
          <div>
            <h3 className="live-trace__title">Live Trace Mode</h3>
            <p className="live-trace__subtitle">Feed your own plaintext and key into every visual step.</p>
          </div>
          <label className="live-trace__toggle">
            <input type="checkbox" checked={liveTrace} onChange={(event) => setLiveTrace(event.target.checked)} />
            <span>Enable Live Trace</span>
          </label>
        </div>
        <div className="live-trace__form">
          <label>
            <span>Plaintext (hex)</span>
            <input value={plaintext} onChange={(event) => setPlaintext(event.target.value)} />
          </label>
          <label>
            <span>Key (hex)</span>
            <input value={key} onChange={(event) => setKey(event.target.value)} />
          </label>
          <div className="live-trace__actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setPlaintext(algorithm === 'aes' ? AES_PRESET.plaintext : DES_PRESET.plaintext);
                setKey(algorithm === 'aes' ? AES_PRESET.key : DES_PRESET.key);
              }}
            >
              Use Preset
            </button>
          </div>
        </div>
        {traceError ? <div className="live-trace__error">{traceError}</div> : null}
      </div>

      <SlideDeck
        slides={slides}
        initialSlideId={initialSlideId}
        onSlideChange={(slide) => setActiveSlide(slide)}
        trace={trace}
      />

      {activeSlide ? (
        <div className="learn-page__footer">
          <span>Current slide:</span>
          <strong>{activeSlide.title}</strong>
        </div>
      ) : null}
    </div>
  );
}
