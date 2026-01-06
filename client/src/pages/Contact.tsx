import { useState } from "react";
import Layout from "@/components/Layout";
import { Mail, MessageCircle, HelpCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Contact and Support</h1>
          <p className="text-white/70">We're here to help</p>
        </header>

        {isSubmitted ? (
          <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-white/5 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-white/60 mb-6">Thank you for reaching out. We'll get back to you as soon as possible.</p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full"
            >
              Send another message
            </Button>
          </div>
        ) : (
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
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full py-6 disabled:opacity-50"
              data-testid="button-contact-submit"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}

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
