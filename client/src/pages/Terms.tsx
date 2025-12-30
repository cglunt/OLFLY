import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Terms of Use</h1>
          <p className="text-white/70">Last updated: December 2024</p>
        </header>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Overview</h2>
            <p>
              Welcome to Olfly. By using our app, you agree to these terms. Olfly is designed to support 
              olfactory training and wellness education. Please read these terms carefully.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Medical Disclaimer</h2>
            <p>
              Olfly provides educational and wellness support only. It does not provide medical advice, 
              diagnosis, or treatment. If you have questions about symptoms or your health, talk with 
              a qualified healthcare professional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">No Guarantee of Results</h2>
            <p>
              Results vary by person. Olfly does not guarantee improvement or restoration of smell or taste. 
              Individual experiences with olfactory training differ based on many factors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Essential Oil Safety</h2>
            <p>
              Use essential oils with care. Do not ingest oils. Avoid direct skin contact unless diluted. 
              Keep oils away from children and pets. Stop use if irritation occurs and consult a healthcare 
              professional if needed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Not for Emergency Use</h2>
            <p>
              Olfly is not for emergency use. If you have severe symptoms or urgent concerns, seek 
              immediate medical care.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Affiliate Disclosure</h2>
            <p>
              Some product links are affiliate links. If you purchase through these links, we may earn 
              a small commission at no additional cost to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">User Responsibilities</h2>
            <p>
              You are responsible for how you use information in the app and for your health decisions. 
              Always consult professionals for medical guidance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Limitation of Liability</h2>
            <p>
              Olfly and its creators are not liable for any damages arising from use of the app. 
              Use Olfly at your own discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of Olfly after changes 
              constitutes acceptance of new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p>
              For questions about these terms, contact us at support@olfly.com
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
