import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-obsidian min-h-screen">
      <div className="container-luxury max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label mb-4 block text-center">Legal</span>
          <h1 className="text-[clamp(32px,5vw,48px)] font-serif text-center mb-16 text-white">Privacy Policy</h1>
          
          <div className="space-y-10 text-ivory-muted leading-relaxed">
            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">1. Introduction</h2>
              <p>
                At Premium Gems Lanka, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this privacy policy carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
              <ul className="list-disc pl-6 mt-4 space-y-3">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, and access times.</li>
                <li><strong>Financial Data:</strong> Financial information related to your payment method when you purchase our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">3. Use of Your Information</h2>
              <ul className="list-disc pl-6 mt-4 space-y-3">
                <li>Create and manage your account.</li>
                <li>Process your transactions and send related information.</li>
                <li>Fulfill and manage purchases and orders.</li>
                <li>Respond to customer service requests and provide support.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">4. Disclosure of Your Information</h2>
              <p>We may share information we have collected about you in certain situations, such as to comply with legal processes or with third-party service providers who perform services for us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">5. Security</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect.
              </p>
            </section>

            <section className="pt-10 border-t border-gold/10">
              <h2 className="text-2xl font-serif text-gold mb-4">6. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
              <p className="mt-4 font-serif italic text-ivory">
                Premium Gems Lanka<br />
                Ratnapura, Sri Lanka<br />
                Email: info@premiumgemslanka.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
