import Layout from "@/components/Layout";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function Contact() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Contact and Support</h1>
          <p className="text-white/70">We're here to help</p>
        </header>

        <div className="space-y-4">
          <a 
            href="mailto:support@olfly.com"
            className="bg-[#3b1645] rounded-2xl p-5 flex gap-4 hover:bg-[#4a1c57] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#ac41c3]/20 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-[#ac41c3]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Email Support</h3>
              <p className="text-sm text-white/70">support@olfly.com</p>
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
              <p className="text-xs text-white/50 mt-1">Share ideas at feedback@olfly.com</p>
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
              For data deletion or privacy-related requests, contact privacy@olfly.com
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
