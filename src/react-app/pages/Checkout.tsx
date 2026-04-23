import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', notes: '' });

  if (!user || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.orders.checkout({
        name: form.name,
        email: form.email,
        phone: form.phone,
        shippingAddress: form.address,
        notes: form.notes,
      });
      await clearCart();
      setSuccess(true);
    } catch (err) {
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
      <h1 className="text-4xl font-serif mb-4">Order Confirmed</h1>
      <p className="text-ivory-muted mb-8 max-w-md">
        Thank you for your purchase. Your order has been received and our team will be in touch shortly.
      </p>
      <button onClick={() => navigate('/profile')} className="bg-gold text-obsidian px-8 py-3 rounded-full font-medium hover:bg-gold/90 transition-colors">
        View My Orders
      </button>
    </div>
  );

  return (
    <main className="pt-[120px] pb-24 min-h-screen">
      <div className="container-luxury max-w-3xl">
        <h1 className="text-4xl font-serif mb-12">Checkout</h1>
        <div className="bg-obsidian-800 p-8 rounded-2xl border border-gold/10">
          <h2 className="text-2xl font-medium mb-6">Shipping Information</h2>
          <form onSubmit={handleCheckout} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-ivory-muted mb-2">Full Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-luxury" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm text-ivory-muted mb-2">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-luxury" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm text-ivory-muted mb-2">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-luxury" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-ivory-muted mb-2">Shipping Address *</label>
              <textarea required rows={4} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                className="input-luxury resize-none" placeholder="Street address, City, Country, Postal Code" />
            </div>
            <div>
              <label className="block text-sm text-ivory-muted mb-2">Order Notes (Optional)</label>
              <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                className="input-luxury resize-none" placeholder="Any special requests..." />
            </div>
            <div className="border-t border-gold/20 pt-6">
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-medium">Total to Pay</span>
                <span className="text-3xl font-sans text-gold">${cartTotal.toLocaleString()}</span>
              </div>
              <button type="submit" disabled={loading} id="place-order-btn"
                className="w-full bg-gold text-obsidian py-4 rounded-full font-medium text-lg hover:bg-gold/90 transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              <p className="text-xs text-ivory-muted text-center mt-4">
                Our team will contact you to arrange payment and shipment details.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
