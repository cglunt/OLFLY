import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function Article() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#05050A]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="hover:bg-white/10 rounded-full text-white">
           <ChevronLeft className="h-6 w-6" />
        </Button>
        <span className="font-bold text-sm tracking-wider uppercase opacity-70">Discover</span>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full text-white">
                <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full text-white">
                <Share2 className="h-5 w-5" />
            </Button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 pb-20 px-6 md:px-8 max-w-2xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-4">
                Science & Health
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Restoring Your Sense of Smell: The Complete Guide
            </h1>
            
            <div className="flex items-center gap-3 mb-8 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <span>By Olfly Medical Team • 5 min read</span>
            </div>

            <div className="prose prose-invert prose-lg max-w-none space-y-8 text-white/80 leading-relaxed">
                
                <p className="text-xl text-white/90 font-medium leading-relaxed">
                    The primary recommended approach to restoring the sense of smell after COVID-19 is olfactory (smell) training. It works by stimulating nerve pathways and encouraging the regeneration of olfactory neurons, similar to physical therapy for muscles.
                </p>

                <hr className="border-white/10" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">The Technique: How to Train</h2>
                    <div className="bg-[#1A1A2E] p-6 rounded-2xl border border-white/5 mb-6">
                        <h3 className="text-lg font-bold text-purple-300 mb-4 uppercase tracking-wide">Step-by-Step</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white mt-1">1</span>
                                <span>Place a few drops of essential oil on a cotton ball, or use raw material like ground coffee or orange peel.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white mt-1">2</span>
                                <span>Bring the scent within an inch of your nose. Take <strong>slow, natural sniffs</strong> for about 15-20 seconds. Avoid aggressive sniffing.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white mt-1">3</span>
                                <span>Actively try to <strong>recall the smell</strong> and form a mental connection or memory of it while sniffing.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white mt-1">4</span>
                                <span>Take a short break (10 seconds) and repeat with the next scent.</span>
                            </li>
                        </ul>
                    </div>
                    <p>
                        This routine should be performed <strong>twice daily for several months</strong>. Consistency and patience are crucial. After about 3 months, it can be beneficial to switch to a new set of scents to provide varied stimulation.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Other Potential Treatments</h2>
                    <p>While smell training is the gold standard, other treatments are being explored:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-purple-500">
                        <li><strong>Nasal Steroid Sprays:</strong> May reduce inflammation but effectiveness for COVID-related anosmia is varying.</li>
                        <li><strong>Supplements:</strong> Omega-3s, alpha-lipoic acid, or vitamin A are sometimes suggested for their restorative properties.</li>
                        <li><strong>Experimental:</strong> Platelet-Rich Plasma (PRP) injections or stellate ganglion blocks are in clinical trials.</li>
                        <li><strong>Medications:</strong> Early use of Paxlovid may decrease risk. Gabapentin has shown some promise for parosmia (distorted smell).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">When to See a Doctor</h2>
                    <p>
                        Most people regain their sense of smell over time. However, consult an ENT specialist or smell clinic if:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-purple-500">
                        <li>Loss persists after 3-6 months</li>
                        <li>Conditions worsen</li>
                        <li>It causes significant distress, anxiety, or depression</li>
                    </ul>
                </section>

                <section className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
                    <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                        ⚠️ Safety Precautions
                    </h2>
                    <p className="mb-4">Losing your sense of smell can pose safety risks in daily life:</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-red-400">
                        <li>Ensure all smoke and carbon monoxide detectors are working properly.</li>
                        <li>Be diligent about checking food expiration dates.</li>
                        <li>Use food thermometers to ensure proper cooking temperatures.</li>
                    </ul>
                </section>

            </div>
        </motion.div>
      </main>
    </div>
  );
}