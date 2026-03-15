import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/70">Effective Date: March 15, 2026</p>
        </header>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Introduction</h2>
            <p>
              Olfly App ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our mobile
              application and website located at olfly.app (collectively, the "Service").
            </p>
            <p>
              By using the Service, you agree to the collection and use of information in accordance with
              this policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Information We Collect</h2>
            <p>We collect several types of information to provide and improve our olfactory retraining services:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Account Info:</strong> If you sign in via Google or Apple, we collect your email and basic profile info to manage your account.</li>
              <li><strong className="text-white">Usage Data:</strong> We collect information about your training sessions, such as scents used, intensity ratings, and progress streaks.</li>
              <li><strong className="text-white">Technical Data:</strong> We may collect device info and app usage patterns to improve performance and fix bugs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide and personalize your smell training experience.</li>
              <li>Sync your progress across devices (for Plus users).</li>
              <li>Analyze app performance to make Olfly better.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">How We Store Your Data</h2>
            <p>
              <strong className="text-white">Local vs. Cloud Storage:</strong> Most of your training data is stored locally on your device
              for immediate access. If you create an account, this data is synced to our secure cloud servers
              to allow for multi-device access and data recovery.
            </p>
            <p>
              <strong className="text-white">Security:</strong> The security of your data is important to us. We use industry-standard
              encryption and security protocols to protect your Personal Data. However, no method of
              transmission over the Internet or method of electronic storage is 100% secure. While we strive
              to use commercially acceptable means to protect your Personal Data, we cannot guarantee its
              absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Sharing & Third Parties</h2>
            <p>
              We do not sell your personal data. We may share anonymized, aggregated data with analytics
              providers. We use third-party services (like Apple, Google, and cloud hosting providers) to
              operate the app. These providers only have access to the data necessary to perform their
              functions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Children's Privacy</h2>
            <p>
              Our Service is not intended for use by children under the age of 13. We do not knowingly
              collect personally identifiable information from children under 13. If you become aware that
              a child has provided us with Personal Data, please contact us. If we become aware that we have
              collected Personal Data from children without verification of parental consent, we take steps
              to remove that information from our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Your Rights & Choices</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Access & Export:</strong> You can view and export your training data within the app.</li>
              <li><strong className="text-white">Deletion:</strong> You can delete your local data or request account deletion by emailing privacy@olfly.app</li>
              <li><strong className="text-white">Cookies:</strong> You can manage cookie preferences on our website.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Third-Party Links</h2>
            <p>
              Our Service may contain links to other sites (such as affiliate links for essential oils) that
              are not operated by us. If you click on a third-party link, you will be directed to that third
              party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p>
              For any privacy questions, please contact us at privacy@olfly.app
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
