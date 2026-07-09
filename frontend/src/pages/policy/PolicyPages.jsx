import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PublicLayout from '../../components/layout/PublicLayout'

/* ─── Shared helpers ─────────────────────────────────────────────────── */
const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-display text-2xl text-white font-light mb-4 pb-3 border-b border-w-border/40">{title}</h2>
    <div className="text-w-muted leading-7 space-y-4">{children}</div>
  </div>
)
const P = ({ children }) => <p className="text-w-muted leading-7">{children}</p>
const Li = ({ children }) => <li className="flex gap-2.5 text-w-muted"><span className="text-w-accent mt-1 flex-shrink-0">›</span><span>{children}</span></li>
const Ul = ({ children }) => <ul className="space-y-2 pl-1">{children}</ul>
const Strong = ({ children }) => <strong className="text-white font-semibold">{children}</strong>
const InfoBox = ({ icon = 'ℹ️', children, color = 'blue' }) => {
  const colors = { blue: 'bg-blue-500/5 border-blue-500/20 text-blue-300', gold: 'bg-w-accent/5 border-w-accent/20 text-w-accent', green: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' }
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${colors[color]} text-sm`}>
      <span className="text-lg flex-shrink-0">{icon}</span>
      <span className="leading-relaxed">{children}</span>
    </div>
  )
}

/* ─── Privacy Policy ─────────────────────────────────────────────────── */
export function PrivacyPolicyPage() {
  return (
    <PublicLayout title="Privacy Policy" subtitle="Last updated: April 8, 2025" breadcrumb="Privacy Policy">
      <InfoBox icon="🔒" color="gold">We believe in radical transparency. This policy explains exactly what data we collect, why we collect it, and how you can control it.</InfoBox>
      <div className="mt-10">
        <Section title="1. Information We Collect">
          <P><Strong>Account Information.</Strong> When you register, we collect your first name, last name, email address, and password (stored as a one-way bcrypt hash — we never see your actual password).</P>
          <P><Strong>Profile Data.</Strong> Optionally: avatar photo, bio, location, website URL, travel style preferences, and countries visited count.</P>
          <P><Strong>Trip & Travel Data.</Strong> Itineraries, destinations, activities, bookings, expenses, packing lists, and journal entries you create within Wandr.</P>
          <P><Strong>Usage Data.</Strong> Pages visited, features used, session duration, click patterns, device type, browser, and operating system — collected to improve our product.</P>
          <P><Strong>Security Data.</Strong> Login timestamps, IP addresses, and device user-agents stored in your login history (last 10 entries) for your account security.</P>
          <P><Strong>Payment Data.</Strong> Processed entirely by Stripe. We never store card numbers. We receive a tokenized payment reference only.</P>
        </Section>
        <Section title="2. How We Use Your Information">
          <Ul>
            <Li>To provide, operate and improve the Wandr platform</Li>
            <Li>To authenticate you and secure your account</Li>
            <Li>To send transactional emails (sign-in alerts, booking confirmations, password resets)</Li>
            <Li>To send promotional emails you opt into (you can unsubscribe anytime)</Li>
            <Li>To detect and prevent fraud, abuse, and security threats</Li>
            <Li>To analyze aggregated usage patterns and improve features</Li>
            <Li>To comply with legal obligations</Li>
          </Ul>
        </Section>
        <Section title="3. Data Sharing">
          <P>We do <Strong>not</Strong> sell your personal data. We share data only with:</P>
          <Ul>
            <Li><Strong>Service providers</Strong> — Stripe (payments), Cloudinary (image hosting), SendGrid/Gmail SMTP (email delivery), MongoDB Atlas (database hosting). All are contractually bound to protect your data.</Li>
            <Li><Strong>Law enforcement</Strong> — only when legally required with valid court order or subpoena.</Li>
            <Li><Strong>Other users</Strong> — only data you explicitly make public (public trips, public journal entries, your profile).</Li>
          </Ul>
        </Section>
        <Section title="4. Data Retention">
          <P>We retain your data as long as your account is active. When you delete your account, all personal data is permanently deleted within 30 days. Anonymized aggregate analytics data may be retained indefinitely.</P>
        </Section>
        <Section title="5. Your Rights (GDPR & CCPA)">
          <Ul>
            <Li><Strong>Access</Strong> — download all your data from Settings → Privacy</Li>
            <Li><Strong>Rectification</Strong> — edit your profile at any time</Li>
            <Li><Strong>Erasure</Strong> — delete your account in Settings → Danger Zone</Li>
            <Li><Strong>Portability</Strong> — export your trips as JSON or PDF</Li>
            <Li><Strong>Objection</Strong> — opt out of marketing emails anytime</Li>
          </Ul>
          <InfoBox icon="✉️" color="blue">To exercise any right or for privacy questions, contact us at <strong>privacy@wandr.travel</strong></InfoBox>
        </Section>
        <Section title="6. Cookies">
          <P>We use essential cookies for authentication (JWT tokens stored in localStorage) and optional analytics cookies. See our <Link to="/cookies" className="text-w-accent hover:text-w-gold underline">Cookie Policy</Link> for full details.</P>
        </Section>
        <Section title="7. Security">
          <P>Wandr uses industry-standard security: TLS 1.3 encryption in transit, bcrypt-12 password hashing, HTTP security headers (Helmet.js), rate limiting, and regular security audits. No system is 100% secure — we encourage strong unique passwords and 2FA.</P>
        </Section>
        <Section title="8. Children">
          <P>Wandr is not directed at children under 16. We do not knowingly collect data from children. If you believe a child has registered, contact us immediately at privacy@wandr.travel.</P>
        </Section>
        <Section title="9. Changes to This Policy">
          <P>We may update this policy. We will notify you via email and an in-app banner at least 30 days before material changes take effect.</P>
        </Section>
      </div>
    </PublicLayout>
  )
}

/* ─── Terms of Service ───────────────────────────────────────────────── */
export function TermsOfServicePage() {
  return (
    <PublicLayout title="Terms of Service" subtitle="Effective: April 8, 2025" breadcrumb="Terms of Service">
      <InfoBox icon="📋" color="gold">By using Wandr, you agree to these terms. Please read them — they're written in plain English, not legalese.</InfoBox>
      <div className="mt-10">
        <Section title="1. Acceptance of Terms">
          <P>By accessing or using Wandr ("the Service"), you agree to be bound by these Terms. If you disagree, do not use the Service. These Terms apply to all users including travelers, collaborators, and any visitors to public content.</P>
        </Section>
        <Section title="2. Your Account">
          <Ul>
            <Li>You must be 16 or older to create an account</Li>
            <Li>You are responsible for all activity under your account</Li>
            <Li>Keep your credentials confidential — never share your password</Li>
            <Li>Notify us immediately of any unauthorized access at security@wandr.travel</Li>
            <Li>One person, one account — do not create multiple accounts to circumvent restrictions</Li>
          </Ul>
        </Section>
        <Section title="3. Acceptable Use">
          <P>You agree not to use Wandr to:</P>
          <Ul>
            <Li>Violate any law or regulation</Li>
            <Li>Upload malicious code, viruses, or conduct cyberattacks</Li>
            <Li>Harass, threaten, or abuse other users</Li>
            <Li>Post false, misleading, or deceptive content</Li>
            <Li>Scrape, crawl, or systematically download data without permission</Li>
            <Li>Attempt to reverse-engineer or access non-public APIs</Li>
            <Li>Impersonate any person or entity</Li>
          </Ul>
          <P>See our full <Link to="/acceptable-use" className="text-w-accent hover:text-w-gold underline">Acceptable Use Policy</Link>.</P>
        </Section>
        <Section title="4. Your Content">
          <P><Strong>You own your content.</Strong> When you create trips, journals, or any content on Wandr, you retain full ownership. By posting public content, you grant Wandr a non-exclusive, worldwide license to display, distribute, and promote that content within the platform.</P>
          <P>You are responsible for ensuring your content does not infringe third-party rights. We may remove content that violates these Terms without notice.</P>
        </Section>
        <Section title="5. Subscriptions & Billing">
          <Ul>
            <Li>Free plans are free forever with feature limits</Li>
            <Li>Paid plans are billed monthly or annually</Li>
            <Li>You may cancel anytime — access continues until period end</Li>
            <Li>Refunds are governed by our <Link to="/refund" className="text-w-accent hover:text-w-gold underline">Refund Policy</Link></Li>
            <Li>Prices may change with 30 days notice via email</Li>
          </Ul>
        </Section>
        <Section title="6. Service Availability">
          <P>We target 99.9% uptime but cannot guarantee uninterrupted service. Wandr is not liable for losses due to downtime, data loss, or service interruptions. We maintain regular backups but recommend exporting critical data.</P>
        </Section>
        <Section title="7. Termination">
          <P>You may delete your account at any time. We may suspend or terminate accounts that violate these Terms. Upon termination, your right to use the Service immediately ceases. Data is deleted per our Privacy Policy.</P>
        </Section>
        <Section title="8. Limitation of Liability">
          <P>To the maximum extent permitted by law, Wandr is not liable for indirect, incidental, or consequential damages. Our aggregate liability is limited to the amount you paid us in the 12 months preceding the claim.</P>
        </Section>
        <Section title="9. Governing Law">
          <P>These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law principles. Disputes will be resolved in the courts of Delaware.</P>
        </Section>
        <Section title="10. Contact">
          <P>Questions about these Terms? Email <Strong>legal@wandr.travel</Strong></P>
        </Section>
      </div>
    </PublicLayout>
  )
}

/* ─── Cookie Policy ──────────────────────────────────────────────────── */
export function CookiePolicyPage() {
  const [consent, setConsent] = useState({ analytics: true, marketing: false })
  return (
    <PublicLayout title="Cookie Policy" subtitle="Last updated: April 8, 2025" breadcrumb="Cookie Policy">
      <InfoBox icon="🍪" color="gold">We use cookies to keep you signed in and to understand how Wandr is used. Here's exactly what we set and why.</InfoBox>
      <div className="mt-10">
        <Section title="What Are Cookies?">
          <P>Cookies are small text files placed on your device by websites you visit. Wandr uses a mix of localStorage tokens and standard HTTP cookies to function correctly.</P>
        </Section>
        <Section title="Cookies We Set">
          <div className="space-y-4">
            {[
              { name: 'wandr_token', type: 'Essential', purpose: 'Stores your JWT authentication token to keep you signed in. Without this cookie, you cannot use your account.', duration: '7 days', canDisable: false },
              { name: '_ga, _gid', type: 'Analytics', purpose: 'Google Analytics — helps us understand which features are popular, where users drop off, and how to improve the product.', duration: '2 years', canDisable: true },
              { name: '_fbp', type: 'Marketing', purpose: 'Facebook Pixel — used only if you arrive from a Facebook ad, to measure campaign effectiveness.', duration: '90 days', canDisable: true },
              { name: 'wandr_prefs', type: 'Functional', purpose: 'Stores your UI preferences (dark/light mode, language, currency). Improves your experience across sessions.', duration: '1 year', canDisable: true },
            ].map(c => (
              <div key={c.name} className="p-4 rounded-xl bg-w-blue/20 border border-w-border">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <code className="text-w-accent font-mono text-sm">{c.name}</code>
                    <span className={`ml-3 badge text-xs ${c.type === 'Essential' ? 'badge-green' : c.type === 'Analytics' ? 'badge-blue' : 'badge-purple'}`}>{c.type}</span>
                  </div>
                  {!c.canDisable && <span className="text-xs text-w-muted">Always active</span>}
                </div>
                <p className="text-w-muted text-sm mt-2">{c.purpose}</p>
                <p className="text-w-muted/60 text-xs mt-1">Duration: {c.duration}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Your Cookie Preferences">
          <div className="space-y-3">
            {[
              { key: 'analytics', label: 'Analytics Cookies', desc: 'Help us understand usage patterns' },
              { key: 'marketing', label: 'Marketing Cookies', desc: 'Measure ad campaign performance' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-w-blue/20 border border-w-border">
                <div>
                  <div className="text-white font-medium text-sm">{label}</div>
                  <div className="text-w-muted text-xs">{desc}</div>
                </div>
                <button onClick={() => setConsent(c => ({ ...c, [key]: !c[key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${consent[key] ? 'bg-w-accent' : 'bg-w-border'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${consent[key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
          <button className="btn-primary mt-4">Save Preferences</button>
        </Section>
        <Section title="How to Control Cookies">
          <P>You can disable cookies in your browser settings. Note that disabling essential cookies will prevent you from logging in. Most browsers offer "Do Not Track" options as well.</P>
        </Section>
      </div>
    </PublicLayout>
  )
}

/* ─── Refund Policy ──────────────────────────────────────────────────── */
export function RefundPolicyPage() {
  return (
    <PublicLayout title="Refund Policy" subtitle="Simple, fair, and transparent." breadcrumb="Refund Policy">
      <InfoBox icon="💰" color="green">We want you to be happy with Wandr. If something isn't right, we'll make it right.</InfoBox>
      <div className="mt-10">
        <Section title="14-Day Money-Back Guarantee">
          <P>If you upgrade to a paid plan and are not satisfied within the first <Strong>14 days</Strong>, contact us for a full, no-questions-asked refund. No hoops, no conditions.</P>
          <InfoBox icon="📧" color="blue">Email refund@wandr.travel with your account email and we'll process it within 3 business days.</InfoBox>
        </Section>
        <Section title="After the 14-Day Period">
          <P>After 14 days, we consider refunds on a case-by-case basis for:</P>
          <Ul>
            <Li><Strong>Extended downtime</Strong> — if Wandr is unavailable for more than 24 consecutive hours in a billing period</Li>
            <Li><Strong>Billing errors</Strong> — if you were charged an incorrect amount</Li>
            <Li><Strong>Duplicate charges</Strong> — if you were charged twice for the same period</Li>
          </Ul>
          <P>We do not offer refunds for partial months, unused features, or if you simply forgot to cancel.</P>
        </Section>
        <Section title="Cancellation">
          <Ul>
            <Li>Cancel anytime from Settings → Billing</Li>
            <Li>Access continues until the end of your current billing period</Li>
            <Li>No cancellation fees</Li>
            <Li>Your data is retained for 30 days after cancellation in case you change your mind</Li>
          </Ul>
        </Section>
        <Section title="Annual Plans">
          <P>Annual plans are refundable within 14 days of purchase. After that, we can offer a prorated credit toward a future plan upgrade, but not a cash refund.</P>
        </Section>
        <Section title="Third-Party Bookings">
          <P>Wandr helps you <em>organize</em> bookings but does not process them directly. Refunds for flights, hotels, or activities booked through partner links are governed by those providers' policies.</P>
        </Section>
      </div>
    </PublicLayout>
  )
}

/* ─── Acceptable Use Policy ──────────────────────────────────────────── */
export function AcceptableUsePage() {
  return (
    <PublicLayout title="Acceptable Use Policy" subtitle="Keep it respectful. Keep it real." breadcrumb="Acceptable Use">
      <InfoBox icon="🌍" color="gold">Wandr exists to bring travelers together. This policy ensures it stays a place everyone loves.</InfoBox>
      <div className="mt-10">
        <Section title="The Spirit of This Policy">
          <P>Wandr is built on trust — trust between travelers, trust in the content on our platform, and trust that everyone is here in good faith. This policy codifies what "good faith" means.</P>
        </Section>
        <Section title="Prohibited Content">
          <P>You may not post, share, or transmit content that:</P>
          <Ul>
            <Li>Is false, misleading, or deliberately inaccurate about destinations, prices, or experiences</Li>
            <Li>Infringes copyright, trademarks, or other intellectual property</Li>
            <Li>Contains hate speech targeting race, religion, nationality, gender, sexuality, or disability</Li>
            <Li>Depicts or promotes violence, abuse, or exploitation</Li>
            <Li>Is pornographic or sexually explicit</Li>
            <Li>Constitutes spam, pyramid schemes, or unsolicited promotion</Li>
            <Li>Reveals another person's private information without consent</Li>
          </Ul>
        </Section>
        <Section title="Prohibited Behaviors">
          <Ul>
            <Li>Creating fake reviews or artificially inflating trip engagement</Li>
            <Li>Impersonating travel influencers, celebrities, or Wandr staff</Li>
            <Li>Harvesting other users' email addresses or personal data</Li>
            <Li>Attempting to access accounts, systems, or data you are not authorized to access</Li>
            <Li>Interfering with the platform's performance through bots, scrapers, or DDoS attacks</Li>
            <Li>Using Wandr for commercial spam or bulk unsolicited messaging</Li>
          </Ul>
        </Section>
        <Section title="Travel Safety & Accuracy">
          <P>Wandr content is created by users. We cannot verify every claim about a destination. Always cross-check safety advisories with official government sources before traveling. Wandr is not responsible for inaccurate user-generated travel advice.</P>
        </Section>
        <Section title="Reporting Violations">
          <P>See something that violates this policy? Use the Report button on any content, or email <Strong>trust@wandr.travel</Strong>. We review all reports within 48 hours.</P>
        </Section>
        <Section title="Enforcement">
          <P>Violations may result in content removal, account suspension, or permanent ban — depending on severity. Serious violations (illegal content, fraud) will be reported to law enforcement.</P>
        </Section>
      </div>
    </PublicLayout>
  )
}

/* ─── Accessibility ──────────────────────────────────────────────────── */
export function AccessibilityPage() {
  return (
    <PublicLayout title="Accessibility Statement" subtitle="Travel is for everyone." breadcrumb="Accessibility">
      <InfoBox icon="♿" color="gold">We are committed to making Wandr accessible to all travelers, regardless of ability or disability.</InfoBox>
      <div className="mt-10">
        <Section title="Our Commitment">
          <P>Wandr strives to meet the <Strong>WCAG 2.1 Level AA</Strong> accessibility guidelines. We believe that planning a journey should be possible for everyone, and we work continuously to remove barriers in our platform.</P>
        </Section>
        <Section title="Current Accessibility Features">
          <Ul>
            <Li><Strong>Keyboard navigation</Strong> — all core functions accessible without a mouse</Li>
            <Li><Strong>Screen reader support</Strong> — semantic HTML, ARIA labels, and descriptive alt text throughout</Li>
            <Li><Strong>Sufficient color contrast</Strong> — minimum 4.5:1 ratio for body text, 3:1 for large text</Li>
            <Li><Strong>Focus indicators</Strong> — visible focus rings on all interactive elements</Li>
            <Li><Strong>Resizable text</Strong> — layouts work at up to 200% text zoom</Li>
            <Li><Strong>No seizure triggers</Strong> — no flashing content above 3Hz</Li>
            <Li><Strong>Error identification</Strong> — form errors clearly described in text</Li>
          </Ul>
        </Section>
        <Section title="Known Limitations">
          <P>We are actively working on:</P>
          <Ul>
            <Li>Improving the drag-and-drop itinerary builder for keyboard users (alternative controls available)</Li>
            <Li>Adding audio descriptions to all map visualizations</Li>
            <Li>Improving mobile screen reader experience on the discover feed</Li>
          </Ul>
        </Section>
        <Section title="Feedback">
          <P>If you encounter an accessibility barrier, please tell us. We treat accessibility issues as critical bugs.</P>
          <InfoBox icon="✉️" color="blue">Email <strong>accessibility@wandr.travel</strong> — we respond within 2 business days and aim to resolve issues within 10.</InfoBox>
        </Section>
        <Section title="Third-Party Tools">
          <P>Wandr uses some third-party components (maps, payment forms) that may not fully meet our accessibility standards. We are working with those providers to improve this.</P>
        </Section>
      </div>
    </PublicLayout>
  )
}

/* ─── Contact ────────────────────────────────────────────────────────── */
export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const handleSubmit = (e) => { e.preventDefault(); setSent(true) }

  return (
    <PublicLayout title="Contact Us" subtitle="We'd love to hear from you." breadcrumb="Contact">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card text-center py-16">
              <div className="text-5xl mb-5">🌍</div>
              <h3 className="font-display text-2xl text-white mb-3">Message Sent!</h3>
              <p className="text-w-muted">We'll get back to you within 24 hours. Safe travels!</p>
              <button onClick={() => setSent(false)} className="btn-outline mt-8 text-sm">Send Another Message</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5">
              <h2 className="font-display text-xl text-white">Send a Message</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Your Name</label><input className="input" placeholder="Alex Rivera" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="label">Email Address</label><input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
              </div>
              <div>
                <label className="label">Subject</label>
                <select className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                  <option value="">Select a topic</option>
                  <option>General Question</option>
                  <option>Billing & Subscription</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Account Issue</option>
                  <option>Partnership Inquiry</option>
                  <option>Press & Media</option>
                </select>
              </div>
              <div><label className="label">Message</label><textarea className="input resize-none min-h-[140px]" placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /></div>
              <button type="submit" className="btn-primary w-full py-3.5">Send Message ✈️</button>
            </form>
          )}
        </div>

        <div className="space-y-5">
          {[
            { icon: '📧', label: 'General', email: 'hello@wandr.travel', desc: 'General inquiries' },
            { icon: '🛡️', label: 'Support', email: 'support@wandr.travel', desc: 'Account & technical help' },
            { icon: '🔒', label: 'Privacy', email: 'privacy@wandr.travel', desc: 'Data & privacy questions' },
            { icon: '💼', label: 'Business', email: 'partnerships@wandr.travel', desc: 'B2B & partnerships' },
            { icon: '📰', label: 'Press', email: 'press@wandr.travel', desc: 'Media inquiries' },
          ].map(({ icon, label, email, desc }) => (
            <div key={label} className="card-hover p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="text-white font-medium text-sm">{label}</div>
                  <a href={`mailto:${email}`} className="text-w-accent text-xs hover:text-w-gold transition-colors">{email}</a>
                  <div className="text-w-muted text-xs">{desc}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="card p-4">
            <div className="text-white font-medium text-sm mb-2">Response Time</div>
            <p className="text-w-muted text-xs leading-relaxed">We aim to respond within <strong className="text-white">24 hours</strong> on business days. For urgent issues, use the Support chat in the app.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

/* ─── About ──────────────────────────────────────────────────────────── */
export function AboutPage() {
  return (
    <PublicLayout
      hero={
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1400&q=80" alt="team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-w-dark/50 via-transparent to-w-dark" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
            <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-2">Our Story</p>
            <h1 className="font-display text-5xl text-white font-light">About Wandr</h1>
          </div>
        </div>
      }>
      <div className="prose-dark">
        <p className="text-xl text-w-muted leading-relaxed mb-10 font-light">Wandr was born from a missed train in Lisbon, a lost booking confirmation in Tokyo, and a spreadsheet that crashed in Chiang Mai. We knew there had to be a better way.</p>

        <Section title="The Mission">
          <P>We believe every person deserves to explore the world without the friction of planning. Wandr exists to remove the chaos between the dream and the journey — so you can focus on the moments that matter.</P>
        </Section>

        <Section title="How It Started">
          <P>In 2022, two friends — a software engineer and a travel journalist — were planning a 3-month trip through South America using 7 different apps, 4 spreadsheets, and a WhatsApp thread that had 1,400 messages. The experience was miserable.</P>
          <P>They built Wandr for themselves first. Within 6 months, 10,000 other travelers had found it. Today, over 50,000 adventurers across 180 countries use Wandr to plan, travel, and remember.</P>
        </Section>

        <div className="grid grid-cols-3 gap-4 my-10">
          {[['2022','Founded'],['50K+','Travelers'],['180+','Countries']].map(([n, l]) => (
            <div key={l} className="card text-center py-5">
              <div className="font-display text-3xl text-w-accent">{n}</div>
              <div className="text-w-muted text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>

        <Section title="Our Values">
          <Ul>
            <Li><Strong>Traveler-first.</Strong> Every decision is made by asking "does this help someone explore the world?"</Li>
            <Li><Strong>Radical transparency.</Strong> No dark patterns, no hidden fees, no selling your data.</Li>
            <Li><Strong>Relentless craft.</Strong> We sweat the details because travel is too important to be mediocre.</Li>
            <Li><Strong>Inclusive adventure.</Strong> The world belongs to everyone. We build for all travelers.</Li>
          </Ul>
        </Section>

        <Section title="Join Us">
          <P>We're always looking for people who love travel and love building products. <Link to="/careers" className="text-w-accent hover:text-w-gold underline">See open roles →</Link></P>
        </Section>
      </div>
    </PublicLayout>
  )
}

/* ─── Careers ────────────────────────────────────────────────────────── */
export function CareersPage() {
  const ROLES = [
    { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Product Designer (Mobile)', team: 'Design', location: 'Remote / NYC', type: 'Full-time' },
    { title: 'Head of Growth Marketing', team: 'Marketing', location: 'Remote', type: 'Full-time' },
    { title: 'Travel Content Strategist', team: 'Content', location: 'Remote', type: 'Full-time' },
    { title: 'Customer Success Manager', team: 'Support', location: 'Remote', type: 'Full-time' },
    { title: 'iOS Engineer (Swift)', team: 'Engineering', location: 'Remote', type: 'Full-time' },
  ]
  return (
    <PublicLayout
      hero={
        <div className="relative h-64 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80" alt="team working" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-w-dark" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
            <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-2">Work With Us</p>
            <h1 className="font-display text-5xl text-white font-light">Careers at Wandr</h1>
          </div>
        </div>
      }>
      <div className="mb-12">
        <p className="text-xl text-w-muted leading-relaxed font-light">Help us make travel planning as exciting as the trip itself. We're a fully remote team of 24 travelers, builders, and storytellers.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-14">
        {[['Remote-first','🌍'],['Unlimited PTO','🏖️'],['$2K Travel Stipend','✈️']].map(([b, e]) => (
          <div key={b} className="card text-center py-5">
            <div className="text-2xl mb-2">{e}</div>
            <div className="text-white text-sm font-medium">{b}</div>
          </div>
        ))}
      </div>

      <Section title="Open Positions">
        <div className="space-y-3">
          {ROLES.map(r => (
            <div key={r.title} className="card-hover flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="text-white font-semibold">{r.title}</h3>
                <div className="flex gap-3 mt-1.5 text-xs text-w-muted">
                  <span className="badge-blue">{r.team}</span>
                  <span>📍 {r.location}</span>
                  <span>⏱ {r.type}</span>
                </div>
              </div>
              <a href="mailto:careers@wandr.travel" className="btn-outline text-sm flex-shrink-0">Apply →</a>
            </div>
          ))}
        </div>
      </Section>

      <InfoBox icon="💌" color="gold">Don't see your role? Send us a note at <strong>careers@wandr.travel</strong> — we hire for talent, not just open positions.</InfoBox>
    </PublicLayout>
  )
}

/* ─── Press ──────────────────────────────────────────────────────────── */
export function PressPage() {
  const COVERAGE = [
    { outlet: 'TechCrunch', headline: '"Wandr wants to be the Notion of travel planning"', date: 'March 2025' },
    { outlet: 'Forbes', headline: '"The 10 Best Travel Apps of 2025"', date: 'January 2025' },
    { outlet: 'Condé Nast Traveler', headline: '"Stop Using Spreadsheets: Meet the Apps That Actually Work"', date: 'February 2025' },
    { outlet: 'Product Hunt', headline: '#1 Product of the Day — Wandr 3.0 Launch', date: 'December 2024' },
  ]
  return (
    <PublicLayout title="Press Room" subtitle="Media resources and brand assets." breadcrumb="Press">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          { label: 'Press Kit (ZIP)', icon: '📦', desc: 'Logos, screenshots, brand guidelines' },
          { label: 'Founder Bio & Photos', icon: '👤', desc: 'High-res photos and short bios' },
          { label: 'Product Screenshots', icon: '🖥️', desc: 'App screenshots in all sizes' },
          { label: 'Brand Guidelines', icon: '🎨', desc: 'Colours, fonts, usage rules' },
        ].map(({ label, icon, desc }) => (
          <button key={label} className="card-hover text-left p-5 flex gap-4 items-start">
            <span className="text-3xl">{icon}</span>
            <div><div className="text-white font-semibold">{label}</div><div className="text-w-muted text-sm mt-0.5">{desc}</div></div>
          </button>
        ))}
      </div>

      <Section title="Recent Coverage">
        <div className="space-y-3">
          {COVERAGE.map(c => (
            <div key={c.headline} className="card p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-w-blue flex items-center justify-center text-lg flex-shrink-0">📰</div>
              <div>
                <div className="text-w-accent text-xs font-semibold mb-1">{c.outlet}</div>
                <div className="text-white text-sm font-medium">{c.headline}</div>
                <div className="text-w-muted text-xs mt-1">{c.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <InfoBox icon="📬" color="blue">For press inquiries, interviews, or editorial access — contact <strong>press@wandr.travel</strong>. We respond within 4 hours during business days.</InfoBox>
    </PublicLayout>
  )
}

/* ─── Help Center ────────────────────────────────────────────────────── */
export function HelpCenterPage() {
  const [search, setSearch] = useState('')
  const FAQS = [
    { q: 'How do I create my first trip?', a: 'Go to Trips → New Trip. Fill in the name, dates, and destination. You can start simple and add details later.' },
    { q: 'Can I collaborate with travel companions?', a: 'Yes! Open any trip, click the person+ icon and enter your companion\'s Wandr email. They\'ll get an invitation to join as a viewer or editor.' },
    { q: 'How do I track expenses for a group?', a: 'In the Budget section, log each expense and assign a "paid by" user. Wandr calculates who owes whom and shows settlement summaries.' },
    { q: 'Can I use Wandr offline?', a: 'Offline access is available on Pro and Premium plans. Your trips, itineraries, and bookings are cached for offline viewing.' },
    { q: 'How do I import bookings from email?', a: 'Forward confirmation emails to import@wandr.travel from your registered account. We parse the details automatically within minutes.' },
    { q: 'Is my data backed up?', a: 'Yes. Wandr runs automated daily backups with 30-day retention. Your data is also exportable from Settings → Privacy → Export Data.' },
    { q: 'How do I cancel my subscription?', a: 'Go to Settings → Billing → Cancel Plan. Your access continues until the end of the current billing period.' },
    { q: 'Can I make a trip public for the community?', a: 'Yes — edit any trip and toggle "Make Public". It will appear in the Discover feed for others to browse and copy.' },
  ]
  const filtered = FAQS.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()))

  return (
    <PublicLayout title="Help Center" subtitle="Find answers fast." breadcrumb="Help">
      <div className="relative mb-10">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-w-muted">🔍</span>
        <input className="input pl-11 text-base py-4" placeholder="Search help articles..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[['🗺️','Trip Planning'],['📅','Bookings'],['💰','Budget'],['👤','Account']].map(([e, l]) => (
          <button key={l} className="card-hover text-center py-5 px-3">
            <div className="text-2xl mb-2">{e}</div>
            <div className="text-white text-sm font-medium">{l}</div>
          </button>
        ))}
      </div>

      <Section title="Frequently Asked Questions">
        <div className="space-y-3">
          {filtered.map(({ q, a }) => (
            <details key={q} className="group card cursor-pointer">
              <summary className="flex items-center justify-between text-white font-medium text-sm list-none">
                {q}
                <span className="text-w-accent ml-3 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-w-muted text-sm mt-4 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <div className="card mt-10 text-center py-10">
        <div className="text-3xl mb-3">🤝</div>
        <h3 className="font-display text-xl text-white mb-2">Still need help?</h3>
        <p className="text-w-muted text-sm mb-5">Our support team replies within 24 hours on business days.</p>
        <Link to="/contact" className="btn-primary text-sm">Contact Support</Link>
      </div>
    </PublicLayout>
  )
}

/* ─── Blog ───────────────────────────────────────────────────────────── */
const POSTS = [
  { slug: 'ultimate-southeast-asia-budget', title: 'The Ultimate Southeast Asia Budget Guide 2025', excerpt: 'How to travel Thailand, Vietnam, and Cambodia for under $50/day without sacrificing the magic.', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', cat: 'Budget Travel', date: 'Apr 1, 2025', readTime: '8 min' },
  { slug: 'solo-travel-safety-guide', title: '27 Solo Travel Safety Tips That Actually Matter', excerpt: 'Practical, honest advice from solo travelers who have been everywhere — from Tbilisi to Taipei.', img: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80', cat: 'Solo Travel', date: 'Mar 22, 2025', readTime: '11 min' },
  { slug: 'best-travel-apps-2025', title: 'The 10 Best Travel Apps of 2025 (Tested by Real Travelers)', excerpt: 'We tried every travel app so you don\'t have to. Here\'s what actually survives a 6-month trip.', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', cat: 'Tools', date: 'Mar 15, 2025', readTime: '7 min' },
  { slug: 'iceland-ring-road-itinerary', title: 'Iceland Ring Road: The Perfect 10-Day Itinerary', excerpt: 'Aurora chasing, glacier hiking, and the bluest lagoons — every stop mapped and budgeted.', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', cat: 'Itineraries', date: 'Mar 8, 2025', readTime: '13 min' },
  { slug: 'japan-sakura-season', title: 'Chasing Cherry Blossoms: Japan in Sakura Season', excerpt: 'The exact dates, best spots, and how to plan Japan\'s most magical weeks without the crowds.', img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', cat: 'Guides', date: 'Feb 28, 2025', readTime: '10 min' },
  { slug: 'packing-light-guide', title: 'Pack for 3 Months in One Carry-On: The Complete Guide', excerpt: 'The exact packing system used by full-time travelers to carry everything they need in 40 liters.', img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80', cat: 'Packing', date: 'Feb 14, 2025', readTime: '9 min' },
]

export function BlogPage() {
  const [active, setActive] = useState('All')
  const cats = ['All', ...new Set(POSTS.map(p => p.cat))]
  const filtered = active === 'All' ? POSTS : POSTS.filter(p => p.cat === active)

  return (
    <PublicLayout
      hero={
        <div className="relative h-64 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80" alt="travel blog" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-w-dark" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
            <p className="text-w-accent text-xs tracking-[0.3em] uppercase mb-2">Travel Stories</p>
            <h1 className="font-display text-5xl text-white font-light">The Wandr Journal</h1>
          </div>
        </div>
      }>
      <div className="flex gap-2 flex-wrap mb-10">
        {cats.map(c => (
          <button key={c} onClick={() => setActive(c)} className={`text-sm px-4 py-2 rounded-xl border transition-all ${active === c ? 'bg-w-accent/15 text-w-accent border-w-accent/30' : 'text-w-muted border-w-border hover:text-white hover:border-w-accent/20'}`}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map((p, i) => (
          <motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link to={`/blog/${p.slug}`} className="group block card-hover overflow-hidden p-0">
              <div className="h-48 overflow-hidden"><img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 text-xs text-w-muted"><span className="badge-gold text-xs">{p.cat}</span><span>·</span><span>{p.date}</span><span>·</span><span>{p.readTime} read</span></div>
                <h3 className="font-display text-lg text-white font-light leading-snug group-hover:text-w-accent transition-colors mb-2">{p.title}</h3>
                <p className="text-w-muted text-sm leading-relaxed line-clamp-2">{p.excerpt}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </PublicLayout>
  )
}

export function BlogPostPage() {
  const { slug } = useParams()
  const post = POSTS.find(p => p.slug === slug) || POSTS[0]
  return (
    <PublicLayout
      hero={
        <div className="relative h-80 overflow-hidden">
          <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-w-dark/40 via-transparent to-w-dark" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3"><span className="badge-gold text-xs">{post.cat}</span><span className="text-w-muted text-xs">{post.date}</span><span className="text-w-muted text-xs">· {post.readTime} read</span></div>
            <h1 className="font-display text-4xl sm:text-5xl text-white font-light leading-tight">{post.title}</h1>
          </div>
        </div>
      }>
      <div className="prose-dark max-w-3xl">
        <p className="text-xl text-w-muted font-light leading-relaxed mb-8">{post.excerpt}</p>
        <p>Planning a trip can feel overwhelming — dozens of tabs open, bookings scattered across emails, and a packing list that gets longer every time you look at it. We've been there. That's exactly why we built Wandr.</p>
        <h2>The Secret Is the System</h2>
        <p>The travelers who seem effortlessly organized aren't just lucky — they have a system. And the best systems aren't complicated. They're just consistent.</p>
        <p>Whether you're planning a 3-day city break or a 6-month odyssey, the fundamentals are the same: know what you're doing each day, know how much you're spending, and know where you're sleeping.</p>
        <h2>Building Your Itinerary</h2>
        <p>The best itineraries have rhythm. Don't pack every waking hour — leave space for the unexpected moments that become your best memories. A rule of thumb: plan 60% of each day, leave 40% open.</p>
        <ul><li>Start with accommodation as your anchor points</li><li>Build activities around where you're sleeping</li><li>Group nearby attractions on the same day</li><li>Build in at least one completely free day per week</li></ul>
        <h2>Budget Like You Mean It</h2>
        <p>Logging expenses isn't just about staying on budget — it's about understanding your own travel style. After a few trips, you'll know exactly how much you spend on food vs experiences vs accommodation, and you'll plan better for it.</p>
        <div className="my-10 card text-center py-8">
          <p className="text-lg text-white font-light mb-4">Ready to plan your next adventure?</p>
          <Link to="/register" className="btn-primary">Start with Wandr — It's Free</Link>
        </div>
      </div>
      <div className="mt-14 pt-10 border-t border-w-border/40">
        <h3 className="font-display text-xl text-white mb-6">More Stories</h3>
        <div className="grid grid-cols-2 gap-4">
          {POSTS.filter(p => p.slug !== slug).slice(0, 2).map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group card-hover overflow-hidden p-0">
              <div className="h-32 overflow-hidden"><img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-4"><p className="text-w-accent text-xs mb-1">{p.cat}</p><h4 className="text-white text-sm font-medium leading-snug group-hover:text-w-accent transition-colors">{p.title}</h4></div>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
