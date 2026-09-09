"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Mail, ArrowRight, Loader2, ArrowLeft, CircleCheck } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import OtpInput from '@/components/auth/OtpInput';

type Step = 'email' | 'otp' | 'new-password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, resetPassword, isLoading, error } = useAuthStore();
  
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp(email);
    setStep('otp');
  };

  const handleVerifyOtp = async (otp: string) => {
    const isValid = await verifyOtp(email, otp);
    if (isValid) {
      setStep('new-password');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) return;

    await resetPassword(email);
    setStep('success');
  };

  return (
    <AuthLayout 
      title="Secure your account." 
      subtitle="Follow the steps to regain access to your business assessments safely."
    >
      <div className="w-full">
        
        {/* STEP 1: EMAIL */}
        {step === 'email' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <Link 
              href="/auth/signin"
              className="inline-flex items-center text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
            </Link>
            
            <h2 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Forgot your password?</h2>
            <p className="text-[var(--muted)] font-medium mb-8">Enter the email linked to your account and we'll help you get back in.</p>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-[var(--line)] rounded-xl text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full primary-button !py-4 mt-6 shadow-lg shadow-[var(--primary-light)] text-base group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send OTP <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <div className="animate-in fade-in slide-in-from-right-2">
            <button 
              onClick={() => setStep('email')}
              className="inline-flex items-center text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Change Email
            </button>

            <h2 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Check your email</h2>
            <p className="text-[var(--muted)] font-medium mb-8 leading-relaxed">
              Enter the 6-digit code we sent to <br/>
              <strong className="text-[var(--ink)]">{email}</strong>
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-700 animate-in fade-in">
                {error}
              </div>
            )}

            <OtpInput onComplete={handleVerifyOtp} isLoading={isLoading} />
            
            {isLoading && (
               <div className="mt-6 flex justify-center text-[var(--muted)]">
                 <Loader2 className="w-6 h-6 animate-spin" />
               </div>
            )}
          </div>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 'new-password' && (
          <div className="animate-in fade-in slide-in-from-right-2">
            <h2 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Create new password</h2>
            <p className="text-[var(--muted)] font-medium mb-8">Please choose a strong password that you haven't used before.</p>

            {(error || localError) && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-700 animate-in fade-in">
                {error || localError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <PasswordInput 
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showValidation={true}
              />
              
              <PasswordInput 
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showValidation={false}
              />

              <button
                type="submit"
                disabled={isLoading || password.length < 8}
                className="w-full primary-button !py-4 mt-6 shadow-lg shadow-[var(--primary-light)] text-base group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Update Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CircleCheck className="w-10 h-10 text-[var(--success)]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">Password updated</h2>
            <p className="text-[var(--muted)] font-medium mb-8">Your password has been changed successfully.</p>
            
            <Link 
              href="/auth/signin"
              className="w-full primary-button !py-4 inline-flex items-center justify-center gap-2 text-base shadow-lg shadow-[var(--primary-light)]"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}
