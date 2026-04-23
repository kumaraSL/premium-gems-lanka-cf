import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, JournalPost } from '../lib/api';
import { MOCK_JOURNAL } from '../lib/mock';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function JournalPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.journal.get(id)
      .then(({ post }) => {
        if (post) {
          setPost(post);
        } else {
          setPost(MOCK_JOURNAL.find(p => p.id === id) || MOCK_JOURNAL[0]);
        }
      })
      .catch(() => {
        setPost(MOCK_JOURNAL.find(p => p.id === id) || MOCK_JOURNAL[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-serif mb-4">Post Not Found</h1>
      <Link to="/journal" className="text-gold hover:underline">Return to Journal</Link>
    </div>
  );

  return (
    <main className="bg-obsidian min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.hero_image_url} alt={post.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        </div>
        <div className="container-luxury relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <button onClick={() => navigate('/journal')} className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium">Back to Journal</span>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <span className="gem-badge">Journal</span>
              <span className="text-sm text-ivory-muted font-sans tracking-wider">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-[clamp(40px,8vw,80px)] font-serif leading-[1.1] mb-8">{post.title}</h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-gold" />
              <p className="text-ivory-muted italic font-serif text-lg">By {post.author}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 border-b border-gold/10">
        <div className="container-luxury max-w-3xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-2xl md:text-3xl font-serif text-ivory leading-relaxed italic text-center"
          >
            "{post.introduction}"
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      {post.sections?.length > 0 && (
        <section className="py-24 space-y-32">
          {post.sections.map((section, index) => (
            <div key={index} className="container-luxury">
              <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-obsidian-800"
                >
                  {section.imageUrl
                    ? <img src={section.imageUrl} alt={section.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                    : <div className="w-full h-full flex items-center justify-center text-gold/20"><span className="font-serif italic">Premium Gems Lanka</span></div>
                  }
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 1 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full lg:w-1/2 space-y-6"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-gold font-sans text-sm tracking-[0.2em] font-medium uppercase">0{index + 1}</span>
                    <div className="h-[1px] flex-grow bg-gold/20" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-ivory">{section.title}</h2>
                  <p className="text-lg text-ivory-muted leading-relaxed whitespace-pre-wrap">{section.content}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Conclusion */}
      {post.conclusion && (
        <section className="py-32 bg-obsidian-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="container-luxury max-w-4xl text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-12">
              <div className="space-y-6">
                <span className="section-label">Conclusion</span>
                <p className="text-xl md:text-2xl text-ivory-muted leading-relaxed font-serif italic">{post.conclusion}</p>
              </div>
              {post.cta_text && (
                <Link to={post.cta_link || '/shop'} className="btn-gold group inline-flex items-center gap-2">
                  {post.cta_text}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </motion.div>
          </div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </section>
      )}

      {/* Nav */}
      <section className="py-16 border-t border-gold/10">
        <div className="container-luxury flex justify-between items-center">
          <Link to="/journal" className="text-ivory-muted hover:text-gold transition-colors flex items-center gap-2 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium uppercase tracking-wider">All Posts</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
