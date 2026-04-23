import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Product } from '../lib/api';
import { MOCK_PRODUCTS } from '../lib/mock';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingBag, Play } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const { addToCart } = useCart();
  
  useDocumentTitle(product ? product.name : 'Certified Gemstones');

  useEffect(() => {
    if (!id) return;
    api.products.get(id)
      .then(({ product }) => {
        if (product) {
          setProduct(product);
        } else {
          setProduct(MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]);
        }
      })
      .catch(() => {
        setProduct(MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-serif mb-4">Product Not Found</h1>
      <button onClick={() => navigate('/shop')} className="text-gold hover:underline">Return to Shop</button>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [product.image_url].filter(Boolean);
  const mediaList = [...images];
  if (product.video_url) mediaList.push(product.video_url);

  const isVideo = (url: string) => url === product.video_url;

  const renderActiveMedia = () => {
    const url = mediaList[activeMediaIndex];
    if (!url) return null;
    if (isVideo(url)) {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen />;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen />;
      }
      return <video src={url} controls className="w-full h-full object-cover" />;
    }
    return <img src={url} alt={product.name} className="w-full h-full object-cover" />;
  };

  return (
    <main className="pt-[120px] pb-24 min-h-screen">
      <div className="container-luxury">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ivory-muted hover:text-gold transition-colors mb-8">
          <ArrowLeft size={16} /><span>Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Media */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-obsidian-800 relative">
              {renderActiveMedia()}
            </div>
            {mediaList.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {mediaList.map((url, i) => (
                  <button key={i} onClick={() => setActiveMediaIndex(i)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${activeMediaIndex === i ? 'border-gold' : 'border-transparent hover:border-gold/50'}`}
                  >
                    {isVideo(url)
                      ? <div className="w-full h-full bg-obsidian-800 flex items-center justify-center text-gold"><Play size={24} /></div>
                      : <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    }
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <span className="gem-badge mb-4 self-start">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
            <p className="text-2xl font-sans text-gold mb-8">${product.price.toLocaleString()}</p>
            <p className="text-ivory-dim leading-relaxed text-lg mb-10">{product.description}</p>

            <div className="border-t border-gold/20 pt-8 mb-8">
              {[
                { label: 'Availability', value: product.stock > 0 ? 'In Stock' : 'Out of Stock' },
                product.weight ? { label: 'Weight', value: `${product.weight} Cts` } : null,
                product.shape ? { label: 'Shape', value: product.shape } : null,
                product.color ? { label: 'Color', value: product.color } : null,
                product.treatment ? { label: 'Treatment', value: product.treatment } : null,
                (product.height && product.width && product.depth)
                  ? { label: 'Dimensions', value: `${product.height} × ${product.width} × ${product.depth} mm` } : null,
                { label: 'Shipping', value: 'Free Worldwide Express' },
                { label: 'Certification', value: 'Available on request' },
              ].filter(Boolean).map(row => (
                <div key={row!.label} className="flex justify-between py-3 border-b border-gold/10">
                  <span className="text-ivory-muted">{row!.label}</span>
                  <span className="text-ivory">{row!.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                id={`add-to-cart-detail-${product.id}`}
                className="flex-1 bg-gold text-obsidian py-4 rounded-full font-medium text-lg flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => navigate('/custom-order')}
                className="flex-1 btn-outline py-4 rounded-full"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
