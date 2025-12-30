import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Play, Clock, Target, TrendingUp, Sparkles, 
  Timer, BarChart3, FileText, Palette, Camera,
  Heart, BookOpen, Wind, Smile, Check, ChevronDown,
  Shield, AlertTriangle, Mail, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Safety", href: "#safety" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES_TRAINING = [
  { icon: Timer, title: "Timed sessions", desc: "20 seconds per scent with visual countdown" },
  { icon: Clock, title: "Rest periods", desc: "Built-in breaks between scents" },
  { icon: Play, title: "Optional audio prompts", desc: "Gentle cues to guide your session" },
];

const FEATURES_TRACKING = [
  { icon: TrendingUp, title: "Intensity sliders", desc: "Rate how strong each scent feels" },
  { icon: BarChart3, title: "Trend charts", desc: "See your progress over weeks" },
  { icon: FileText, title: "Session summaries", desc: "Review your training history" },
  { icon: FileText, title: "Export for clinician", desc: "Share progress with your doctor" },
];

const FEATURES_PERSONALIZATION = [
  { icon: Palette, title: "Custom scent library", desc: "Add your own scents to train with" },
  { icon: Camera, title: "Add photos and notes", desc: "Document your scent journey" },
  { icon: Sparkles, title: "Swap recommended scents", desc: "Customize the four scent routine" },
];

const FEATURES_SUPPORT = [
  { icon: BookOpen, title: "Symptom journaling", desc: "Track how you're feeling day to day" },
  { icon: Heart, title: "Recovery timeline view", desc: "Visualize your journey over time" },
  { icon: Wind, title: "Calm breathing prompt", desc: "Center yourself before training" },
  { icon: Smile, title: "Light humor and affirmations", desc: "Encouragement when you need it" },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: [
      "Guided sessions",
      "Classic four scent routine",
      "Reminders",
      "Basic streaks",
      "7 day progress view",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Plus",
    price: "$4.99",
    period: "/month or $39.99/year",
    features: [
      "Full history and charts",
      "Symptom journal",
      "Custom scent library",
      "Recovery timeline",
      "Cloud sync with Google sign in",
      "Export reports",
    ],
    cta: "Upgrade to Plus",
    note: "Best value yearly",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month or $79.99/year",
    features: [
      "Advanced insights",
      "Adaptive training suggestions",
      "Deeper correlations",
      "Early feature access",
    ],
    cta: "Go Premium",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "What is olfactory training?",
    a: "Olfactory training is a rehabilitation technique where you repeatedly smell specific scents to help retrain your brain's smell pathways. It's backed by research and recommended by ENT specialists worldwide."
  },
  {
    q: "How long does it take?",
    a: "Results vary by person. Some people notice improvements in weeks, while others may take several months. Consistency is key - most studies recommend training twice daily for at least 12 weeks."
  },
  {
    q: "What scents do I need?",
    a: "The classic protocol uses rose, lemon, clove, and eucalyptus essential oils. You can purchase these separately or look for olfactory training kits. Olfly also lets you add custom scents."
  },
  {
    q: "What if I miss a day?",
    a: "Don't worry! Missing a day won't reset your progress. Just pick up where you left off. Olfly's reminders help you stay consistent, but the goal is gentle consistency, not perfection."
  },
  {
    q: "Is Olfly medical advice?",
    a: "No. Olfly provides educational and wellness support only. It does not diagnose, treat, or cure any condition. Always consult a healthcare professional for medical advice."
  },
  {
    q: "Can I share progress with my clinician?",
    a: "Yes! Plus and Premium users can export their session data and progress charts to share with their healthcare provider."
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#1A0F35] text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#1A0F35]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href.slice(1))}
                className="text-[#B9AEE2] hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>
          
          <div className="hidden md:block">
            <Button
              onClick={() => setLocation("/launch")}
              className="bg-gradient-to-r from-[#DF37FF] to-[#A259FF] hover:opacity-90 text-white font-bold rounded-full px-6"
              data-testid="nav-cta"
            >
              Start free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#2B215B] border-t border-white/5 px-6 py-4 space-y-4"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href.slice(1))}
                className="block text-[#B9AEE2] hover:text-white transition-colors font-medium w-full text-left py-2"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => setLocation("/launch")}
              className="w-full bg-gradient-to-r from-[#DF37FF] to-[#A259FF] hover:opacity-90 text-white font-bold rounded-full"
            >
              Start free
            </Button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Wake up your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF37FF] to-[#A259FF]">
                super sniffer.
              </span>
            </h1>
            <p className="text-xl text-[#B9AEE2] mb-8">
              Guided smell training, progress tracking, and gentle reminders that help you stay consistent.
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                "Four scent routine, guided step by step",
                "Timers, streaks, and progress charts",
                "Custom scents, symptom logs, and recovery timeline",
                "Designed to feel calm, not clinical",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#B9AEE2]">
                  <Check size={20} className="text-[#A259FF] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mb-4">
              <Button
                onClick={() => setLocation("/launch")}
                className="bg-gradient-to-r from-[#DF37FF] to-[#A259FF] hover:opacity-90 text-white font-bold rounded-full px-8 py-6 text-lg"
                data-testid="hero-cta"
              >
                Start free
              </Button>
              <Button
                onClick={() => scrollTo("how-it-works")}
                variant="outline"
                className="border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF]/10 rounded-full px-8 py-6 text-lg"
              >
                See how it works
              </Button>
            </div>
            
            <p className="text-sm text-[#B9AEE2]/60">
              Educational and wellness support only. Not medical advice.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex justify-center"
          >
            <div className="w-72 h-[500px] rounded-[3rem] bg-gradient-to-br from-[#DF37FF]/30 to-[#A259FF]/30 border border-white/10 flex items-center justify-center p-4">
              <div className="w-full h-full rounded-[2.5rem] bg-[#2B215B] flex items-center justify-center">
                <div className="text-center">
                  <Logo size="lg" />
                  <p className="text-[#B9AEE2] mt-4 text-sm">App Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Band */}
      <section className="bg-[#2B215B]/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: "2", label: "sessions per day" },
              { value: "20", label: "seconds per scent" },
              { value: "4", label: "core scents" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#2B215B] rounded-2xl p-6 text-center border border-white/5">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#DF37FF] to-[#A259FF]">
                  {stat.value}
                </div>
                <div className="text-[#B9AEE2] text-sm mt-1">{stat.label}</div>
              </div>
            ))}
            <div className="bg-[#2B215B] rounded-2xl p-6 border border-white/5">
              <p className="text-[#B9AEE2] italic text-sm">
                "Olfly helped me stay consistent when I felt discouraged."
              </p>
              <p className="text-white/50 text-xs mt-2">— Early user</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How it works</h2>
        <p className="text-[#B9AEE2] text-center mb-12 max-w-xl mx-auto">
          Simple, guided sessions that fit into your daily routine
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Clock, title: "Pick your training times", desc: "Set morning and evening reminders that work for your schedule" },
            { icon: Play, title: "Follow the guided session", desc: "Olfly walks you through each scent with timers and prompts" },
            { icon: TrendingUp, title: "Track progress over weeks", desc: "See how your smell perception improves with charts and logs" },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#2B215B] rounded-2xl p-8 text-center border border-white/5"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#DF37FF]/20 to-[#A259FF]/20 flex items-center justify-center mx-auto mb-4">
                <step.icon size={28} className="text-[#A259FF]" />
              </div>
              <div className="text-[#A259FF] font-bold text-sm mb-2">Step {i + 1}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-[#B9AEE2] text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-[#B9AEE2] mt-8 italic">
          Your nose is doing brain workouts. Yes, really.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#2B215B]/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything you need</h2>
          <p className="text-[#B9AEE2] text-center mb-12 max-w-xl mx-auto">
            Tools designed for your smell recovery journey
          </p>

          <div className="space-y-12">
            {[
              { title: "Guided Training", features: FEATURES_TRAINING },
              { title: "Tracking", features: FEATURES_TRACKING },
              { title: "Personalization", features: FEATURES_PERSONALIZATION },
              { title: "Support", features: FEATURES_SUPPORT },
            ].map((group, gi) => (
              <div key={gi}>
                <h3 className="text-xl font-bold mb-6 text-[#A259FF]">{group.title}</h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.features.map((feature, fi) => (
                    <motion.div
                      key={fi}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: fi * 0.05 }}
                      className="bg-[#2B215B] rounded-xl p-5 border border-white/5"
                    >
                      <feature.icon size={20} className="text-[#A259FF] mb-3" strokeWidth={1.5} />
                      <h4 className="font-bold mb-1">{feature.title}</h4>
                      <p className="text-[#B9AEE2] text-sm">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-[#B9AEE2] text-center mb-12 max-w-xl mx-auto">
          Start free and upgrade when you're ready for more
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 border ${
                plan.highlight 
                  ? "bg-gradient-to-b from-[#DF37FF]/10 to-[#A259FF]/10 border-[#A259FF]" 
                  : "bg-[#2B215B] border-white/5"
              }`}
            >
              {plan.note && (
                <div className="text-xs font-bold text-[#A259FF] mb-2">{plan.note}</div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-[#B9AEE2] text-sm">{plan.period}</span>}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-[#B9AEE2] text-sm">
                    <Check size={16} className="text-[#A259FF] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => setLocation("/launch")}
                className={`w-full rounded-full font-bold ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#DF37FF] to-[#A259FF] hover:opacity-90 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[#B9AEE2]/60 text-sm mt-8">
          Olfly does not guarantee results. Recovery varies by person.
        </p>
      </section>

      {/* Safety */}
      <section id="safety" className="bg-[#2B215B]/30 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-[#2B215B] rounded-2xl p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-[#A259FF]" />
              <h2 className="text-2xl font-bold">Safety first</h2>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Essential oils are for smelling only. Do not ingest.",
                "Stop if irritation occurs.",
                "Consult a healthcare professional for health questions.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#B9AEE2]">
                  <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setLocation("/legal/safety")}
                variant="outline"
                className="border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF]/10 rounded-full"
              >
                Read Safety Guide
              </Button>
              <Button
                onClick={() => setLocation("/legal/disclaimers")}
                variant="outline"
                className="border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF]/10 rounded-full"
              >
                Read Medical Disclaimer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently asked questions</h2>
        
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div 
              key={i}
              className="bg-[#2B215B] rounded-xl border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-[#A259FF] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} 
                />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-5 pb-5 text-[#B9AEE2] text-sm"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-[#DF37FF]/20 to-[#A259FF]/20 rounded-3xl p-8 md:p-12 text-center border border-[#A259FF]/30">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for your smell comeback?
          </h2>
          <p className="text-[#B9AEE2] mb-8 max-w-md mx-auto">
            Start free. Stay consistent. Let Olfly guide the routine.
          </p>
          
          <Button
            onClick={() => setLocation("/launch")}
            className="bg-gradient-to-r from-[#DF37FF] to-[#A259FF] hover:opacity-90 text-white font-bold rounded-full px-10 py-6 text-lg mb-8"
            data-testid="final-cta"
          >
            Start free
          </Button>

          <div className="max-w-sm mx-auto">
            <p className="text-[#B9AEE2] text-sm mb-3">Get launch updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#A259FF]"
              />
              <Button className="bg-white text-[#1A0F35] hover:bg-white/90 rounded-full px-6 font-bold">
                <Mail size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="sm" />
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#B9AEE2]">
              <button onClick={() => setLocation("/legal/terms")} className="hover:text-white">Terms</button>
              <button onClick={() => setLocation("/legal/privacy")} className="hover:text-white">Privacy</button>
              <button onClick={() => setLocation("/legal/disclaimers")} className="hover:text-white">Disclaimers</button>
              <button onClick={() => setLocation("/legal/affiliate")} className="hover:text-white">Affiliate Disclosure</button>
              <button onClick={() => setLocation("/legal/contact")} className="hover:text-white">Contact</button>
            </div>
          </div>
          
          <p className="text-center text-[#B9AEE2]/50 text-xs mt-8">
            Some links may be affiliate links. Olfly provides educational and wellness support only.
          </p>
        </div>
      </footer>
    </div>
  );
}
