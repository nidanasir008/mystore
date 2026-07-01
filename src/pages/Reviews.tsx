import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Trash2, Send } from 'lucide-react';
import { apiGet, apiPost, apiDelete, type Review } from '../lib/api';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const data = await apiGet('/api/reviews');
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!name.trim() || !comment.trim()) {
      setErr('Please share your name and a few sweet words.');
      return;
    }
    try {
      await apiPost('/api/reviews', { product_id: null, customer_name: name, rating, comment });
      setName('');
      setComment('');
      setRating(5);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <p className="font-script text-2xl text-[var(--pink-deep)]">kind words</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--plum)]">Customer Love</h2>
        <div className="gold-line h-px w-24 mx-auto mt-3" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[0,1,2,3].map((i) => <div key={i} className="h-32 rounded-2xl bg-[var(--lavender-soft)] animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-[var(--plum-soft)] py-8">Be the first to leave a little love 💌</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-soft relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center text-white text-sm font-semibold">
                    {r.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-[var(--plum)] text-sm">{r.customer_name}</span>
                </div>
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={12} className={s <= r.rating ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-[var(--lavender-soft)]'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[var(--plum-soft)] leading-relaxed">“{r.comment}”</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Leave a review */}
      <motion.form
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        onSubmit={submit}
        className="mt-10 bg-gradient-to-br from-[var(--lavender-soft)] to-[var(--pink-soft)] rounded-3xl p-6 shadow-soft"
      >
        <h3 className="font-display text-xl font-semibold text-[var(--plum)] mb-4">Leave a little love</h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="px-4 py-2.5 rounded-full bg-white/80 border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm"
          />
          <div className="flex items-center gap-1 px-4 py-2.5 rounded-full bg-white/80 border border-[var(--lavender-soft)]">
            <span className="text-xs text-[var(--plum-soft)] mr-2">Rating:</span>
            {[1,2,3,4,5].map((s) => (
              <button type="button" key={s} onClick={() => setRating(s)}>
                <Star size={16} className={s <= rating ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-[var(--lavender-soft)]'} />
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your sweet experience..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-2xl bg-white/80 border border-[var(--lavender-soft)] focus:outline-none focus:border-[var(--lavender)] text-sm resize-none"
        />
        {err && <p className="text-xs text-red-400 mt-2">{err}</p>}
        <button type="submit" className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--lavender-deep)] to-[var(--pink-deep)] text-white text-sm font-medium shadow-soft">
          <Send size={14} /> Share Review
        </button>
      </motion.form>
    </div>
  );
}
