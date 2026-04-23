import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, JournalPost } from '../lib/api';
import { MOCK_JOURNAL } from '../lib/mock';

export default function Journal() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.journal.list()
      .then(({ posts }) => {
        if (posts.length > 0) {
          setPosts(posts);
        } else {
          setPosts(MOCK_JOURNAL);
        }
      })
      .catch(() => setPosts(MOCK_JOURNAL))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-[120px] pb-24 min-h-screen bg-obsidian">
      <div className="container-luxury">
        <header className="text-center mb-20">
          <span className="section-label mb-4 block">Our Insights</span>
          <h1 className="text-[clamp(40px,6vw,64px)] font-semibold mb-6">The Journal</h1>
          <p className="text-[16px] text-ivory-muted max-w-2xl mx-auto">
            Expert knowledge, sourcing stories, and guides to understanding the world of fine Ceylon gemstones.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-ivory-muted">
            <p>No journal posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="group flex flex-col">
                <Link to={`/journal/${post.id}`} className="block aspect-[16/9] overflow-hidden bg-obsidian-800 mb-6 rounded-xl">
                  <img
                    src={post.hero_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                </Link>
                <div className="flex items-center gap-3 mb-4">
                  <span className="gem-badge">Journal</span>
                  <span className="text-xs text-ivory-muted/40 font-sans tracking-wider">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-ivory-muted/40 font-sans tracking-wider">&middot; By {post.author}</span>
                </div>
                <Link to={`/journal/${post.id}`}>
                  <h2 className="text-2xl font-serif mb-3 group-hover:text-gold transition-colors">{post.title}</h2>
                </Link>
                <p className="text-sm text-ivory-muted mb-6 line-clamp-2 italic">{post.introduction}</p>
                <Link to={`/journal/${post.id}`} className="text-gold font-sans text-xs uppercase tracking-widest hover:text-gold-light mt-auto inline-flex items-center">
                  Read more &rarr;
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
