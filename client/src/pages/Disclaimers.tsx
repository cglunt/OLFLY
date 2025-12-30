import Layout from "@/components/Layout";
import { AlertTriangle } from "lucide-react";

export default function Disclaimers() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Medical Disclaimer</h1>
          <p className="text-white/70">Important health information</p>
        </header>

        <div className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-2xl p-5 flex gap-4">
          <AlertTriangle className="w-8 h-8 text-white shrink-0" />
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">For Educational Purposes Only</h2>
            <p className="text-white/90 text-sm leading-relaxed">
              Olfly provides educational and wellness support only. It does not provide medical 
              advice, diagnosis, or treatment.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Medical Disclaimer</h2>
            <p>
              Olfly provides educational and wellness support only. It does not provide medical 
              advice, diagnosis, or treatment. If you have questions about symptoms or your health, 
              talk with a qualified healthcare professional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">No Guarantee of Results</h2>
            <p>
              Results vary by person. Olfly does not guarantee improvement or restoration of smell 
              or taste. Research shows that olfactory training can help many people, but individual 
              outcomes depend on many factors including the cause and duration of smell loss.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Emergency Disclaimer</h2>
            <p>
              Olfly is not for emergency use. If you have severe symptoms or urgent concerns, 
              seek immediate medical care. Sudden loss of smell can sometimes indicate serious 
              conditions that require prompt medical attention.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Educational Content</h2>
            <p>
              Content in Olfly is informational only and should not be considered medical advice. 
              We strive to provide accurate, research-based information, but this should complement, 
              not replace, professional medical guidance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Your Responsibility</h2>
            <p>
              You are responsible for how you use information in the app and for your health decisions. 
              Always consult professionals for medical guidance.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
