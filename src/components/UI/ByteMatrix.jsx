/*
 * AUDIT LOG — ByteMatrix.jsx
 * [OK] Matrix rendering verified.
 */
function toMatrix(bytes) {
  if (!bytes) return null;
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

export default function ByteMatrix({ bytes, label, color = 'cyan' }) {
  const matrix = toMatrix(bytes);
  const colorClasses = {
    cyan: 'border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan',
    green: 'border-cyber-green/30 bg-cyber-green/10 text-cyber-green',
    amber: 'border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber',
  };

  if (!matrix) return null;

  return (
    <div className={`rounded-3xl border p-3 ${colorClasses[color]}`}>
      {label ? <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/70">{label}</div> : null}
      <div className="grid grid-cols-4 gap-1">
        {matrix.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-black/20 font-mono text-[11px] text-white"
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
