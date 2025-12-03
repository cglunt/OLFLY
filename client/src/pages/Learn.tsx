import Layout from "@/components/Layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ShieldAlert, Sparkles } from "lucide-react";

export default function Learn() {
  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white">Learn</h1>
          <p className="text-[#B9AEE2]">Understanding olfactory training and recovery.</p>
        </header>

        <Card className="bg-gradient-to-r from-[#DF37FF] to-[#A259FF] text-white border-none shadow-md rounded-2xl">
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
              <AccordionTrigger className="bg-[#2B215B] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">How long does it take?</AccordionTrigger>
              <AccordionContent className="bg-[#2B215B] px-4 pb-4 rounded-b-xl text-[#B9AEE2]">
                Recovery is unique to everyone. Some see results in weeks, others in months. Studies suggest sticking with the protocol twice daily for at least 12-16 weeks for best results.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="bg-[#2B215B] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">What if I smell nothing?</AccordionTrigger>
              <AccordionContent className="bg-[#2B215B] px-4 pb-4 rounded-b-xl text-[#B9AEE2]">
                That is completely normal at the start. The exercise is about <em>trying</em> to smell and visualizing the scent. The effort itself stimulates the nerves.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="bg-[#2B215B] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">Can I change scents?</AccordionTrigger>
              <AccordionContent className="bg-[#2B215B] px-4 pb-4 rounded-b-xl text-[#B9AEE2]">
                Yes! After 12 weeks, or if you get bored, switching to a new set of 4 scents can help challenge your nose in new ways.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Safety Tips</h3>
          <div className="grid gap-4">
             <div className="bg-[#2B215B] rounded-2xl p-5 flex gap-4 shadow-md">
                <ShieldAlert className="h-6 w-6 text-[#DF37FF] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-base">Don't Sniff Too Hard</h4>
                  <p className="text-sm text-[#B9AEE2]">Gentle "bunny sniffs" are better than deep lung-filling inhales. Keep the scent jar 1-2 inches from your nose.</p>
                </div>
             </div>
             <div className="bg-[#2B215B] rounded-2xl p-5 flex gap-4 shadow-md">
                <Sparkles className="h-6 w-6 text-[#A259FF] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-base">Clean Essential Oils</h4>
                  <p className="text-sm text-[#B9AEE2]">If using essential oils, ensure they are high quality. Do not touch the oil to your skin directly.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
