import Layout from "@/components/Layout";

export default function CookiePolicy() {
  return (
    <Layout showBack backPath="/">
      <div className="p-6 pb-24 space-y-8 max-w-3xl mx-auto">
        <header>
          <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
          <p className="text-white/70">Last updated: January 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">What are cookies?</h2>
          <p className="text-white/70 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit a website. 
            They help websites remember your preferences and improve your experience. Cookies can 
            be "session" cookies (deleted when you close your browser) or "persistent" cookies 
            (remain until they expire or you delete them).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Cookie categories we use</h2>
          
          <div className="bg-[#3b1645] rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white">Essential Cookies</h3>
            <p className="text-white/60 text-sm">
              These cookies are necessary for the website to function properly. They enable core 
              functionality such as security, network management, and accessibility. You cannot 
              opt out of these cookies.
            </p>
            <div className="text-white/40 text-xs mt-2">
              Examples: Session identifiers, user preferences, consent choices
            </div>
          </div>

          <div className="bg-[#3b1645] rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white">Analytics Cookies</h3>
            <p className="text-white/60 text-sm">
              These cookies help us understand how visitors interact with our website. We use 
              this information to improve our services and user experience. These cookies are 
              only set after you provide consent.
            </p>
            <div className="text-white/40 text-xs mt-2">
              Examples: Google Analytics, page view tracking, feature usage statistics
            </div>
          </div>

          <div className="bg-[#3b1645] rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white">Marketing Cookies</h3>
            <p className="text-white/60 text-sm">
              These cookies are used to track visitors across websites to display relevant 
              advertisements. They help measure the effectiveness of advertising campaigns. 
              These cookies are only set after you provide consent.
            </p>
            <div className="text-white/40 text-xs mt-2">
              Examples: Meta Pixel, advertising identifiers, conversion tracking
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">How to manage your preferences</h2>
          <p className="text-white/70 leading-relaxed">
            When you first visit Olfly, you'll see a cookie consent banner. You can choose to 
            accept all cookies or customize your preferences. You can change your preferences 
            at any time by clicking "Cookie Settings" in the website footer.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">How to clear cookies in your browser</h2>
          
          <div className="space-y-3">
            <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
              <h4 className="font-medium text-white mb-2">Chrome</h4>
              <p className="text-white/60 text-sm">
                Settings → Privacy and security → Clear browsing data → Cookies and other site data
              </p>
            </div>
            
            <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
              <h4 className="font-medium text-white mb-2">Firefox</h4>
              <p className="text-white/60 text-sm">
                Settings → Privacy & Security → Cookies and Site Data → Clear Data
              </p>
            </div>
            
            <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
              <h4 className="font-medium text-white mb-2">Safari</h4>
              <p className="text-white/60 text-sm">
                Preferences → Privacy → Manage Website Data → Remove All
              </p>
            </div>
            
            <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
              <h4 className="font-medium text-white mb-2">Edge</h4>
              <p className="text-white/60 text-sm">
                Settings → Privacy, search, and services → Clear browsing data → Cookies and other site data
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Contact us</h2>
          <p className="text-white/70 leading-relaxed">
            If you have any questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@olfly.app" className="text-[#ac41c3] hover:underline">
              privacy@olfly.app
            </a>
          </p>
        </section>
      </div>
    </Layout>
  );
}
