/*
 * AUDIT LOG - PracticePage.jsx
 * [BUG] Key length and ciphertext validation were missing -> FIXED (strict length checks for DES/AES).
 * [BUG] Copy action had no confirmation state -> FIXED.
 * [BUG] Missing Learn jump and comparison panel -> FIXED.
 * [BUG] Non-ASCII status icons rendered as garbled text -> FIXED.
 * [BUG] Visualization could crash when steps were unavailable -> FIXED (disable/hide visualizer on missing steps).
 * [WARN] Visualization is disabled for AES decrypt mode to avoid inconsistent step playback -> NOTED.
 */
import { useEffect, useMemo, useState } from 'react';
import DESVisualizer from '../../components/DESVisualizer';
import { runPracticeCrypto } from '../../utils/cryptoPractice';
import {
  bitsToHex,
  hexToBits,
  hexToBitsWithLength,
  isLikelyHexBlock,
  isLikelyHexBlockOfLength,
  stringToBits,
  stringToBitsWithLength,
} from '../../utils/binary';

function previewBits(value, algorithm) {
  if (!value) return [];
  if (algorithm === 'aes') {
    const trimmed = value.trim();
    if (
      isLikelyHexBlockOfLength(trimmed, 32)
      || isLikelyHexBlockOfLength(trimmed, 48)
      || isLikelyHexBlockOfLength(trimmed, 64)
    ) {
      return hexToBitsWithLength(trimmed, trimmed.length);
    }
    const length = [16, 24, 32].includes(value.length) ? value.length : 16;
    return stringToBitsWithLength(value, length);
  }
  return isLikelyHexBlock(value.trim()) ? hexToBits(value.trim()) : stringToBits(value);
}

function isHexString(value) {
  return /^[0-9a-fA-F]+$/.test(value || '');
}

function validateKey(value, algorithm) {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Key is required.';
  if (algorithm === 'des') {
    if (isLikelyHexBlock(trimmed)) return null;
    if (!isHexString(trimmed) && trimmed.length === 8) return null;
    return 'DES key must be 8 ASCII characters or 16 hex characters.';
  }

  if (
    isLikelyHexBlockOfLength(trimmed, 32)
    || isLikelyHexBlockOfLength(trimmed, 48)
    || isLikelyHexBlockOfLength(trimmed, 64)
  ) {
    return null;
  }
  if (!isHexString(trimmed) && [16, 24, 32].includes(trimmed.length)) return null;
  return 'AES key must be 16/24/32 ASCII characters or 32/48/64 hex characters.';
}

function validateInput(value, algorithm, mode) {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Input is required.';

  if (mode === 'decrypt') {
    const expectedHex = algorithm === 'aes' ? 32 : 16;
    if (!isHexString(trimmed) || trimmed.length !== expectedHex) {
      return `Decryption expects a ${expectedHex}-hex-character ciphertext block.`;
    }
    return null;
  }

  if (algorithm === 'aes') {
    if (isLikelyHexBlockOfLength(trimmed, 32)) return null;
    if (!isHexString(trimmed) && trimmed.length <= 16) return null;
    return 'AES plaintext must be 16 ASCII characters max or a 32-hex-character block.';
  }

  if (isLikelyHexBlock(trimmed)) return null;
  if (!isHexString(trimmed) && trimmed.length <= 8) return null;
  return 'DES plaintext must be 8 ASCII characters max or a 16-hex-character block.';
}

export default function PracticePage({
  algorithm,
  setAlgorithm,
  plaintext,
  setPlaintext,
  keyValue,
  setKey,
  mode,
  setMode,
  steps,
  navigation,
  viewMode,
  onViewModeChange,
  onLearnJump,
}) {
  const isAES = algorithm === 'aes';
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suppressOutput, setSuppressOutput] = useState(false);

  useEffect(() => {
    setSuppressOutput(true);
    setCopied(false);
  }, [mode]);

  useEffect(() => {
    setSuppressOutput(false);
  }, [plaintext, keyValue]);

  const validation = useMemo(() => {
    const errors = [];
    const inputError = validateInput(plaintext, algorithm, mode);
    if (inputError) errors.push(inputError);
    const keyError = validateKey(keyValue, algorithm);
    if (keyError) errors.push(keyError);
    return errors;
  }, [algorithm, keyValue, mode, plaintext]);

  const output = useMemo(() => {
    if (validation.length) return null;
    try {
      return runPracticeCrypto({ algorithm, mode, input: plaintext, key: keyValue });
    } catch (err) {
      return { error: err.message };
    }
  }, [algorithm, keyValue, mode, plaintext, validation.length]);

  const hasSteps = steps && steps.length > 0;
  const hasErrors = validation.length > 0 || Boolean(output?.error);
  const plaintextBits = previewBits(plaintext, algorithm);
  const keyBits = previewBits(keyValue, algorithm);

  useEffect(() => {
    if (!hasSteps || hasErrors) {
      setShowVisualizer(false);
    }
  }, [hasErrors, hasSteps]);

  return (
    <div className="practice-page">
      <div className="practice-header">
        <div>
          <div className="practice-eyebrow">Practice</div>
          <h2 className="practice-title">{isAES ? 'AES-128 Practice Lab' : 'DES Practice Lab'}</h2>
          <p className="practice-subtitle">
            Encrypt or decrypt a single block, then jump into the visualization to see the algorithm step by step.
          </p>
        </div>
      </div>

      <div className="practice-grid">
        <div className="panel practice-panel">
          <div className="practice-row">
            <div className="practice-label">Algorithm</div>
            <div className="practice-toggle">
              <button
                type="button"
                className={`practice-toggle__btn ${algorithm === 'des' ? 'active' : ''}`}
                onClick={() => setAlgorithm('des')}
              >
                DES
              </button>
              <button
                type="button"
                className={`practice-toggle__btn ${algorithm === 'aes' ? 'active' : ''}`}
                onClick={() => setAlgorithm('aes')}
              >
                AES-128
              </button>
            </div>
            <button
              type="button"
              className="practice-info"
              onClick={() =>
                onLearnJump({
                  algorithm,
                  plaintext,
                  key: keyValue,
                  stepId: algorithm === 'aes' ? 'aes-map' : 'des-map',
                })
              }
            >
              How does this work?
            </button>
          </div>

          <div className="practice-row">
            <div className="practice-label">Mode</div>
            <div className="practice-toggle">
              <button
                type="button"
                className={`practice-toggle__btn ${mode === 'encrypt' ? 'active' : ''}`}
                onClick={() => setMode('encrypt')}
              >
                Encrypt
              </button>
              <button
                type="button"
                className={`practice-toggle__btn ${mode === 'decrypt' ? 'active' : ''}`}
                onClick={() => setMode('decrypt')}
              >
                Decrypt
              </button>
            </div>
          </div>

          <label className="practice-field">
            <span>{mode === 'decrypt' ? 'Ciphertext' : 'Plaintext'}</span>
            <input
              value={plaintext}
              onChange={(event) => setPlaintext(event.target.value)}
              placeholder={isAES ? 'Two One Nine Two or 00112233445566778899AABBCCDDEEFF' : 'Hello! or 0123456789ABCDEF'}
            />
          </label>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              onLearnJump({
                algorithm,
                plaintext,
                key: keyValue,
                stepId: algorithm === 'aes' ? 'aes-input-setup' : 'des-input-setup',
              })
            }
          >
            Show me this step
          </button>

          <label className="practice-field">
            <span>Key</span>
            <input
              value={keyValue}
              onChange={(event) => setKey(event.target.value)}
              placeholder={isAES ? 'Thats my Kung Fu or 000102030405060708090A0B0C0D0E0F' : 'DESKEY01 or 133457799BBCDFF1'}
            />
          </label>

          {validation.length ? (
            <div className="practice-errors">
              {validation.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          ) : null}

          {output?.error ? <div className="practice-errors">{output.error}</div> : null}

          <div className="practice-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowVisualizer((prev) => !prev)}
              disabled={mode === 'decrypt' || !hasSteps || hasErrors}
            >
              {showVisualizer ? 'Hide Visualization' : 'Visualize Steps'}
            </button>
          </div>
        </div>

        <div className="panel practice-panel">
          <div className="practice-output">
            <div className="practice-output__header">
              <div className="practice-label">Output</div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (output?.hex) {
                    navigator.clipboard?.writeText(output.hex);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }
                }}
                disabled={!output?.hex}
              >
                {copied ? 'Copied!' : 'Copy Hex'}
              </button>
            </div>
            <div className="practice-output__box">
              {suppressOutput ? 'Output cleared. Update input to recalculate.' : output?.hex || 'Output will appear here'}
            </div>
            <div className="practice-output__sub">
              <span>ASCII:</span>
              <span>{suppressOutput ? '...' : output?.ascii || '...'}</span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                onLearnJump({
                  algorithm,
                  plaintext: output?.hex || plaintext,
                  key: keyValue,
                  stepId: algorithm === 'aes' ? 'aes-final' : 'des-final',
                })
              }
              disabled={!output?.hex}
            >
              Show me this step
            </button>
          </div>

          <div className="practice-preview">
            <div className="practice-label">Live Preview</div>
            <div className="practice-preview__row">
              <div>
                <div className="practice-preview__title">Input Bits</div>
                <div className="practice-preview__value">{plaintextBits.length ? bitsToHex(plaintextBits) : '--'}</div>
              </div>
              <div>
                <div className="practice-preview__title">Key Bits</div>
                <div className="practice-preview__value">{keyBits.length ? bitsToHex(keyBits) : '--'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel practice-panel comparison-panel">
        <div className="practice-label">DES vs AES</div>
        <div className="comparison-table">
          <div className="comparison-row header">
            <span>Property</span>
            <span>DES</span>
            <span>AES-128 / 192 / 256</span>
          </div>
          <div className="comparison-row">
            <span>Block size</span>
            <span>64 bits</span>
            <span>128 bits</span>
          </div>
          <div className="comparison-row">
            <span>Key size</span>
            <span>56 bits (eff.)</span>
            <span>128 / 192 / 256 bits</span>
          </div>
          <div className="comparison-row">
            <span>Rounds</span>
            <span>16</span>
            <span>10 / 12 / 14</span>
          </div>
          <div className="comparison-row">
            <span>Structure</span>
            <span>Feistel</span>
            <span>Substitution-Permutation</span>
          </div>
          <div className="comparison-row">
            <span>Status</span>
            <span>Broken</span>
            <span>Secure</span>
          </div>
          <div className="comparison-row">
            <span>Year</span>
            <span>1977</span>
            <span>2001</span>
          </div>
        </div>
      </div>

      {showVisualizer ? (
        <div className="practice-visualizer">
          <DESVisualizer
            algorithm={algorithm}
            steps={steps}
            currentStep={navigation.currentStep}
            navigation={navigation}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      ) : null}
    </div>
  );
}
