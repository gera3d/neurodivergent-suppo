import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Users, Handshake, Sparkle, ShieldCheck, CalendarBlank, ChatCircle, CheckCircle, TrendUp } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface WaitlistEntry {
  id: string
  name: string
  email: string
  role: string
  timestamp: number
}

function StatCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true)
          const startTime = Date.now()
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * end))
            
            if (progress === 1) {
              clearInterval(timer)
            }
          }, 16)
          
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById('stat-counter')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return <span id="stat-counter">{count.toLocaleString()}{suffix}</span>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">NeuroConnect</h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">Pre-Launch</Badge>
          </div>
          <Button onClick={scrollToWaitlist}>Join Waiting List</Button>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/20 py-16 sm:py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-6 border-accent text-accent">Launching 2025</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                Connecting Families with Specialized Care for <span className="text-primary">Neurodivergent</span> Children
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Finding the right support shouldn't take months. NeuroConnect matches families of children with ASD, dyslexia, and developmental disorders to qualified professionals—including alternative treatment specialists—in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" onClick={scrollToWaitlist} className="text-base px-8 shadow-lg hover:shadow-xl transition-shadow">
                  Join the Waiting List
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">The Challenge Families Face</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real data shows the urgent need for better access to specialized care
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <TrendUp size={32} className="text-accent" weight="bold" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    1 in 36
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Children are diagnosed with autism spectrum disorder (ASD) in the U.S., according to the CDC (2023)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                    <CalendarBlank size={32} className="text-secondary" weight="bold" />
                  </div>
                  <div className="text-4xl font-bold text-secondary mb-2">
                    <StatCounter end={6} suffix="+ months" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average wait time for developmental pediatrician appointments (Autism Speaks, 2023)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <Users size={32} className="text-accent" weight="bold" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    <StatCounter end={73} suffix="%" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Of parents report difficulty finding appropriate services for their neurodivergent child (NCLD, 2022)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How NeuroConnect Helps</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A comprehensive platform designed specifically for neurodivergent families
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Handshake size={28} className="text-primary" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Smart Professional Matching</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our algorithm connects you with specialists based on your child's unique needs, location, and preferred treatment approaches—conventional or alternative.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Sparkle size={28} className="text-secondary" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Alternative Treatment Options</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Access to yoga therapists, acupuncturists, sensory integration specialists, and other holistic practitioners alongside traditional therapies.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                    <ChatCircle size={28} className="text-accent" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Seamless Communication</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Secure messaging, video consultations, and appointment scheduling all in one place. No more juggling multiple platforms.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <ShieldCheck size={28} className="text-primary" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Privacy & Security</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    HIPAA-compliant platform ensuring your family's sensitive information is protected with enterprise-grade security.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Users size={28} className="text-secondary" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Community Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with other families, share experiences, and access expert-curated resources on coping strategies and skill development.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                    <CalendarBlank size={28} className="text-accent" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Faster Access to Care</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Reduce months-long wait times to days. Find available professionals quickly and book consultations that fit your schedule.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Built for the Neurodivergent Community</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              NeuroConnect isn't just another healthcare app. It's a platform designed specifically for families navigating autism, dyslexia, ADHD, and other developmental differences. We understand that one size doesn't fit all, which is why we emphasize personalized matching and celebrate both traditional and alternative treatment approaches.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">Speech Therapy</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">Sensory Integration</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">Behavioral Support</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">Yoga & Mindfulness</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">Occupational Therapy</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">Acupuncture</Badge>
            </div>
          </div>
        </section>

        <section id="waitlist" className="py-16 sm:py-24 bg-card">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Join the Waiting List</h2>
              <p className="text-lg text-muted-foreground">
                Be among the first to know when NeuroConnect launches. Early access coming soon.
              </p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="mt-2 h-12"
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-2 h-12"
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-base">I am a...</Label>
                    <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
                      <SelectTrigger className="mt-2 h-12" id="role">
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
                    {errors.role && <p className="text-destructive text-sm mt-1">{errors.role}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Joining...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} className="mr-2" weight="bold" />
                        Join Waiting List
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  When will NeuroConnect launch?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We're planning to launch in 2025. Waiting list members will receive early access and be notified before our public launch. We're currently in development and working with neurodivergent families and professionals to ensure we build the right solution.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  Who can use NeuroConnect?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  NeuroConnect serves two main groups: families with neurodivergent children (including those with ASD, dyslexia, ADHD, and other developmental disorders) and qualified professionals who specialize in supporting neurodivergent individuals. This includes traditional therapists, educators, and alternative treatment practitioners.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  What types of professionals will be available?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We'll feature a diverse range of specialists including speech therapists, occupational therapists, behavioral therapists, developmental pediatricians, sensory integration specialists, yoga instructors, mindfulness coaches, acupuncturists, and other alternative treatment providers. All professionals will be vetted and properly credentialed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  How much will NeuroConnect cost?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We're finalizing our pricing model to ensure accessibility for families while fairly compensating professionals. We're exploring options including free basic access with premium features, subscription tiers, and potential partnerships with insurance providers. Early access members will receive special pricing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  Is my family's information secure?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Absolutely. NeuroConnect will be HIPAA-compliant with enterprise-grade security measures to protect your family's sensitive health information. All communications are encrypted, and we'll never share your data with third parties without explicit consent.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  Will NeuroConnect be available in my area?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We're launching initially in select regions of the United States, with plans for rapid expansion based on demand. The platform will also support virtual consultations, allowing you to connect with professionals regardless of geographic location. Let us know your location when you join the waiting list!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  How is NeuroConnect different from other healthcare platforms?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Unlike general healthcare platforms, NeuroConnect is exclusively focused on the neurodivergent community. We understand the unique challenges families face, celebrate both traditional and alternative treatment approaches, emphasize personalized matching, and provide community support features designed specifically for this population.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary via-secondary to-accent text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Help Us Build Something Better</h2>
            <p className="text-lg mb-8 leading-relaxed opacity-95">
              NeuroConnect is being built with input from families, professionals, and advocates in the neurodivergent community. Your early support helps us create a platform that truly serves your needs.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={scrollToWaitlist}
              className="text-base px-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              Join the Waiting List Today
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3 text-foreground">NeuroConnect</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering neurodivergent families through accessible, specialized care connections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>CDC Autism Statistics</li>
                <li>Autism Speaks</li>
                <li>NCLD Resources</li>
                <li>Understood.org</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Questions? We'd love to hear from you.
              </p>
              <p className="text-sm text-primary mt-2">hello@neuroconnect.app</p>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 NeuroConnect. All rights reserved.</p>
            <p className="mt-2">Built with ❤️ for the neurodivergent community</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
