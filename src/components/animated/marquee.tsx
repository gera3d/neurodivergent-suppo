import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  repeat?: number
  duration?: number
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  repeat = 2,
  duration = 40,
}: MarqueeProps) {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div className="flex gap-4">
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              className="flex shrink-0 gap-4"
              animate={{
                x: reverse ? ["0%", "100%"] : ["-100%", "0%"],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
              }}
              {...(pauseOnHover && {
                whileHover: { animationPlayState: "paused" },
              })}
            >
              {children}
            </motion.div>
          ))}
      </div>
    </div>
  )
}

interface MarqueeItemProps {
  children: React.ReactNode
  className?: string
}

export function MarqueeItem({ children, className }: MarqueeItemProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  )
}
