'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'member';
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
}

interface Store {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: Role) => boolean;
  logout: () => void;

  // Projects
  projects: Project[];
  addProject: (name: string, description: string) => void;
  deleteProject: (id: string) => void;
  addMember: (projectId: string, userId: string) => void;
  removeMember: (projectId: string, userId: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
}

// passwords stored as plain for demo (no real backend)
const _passwords: Record<string, string> = {};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      projects: [],
      tasks: [],

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email);
        if (!user || _passwords[user.id] !== password) return false;
        set({ currentUser: user });
        return true;
      },

      signup: (name, email, password, role) => {
        if (get().users.find((u) => u.email === email)) return false;
        const user: User = { id: Date.now().toString(), name, email, role };
        _passwords[user.id] = password;
        set((s) => ({ users: [...s.users, user], currentUser: user }));
        return true;
      },

      logout: () => set({ currentUser: null }),

      addProject: (name, description) => {
        const user = get().currentUser!;
        const project: Project = {
          id: Date.now().toString(),
          name,
          description,
          ownerId: user.id,
          memberIds: [user.id],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ projects: [...s.projects, project] }));
      },

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          tasks: s.tasks.filter((t) => t.projectId !== id),
        })),

      addMember: (projectId, userId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId && !p.memberIds.includes(userId)
              ? { ...p, memberIds: [...p.memberIds, userId] }
              : p
          ),
        })),

      removeMember: (projectId, userId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, memberIds: p.memberIds.filter((id) => id !== userId) } : p
          ),
        })),

      addTask: (task) =>
        set((s) => ({ tasks: [...s.tasks, { ...task, id: Date.now().toString() }] })),

      updateTaskStatus: (id, status) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    }),
    { name: 'task-manager-store', partialize: (s) => ({ users: s.users, projects: s.projects, tasks: s.tasks, currentUser: s.currentUser }) }
  )
);
