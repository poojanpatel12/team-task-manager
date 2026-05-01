'use client';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { enquirySchema, type EnquiryFormData } from '@/lib/schemas';
import Button from './ui/Button';
import Input from './ui/Input';
import { cn } from '@/lib/utils';

const TEAM_SIZES = ['1–10', '11–50', '51–200', '201–500', '500+'];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function EnquiryModal({ open, onOpenChange }: Props) {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data: EnquiryFormData) => {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSuccess(true);
      reset();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setSuccess(false), 300);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-[var(--foreground)]">Enquiry Submitted!</h3>
                  <p className="text-[var(--muted-foreground)] mt-2 text-sm">Our team will reach out to you shortly.</p>
                  <Button className="mt-6" onClick={handleClose}>Close</Button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-[var(--foreground)]">Let&apos;s Talk</Dialog.Title>
                      <Dialog.Description className="text-sm text-[var(--muted-foreground)] mt-1">
                        Fill out the form and our enterprise experts will reach out to you.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1 rounded-lg hover:bg-[var(--muted)]">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                      id="fullName" label="Full Name" required
                      placeholder="John Doe"
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        id="companyName" label="Company Name" required
                        placeholder="Acme Corp"
                        error={errors.companyName?.message}
                        {...register('companyName')}
                      />
                      <Input
                        id="workEmail" label="Work Email" type="email" required
                        placeholder="john@company.com"
                        error={errors.workEmail?.message}
                        {...register('workEmail')}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        id="phoneNumber" label="Phone Number" required
                        placeholder="+1 (555) 000-0000"
                        error={errors.phoneNumber?.message}
                        {...register('phoneNumber')}
                      />
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="teamSize" className="text-sm font-medium text-[var(--foreground)]">
                          Team Size <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="teamSize"
                          className={cn(
                            'w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition-all',
                            'focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20',
                            errors.teamSize && 'border-red-400'
                          )}
                          {...register('teamSize')}
                        >
                          <option value="">Select size</option>
                          {TEAM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.teamSize && <p className="text-xs text-red-500">{errors.teamSize.message}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-sm font-medium text-[var(--foreground)]">Training Interest</label>
                      <textarea
                        id="message" rows={3}
                        placeholder="Tell us about your specific training requirements..."
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition-all resize-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 placeholder:text-[var(--muted-foreground)]"
                        {...register('message')}
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                      {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
