import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { AppState, Task, UserRole, TaskStatus, TaskCategory } from '../types';
import { CLIENT_ID, CLIENT_NAME, FREELANCER_ID } from '../constants';
import { generateId } from '../utils';

const initialTasks: Task[] = [
  {
    id: generateId(),
    title: 'Build a Responsive Landing Page',
    description: 'Develop a modern, responsive landing page for a new AI product launch. Must be mobile-first.',
    budget: 500,
    dueDate: '2025-09-15',
    category: 'Web Development',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
  {
    id: generateId(),
    title: 'Image Dataset Annotation',
    description: 'Annotate 1000 images for object detection. Requires precise bounding box labeling.',
    budget: 300,
    dueDate: '2025-08-30',
    category: 'Data Annotation',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
  {
    id: generateId(),
    title: 'Fine-tune LLM for Customer Support',
    description: 'Assist in fine-tuning a large language model (LLM) for specific customer support queries.',
    budget: 1200,
    dueDate: '2025-10-01',
    category: 'AI Training',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
  {
    id: generateId(),
    title: 'Create Brand Identity & Logo',
    description: 'Design a complete brand identity package including logo, color palette, and typography for a tech startup.',
    budget: 750,
    dueDate: '2025-09-20',
    category: 'Graphic Design',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
  {
    id: generateId(),
    title: 'Write 5 Blog Posts on AI Ethics',
    description: 'Produce five engaging and well-researched blog posts (800-1000 words each) on the ethics of AI.',
    budget: 400,
    dueDate: '2025-09-10',
    category: 'Writing',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
  {
    id: generateId(),
    title: 'Develop a Simple Chatbot UI',
    description: 'Front-end development for a basic chatbot interface using React. Integration with a backend API is not required for this task.',
    budget: 600,
    dueDate: '2025-09-25',
    category: 'Web Development',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
  {
    id: generateId(),
    title: 'Transcribe Audio Files',
    description: 'Transcribe 10 hours of audio recordings into text. Accuracy is paramount.',
    budget: 250,
    dueDate: '2025-08-28',
    category: 'Data Annotation',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
  {
    id: generateId(),
    title: 'UX/UI Redesign for Mobile App',
    description: 'Redesign the user experience and interface for an existing mobile application to improve engagement.',
    budget: 900,
    dueDate: '2025-10-15',
    category: 'Graphic Design',
    status: 'open',
    clientId: CLIENT_ID,
    clientName: CLIENT_NAME,
    appliedFreelancers: [],
  },
];


const useAppStore = () => {
  const [appState, setAppState] = useLocalStorage<AppState>('synergy-ai-app-state', {
    userRole: 'client',
    tasks: initialTasks,
    escrowBalance: 1500, // Initial escrow balance
  });

  const setUserRole = (role: UserRole) => {
    setAppState(prev => ({ ...prev, userRole: role }));
  };

  const addTask = (newTask: Omit<Task, 'id' | 'status' | 'clientId' | 'clientName' | 'appliedFreelancers'>) => {
    const task: Task = {
      ...newTask,
      id: generateId(),
      status: 'open',
      clientId: CLIENT_ID,
      clientName: CLIENT_NAME,
      appliedFreelancers: [],
    };
    setAppState(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = (updatedTask: Task) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
    }));
  };

  const applyToTask = (taskId: string, freelancerId: string) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId && task.status === 'open') {
          const updatedAppliedFreelancers = task.appliedFreelancers ? [...task.appliedFreelancers, freelancerId] : [freelancerId];
          return { ...task, appliedFreelancers: updatedAppliedFreelancers };
        }
        return task;
      }),
    }));
  };

  const assignTask = (taskId: string, freelancerId: string) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? { ...task, freelancerId, status: 'in-progress' }
          : task
      ),
    }));
  };

  const completeTask = (taskId: string) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'completed' }
          : task
      ),
    }));
  };

  const addFundsToEscrow = (amount: number) => {
    setAppState(prev => ({ ...prev, escrowBalance: prev.escrowBalance + amount }));
  };

  const getClientTasks = () => {
    return appState.tasks.filter(task => task.clientId === CLIENT_ID);
  };

  const getAvailableFreelancerTasks = (currentFreelancerId: string) => {
    return appState.tasks.filter(
      task => task.status === 'open' && !task.appliedFreelancers?.includes(currentFreelancerId)
    );
  };

  const getActiveFreelancerTasks = (currentFreelancerId: string) => {
    return appState.tasks.filter(
      task => task.freelancerId === currentFreelancerId && task.status === 'in-progress'
    );
  };

  const getCompletedFreelancerTasks = (currentFreelancerId: string) => {
    return appState.tasks.filter(
      task => task.freelancerId === currentFreelancerId && task.status === 'completed'
    );
  };

  const getTotalFreelancerEarnings = (currentFreelancerId: string) => {
    return appState.tasks
      .filter(task => task.freelancerId === currentFreelancerId && task.status === 'completed')
      .reduce((sum, task) => sum + task.budget, 0);
  };

  return {
    userRole: appState.userRole,
    tasks: appState.tasks,
    escrowBalance: appState.escrowBalance,
    setUserRole,
    addTask,
    updateTask,
    applyToTask,
    assignTask,
    completeTask,
    addFundsToEscrow,
    getClientTasks,
    getAvailableFreelancerTasks,
    getActiveFreelancerTasks,
    getCompletedFreelancerTasks,
    getTotalFreelancerEarnings,
  };
};

export default useAppStore;
