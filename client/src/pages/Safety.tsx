import Layout from "@/components/Layout";
import { Droplets, AlertTriangle, Baby, Hand, Eye } from "lucide-react";

export default function Safety() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Essential Oil Safety</h1>
          <p className="text-white/70">Important safety guidelines</p>
        </header>

        <div className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-2xl p-5 flex gap-4">
          <Droplets className="w-8 h-8 text-white shrink-0" />
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Use With Care</h2>
            <p className="text-white/90 text-sm leading-relaxed">
              Essential oils are powerful. Follow these guidelines for safe use during your 
              olfactory training.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-1">Do Not Ingest</h3>
              <p className="text-sm text-white/70">
                Never swallow essential oils. They are for external use and inhalation only.
              </p>
            </div>
          </div>

          <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4">
            <Hand className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-1">Avoid Direct Skin Contact</h3>
              <p className="text-sm text-white/70">
                Unless properly diluted with a carrier oil, do not apply essential oils directly to skin.
              </p>
            </div>
          </div>

          <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4">
            <Baby className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-1">Keep Away from Children and Pets</h3>
              <p className="text-sm text-white/70">
                Store essential oils in a safe place out of reach of children and animals.
              </p>
            </div>
          </div>

          <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4">
            <Eye className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-1">Avoid Eye Area</h3>
              <p className="text-sm text-white/70">
                Keep oils away from eyes and sensitive areas. If contact occurs, rinse thoroughly with water.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">For Olfactory Training</h2>
            <p>
              When using essential oils for smell training, hold the bottle 1-2 inches from your nose. 
              Use gentle "bunny sniffs" rather than deep inhales. Each scent session should last 
              about 20 seconds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Quality Matters</h2>
            <p>
              Use high-quality, pure essential oils from reputable sources. Avoid synthetic fragrances 
              which may not provide the same benefits for olfactory training.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">If Irritation Occurs</h2>
            <p>
              Stop use immediately if you experience irritation, headache, or discomfort. 
              Consult a healthcare professional if symptoms persist.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
