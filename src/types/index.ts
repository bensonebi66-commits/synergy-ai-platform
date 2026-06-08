export type UserRole = 'client' | 'freelancer';

export type TaskCategory = 'Web Development' | 'Data Annotation' | 'AI Training' | 'Graphic Design' | 'Writing';

export type TaskStatus = 'open' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  dueDate: string; // YYYY-MM-DD
  category: TaskCategory;
  status: TaskStatus;
  clientId: string;
  clientName: string; // For display on freelancer side
  freelancerId?: string; // Assigned freelancer
  appliedFreelancers?: string[]; // For client to see who applied (simplified for MVP)
}

export interface AppState {
  userRole: UserRole;
  tasks: Task[];
  escrowBalance: number;
}
