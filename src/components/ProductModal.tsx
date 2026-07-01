import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Star, ZoomIn } from 'lucide-react';
import type { Product } from '../lib/api';
import { useCart } from '../contexts/CartContext';

export default function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useCart();
  const [zoomed, setZoomed] = useState(false);
  const [qty, setQty] = useState(1);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--plum)]/50 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative bg-[var(--cream)] rounded-3xl shadow-luxe w-full max-w-4xl max-h-[92vh] overflow-hidden grid md:grid-cols-2"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur text-[var(--plum)] hover:bg-white shadow-soft"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Image side */}
            <div className="relative bg-[var(--lavender-soft)] h-64 md:h-auto">
              <img
                src={product.image_url}
                alt={product.name}
                onClick={() => setZoomed(true)}
                className="w-full h-full object-cover cursor-zoom-in"
              />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-[10px] text-[var(--plum-soft)]">
                <ZoomIn size={11} /> tap to view full frame
              </div>
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-[var(--plum)]/40 flex items-center justify-center">
                  <span className="text-white font-display text-2xl">Sold Out</span>
                </div>
              )}
            </div>

            {/* Details side */}
            <div className="p-5 sm:p-7 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[92vh]">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--lavender-deep)] mb-1">
                {product.category || 'Boutique'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--plum)] leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={13} className="fill-[var(--gold)] text-[var(--gold)]" />
                ))}
                <span className="text-[11px] text-[var(--plum-soft)] ml-1">loved by buyers</span>
              </div>

              <div className="font-display text-3xl font-semibold text-[var(--pink-deep)] mt-3">
                Rs. {product.price}
              </div>

              <div className="gold-line h-px w-full my-4 opacity-40" />

              <p className="text-sm text-[var(--plum-soft)] leading-relaxed flex-1">
                {product.description || 'A lovely piece from our curated collection, handpicked with love just for you.'}
              </p>

              {product.stock > 0 && (
                <div className="flex items-center gap-3 mt-5">
                  <span className="text-xs text-[var(--plum-soft)]">Quantity</span>
                  <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-soft">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-1.5 rounded-full bg-[var(--lavender-soft)] hover:bg-[var(--lavender)] hover:text-white transition-colors">
                      <Minus size={13} />
                    </button>
                    <span className="text-sm w-6 text-center font-medium text-[var(--plum)]">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="p-1.5 rounded-full bg-[var(--lavender-soft)] hover:bg-[var(--lavender)] hover:text-white transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-[11px] text-[var(--plum-soft)]/70">{product.stock} in stock</span>
                </div>
              )}

              <button
                disabled={product.stock <= 0}
                onClick={() => { for (let i = 0; i < qty; i++) add(product); onClose(); }}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white font-medium shadow-soft hover:shadow-luxe transition-shadow disabled:opacity-50"
              >
                <ShoppingBag size={17} /> Add to Basket — Rs. {product.price * qty}
              </button>
              <p className="text-[10px] text-center text-[var(--plum-soft)]/70 mt-2">
                ✦ Advance payments only ✦
              </p>
            </div>
          </motion.div>

          {/* Full-frame zoom overlay */}
          <AnimatePresence>
            {zoomed && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setZoomed(false)}
                className="absolute inset-0 z-30 bg-[var(--plum)]/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-zoom-out"
              >
                <button
                  onClick={() => setZoomed(false)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 text-[var(--plum)] hover:bg-white z-10"
                >
                  <X size={20} />
                </button>
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  src={product.image_url}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-luxe"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
