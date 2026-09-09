"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Mail, ArrowRight, UserRound, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import PasswordInput from '@/components/auth/PasswordInput';
import OtpInput from '@/components/auth/OtpInput';

type Step = 'options' | 'email-form' | 'otp';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, sendOtp, verifyOtp, isLoading, error } = useAuthStore();
  const [step, setStep] = useState<Step>('options');
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
  });
  
  const [countdown, setCountdown] = useState(0);

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

  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) return;
    
    await sendOtp(formData.email);
    setStep('otp');
    startCountdown();
  };

  const handleOtpComplete = async (otp: string) => {
    const isValid = await verifyOtp(formData.email, otp);
    if (isValid) {
      await signup(formData.email, formData.firstName);
      router.push('/dashboard');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await sendOtp(formData.email);
    startCountdown();
  };

  return (
    <AuthLayout 
      title="Begin your assessment journey." 
      subtitle="Create your free account to save assessments, track your progress and come back anytime."
    >
      <div className="w-full">
        
        {/* Mobile Headings */}
        {step === 'options' && (
          <div className="md:hidden mb-8">
            <h2 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Create your account.</h2>
            <p className="text-[var(--muted)] font-medium">Create your free account to save assessments.</p>
          </div>
        )}

        {/* STEP 1: OPTIONS */}
        {step === 'options' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <GoogleAuthButton />
            
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[var(--line)]"></div>
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[var(--line)]"></div>
            </div>

            <button
              onClick={() => setStep('email-form')}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              <Mail className="w-5 h-5" /> Continue with Email
            </button>
            
            <div className="mt-8 pt-6 border-t border-[var(--line)] text-center">
              <p className="text-sm font-medium text-[var(--muted)]">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-[var(--primary)] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: EMAIL FORM */}
        {step === 'email-form' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <button 
              onClick={() => setStep('options')}
              className="inline-flex items-center text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            
            <h3 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight mb-6">Create Account</h3>

            <form onSubmit={handleEmailFormSubmit} className="space-y-5">
              <div>
                <label htmlFor="first-name" className="premium-label">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <input
                    id="first-name"
                    type="text"
                    required
                    className="input-standard pl-12"
                    placeholder="e.g. Rahul"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="premium-label">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input-standard pl-12"
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
                className="w-full primary-button !py-4 mt-6 shadow-lg shadow-[var(--primary-light)] text-base group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending Code...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 'otp' && (
          <div className="animate-in fade-in slide-in-from-right-2">
            <button 
              onClick={() => setStep('email-form')}
              className="inline-flex items-center text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Change Email
            </button>

            <h3 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Verify your email</h3>
            <p className="text-[var(--muted)] font-medium mb-8 leading-relaxed">
              Enter the 6-digit code we sent to <br/>
              <strong className="text-[var(--ink)]">{formData.email}</strong>
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-700 animate-in fade-in">
                {error}
              </div>
            )}

            <OtpInput onComplete={handleOtpComplete} isLoading={isLoading} />

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-[var(--line)]">
              <span className="text-sm font-bold text-[var(--muted)]">Didn't receive the code?</span>
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
                    <RefreshCw className="w-4 h-4" /> Resend Code
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
    </AuthLayout>
  );
}
