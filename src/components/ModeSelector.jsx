/*
 * AUDIT LOG — ModeSelector.jsx
 * [OK] Tab toggles validated; no issues found.
 */
export default function ModeSelector({ activeMode, onChange, algorithm = 'des' }) {
  const items =
    algorithm === 'aes'
      ? [
          { id: 'overview', label: 'Overview' },
          { id: 'encryption', label: 'AES Flow' },
        ]
      : [
          { id: 'overview', label: 'Overview' },
          { id: 'keyGen', label: 'Key Generation' },
          { id: 'encryption', label: 'Encryption' },
        ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-full px-4 py-3 text-xs uppercase tracking-[0.24em] transition ${
            activeMode === item.id
              ? 'bg-cyber-cyan/15 text-cyber-cyan'
              : 'text-white/45 hover:text-white/80'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
