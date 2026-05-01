'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Priority, TaskStatus } from '@/lib/store';
import { Plus, Trash2, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'completed'];

const priorityColor: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const statusColor: Record<TaskStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser, projects, tasks, users, addTask, updateTaskStatus, deleteTask, addMember, removeMember } = useStore();

  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);
  const projectMembers = users.filter((u) => project?.memberIds.includes(u.id));
  const nonMembers = users.filter((u) => !project?.memberIds.includes(u.id));

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigneeId: '', priority: 'medium' as Priority, dueDate: '' });

  const canManage = currentUser?.role === 'admin' || project?.ownerId === currentUser?.id;
  const isMember = project?.memberIds.includes(currentUser?.id ?? '');

  if (!project) return (
    <div className="text-center py-20">
      <p className="text-[var(--muted-foreground)]">Project not found</p>
      <Button className="mt-4" onClick={() => router.push('/dashboard/projects')}>Back to Projects</Button>
    </div>
  );

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    addTask({ ...taskForm, status: 'pending', projectId: id });
    setTaskForm({ title: '', description: '', assigneeId: '', priority: 'medium', dueDate: '' });
    setShowTaskModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/dashboard/projects')} className="p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-[var(--muted-foreground)]" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">{project.name}</h1>
          {project.description && <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{project.description}</p>}
        </div>
        {(canManage || isMember) && (
          <Button onClick={() => setShowTaskModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks — 3 columns by status */}
        <div className="lg:col-span-2 space-y-4">
          {STATUSES.map((status) => {
            const statusTasks = projectTasks.filter((t) => t.status === status);
            return (
              <div key={status} className="bg-white rounded-2xl border border-[var(--border)] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor[status]}`}>{status}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{statusTasks.length}</span>
                </div>
                {statusTasks.length === 0 ? (
                  <p className="text-xs text-[var(--muted-foreground)] py-2">No tasks</p>
                ) : (
                  <div className="space-y-2">
                    {statusTasks.map((task) => {
                      const assignee = users.find((u) => u.id === task.assigneeId);
                      const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
                      return (
                        <div key={task.id} className={`rounded-xl border p-4 ${isOverdue ? 'border-red-200 bg-red-50' : 'border-[var(--border)]'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[var(--foreground)]">{task.title}</p>
                              {task.description && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{task.description}</p>}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
                                {assignee && <span className="text-xs text-[var(--muted-foreground)]">👤 {assignee.name}</span>}
                                {task.dueDate && <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-[var(--muted-foreground)]'}`}>📅 {task.dueDate}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {/* Status cycle */}
                              {(canManage || isMember) && status !== 'completed' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, status === 'pending' ? 'in-progress' : 'completed')}
                                  className="text-xs px-2 py-1 rounded-lg bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer"
                                >
                                  {status === 'pending' ? '▶ Start' : '✓ Done'}
                                </button>
                              )}
                              {canManage && (
                                <button onClick={() => deleteTask(task.id)} className="p-1 rounded-lg hover:bg-red-50 hover:text-red-600 text-[var(--muted-foreground)] transition-colors cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Members panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
            <h3 className="font-bold text-[var(--foreground)] mb-4">Members ({projectMembers.length})</h3>
            <div className="space-y-2">
              {projectMembers.map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{u.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)] capitalize">{u.role}</p>
                    </div>
                  </div>
                  {canManage && u.id !== project.ownerId && (
                    <button onClick={() => removeMember(id, u.id)} className="p-1 rounded-lg hover:bg-red-50 hover:text-red-600 text-[var(--muted-foreground)] transition-colors cursor-pointer">
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {canManage && nonMembers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Add Member</p>
                <div className="space-y-1">
                  {nonMembers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => addMember(id, u.id)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors text-left cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span className="text-sm text-[var(--foreground)]">{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <Input id="ttitle" label="Title" placeholder="Task title" required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <Input id="tdesc" label="Description" placeholder="Optional description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />

              <div className="grid grid-cols-2 gap-3">
                {/* Priority */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--foreground)]">Priority</label>
                  <select
                    className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] cursor-pointer"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}
                  >
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Assignee */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--foreground)]">Assignee</label>
                  <select
                    className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] cursor-pointer"
                    value={taskForm.assigneeId}
                    onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {projectMembers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <Input id="tdue" label="Due Date" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowTaskModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Add Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
