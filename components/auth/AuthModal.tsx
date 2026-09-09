import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { X, Mail, UserRound, ArrowRight, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import PasswordInput from './PasswordInput';
import OtpInput from './OtpInput';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ModalStep = 'options' | 'signup-email' | 'signup-otp' | 'signin';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login, signup, sendOtp, verifyOtp, isLoading, error } = useAuthStore();
  const [step, setStep] = useState<ModalStep>('options');
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });
  const [countdown, setCountdown] = useState(0);

  if (!isOpen) return null;

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.email.split('@')[0]);
      onSuccess();
    } catch (err) {}
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) return;
    await sendOtp(formData.email);
    setStep('signup-otp');
    startCountdown();
  };

  const handleOtpComplete = async (otp: string) => {
    const isValid = await verifyOtp(formData.email, otp);
    if (isValid) {
      await signup(formData.email, formData.firstName);
      onSuccess();
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await sendOtp(formData.email);
    startCountdown();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md fade-in overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-[480px] shadow-2xl relative slide-up border border-[var(--line)] overflow-hidden my-auto">
        
        {/* Abstract Top Banner */}
        <div className="h-32 bg-[var(--ink)] relative overflow-hidden">
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 text-white/70 hover:bg-white/10 hover:text-white rounded-full transition-colors z-10"
           >
             <X className="w-5 h-5" />
           </button>
           <div className="absolute bottom-6 left-8 flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-lg shrink-0 p-1.5">
                <img src="/udaan-logo.jpg" alt="Udaan Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-extrabold tracking-[0.1em] text-white leading-none text-3xl uppercase">UDAAN</div>
              </div>
           </div>
        </div>

        <div className="p-8 pb-10">
          
          {/* OPTIONS */}
          {step === 'options' && (
            <div className="animate-in fade-in slide-in-from-left-2">
              <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Save your assessment.</h2>
              <p className="text-sm font-medium text-[var(--muted)] mb-8">Create an account to securely save your answers and access your analysis.</p>
              
              <GoogleAuthButton onSuccess={onSuccess} />
              
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[var(--line)]"></div>
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">OR</span>
                <div className="flex-1 h-px bg-[var(--line)]"></div>
              </div>

              <button
                onClick={() => setStep('signup-email')}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-[var(--ink)] hover:bg-slate-50 hover:border-slate-300 font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98]"
              >
                <Mail className="w-5 h-5 text-[var(--muted)]" /> Continue with Email
              </button>
              
              <div className="mt-8 pt-6 border-t border-[var(--line)] text-center">
                <p className="text-sm font-medium text-[var(--muted)]">
                  Already have an account?{' '}
                  <button onClick={() => setStep('signin')} className="text-[var(--primary)] font-bold hover:underline">
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SIGN IN */}
          {step === 'signin' && (
            <div className="animate-in fade-in slide-in-from-right-2">
              <button 
                onClick={() => setStep('options')}
                className="inline-flex items-center text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              
              <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-6">Welcome back.</h2>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-700 animate-in fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-[var(--line)] rounded-xl text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <PasswordInput 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full primary-button !py-4 mt-2 shadow-lg shadow-[var(--primary-light)] text-base group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SIGN UP - EMAIL */}
          {step === 'signup-email' && (
            <div className="animate-in fade-in slide-in-from-right-2">
              <button 
                onClick={() => setStep('options')}
                className="inline-flex items-center text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              
              <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-6">Create Account</h2>

              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-1.5">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
                      <UserRound className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-[var(--line)] rounded-xl text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Rahul"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-[var(--line)] rounded-xl text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <PasswordInput 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  showValidation={true}
                />

                <button
                  type="submit"
                  disabled={isLoading || formData.password.length < 8}
                  className="w-full primary-button !py-4 mt-2 shadow-lg shadow-[var(--primary-light)] text-base group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SIGN UP - OTP */}
          {step === 'signup-otp' && (
            <div className="animate-in fade-in slide-in-from-right-2">
              <button 
                onClick={() => setStep('signup-email')}
                className="inline-flex items-center text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Change Email
              </button>

              <h3 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Verify your email</h3>
              <p className="text-sm text-[var(--muted)] font-medium mb-8">
                Enter the 6-digit code we sent to <br/>
                <strong className="text-[var(--ink)]">{formData.email}</strong>
              </p>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-700 animate-in fade-in">
                  {error}
                </div>
              )}

              <OtpInput onComplete={handleOtpComplete} isLoading={isLoading} />

              <div className="mt-8 flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-[var(--muted)]">Didn't receive code?</span>
                <button 
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className={`text-sm font-bold flex items-center gap-2 transition-colors ${
                    countdown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-[var(--primary)] hover:text-[var(--ink)]'
                  }`}
                >
                  {countdown > 0 ? (
                    `Resend in 00:${countdown.toString().padStart(2, '0')}`
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" /> Resend
                    </>
                  )}
                </button>
              </div>
              
              {isLoading && (
                 <div className="mt-6 flex justify-center text-[var(--muted)]">
                   <Loader2 className="w-6 h-6 animate-spin" />
                 </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
