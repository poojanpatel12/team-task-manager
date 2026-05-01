import { Request, Response } from 'express';
import * as projectService from '../services/project.service';

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProject(req.body, req.user!._id.toString());
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getProjects(req.user!._id.toString(), req.user!.role);
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user!._id.toString(), req.user!.role);
    res.json(project);
  } catch (err: any) {
    res.status(err.message === 'Project not found' ? 404 : 403).json({ message: err.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user!._id.toString(), req.user!.role);
    res.json(project);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await projectService.deleteProject(req.params.id, req.user!._id.toString(), req.user!.role);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const project = await projectService.addMember(req.params.id, req.body.userId, req.user!._id.toString(), req.user!.role);
    res.json(project);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const project = await projectService.removeMember(req.params.id, req.params.userId, req.user!._id.toString(), req.user!.role);
    res.json(project);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
