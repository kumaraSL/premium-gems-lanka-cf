import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ArrowRight, Check } from 'lucide-react';
import { api, JournalPost } from '../lib/api';
import { MOCK_JOURNAL } from '../lib/mock';

const faqData = [
  {
    question: "Are your gemstones natural?",
    answer: "Yes, all our gemstones are 100% natural and ethically sourced from Sri Lanka (Ceylon). We do not deal in synthetic or lab-grown stones. Each piece is hand-selected for its unique beauty and quality."
  },
  {
    question: "Do you provide certificates of authenticity?",
    answer: "Yes, certification is available upon request to ensure complete confidence in your purchase. We can obtain reports from reputable gemological laboratories, confirming key details such as natural origin, treatments, and gemstone identity."
  },
  {
    question: "What is your international shipping policy?",
    answer: "We offer secure, fully insured international shipping via premium carriers like FedEx or DHL. All shipments are tracked and require a signature upon delivery."
  },
  {
    question: "How should I care for my gemstone jewelry?",
    answer: "We recommend gentle cleaning with warm soapy water and a soft brush. Avoid harsh chemicals and extreme heat. For specific stones, we provide detailed care instructions upon purchase."
  }
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  const [loadingJournal, setLoadingJournal] = useState(true);

  useEffect(() => {
    api.journal.list(3)
      .then(({ posts }) => {
        if (posts.length > 0) {
          setJournalPosts(posts);
        } else {
          setJournalPosts(MOCK_JOURNAL);
        }
      })
      .catch(() => setJournalPosts(MOCK_JOURNAL))
      .finally(() => setLoadingJournal(false));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen min-h-[680px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/src/react-app/assets/hero_bg_srilankan_v2.png" alt="Gemstone workshop" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-transparent to-obsidian" />
        </div>

        <div className="container-luxury relative z-10">
          <div className="max-w-[680px] animate-fade-up">
            <span className="section-label mb-6 block">Ceylon · Est. Millennium</span>
            <h1 className="text-[clamp(40px,6vw,80px)] font-bold leading-[1.05] mb-8">
              From the Heart<br />
              <span className="text-gold-gradient">of Ceylon,</span><br />
              to Your Hands.
            </h1>
            <p className="text-base font-light text-ivory-dim max-w-[520px] mb-12 leading-relaxed">
              Sri Lanka's finest certified authentic gems — ethically sourced, expertly cut, curated by local experts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-gold">Shop Now &rarr;</Link>
              <Link to="/new-arrivals" className="btn-outline">New Arrivals</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold-dim">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="relative py-16 md:py-24 overflow-hidden border-y border-gold/20">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img src="/our_story_bg.jpg" alt="Custom Order" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-obsidian/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian" />
        </motion.div>

        <div className="container-luxury relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <motion.div
              className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="shrink-0">
                <span className="section-label mb-2 block text-gold">Bespoke Creations</span>
                <h2 className="text-[clamp(28px,4vw,42px)] font-semibold text-white">Custom Order</h2>
              </div>
              <p className="text-[15px] text-ivory-dim max-w-lg md:border-l md:border-gold/30 md:pl-8 py-2 leading-relaxed">
                We offer custom sourcing of loose gemstones and calibrated stones based on your specific requirements, including size, shape, color, and treatment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 w-full lg:w-auto"
            >
              <Link to="/custom-order" className="btn-gold w-full text-center shadow-[0_0_30px_rgba(201,169,110,0.2)] hover:shadow-[0_0_40px_rgba(201,169,110,0.4)] transition-shadow">
                Start Your Custom Order
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-obsidian pt-[120px] pb-[80px]">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div>
              <span className="section-label mb-4 block">Latest from Ceylon</span>
              <h2 className="text-[clamp(28px,4vw,52px)] font-semibold">New Arrivals</h2>
            </div>
            <p className="text-[15px] text-ivory-muted max-w-[560px] pb-2 text-left md:text-right">
              Discover our latest arrivals of natural Ceylon gemstones, featuring rare unheated sapphires, precision-cut masterworks, and a curated selection of premium stones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] mb-16">
            {[
              { name: 'Royal Blue Sapphire', price: '$4,200', img: '/src/react-app/assets/gems/blue-sapphire.jpg' },
              { name: 'Padparadscha', price: '$8,500', img: '/src/react-app/assets/gems/padparadscha.jpg' },
              { name: 'Teal Sapphire', price: '$3,100', img: '/src/react-app/assets/gems/teal-sapphire.jpg' },
              { name: 'Star Ruby', price: '$5,800', img: '/src/react-app/assets/gems/star-ruby.jpg' }
            ].map((gem, i) => (
              <Link key={i} to="/shop" className="group relative aspect-[4/5] overflow-hidden bg-obsidian-800">
                <img src={gem.img} alt={gem.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start">
                  <span className="gem-badge mb-3">New</span>
                  <h3 className="text-lg font-medium mb-1">{gem.name}</h3>
                  <p className="text-[10px] text-ivory-muted mb-2 uppercase tracking-wider">1.50 ct · Unheated</p>
                  <span className="text-gold font-sans text-sm">{gem.price}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link to="/shop" className="btn-outline">View All Gemstones</Link>
          </div>
        </div>
      </section>

      {/* The Collection */}
      <section className="bg-obsidian-800 border-y border-gold/10 py-[120px]">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div>
              <span className="section-label mb-4 block">The Full Range</span>
              <h2 className="text-[clamp(28px,4vw,52px)] font-semibold">The Collection</h2>
            </div>
            <p className="text-sm text-ivory-muted max-w-[440px] pb-2 text-left md:text-right">
              Explore our collection of natural Sri Lankan gemstones, including rare gems, heated and unheated sapphires, and a wide variety of loose and calibrated stones.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
            {[
              { name: 'Blue Sapphire', img: '/src/react-app/assets/gems/blue-sapphire.jpg' },
              { name: 'Teal Sapphire', img: '/src/react-app/assets/gems/teal-sapphire.jpg' },
              { name: 'White Sapphire', img: '/src/react-app/assets/gems/white-sapphire.jpg' },
              { name: 'Pink Sapphire', img: '/src/react-app/assets/gems/pink-sapphire.jpg' },
              { name: 'Padparadscha', img: '/src/react-app/assets/gems/padparadscha.jpg' },
              { name: 'Yellow Sapphire', img: '/src/react-app/assets/gems/yellow-sapphire.jpg' },
              { name: 'Star Sapphire', img: '/src/react-app/assets/gems/star-sapphire.jpg' },
              { name: 'Star Ruby', img: '/src/react-app/assets/gems/star-ruby.jpg' }
            ].map((cat, i) => (
              <Link key={i} to="/shop" className="group relative aspect-square overflow-hidden bg-obsidian">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 to-transparent" />
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <h3 className="absolute bottom-6 left-6 text-[15px] font-medium">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-obsidian py-[120px]">
        <div className="container-luxury">
          <div className="text-center lg:text-left mb-16 max-w-3xl mx-auto lg:mx-0 lg:max-w-none">
            <h2 className="text-[clamp(28px,4vw,52px)] font-semibold mb-6">Why Choose Premium Gems Lanka</h2>
            <p className="text-[15px] text-ivory-muted">Experience the excellence of authentic Sri Lankan gemstones with our commitment to quality and transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { title: 'Authentic Sri Lankan Origin', desc: 'Directly sourced from trusted local miners and suppliers.', img: 'https://picsum.photos/seed/srilanka-mine/800/800' },
              { title: 'Heated & Unheated Options', desc: 'Transparent selection to suit both collectors and commercial buyers.', img: 'https://picsum.photos/seed/gem-heating/800/800' },
              { title: 'Wide Gem Variety', desc: 'From sapphires and rubies to spinel, garnet, tourmaline, and more.', img: 'https://picsum.photos/seed/gemstones/800/800' },
              { title: 'Quality Assurance', desc: 'Each gemstone is inspected for natural authenticity and quality standards.', img: 'https://picsum.photos/seed/gemology/800/800' },
              { title: 'Worldwide Service', desc: 'Serving clients locally and internationally with professionalism and care.', img: 'https://picsum.photos/seed/shipping/800/800' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-6 group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-obsidian-800 border border-gold/10">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                </div>
                <div className="border-l border-gold/50 pl-5">
                  <h3 className="text-gold font-medium mb-2 flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0"
                    >
                      <Check size={12} className="text-gold" />
                    </motion.div>
                    {item.title}
                  </h3>
                  <p className="text-sm text-ivory-dim leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-obsidian-800 py-[120px] border-t border-gold/10">
        <div className="container-luxury max-w-4xl">
          <div className="text-center mb-16">
            <span className="section-label mb-4 block">Expert Guidance</span>
            <h2 className="text-[clamp(28px,4vw,52px)] font-semibold mb-6">Frequently Asked Questions</h2>
            <p className="text-[15px] text-ivory-muted">Everything you need to know about our Ceylon gemstones and bespoke services.</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gold/10 rounded-2xl overflow-hidden bg-obsidian transition-colors duration-300 hover:border-gold/30">
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  id={`faq-btn-${index}`}
                >
                  <span className="flex items-center gap-4">
                    <HelpCircle size={20} className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg font-medium text-ivory-dim group-hover:text-white transition-colors">{faq.question}</span>
                  </span>
                  <ChevronDown size={20} className={`text-gold transition-transform duration-500 ${activeIndex === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-8 pt-2 text-ivory-muted leading-relaxed border-t border-gold/5 ml-12">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="bg-obsidian py-[120px] border-t border-gold/10">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <span className="section-label mb-4 block">Insights & Stories</span>
              <h2 className="text-[clamp(28px,4vw,52px)] font-semibold">The Journal</h2>
            </motion.div>
            <Link to="/journal" className="text-gold hover:underline underline-offset-8 flex items-center gap-2 group pb-2 font-sans text-sm uppercase tracking-widest">
              View All Stories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingJournal ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {journalPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/journal/${post.id}`} className="group flex flex-col gap-6 h-full">
                    <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-obsidian-800 border border-gold/10 relative">
                      <img src={post.hero_image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gold-dim mb-4">
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-gold/30" />
                        <span>{post.author || 'Admin'}</span>
                      </div>
                      <h3 className="text-xl font-serif font-medium group-hover:text-gold transition-colors line-clamp-2 mb-3 leading-snug">{post.title}</h3>
                      <p className="text-sm text-ivory-muted line-clamp-2 leading-relaxed mb-6">{post.introduction}</p>
                      <div className="mt-auto flex items-center gap-2 text-gold font-sans text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Read More <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {journalPosts.length === 0 && (
                <div className="col-span-3 text-center py-12 border border-dashed border-gold/20 rounded-2xl">
                  <p className="text-ivory-muted italic">No stories published yet. Check back soon.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
