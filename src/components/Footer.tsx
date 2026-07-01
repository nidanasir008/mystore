import { Instagram, MessageCircle, Heart } from 'lucide-react';
import { CHAT_LINK, SHOP_LINK } from '../lib/api';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer id="contact" className="mt-24 bg-gradient-to-b from-[var(--lavender-soft)] to-[var(--pink-soft)] pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Logo size={48} />
              <div>
                <div className="font-display text-2xl font-semibold text-[var(--plum)]">ramiya<span className="text-[var(--pink-deep)]">.pk</span></div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[var(--plum-soft)]">luxury boutique</div>
              </div>
            </div>
            <p className="text-sm text-[var(--plum-soft)] leading-relaxed max-w-xs">
              A little world of curated pretties. Handpicked with love, delivered with care.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-[var(--plum)] mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-[var(--plum-soft)]">
              <li><a href="#shop" className="hover:text-[var(--lavender-deep)]">Shop Collection</a></li>
              <li><a href="#reviews" className="hover:text-[var(--lavender-deep)]">Customer Reviews</a></li>
              <li><a href="#about" className="hover:text-[var(--lavender-deep)]">Our Story</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-[var(--plum)] mb-3">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href={SHOP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--plum-soft)] hover:text-[var(--lavender-deep)]">
                <Instagram size={16} /> @ramiya.pk
              </a>
              <a href={CHAT_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--plum-soft)] hover:text-[var(--lavender-deep)]">
                <MessageCircle size={16} /> Chat with us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--lavender)]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-[var(--plum-soft)]/70 tracking-wide">
            ✦ Advance payments only — all orders confirmed via Instagram chat ✦
          </p>
          <p className="text-xs text-[var(--plum-soft)]/70 inline-flex items-center gap-1">
            Made with <Heart size={12} className="fill-[var(--pink-deep)] text-[var(--pink-deep)]" /> by ramiya.pk
          </p>
        </div>
      </div>
    </footer>
  );
}
