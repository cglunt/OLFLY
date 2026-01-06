import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { ChevronRight, FileText, Shield, AlertTriangle, Link2, Droplets, Mail } from "lucide-react";
import { useLocation } from "wouter";

const legalItems = [
  { title: "Terms of Use", icon: FileText, path: "/legal/terms" },
  { title: "Privacy Policy", icon: Shield, path: "/legal/privacy" },
  { title: "Medical Disclaimer", icon: AlertTriangle, path: "/legal/disclaimers" },
  { title: "Affiliate Disclosure", icon: Link2, path: "/legal/affiliate" },
  { title: "Essential Oil Safety", icon: Droplets, path: "/legal/safety" },
  { title: "Contact and Support", icon: Mail, path: "/legal/contact" },
];

export default function Legal() {
  const [location, setLocation] = useLocation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsAcceptedAt, setTermsAcceptedAt] = useState<string | null>(null);
  const [termsVersion, setTermsVersion] = useState("Not accepted");
  
  const backPath = location.startsWith("/launch") ? "/launch/settings" : "/";

  useEffect(() => {
    setTermsAccepted(localStorage.getItem("termsAccepted") === "true");
    setTermsAcceptedAt(localStorage.getItem("termsAcceptedAt"));
    setTermsVersion(localStorage.getItem("termsVersion") || "Not accepted");
  }, []);

  return (
    <Layout showBack backPath={backPath}>
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Legal</h1>
          <p className="text-white/70">Terms, policies, and disclosures</p>
        </header>

        <div className="space-y-2">
          {legalItems.map((item) => (
            <div
              key={item.path}
              onClick={() => setLocation(item.path)}
              className="bg-[#3b1645] rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-[#4a1c57] transition-colors"
              data-testid={`link-${item.path.replace("/legal/", "")}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <item.icon size={18} className="text-[#ac41c3]" />
              </div>
              <span className="flex-1 text-white font-medium">{item.title}</span>
              <ChevronRight size={20} className="text-white/40" />
            </div>
          ))}
        </div>

        <div className="bg-[#3b1645] rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-bold">Acceptance Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Terms accepted</span>
              <span className={termsAccepted ? "text-green-400" : "text-red-400"}>
                {termsAccepted ? "Yes" : "No"}
              </span>
            </div>
            {termsAcceptedAt && (
              <div className="flex justify-between">
                <span className="text-white/60">Accepted on</span>
                <span className="text-white">{new Date(termsAcceptedAt).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-white/60">Version</span>
              <span className="text-white">{termsVersion}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#3b1645] rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-bold">Attribution</h3>
          <div className="space-y-2 text-sm text-white/60">
            <p>
              Training chime sound by <a href="https://pixabay.com/users/gigidelaro-46661168/" target="_blank" rel="noopener noreferrer" className="text-[#ac41c3] hover:underline">Gigi De La Ro</a> from <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="text-[#ac41c3] hover:underline">Pixabay</a>.
            </p>
            <p>
              Notification sound by <a href="https://pixabay.com/users/koiroylers-44305058/" target="_blank" rel="noopener noreferrer" className="text-[#ac41c3] hover:underline">Koi Roylers</a> from <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="text-[#ac41c3] hover:underline">Pixabay</a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
