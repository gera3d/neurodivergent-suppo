import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AnimatedBeamProps {
  className?: string
  duration?: number
  delay?: number
}

export function AnimatedBeam({ className = '', duration = 3, delay = 0 }: AnimatedBeamProps) {
  return (
    <motion.div
      className={`h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    />
  )
}

export function AnimatedGradientBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: [
            'linear-gradient(0deg, var(--primary), var(--secondary), var(--accent), var(--primary))',
            'linear-gradient(360deg, var(--primary), var(--secondary), var(--accent), var(--primary))',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  )
}
