'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  Features: ['Dashboard', 'Task Tracking', 'Team Management', 'Role-Based Access'],
  Company: ['About Us', 'Case Studies', 'Careers', 'Blog'],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-white border-t border-[var(--border)]">
      {/* Newsletter CTA */}
      <div className="bg-[var(--primary)] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="text-xl font-bold mb-1">Stay Ahead of the Curve</h3>
            <p className="text-blue-200 text-sm">Subscribe for the latest insights on project management & productivity.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="work@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl text-sm outline-none bg-white/10 text-white placeholder:text-blue-200 border border-white/20 focus:border-white/50"
            />
            <button className="bg-white text-[var(--primary)] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-[var(--foreground)]">TaskManager</span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Empowering teams with intelligent project management and role-based access control.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">{title}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--primary)]" />
              123, Tech District, Bengaluru - 560103
            </li>
            <li className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Phone className="w-4 h-4 shrink-0 text-[var(--primary)]" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Mail className="w-4 h-4 shrink-0 text-[var(--primary)]" />
              hello@taskmanager.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
          <span>© 2025 TaskManager. Built for scale.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
