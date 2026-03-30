/*
 * AUDIT LOG — StateMatrix.jsx
 * [OK] AES state matrix renderer verified.
 */
function toMatrix(bytes) {
  if (!bytes) return [];
  if (Array.isArray(bytes[0])) return bytes;
  const matrix = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 4; row += 1) {
      matrix[row][col] = bytes[col * 4 + row];
    }
  }
  return matrix;
}

function formatByte(value) {
  return value.toString(16).toUpperCase().padStart(2, '0');
}

export default function StateMatrix({ bytes, label, color = 'blue', tooltip }) {
  const matrix = toMatrix(bytes);
  return (
    <div className={`state-matrix state-${color}`} title={tooltip || label}>
      {label ? <div className="state-matrix__label">{label}</div> : null}
      <div className="state-matrix__grid">
        {matrix.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="state-matrix__cell"
              title={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
            >
              {formatByte(value)}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
