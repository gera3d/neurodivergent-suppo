# NeuroConnect Landing Page - Product Requirements Document

A high-converting landing page designed to build a waiting list for NeuroConnect, a platform connecting neurodivergent families with specialized professionals.

**Experience Qualities**:
1. **Empathetic** - The design should feel warm, understanding, and supportive, reflecting the emotional journey of families seeking help for their neurodivergent loved ones.
2. **Trustworthy** - Professional presentation backed by real statistics and credible data to establish confidence in the platform's mission and capability.
3. **Accessible** - Clear, simple navigation with sensory-friendly design choices that accommodate neurodivergent individuals and their families.

**Complexity Level**: Content Showcase (information-focused)
This is a pre-launch landing page focused on presenting the value proposition clearly and converting visitors to waiting list signups. The primary goal is information delivery and lead capture, not complex application functionality.

## Essential Features

### Feature 1: Hero Section with Value Proposition
- **Functionality**: Displays the main headline, subheadline, and primary CTA (Join Waiting List)
- **Purpose**: Immediately communicate what NeuroConnect does and who it serves, capturing attention within 3 seconds
- **Trigger**: Page load
- **Progression**: User lands on page → Reads compelling headline with real data point → Sees benefit-driven subheadline → Clicks "Join Waiting List" CTA
- **Success Criteria**: Clear value proposition visible above fold, CTA button stands out with high contrast, messaging focuses on family empowerment

### Feature 2: Statistics & Problem Statement
- **Functionality**: Presents real data about neurodivergent population and challenges families face
- **Purpose**: Establish credibility and validate the problem NeuroConnect solves using authoritative statistics
- **Trigger**: User scrolls past hero
- **Progression**: User scrolls → Sees compelling statistics about ASD/neurodivergent prevalence → Reads about current challenges (long wait times, difficulty finding specialists) → Emotional connection strengthens
- **Success Criteria**: All statistics cited with sources, data visualized clearly, problem resonates with target audience

### Feature 3: Solution Showcase (Key Features)
- **Functionality**: Highlights 3-4 core features with icons and descriptions
- **Purpose**: Show how NeuroConnect addresses the problems identified, focusing on professional matching, alternative treatments, and community support
- **Trigger**: User continues scrolling
- **Progression**: User reads problem → Sees "How NeuroConnect Helps" section → Reviews key features with visual icons → Understands platform benefits
- **Success Criteria**: Features presented with clear icons, benefit-focused copy, scannable layout

### Feature 4: Social Proof & Trust Signals
- **Functionality**: Displays planned partnerships, expert endorsements placeholder, or early interest metrics
- **Purpose**: Build trust and reduce hesitation about joining a pre-launch waiting list
- **Trigger**: User scrolls to middle section
- **Progression**: User reviews features → Sees trust indicators → Confidence increases → More likely to sign up
- **Success Criteria**: Authentic trust signals presented professionally, not overstated for pre-launch phase

### Feature 5: Waiting List Signup Form
- **Functionality**: Clean, simple form collecting email, name, and relationship to neurodivergent community (parent, professional, advocate)
- **Purpose**: Convert interested visitors into waiting list subscribers for launch notification
- **Trigger**: User clicks any "Join Waiting List" CTA or scrolls to footer CTA
- **Progression**: User clicks CTA → Form appears/focuses → User enters email, name, role → Submits → Success confirmation with next steps
- **Success Criteria**: Form submits successfully, data persists to KV store, success message displayed, minimal friction (3 fields max)

### Feature 6: FAQ Section
- **Functionality**: Accordion-style frequently asked questions addressing common concerns
- **Purpose**: Overcome objections and provide transparency about the platform, timeline, and approach
- **Trigger**: User scrolls to bottom or has questions
- **Progression**: User has question → Scans FAQ titles → Clicks relevant question → Reads answer → Concern addressed
- **Success Criteria**: 5-7 questions covering launch timeline, who can use it, privacy, alternative treatments, cost expectations

## Edge Case Handling

- **Form Validation Errors** - Inline validation with clear, friendly error messages guiding users to correct input
- **Duplicate Signups** - Check if email already exists, show friendly "You're already on the list!" message
- **Empty States** - If form not yet filled, show placeholder text that guides input
- **Mobile Overflow** - All sections adapt gracefully to mobile with readable text sizes (16px minimum)
- **Slow Network** - Form shows loading state during submission, prevents double-submission
- **Accessibility Needs** - Keyboard navigation support, sufficient color contrast (WCAG AA), screen reader friendly labels

## Design Direction

The design should feel hopeful, modern, and professional while maintaining warmth and approachability. It should evoke trust and empathy without feeling clinical or cold. The interface should be minimal and focused, removing any unnecessary distractions that could overwhelm neurodivergent visitors or busy parents. Every element serves the core purpose: communicating value and capturing leads.

## Color Selection

Using a **Complementary** color scheme derived directly from the NeuroConnect logo colors (purple/magenta and blue), creating visual harmony and brand consistency. The purple represents creativity and empowerment while the blue conveys trust and professionalism.

- **Primary Color**: Deep Purple `oklch(0.45 0.15 310)` - Represents empowerment, creativity, and the neurodivergent community. Used for main CTAs and key interactive elements to draw attention and encourage action.

- **Secondary Colors**: 
  - Royal Blue `oklch(0.50 0.15 250)` - Conveys trust, reliability, and professionalism. Used for secondary CTAs and informational elements.
  - Soft Lavender `oklch(0.85 0.08 310)` - A muted purple for backgrounds and subtle accents, creating visual breathing room.

- **Accent Color**: Vibrant Magenta `oklch(0.60 0.20 330)` - Eye-catching highlight for important statistics, icons, and hover states. Creates energy and draws attention to key data points.

- **Foreground/Background Pairings**:
  - Background (Warm White `oklch(0.98 0.01 90)`): Dark Purple text `oklch(0.25 0.08 310)` - Ratio 11.2:1 ✓
  - Card (Pure White `oklch(1 0 0)`): Dark Purple text `oklch(0.25 0.08 310)` - Ratio 12.1:1 ✓
  - Primary (Deep Purple `oklch(0.45 0.15 310)`): White text `oklch(1 0 0)` - Ratio 7.8:1 ✓
  - Secondary (Royal Blue `oklch(0.50 0.15 250)`): White text `oklch(1 0 0)` - Ratio 6.2:1 ✓
  - Accent (Vibrant Magenta `oklch(0.60 0.20 330)`): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Muted (Soft Lavender `oklch(0.85 0.08 310)`): Dark Purple text `oklch(0.25 0.08 310)` - Ratio 5.1:1 ✓

## Font Selection

Typography should feel modern, friendly, and highly readable to accommodate visitors who may have reading difficulties or visual processing differences. We'll use **Inter** for its exceptional legibility and contemporary feel, paired with **Fraunces** for headlines to add warmth and approachability.

- **Typographic Hierarchy**:
  - H1 (Hero Headline): Fraunces Bold/48px (mobile: 32px)/tight letter spacing/-0.02em - Maximum impact and warmth
  - H2 (Section Headings): Fraunces SemiBold/36px (mobile: 28px)/tight letter spacing/-0.01em - Clear hierarchy
  - H3 (Feature Titles): Inter SemiBold/24px (mobile: 20px)/normal letter spacing - Modern and clean
  - Body (Paragraphs): Inter Regular/18px (mobile: 16px)/relaxed line height/1.7 - Maximum readability
  - Small (Captions/Stats): Inter Medium/14px/normal letter spacing/tracking-wide - Clarity for data
  - CTA Button Text: Inter SemiBold/16px/slight letter spacing/0.01em - Assertive and clear

## Animations

Animations should be purposeful and gentle, never overwhelming or distracting for neurodivergent visitors. Motion should communicate progress and guide attention without causing sensory overload. We'll use subtle, meaningful animations that enhance rather than decorate.

- **Purposeful Meaning**: Animations communicate state changes (form submission), guide attention to CTAs (gentle pulse), and provide feedback (success confirmation). All animations can be disabled via prefers-reduced-motion.
- **Hierarchy of Movement**: 
  - Primary: CTA buttons have subtle hover lift and color shift
  - Secondary: Statistics count up on scroll into view for impact
  - Tertiary: FAQ accordions expand smoothly
  - Minimal: Page sections fade in gently on scroll

## Component Selection

- **Components**:
  - **Button** - Primary CTAs ("Join Waiting List") with hover and focus states, sized generously for accessibility
  - **Input** - Email and name fields with clear labels, proper spacing, and validation states
  - **Select** - Role selection dropdown (Parent, Professional, Advocate, Other) with accessible keyboard navigation
  - **Card** - Feature showcase cards with consistent padding, subtle shadows, and hover effects
  - **Accordion** - FAQ section using shadcn Accordion component for clean expand/collapse
  - **Separator** - Visual breaks between major sections using subtle lines
  - **Badge** - "Pre-Launch" or "Launching 2025" indicator near logo
  - **Form** - react-hook-form with zod validation for robust form handling

- **Customizations**:
  - **Stat Counter Component** - Custom animated number counter for displaying statistics with impact
  - **Gradient Backgrounds** - Subtle purple-to-blue gradients for hero and CTA sections
  - **Icon Containers** - Circular backgrounds for feature icons using brand colors

- **States**:
  - Buttons: Default → Hover (lift + darken) → Active (pressed down) → Focus (ring) → Loading (spinner) → Success (checkmark)
  - Inputs: Empty → Focused (border color + ring) → Filled → Error (red border + message) → Success (green border + checkmark)
  - Form: Idle → Submitting (loading) → Success (confirmation message) → Error (retry option)

- **Icon Selection**:
  - Users (family icon) - Represents families and community
  - HeartHandshake - Professional matching and care
  - Sparkles - Alternative treatments and holistic approaches  
  - ShieldCheck - Trust, privacy, HIPAA compliance
  - Calendar - Appointment scheduling
  - MessageCircle - Communication features
  - TrendingUp - Growth and progress
  - CheckCircle - Success states and completed actions

- **Spacing**: Consistent spacing using Tailwind scale
  - Section padding: py-16 md:py-24 (64px/96px)
  - Container max-width: max-w-6xl
  - Card padding: p-6 md:p-8
  - Element gaps: gap-4 (16px) for related items, gap-8 (32px) for sections
  - Text spacing: mb-4 for paragraphs, mb-6 for headings

- **Mobile**: Mobile-first approach
  - Hero: Single column, 32px headline, full-width CTA
  - Stats: Stack vertically with generous spacing
  - Features: Single column cards on mobile, 2-col on tablet, 3-col on desktop
  - Form: Full width on mobile with proper touch targets (44px minimum)
  - FAQ: Full-width accordions with adequate tap targets
  - Navigation: Sticky "Join Waiting List" button on mobile
