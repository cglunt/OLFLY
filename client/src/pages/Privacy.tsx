import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout showBack backPath="/legal">
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/70">Last updated: December 2024</p>
        </header>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">What Data We Collect</h2>
            <p>
              Olfly collects the following types of data to provide and improve your experience:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Training session data (scents used, intensity ratings, completion status)</li>
              <li>Progress and streak information</li>
              <li>App usage patterns and preferences</li>
              <li>Account data if you sign in with Google</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">How We Store Data</h2>
            <p>
              Your data is stored locally on your device and in our secure cloud database. 
              We use industry-standard security measures to protect your information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Sharing and Third Parties</h2>
            <p>
              We may share anonymized, aggregated data for analytics purposes. If you click 
              affiliate product links, those third-party sites have their own privacy policies.
            </p>
            <p>
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Your Choices</h2>
            <p>
              You have control over your data:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Export your training data at any time</li>
              <li>Delete your local data from your device</li>
              <li>Request account deletion by contacting support</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Contact for Privacy Questions</h2>
            <p>
              For privacy-related questions or requests, contact us at privacy@olfly.com
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
