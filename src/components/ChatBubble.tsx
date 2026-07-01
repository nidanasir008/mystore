import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { CHAT_LINK } from '../lib/api';

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-5 z-40 w-72 bg-[var(--cream)] rounded-3xl shadow-luxe overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] p-4 text-white flex items-center justify-between">
              <div>
                <div className="font-display text-lg font-semibold">Chat with ramiya.pk</div>
                <div className="text-[10px] text-white/80">We usually reply quickly 💗</div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/20"><X size={16} /></button>
            </div>
            <div className="p-4">
              <p className="text-sm text-[var(--plum-soft)] leading-relaxed">
                Hello lovely! 💕 Have a question, want to confirm an order, or discuss payment? Let's chat on Instagram!
              </p>
              <a
                href={CHAT_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white text-sm font-medium"
              >
                <MessageCircle size={16} /> Open Instagram Chat
              </a>
              <p className="text-[10px] text-center text-[var(--plum-soft)]/70 mt-2">
                ✦ Advance payments only ✦
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1 }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white flex items-center justify-center shadow-luxe"
      >
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-[var(--pink-deep)] animate-ping opacity-30" />
        )}
        <MessageCircle size={24} />
      </motion.button>
    </>
  );
}
