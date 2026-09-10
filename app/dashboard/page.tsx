"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useAssessmentStore } from '@/store/assessment-store';
import { ArrowRight, Plus, LogOut, FileText, MapPin, Clock, UserRound, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/common/EmptyState';

export default function DashboardPage() {
  const router = useRouter();
  const { user, savedAssessments, logout } = useAuthStore();
  const { resetAssessment, loadAssessmentData } = useAssessmentStore();
  
  const [activeTab, setActiveTab] = useState<'assessments' | 'profile'>('assessments');

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  if (!user) return null;

  const handleStartNew = () => {
    resetAssessment();
    router.push('/assessment/location');
  };

  const handleContinue = (assessment: any) => {
    loadAssessmentData(assessment.data);
    router.push(assessment.lastStepRoute);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[var(--cream)] fade-in flex flex-col relative overflow-hidden">
      
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-bl from-[var(--primary-light)] via-transparent to-transparent pointer-events-none -z-10" />

      <header className="p-6 sm:px-8 sm:py-6 relative z-20 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-[var(--line)] shadow-sm">
        <Link href="/" className="inline-flex items-center gap-4 text-[var(--ink)] hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm shrink-0 p-1.5 hidden sm:flex">
            <img src="/udaan-logo.jpg" alt="Mirai Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--ink)] tracking-[0.1em] leading-none text-2xl uppercase">MIRAI</div>
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="ghost-button hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="btn-icon-sm" /> <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 slide-up">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="flex flex-row md:flex-col gap-2">
            <button
              onClick={() => setActiveTab('assessments')}
              className={`text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                activeTab === 'assessments' 
                  ? 'bg-white shadow-sm border border-[var(--line)] text-[var(--primary)]' 
                  : 'text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--ink)] border border-transparent'
              }`}
            >
              <FileText className="w-5 h-5" /> 
              <span className="hidden md:inline">My Assessments</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                activeTab === 'profile' 
                  ? 'bg-white shadow-sm border border-[var(--line)] text-[var(--primary)]' 
                  : 'text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--ink)] border border-transparent'
              }`}
            >
              <UserRound className="w-5 h-5" /> 
              <span className="hidden md:inline">Account Profile</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1">
          
          {activeTab === 'assessments' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-2">
                    Welcome back, {user.firstName}
                  </h1>
                  <p className="text-[var(--muted)] font-medium">Continue where you left off or start a new idea.</p>
                </div>
                
                <button 
                  onClick={handleStartNew}
                  className="primary-button shadow-lg shadow-orange-500/20 whitespace-nowrap"
                >
                  <Plus className="btn-icon-sm mr-1" /> Start New Assessment
                </button>
              </div>
              
              {savedAssessments.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No assessments yet"
                  description="Start your first business assessment and understand your market, finances and available schemes."
                  actionLabel="Start New Assessment"
                  actionIcon={<ArrowRight className="btn-icon-sm ml-1" />}
                  onAction={handleStartNew}
                />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {savedAssessments.map((assessment) => (
                    <div key={assessment.id} className="card-interactive p-6 flex flex-col justify-between group">
                      
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-[var(--ink)] tracking-tight mb-2 group-hover:text-[var(--action)] transition-colors">
                            {assessment.name}
                          </h3>
                          <div className="flex flex-col gap-1.5 text-xs font-bold text-[var(--muted)] uppercase tracking-widest">
                            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {assessment.location}</span>
                            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(assessment.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <span className={assessment.status === 'Completed' ? 'badge-success' : 'badge-neutral'}>
                          {assessment.status}
                        </span>
                      </div>
                      
                      {assessment.status === 'In Progress' && (
                         <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-[var(--line)]">
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-[var(--muted)]">Completion</span>
                             <span className="text-[var(--ink)]">{assessment.completionPercentage}%</span>
                           </div>
                           <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                             <div className="bg-[var(--action)] h-full rounded-full transition-all duration-1000" style={{ width: `${assessment.completionPercentage}%` }}></div>
                           </div>
                         </div>
                      )}

                      <div className="mt-auto pt-2">
                        <button 
                          onClick={() => handleContinue(assessment)}
                          className="w-full secondary-button group/btn"
                        >
                          {assessment.status === 'Completed' ? 'View Analysis' : 'Continue Assessment'} 
                          <ArrowRight className="btn-icon-sm group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 max-w-2xl">
              <h1 className="text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-8">
                Account Profile
              </h1>
              
              <div className="card-standard p-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[var(--line)]">
                  <div className="w-24 h-24 bg-[var(--primary-light)] text-[var(--primary)] border-2 border-[var(--primary)] rounded-full flex items-center justify-center font-extrabold text-3xl shadow-inner">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight">{user.firstName}</h2>
                    <p className="text-[var(--muted)] font-medium">Business Owner</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Email Address</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-[var(--line)]">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <span className="font-bold text-[var(--ink)]">{user.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Member Since</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-[var(--line)]">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="font-bold text-[var(--ink)]">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
