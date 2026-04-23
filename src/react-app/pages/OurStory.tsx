import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import storyBg from '../assets/our_story_bg.jpg';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function OurStory() {
  return (
    <main className="bg-obsidian text-ivory-dim">
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={storyBg} 
            alt="Our Story Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-obsidian/70" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container-luxury relative z-10 max-w-3xl px-4"
        >
          <span className="section-label mb-6 block text-gold tracking-widest uppercase text-sm">Heritage</span>
          <h1 className="text-[clamp(40px,6vw,80px)] font-bold leading-[1.05] mb-8 text-white">
            A Legacy Carved in Stone.
          </h1>
          <p className="text-lg font-light text-ivory-muted leading-relaxed">
            For three generations, our family has unearthed the hidden treasures of Ceylon, bringing the world's finest sapphires from the mine to the master jeweler's bench.
          </p>
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 bg-obsidian relative">
        <div className="container-luxury max-w-4xl text-center px-4">
          <motion.blockquote 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-3xl md:text-5xl font-serif italic text-gold-light leading-snug mb-8"
          >
            "We don't just sell gemstones. We preserve a piece of Earth's history, ethically sourced and masterfully cut."
          </motion.blockquote>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-ivory-muted uppercase tracking-[0.2em] text-sm font-semibold"
          >
            — The Founders
          </motion.p>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-obsidian-800 border-y border-gold/10">
        <div className="container-luxury max-w-6xl px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <span className="section-label mb-4 block text-gold">The Craft</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">From Rough to Radiance</h2>
            <p className="mt-6 text-ivory-muted max-w-2xl mx-auto">
              Every gemstone we offer goes through a meticulous journey. We oversee every step to ensure unparalleled quality and ethical practices.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {[
              { title: 'Ethical Mining', desc: 'We partner directly with local artisanal miners in Sri Lanka, ensuring fair wages and environmentally conscious extraction methods.' },
              { title: 'Master Lapidary', desc: 'Our in-house master cutters study each rough stone, calculating the perfect angles to maximize brilliance and color.' },
              { title: 'Certification', desc: 'Every gem is independently verified and certified by internationally recognized gemological laboratories.' }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center p-8 border border-gold/10 bg-obsidian rounded-2xl hover:border-gold/30 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 flex items-center justify-center text-gold font-serif text-xl mb-6">
                  {i + 1}
                </div>
                <h3 className="text-xl font-serif text-white mb-4">{step.title}</h3>
                <p className="text-sm text-ivory-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-obsidian-800 border-t border-gold/10 text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container-luxury max-w-2xl px-4"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Be Part of Our Story</h2>
          <p className="text-ivory-muted mb-10 leading-relaxed">
            Discover the perfect gemstone that speaks to you, or work with us to create a custom piece that will become your own family heirloom.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="btn-gold px-8 py-3 rounded-full">Explore Collection</Link>
            <Link to="/custom-order" className="border border-gold/30 text-gold px-8 py-3 rounded-full hover:bg-gold hover:text-obsidian transition-colors">Request Custom Order</Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
