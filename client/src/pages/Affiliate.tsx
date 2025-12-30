import Layout from "@/components/Layout";
import { Link2 } from "lucide-react";

export default function Affiliate() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Affiliate Disclosure</h1>
          <p className="text-white/70">Transparency about product recommendations</p>
        </header>

        <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4">
          <Link2 className="w-8 h-8 text-[#ac41c3] shrink-0" />
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">We Value Transparency</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Some links in Olfly are affiliate links. We believe in being upfront about this.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">What This Means</h2>
            <p>
              Some product links are affiliate links. If you purchase through these links, 
              we may earn a small commission at no additional cost to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Our Commitment</h2>
            <p>
              We only recommend products we believe can genuinely help with olfactory training. 
              Affiliate relationships do not influence our recommendations. Your trust matters 
              more than any commission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">How It Works</h2>
            <p>
              When you click a product link and make a purchase, the retailer may pay us a small 
              percentage of the sale. This helps support the development of Olfly and keeps the 
              app accessible.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">No Obligation</h2>
            <p>
              You are never obligated to purchase anything through our links. You can always 
              find products independently if you prefer.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
