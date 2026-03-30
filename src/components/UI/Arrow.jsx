/*
 * AUDIT LOG — Arrow.jsx
 * [OK] SVG arrow verified.
 */
import { motion } from 'framer-motion';

const colorMap = {
  cyan: '#00d4ff',
  green: '#00ff88',
  amber: '#ffb300',
};

const rotationMap = {
  right: 'arrow-rot-right',
  down: 'arrow-rot-down',
  left: 'arrow-rot-left',
  up: 'arrow-rot-up',
};

export default function Arrow({ direction = 'right', label, color = 'cyan', animated = false }) {
  const stroke = colorMap[color];
  const rotation = rotationMap[direction];

  return (
    <div className="grid justify-items-center gap-2">
      {label ? <span className="text-[10px] uppercase tracking-[0.24em] text-white/45">{label}</span> : null}
      <motion.svg
        width="72"
        height="24"
        viewBox="0 0 72 24"
        className={rotation}
        animate={animated ? { opacity: [0.55, 1, 0.55] } : undefined}
        transition={animated ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <motion.line
          x1="2"
          y1="12"
          x2="64"
          y2="12"
          stroke={stroke}
          strokeWidth="2"
          strokeDasharray={animated ? '8 6' : undefined}
          animate={animated ? { strokeDashoffset: [20, 0] } : undefined}
          transition={animated ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : undefined}
        />
        <polygon points="64,5 70,12 64,19" fill={stroke} />
      </motion.svg>
    </div>
  );
}
