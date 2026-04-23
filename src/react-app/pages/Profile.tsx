import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, Order } from '../lib/api';
import { LogOut, Package, User } from 'lucide-react';

export default function Profile() {
  const { user, isLoading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) { navigate('/login'); return; }
    if (!user) return;
    api.orders.list()
      .then(({ orders }) => setOrders(orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, isLoading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return null;

  return (
    <main className="pt-[120px] pb-24 min-h-screen">
      <div className="container-luxury max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif mb-2">My Account</h1>
            <p className="text-ivory-muted flex items-center gap-2"><User size={16} />{user.name || user.email}</p>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <button onClick={() => navigate('/admin')} className="px-6 py-2 border border-gold/30 rounded-full text-gold hover:bg-gold hover:text-obsidian transition-colors text-sm font-medium">
                Admin Dashboard
              </button>
            )}
            <button onClick={handleLogout} id="logout-btn" className="flex items-center gap-2 px-6 py-2 border border-ivory/20 rounded-full hover:bg-ivory/10 transition-colors text-sm font-medium">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="bg-obsidian-800 p-8 rounded-2xl border border-gold/10">
          <h2 className="text-2xl font-medium mb-8 flex items-center gap-3"><Package className="text-gold" /> Order History</h2>

          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-ivory-muted">
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/shop')} className="mt-6 text-gold hover:underline">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border border-gold/20 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-gold/10 pb-4">
                    <div>
                      <p className="text-sm text-ivory-muted mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium uppercase tracking-wider">{order.status}</span>
                      <span className="text-xl font-sans font-medium">${order.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                  {order.items && (
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-obsidian shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-ivory-muted">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-sans">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
