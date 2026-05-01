'use client';
import { useStore } from '@/lib/store';
import { FolderKanban, CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, projects, tasks, users } = useStore();

  const myProjects = currentUser?.role === 'admin'
    ? projects
    : projects.filter((p) => p.memberIds.includes(currentUser!.id));

  const myProjectIds = myProjects.map((p) => p.id);
  const myTasks = tasks.filter((t) => myProjectIds.includes(t.projectId));

  const stats = [
    { label: 'Projects', value: myProjects.length, icon: FolderKanban, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Tasks', value: myTasks.length, icon: ListTodo, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending', value: myTasks.filter((t) => t.status === 'pending').length, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'In Progress', value: myTasks.filter((t) => t.status === 'in-progress').length, icon: AlertCircle, color: 'bg-orange-50 text-orange-600' },
    { label: 'Completed', value: myTasks.filter((t) => t.status === 'completed').length, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  ];

  const overdue = myTasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
          Welcome back, {currentUser?.name} 👋
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Here's your overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[var(--border)]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-[var(--foreground)]">{s.value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
          <h2 className="font-bold text-[var(--foreground)] mb-4">Recent Projects</h2>
          {myProjects.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No projects yet. Create one!</p>
          ) : (
            <div className="space-y-3">
              {myProjects.slice(0, 5).map((p) => {
                const pTasks = tasks.filter((t) => t.projectId === p.id);
                const done = pTasks.filter((t) => t.status === 'completed').length;
                const pct = pTasks.length ? Math.round((done / pTasks.length) * 100) : 0;
                return (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{p.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{pTasks.length} tasks</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
          <h2 className="font-bold text-[var(--foreground)] mb-4">
            Overdue Tasks{' '}
            {overdue.length > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">{overdue.length}</span>
            )}
          </h2>
          {overdue.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No overdue tasks 🎉</p>
          ) : (
            <div className="space-y-2">
              {overdue.slice(0, 5).map((t) => {
                const assignee = users.find((u) => u.id === t.assigneeId);
                return (
                  <div key={t.id} className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{t.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{assignee?.name ?? 'Unassigned'}</p>
                    </div>
                    <span className="text-xs text-red-600 font-medium">{t.dueDate}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
