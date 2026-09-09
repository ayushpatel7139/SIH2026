"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Mail, ArrowRight, CircleAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import PasswordInput from '@/components/auth/PasswordInput';

export default function SignInPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.email.split('@')[0]);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled in store and displayed below
    }
  };

  return (
    <AuthLayout 
      title="Welcome back." 
      subtitle="Your business journey is waiting for you."
    >
      <div className="w-full">
        <h2 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2 md:hidden">Welcome back.</h2>
        <p className="text-[var(--muted)] font-medium mb-8 md:hidden">Your business journey is waiting for you.</p>

        <GoogleAuthButton />

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[var(--line)]"></div>
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">OR CONTINUE WITH EMAIL</span>
          <div className="flex-1 h-px bg-[var(--line)]"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CircleAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800 leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-[var(--line)] rounded-xl text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <PasswordInput 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            showValidation={false}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full primary-button !py-4 mt-2 shadow-lg shadow-[var(--primary-light)] text-base group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/auth/forgot-password" className="text-sm font-bold text-[var(--ink)] hover:text-[var(--primary)] transition-colors">
            Forgot your password?
          </Link>
          <p className="text-sm font-medium text-[var(--muted)]">
            New here?{' '}
            <Link href="/auth/signup" className="text-[var(--primary)] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
