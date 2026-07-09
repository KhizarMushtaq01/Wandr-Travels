import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80',
]

const DESTINATIONS = [
  { name:'Santorini', country:'Greece', img:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', tag:'Romance', description:'White-washed buildings, blue domes, and breathtaking sunsets over the Aegean Sea. Santorini is the crown jewel of the Cyclades.' },
  { name:'Kyoto', country:'Japan', img:'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', tag:'Culture', description:'Ancient temples, traditional tea houses, and stunning cherry blossoms. Kyoto is the cultural heart of Japan.' },
  { name:'Patagonia', country:'Argentina', img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', tag:'Adventure', description:'Towering mountains, massive glaciers, and untouched wilderness. Patagonia is a hiker\'s paradise.' },
  { name:'Maldives', country:'Maldives', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', tag:'Luxury', description:'Overwater bungalows, crystal-clear waters, and vibrant coral reefs. The ultimate tropical escape.' },
  { name:'Marrakech', country:'Morocco', img:'https://images.unsplash.com/photo-1517821362941-f7f753200fef?w=800&q=80', tag:'Exotic', description:'Vibrant souks, stunning palaces, and the bustling Jemaa el-Fnaa square. Marrakech is a feast for the senses.' },
  { name:'Iceland', country:'Iceland', img:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', tag:'Nature', description:'Land of fire and ice with volcanoes, glaciers, waterfalls, and the magical Northern Lights.' },
]

const STORIES = [
  {
    step: '01', label: 'Dream',
    title: 'Every journey begins with a spark of curiosity.',
    desc: 'Browse thousands of community itineraries. Get inspired by real travelers who have walked the roads you are dreaming of.',
    img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80',
    color: 'from-blue-900/40 to-w-dark',
  },
  {
    step: '02', label: 'Plan',
    title: 'Build your perfect journey, day by day.',
    desc: 'Our smart itinerary builder lets you drag, drop, and arrange every moment. Add accommodations, activities, restaurants and transport in one flow.',
    img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&q=80',
    color: 'from-amber-900/30 to-w-dark',
  },
  {
    step: '03', label: 'Go',
    title: 'Travel with everything you need, in your pocket.',
    desc: 'All your bookings, budgets, packing lists and documents — always there, even offline. Share your live journey with the people who matter.',
    img: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=900&q=80',
    color: 'from-emerald-900/30 to-w-dark',
  },
  {
    step: '04', label: 'Remember',
    title: 'Every memory deserves to be told.',
    desc: 'Journal your adventures with photos and stories. Your travels are transformed into a living archive you will revisit for a lifetime.',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80',
    color: 'from-purple-900/30 to-w-dark',
  },
]

const FEATURES = [
  { icon:'🗺️', title:'Day-by-Day Itinerary',  desc:'Drag-and-drop trip building with smart route optimization.' },
  { icon:'📅', title:'Booking Manager',        desc:'Centralize every reservation — flights, hotels, tours and more.' },
  { icon:'💰', title:'Budget Tracker',         desc:'Multi-currency expense tracking with group split.' },
  { icon:'🎒', title:'Packing Lists',          desc:'Smart templates, family assignment, real-time sync.' },
  { icon:'📔', title:'Travel Journal',         desc:'Photo stories, mood logs, and community sharing.' },
  { icon:'👥', title:'Social Feed',            desc:'Follow fellow adventurers and discover their routes.' },
  { icon:'🔔', title:'Live Notifications',     desc:'Booking alerts, trip reminders, collaboration updates.' },
  { icon:'🌍', title:'Scratch Map',            desc:'Visual map of every country you have conquered.' },
]

const TESTIMONIALS = [
  { quote:'Wandr is the only travel app I actually keep using. It turned planning from a chore into a joy.', name:'Elena K.', role:'Digital Nomad, 47 countries', img:'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&q=80' },
  { quote:'We planned our entire Patagonia trek — 18 days — without a single spreadsheet. Pure magic.', name:'Marcus & Jo', role:'Adventure couple', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
  { quote:'The journal feature alone is worth it. I have detailed memories of every trip since 2023.', name:'Yuki T.', role:'Travel blogger', img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
]

const STATS = [
  { n:'180+', label:'Countries Mapped' },
  { n:'50K+', label:'Adventurers' },
  { n:'200K+', label:'Trips Planned' },
  { n:'4.9★', label:'App Rating' },
]

function FadeSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-w-dark/95 backdrop-blur-xl border-b border-w-border/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-display font-bold text-sm shadow-[0_0_20px_rgba(232,194,122,0.4)]">W</div>
          <span className="font-display text-xl font-medium text-white tracking-widest">WANDR</span>
        </Link>
        <div className="hidden md:flex items-center gap-1 text-sm">
          {[['Features','#features'],['Destinations','#destinations'],['Pricing','#pricing'],['Stories','/blog'],['Explore','/explore']].map(([l,h]) => (
            <a key={l} href={h} className="px-4 py-2 text-w-muted hover:text-white transition-colors rounded-xl hover:bg-white/5">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-sm text-w-muted hover:text-white transition-colors px-4 py-2">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started Free</Link>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  const [imgIdx, setImgIdx] = useState(0)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.3], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background images */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <AnimatePresence mode="wait">
          <motion.img key={imgIdx} src={HERO_IMAGES[imgIdx]} alt="travel"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 1.5 }} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-w-dark/70 via-w-dark/40 to-w-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-w-dark/60 via-transparent to-w-dark/30" />
      </motion.div>

      {/* Dot indicators */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setImgIdx(i)} className={`transition-all duration-300 rounded-full ${i === imgIdx ? 'w-6 h-1.5 bg-w-accent' : 'w-1.5 h-1.5 bg-white/30'}`} />
        ))}
      </div>

      <motion.div className="relative z-10 text-center max-w-5xl mx-auto px-4" style={{ opacity }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-w-accent/15 backdrop-blur-sm border border-w-accent/30 text-w-accent text-xs font-medium px-4 py-2 rounded-full mb-8 tracking-wider uppercase">
          ✦ The All-In-One Adventure Planner
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-white leading-[1.02] mb-8">
          Where Stories<br />
          <em className="not-italic text-gradient">Begin to Unfold</em>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          Plan every detail. Travel without worry. Remember every moment. Wandr is the one platform that stays with you from daydream to memory.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-base px-9 py-4 shadow-[0_0_40px_rgba(232,194,122,0.3)]">
            Begin Your Adventure →
          </Link>
          <Link to="/explore" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm px-6 py-4 border border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 backdrop-blur-sm">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">▶</span>
            Explore Community Trips
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  )
}

function StatsBar() {
  return (
    <FadeSection className="border-y border-w-border/40 bg-w-navy/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(({ n, label }) => (
          <div key={label} className="text-center">
            <div className="font-display text-4xl font-light text-gradient mb-1">{n}</div>
            <div className="text-w-muted text-sm tracking-wide">{label}</div>
          </div>
        ))}
      </div>
    </FadeSection>
  )
}

function StorySection() {
  return (
    <section className="py-32 overflow-hidden">
      <FadeSection className="text-center mb-20 px-4">
        <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-4">The Wandr Journey</p>
        <h2 className="heading-lg text-white mb-5">A story in four acts.</h2>
        <p className="text-w-muted text-lg max-w-xl mx-auto">Every great adventure follows the same arc. Wandr walks with you through all of them.</p>
      </FadeSection>

      {STORIES.map((s, i) => (
        <FadeSection key={s.step} delay={i * 0.05} className={`max-w-7xl mx-auto px-4 mb-6`}>
          <div className={`relative rounded-3xl overflow-hidden min-h-[480px] flex items-center ${i % 2 === 0 ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'}`}>
            {/* Image */}
            <div className="w-full md:w-1/2 h-72 md:h-full md:absolute md:inset-y-0 overflow-hidden" style={i % 2 === 0 ? { right: 0 } : { left: 0 }}>
              <img src={s.img} alt={s.label} className="w-full h-full object-cover" loading="lazy" />
              <div className={`absolute inset-0 ${i % 2 === 0 ? 'bg-gradient-to-r from-w-dark via-w-dark/70 to-transparent' : 'bg-gradient-to-l from-w-dark via-w-dark/70 to-transparent'}`} />
            </div>

            {/* Text */}
            <div className={`relative z-10 w-full md:w-1/2 p-10 md:p-16 ${i % 2 !== 0 ? 'md:ml-auto' : ''}`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display text-6xl font-light text-w-accent/20">{s.step}</span>
                <span className="text-xs text-w-accent tracking-[0.3em] uppercase border border-w-accent/30 px-3 py-1 rounded-full">{s.label}</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-white font-light leading-snug mb-5">{s.title}</h3>
              <p className="text-w-muted text-lg leading-relaxed mb-8">{s.desc}</p>
              <Link to="/register" className="btn-outline text-sm">Start {s.label}ing →</Link>
            </div>
          </div>
        </FadeSection>
      ))}
    </section>
  )
}

function DestinationsSection() {
  const navigate = useNavigate()
  
  return (
    <section id="destinations" className="py-24 overflow-hidden">
      <FadeSection className="max-w-7xl mx-auto px-4 mb-14">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-3">Dream Destinations</p>
            <h2 className="heading-lg text-white">The world is waiting.</h2>
          </div>
          <Link to="/explore" className="btn-outline text-sm">Explore All →</Link>
        </div>
      </FadeSection>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DESTINATIONS.map((d, i) => (
          <FadeSection key={d.name} delay={i * 0.08}>
            <div 
              onClick={() => navigate(`/destination/${d.name}`)}
              className="group block relative h-80 rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={d.img} 
                alt={d.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-w-accent/0 group-hover:bg-w-accent/10 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs text-w-accent/80 font-medium tracking-wider uppercase">{d.country}</span>
                    <h3 className="font-display text-2xl text-white font-light mt-0.5">{d.name}</h3>
                    {/* Add description preview */}
                    <p className="text-white/60 text-xs mt-2 line-clamp-2 max-w-xs">
                      {d.description}
                    </p>
                  </div>
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">{d.tag}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-w-accent/0 group-hover:bg-w-accent/20 border border-w-accent/0 group-hover:border-w-accent/40 flex items-center justify-center transition-all duration-300">
                <svg className="w-3 h-3 text-w-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </FadeSection>
        ))}
      </div>
    </section>
  )
}

function FeaturesGrid() {
  return (
    <section id="features" className="py-24">
      <FadeSection className="text-center mb-16 px-4">
        <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-4">Everything You Need</p>
        <h2 className="heading-lg text-white mb-5">One app. Zero compromises.</h2>
        <p className="text-w-muted text-lg max-w-xl mx-auto">Stop switching between 6 different apps. Wandr brings every travel tool together in one elegant experience.</p>
      </FadeSection>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(({ icon, title, desc }, i) => (
          <FadeSection key={title} delay={i * 0.06}>
            <div className="group card-hover h-full">
              <div className="text-3xl mb-5 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
              <h3 className="text-white font-semibold mb-2.5 text-sm">{title}</h3>
              <p className="text-w-muted text-sm leading-relaxed">{desc}</p>
            </div>
          </FadeSection>
        ))}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <FadeSection className="text-center mb-14">
          <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-4">Traveler Stories</p>
          <h2 className="heading-lg text-white">Real adventures. Real love.</h2>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeSection key={t.name} delay={i * 0.1}>
              <div className="card h-full flex flex-col justify-between border border-w-border hover:border-w-accent/25 transition-all duration-300 group">
                <div>
                  <div className="flex gap-0.5 mb-6">
                    {[...Array(5)].map((_, j) => <span key={j} className="text-w-accent text-sm">★</span>)}
                  </div>
                  <p className="text-w-text text-base leading-relaxed italic mb-8">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-w-border/50">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-w-muted text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const PLANS = [
    { name:'Explorer', price:499.99, period:'month', features:['5 trips','Basic itinerary','Budget tracker','Community discover'], cta:'Start Free', highlight:false },
    { name:'Adventurer', price:999.99, period:'month', features:['Unlimited trips','Advanced tools','Booking manager','5 collaborators','Packing lists','Travel journal'], cta:'14-Day Free Trial', highlight:true, badge:'Most Popular' },
    { name:'Expeditioner', price:1999.99, period:'month', features:['Everything +','Unlimited collab','AI suggestions','Travel reels','Priority support','Offline access'], cta:'Go Unlimited', highlight:false },
  ]
  return (
    <section id="pricing" className="py-24 bg-w-navy/30 border-y border-w-border/40">
      <div className="max-w-5xl mx-auto px-4">
        <FadeSection className="text-center mb-16">
          <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-4">Pricing</p>
          <h2 className="heading-lg text-white mb-5">No surprises. Just adventures.</h2>
          <p className="text-w-muted text-lg max-w-lg mx-auto">Free to start, affordable to grow. Pick the plan that matches your wanderlust.</p>
        </FadeSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((p, i) => (
            <FadeSection key={p.name} delay={i * 0.1}>
              <div className={`relative card flex flex-col h-full transition-all duration-300 ${p.highlight ? 'border-w-accent/50 shadow-[0_0_40px_rgba(232,194,122,0.1)] scale-[1.02]' : 'hover:border-w-accent/25'}`}>
                {p.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-gold text-xs">{p.badge}</div>}
                <div className="mb-7">
                  <h3 className="font-display text-xl text-white mb-4">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-light text-gradient">${p.price}</span>
                    <span className="text-w-muted text-sm">/{p.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {p.features.map(f => <li key={f} className="flex items-center gap-2.5 text-sm text-w-text"><span className="text-w-accent text-xs">✓</span>{f}</li>)}
                </ul>
                <Link to="/register" className={p.highlight ? 'btn-primary w-full justify-center py-3.5' : 'btn-outline w-full justify-center py-3.5'}>{p.cta}</Link>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="relative py-40 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=70" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-w-dark via-w-dark/60 to-w-dark" />
      </div>
      <FadeSection className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(232,194,122,0.4)]">
          <span className="font-display text-2xl font-bold text-w-dark">W</span>
        </div>
        <h2 className="font-display text-5xl sm:text-6xl text-white font-light mb-6 leading-tight">
          Your next chapter<br /><span className="text-gradient italic">starts today.</span>
        </h2>
        <p className="text-w-muted text-xl mb-12 leading-relaxed">
          50,000 adventurers are already writing their stories with Wandr.<br />Join them. The world is not going to explore itself.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-[0_0_50px_rgba(232,194,122,0.35)]">Create Free Account</Link>
          <Link to="/explore" className="btn-outline text-lg px-10 py-4">Explore Trips</Link>
        </div>
        <p className="text-w-muted/60 text-sm mt-6">Free forever plan available. No credit card required.</p>
      </FadeSection>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-w-border/40 bg-w-navy/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-sm">W</div>
              <span className="font-display text-lg text-white tracking-widest">WANDR</span>
            </div>
            <p className="text-w-muted text-sm leading-relaxed max-w-xs">Your all-in-one adventure travel planner. Plan, book, track, and relive every journey — all in one place.</p>
            <div className="flex gap-3 mt-6">
              {['𝕏','in','ig','yt'].map(s => <a key={s} href="#" className="w-8 h-8 rounded-lg bg-w-border/50 border border-w-border flex items-center justify-center text-w-muted hover:text-w-accent hover:border-w-accent/40 transition-all text-xs font-bold">{s}</a>)}
            </div>
          </div>
          {[
            { title:'Product', links:[['Features','#features'],['Pricing','#pricing'],['Changelog','/blog'],['Roadmap','/blog']] },
            { title:'Company', links:[['About','/about'],['Careers','/careers'],['Press','/press'],['Contact','/contact']] },
            { title:'Resources', links:[['Help Center','/help'],['Blog','/blog'],['Explore','/explore'],['Community','/social']] },
            { title:'Legal', links:[['Privacy','/privacy'],['Terms','/terms'],['Cookies','/cookies'],['Acceptable Use','/acceptable-use']] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(([l, h]) => <li key={l}><Link to={h} className="text-sm text-w-muted hover:text-w-accent transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="divider pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-w-muted/60">© {new Date().getFullYear()} Wandr Travel Technologies. All rights reserved.</p>
          <p className="text-xs text-w-muted/60">Made with ♥ for adventurers everywhere</p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-w-dark">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <StorySection />
      <DestinationsSection />
      <FeaturesGrid />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
