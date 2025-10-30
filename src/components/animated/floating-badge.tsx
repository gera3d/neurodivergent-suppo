import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Star } from '@phosphor-icons/react'

export function FloatingBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Badge 
          variant="outline" 
          className="border-primary/50 text-primary bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium shadow-lg shadow-primary/20"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star size={14} className="mr-1.5 inline" weight="fill" />
          </motion.div>
          Launching 2025
        </Badge>
      </motion.div>
    </motion.div>
  )
}
