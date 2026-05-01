'use client';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, CheckSquare, ShieldCheck, Bell, BarChart3 } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    color: 'bg-indigo-500',
    title: 'Role-Based Access',
    desc: 'Granular Admin and Member permissions. Admins manage everything; Members see only their projects.',
    tags: ['ADMIN', 'MEMBER', 'RBAC'],
  },
  {
    icon: LayoutDashboard,
    color: 'bg-violet-500',
    title: 'Live Dashboard',
    desc: 'Real-time stats on total, pending, in-progress, completed, and overdue tasks with visual progress bars.',
    tags: ['ANALYTICS', 'REAL-TIME', 'CHARTS'],
  },
  {
    icon: CheckSquare,
    color: 'bg-cyan-500',
    title: 'Task Management',
    desc: 'Create, assign, prioritize, and track tasks with due dates. Overdue tasks are automatically highlighted.',
    tags: ['PRIORITY', 'DUE DATES', 'STATUS'],
  },
  {
    icon: Users,
    color: 'bg-emerald-500',
    title: 'Team Collaboration',
    desc: 'Add and remove team members per project. Assign tasks to specific members with full visibility.',
    tags: ['TEAMS', 'ASSIGNMENT', 'MEMBERS'],
  },
  {
    icon: Bell,
    color: 'bg-orange-500',
    title: 'Overdue Alerts',
    desc: 'Automatic detection and highlighting of overdue tasks so nothing slips through the cracks.',
    tags: ['ALERTS', 'TRACKING', 'DEADLINES'],
  },
  {
    icon: BarChart3,
    color: 'bg-pink-500',
    title: 'Progress Tracking',
    desc: 'Visual progress bars and stat cards give instant insight into project health and team velocity.',
    tags: ['PROGRESS', 'VELOCITY', 'INSIGHTS'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-[var(--foreground)] mb-4">Targeted Domain Expertise</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            Deep feature coverage across every aspect of project and team management.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-[var(--muted)] rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-5`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold text-[var(--muted-foreground)] border border-[var(--border)] px-2 py-0.5 rounded-full tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
