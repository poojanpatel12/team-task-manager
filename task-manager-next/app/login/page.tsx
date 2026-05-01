'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email જરૂરી છે';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email દાખલ કરો';
    if (!form.password) e.password = 'Password જરૂરી છે';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    // TODO: connect auth
    alert('Login successful!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--hero-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-[var(--border)]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[var(--primary)] rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-[var(--foreground)]">TaskManager</span>
        </div>

        <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">Your account માં login કરો</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />

          <div className="flex justify-end">
            <a href="#" className="text-xs text-[var(--primary)] hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
          Account નથી?{' '}
          <Link href="/signup" className="text-[var(--primary)] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
