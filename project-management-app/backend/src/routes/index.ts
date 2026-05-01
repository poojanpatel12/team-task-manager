import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as projectsController from '../controllers/projects.controller';
import * as tasksController from '../controllers/tasks.controller';
import * as usersController from '../controllers/users.controller';
import * as enquiryController from '../controllers/enquiry.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Auth
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getMe);

// Users (admin only)
router.get('/users', authenticate, requireAdmin, usersController.getUsers);

// Dashboard
router.get('/dashboard', authenticate, tasksController.getDashboardStats);

// Projects
router.post('/projects', authenticate, projectsController.createProject);
router.get('/projects', authenticate, projectsController.getProjects);
router.get('/projects/:id', authenticate, projectsController.getProjectById);
router.put('/projects/:id', authenticate, projectsController.updateProject);
router.delete('/projects/:id', authenticate, projectsController.deleteProject);
router.post('/projects/:id/members', authenticate, projectsController.addMember);
router.delete('/projects/:id/members/:userId', authenticate, projectsController.removeMember);

// Enquiries
router.post('/enquiries', enquiryController.submitEnquiry);                          // public
router.get('/enquiries', authenticate, requireAdmin, enquiryController.getEnquiries); // admin only

// Tasks
router.post('/tasks', authenticate, tasksController.createTask);
router.get('/projects/:projectId/tasks', authenticate, tasksController.getTasksByProject);
router.put('/tasks/:id', authenticate, tasksController.updateTask);
router.delete('/tasks/:id', authenticate, tasksController.deleteTask);

export default router;
