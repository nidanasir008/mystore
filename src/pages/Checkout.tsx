import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, MapPin, MessageCircle, Check, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { apiPost, CHAT_LINK } from '../lib/api';

export default function Checkout({ onClose }: { onClose: () => void }) {
  const { items, total, clear } = useCart();
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [address, setAddress] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!name.trim()) return setErr('Please share your name.');
    if (!instagram.trim()) return setErr('Please share your Instagram handle so we can reach you.');
    if (!address.trim()) return setErr('Please share your delivery address.');
    setSubmitting(true);
    try {
      await apiPost('/api/orders', {
        customer_name: name,
        instagram_id: instagram,
        address,
        items: items.map((i) => ({ id: i.product.id, name: i.product.name, price: i.product.price, qty: i.qty })),
        total,
      });
      setDone(true);
      clear();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-[var(--plum)]/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative bg-[var(--cream)] rounded-3xl shadow-luxe w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--lavender-soft)] z-10">
          <X size={18} />
        </button>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--lavender-deep)] to-[var(--pink-deep)] flex items-center justify-center mb-5"
              >
                <Check size={30} className="text-white" />
              </motion.div>
              <h3 className="font-display text-3xl font-semibold text-[var(--plum)] mb-2">Order Confirmed! 🌸</h3>
              <p className="text-[var(--plum-soft)] text-sm leading-relaxed mb-1">
                Thank you, <span className="font-semibold">{name}</span>! Your little basket is on its way to us.
              </p>
              <p className="text-[var(--plum-soft)] text-sm leading-relaxed mb-5">
                To complete your order, please head to our chat — we discuss <span className="font-semibold text-[var(--pink-deep)]">advance payments</span> there.
              </p>
              <a
                href={CHAT_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white font-medium shadow-soft hover:shadow-luxe transition-shadow"
              >
                <MessageCircle size={18} /> Open Chat to Pay
              </a>
              <p className="text-[10px] text-[var(--plum-soft)]/70 mt-4">
                ✦ Advance payments only — no exceptions ✦
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
              <div className="text-center mb-6">
                <Sparkles size={20} className="text-[var(--lavender-deep)] mx-auto mb-2" />
                <h3 className="font-display text-3xl font-semibold text-[var(--plum)]">Confirm Your Order</h3>
                <p className="text-xs text-[var(--plum-soft)] mt-1">Just a few details and we'll take it from here 💗</p>
              </div>

              <div className="bg-white/70 rounded-2xl p-4 mb-5">
                <div className="text-xs text-[var(--plum-soft)] mb-2">Order summary</div>
                {items.map((i) => (
                  <div key={i.product.id} className="flex justify-between text-sm py-0.5">
                    <span className="text-[var(--plum)]">{i.product.name} × {i.qty}</span>
                    <span className="text-[var(--plum-soft)]">Rs. {i.product.price * i.qty}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-[var(--plum)] pt-2 mt-2 border-t border-[var(--lavender-soft)]">
                  <span>Total</span><span>Rs. {total}</span>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <div>
                  <label className="text-xs text-[var(--plum-soft)] font-medium">Your Name</label>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesha"
                    className="w-full mt-1 px-4 py-2.5 rounded-full bg-white border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--plum-soft)] font-medium flex items-center gap-1">
                    <Instagram size={12} /> Instagram ID
                  </label>
                  <input
                    value={instagram} onChange={(e) => setInstagram(e.target.value)}
                    placeholder="e.g. @yourhandle"
                    className="w-full mt-1 px-4 py-2.5 rounded-full bg-white border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--plum-soft)] font-medium flex items-center gap-1">
                    <MapPin size={12} /> Delivery Address
                  </label>
                  <textarea
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, street, city..."
                    rows={2}
                    className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-white border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm resize-none"
                  />
                </div>
                {err && <p className="text-xs text-red-400">{err}</p>}
                <button
                  type="submit" disabled={submitting}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white font-medium shadow-soft hover:shadow-luxe transition-shadow disabled:opacity-60"
                >
                  {submitting ? 'Confirming...' : 'Confirm Order'}
                </button>
                <p className="text-[10px] text-center text-[var(--plum-soft)]/70">
                  ✦ Advance payments only — details shared in chat after confirming ✦
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
