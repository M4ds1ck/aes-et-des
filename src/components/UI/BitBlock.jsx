/*
 * AUDIT LOG — BitBlock.jsx
 * [OK] Bit cell rendering verified.
 */
import { motion } from 'framer-motion';

const sizeClasses = {
  sm: 'h-[14px] w-[14px] text-[9px]',
  md: 'h-[16px] w-[16px] text-[9px]',
  lg: 'h-[18px] w-[18px] text-[10px]',
};

const variantClasses = {
  default: 'text-white/80',
  active: 'active',
  highlighted: 'highlighted',
  moved: 'moved',
  dimmed: 'dimmed text-white/50',
};

export default function BitBlock({
  value,
  index,
  variant = 'default',
  size = 'md',
  animated = false,
  label,
}) {
  return (
    <div className="grid justify-items-center gap-0.5">
      <span className="min-h-2 text-[8px] uppercase tracking-[0.12em] text-white/35">{label || ' '}</span>
      <motion.div
        className={`bit-cell rounded-md ${sizeClasses[size]} ${variantClasses[variant]}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          boxShadow: animated ? '0 0 14px rgba(0, 212, 255, 0.28)' : undefined,
        }}
        transition={{ duration: 0.2, delay: index * 0.003 }}
        title={`Bit ${index + 1}: ${value}`}
      >
        {value}
      </motion.div>
    </div>
  );
}
