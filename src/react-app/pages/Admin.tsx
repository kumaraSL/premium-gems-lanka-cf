import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, Product, Order, JournalPost } from '../lib/api';
import { 
  LayoutDashboard, Package, ShoppingCart, FileText, 
  Plus, Trash2
} from 'lucide-react';
import { CATEGORIES, SHAPES, COLORS, TREATMENTS } from '../constants';

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'journal'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showJournalForm, setShowJournalForm] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: '', 
    imageFiles: [] as File[], videoFile: null as File | null,
    stock: '1', weight: '', shape: '', color: '', treatment: '',
    height: '', width: '', depth: ''
  });

  const [journalForm, setJournalForm] = useState({
    title: '', author: '', heroImage: null as File | null,
    introduction: '',
    sections: [
      { title: '', image: null as File | null, content: '' },
      { title: '', image: null as File | null, content: '' },
    ],
    conclusion: '', ctaText: '', ctaLink: ''
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    } else if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, oRes, jRes] = await Promise.all([
        api.products.list({ limit: 100 }),
        api.orders.list(),
        api.journal.list()
      ]);
      setProducts(pRes.products);
      setOrders(oRes.orders);
      setJournalPosts(jRes.posts);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.imageFiles.length === 0) return alert("Upload at least one image");
    
    setIsUploading(true);
    try {
      // 1. Upload images
      const imageUrls = await Promise.all(
        productForm.imageFiles.map(file => api.media.upload(file).then(r => r.url))
      );
      
      let videoUrl = '';
      if (productForm.videoFile) {
        const vRes = await api.media.upload(productForm.videoFile);
        videoUrl = vRes.url;
      }

      // 2. Create product
      await api.products.create({
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        category: productForm.category,
        image_url: imageUrls[0],
        images: imageUrls,
        video_url: videoUrl,
        stock: Number(productForm.stock),
        weight: Number(productForm.weight),
        shape: productForm.shape,
        color: productForm.color,
        treatment: productForm.treatment,
        height: Number(productForm.height),
        width: Number(productForm.width),
        depth: Number(productForm.depth)
      });

      setShowProductForm(false);
      resetProductForm();
      fetchData();
    } catch (err) {
      alert("Failed to add product");
    } finally {
      setIsUploading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '', description: '', price: '', category: '', 
      imageFiles: [], videoFile: null,
      stock: '1', weight: '', shape: '', color: '', treatment: '',
      height: '', width: '', depth: ''
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.products.delete(id);
      fetchData();
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await api.orders.updateStatus(id, status as any);
      fetchData();
    } catch (err) { alert("Update failed"); }
  };

  const handleAddJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalForm.heroImage) return alert("Hero image required");
    
    setIsUploading(true);
    try {
      const heroUrl = await api.media.upload(journalForm.heroImage).then(r => r.url);
      
      const processedSections = await Promise.all(journalForm.sections.map(async s => {
        let sUrl = '';
        if (s.image) sUrl = await api.media.upload(s.image).then(r => r.url);
        return { title: s.title, content: s.content, imageUrl: sUrl };
      }));

      await api.journal.create({
        title: journalForm.title,
        author: journalForm.author || user?.name || 'Admin',
        hero_image_url: heroUrl,
        introduction: journalForm.introduction,
        sections: processedSections,
        conclusion: journalForm.conclusion,
        cta_text: journalForm.ctaText,
        cta_link: journalForm.ctaLink
      });

      setShowJournalForm(false);
      fetchData();
    } catch (err) { alert("Failed to publish"); }
    finally { setIsUploading(false); }
  };

  if (!user || !isAdmin) return null;

  return (
    <main className="pt-[100px] pb-24 min-h-screen bg-obsidian text-ivory">
      <div className="container-luxury max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-2">
            <h1 className="text-3xl font-serif mb-8 text-gold">Admin Console</h1>
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
              { id: 'products', icon: Package, label: 'Inventory' },
              { id: 'orders', icon: ShoppingCart, label: 'Orders' },
              { id: 'journal', icon: FileText, label: 'Journal' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-gold text-obsidian font-bold shadow-lg shadow-gold/20' : 'text-ivory-muted hover:bg-white/5'
                }`}>
                <tab.icon size={20} /> {tab.label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-obsidian-800 p-8 rounded-2xl border border-gold/10">
                        <p className="text-gold/60 text-sm uppercase tracking-widest mb-2 font-bold">Revenue</p>
                        <p className="text-4xl font-sans font-medium">${orders.reduce((s,o)=>s+o.total_amount,0).toLocaleString()}</p>
                      </div>
                      <div className="bg-obsidian-800 p-8 rounded-2xl border border-gold/10">
                        <p className="text-gold/60 text-sm uppercase tracking-widest mb-2 font-bold">Orders</p>
                        <p className="text-4xl font-sans font-medium">{orders.length}</p>
                      </div>
                      <div className="bg-obsidian-800 p-8 rounded-2xl border border-gold/10">
                        <p className="text-gold/60 text-sm uppercase tracking-widest mb-2 font-bold">Products</p>
                        <p className="text-4xl font-sans font-medium">{products.length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-serif">Inventory Management</h2>
                      <button onClick={() => setShowProductForm(!showProductForm)} className="btn-gold py-2 px-6 text-sm">
                        <Plus size={16} className="mr-2" /> Add Gemstone
                      </button>
                    </div>

                    {showProductForm && (
                      <form onSubmit={handleAddProduct} className="bg-obsidian-800 p-8 rounded-2xl border border-gold/20 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <input placeholder="Name *" required className="input-luxury" value={productForm.name} onChange={e=>setProductForm({...productForm, name:e.target.value})} />
                          <select className="input-luxury" value={productForm.category} onChange={e=>setProductForm({...productForm, category:e.target.value})}>
                            <option value="">Category *</option>
                            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                          <input type="number" placeholder="Price *" required className="input-luxury" value={productForm.price} onChange={e=>setProductForm({...productForm, price:e.target.value})} />
                          <input type="number" placeholder="Stock" className="input-luxury" value={productForm.stock} onChange={e=>setProductForm({...productForm, stock:e.target.value})} />
                          <input type="number" step="0.01" placeholder="Weight (cts)" className="input-luxury" value={productForm.weight} onChange={e=>setProductForm({...productForm, weight:e.target.value})} />
                          <select className="input-luxury" value={productForm.shape} onChange={e=>setProductForm({...productForm, shape:e.target.value})}>
                            <option value="">Shape</option>
                            {SHAPES.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                          <select className="input-luxury" value={productForm.color} onChange={e=>setProductForm({...productForm, color:e.target.value})}>
                            <option value="">Color</option>
                            {COLORS.map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                          <select className="input-luxury" value={productForm.treatment} onChange={e=>setProductForm({...productForm, treatment:e.target.value})}>
                            <option value="">Treatment</option>
                            {TREATMENTS.map(t=><option key={t} value={t}>{t}</option>)}
                          </select>
                          <div className="flex gap-2">
                            <input placeholder="H" className="input-luxury" value={productForm.height} onChange={e=>setProductForm({...productForm, height:e.target.value})} />
                            <input placeholder="W" className="input-luxury" value={productForm.width} onChange={e=>setProductForm({...productForm, width:e.target.value})} />
                            <input placeholder="D" className="input-luxury" value={productForm.depth} onChange={e=>setProductForm({...productForm, depth:e.target.value})} />
                          </div>
                        </div>
                        <textarea placeholder="Description" rows={3} className="input-luxury w-full" value={productForm.description} onChange={e=>setProductForm({...productForm, description:e.target.value})} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="text-xs text-gold uppercase mb-2 block font-bold">Images (Max 4)</label>
                            <input type="file" multiple accept="image/*" onChange={e => setProductForm({...productForm, imageFiles: Array.from(e.target.files || [])})} className="text-sm" />
                          </div>
                          <div>
                            <label className="text-xs text-gold uppercase mb-2 block font-bold">Video (Optional)</label>
                            <input type="file" accept="video/*" onChange={e => setProductForm({...productForm, videoFile: e.target.files?.[0] || null})} className="text-sm" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-4 border-t border-gold/10 pt-6">
                          <button type="button" onClick={() => setShowProductForm(false)} className="text-ivory-muted hover:text-ivory font-medium">Cancel</button>
                          <button type="submit" disabled={isUploading} className="bg-gold text-obsidian px-8 py-3 rounded-full font-bold hover:bg-gold/90 disabled:opacity-50 min-w-[140px]">
                            {isUploading ? 'Uploading...' : 'Save Gemstone'}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="bg-obsidian-800 rounded-2xl border border-gold/10 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase tracking-widest text-gold/60">
                          <tr>
                            <th className="p-5 font-bold">Product</th>
                            <th className="p-5 font-bold">Price</th>
                            <th className="p-5 font-bold">Stock</th>
                            <th className="p-5 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {products.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-5 flex items-center gap-4">
                                <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                  <p className="font-medium text-ivory">{p.name}</p>
                                  <p className="text-xs text-ivory-muted">{p.category}</p>
                                </div>
                              </td>
                              <td className="p-5 font-sans">${p.price.toLocaleString()}</td>
                              <td className="p-5">{p.stock}</td>
                              <td className="p-5 text-right">
                                <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400/60 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif">Customer Orders</h2>
                    <div className="bg-obsidian-800 rounded-2xl border border-gold/10 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase tracking-widest text-gold/60">
                          <tr>
                            <th className="p-5 font-bold">ID</th>
                            <th className="p-5 font-bold">Date</th>
                            <th className="p-5 font-bold">Total</th>
                            <th className="p-5 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.map(o => (
                            <tr key={o.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-5 font-mono text-sm text-gold/80">{o.id.slice(-8).toUpperCase()}</td>
                              <td className="p-5 text-ivory-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="p-5 font-sans font-bold">${o.total_amount.toLocaleString()}</td>
                              <td className="p-5">
                                <select value={o.status} onChange={e=>handleUpdateOrderStatus(o.id, e.target.value)} 
                                  className="bg-obsidian border border-gold/20 rounded px-3 py-1.5 text-xs outline-none focus:border-gold">
                                  {['pending','processing','shipped','delivered','cancelled'].map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'journal' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-serif">Journal Posts</h2>
                      <button onClick={() => setShowJournalForm(!showJournalForm)} className="btn-gold py-2 px-6 text-sm">
                        <Plus size={16} className="mr-2" /> New Entry
                      </button>
                    </div>

                    {showJournalForm && (
                      <form onSubmit={handleAddJournal} className="bg-obsidian-800 p-8 rounded-2xl border border-gold/20 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input placeholder="Title *" required className="input-luxury md:col-span-2" value={journalForm.title} onChange={e=>setJournalForm({...journalForm, title:e.target.value})} />
                          <input placeholder="Author" className="input-luxury" value={journalForm.author} onChange={e=>setJournalForm({...journalForm, author:e.target.value})} />
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-gold uppercase font-bold">Hero Image *</label>
                            <input type="file" accept="image/*" required onChange={e=>setJournalForm({...journalForm, heroImage:e.target.files?.[0] || null})} />
                          </div>
                          <textarea placeholder="Introduction" rows={3} className="input-luxury md:col-span-2 w-full" value={journalForm.introduction} onChange={e=>setJournalForm({...journalForm, introduction:e.target.value})} />
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-gold text-sm font-bold uppercase tracking-widest">Story Sections</h4>
                          {journalForm.sections.map((s, i) => (
                            <div key={i} className="p-6 bg-black/40 rounded-xl border border-gold/10 space-y-4">
                              <input placeholder={`Section ${i+1} Title`} className="input-luxury w-full" value={s.title} onChange={e=>{
                                const ss = [...journalForm.sections]; ss[i].title = e.target.value; setJournalForm({...journalForm, sections:ss});
                              }} />
                              <input type="file" accept="image/*" onChange={e=>{
                                const ss = [...journalForm.sections]; ss[i].image = e.target.files?.[0] || null; setJournalForm({...journalForm, sections:ss});
                              }} />
                              <textarea placeholder="Section Content" rows={4} className="input-luxury w-full" value={s.content} onChange={e=>{
                                const ss = [...journalForm.sections]; ss[i].content = e.target.value; setJournalForm({...journalForm, sections:ss});
                              }} />
                            </div>
                          ))}
                        </div>

                        <textarea placeholder="Conclusion" rows={3} className="input-luxury w-full" value={journalForm.conclusion} onChange={e=>setJournalForm({...journalForm, conclusion:e.target.value})} />
                        
                        <div className="flex justify-end gap-4 border-t border-gold/10 pt-6">
                          <button type="button" onClick={() => setShowJournalForm(false)} className="text-ivory-muted hover:text-ivory font-medium">Cancel</button>
                          <button type="submit" disabled={isUploading} className="bg-gold text-obsidian px-8 py-3 rounded-full font-bold hover:bg-gold/90 disabled:opacity-50">
                            {isUploading ? 'Publishing...' : 'Publish Entry'}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="bg-obsidian-800 rounded-2xl border border-gold/10 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase tracking-widest text-gold/60">
                          <tr>
                            <th className="p-5 font-bold">Title</th>
                            <th className="p-5 font-bold">Author</th>
                            <th className="p-5 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {journalPosts.map(post => (
                            <tr key={post.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-5 font-medium">{post.title}</td>
                              <td className="p-5 text-ivory-muted">{post.author}</td>
                              <td className="p-5 text-right">
                                <button onClick={() => api.journal.delete(post.id).then(fetchData)} className="text-red-400/60 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
