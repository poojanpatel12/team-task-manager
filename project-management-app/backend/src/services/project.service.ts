import Project from '../models/project.model';
import Task from '../models/task.model';
import { Types } from 'mongoose';

export const createProject = async (data: { name: string; description: string; status?: string }, userId: string) => {
  return Project.create({ ...data, createdBy: userId, members: [userId] });
};

export const getProjects = async (userId: string, role: string) => {
  const filter = role === 'admin' ? {} : { members: userId };
  return Project.find(filter).populate('createdBy', 'username email').populate('members', 'username email');
};

export const getProjectById = async (projectId: string, userId: string, role: string) => {
  const project = await Project.findById(projectId)
    .populate('createdBy', 'username email')
    .populate('members', 'username email');
  if (!project) throw new Error('Project not found');
  if (role !== 'admin' && !project.members.some((m: any) => m._id.toString() === userId)) {
    throw new Error('Access denied');
  }
  return project;
};

export const updateProject = async (projectId: string, data: Partial<{ name: string; description: string; status: string }>, userId: string, role: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');
  if (role !== 'admin' && project.createdBy.toString() !== userId) throw new Error('Access denied');
  return Project.findByIdAndUpdate(projectId, data, { new: true });
};

export const deleteProject = async (projectId: string, userId: string, role: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');
  if (role !== 'admin' && project.createdBy.toString() !== userId) throw new Error('Access denied');
  await Task.deleteMany({ projectId });
  await project.deleteOne();
};

export const addMember = async (projectId: string, memberId: string, userId: string, role: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');
  if (role !== 'admin' && project.createdBy.toString() !== userId) throw new Error('Access denied');
  if (!project.members.includes(new Types.ObjectId(memberId))) {
    project.members.push(new Types.ObjectId(memberId));
    await project.save();
  }
  return Project.findById(projectId).populate('members', 'username email');
};

export const removeMember = async (projectId: string, memberId: string, userId: string, role: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');
  if (role !== 'admin' && project.createdBy.toString() !== userId) throw new Error('Access denied');
  project.members = project.members.filter((m) => m.toString() !== memberId) as any;
  await project.save();
  return Project.findById(projectId).populate('members', 'username email');
};
