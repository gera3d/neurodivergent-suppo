import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ElementType
}

interface AnimatedTabsProps {
  tabs: Tab[]
  children: (activeTab: string) => React.ReactNode
  className?: string
}

export function AnimatedTabs({ tabs, children, className }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-2 border-b border-border/50 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-6 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <tab.icon size={18} />}
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 rounded-t-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBorder"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {children(activeTab)}
      </motion.div>
    </div>
  )
}
