import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

type AuthMode = 'login' | 'register';
const PASSWORD_MIN_LENGTH = 8;

const validatePassword = (password: string): string | null => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include letters and numbers';
  }
  return null;
};

export const Login: React.FC = () => {
  const {
    authLoading,
    isAuthenticated,
    onboardingComplete,
    signIn,
    signUp,
  } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check URL parameters for verified=true redirect from backend email verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInfo('Email verified successfully! You can now sign in.');
      // Clean query parameters to avoid showing the banner on reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(onboardingComplete ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [authLoading, isAuthenticated, onboardingComplete, navigate]);

  const resetMessages = () => {
    setError('');
    setInfo('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);

    if (signInError) {
      setError(signInError);
      return;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setSubmitting(false);
      setError(signUpError);
      return;
    }

    // Auto sign-in after successful registration
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);

    if (signInError) {
      setError(signInError);
    }
  };



  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword('');
    setConfirmPassword('');
    resetMessages();
  };

  if (authLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant">Loading secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen relative font-sans antialiased text-on-surface overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-primary-fixed-dim/30 rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[60%] bg-surface-tint/10 rounded-full blur-[120px] opacity-80" />
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto px-container-padding-mobile flex flex-col justify-center py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-primary filled-icon">qr_code_scanner</span>
          </div>
          <h1 className="font-headline-lg-mobile text-primary tracking-tight">MediQR</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-center">
            Secure access to your health identity.
          </p>
        </div>

        <GlassCard className="w-full">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col w-full">
              <h2 className="font-title-md text-title-md text-on-surface mb-2">Welcome back</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                Sign in with your email and password.
              </p>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon="mail"
                  autoComplete="email"
                  required
                />

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon="lock"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-[12px] px-3 py-2">
                  {error}
                </p>
              )}
              {info && (
                <p className="mt-4 text-sm text-primary bg-primary/10 border border-primary/20 rounded-[12px] px-3 py-2">
                  {info}
                </p>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-full mt-6"
                icon="login"
                disabled={submitting}
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  Create account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col w-full">
              <h2 className="font-title-md text-title-md text-on-surface mb-2">Create your account</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                Register with email and password to instantly access your account.
              </p>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon="mail"
                  autoComplete="email"
                  required
                />

                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 8 chars, letters + numbers)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon="lock"
                  autoComplete="new-password"
                  required
                />

                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon="lock_reset"
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-[12px] px-3 py-2">
                  {error}
                </p>
              )}
              {info && (
                <p className="mt-4 text-sm text-primary bg-primary/10 border border-primary/20 rounded-[12px] px-3 py-2">
                  {info}
                </p>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-full mt-6"
                icon="person_add"
                disabled={submitting}
              >
                {submitting ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </GlassCard>

        <div className="mt-8 text-center flex items-center justify-center gap-2 opacity-60">
          <span className="material-symbols-outlined text-[16px] text-on-surface">lock</span>
          <span className="font-label-caps text-label-caps text-on-surface">
            Secured with Custom MySQL Auth
          </span>
        </div>
      </main>
    </div>
  );
};
