'use client';
import { motion } from 'framer-motion';

const STEPS = [
  { n: '1', title: 'Create Your Project', desc: 'Set up a project with name, description, and status. Invite team members instantly.' },
  { n: '2', title: 'Assign Tasks', desc: 'Create tasks with priority levels, due dates, and assign them to specific team members.' },
  { n: '3', title: 'Track Progress', desc: 'Monitor real-time status updates, overdue alerts, and completion rates on your dashboard.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-[var(--foreground)] mb-4">How We Deliver</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            A seamless, technology-driven workflow designed to fit your team&apos;s busy schedule.
          </p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-[var(--border)]" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-20 h-20 rounded-full border-2 border-[var(--primary)] bg-white flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-2xl font-extrabold text-[var(--primary)]">{s.n}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
