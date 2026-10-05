import { useState } from 'react';
import { SafetyProvider } from './context/SafetyContext';
import { useSafety } from './context/useSafety';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import IncidentModal from './components/IncidentModal';

import Dashboard from './pages/Dashboard';
import PpeDetection from './pages/PpeDetection';
import Incidents from './pages/Incidents';
import MachineRisk from './pages/MachineRisk';
import AiAssistant from './pages/AiAssistant';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';

function AppContent() {
  const { currentPage } = useSafety();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <AuthPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'ppe':
        return <PpeDetection />;
      case 'incidents':
        return <Incidents />;
      case 'machine-risk':
        return <MachineRisk />;
      case 'ai-assistant':
        return <AiAssistant />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Toast />
      <IncidentModal />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
          <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {renderCurrentPage()}
          </main>

          <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 bg-slate-950/60 font-mono">
            <span>SafeSteel AI Operating System • Shift B • Steelworks Safety Node JSR-04</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafetyProvider>
        <AppContent />
      </SafetyProvider>
    </AuthProvider>
  );
}
