import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Users, Handshake, Sparkle, ShieldCheck, CalendarBlank, ChatCircle, CheckCircle, TrendUp, ArrowRight, Star } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import logo from '@/assets/images/neuroconnect_logo_vector_smooth_preview.png'

interface WaitlistEntry {
  id: string
  name: string
  email: string
  role: string
  timestamp: number
}

function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf620_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf620_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <motion.div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          delay: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
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

export default function App() {
  const [waitlist, setWaitlist] = useKV<WaitlistEntry[]>('waitlist', [])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; role?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!role) {
      newErrors.role = 'Please select your role'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const currentWaitlist = waitlist || []
    const emailExists = currentWaitlist.some(entry => entry.email.toLowerCase() === email.toLowerCase())
    
    if (emailExists) {
      toast.success("You're already on the list!", {
        description: "We'll notify you as soon as NeuroConnect launches."
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newEntry: WaitlistEntry = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        timestamp: Date.now()
      }

      await setWaitlist((current) => [...(current || []), newEntry])

      toast.success('Welcome to the NeuroConnect family!', {
        description: "You're on the waiting list. We'll keep you updated on our launch."
      })

      setName('')
      setEmail('')
      setRole('')
      setErrors({})
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, -50])

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: custom * 0.1,
        ease: [0.25, 0.4, 0.25, 1]
      }
    })
  }

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="NeuroConnect" className="h-10 sm:h-12 w-auto" />
          </div>
          <Button onClick={scrollToWaitlist} className="shadow-lg hover:shadow-xl transition-all group">
            Join Waiting List
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.header>

      <main className="pt-16">
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <AnimatedGridBackground />
          <FloatingOrbs />
          
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20"
          >
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                custom={0}
              >
                <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
                  <Star size={14} className="mr-1.5 inline" weight="fill" />
                  Launching 2025
                </Badge>
              </motion.div>

              <motion.h1 
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                custom={1}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight"
              >
                Connecting Families with{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Specialized Care
                  </span>
                  <motion.div 
                    className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-xl -z-10"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
                {' '}for Neurodivergent Children
              </motion.h1>

              <motion.p 
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                custom={2}
                className="text-xl sm:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto font-light"
              >
                Finding the right support shouldn't take months. NeuroConnect matches families of children with ASD, dyslexia, and developmental disorders to qualified professionals—including alternative treatment specialists—in minutes.
              </motion.p>

              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                custom={3}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button 
                  size="lg" 
                  onClick={scrollToWaitlist} 
                  className="text-base px-10 py-6 shadow-2xl hover:shadow-primary/25 transition-all group relative overflow-hidden"
                >
                  <span className="relative z-10">Join the Waiting List</span>
                  <ArrowRight size={20} className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="border-2 px-10 py-6 backdrop-blur-sm hover:bg-primary/5 transition-colors"
                >
                  Learn More
                </Button>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                custom={4}
                className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-primary" weight="fill" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-primary" weight="fill" />
                  <span>Vetted Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-primary" weight="fill" />
                  <span>Alternative Treatments</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2"
            >
              <motion.div 
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </motion.div>
          </div>
        </section>

        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">The Challenge Families Face</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Real data shows the urgent need for better access to specialized care
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
            >
              {[
                { 
                  icon: TrendUp, 
                  stat: "1 in 36", 
                  label: "Children are diagnosed with autism spectrum disorder (ASD) in the U.S., according to the CDC (2023)",
                  gradient: "from-primary to-secondary",
                },
                { 
                  icon: CalendarBlank, 
                  stat: <><StatCounter end={6} suffix="+ months" /></>, 
                  label: "Average wait time for developmental pediatrician appointments (Autism Speaks, 2023)",
                  gradient: "from-secondary to-accent",
                },
                { 
                  icon: Users, 
                  stat: <><StatCounter end={73} suffix="%" /></>, 
                  label: "Of parents report difficulty finding appropriate services for their neurodivergent child (NCLD, 2022)",
                  gradient: "from-accent to-primary",
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpVariants}
                >
                  <Card className="relative group border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden h-full will-change-transform">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    <CardContent className="pt-8 text-center relative">
                      <motion.div 
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 shadow-lg`}
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <item.icon size={36} className="text-white" weight="bold" />
                      </motion.div>
                      <div className={`text-5xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-4`}>
                        {item.stat}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#8b5cf610_0%,transparent_65%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">How NeuroConnect Helps</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive platform designed specifically for neurodivergent families
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
            >
              {[
                {
                  icon: Handshake,
                  title: "Smart Professional Matching",
                  description: "Our algorithm connects you with specialists based on your child's unique needs, location, and preferred treatment approaches—conventional or alternative.",
                  color: "primary",
                },
                {
                  icon: Sparkle,
                  title: "Alternative Treatment Options",
                  description: "Access to yoga therapists, acupuncturists, sensory integration specialists, and other holistic practitioners alongside traditional therapies.",
                  color: "secondary",
                },
                {
                  icon: ChatCircle,
                  title: "Seamless Communication",
                  description: "Secure messaging, video consultations, and appointment scheduling all in one place. No more juggling multiple platforms.",
                  color: "accent",
                },
                {
                  icon: ShieldCheck,
                  title: "Privacy & Security",
                  description: "HIPAA-compliant platform ensuring your family's sensitive information is protected with enterprise-grade security.",
                  color: "primary",
                },
                {
                  icon: Users,
                  title: "Community Support",
                  description: "Connect with other families, share experiences, and access expert-curated resources on coping strategies and skill development.",
                  color: "secondary",
                },
                {
                  icon: CalendarBlank,
                  title: "Faster Access to Care",
                  description: "Reduce months-long wait times to days. Find available professionals quickly and book consultations that fit your schedule.",
                  color: "accent",
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpVariants}
                >
                  <Card className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-primary/10 will-change-transform">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
                    <CardContent className="pt-8 relative">
                      <motion.div 
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10 mb-5`}
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <feature.icon size={32} className={`text-${feature.color}`} weight="duotone" />
                      </motion.div>
                      <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]"
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, delay: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">Built for the Neurodivergent Community</h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                NeuroConnect isn't just another healthcare app. It's a platform designed specifically for families navigating autism, dyslexia, ADHD, and other developmental differences. We understand that one size doesn't fit all, which is why we emphasize personalized matching and celebrate both traditional and alternative treatment approaches.
              </p>
              <motion.div 
                className="flex flex-wrap justify-center gap-3 mb-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainerVariants}
              >
                {[
                  { label: "Speech Therapy", gradient: "from-primary to-primary" },
                  { label: "Sensory Integration", gradient: "from-secondary to-secondary" },
                  { label: "Behavioral Support", gradient: "from-accent to-accent" },
                  { label: "Yoga & Mindfulness", gradient: "from-primary to-secondary" },
                  { label: "Occupational Therapy", gradient: "from-secondary to-accent" },
                  { label: "Acupuncture", gradient: "from-accent to-primary" }
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUpVariants}
                  >
                    <Badge 
                      variant="secondary" 
                      className={`text-sm px-5 py-2.5 bg-gradient-to-r ${badge.gradient} text-white border-0 hover:scale-105 transition-transform cursor-default shadow-lg`}
                    >
                      {badge.label}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="waitlist" className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Join the Waiting List</h2>
              <p className="text-xl text-muted-foreground">
                Be among the first to know when NeuroConnect launches. Early access coming soon.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              custom={1}
            >
              <Card className="relative border-2 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <CardContent className="pt-8 relative">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-2.5 h-14 text-base border-2 border-border/50 focus:border-primary bg-background/50 backdrop-blur-sm transition-colors duration-300"
                        disabled={isSubmitting}
                      />
                      {errors.name && <p className="text-destructive text-sm mt-2 flex items-center gap-1"><span>⚠</span>{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="mt-2.5 h-14 text-base border-2 border-border/50 focus:border-primary bg-background/50 backdrop-blur-sm transition-colors duration-300"
                        disabled={isSubmitting}
                      />
                      {errors.email && <p className="text-destructive text-sm mt-2 flex items-center gap-1"><span>⚠</span>{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="role" className="text-base font-medium">I am a...</Label>
                      <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
                        <SelectTrigger className="mt-2.5 h-14 text-base border-2 border-border/50 focus:border-primary bg-background/50 backdrop-blur-sm transition-colors duration-300" id="role">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent/Guardian</SelectItem>
                          <SelectItem value="professional">Healthcare Professional</SelectItem>
                          <SelectItem value="educator">Educator/Therapist</SelectItem>
                          <SelectItem value="advocate">Advocate/Organization</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role && <p className="text-destructive text-sm mt-2 flex items-center gap-1"><span>⚠</span>{errors.role}</p>}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 text-base shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                      disabled={isSubmitting}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.span
                              key="submitting"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              <span className="animate-spin mr-2">⏳</span>
                              Joining...
                            </motion.span>
                          ) : (
                            <motion.span
                              key="submit"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              <CheckCircle size={22} className="mr-2" weight="bold" />
                              Join Waiting List
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "When will NeuroConnect launch?",
                    answer: "We're planning to launch in 2025. Waiting list members will receive early access and be notified before our public launch. We're currently in development and working with neurodivergent families and professionals to ensure we build the right solution."
                  },
                  {
                    question: "Who can use NeuroConnect?",
                    answer: "NeuroConnect serves two main groups: families with neurodivergent children (including those with ASD, dyslexia, ADHD, and other developmental disorders) and qualified professionals who specialize in supporting neurodivergent individuals. This includes traditional therapists, educators, and alternative treatment practitioners."
                  },
                  {
                    question: "What types of professionals will be available?",
                    answer: "We'll feature a diverse range of specialists including speech therapists, occupational therapists, behavioral therapists, developmental pediatricians, sensory integration specialists, yoga instructors, mindfulness coaches, acupuncturists, and other alternative treatment providers. All professionals will be vetted and properly credentialed."
                  },
                  {
                    question: "How much will NeuroConnect cost?",
                    answer: "We're finalizing our pricing model to ensure accessibility for families while fairly compensating professionals. We're exploring options including free basic access with premium features, subscription tiers, and potential partnerships with insurance providers. Early access members will receive special pricing."
                  },
                  {
                    question: "Is my family's information secure?",
                    answer: "Absolutely. NeuroConnect will be HIPAA-compliant with enterprise-grade security measures to protect your family's sensitive health information. All communications are encrypted, and we'll never share your data with third parties without explicit consent."
                  },
                  {
                    question: "Will NeuroConnect be available in my area?",
                    answer: "We're launching initially in select regions of the United States, with plans for rapid expansion based on demand. The platform will also support virtual consultations, allowing you to connect with professionals regardless of geographic location. Let us know your location when you join the waiting list!"
                  },
                  {
                    question: "How is NeuroConnect different from other healthcare platforms?",
                    answer: "Unlike general healthcare platforms, NeuroConnect is exclusively focused on the neurodivergent community. We understand the unique challenges families face, celebrate both traditional and alternative treatment approaches, emphasize personalized matching, and provide community support features designed specifically for this population."
                  }
                ].map((faq, index) => (
                  <motion.div key={index} variants={fadeInUpVariants}>
                    <AccordionItem 
                      value={`item-${index}`} 
                      className="group border-2 border-border/50 rounded-2xl px-8 hover:border-primary/50 transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5 backdrop-blur-sm"
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
            </motion.div>
          </div>
        </section>

        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/20 rounded-full blur-[128px]"
              animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/20 rounded-full blur-[128px]"
              animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-white">Help Us Build Something Better</h2>
              <p className="text-xl mb-10 leading-relaxed text-white/90 max-w-3xl mx-auto">
                NeuroConnect is being built with input from families, professionals, and advocates in the neurodivergent community. Your early support helps us create a platform that truly serves your needs.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={scrollToWaitlist}
                className="text-base px-12 py-7 shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all bg-white text-primary hover:bg-white/95 font-semibold"
              >
                Join the Waiting List Today
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden border-t border-border/50 py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <img src={logo} alt="NeuroConnect" className="h-12 w-auto mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering neurodivergent families through accessible, specialized care connections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground text-lg">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">CDC Autism Statistics</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Autism Speaks</li>
                <li className="hover:text-primary transition-colors cursor-pointer">NCLD Resources</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Understood.org</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground text-lg">Contact</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Questions? We'd love to hear from you.
              </p>
              <p className="text-sm text-primary font-medium hover:underline cursor-pointer">hello@neuroconnect.app</p>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 NeuroConnect. All rights reserved.</p>
            <p className="mt-2">Built with <span className="text-primary">❤️</span> for the neurodivergent community</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
