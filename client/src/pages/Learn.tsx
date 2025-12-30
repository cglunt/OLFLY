import Layout from "@/components/Layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ShieldAlert, Sparkles, FileText, Zap, Activity } from "lucide-react";
import { useLocation } from "wouter";

export default function Learn() {
  const [, setLocation] = useLocation();
  
  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white">Learn</h1>
          <p className="text-white/70">Understanding olfactory training and recovery.</p>
        </header>

        <Card className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white border-none shadow-md rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">How it works</h2>
              <p className="text-white/90 leading-relaxed text-sm">
                Olfactory training uses neuroplasticity. By actively sniffing familiar scents and focusing on them, you stimulate the olfactory nerve to regenerate and forge new pathways to the brain.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Common Questions</h3>
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">How long does it take?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                Recovery is unique to everyone. Some see results in weeks, others in months. Studies suggest sticking with the protocol twice daily for at least 12-16 weeks for best results.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">What if I smell nothing?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                That is completely normal at the start. The exercise is about <em>trying</em> to smell and visualizing the scent. The effort itself stimulates the nerves.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">Can I change scents?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                Yes! After 12 weeks, or if you get bored, switching to a new set of 4 scents can help challenge your nose in new ways.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Safety Tips</h3>
          <div className="grid gap-4">
             <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4 shadow-md">
                <ShieldAlert className="h-6 w-6 text-[#ac41c3] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-base">Don't Sniff Too Hard</h4>
                  <p className="text-sm text-white/70">Gentle "bunny sniffs" are better than deep lung-filling inhales. Keep the scent jar 1-2 inches from your nose.</p>
                </div>
             </div>
             <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4 shadow-md">
                <Sparkles className="h-6 w-6 text-[#db2faa] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-base">Clean Essential Oils</h4>
                  <p className="text-sm text-white/70">If using essential oils, ensure they are high quality. Do not touch the oil to your skin directly.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Discover Section */}
        <div className="space-y-4">
           <h3 className="text-lg font-bold text-white">Discover</h3>
           <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
              <div 
                className="min-w-[220px] h-[140px] bg-[#3b1645] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#4a1c57] transition-colors cursor-pointer shadow-md shadow-black/40"
                onClick={() => setLocation("/article/restoring-smell")}
                data-testid="card-article-restoring"
              >
                <div className="p-2 bg-[#ac41c3]/20 w-fit rounded-xl">
                    <FileText size={20} className="text-[#ac41c3]" />
                </div>
                <div>
                    <p className="text-xs text-white/70 mb-1 uppercase tracking-wide">Essential Read</p>
                    <h4 className="font-bold text-white text-base leading-tight">Restoring Your Smell</h4>
                </div>
              </div>

              <div className="min-w-[220px] h-[140px] bg-[#3b1645] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#4a1c57] transition-colors cursor-pointer shadow-md shadow-black/40 opacity-70">
                <div className="p-2 bg-[#ac41c3]/20 w-fit rounded-xl">
                    <Zap size={20} className="text-[#db2faa]" />
                </div>
                <div>
                    <p className="text-xs text-white/70 mb-1 uppercase tracking-wide">Quick Tip</p>
                    <h4 className="font-bold text-white text-base leading-tight">Safety First</h4>
                </div>
              </div>

              <div className="min-w-[220px] h-[140px] bg-[#3b1645] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#4a1c57] transition-colors cursor-pointer shadow-md shadow-black/40 opacity-70">
                <div className="p-2 bg-[#ac41c3]/20 w-fit rounded-xl">
                    <Activity size={20} className="text-[#db2faa]" />
                </div>
                <div>
                    <p className="text-xs text-white/70 mb-1 uppercase tracking-wide">Science</p>
                    <h4 className="font-bold text-white text-base leading-tight">How Neurons Heal</h4>
                </div>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
