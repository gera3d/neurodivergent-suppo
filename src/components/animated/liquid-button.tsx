import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface LiquidButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function LiquidButton({ 
  children, 
  className = '',
  ...props 
}: LiquidButtonProps) {
  return (
    <div className="relative inline-block">
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          background: [
            'linear-gradient(45deg, var(--primary), var(--secondary))',
            'linear-gradient(135deg, var(--secondary), var(--accent))',
            'linear-gradient(225deg, var(--accent), var(--primary))',
            'linear-gradient(315deg, var(--primary), var(--secondary))',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          filter: 'blur(8px)',
          opacity: 0.6,
        }}
      />
      <Button className={`relative ${className}`} {...props}>
        {children}
      </Button>
    </div>
  )
}
