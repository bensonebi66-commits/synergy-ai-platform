import React from 'react';
import { Zap, User, Briefcase } from 'lucide-react';
import Button from './Button';
import { UserRole } from '../types';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole }) => {
  return (
    <header className="bg-primary text-white shadow-lg py-4 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <Zap size={32} className="text-accent animate-pulse" />
        <h1 className="text-3xl font-bold tracking-tight">Synergy AI</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex bg-surface rounded-full p-1 shadow-inner">
          <Button
            variant={userRole === 'client' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setUserRole('client')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${userRole === 'client' ? 'bg-accent text-white' : 'text-textSecondary hover:bg-surface/50'}`}
          >
            <User size={18} />
            Client
          </Button>
          <Button
            variant={userRole === 'freelancer' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setUserRole('freelancer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${userRole === 'freelancer' ? 'bg-accent text-white' : 'text-textSecondary hover:bg-surface/50'}`}
          >
            <Briefcase size={18} />
            Freelancer
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
