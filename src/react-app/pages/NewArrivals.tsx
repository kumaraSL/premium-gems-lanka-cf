import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, Product } from '../lib/api';
import { MOCK_PRODUCTS } from '../lib/mock';
import { useCart } from '../contexts/CartContext';
import { Plus } from 'lucide-react';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.products.list({ sort: 'new', limit: 12 })
      .then(({ products }) => {
        if (products.length > 0) {
          setProducts(products);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      })
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-[120px] pb-24 min-h-screen">
      <div className="container-luxury">
        <header className="mb-16">
          <span className="section-label mb-4 block">Latest from Ceylon</span>
          <h1 className="text-[clamp(40px,6vw,64px)] font-semibold mb-6">New Arrivals</h1>
          <p className="text-[15px] text-ivory-muted max-w-[560px]">
            Discover our latest arrivals of natural Ceylon gemstones, featuring rare unheated sapphires, precision-cut masterworks, and a curated selection of premium stones.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-ivory-muted">
            <p>New arrivals coming soon.</p>
            <Link to="/shop" className="mt-4 text-gold hover:underline block">Browse Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(gem => (
              <div key={gem.id} className="group relative">
                <Link to={`/product/${gem.id}`} className="block aspect-[4/5] overflow-hidden bg-obsidian-800 mb-4 relative">
                  <img src={gem.image_url} alt={gem.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />
                  <span className="absolute top-4 left-4 gem-badge">New</span>
                </Link>
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${gem.id}`}>
                      <h3 className="text-lg font-medium mb-1 hover:text-gold transition-colors">{gem.name}</h3>
                    </Link>
                    <p className="text-sm text-ivory-muted mb-1">{gem.weight ? `${gem.weight} ct · ` : ''}{gem.treatment || 'Natural'}</p>
                    <span className="text-gold font-sans text-sm">${gem.price.toLocaleString()}</span>
                  </div>
                  <button onClick={() => addToCart(gem)} className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-obsidian transition-colors shrink-0">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
