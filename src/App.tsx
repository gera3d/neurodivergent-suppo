import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Users, Handshake, Sparkle, ShieldCheck, CalendarBlank, ChatCircle, CheckCircle, TrendUp, ArrowRight, Heart, Brain, Target } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import logo from '@/assets/images/neuroconnect_logo_vector_smooth_preview.png'
import { MagneticButton } from '@/components/animated/magnetic-button'
import { FeatureCard } from '@/components/animated/feature-card'
import { StatCard } from '@/components/animated/stat-card'
import { FloatingBadge } from '@/components/animated/floating-badge'
import { SmoothAccordion } from '@/components/animated/smooth-accordion'
import { GradientText } from '@/components/animated/gradient-text'
import { ScrollIndicator } from '@/components/animated/scroll-indicator'
import { AnimatedGridBackground, FloatingOrbs } from '@/components/animated/animated-background'
import { LiquidButton } from '@/components/animated/liquid-button'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { ParallaxSection } from '@/components/animated/parallax-section'
import { BentoGrid, BentoCard } from '@/components/animated/bento-grid'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { AnimatedTabs } from '@/components/animated/animated-tabs'
import { Marquee, MarqueeItem } from '@/components/animated/marquee'
import { DotPattern } from '@/components/animated/dot-pattern'
import { Particles } from '@/components/animated/particles'
import { TextReveal } from '@/components/animated/text-reveal'
import { AnimatedBeam } from '@/components/animated/animated-beam'

interface WaitlistEntry {
  id: string
  name: string
  email: string
  role: string
  timestamp: number
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <img src={logo} alt="NeuroConnect" className="h-10 sm:h-12 w-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <LiquidButton 
              onClick={scrollToWaitlist} 
              className="shadow-lg hover:shadow-xl transition-all group"
            >
              Join Waiting List
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </LiquidButton>
          </motion.div>
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
              <FloatingBadge />

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight mt-6"
              >
                Connecting Families with{' '}
                <GradientText>
                  Specialized Care
                </GradientText>
                {' '}for Neurodivergent Children
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="text-xl sm:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto font-light"
              >
                Finding the right support shouldn't take months. NeuroConnect matches families of children with ASD, dyslexia, and developmental disorders to qualified professionals—including alternative treatment specialists—in minutes.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <LiquidButton 
                  size="lg" 
                  onClick={scrollToWaitlist} 
                  className="text-base px-10 py-6 shadow-2xl hover:shadow-primary/25 transition-all group relative overflow-hidden"
                >
                  <span className="relative z-10">Join the Waiting List</span>
                  <ArrowRight size={20} className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </LiquidButton>
                <MagneticButton 
                  size="lg" 
                  variant="outline" 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="border-2 px-10 py-6 backdrop-blur-sm hover:bg-primary/5 transition-colors"
                >
                  Learn More
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
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

          <ScrollIndicator />
        </section>

        <section className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8b5cf615_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#6366f115_0%,transparent_50%)]" />
          <Particles className="opacity-30" quantity={60} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ParallaxSection offset={30}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="text-center mb-20"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6"
                >
                  <span className="text-destructive font-semibold text-sm">The Problem</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  The Challenge Families Face
                </h2>
                <TextReveal 
                  text="Finding specialized care for neurodivergent children is a broken experience. The data tells a stark story."
                  className="text-xl sm:text-2xl max-w-4xl mx-auto font-light"
                />
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
                <StatCard
                  icon={TrendUp}
                  stat="1 in 36"
                  label="Children are diagnosed with autism spectrum disorder (ASD) in the U.S., according to the CDC (2023)"
                  gradient="from-primary to-secondary"
                  index={0}
                />
                <StatCard
                  icon={CalendarBlank}
                  countTo={6}
                  suffix="+ months"
                  label="Average wait time for developmental pediatrician appointments (Autism Speaks, 2023)"
                  gradient="from-secondary to-accent"
                  index={1}
                />
                <StatCard
                  icon={Users}
                  countTo={73}
                  suffix="%"
                  label="Of parents report difficulty finding appropriate services for their neurodivergent child (NCLD, 2022)"
                  gradient="from-accent to-primary"
                  index={2}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="max-w-4xl mx-auto"
              >
                <Card className="border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-background/50 backdrop-blur-sm overflow-hidden">
                  <CardContent className="pt-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold text-foreground mb-6">What Parents Are Experiencing</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        {[
                          {
                            title: "Endless Wait Times",
                            description: "Families wait 6-12 months just for an initial evaluation, delaying critical early intervention"
                          },
                          {
                            title: "Limited Options",
                            description: "Most platforms don't include alternative therapies like yoga, sensory integration, or holistic approaches"
                          },
                          {
                            title: "Geographic Barriers",
                            description: "Rural families have even fewer options, often traveling hours for appointments"
                          },
                          {
                            title: "Fragmented Care",
                            description: "Coordinating between multiple providers across different platforms creates unnecessary stress"
                          }
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex gap-3"
                          >
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-destructive mt-2" />
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ParallaxSection>
          </div>
        </section>

        <section id="features" className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#8b5cf610_0%,transparent_65%)]" />
          <DotPattern className="text-primary/5" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ParallaxSection offset={40}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="text-center mb-20"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                >
                  <Sparkle size={16} className="text-primary" weight="fill" />
                  <span className="text-primary font-semibold text-sm">The Solution</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  How NeuroConnect{' '}
                  <GradientText>
                    Changes Everything
                  </GradientText>
                </h2>
                <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
                  A comprehensive platform designed from the ground up for neurodivergent families
                </p>
              </motion.div>

              <AnimatedBeam className="mb-16" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <FeatureCard
                  icon={Handshake}
                  title="Smart Matching"
                  description="AI-powered algorithm connects you with specialists based on your child's unique needs, location, and preferred treatment approaches—conventional or alternative."
                  gradient="from-primary to-secondary"
                  index={0}
                />
                <FeatureCard
                  icon={Sparkle}
                  title="Alternative Treatments"
                  description="Access to yoga therapists, acupuncturists, sensory integration specialists, and other holistic practitioners alongside traditional therapies."
                  gradient="from-secondary to-accent"
                  index={1}
                />
                <FeatureCard
                  icon={ChatCircle}
                  title="Unified Platform"
                  description="Secure messaging, video consultations, and appointment scheduling all in one place. No more juggling multiple platforms."
                  gradient="from-accent to-primary"
                  index={2}
                />
              </div>

              <BentoGrid className="gap-6">
                <BentoCard 
                  span={2}
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                  }
                >
                  <div className="flex flex-col h-full justify-between min-h-[300px]">
                    <div>
                      <motion.div 
                        className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary mb-5 shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <CalendarBlank size={32} className="text-white" weight="duotone" />
                      </motion.div>
                      <h3 className="text-3xl font-semibold mb-4 text-foreground">
                        From Months to Minutes
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                        Instead of waiting 6+ months for appointments, find and connect with qualified professionals in your area within minutes. Our platform eliminates the gatekeepers and gives you direct access.
                      </p>
                      <div className="space-y-3">
                        {[
                          "Instant search across all provider types",
                          "Real-time availability and booking",
                          "Same-day virtual consultations available"
                        ].map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 text-muted-foreground"
                          >
                            <CheckCircle size={20} className="text-primary flex-shrink-0" weight="fill" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard
                  span={1}
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                  }
                >
                  <div className="h-full min-h-[300px] flex flex-col">
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-primary mb-5 shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ShieldCheck size={32} className="text-white" weight="duotone" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">
                      Privacy First
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      HIPAA-compliant platform with enterprise-grade security protecting your family's sensitive health information.
                    </p>
                    <div className="mt-auto">
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">Bank-Level Encryption</Badge>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard
                  span={1}
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
                  }
                >
                  <div className="h-full min-h-[250px] flex flex-col">
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-accent mb-5 shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Users size={32} className="text-white" weight="duotone" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">
                      Community Support
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Connect with other families, share experiences, and access expert-curated resources on coping strategies.
                    </p>
                  </div>
                </BentoCard>

                <BentoCard
                  span={2}
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
                  }
                >
                  <div className="min-h-[250px]">
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent mb-5 shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Target size={32} className="text-white" weight="duotone" />
                    </motion.div>
                    <h3 className="text-3xl font-semibold mb-4 text-foreground">
                      Personalized for Your Child
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                      Every neurodivergent child is unique. Our matching algorithm considers diagnosis, age, specific challenges, sensory preferences, communication style, and family values to find the perfect provider match.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">ASD Specialists</Badge>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">Dyslexia Experts</Badge>
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">ADHD Support</Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Sensory Integration</Badge>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">Behavioral Therapy</Badge>
                    </div>
                  </div>
                </BentoCard>
              </BentoGrid>
            </ParallaxSection>
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">Built for the Neurodivergent Community</h2>
            </motion.div>

            <AnimatedTabs
              tabs={[
                { id: 'families', label: 'For Families', icon: Users },
                { id: 'professionals', label: 'For Professionals', icon: Handshake },
                { id: 'treatments', label: 'Treatment Options', icon: Sparkle },
              ]}
            >
              {(activeTab) => (
                <div className="min-h-[300px]">
                  {activeTab === 'families' && (
                    <SpotlightCard>
                      <CardContent className="pt-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-3">
                              <Heart size={28} className="text-primary" weight="duotone" />
                              Finding the Right Support
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              NeuroConnect isn't just another healthcare app. It's a platform designed specifically for families navigating autism, dyslexia, ADHD, and other developmental differences.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                              We understand that one size doesn't fit all, which is why we emphasize personalized matching and celebrate both traditional and alternative treatment approaches.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-4 text-foreground">Key Benefits</h4>
                            <ul className="space-y-3">
                              {[
                                'Reduce wait times from months to days',
                                'Access vetted professionals in your area',
                                'Find specialists who understand your child',
                                'Connect with supportive community',
                                'Track progress and appointments easily'
                              ].map((benefit, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-3 text-muted-foreground"
                                >
                                  <CheckCircle size={20} className="text-primary flex-shrink-0" weight="fill" />
                                  <span>{benefit}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </SpotlightCard>
                  )}
                  {activeTab === 'professionals' && (
                    <SpotlightCard>
                      <CardContent className="pt-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-3">
                              <Target size={28} className="text-secondary" weight="duotone" />
                              Grow Your Practice
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              Join a network of professionals dedicated to serving the neurodivergent community. Whether you offer traditional therapy or alternative treatments, NeuroConnect helps you reach families who need your expertise.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                              Our platform handles scheduling, secure communication, and payments—so you can focus on what you do best: helping families thrive.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-4 text-foreground">Professional Features</h4>
                            <ul className="space-y-3">
                              {[
                                'Create your professional profile',
                                'Set your own availability and rates',
                                'Secure HIPAA-compliant messaging',
                                'Virtual consultation support',
                                'Access to collaborative community'
                              ].map((feature, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-3 text-muted-foreground"
                                >
                                  <CheckCircle size={20} className="text-secondary flex-shrink-0" weight="fill" />
                                  <span>{feature}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </SpotlightCard>
                  )}
                  {activeTab === 'treatments' && (
                    <SpotlightCard>
                      <CardContent className="pt-8">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-3">
                              <Brain size={28} className="text-accent" weight="duotone" />
                              Comprehensive Treatment Options
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                              We believe in empowering families with choices. Access traditional therapies alongside alternative and holistic approaches—all vetted and qualified.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              { label: "Speech Therapy", gradient: "from-primary to-primary" },
                              { label: "Occupational Therapy", gradient: "from-secondary to-secondary" },
                              { label: "Behavioral Support", gradient: "from-accent to-accent" },
                              { label: "Yoga & Mindfulness", gradient: "from-primary to-secondary" },
                              { label: "Sensory Integration", gradient: "from-secondary to-accent" },
                              { label: "Acupuncture", gradient: "from-accent to-primary" },
                              { label: "Music Therapy", gradient: "from-primary to-accent" },
                              { label: "Art Therapy", gradient: "from-secondary to-primary" },
                              { label: "Nutrition Counseling", gradient: "from-accent to-secondary" }
                            ].map((treatment, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <Badge 
                                  variant="secondary" 
                                  className={`text-sm px-4 py-2.5 w-full justify-center bg-gradient-to-r ${treatment.gradient} text-white border-0 hover:scale-105 transition-transform cursor-default shadow-lg`}
                                >
                                  {treatment.label}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </SpotlightCard>
                  )}
                </div>
              )}
            </AnimatedTabs>
          </div>
        </section>

        <section className="py-16 border-y border-border/50 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Backed by Research From
              </p>
            </motion.div>
            <Marquee className="py-4" pauseOnHover duration={30}>
              <MarqueeItem className="mx-8">
                <div className="px-8 py-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-lg font-semibold text-foreground">CDC</p>
                  <p className="text-xs text-muted-foreground">Centers for Disease Control</p>
                </div>
              </MarqueeItem>
              <MarqueeItem className="mx-8">
                <div className="px-8 py-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-lg font-semibold text-foreground">Autism Speaks</p>
                  <p className="text-xs text-muted-foreground">Leading Autism Organization</p>
                </div>
              </MarqueeItem>
              <MarqueeItem className="mx-8">
                <div className="px-8 py-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-lg font-semibold text-foreground">NCLD</p>
                  <p className="text-xs text-muted-foreground">National Center for Learning</p>
                </div>
              </MarqueeItem>
              <MarqueeItem className="mx-8">
                <div className="px-8 py-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-lg font-semibold text-foreground">NIH</p>
                  <p className="text-xs text-muted-foreground">National Institutes of Health</p>
                </div>
              </MarqueeItem>
              <MarqueeItem className="mx-8">
                <div className="px-8 py-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-lg font-semibold text-foreground">Understood.org</p>
                  <p className="text-xs text-muted-foreground">Learning & Thinking Differences</p>
                </div>
              </MarqueeItem>
            </Marquee>
          </div>
        </section>

        <section id="waitlist" className="py-24 sm:py-32 relative overflow-hidden">
          <Particles className="opacity-30" quantity={40} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Join the Waiting List</h2>
              <p className="text-xl text-muted-foreground">
                Be among the first to know when NeuroConnect launches. Early access coming soon.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
            >
              <SpotlightCard className="border-2 border-primary/20 shadow-2xl backdrop-blur-sm bg-card/80">
                <CardContent className="pt-8">
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

                    <LiquidButton 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 text-base shadow-xl hover:shadow-2xl transition-all"
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
                    </LiquidButton>

                    <p className="text-sm text-muted-foreground text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </form>
                </CardContent>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            </motion.div>

            <SmoothAccordion items={[
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
            ]} />
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-white">Help Us Build Something Better</h2>
              <p className="text-xl mb-10 leading-relaxed text-white/90 max-w-3xl mx-auto">
                NeuroConnect is being built with input from families, professionals, and advocates in the neurodivergent community. Your early support helps us create a platform that truly serves your needs.
              </p>
              <ShimmerButton 
                onClick={scrollToWaitlist}
                className="text-base px-12 py-7 shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all bg-white text-primary hover:bg-white/95 font-semibold rounded-lg inline-flex items-center gap-2"
              >
                Join the Waiting List Today
                <ArrowRight size={20} />
              </ShimmerButton>
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
