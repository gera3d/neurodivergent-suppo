import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface MagneticButtonProps {
  children: React.ReactNode
  magneticStrength?: number
  className?: string
  onClick?: () => void
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function MagneticButton({ 
  children, 
  magneticStrength = 0.3,
  className,
  ...props 
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current!.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * magneticStrength
    const y = (clientY - (top + height / 2)) * magneticStrength
    setPosition({ x, y })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 15, 
        mass: 0.1 
      }}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
