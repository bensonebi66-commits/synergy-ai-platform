import React from 'react';
import { Task, TaskStatus, TaskCategory } from '../types';
import { formatCurrency, formatDate } from '../utils';
import Button from './Button';
import { Tag, Calendar, DollarSign, Briefcase, User, CheckCircle, Hourglass, XCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  role: 'client' | 'freelancer';
  onApply?: (taskId: string) => void;
  onMarkComplete?: (taskId: string) => void;
  onAssign?: (taskId: string, freelancerId: string) => void; // For client to assign
  isLoading?: boolean; // For AI verification loading state
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'open':
      return 'bg-blue-500';
    case 'in-progress':
      return 'bg-yellow-500';
    case 'completed':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  role,
  onApply,
  onMarkComplete,
  onAssign,
  isLoading = false,
}) => {
  const renderStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'open':
        return <Hourglass size={16} className="text-blue-200" />;
      case 'in-progress':
        return <Briefcase size={16} className="text-yellow-200" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-200" />;
      default:
        return <XCircle size={16} className="text-gray-200" />;
    }
  };

  return (
    <div className="bg-surface p-6 rounded-xl shadow-custom border border-border flex flex-col justify-between transform hover:scale-[1.01] transition-transform duration-200 ease-in-out">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-text">{task.title}</h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(task.status)} flex items-center gap-1`}>
            {renderStatusIcon(task.status)}
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>

        <p className="text-textSecondary text-sm mb-4 line-clamp-3">{task.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-textSecondary text-sm mb-5">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-accent" />
            <span>Budget: <strong className="text-text">{formatCurrency(task.budget)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-accent" />
            <span>Due: <strong className="text-text">{formatDate(task.dueDate)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-accent" />
            <span>Category: <strong className="text-text">{task.category}</strong></span>
          </div>
          {role === 'freelancer' && (
            <div className="flex items-center gap-2">
              <User size={16} className="text-accent" />
              <span>Client: <strong className="text-text">{task.clientName}</strong></span>
            </div>
          )}
          {role === 'client' && (
            <div className="flex items-center gap-2">
              <User size={16} className="text-accent" />
              <span>Applicants: <strong className="text-text">{task.appliedFreelancers?.length || 0}</strong></span>
            </div>
          )}
        </div>
      </div>

      {role === 'freelancer' && task.status === 'open' && onApply && (
        <Button onClick={() => onApply(task.id)} className="w-full mt-4">
          Apply Now
        </Button>
      )}

      {role === 'freelancer' && task.status === 'in-progress' && onMarkComplete && (
        <Button onClick={() => onMarkComplete(task.id)} className="w-full mt-4" isLoading={isLoading}>
          Mark Complete
        </Button>
      )}

      {role === 'client' && task.status === 'open' && task.appliedFreelancers && task.appliedFreelancers.length > 0 && onAssign && (
        <Button onClick={() => onAssign(task.id, task.appliedFreelancers![0])} className="w-full mt-4">
          Assign to Freelancer (Simulated)
        </Button>
      )}
    </div>
  );
};

export default TaskCard;
