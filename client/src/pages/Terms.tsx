import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          <p className="text-white/70">Last updated: March 15, 2026</p>
        </header>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Welcome to Olfly</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of the Olfly mobile application
              and the website located at olfly.app (collectively, the "Service"). The Service is operated by
              Olfly App ("we," "us," or "our").
            </p>
            <p>
              By downloading, accessing, or using the Service, you agree to be bound by these Terms. If you
              do not agree to these Terms, do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Medical Disclaimer</h2>
            <p>
              Olfly provides educational and wellness support for olfactory retraining. <strong className="text-white">Olfly does not
              provide medical advice, diagnosis, or treatment.</strong> The content is not intended to be a
              substitute for professional medical advice. Always seek the advice of your physician or other
              qualified health provider with any questions you may have regarding a medical condition. Never
              disregard professional medical advice or delay in seeking it because of something you have read
              on Olfly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">No Guarantee of Results</h2>
            <p>
              Results from smell training vary significantly by person. Olfly does not guarantee any specific
              outcome, improvement, or restoration of your sense of smell or taste.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Essential Oil Safety</h2>
            <p>
              If you choose to use essential oils for training, do so with care. Do not ingest oils. Avoid
              direct skin contact unless properly diluted. Keep oils out of reach of children and pets. Stop
              use immediately if irritation occurs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Eligibility</h2>
            <p>
              By using the Service, you represent that you are at least 18 years of age. If you are between
              13 and 18, you may only use the Service under the supervision of a parent or legal guardian
              who agrees to be bound by these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Your Account</h2>
            <p>
              If you create an account, you are responsible for maintaining the confidentiality of your login
              credentials and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Subscriptions & Billing</h2>
            <p>Olfly offers a "Plus" subscription for enhanced features.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Billing:</strong> Payment will be charged to your Apple ID or Google Play account at confirmation of purchase.</li>
              <li><strong className="text-white">Auto-Renewal:</strong> Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.</li>
              <li><strong className="text-white">Management:</strong> You can manage your subscription and turn off auto-renewal in your Account Settings after purchase.</li>
              <li><strong className="text-white">Cancellations:</strong> You may cancel at any time, but no refunds are provided for any unused portion of a subscription period.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality (including but not limited to
              all information, software, text, displays, images, video, and audio) are owned by Olfly App and
              are protected by international copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable, and revocable license to use the
              Service for personal, non-commercial purposes only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Use the Service for any unlawful purpose.</li>
              <li>Attempt to decompile, reverse engineer, or disassemble any part of the Service.</li>
              <li>Use any automated system (bots, spiders) to access the Service.</li>
              <li>Sublicense, sell, or exploit the Service for commercial purposes without our express written consent.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our discretion if we believe you
              are violating these terms or using the app inappropriately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Olfly and its creators shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the app.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Governing Law</h2>
            <p>
              These terms are governed by the laws of the State of California, USA, without regard to its
              conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p>
              Questions? Reach out at support@olfly.app
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
