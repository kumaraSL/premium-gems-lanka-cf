import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-serif mb-4">Your Cart</h1>
      <p className="text-ivory-muted mb-8">Please log in to view your cart.</p>
      <button onClick={() => navigate('/login')} className="bg-gold text-obsidian px-8 py-3 rounded-full font-medium hover:bg-gold/90 transition-colors">
        Log In
      </button>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
      <p className="text-ivory-muted mb-8">Discover our collection of fine gemstones.</p>
      <Link to="/shop" className="bg-gold text-obsidian px-8 py-3 rounded-full font-medium hover:bg-gold/90 transition-colors">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <main className="pt-[120px] pb-24 min-h-screen">
      <div className="container-luxury max-w-5xl">
        <h1 className="text-4xl font-serif mb-12">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-6 bg-obsidian-800 p-4 rounded-2xl border border-gold/10">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/product/${item.product_id}`} className="text-lg font-medium hover:text-gold transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-gold font-sans mt-1">${item.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-ivory-muted hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center border border-gold/30 rounded-full w-fit">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-ivory hover:text-gold transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-ivory hover:text-gold transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-obsidian-800 p-8 rounded-2xl border border-gold/10 sticky top-32">
              <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between"><span className="text-ivory-muted">Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-ivory-muted">Shipping</span><span>Complimentary</span></div>
                <div className="flex justify-between"><span className="text-ivory-muted">Taxes</span><span>Calculated at checkout</span></div>
              </div>
              <div className="border-t border-gold/20 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-medium">Total</span>
                  <span className="text-2xl font-sans text-gold">${cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                id="proceed-checkout-btn"
                className="w-full bg-gold text-obsidian py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
