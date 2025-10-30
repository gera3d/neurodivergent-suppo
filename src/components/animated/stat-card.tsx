import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: React.ElementType
  stat?: string | number
  suffix?: string
  label: string
  gradient: string
  index: number
  countTo?: number
}

function StatCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOutCubic * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isInView])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export function StatCard({ icon: Icon, stat, suffix, label, gradient, index, countTo }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      <Card className="relative group border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden h-full">
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
          initial={false}
          animate={{ 
            background: [
              `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
              `linear-gradient(225deg, var(--secondary) 0%, var(--accent) 100%)`,
              `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <CardContent className="pt-8 text-center relative">
          <motion.div 
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ 
              scale: { type: "spring", stiffness: 400, damping: 17 },
              rotate: { duration: 0.5 }
            }}
          >
            <Icon size={36} className="text-white" weight="bold" />
          </motion.div>
          <div className={`text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-4`}>
            {countTo ? <StatCounter end={countTo} suffix={suffix} /> : stat}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
