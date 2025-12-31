import { useState } from "react";
import Layout from "@/components/Layout";
import { Mail, MessageCircle, HelpCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:support@olfly.app?subject=${encodeURIComponent(subject || 'Contact Form Submission')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Contact and Support</h1>
          <p className="text-white/70">We're here to help</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-[#1a1a2e] rounded-2xl p-6 space-y-4 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Send us a message</h2>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              data-testid="input-contact-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">Your Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              data-testid="input-contact-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white/80">Subject</Label>
            <Input
              id="subject"
              type="text"
              placeholder="How can we help?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              data-testid="input-contact-subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white/80">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us more..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
              data-testid="input-contact-message"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full py-6"
            data-testid="button-contact-submit"
          >
            <Send size={18} className="mr-2" />
            Send Message
          </Button>
          
          <p className="text-xs text-white/40 text-center">
            This will open your email app with the message pre-filled
          </p>
        </form>

        <div className="space-y-4">
          <a 
            href="mailto:support@olfly.app"
            className="bg-[#3b1645] rounded-2xl p-5 flex gap-4 hover:bg-[#4a1c57] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#ac41c3]/20 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-[#ac41c3]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Email Support</h3>
              <p className="text-sm text-white/70">support@olfly.app</p>
              <p className="text-xs text-white/50 mt-1">We typically respond within 24-48 hours</p>
            </div>
          </a>

          <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ac41c3]/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-[#ac41c3]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Feedback</h3>
              <p className="text-sm text-white/70">We love hearing from you</p>
              <p className="text-xs text-white/50 mt-1">Share ideas at feedback@olfly.app</p>
            </div>
          </div>

          <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ac41c3]/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-[#ac41c3]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">FAQs</h3>
              <p className="text-sm text-white/70">Check the Learn section for common questions</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Privacy Requests</h2>
            <p>
              For data deletion or privacy-related requests, contact privacy@olfly.app
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
