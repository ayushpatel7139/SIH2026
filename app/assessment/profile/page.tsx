"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { ArrowRight, ArrowLeft, UserRound } from "lucide-react";
import { 
  EntrepreneurType, 
  SocialCategory, 
  Gender, 
  AgeGroup, 
  PreviousExperience 
} from "@/types/assessment";

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    entrepreneurType, 
    socialCategory, 
    gender, 
    ageGroup, 
    previousBusinessExperience, 
    previousBusinessDetails,
    setProfile 
  } = useAssessmentStore();

  const isFormComplete = 
    entrepreneurType && 
    socialCategory && 
    gender && 
    ageGroup && 
    previousBusinessExperience;

  const handleContinue = () => {
    if (isFormComplete) {
      router.push("/assessment/business");
    }
  };

  const handleBack = () => {
    router.push("/assessment/location");
  };

  const entrepreneurOptions: EntrepreneurType[] = ["Individual", "Existing Business Owner", "First-time Entrepreneur"];
  const socialOptions: SocialCategory[] = ["SC", "ST", "OBC", "Other", "Prefer not to say"];
  const genderOptions: Gender[] = ["Woman", "Man", "Other", "Prefer not to say"];
  const ageOptions: AgeGroup[] = ["18–25", "26–35", "36–50", "51+"];
  const experienceOptions: PreviousExperience[] = ["Yes", "No"];

  return (
    <main className="welcome-page min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col fade-in">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-200 via-transparent to-transparent -z-10 opacity-40"></div>
      
      <div className="welcome-container p-6 sm:p-8 lg:p-12 flex-1 flex flex-col relative z-10">
        
        <header className="mb-12">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Location
          </button>
        </header>

        <section className="flex-1 max-w-3xl mx-auto w-full">
          
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                <UserRound className="w-5 h-5 text-[var(--primary)]" />
             </div>
             <div>
                <div className="text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase mb-1">Step 2 of 4</div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                  Tell us a little about yourself
                </h1>
             </div>
          </div>
          
          <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-16 max-w-xl">
            Your background helps us identify specific government schemes, subsidies, and opportunities relevant to your profile.
          </p>

          <div className="ml-0 sm:ml-16 space-y-12">
            
            {/* 1. Entrepreneur Type */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
              <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-4">1. What describes you best?</label>
              <div className="flex flex-wrap gap-3">
                {entrepreneurOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setProfile({ entrepreneurType: option })}
                    className={`px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      entrepreneurType === option 
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-md -translate-y-0.5' 
                        : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:bg-white hover:text-[var(--ink)]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid for smaller inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 2. Social Category */}
              <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
                <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-4">2. Social Category</label>
                <div className="flex flex-wrap gap-2">
                  {socialOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setProfile({ socialCategory: option })}
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${
                        socialCategory === option 
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Gender */}
              <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
                <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-4">3. Gender</label>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setProfile({ gender: option })}
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${
                        gender === option 
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Age Group */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
              <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-4">4. Age Group</label>
              <div className="flex flex-wrap gap-3">
                {ageOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setProfile({ ageGroup: option })}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                      ageGroup === option 
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm -translate-y-0.5' 
                        : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Experience */}
            <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
              <label className="text-sm font-extrabold text-[var(--ink)] tracking-tight block mb-2">5. Experience</label>
              <p className="text-[var(--muted)] font-medium text-sm mb-6">Have you ever run a business before?</p>
              <div className="flex flex-wrap gap-4 mb-4">
                {experienceOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setProfile({ previousBusinessExperience: option })}
                    className={`px-10 py-4 rounded-2xl border-2 transition-all font-bold text-base ${
                      previousBusinessExperience === option 
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-md' 
                        : 'border-[var(--line)] bg-slate-50 text-[var(--muted)] hover:border-slate-300 hover:text-[var(--ink)]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {previousBusinessExperience === "Yes" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-6 pt-6 border-t border-[var(--line)]">
                  <label className="text-sm font-bold text-[var(--ink)] block mb-3">Tell us briefly about your experience</label>
                  <textarea
                    value={previousBusinessDetails || ""}
                    onChange={(e) => setProfile({ previousBusinessDetails: e.target.value })}
                    placeholder="E.g., I ran a small grocery shop for 2 years..."
                    className="w-full p-5 rounded-2xl border-2 border-[var(--line)] bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] text-base font-medium transition-all resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>

          </div>

          <div className="mt-16 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleContinue}
              disabled={!isFormComplete}
              className={`primary-button w-full sm:w-auto px-10 py-4 text-lg ${
                !isFormComplete ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''
              }`}
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}
