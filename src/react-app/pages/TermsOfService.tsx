import { motion } from 'motion/react';

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-24 bg-obsidian min-h-screen text-ivory">
      <div className="container-luxury max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label mb-4 block text-center">Legal</span>
          <h1 className="text-[clamp(32px,5vw,48px)] font-serif text-center mb-16 text-white">Terms of Service</h1>
          
          <div className="space-y-10 leading-relaxed text-ivory-muted">
            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you and Premium Gems Lanka concerning your access to and use of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">2. Intellectual Property</h2>
              <p>
                The Site and its original content, features, and functionality are owned by Premium Gems Lanka and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">3. Products and Pricing</h2>
              <p>
                We strive for accuracy in all product displays and pricing. However, we do not guarantee that descriptions or other content are error-free. Prices and availability are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">4. Custom Orders</h2>
              <p>
                Bespoke and custom-ordered items are created to your specific requirements. Once confirmed and production begins, these orders cannot be cancelled, returned, or exchanged.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gold mb-4">5. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of Sri Lanka. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
              </p>
            </section>

            <section className="pt-10 border-t border-gold/10">
              <h2 className="text-2xl font-serif text-gold mb-4">6. Contact</h2>
              <p>For any legal inquiries, please contact us at:</p>
              <p className="mt-4 font-serif italic text-ivory">
                Premium Gems Lanka<br />
                Ratnapura, Sri Lanka<br />
                Email: legal@premiumgemslanka.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
