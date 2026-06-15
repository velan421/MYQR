import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading, onboardingComplete } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, authLoading, onboardingComplete]);

  return (
    <div className="bg-surface overflow-hidden w-screen h-screen flex items-center justify-center relative font-sans antialiased text-on-surface">
      {/* Ambient Background Pulses */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-primary-fixed-dim/40 blur-[80px] animate-slow-pulse-1 top-[-10%] left-[-10%]" />
        <div className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full bg-tertiary-container/20 blur-[60px] animate-slow-pulse-2 bottom-[-10%] right-[-10%]" />
        <div className="absolute w-[50vw] h-[50vw] rounded-full bg-surface-container-highest/50 blur-[100px]" />
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col items-center justify-center px-container-padding-mobile">
        {/* Premium Glass Logo Container */}
        <div className="animate-float flex flex-col items-center justify-center p-12 rounded-[40px] backdrop-blur-[24px] bg-white/40 border border-white/60 shadow-[0_16px_60px_rgba(0,82,204,0.1)] relative">
          <div className="absolute inset-0 rounded-[40px] border border-white/20 pointer-events-none m-[2px]" />
          
          {/* Icon */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <span className="material-symbols-outlined text-[80px] text-transparent bg-clip-text bg-gradient-to-br from-primary to-tertiary-container relative z-10 filled-icon">
              qr_code_scanner
            </span>
          </div>

          {/* Brand Typography */}
          <h1 className="font-display-lg text-display-lg text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-tertiary-container text-gradient tracking-tight mb-2">
            MediQR
          </h1>
          
          <p className="font-body-sm text-body-sm text-on-surface-variant/80 tracking-widest uppercase">
            Clinical Clarity
          </p>

          {/* Loading Indicator */}
          <div className="absolute bottom-[-40px] flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </main>
    </div>
  );
};
