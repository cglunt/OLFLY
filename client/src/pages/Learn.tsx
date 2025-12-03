import Layout from "@/components/Layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ShieldAlert, Sparkles } from "lucide-react";

export default function Learn() {
  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Learn</h1>
          <p className="text-muted-foreground">Understanding olfactory training and recovery.</p>
        </header>

        <Card className="bg-gradient-to-br from-primary/80 to-primary text-white border-none shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">How it works</h2>
              <p className="text-primary-foreground/90 leading-relaxed">
                Olfactory training uses neuroplasticity. By actively sniffing familiar scents and focusing on them, you stimulate the olfactory nerve to regenerate and forge new pathways to the brain.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Common Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How long does it take?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Recovery is unique to everyone. Some see results in weeks, others in months. Studies suggest sticking with the protocol twice daily for at least 12-16 weeks for best results.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What if I smell nothing?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                That is completely normal at the start. The exercise is about <em>trying</em> to smell and visualizing the scent. The effort itself stimulates the nerves.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I change scents?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! After 12 weeks, or if you get bored, switching to a new set of 4 scents can help challenge your nose in new ways.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Safety Tips</h3>
          <div className="grid gap-4">
             <Card>
              <CardContent className="p-4 flex gap-4">
                <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0" />
                <div>
                  <h4 className="font-medium">Don't Sniff Too Hard</h4>
                  <p className="text-sm text-muted-foreground">Gentle "bunny sniffs" are better than deep lung-filling inhales. Keep the scent jar 1-2 inches from your nose.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex gap-4">
                <Sparkles className="h-6 w-6 text-purple-500 shrink-0" />
                <div>
                  <h4 className="font-medium">Clean Essential Oils</h4>
                  <p className="text-sm text-muted-foreground">If using essential oils, ensure they are high quality. Do not touch the oil to your skin directly.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
