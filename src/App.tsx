import React from 'react';
import Header from './components/Header';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import useAppStore from './hooks/useAppStore';

function App() {
  const { userRole, setUserRole } = useAppStore();

  return (
    <div className="min-h-screen bg-background text-text">
      <Header userRole={userRole} setUserRole={setUserRole} />
      <main className="py-8">
        {userRole === 'client' ? <ClientDashboard /> : <FreelancerDashboard />}
      </main>
    </div>
  );
}

export default App;
