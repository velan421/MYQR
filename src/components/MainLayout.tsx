import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export const MainLayout: React.FC = () => {
  const { isAuthenticated, authLoading, onboardingComplete } = useAuth();

  if (authLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface relative">
      {/* Ambient Background Pulses */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-primary-fixed-dim/20 blur-[100px] top-[-10%] left-[-10%]" />
        <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full bg-tertiary-container/10 blur-[80px] bottom-[-10%] right-[-10%]" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block relative z-10 shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-container-padding-mobile md:px-container-padding-desktop py-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
