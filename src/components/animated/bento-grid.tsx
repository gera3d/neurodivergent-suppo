import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  span?: 1 | 2 | 3
  background?: React.ReactNode
}

export function BentoCard({ children, className, span = 1, background }: BentoCardProps) {
  const spanClass = {
    1: "md:col-span-1",
    2: "md:col-span-2", 
    3: "md:col-span-3"
  }[span]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
        "hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5",
        spanClass,
        className
      )}
    >
      {background && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {background}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
