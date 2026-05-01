'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useStore, Role } from '@/lib/store';

export default function SignupPage() {
  const { signup } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' as Role });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Name જરૂરી છે';
    if (!form.email) errs.email = 'Email જરૂરી છે';
    if (!form.password || form.password.length < 6) errs.password = 'Password ઓછામાં ઓછો 6 characters';
    if (Object.keys(errs).length) return setErrors(errs);

    const ok = signup(form.name, form.email, form.password, form.role);
    if (!ok) return setErrors({ email: 'Email already registered' });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--hero-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-[var(--border)]"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[var(--primary)] rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-[var(--foreground)]">TaskManager</span>
        </div>

        <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-1">Create account</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">Team Task Manager માં join કરો</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="name" label="Full Name" placeholder="John Doe" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input id="email" label="Email" type="email" placeholder="you@example.com" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input id="password" label="Password" type="password" placeholder="••••••••" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">Role <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(['member', 'admin'] as Role[]).map((r) => (
                <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                  className={`py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all cursor-pointer ${
                    form.role === r ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]'
                  }`}>
                  {r === 'admin' ? '🛡 Admin' : '👤 Member'}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">Create Account</Button>
        </form>

        <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
          Already account છે?{' '}
          <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
