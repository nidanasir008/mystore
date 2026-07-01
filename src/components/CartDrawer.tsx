import { motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CHAT_LINK } from '../lib/api';

export default function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { items, open, setOpen, setQty, remove, total, count } = useCart();

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-[var(--plum)]/30 backdrop-blur-sm z-50 ${open ? '' : 'pointer-events-none'}`}
      />
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--cream)] z-50 shadow-luxe flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--lavender-soft)] bg-gradient-to-r from-[var(--lavender-soft)] to-[var(--pink-soft)]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[var(--lavender-deep)]" />
            <h3 className="font-display text-xl font-semibold text-[var(--plum)]">Your Little Basket</h3>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-white/60">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🧺</div>
              <p className="font-display text-lg text-[var(--plum-soft)]">Your basket is feeling light</p>
              <p className="text-xs text-[var(--plum-soft)]/70 mt-1">Add something lovely ✨</p>
            </div>
          )}
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="flex gap-3 bg-white rounded-2xl p-3 shadow-soft"
            >
              <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-[var(--plum)] truncate">{item.product.name}</div>
                <div className="text-xs text-[var(--pink-deep)] font-semibold">Rs. {item.product.price}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => setQty(item.product.id, item.qty - 1)} className="p-1 rounded-full bg-[var(--lavender-soft)] hover:bg-[var(--lavender)] hover:text-white transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => setQty(item.product.id, item.qty + 1)} className="p-1 rounded-full bg-[var(--lavender-soft)] hover:bg-[var(--lavender)] hover:text-white transition-colors">
                    <Plus size={12} />
                  </button>
                  <button onClick={() => remove(item.product.id)} className="ml-auto p-1 text-[var(--plum-soft)]/50 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--lavender-soft)] p-5 bg-white/60">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-[var(--plum-soft)]">{count} item{count !== 1 ? 's' : ''}</span>
              <span className="font-display text-2xl font-semibold text-[var(--plum)]">Rs. {total}</span>
            </div>
            <p className="text-[10px] text-[var(--plum-soft)]/70 mb-3 text-center">
              ✦ Advance payments only — kindly confirm your order to proceed ✦
            </p>
            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white font-medium shadow-soft hover:shadow-luxe transition-shadow"
            >
              Confirm Order
            </button>
            <a
              href={CHAT_LINK}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-xs text-[var(--plum-soft)] mt-2 hover:text-[var(--lavender-deep)]"
            >
              or chat with us on Instagram 💬
            </a>
          </div>
        )}
      </motion.aside>
    </>
  );
}
