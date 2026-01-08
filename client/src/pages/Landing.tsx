import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  TrendingUp, Sparkles, Timer, BarChart3, Palette,
  BookOpen, Check, ChevronDown, Mail, Menu, X, Star, Stethoscope, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { CookieSettingsButton } from "@/components/CookieConsentBanner";

import onboarding1 from "@/assets/onboarding1.jpg";
import onboarding2 from "@/assets/onboarding2.jpg";
import session1 from "@/assets/session1.jpg";
import statsImg from "@/assets/stats.jpg";
import lowerGina from "@assets/Lower_Gina@2x_1767069623166.png";
import heroBanner from "@assets/HeroBackground_(5)_1767830022017.jpg";
import cloveImg from "@assets/generated_images/close-up_of_dried_cloves.png";
import lemonImg from "@assets/generated_images/close-up_of_fresh_lemon.png";
import roseImg from "@assets/generated_images/close-up_of_a_pink_rose.png";
import eucalyptusImg from "@assets/generated_images/close-up_of_eucalyptus_leaves.png";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const SCENTS = [
  { name: "Clove", img: cloveImg },
  { name: "Lemon", img: lemonImg },
  { name: "Rose", img: roseImg },
  { name: "Eucalyptus", img: eucalyptusImg },
];

const FEATURES = [
  { icon: Timer, title: "Build a simple daily routine", desc: "Short timed sessions that fit into any schedule" },
  { icon: TrendingUp, title: "See improvement over time", desc: "Track your progress with visual charts and streaks" },
  { icon: Palette, title: "Use scents you already have", desc: "Start with household items or essential oils" },
  { icon: BookOpen, title: "Notice patterns and changes", desc: "Log symptoms and observations day to day" },
  { icon: BarChart3, title: "Stay motivated with progress", desc: "Beautiful visualization of your journey" },
  { icon: Sparkles, title: "Stay consistent without overthinking", desc: "Daily streaks and gentle reminders keep you on track" },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: [
      "Guided smell training sessions",
      "Classic four-scent routine",
      "Daily reminders",
      "7-day progress view",
    ],
    desc: "Get started and feel early progress",
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Plus",
    price: "$6.99",
    period: "/month",
    features: [
      "Full progress history and charts",
      "Recovery timeline",
      "Symptom journal",
      "Custom scent library",
      "Exportable personal reports",
      "Cloud sync",
    ],
    desc: "Deeper insight into your recovery",
    cta: "Upgrade to Plus",
    note: "Most popular",
    highlight: true,
  },
];

const FAQS = [
  {
    q: "Who is smell training for?",
    a: "Smell training is for anyone experiencing reduced or altered sense of smell. It's commonly used after respiratory infections, post-viral conditions, or other causes of olfactory changes. Consistency is key, and results vary by person."
  },
  {
    q: "How long does it take to see results?",
    a: "Most people begin noticing changes within 4-12 weeks of consistent daily training. Some may take longer. The key is training twice daily and staying patient with the process."
  },
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
    q: "Is Olfly medical advice?",
    a: "No. Olfly provides educational and wellness support only. It does not diagnose, treat, or cure any condition. Always consult a healthcare professional for medical advice."
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#0c0c1d] text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0c0c1d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href.slice(1))}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => setLocation("/clinicians")}
              variant="outline"
              className="border-[#db2faa]/50 text-[#db2faa] hover:bg-[#db2faa]/10 rounded-full px-4 py-2 text-sm font-medium"
              data-testid="nav-clinicians"
            >
              For Clinicians
            </Button>
          </div>
          
          <div className="hidden md:block">
            <Button
              onClick={() => setLocation("/launch")}
              className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-6"
              data-testid="nav-cta"
            >
              Start free
            </Button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#1a1a2e] border-t border-white/5 px-6 py-4 space-y-4"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href.slice(1))}
                className="block text-white/70 hover:text-white transition-colors font-medium w-full text-left py-2"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => setLocation("/clinicians")}
              variant="outline"
              className="w-full border-[#db2faa]/50 text-[#db2faa] hover:bg-[#db2faa]/10 rounded-full font-medium"
              data-testid="mobile-nav-clinicians"
            >
              For Clinicians
            </Button>
            <Button
              onClick={() => setLocation("/launch")}
              className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full"
            >
              Start free
            </Button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[90vh]">
          {/* Text Column */}
          <div className="relative z-20 flex-1 md:basis-1/2 bg-[#0c0c1d] flex items-center">
            <div className="px-6 md:px-12 lg:px-16 py-16 md:py-24 max-w-xl ml-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b1645] border border-[#6d45d2]/30 mb-6">
                  <span className="text-sm text-white/80">Smell training made simple</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  Wake up your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d45d2] to-[#db2faa]">
                    super sniffer.
                  </span>
                </h1>
                
                <p className="text-lg text-white/80 mb-6">
                  Train and restore your sense of smell with guided daily scent exercises, timers, and progress tracking.
                </p>

                <ul className="space-y-2 mb-6 text-white/70">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#db2faa]" />
                    Guided olfactory training with short timed sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#db2faa]" />
                    Twice-daily routine designed to be simple and consistent
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#db2faa]" />
                    Track streaks, notes, and progress charts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#db2faa]" />
                    Works with scents you already have at home
                  </li>
                </ul>

                <p className="text-xs text-[#db2faa] mb-6">
                  Inspired by research-backed smell training protocols used for olfactory recovery.
                </p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <Button
                    onClick={() => setLocation("/launch")}
                    className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-8 py-3 text-lg shadow-lg shadow-[#6d45d2]/30"
                    data-testid="hero-cta"
                  >
                    Start free
                  </Button>
                  <Button
                    onClick={() => scrollTo("how-it-works")}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-3 text-lg"
                  >
                    See how it works
                  </Button>
                </div>
                
                <p className="text-sm text-white/50">
                  Start free. Upgrade only if it helps.
                </p>
              </motion.div>
            </div>
            {/* Gradient overlay extending into image */}
            <div className="hidden md:block absolute top-0 bottom-0 -right-48 w-48 bg-gradient-to-r from-[#0c0c1d] via-[#0c0c1d]/60 to-transparent z-30" />
          </div>
          
          {/* Image Column */}
          <div className="relative flex-1 md:basis-1/2 min-h-[50vh] md:min-h-0">
            <img 
              src={heroBanner} 
              alt="Olfly app in use"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1d] via-transparent to-[#0c0c1d]/20" />
          </div>
        </div>
      </section>

      {/* App Store Announcement */}
      <section className="bg-gradient-to-r from-[#6d45d2]/20 to-[#db2faa]/20 py-10 border-y border-[#6d45d2]/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6d45d2]/20 border border-[#6d45d2]/40 mb-4">
              <span className="text-sm font-medium text-white">Now Available</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Download Olfly on your favorite app store
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a 
                href="https://play.google.com/store" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
                data-testid="link-google-play"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-14"
                />
              </a>
              <a 
                href="https://apps.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
                data-testid="link-app-store"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  className="h-14"
                />
              </a>
            </div>
            <p className="text-white/50 text-sm mt-4">
              Available on iOS and Android devices
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-gradient-to-r from-[#3b1645]/50 to-[#1a1a2e]/50 py-12 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "2x", label: "per day" },
              { value: "20s", label: "per scent" },
              { value: "4", label: "core scents to start" },
              { value: "12+", label: "week programs" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6d45d2] to-[#db2faa]">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Olfly works</h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Simple, guided sessions that fit into your daily routine
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              img: onboarding1, 
              title: "Set your schedule", 
              desc: "Choose morning and evening training times that work for you",
              outcome: "Build a consistent habit that supports olfactory retraining.",
              step: 1
            },
            { 
              img: session1, 
              title: "Follow guided sessions", 
              desc: "Olfly walks you through each scent with timers and breathing prompts",
              outcome: "Learn to focus on scent, breathe, and identify notes.",
              step: 2
            },
            { 
              img: statsImg, 
              title: "Track your progress", 
              desc: "See how your smell perception improves over weeks and months",
              outcome: "See changes over time and stay motivated.",
              step: 3
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group"
            >
              <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a2e]">
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full aspect-[9/16] object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/60 mb-2">{item.desc}</p>
              <p className="text-[#db2faa] text-sm font-medium">{item.outcome}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scent Cards Section */}
      <section className="bg-[#1a1a2e]/50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Smell training{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d45d2] to-[#db2faa]">
                  really works
                </span>
              </h2>
              <p className="text-white/70 mb-4 text-lg leading-relaxed">
                Research suggests repeated scent exposure can support olfactory retraining over time. Just 20 seconds per scent, twice a day. That's all it takes.
              </p>
              <p className="text-white/50 text-sm mb-6">
                Results vary, but consistency matters.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {SCENTS.map((scent, i) => (
                  <motion.div
                    key={scent.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl p-4 bg-white relative overflow-hidden flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#6d45d2]/20">
                      <img src={scent.img} alt={scent.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[#0c0c1d] font-bold text-lg">{scent.name}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-2xl p-6">
                <p className="text-white font-bold text-lg mb-1">
                  "Twenty seconds per scent. You got this."
                </p>
                <p className="text-white/70 text-sm">
                  Your nose is cheering for you already.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src={onboarding2} 
                alt="Scent training screen"
                className="rounded-3xl border border-white/10 shadow-2xl shadow-[#6d45d2]/20 w-full max-w-sm mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#db2faa]/40 to-[#6d45d2]/40 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Tools designed for your smell recovery journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5 hover:border-[#6d45d2]/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6d45d2]/20 to-[#db2faa]/20 flex items-center justify-center mb-4">
                <feature.icon size={24} className="text-[#db2faa]" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Character Section */}
      <section className="bg-[#3c1443] py-20 relative overflow-hidden">
        <img 
          src={lowerGina} 
          alt=""
          className="absolute bottom-0 right-0 w-64 md:w-80 lg:w-96 object-contain opacity-60 pointer-events-none"
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your journey{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d45d2] to-[#db2faa]">
                starts here
              </span>
            </h2>
            <p className="text-white/70 text-lg mb-2 max-w-lg mx-auto">
              A supportive space to stay consistent and celebrate progress.
            </p>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Stay consistent. Stay patient. Olfly is with you every day.
            </p>
            <Button
              onClick={() => setLocation("/launch")}
              className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-10 py-3 text-lg"
              data-testid="button-begin-training"
            >
              Begin training
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing</h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Start free and upgrade only if you want more guidance and tracking.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-3xl p-8 border flex flex-col ${
                plan.highlight 
                  ? "bg-gradient-to-b from-[#3b1645] to-[#1a1a2e] border-[#6d45d2]" 
                  : "bg-[#1a1a2e] border-white/5"
              }`}
            >
              {plan.note && (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#db2faa] mb-4 px-3 py-1 rounded-full bg-[#db2faa]/10">
                  <Star size={12} fill="currentColor" />
                  {plan.note}
                </div>
              )}
              {!plan.note && <div className="h-[26px] mb-4" />}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-white/50">{plan.period}</span>}
              </div>
              {plan.desc && (
                <p className="text-white/50 text-sm mb-6">{plan.desc}</p>
              )}
              
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-3 text-white/70 text-sm">
                    <Check size={16} className="text-[#db2faa] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {plan.price !== "$0" && (
                  <p className="text-xs text-white/40 mb-4">Cancel anytime.</p>
                )}
                {plan.price === "$0" && <div className="h-[20px] mb-4" />}

                <Button
                  onClick={() => setLocation("/launch")}
                  className={`w-full rounded-full font-bold py-3 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  data-testid={`button-${plan.name.toLowerCase()}-cta`}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Launch pricing (subject to change). Olfly does not guarantee results.
        </p>

        {/* Clinician Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-[#1a1a2e] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6d45d2]/20 to-[#db2faa]/20 flex items-center justify-center shrink-0">
            <Stethoscope size={32} className="text-[#db2faa]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">For clinicians and care teams</h3>
            <p className="text-white/60 text-sm">
              Support patient recovery with a clinician dashboard, adherence tracking, and exportable progress reports.
            </p>
          </div>
          <Button
            onClick={() => setLocation("/clinicians")}
            className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-full px-6 whitespace-nowrap"
          >
            Request clinician access
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>
      </section>

      
      {/* FAQ */}
      <section id="faq" className="bg-[#3c1443] py-20">
        <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
        </motion.div>
        
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#ac41c3] rounded-2xl border border-white/10 overflow-hidden group"
            >
              <summary className="w-full p-5 flex items-center justify-between text-left cursor-pointer list-none">
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className="text-[#3c1443] shrink-0 transition-transform group-open:rotate-180" 
                />
              </summary>
              <div className="px-5 pb-5 text-white/60 text-sm">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#3b1645] to-[#1a1a2e] rounded-3xl p-8 md:p-12 text-center border border-[#6d45d2]/30"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for your smell comeback?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Start free and rebuild your sense of smell with simple daily training.
          </p>
          
          <Button
            onClick={() => setLocation("/launch")}
            className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-10 py-3 text-lg mb-8 shadow-lg shadow-[#6d45d2]/30"
            data-testid="final-cta"
          >
            Start free
          </Button>

          <div className="max-w-sm mx-auto">
            <p className="text-white/50 text-sm mb-3">Get launch updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#6d45d2]"
                data-testid="input-email-subscribe"
              />
              <Button className="bg-white text-[#0c0c1d] hover:bg-white/90 rounded-full px-6 font-bold" data-testid="button-email-subscribe">
                <Mail size={18} />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="sm" />
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
              <button onClick={() => setLocation("/clinicians")} className="hover:text-white transition-colors">For Clinicians</button>
              <button onClick={() => setLocation("/legal/terms")} className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => setLocation("/legal/privacy")} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => setLocation("/cookie-policy")} className="hover:text-white transition-colors">Cookie Policy</button>
              <button onClick={() => setLocation("/legal/disclaimers")} className="hover:text-white transition-colors">Disclaimers</button>
              <button onClick={() => setLocation("/legal/contact")} className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <CookieSettingsButton />
          </div>
          <p className="text-center text-white/30 text-xs mt-4">
            Olfly provides educational and wellness support only. Not medical advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
