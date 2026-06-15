import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleAccept = async () => {
    await completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="bg-surface min-h-screen relative font-sans antialiased text-on-surface flex flex-col justify-center items-center">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-primary-fixed-dim/20 blur-[100px] top-[-10%] left-[-10%]" />
        <div className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full bg-tertiary-container/10 blur-[80px] bottom-[-10%] right-[-10%]" />
      </div>

      <main className="relative z-10 flex-grow flex flex-col justify-center items-center px-container-padding-mobile md:px-container-padding-desktop py-12 w-full max-w-md mx-auto">
        {/* Header / Logo Area */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm mb-4">
            <span className="material-symbols-outlined text-primary text-3xl filled-icon">
              health_and_safety
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight mb-2">MediQR</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Your Health. Your Control.</p>
        </div>

        {/* Consent Card */}
        <GlassCard className="w-full mb-8">
          <h2 className="font-title-md text-title-md text-on-surface mb-6">Data Privacy &amp; Sharing</h2>
          <div className="flex flex-col gap-6">
            {/* Point 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  qr_code
                </span>
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">Secure QR Sharing</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Your medical profile is accessed only when you present your personal QR code to a verified provider.</p>
              </div>
            </div>
            {/* Point 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  encrypted
                </span>
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">End-to-End Encryption</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">All health records are encrypted at rest and in transit. MediQR cannot read your sensitive medical data.</p>
              </div>
            </div>
            {/* Point 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  manage_accounts
                </span>
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">Complete Ownership</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">You decide what information is shared. Revoke access to any provider at any time from your settings.</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Action Area */}
        <div className="w-full flex flex-col items-center gap-4 mt-auto">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center px-4">
            By continuing, you agree to our{' '}
            <a className="text-primary font-medium hover:underline transition-all" href="#">Terms of Service</a> and acknowledge the{' '}
            <a className="text-primary font-medium hover:underline transition-all" href="#">Privacy Policy</a>.
          </p>
          
          <Button
            variant="primary"
            onClick={handleAccept}
            className="w-full py-4 text-center justify-center"
            icon="arrow_forward"
          >
            Accept and Continue
          </Button>
        </div>
      </main>
    </div>
  );
};
