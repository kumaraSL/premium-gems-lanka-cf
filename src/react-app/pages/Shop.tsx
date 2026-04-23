import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronDown, ChevronUp, Zap, Search, DollarSign, Weight, Diamond, Square, Palette } from 'lucide-react';
import { api, Product } from '../lib/api';
import { MOCK_PRODUCTS } from '../lib/mock';
import { useCart } from '../contexts/CartContext';
import { CATEGORIES, SHAPES, COLORS, TREATMENTS } from '../constants';

// Import shape images
import oval from '../assets/gems/shapes/oval.png';
import round from '../assets/gems/shapes/round.png';
import pear from '../assets/gems/shapes/pear.png';
import cushion from '../assets/gems/shapes/cushion.png';
import heart from '../assets/gems/shapes/heart.png';
import marquise from '../assets/gems/shapes/marquise.png';
import octagonalRectangle from '../assets/gems/shapes/octagonal-rectangle.png';
import octagonalSquare from '../assets/gems/shapes/octagonal-square.png';
import trillion from '../assets/gems/shapes/trillion.png';
import cabochonRound from '../assets/gems/shapes/cabochon-round.png';
import cabochonOval from '../assets/gems/shapes/cabochon-oval.png';
import cabochonPear from '../assets/gems/shapes/cabochon-pear.png';
import cabochonSugarloaf from '../assets/gems/shapes/cabochon-sugarloaf.png';

const SHAPE_IMAGES: Record<string, string> = {
  'Oval': oval,
  'Round': round,
  'Pear': pear,
  'Cushion': cushion,
  'Heart': heart,
  'Marquise': marquise,
  'Emerald': octagonalRectangle,
  'Octagon': octagonalSquare,
  'Triangle': trillion,
  'Princess': octagonalSquare,
  'Radiant': octagonalRectangle,
  'Asscher': octagonalSquare,
  'Baguette': octagonalRectangle,
  'Hexagon': octagonalSquare,
  'Kite': trillion,
  'Cabochon': cabochonRound,
  'Cabochon Round': cabochonRound,
  'Cabochon Oval': cabochonOval,
  'Cabochon Pear': cabochonPear,
  'Cabochon Sugarloaf': cabochonSugarloaf,
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All', shape: 'All', color: 'All', treatment: 'All',
    searchTerm: '', priceRange: [10, 18001], weightRange: [0, 39],
  });
  const [openFilters, setOpenFilters] = useState({ price: true, weight: true, category: true, shape: true, color: true, treatment: true });
  const { addToCart } = useCart();

  useEffect(() => {
    api.products.list({ sort: 'new' })
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

  const filtered = products.filter(p =>
    (filters.category === 'All' || p.category === filters.category) &&
    (filters.shape === 'All' || p.shape === filters.shape) &&
    (filters.color === 'All' || p.color === filters.color) &&
    (filters.treatment === 'All' || p.treatment === filters.treatment) &&
    (!filters.searchTerm || p.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
    (p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
  );

  const toggle = (key: keyof typeof openFilters) =>
    setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <main className="pt-[120px] pb-24 min-h-screen">
      <div className="container-luxury flex gap-8">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 hidden lg:block">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6"><Zap size={20} /> Filters</h2>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted" size={18} />
            <input
              type="text" placeholder="Search gems..."
              value={filters.searchTerm}
              onChange={e => setFilters({ ...filters, searchTerm: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-obsidian-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="space-y-6">
            {/* Price */}
            <div>
              <button onClick={() => toggle('price')} className="flex justify-between w-full font-semibold mb-2 items-center">
                <span className="flex items-center gap-2"><DollarSign size={16} /> Price</span>
                {openFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFilters.price && (
                <div className="text-sm text-ivory-muted">
                  ${filters.priceRange[0]} – ${filters.priceRange[1] >= 18001 ? '18,000+' : filters.priceRange[1].toLocaleString()}
                  <input type="range" min="10" max="18001" value={filters.priceRange[1]}
                    onChange={e => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                    className="w-full accent-gold mt-2" />
                </div>
              )}
            </div>

            {/* Weight */}
            <div>
              <button onClick={() => toggle('weight')} className="flex justify-between w-full font-semibold mb-2 items-center">
                <span className="flex items-center gap-2"><Weight size={16} /> Weight (Cts)</span>
                {openFilters.weight ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFilters.weight && (
                <div className="flex gap-2 text-sm">
                  <input type="number" placeholder="0" value={filters.weightRange[0]}
                    onChange={e => setFilters({ ...filters, weightRange: [parseInt(e.target.value), filters.weightRange[1]] })}
                    className="w-full bg-obsidian-800 p-2 rounded" />
                  <span className="self-center">to</span>
                  <input type="number" placeholder="39" value={filters.weightRange[1]}
                    onChange={e => setFilters({ ...filters, weightRange: [filters.weightRange[0], parseInt(e.target.value)] })}
                    className="w-full bg-obsidian-800 p-2 rounded" />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <button onClick={() => toggle('category')} className="flex justify-between w-full font-semibold mb-2 items-center">
                <span className="flex items-center gap-2"><Diamond size={16} /> Category</span>
                {openFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFilters.category && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {['All', ...CATEGORIES].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm text-ivory-muted hover:text-gold">
                      <input type="radio" name="category" checked={filters.category === cat} onChange={() => setFilters({ ...filters, category: cat })} className="accent-gold" />
                      {cat}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Shape */}
            <div>
              <button onClick={() => toggle('shape')} className="flex justify-between w-full font-semibold mb-2 items-center">
                <span className="flex items-center gap-2"><Square size={16} /> Shape</span>
                {openFilters.shape ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFilters.shape && (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 pt-2">
                  {['All', ...SHAPES].map(shape => {
                    const imgSrc = shape === 'All' ? undefined : SHAPE_IMAGES[shape];
                    
                    return (
                      <button 
                        key={shape} 
                        onClick={() => setFilters({ ...filters, shape })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          filters.shape === shape ? 'border-gold bg-gold/10 text-gold' : 'border-gold/10 text-ivory-muted hover:border-gold/30 hover:bg-white/5'
                        }`}
                      >
                        {shape === 'All' ? (
                          <div className="w-10 h-10 flex items-center justify-center border border-dashed border-gold/30 rounded-lg text-[10px]">ALL</div>
                        ) : (
                          <img 
                            src={imgSrc} 
                            alt={shape} 
                            className={`w-10 h-10 object-contain invert opacity-80 ${filters.shape === shape ? 'opacity-100' : ''}`} 
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{shape}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Color */}
            <div>
              <button onClick={() => toggle('color')} className="flex justify-between w-full font-semibold mb-2 items-center">
                <span className="flex items-center gap-2"><Palette size={16} /> Color</span>
                {openFilters.color ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFilters.color && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {['All', ...COLORS].map(color => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer text-sm text-ivory-muted hover:text-gold">
                      <input type="radio" name="color" checked={filters.color === color} onChange={() => setFilters({ ...filters, color })} className="accent-gold" />
                      {color}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Treatment */}
            <div>
              <button onClick={() => toggle('treatment')} className="flex justify-between w-full font-semibold mb-2 items-center">
                <span className="flex items-center gap-2"><Zap size={16} /> Treatment</span>
                {openFilters.treatment ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFilters.treatment && (
                <div className="space-y-1">
                  {['All', ...TREATMENTS].map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-ivory-muted hover:text-gold">
                      <input type="radio" name="treatment" checked={filters.treatment === t} onChange={() => setFilters({ ...filters, treatment: t })} className="accent-gold" />
                      {t}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <header className="mb-16">
            <span className="section-label mb-4 block">The Collection</span>
            <h1 className="text-[clamp(40px,6vw,64px)] font-semibold">All Gemstones</h1>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-ivory-muted">
              <p>No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(gem => (
                <div key={gem.id} className="group relative">
                  <Link to={`/product/${gem.id}`} className="block aspect-[4/5] overflow-hidden bg-obsidian-800 mb-4 relative">
                    <img src={gem.image_url} alt={gem.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />
                  </Link>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="gem-badge mb-2">{gem.category}</span>
                      <Link to={`/product/${gem.id}`}>
                        <h3 className="text-lg font-medium mb-1 hover:text-gold transition-colors">{gem.name}</h3>
                      </Link>
                      <p className="text-sm text-ivory-muted mb-1 line-clamp-1">
                        {gem.weight ? `${gem.weight} ct · ` : ''}{gem.treatment || 'Natural'} · {gem.color}
                      </p>
                      <span className="text-gold font-sans text-sm">${gem.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => addToCart(gem)}
                      id={`add-to-cart-${gem.id}`}
                      className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-obsidian transition-colors shrink-0 ml-4"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
