'use client';
import * as Accordion from '@radix-ui/react-accordion';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Button from './ui/Button';

const FAQS = [
  { q: 'What is the difference between Admin and Member roles?', a: 'Admins have full access — they can see all projects, manage all tasks, add/remove members, and view all enquiries. Members can only see projects they belong to and manage tasks within those projects.' },
  { q: 'Can I assign tasks to multiple team members?', a: 'Each task is assigned to one primary member. You can create multiple tasks for the same work item and assign them to different members as needed.' },
  { q: 'How does overdue task detection work?', a: 'Any task with a due date in the past that is not marked as "completed" is automatically flagged as overdue on the dashboard and highlighted in red on the project detail page.' },
  { q: 'Is role-based access enforced on the API level?', a: 'Yes. All REST API endpoints validate the JWT token and check the user\'s role server-side. Frontend guards are an additional layer, not the only protection.' },
  { q: 'Can I deploy this on Vercel?', a: 'Yes. The Next.js frontend deploys directly to Vercel. The Express backend can be deployed to Railway, Render, or any Node.js host. MongoDB Atlas works as the cloud database.' },
];

export default function FAQs() {
  return (
    <section id="faqs" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--primary)] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> SUPPORT
          </div>
          <h2 className="text-4xl font-extrabold text-[var(--foreground)] mb-3">Frequently Asked Questions</h2>
          <p className="text-[var(--muted-foreground)]">Everything you need to know about the platform.</p>
        </motion.div>

        <Accordion.Root type="single" collapsible className="mt-10 space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Accordion.Item value={`item-${i}`} className="border border-[var(--border)] rounded-xl overflow-hidden">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors text-left group">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)] shrink-0 ml-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-5 pb-4 text-sm text-[var(--muted-foreground)] leading-relaxed data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 bg-[var(--muted)] rounded-2xl p-6 flex items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-[var(--foreground)]">Still have questions?</p>
            <p className="text-sm text-[var(--muted-foreground)]">We&apos;re here to help you design the perfect workflow.</p>
          </div>
          <Button size="sm">Contact Support</Button>
        </motion.div>
      </div>
    </section>
  );
}
