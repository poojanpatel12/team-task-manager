'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, FolderKanban } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProjectsPage() {
  const { currentUser, projects, tasks, addProject, deleteProject } = useStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const myProjects = currentUser?.role === 'admin'
    ? projects
    : projects.filter((p) => p.memberIds.includes(currentUser!.id));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addProject(form.name.trim(), form.description.trim());
    setForm({ name: '', description: '' });
    setShowModal(false);
  };

  const canDelete = (p: typeof projects[0]) =>
    currentUser?.role === 'admin' || p.ownerId === currentUser?.id;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Projects</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{myProjects.length} projects</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {myProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-16 text-center">
          <FolderKanban className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="font-semibold text-[var(--foreground)]">No projects yet</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProjects.map((p) => {
            const pTasks = tasks.filter((t) => t.projectId === p.id);
            const done = pTasks.filter((t) => t.status === 'completed').length;
            const pct = pTasks.length ? Math.round((done / pTasks.length) * 100) : 0;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[var(--border)] p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/dashboard/projects/${p.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  {canDelete(p) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="font-bold text-[var(--foreground)] mb-1">{p.name}</h3>
                {p.description && (
                  <p className="text-xs text-[var(--muted-foreground)] mb-4 line-clamp-2">{p.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-2">
                  <span>{pTasks.length} tasks</span>
                  <span>{pct}% done</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input id="pname" label="Project Name" placeholder="My Awesome Project" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--foreground)]">Description</label>
                <textarea
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
                  rows={3}
                  placeholder="What is this project about?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
