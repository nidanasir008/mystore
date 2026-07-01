import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import { apiGet, type Product } from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Reviews from './Reviews';
import { CHAT_LINK, SHOP_LINK } from '../lib/api';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Product | null>(null);

  const load = async () => {
    try {
      const data = await apiGet('/api/products');
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // live refresh every few seconds
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  const shown = filter === 'All' ? products : products.filter((p) => p.category === filter);

  return (
    <div id="top">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lavender-soft)] via-[var(--cream)] to-[var(--pink-soft)]" />
        <div className="absolute top-10 left-[8%] w-24 h-24 rounded-full bg-[var(--pink)]/40 blur-2xl animate-floaty" />
        <div className="absolute bottom-10 right-[10%] w-32 h-32 rounded-full bg-[var(--lavender)]/40 blur-2xl animate-floaty-slow" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur text-xs tracking-[0.2em] uppercase text-[var(--lavender-deep)] mb-6 shadow-soft"
          >
            <Sparkles size={14} /> Curated with love
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-display text-5xl sm:text-7xl font-semibold text-[var(--plum)] leading-[1.05]"
          >
            A little luxury,<br />
            <span className="shimmer-text italic">delicately yours.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-5 text-[var(--plum-soft)] max-w-md mx-auto leading-relaxed"
          >
            Handpicked treasures from ramiya.pk — soft, pretty, and made to make you smile.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a href="#shop" className="px-7 py-3 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white font-medium shadow-soft hover:shadow-luxe transition-shadow">
              Browse the Shop
            </a>
            <a href={SHOP_LINK} target="_blank" rel="noreferrer" className="px-7 py-3 rounded-full bg-white/70 backdrop-blur text-[var(--plum)] font-medium border border-[var(--lavender)] hover:bg-white transition-colors">
              Visit Instagram
            </a>
          </motion.div>
          <p className="mt-6 text-[10px] text-[var(--plum-soft)]/60 tracking-wide">
            ✦ Advance payments only ✦
          </p>
        </div>
      </section>

      {/* SHOP GRID */}
      <section id="shop" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="font-script text-2xl text-[var(--pink-deep)]">our collection</p>
          <h2 className="font-display text-4xl font-semibold text-[var(--plum)]">The Boutique</h2>
          <div className="gold-line h-px w-24 mx-auto mt-3" />
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  filter === c
                    ? 'bg-[var(--lavender-deep)] text-white shadow-soft'
                    : 'bg-white text-[var(--plum-soft)] border border-[var(--lavender-soft)] hover:bg-[var(--lavender-soft)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[0,1,2,3].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-[var(--lavender-soft)] animate-pulse" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <p className="text-center text-[var(--plum-soft)] py-16">No treasures here yet — check back soon! 🌸</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {shown.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={setSelected} />
            ))}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="font-script text-2xl text-[var(--pink-deep)]">our little story</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--plum)] mb-5">Made with heart</h2>
        <p className="text-[var(--plum-soft)] leading-relaxed max-w-2xl mx-auto">
          ramiya.pk began as a tiny dream — a corner of the internet filled with soft, lovely things.
          Every piece is chosen with care, wrapped with love, and sent out to bring a little joy.
          Thank you for being part of our story. 💗
        </p>
      </section>

      {/* REVIEWS */}
      <section id="reviews">
        <Reviews />
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
