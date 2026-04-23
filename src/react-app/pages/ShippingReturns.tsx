import { motion } from 'motion/react';

export default function ShippingReturns() {
  return (
    <div className="pt-32 pb-24 bg-obsidian min-h-screen text-ivory">
      <div className="container-luxury max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label mb-4 block text-center">Customer Care</span>
          <h1 className="text-[clamp(32px,5vw,48px)] font-serif text-center mb-16 text-white">Shipping & Returns</h1>
          
          <div className="space-y-16 leading-relaxed">
            
            {/* Shipping */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-gold border-b border-gold/20 pb-4">Shipping Policy</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-serif text-white mb-3">Domestic (Sri Lanka)</h3>
                  <p className="text-ivory-muted">Complimentary secure delivery via trusted security partners.</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ivory-muted">
                    <li><strong>Standard:</strong> 2-3 business days</li>
                    <li><strong>Express:</strong> Next business day</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-serif text-white mb-3">International</h3>
                  <p className="text-ivory-muted">Fully insured global shipping via FedEx, DHL, or Malca-Amit.</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ivory-muted">
                    <li><strong>Standard:</strong> 5-7 business days ($50 USD, free on orders over $1,000)</li>
                    <li><strong>Express:</strong> 2-4 business days ($100 USD)</li>
                  </ul>
                  <p className="mt-4 text-xs italic text-gold/60">Note: Customers are responsible for any local customs duties or taxes.</p>
                </section>
              </div>
            </div>

            {/* Returns */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-gold border-b border-gold/20 pb-4">Returns & Exchanges</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-serif text-white mb-3">Return Window</h3>
                  <p className="text-ivory-muted">Eligible items may be returned within <strong>14 days</strong> of receipt in original condition with all certificates and security tags intact.</p>
                </section>

                <section>
                  <h3 className="text-xl font-serif text-white mb-3">Non-Returnable Items</h3>
                  <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-ivory-muted">
                    <li>Custom-designed or bespoke pieces</li>
                    <li>Resized items</li>
                    <li>Items showing signs of wear or missing certificates</li>
                  </ul>
                </section>

                <section className="pt-8 border-t border-gold/10">
                  <h3 className="text-xl font-serif text-white mb-3">Initiate a Return</h3>
                  <p className="text-ivory-muted">Contact our team at <strong>info@premiumgemslanka.com</strong> with your order number. We will provide secure shipping instructions.</p>
                </section>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
