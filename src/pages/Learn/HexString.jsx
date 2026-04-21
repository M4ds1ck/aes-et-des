/*
 * AUDIT LOG - HexString.jsx
 * [OK] Hex renderer for AES visuals.
 */
function chunk(items, size) {
  const groups = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
}

function toHexByte(value) {
  return value.toString(16).toUpperCase().padStart(2, '0');
}

export default function HexString({ bytes = [], group = 4, label, tooltip, color = 'green' }) {
  const groups = chunk(bytes, group);
  return (
    <div className={`bit-string bit-${color}`} title={tooltip || label}>
      {label ? <div className="bit-string__label">{label}</div> : null}
      <div className="bit-string__row">
        {groups.map((groupBytes, index) => (
          <div key={`hex-group-${index}`} className="bit-string__chunk">
            {groupBytes.map((value) => toHexByte(value)).join('')}
          </div>
        ))}
      </div>
    </div>
  );
}
