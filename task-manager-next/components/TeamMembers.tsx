'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Dialog from '@radix-ui/react-dialog';
import { UserPlus, X, Shield, User, Search, Trash2, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { cn } from '@/lib/utils';

interface Member {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  department: string;
  avatar: string;
  joinedAt: string;
}

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations'];
const AVATAR_COLORS = ['bg-indigo-500', 'bg-violet-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-blue-500', 'bg-teal-500'];

const schema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'member']),
  department: z.string().min(1, 'Select a department'),
});
type FormData = z.infer<typeof schema>;

export default function TeamMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'member'>('all');
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'member' },
  });

  const load = () =>
    fetch('/api/members').then((r) => r.json()).then(setMembers).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const m = await res.json();
      setMembers((p) => [...p, m]);
      setSuccess(true);
      reset();
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await fetch('/api/members', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMembers((p) => p.filter((m) => m.id !== id));
    setDeletingId(null);
  };

  const handleClose = () => { setOpen(false); setTimeout(() => setSuccess(false), 300); };

  const filtered = members.filter((m) => {
    const matchRole = filter === 'all' || m.role === filter;
    const q = search.toLowerCase();
    return matchRole && (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.department.toLowerCase().includes(q));
  });

  const adminCount = members.filter((m) => m.role === 'admin').length;
  const memberCount = members.filter((m) => m.role === 'member').length;

  return (
    <section id="team" className="py-24 bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <h2 className="text-4xl font-extrabold text-[var(--foreground)] mb-2">Team Members</h2>
            <p className="text-[var(--muted-foreground)]">Manage your admins and members across all projects.</p>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-indigo-700 font-semibold">
                <Shield className="w-4 h-4" /> {adminCount} Admin{adminCount !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
                <User className="w-4 h-4" /> {memberCount} Member{memberCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Add Member Dialog */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button size="sm" className="flex items-center gap-2 self-start md:self-auto">
                <UserPlus className="w-4 h-4" /> Add Member
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay asChild>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', duration: 0.4 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
                >
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center py-10 text-center">
                        <CheckCircle2 className="w-14 h-14 text-green-500 mb-4" />
                        <h3 className="text-lg font-bold">Member Added!</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">New member has been added to the team.</p>
                        <Button className="mt-5" onClick={handleClose}>Done</Button>
                      </motion.div>
                    ) : (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-start justify-between mb-5">
                          <div>
                            <Dialog.Title className="text-xl font-bold text-[var(--foreground)]">Add Team Member</Dialog.Title>
                            <Dialog.Description className="text-sm text-[var(--muted-foreground)] mt-1">
                              Add a new admin or member to your team.
                            </Dialog.Description>
                          </div>
                          <Dialog.Close asChild>
                            <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-lg hover:bg-[var(--muted)] transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                          </Dialog.Close>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <Input id="name" label="Full Name" required placeholder="e.g. Ritu Mehta"
                            error={errors.name?.message} {...register('name')} />
                          <Input id="email" label="Email" type="email" required placeholder="ritu@company.com"
                            error={errors.email?.message} {...register('email')} />

                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)]">Role <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-3">
                              {(['admin', 'member'] as const).map((r) => (
                                <label key={r} className="flex items-center gap-2 border-2 border-[var(--border)] rounded-xl px-4 py-3 cursor-pointer hover:border-[var(--primary)] transition-all text-sm font-medium">
                                  <input type="radio" value={r} {...register('role')} className="accent-[var(--primary)]" />
                                  {r === 'admin' ? <Shield className="w-4 h-4 text-indigo-600" /> : <User className="w-4 h-4 text-gray-500" />}
                                  <span className="capitalize">{r}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="dept" className="text-sm font-medium text-[var(--foreground)]">Department <span className="text-red-500">*</span></label>
                            <select id="dept"
                              className={cn('w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20', errors.department && 'border-red-400')}
                              {...register('department')}>
                              <option value="">Select department</option>
                              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
                          </div>

                          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                            {isSubmitting ? 'Adding...' : 'Add Member'}
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              placeholder="Search by name, email or department..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'admin', 'member'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize',
                  filter === f ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                )}>
                {f === 'all' ? `All (${members.length})` : f === 'admin' ? `Admins (${adminCount})` : `Members (${memberCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-[var(--border)] h-44 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted-foreground)]">No members found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((m, i) => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${AVATAR_COLORS[i % AVATAR_COLORS.length]} rounded-2xl flex items-center justify-center text-white font-bold text-sm`}>
                      {m.avatar}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
                        m.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600')}>
                        {m.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {m.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 disabled:opacity-50"
                        title="Delete member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] text-sm mb-0.5">{m.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mb-3">{m.email}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-1 rounded-lg font-medium">{m.department}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {new Date(m.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
