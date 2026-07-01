import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import type { Product } from '../lib/api';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product, index, onOpen }: { product: Product; index: number; onOpen: (p: Product) => void }) {
  const { add } = useCart();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="flip-card group"
    >
      <div className="flip-inner relative h-80">
        {/* Front */}
        <div className="flip-front absolute inset-0 rounded-3xl overflow-hidden bg-white shadow-soft">
          <div
            className="relative h-56 overflow-hidden cursor-pointer"
            onClick={() => onOpen(product)}
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-[10px] tracking-wide uppercase text-[var(--lavender-deep)]">
              {product.category || 'Boutique'}
            </div>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[var(--plum)]/60 backdrop-blur text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
              tap to view ✨
            </div>
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-[var(--plum)]/40 flex items-center justify-center">
                <span className="text-white font-display text-xl">Sold Out</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-display text-lg font-semibold text-[var(--plum)] leading-tight">{product.name}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[var(--pink-deep)] font-semibold">Rs. {product.price}</span>
              <span className="text-[10px] text-[var(--plum-soft)]/60">hover to peek ✨</span>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="flip-back absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white p-6 flex flex-col justify-center shadow-luxe">
          <h3 className="font-display text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-sm text-white/85 leading-relaxed line-clamp-4 flex-1">
            {product.description || 'A lovely piece from our curated collection.'}
          </p>
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onOpen(product)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-white/20 text-white font-medium hover:bg-white/30 transition-colors text-sm"
            >
              View
            </button>
            <button
              disabled={product.stock <= 0}
              onClick={() => add(product)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-white text-[var(--plum)] font-medium hover:bg-[var(--gold)] hover:text-white transition-colors disabled:opacity-50 text-sm"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
