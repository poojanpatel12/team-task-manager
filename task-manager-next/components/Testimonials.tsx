'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "TaskManager's role-based access was a game-changer for our engineering team. Admins stay in control while members focus on their work.",
    name: 'Senior Engineering Manager',
    company: 'TechCorp',
    initials: 'TC',
  },
  {
    quote: "The overdue task detection and real-time dashboard gave us complete visibility into project health. Deployment was seamless on Vercel.",
    name: 'Head of Product',
    company: 'StartupXYZ',
    initials: 'SX',
  },
  
  {
    quote: "We onboarded 5 teams in a week. The enquiry form made it easy for new clients to reach us, and the admin panel keeps everything organized.",
    name: 'CTO',
    company: 'Enterprise Co',
    initials: 'EC',
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[idx];

  return (
    <section id="testimonials" className="py-24 bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-[var(--foreground)] mb-3">Loved By Enterprise Teams</h2>
          <p className="text-[var(--muted-foreground)]">See how teams are transforming their workflow.</p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow border border-[var(--border)]">
            <ChevronLeft className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-[var(--border)] p-10 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-lg text-[var(--foreground)] font-medium italic leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.initials}
                </div>
                <p className="font-semibold text-[var(--foreground)] text-sm">{t.name}</p>
                <p className="text-xs text-[var(--primary)] font-medium">{t.company}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow border border-[var(--border)]">
            <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-[var(--primary)] w-6' : 'bg-[var(--border)]'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
