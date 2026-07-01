import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Logo from './Logo';

const LINKS = [
  { href: '#shop', label: 'Shop' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ onAdmin }: { onAdmin: () => void }) {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-[var(--lavender-soft)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="transition-transform group-hover:rotate-12">
            <Logo size={42} />
          </div>
          <div className="leading-none">
            <div className="font-display text-2xl font-semibold tracking-wide text-[var(--plum)]">
              ramiya<span className="text-[var(--pink-deep)]">.pk</span>
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--plum-soft)]">luxury boutique</div>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-7 text-sm font-medium text-[var(--plum-soft)]">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[var(--lavender-deep)] transition-colors">{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAdmin}
            className="hidden sm:inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-[var(--lavender)] text-[var(--plum-soft)] hover:bg-[var(--lavender-soft)] transition-colors"
          >
            <Lock size={11} /> Admin
          </button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setOpen(true)}
            className="relative p-2.5 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] text-white shadow-soft"
            aria-label="Open basket"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-[var(--plum)] text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {count}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="sm:hidden p-2.5 rounded-full border border-[var(--lavender-soft)] text-[var(--plum)] hover:bg-[var(--lavender-soft)] transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden bg-white/95 backdrop-blur border-t border-[var(--lavender-soft)]"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-sm font-medium text-[var(--plum)] hover:text-[var(--lavender-deep)] border-b border-[var(--lavender-soft)]/50 last:border-0"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => { setMenuOpen(false); onAdmin(); }}
                className="mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white text-sm font-medium"
              >
                <Lock size={13} /> Admin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
