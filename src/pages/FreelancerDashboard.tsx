import React, { useState } from 'react';
import useAppStore from '../hooks/useAppStore';
import { TaskCategory } from '../types';
import { TASK_CATEGORIES, FREELANCER_ID } from '../constants';
import { formatCurrency } from '../utils';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import { Briefcase, DollarSign, CheckCircle, Clock, Wallet } from 'lucide-react';

const FreelancerDashboard: React.FC = () => {
  const {
    getAvailableFreelancerTasks,
    getActiveFreelancerTasks,
    getCompletedFreelancerTasks,
    getTotalFreelancerEarnings,
    applyToTask,
    completeTask,
  } = useAppStore();

  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'All'>('All');
  const [aiVerificationLoading, setAiVerificationLoading] = useState<string | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'Paystack' | 'Airtm' | 'USDC'>('Paystack');

  const availableTasks = getAvailableFreelancerTasks(FREELANCER_ID).filter(task =>
    filterCategory === 'All' ? true : task.category === filterCategory
  );
  const activeTasks = getActiveFreelancerTasks(FREELANCER_ID);
  const completedTasks = getCompletedFreelancerTasks(FREELANCER_ID);
  const totalEarnings = getTotalFreelancerEarnings(FREELANCER_ID);
  const availableBalance = totalEarnings; // For MVP, all earnings are available

  const handleApplyToTask = (taskId: string) => {
    applyToTask(taskId, FREELANCER_ID);
    alert('Application sent! Waiting for client review.');
  };

  const handleMarkComplete = async (taskId: string) => {
    setAiVerificationLoading(taskId);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI verification
    completeTask(taskId);
    setAiVerificationLoading(null);
    alert('✅ AI verification complete! Ready for payout');
  };

  const handleRequestPayout = () => {
    alert('💰 Payout request sent to Paystack. Funds arriving in 5-10 minutes.');
  };

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h2 className="text-4xl font-extrabold text-text mb-8 text-center md:text-left">Freelancer Dashboard</h2>

      {/* Payouts Section */}
      <section className="bg-surface p-6 rounded-xl shadow-custom border border-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Wallet size={36} className="text-accent" />
          <div>
            <p className="text-textSecondary text-sm">Total Earned</p>
            <p className="text-3xl font-bold text-text">{formatCurrency(totalEarnings)}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value as 'Paystack' | 'Airtm' | 'USDC')}
              className="block w-full p-3 bg-background border border-border rounded-lg text-text appearance-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            >
              <option value="Paystack">Paystack (NGN Bank)</option>
              <option value="Airtm">Airtm</option>
              <option value="USDC" disabled>USDC (Coming Soon)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-textSecondary">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <Button onClick={handleRequestPayout} variant="primary" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
            <DollarSign size={20} /> Request Payout
          </Button>
        </div>
      </section>

      {/* Available Tasks */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-text mb-6 flex items-center gap-3">
          <Clock size={24} className="text-accent" /> Available Tasks
        </h3>
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={filterCategory === 'All' ? 'primary' : 'secondary'}
            onClick={() => setFilterCategory('All')}
            size="sm"
          >
            All
          </Button>
          {TASK_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? 'primary' : 'secondary'}
              onClick={() => setFilterCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
        {availableTasks.length === 0 ? (
          <p className="text-textSecondary text-center py-8 bg-surface rounded-xl shadow-custom border border-border">
            No available tasks in this category. Check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                role="freelancer"
                onApply={handleApplyToTask}
              />
            ))}
          </div>
        )}
      </section>

      {/* My Active Tasks */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-text mb-6 flex items-center gap-3">
          <Briefcase size={24} className="text-accent" /> My Active Tasks
        </h3>
        {activeTasks.length === 0 ? (
          <p className="text-textSecondary text-center py-8 bg-surface rounded-xl shadow-custom border border-border">
            You currently have no active tasks. Apply to some!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                role="freelancer"
                onMarkComplete={handleMarkComplete}
                isLoading={aiVerificationLoading === task.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      <section>
        <h3 className="text-2xl font-semibold text-text mb-6 flex items-center gap-3">
          <CheckCircle size={24} className="text-accent" /> Completed Tasks
        </h3>
        {completedTasks.length === 0 ? (
          <p className="text-textSecondary text-center py-8 bg-surface rounded-xl shadow-custom border border-border">
            No completed tasks yet. Get to work!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                role="freelancer"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FreelancerDashboard;
