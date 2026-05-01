'use client';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TeamPage() {
  const { currentUser, users, projects } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') router.replace('/dashboard');
  }, [currentUser, router]);

  if (currentUser?.role !== 'admin') return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Team</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">{users.length} members</p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Name</th>
              <th className="text-left px-6 py-3 font-semibold">Email</th>
              <th className="text-left px-6 py-3 font-semibold">Role</th>
              <th className="text-left px-6 py-3 font-semibold">Projects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {users.map((u) => {
              const userProjects = projects.filter((p) => p.memberIds.includes(u.id));
              return (
                <tr key={u.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-bold text-[var(--primary)]">
                        {u.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-[var(--foreground)]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">{userProjects.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center py-12 text-[var(--muted-foreground)] text-sm">No users yet</p>
        )}
      </div>
    </div>
  );
}
