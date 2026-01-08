import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Check, ChevronDown, Mail, Menu, X, Users, FileText, 
  BarChart3, Download, Palette, Building2, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import clinicianHero from "@assets/iphone-mockup-featuring-a-female-doctor-at-a-hospital-a6130_1767140328069.png";

const CLINICIAN_FEATURES = [
  { icon: Users, title: "Clinician dashboard for multiple patients", desc: "Manage all your patients from one central view" },
  { icon: BarChart3, title: "Adherence and session frequency tracking", desc: "See which patients are staying consistent" },
  { icon: FileText, title: "Progress summaries over time", desc: "Track improvements across weeks and months" },
  { icon: Download, title: "Exportable PDF progress reports per patient", desc: "Generate documentation for visits and records" },
  { icon: Palette, title: "Templates for common training programs", desc: "Start patients on proven protocols quickly" },
  { icon: Building2, title: "Branded exports and CSV/EHR-friendly options", desc: "Customize reports for your practice" },
];

const CLINICIAN_PRICING = [
  {
    name: "Starter",
    price: "$39–$59",
    period: "/month",
    features: {
      patients: "Up to 10 active patients",
      dashboard: true,
      adherence: true,
      progress: true,
      pdfExport: true,
      templates: false,
      branded: false,
      csv: false,
      team: false,
      priority: false,
    },
    cta: "Request access",
    highlight: false,
  },
  {
    name: "Plus",
    price: "$99–$149",
    period: "/month",
    features: {
      patients: "25–50 active patients",
      dashboard: true,
      adherence: true,
      progress: true,
      pdfExport: true,
      templates: true,
      branded: true,
      csv: false,
      team: false,
      priority: true,
    },
    cta: "Request access",
    highlight: true,
  },
  {
    name: "Clinic/Enterprise",
    price: "Custom",
    period: "",
    features: {
      patients: "Unlimited patients",
      dashboard: true,
      adherence: true,
      progress: true,
      pdfExport: true,
      templates: true,
      branded: true,
      csv: true,
      team: true,
      priority: true,
    },
    cta: "Contact us",
    highlight: false,
  },
];

const FEATURE_ROWS = [
  { key: "patients", label: "Active patients included" },
  { key: "dashboard", label: "Clinician dashboard" },
  { key: "adherence", label: "Patient adherence tracking" },
  { key: "progress", label: "Progress summaries" },
  { key: "pdfExport", label: "Exportable PDF reports per patient" },
  { key: "templates", label: "Program templates" },
  { key: "branded", label: "Branded PDF exports" },
  { key: "csv", label: "CSV export / EHR-friendly export" },
  { key: "team", label: "Team accounts" },
  { key: "priority", label: "Priority support" },
];

const CLINICIAN_FAQS = [
  {
    q: "What is an active patient?",
    a: "An active patient is one who has logged at least one training session in the past 30 days. Inactive patients don't count toward your tier limit."
  },
  {
    q: "Can I export reports for documentation?",
    a: "Yes. All clinician plans include PDF progress reports per patient. Plus and Enterprise tiers offer branded exports and CSV/EHR-compatible formats."
  },
  {
    q: "Do patients need their own paid subscription?",
    a: "No. Patients use the free version of Olfly. Their training data syncs to your clinician dashboard automatically once they're linked to your account."
  },
  {
    q: "How do I get started as a clinician?",
    a: "Click 'Request access' above to fill out a short form. We'll set up your clinician account and send onboarding instructions within 1-2 business days."
  },
];

export default function Clinicians() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    organization: "",
    patientCount: "",
    notes: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const scrollToForm = () => {
    document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#0c0c1d] text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0c0c1d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setLocation("/")}
              className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Olfly
            </button>
          </div>
          
          <div className="hidden md:block">
            <Button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-6"
            >
              Request access
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
            <button
              onClick={() => setLocation("/")}
              className="block text-white/70 hover:text-white transition-colors font-medium w-full text-left py-2"
            >
              Back to Olfly
            </button>
            <Button
              onClick={scrollToForm}
              className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full"
            >
              Request access
            </Button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b1645] border border-[#6d45d2]/30 mb-6">
                <Users size={14} className="text-[#db2faa]" />
                <span className="text-sm text-white/80">For healthcare professionals</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Olfly for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d45d2] to-[#db2faa]">
                  Clinicians
                </span>
              </h1>
              
              <p className="text-xl text-white/80 mb-6 leading-relaxed">
                Support smell training for multiple patients with adherence tracking and exportable progress reports.
              </p>

              <p className="text-sm text-white/50 mb-8">
                Designed for ENT, speech therapy, and care teams.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={scrollToForm}
                  className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full px-8 py-3 text-lg shadow-lg shadow-[#6d45d2]/30"
                >
                  Request clinician access
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img 
                src={clinicianHero} 
                alt="Doctor using Olfly app"
                className="rounded-3xl border border-white/10 shadow-2xl shadow-[#6d45d2]/20 w-full"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#db2faa]/40 to-[#6d45d2]/40 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Clinicians Get */}
      <section className="bg-[#1a1a2e]/50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What clinicians get</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Tools to support patient olfactory rehabilitation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLINICIAN_FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0c0c1d] rounded-2xl p-6 border border-white/5 hover:border-[#6d45d2]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6d45d2]/20 to-[#db2faa]/20 flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-[#db2faa]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Clinician plans</h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Choose the right plan for your practice size
          </p>
        </motion.div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-6">
          {CLINICIAN_PRICING.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-3xl p-6 border ${
                plan.highlight 
                  ? "bg-gradient-to-b from-[#3b1645] to-[#1a1a2e] border-[#6d45d2]" 
                  : "bg-[#1a1a2e] border-white/5"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-white/50">{plan.period}</span>}
              </div>
              
              <ul className="space-y-2 mb-6">
                {FEATURE_ROWS.map((row) => {
                  const value = plan.features[row.key as keyof typeof plan.features];
                  if (typeof value === 'string') {
                    return (
                      <li key={row.key} className="flex items-start gap-3 text-white/70 text-sm">
                        <Check size={16} className="text-[#db2faa] shrink-0 mt-0.5" />
                        <span>{value}</span>
                      </li>
                    );
                  }
                  return (
                    <li key={row.key} className={`flex items-start gap-3 text-sm ${value ? 'text-white/70' : 'text-white/30'}`}>
                      {value ? (
                        <Check size={16} className="text-[#db2faa] shrink-0 mt-0.5" />
                      ) : (
                        <X size={16} className="shrink-0 mt-0.5" />
                      )}
                      <span>{row.label}</span>
                    </li>
                  );
                })}
              </ul>

              <Button
                onClick={scrollToForm}
                className={`w-full rounded-full font-bold py-6 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden md:block overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b border-white/10"></th>
                {CLINICIAN_PRICING.map((plan, i) => (
                  <th key={i} className={`text-center p-4 border-b ${plan.highlight ? 'border-[#6d45d2]' : 'border-white/10'}`}>
                    <div className={`rounded-2xl p-4 ${plan.highlight ? 'bg-gradient-to-b from-[#3b1645] to-transparent' : ''}`}>
                      <div className="text-xl font-bold mb-1">{plan.name}</div>
                      <div className="text-2xl font-bold">
                        {plan.price}
                        {plan.period && <span className="text-sm text-white/50 font-normal">{plan.period}</span>}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row, ri) => (
                <tr key={row.key} className={ri % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                  <td className="text-left p-4 text-white/70 text-sm border-b border-white/5">
                    {row.label}
                  </td>
                  {CLINICIAN_PRICING.map((plan, pi) => {
                    const value = plan.features[row.key as keyof typeof plan.features];
                    return (
                      <td key={pi} className={`text-center p-4 border-b border-white/5 ${plan.highlight ? 'bg-[#6d45d2]/5' : ''}`}>
                        {typeof value === 'string' ? (
                          <span className="text-white/80 text-sm">{value}</span>
                        ) : value ? (
                          <Check size={20} className="text-[#db2faa] mx-auto" />
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-4"></td>
                {CLINICIAN_PRICING.map((plan, i) => (
                  <td key={i} className="text-center p-4">
                    <Button
                      onClick={scrollToForm}
                      className={`rounded-full font-bold px-8 py-3 ${
                        plan.highlight
                          ? "bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        <p className="text-center text-white/40 text-xs mt-8">
          Pricing ranges reflect launch pricing and may change.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Clinician FAQ</h2>
        </motion.div>
        
        <div className="space-y-3">
          {CLINICIAN_FAQS.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden group"
            >
              <summary className="w-full p-5 flex items-center justify-between text-left cursor-pointer list-none">
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className="text-[#db2faa] shrink-0 transition-transform group-open:rotate-180" 
                />
              </summary>
              <div className="px-5 pb-5 text-white/60 text-sm">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Request Form */}
      <section id="request-form" className="max-w-2xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#3b1645] to-[#1a1a2e] rounded-3xl p-8 md:p-12 border border-[#6d45d2]/30"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Clinician access
          </h2>
          <p className="text-white/60 mb-8 text-center">
            Get Olfly for your clinic or care team.
          </p>

          <ul className="space-y-2 mb-8 text-white/70">
            <li className="flex items-center gap-3">
              <Check size={16} className="text-[#db2faa] shrink-0" />
              Clinician dashboard for multiple patients
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-[#db2faa] shrink-0" />
              Adherence tracking and progress summaries
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-[#db2faa] shrink-0" />
              Exportable PDF reports
            </li>
          </ul>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#6d45d2] to-[#db2faa] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <p className="text-xl font-bold mb-2">Thanks. We'll reach out soon.</p>
              <p className="text-white/60 text-sm">Check your email for next steps.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-white/70 text-sm">Full name</Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Dr. Jane Smith"
                  data-testid="input-clinician-name"
                />
              </div>

              <div>
                <Label htmlFor="workEmail" className="text-white/70 text-sm">Work email</Label>
                <Input
                  id="workEmail"
                  type="email"
                  required
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="jane@clinic.com"
                  data-testid="input-clinician-email"
                />
              </div>

              <div>
                <Label htmlFor="organization" className="text-white/70 text-sm">Organization / clinic name</Label>
                <Input
                  id="organization"
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="City ENT Clinic"
                  data-testid="input-clinician-org"
                />
              </div>

              <div>
                <Label htmlFor="patientCount" className="text-white/70 text-sm">Approx. patient count</Label>
                <Select
                  value={formData.patientCount}
                  onValueChange={(value) => setFormData({ ...formData, patientCount: value })}
                >
                  <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white" data-testid="select-patient-count">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1–10 patients</SelectItem>
                    <SelectItem value="11-25">11–25 patients</SelectItem>
                    <SelectItem value="26-50">26–50 patients</SelectItem>
                    <SelectItem value="51+">51+ patients</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-white/70 text-sm">Notes (optional)</Label>
                <Input
                  id="notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Any questions or comments"
                  data-testid="input-clinician-notes"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full py-3 text-lg mt-6"
                data-testid="button-clinician-submit"
              >
                Request access
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm mb-2">Or email us directly</p>
            <a 
              href="mailto:support@olfly.app" 
              className="text-[#db2faa] hover:underline"
            >
              support@olfly.app
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="sm" />
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
              <button onClick={() => setLocation("/")} className="hover:text-white transition-colors">Back to Olfly home</button>
              <button onClick={() => setLocation("/legal/terms")} className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => setLocation("/legal/privacy")} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => setLocation("/legal/contact")} className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          
          <p className="text-center text-white/30 text-xs mt-8">
            Olfly provides educational and wellness support only. Not medical advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
