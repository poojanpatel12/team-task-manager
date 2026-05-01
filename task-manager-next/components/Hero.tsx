'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, Users, ShieldCheck } from 'lucide-react';
import Button from './ui/Button';
import EnquiryModal from './EnquiryModal';

const BULLETS = [
  'Role-Based Access Control (Admin / Member)',
  'Real-Time Task Tracking & Status Updates',
  'Project & Team Management Dashboard',
];

export default function Hero() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <section id="home" className="min-h-screen pt-16 flex items-center" style={{ background: 'var(--hero-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--primary)] text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Role-Based Access Control
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-[var(--foreground)] leading-tight mb-6">
              <span className="text-[var(--primary)]">Task</span>
              <br />
                Management {''}
              <br />
              <span className="text-[var(--primary)]">Platform</span>
            </h1>

            <p className="text-lg text-[var(--muted-foreground)] mb-8 leading-relaxed">
              Empower your teams with intelligent task tracking, role-based access, and real-time progress dashboards built for modern enterprises.
            </p>

            <ul className="space-y-3 mb-10">
              {BULLETS.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]"
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0" />
                  {b}
                </motion.li>
              ))}
            </ul>

            <div className="flex items-center gap-4 flex-wrap">
              <Button size="lg" onClick={() => setEnquiryOpen(true)}>
                Enquire Now
              </Button>
              <a href="#how-it-works" className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                See how it works <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right — visual card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[var(--border)]">
              {/* Mock dashboard */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[var(--foreground)]">Project Dashboard</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Total Tasks', value: '48', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Completed', value: '31', color: 'bg-green-50 text-green-700' },
                  { label: 'Overdue', value: '3', color: 'bg-red-50 text-red-700' },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs mt-0.5 opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Design System', status: 'completed', user: 'Alice' },
                  { title: 'API Integration', status: 'in-progress', user: 'Bob' },
                  { title: 'User Testing', status: 'pending', user: 'Carol' },
                ].map((t) => (
                  <div key={t.title} className="flex items-center justify-between bg-[var(--muted)] rounded-xl px-4 py-2.5">
                    <span className="text-sm font-medium text-[var(--foreground)]">{t.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--muted-foreground)]">{t.user}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.status === 'completed' ? 'bg-green-100 text-green-700' :
                        t.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-[var(--border)]"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">Admin Access</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Full Control</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-[var(--border)]"
            >
              <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">10+ Teams</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Collaborating</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <EnquiryModal open={enquiryOpen} onOpenChange={setEnquiryOpen} />
    </>
  );
}
