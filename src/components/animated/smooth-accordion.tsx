import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

interface SmoothAccordionProps {
  items: FAQItem[]
}

export function SmoothAccordion({ items }: SmoothAccordionProps) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {items.map((faq, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98]
          }}
        >
          <AccordionItem 
            value={`item-${index}`} 
            className="group border-2 border-border/50 rounded-2xl px-8 hover:border-primary/50 transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 backdrop-blur-sm data-[state=open]:shadow-lg data-[state=open]:shadow-primary/10"
          >
            <AccordionTrigger className="text-lg font-semibold hover:text-primary py-6 hover:no-underline transition-colors duration-300">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  )
}
