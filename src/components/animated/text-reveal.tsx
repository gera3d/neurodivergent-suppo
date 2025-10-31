import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface TextRevealProps {
  text: string
  className?: string
}

export function TextReveal({ text, className = '' }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"]
  })

  const words = text.split(' ')

  return (
    <div ref={ref} className={className}>
      <p className="flex flex-wrap gap-x-2 gap-y-1">
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          )
        })}
      </p>
    </div>
  )
}

interface WordProps {
  children: string
  progress: any
  range: [number, number]
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span className="relative">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }} className="text-foreground">
        {children}
      </motion.span>
    </span>
  )
}
