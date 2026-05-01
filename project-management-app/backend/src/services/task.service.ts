import Task from '../models/task.model';
import Project from '../models/project.model';

const checkProjectAccess = async (projectId: string, userId: string, role: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');
  if (role !== 'admin' && !project.members.some((m) => m.toString() === userId)) {
    throw new Error('Access denied');
  }
  return project;
};

export const createTask = async (
  data: { title: string; description: string; assignedTo: string; projectId: string; dueDate?: string; priority?: string },
  userId: string,
  role: string
) => {
  await checkProjectAccess(data.projectId, userId, role);
  return Task.create(data);
};

export const getTasksByProject = async (projectId: string, userId: string, role: string) => {
  await checkProjectAccess(projectId, userId, role);
  return Task.find({ projectId }).populate('assignedTo', 'username email');
};

export const updateTask = async (
  taskId: string,
  data: Partial<{ title: string; description: string; status: string; priority: string; assignedTo: string; dueDate: string }>,
  userId: string,
  role: string
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');
  await checkProjectAccess(task.projectId.toString(), userId, role);
  return Task.findByIdAndUpdate(taskId, data, { new: true }).populate('assignedTo', 'username email');
};

export const deleteTask = async (taskId: string, userId: string, role: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');
  await checkProjectAccess(task.projectId.toString(), userId, role);
  await task.deleteOne();
};

export const getDashboardStats = async (userId: string, role: string) => {
  const projectFilter = role === 'admin' ? {} : { members: userId };
  const projects = await Project.find(projectFilter).select('_id');
  const projectIds = projects.map((p) => p._id);

  const taskFilter = role === 'admin' ? {} : { projectId: { $in: projectIds } };
  const now = new Date();

  const [total, pending, inProgress, completed, overdue] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: 'pending' }),
    Task.countDocuments({ ...taskFilter, status: 'in-progress' }),
    Task.countDocuments({ ...taskFilter, status: 'completed' }),
    Task.countDocuments({ ...taskFilter, status: { $ne: 'completed' }, dueDate: { $lt: now } }),
  ]);

  return { total, pending, inProgress, completed, overdue, projectCount: projectIds.length };
};
