import React, { useState, FormEvent } from 'react';
import useAppStore from '../hooks/useAppStore';
import { TaskCategory } from '../types';
import { TASK_CATEGORIES, CLIENT_ID } from '../constants';
import { formatCurrency } from '../utils';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import { DollarSign, PlusCircle, Briefcase } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const {
    escrowBalance,
    getClientTasks,
    addTask,
    addFundsToEscrow,
    assignTask,
  } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TASK_CATEGORIES[0]);

  const clientTasks = getClientTasks();

  const handlePostTask = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !budget || !dueDate || !category) {
      alert('Please fill in all fields.');
      return;
    }

    addTask({
      title,
      description,
      budget: Number(budget),
      dueDate,
      category,
    });

    setTitle('');
    setDescription('');
    setBudget('');
    setDueDate('');
    setCategory(TASK_CATEGORIES[0]);
    alert('Task posted successfully!');
  };

  const handleAddFunds = () => {
    const amount = 500; // Simulate adding $500
    addFundsToEscrow(amount);
    alert(`Funds added to escrow: ${formatCurrency(amount)}`);
  };

  const handleAssignTask = (taskId: string, freelancerId: string) => {
    assignTask(taskId, freelancerId);
    alert('Task assigned! Funds moved to in-progress escrow.');
  };

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h2 className="text-4xl font-extrabold text-text mb-8 text-center md:text-left">Client Dashboard</h2>

      {/* Escrow & Funds */}
      <section className="bg-surface p-6 rounded-xl shadow-custom border border-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <DollarSign size={36} className="text-success" />
          <div>
            <p className="text-textSecondary text-sm">Current Escrow Balance</p>
            <p className="text-3xl font-bold text-text">{formatCurrency(escrowBalance)}</p>
          </div>
        </div>
        <Button onClick={handleAddFunds} variant="primary" size="lg" className="flex items-center gap-2">
          <PlusCircle size={20} /> Add Funds to Escrow
        </Button>
      </section>

      {/* Post New Task Form */}
      <section className="bg-surface p-6 rounded-xl shadow-custom border border-border mb-8">
        <h3 className="text-2xl font-semibold text-text mb-6 flex items-center gap-3">
          <Briefcase size={24} className="text-accent" /> Post New Task
        </h3>
        <form onSubmit={handlePostTask}>
          <Input
            id="taskTitle"
            label="Task Title"
            placeholder="e.g., Build a React Native mobile app"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            id="taskDescription"
            label="Description"
            placeholder="Provide a detailed description of the task requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            id="taskBudget"
            label="Budget (USD)"
            type="number"
            placeholder="e.g., 1500"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min="0"
            step="any"
            required
          />
          <Input
            id="taskDueDate"
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <Select
            id="taskCategory"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            options={TASK_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
            required
          />
          <Button type="submit" className="w-full mt-4" size="lg">
            Post Task
          </Button>
        </form>
      </section>

      {/* My Posted Tasks */}
      <section>
        <h3 className="text-2xl font-semibold text-text mb-6 flex items-center gap-3">
          <Briefcase size={24} className="text-accent" /> My Posted Tasks
        </h3>
        {clientTasks.length === 0 ? (
          <p className="text-textSecondary text-center py-8 bg-surface rounded-xl shadow-custom border border-border">
            You haven't posted any tasks yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                role="client"
                onAssign={handleAssignTask}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientDashboard;
