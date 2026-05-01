import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Project, Task, User } from '../types';
import { useAuthStore } from '../store';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};
const priorityColors: Record<string, string> = {
  low: 'text-gray-400',
  medium: 'text-orange-400',
  high: 'text-red-500',
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isOwner = project?.createdBy?.id === user?.id;
  const canManage = isAdmin || isOwner;

  const loadData = async () => {
    const [projRes, taskRes] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/projects/${id}/tasks`),
    ]);
    setProject(projRes.data);
    setTasks(taskRes.data);
    if (isAdmin) {
      const usersRes = await api.get('/users');
      setAllUsers(usersRes.data);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tasks', { ...taskForm, projectId: id });
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
      setShowTaskForm(false);
      const { data } = await api.get(`/projects/${id}/tasks`);
      setTasks(data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    await api.put(`/tasks/${taskId}`, { status });
    setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, status: status as Task['status'] } : t));
  };

  const handleDeleteTask = async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleAddMember = async (userId: string) => {
    const { data } = await api.post(`/projects/${id}/members`, { userId });
    setProject(data);
  };

  const handleRemoveMember = async (userId: string) => {
    const { data } = await api.delete(`/projects/${id}/members/${userId}`);
    setProject(data);
  };

  const memberIds = project?.members.map((m) => m.id) ?? [];
  const nonMembers = allUsers.filter((u) => !memberIds.includes(u.id));

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (!project) return <div className="text-center py-12 text-gray-400">Project not found</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          <p className="text-gray-500 mt-1">{project.description}</p>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Task
        </button>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">Team Members</h2>
        <div className="flex flex-wrap gap-2">
          {project.members.map((m) => (
            <div key={m.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span>{m.username}</span>
              <span className="text-xs text-gray-400">({m.role})</span>
              {canManage && m.id !== user?.id && (
                <button onClick={() => handleRemoveMember(m.id)} className="text-red-400 hover:text-red-600 ml-1 text-xs">×</button>
              )}
            </div>
          ))}
          {canManage && nonMembers.length > 0 && (
            <select
              className="text-sm border border-dashed border-gray-300 rounded-full px-3 py-1 text-gray-500 focus:outline-none"
              onChange={(e) => { if (e.target.value) handleAddMember(e.target.value); e.target.value = ''; }}
              defaultValue=""
            >
              <option value="" disabled>+ Add member</option>
              {nonMembers.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <input
                required placeholder="Task title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
              <textarea
                required placeholder="Description" rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
              <select
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              >
                <option value="">Assign to...</option>
                {project.members.map((m) => <option key={m.id} value={m.id}>{m.username}</option>)}
              </select>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={submitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Task'}
                </button>
                <button type="button" onClick={() => setShowTaskForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-xl">No tasks yet.</div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
            return (
              <div key={task._id} className={`bg-white rounded-xl shadow-sm p-4 flex items-start gap-4 ${isOverdue ? 'border-l-4 border-red-400' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-800">{task.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>{task.status}</span>
                    <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>▲ {task.priority}</span>
                    {isOverdue && <span className="text-xs text-red-500 font-medium">Overdue</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>Assigned: {task.assignedTo?.username ?? '—'}</span>
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {canManage && (
                    <button onClick={() => handleDeleteTask(task._id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
