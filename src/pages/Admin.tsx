import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Package, ShoppingBag, Star, Trash2, Plus, Upload, CheckCircle, Clock, Sparkles, ChevronDown } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, type Product, type Order, type Review } from '../lib/api';

const ADMIN_PASS = 'ramiya2024';

type Tab = 'orders' | 'products' | 'reviews';

export default function Admin({ onClose }: { onClose: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<Tab>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // new product form
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pCat, setPCat] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pImg, setPImg] = useState('');
  const [pStock, setPStock] = useState('1');
  const [uploading, setUploading] = useState(false);

  const loadAll = async () => {
    try {
      const [o, p, r] = await Promise.all([apiGet('/api/orders'), apiGet('/api/products'), apiGet('/api/reviews')]);
      setOrders(o); setProducts(p); setReviews(r);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    loadAll().finally(() => setLoading(false));
    const t = setInterval(loadAll, 3000); // live refresh
    return () => clearInterval(t);
  }, [authed]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuthed(true); setErr(''); }
    else setErr('Incorrect password, lovely. Try again 💗');
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/upload', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileBase64: base64, contentType: file.type }),
        });
        const { url } = await res.json();
        setPImg(url);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (e: any) {
      setErr(e.message); setUploading(false);
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pPrice.trim() || !pImg) { setErr('Name, price and image are needed.'); return; }
    try {
      await apiPost('/api/products', {
        name: pName, price: Number(pPrice), image_url: pImg,
        description: pDesc, category: pCat || 'Boutique', stock: Number(pStock) || 0,
      });
      setPName(''); setPPrice(''); setPCat(''); setPDesc(''); setPImg(''); setPStock('1');
      setErr('');
      loadAll();
    } catch (e: any) { setErr(e.message); }
  };

  const delProduct = async (id: number) => {
    await apiDelete('/api/products', { id }); loadAll();
  };

  const setOrderStatus = async (id: number, status: string) => {
    await apiPut('/api/orders', { id, status }); loadAll();
  };

  const delOrder = async (id: number) => {
    await apiDelete('/api/orders', { id }); loadAll();
  };

  const delReview = async (id: number) => {
    await apiDelete('/api/reviews', { id }); loadAll();
  };

  const statusColor = (s: string) =>
    s === 'complete' ? 'bg-green-100 text-green-700' : s === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-[var(--pink-soft)] text-[var(--pink-deep)]';

  const tabs: [Tab, string, typeof Package][] = [
    ['orders', 'Orders', Package],
    ['products', 'Products', ShoppingBag],
    ['reviews', 'Reviews', Star],
  ];

  return (
    <div className="fixed inset-0 z-[70] bg-[var(--cream)] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white px-4 sm:px-5 py-4 flex items-center justify-between shadow-luxe">
        <div className="flex items-center gap-2 min-w-0">
          <Lock size={18} className="shrink-0" />
          <span className="font-display text-lg sm:text-xl font-semibold truncate">Admin Studio</span>
          {authed && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full shrink-0 hidden xs:inline">live</span>}
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 shrink-0" aria-label="Close"><X size={20} /></button>
      </div>

      <AnimatePresence mode="wait">
        {!authed ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-[80vh] px-4">
            <form onSubmit={login} className="bg-white rounded-3xl shadow-luxe p-6 sm:p-8 w-full max-w-sm text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center mb-4">
                <Lock size={26} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-[var(--plum)] mb-1">Admin Access</h2>
              <p className="text-xs text-[var(--plum-soft)] mb-5">Enter password to manage your boutique</p>
              <input
                type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                placeholder="Password" autoFocus
                className="w-full px-4 py-3 rounded-full bg-[var(--lavender-soft)] border border-[var(--lavender)] focus:outline-none text-sm text-center"
              />
              {err && <p className="text-xs text-red-400 mt-2">{err}</p>}
              <button type="submit" className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white font-medium">
                Enter
              </button>
              <p className="text-[10px] text-[var(--plum-soft)]/60 mt-3">Demo password: ramiya2024</p>
            </form>
          </motion.div>
        ) : (
          <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
            {/* Tabs — full width on mobile */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-5 sm:mb-6 bg-white rounded-2xl sm:rounded-full p-1.5 shadow-soft sm:w-fit sm:mx-auto">
              {tabs.map(([t, label, Icon]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`inline-flex items-center justify-center gap-1.5 px-2 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all ${
                    tab === t ? 'bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white shadow-soft' : 'text-[var(--plum-soft)] hover:bg-[var(--lavender-soft)]'
                  }`}
                >
                  <Icon size={14} /> <span className="hidden xs:inline sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {loading && <p className="text-center text-xs text-[var(--plum-soft)] mb-3">Refreshing live… ✨</p>}

            {/* ORDERS */}
            {tab === 'orders' && (
              <div className="space-y-3 sm:space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(['new', 'pending', 'complete']).map((s) => (
                    <div key={s} className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center shadow-soft">
                      <div className={`text-xl sm:text-2xl font-display font-semibold ${s === 'new' ? 'text-[var(--pink-deep)]' : s === 'pending' ? 'text-amber-500' : 'text-green-600'}`}>
                        {orders.filter((o) => o.status === s).length}
                      </div>
                      <div className="text-[10px] sm:text-xs text-[var(--plum-soft)] capitalize flex items-center justify-center gap-1">
                        {s === 'new' ? <Sparkles size={10} /> : s === 'pending' ? <Clock size={10} /> : <CheckCircle size={10} />} {s}
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 ? (
                  <p className="text-center text-[var(--plum-soft)] py-12">No orders yet — your boutique is warming up! 🌸</p>
                ) : orders.map((o) => (
                  <motion.div key={o.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-soft"
                  >
                    {/* Top: name + status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[var(--plum)] text-sm sm:text-base truncate">{o.customer_name}</div>
                        <div className="text-xs text-[var(--lavender-deep)] truncate">@{o.instagram_id}</div>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium capitalize shrink-0 ${statusColor(o.status)}`}>{o.status}</span>
                    </div>
                    {/* Address */}
                    <div className="text-xs text-[var(--plum-soft)] mb-2 break-words">📍 {o.address}</div>
                    {/* Items */}
                    <div className="text-xs text-[var(--plum-soft)] bg-[var(--lavender-soft)]/50 rounded-xl p-2 mb-3 break-words">
                      {o.items?.map((it: any) => `${it.name} ×${it.qty}`).join(', ')}
                    </div>
                    {/* Bottom: total + actions */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="font-semibold text-[var(--plum)] text-sm sm:text-base">Rs. {o.total}</span>
                    </div>
                    {/* Status buttons — wrap nicely on mobile */}
                    <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-1.5">
                      <button onClick={() => setOrderStatus(o.id, 'new')} className={`text-[11px] px-2 py-2 rounded-full font-medium transition-colors ${o.status === 'new' ? 'bg-[var(--pink-deep)] text-white' : 'bg-[var(--pink-soft)] text-[var(--pink-deep)]'}`}>New</button>
                      <button onClick={() => setOrderStatus(o.id, 'pending')} className={`text-[11px] px-2 py-2 rounded-full font-medium transition-colors ${o.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'}`}>Pending</button>
                      <button onClick={() => setOrderStatus(o.id, 'complete')} className={`text-[11px] px-2 py-2 rounded-full font-medium transition-colors ${o.status === 'complete' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>Complete</button>
                      <button onClick={() => delOrder(o.id)} className="col-span-3 sm:col-span-1 text-[11px] px-2 py-2 rounded-full font-medium text-red-500 bg-red-50 hover:bg-red-100 inline-flex items-center justify-center gap-1">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* PRODUCTS */}
            {tab === 'products' && (
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Add form */}
                <form onSubmit={addProduct} className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft h-fit order-2 lg:order-1">
                  <h3 className="font-display text-lg font-semibold text-[var(--plum)] mb-3 flex items-center gap-2"><Plus size={16} /> Add Product</h3>
                  <div className="space-y-3">
                    <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Product name"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--lavender-soft)]/40 border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="Price (Rs.)" type="number" inputMode="numeric"
                        className="px-3 py-2.5 rounded-xl bg-[var(--lavender-soft)]/40 border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm" />
                      <input value={pStock} onChange={(e) => setPStock(e.target.value)} placeholder="Stock" type="number" inputMode="numeric"
                        className="px-3 py-2.5 rounded-xl bg-[var(--lavender-soft)]/40 border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm" />
                    </div>
                    <input value={pCat} onChange={(e) => setPCat(e.target.value)} placeholder="Category (e.g. Accessories)"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--lavender-soft)]/40 border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm" />
                    <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Description" rows={2}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--lavender-soft)]/40 border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm resize-none" />
                    <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[var(--lavender)] rounded-2xl py-5 cursor-pointer hover:bg-[var(--lavender-soft)]/30">
                      {pImg ? <img src={pImg} className="h-20 w-20 object-cover rounded-xl" /> : <><Upload size={20} className="text-[var(--lavender-deep)]" /><span className="text-xs text-[var(--plum-soft)]">{uploading ? 'Uploading...' : 'Upload photo'}</span></>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                    </label>
                    {err && <p className="text-xs text-red-400">{err}</p>}
                    <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white font-medium">Add to Boutique</button>
                  </div>
                </form>

                {/* Product list */}
                <div className="space-y-3 order-1 lg:order-2">
                  {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl p-3 shadow-soft flex gap-3 items-center">
                      <img src={p.image_url} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[var(--plum)] truncate">{p.name}</div>
                        <div className="text-xs text-[var(--pink-deep)]">Rs. {p.price} · stock {p.stock}</div>
                        <div className="text-[10px] text-[var(--plum-soft)]">{p.category}</div>
                      </div>
                      <button onClick={() => delProduct(p.id)} className="p-2 rounded-full text-red-400 hover:bg-red-50 shrink-0"><Trash2 size={15} /></button>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-center text-[var(--plum-soft)] py-8 text-sm">No products yet. Add your first! 🌸</p>}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {tab === 'reviews' && (
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-center text-[var(--plum-soft)] py-12">No reviews yet 💌</p>
                ) : reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-soft flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm text-[var(--plum)]">{r.customer_name}</span>
                        <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} size={11} className={s <= r.rating ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-[var(--lavender-soft)]'} />)}</div>
                      </div>
                      <p className="text-sm text-[var(--plum-soft)] break-words">{r.comment}</p>
                    </div>
                    <button onClick={() => delReview(r.id)} className="p-2 rounded-full text-red-400 hover:bg-red-50 shrink-0"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
