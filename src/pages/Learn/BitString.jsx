/*
 * AUDIT LOG — BitString.jsx
 * [OK] Bit rendering helper verified.
 */
function chunkBits(bits, size) {
  const chunks = [];
  for (let i = 0; i < bits.length; i += size) {
    chunks.push(bits.slice(i, i + size));
  }
  return chunks;
}

export default function BitString({ bits = [], group = 8, color = 'blue', label, tooltip, showIndices = false }) {
  const chunks = chunkBits(bits, group);
  const indices = showIndices ? bits.map((_, index) => index + 1) : [];
  return (
    <div className={`bit-string bit-${color}`} title={tooltip || label}>
      {label ? <div className="bit-string__label">{label}</div> : null}
      <div className="bit-string__row">
        {chunks.map((chunk, index) => (
          <div key={`chunk-${index}`} className="bit-string__chunk">
            {chunk.join('')}
          </div>
        ))}
      </div>
      {showIndices ? (
        <div className="bit-string__indices">
          {indices.map((value) => (
            <span key={`idx-${value}`}>{value}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
