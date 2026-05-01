import { Request, Response } from 'express';
import * as taskService from '../services/task.service';

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body, req.user!._id.toString(), req.user!.role);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId, req.user!._id.toString(), req.user!.role);
    res.json(tasks);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user!._id.toString(), req.user!.role);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id, req.user!._id.toString(), req.user!.role);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await taskService.getDashboardStats(req.user!._id.toString(), req.user!.role);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
