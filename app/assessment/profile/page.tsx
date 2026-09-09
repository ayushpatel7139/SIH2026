"use client";

import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/store/assessment-store";
import { ArrowRight, ArrowLeft, UserRound, Store, GraduationCap, CircleCheck } from "lucide-react";
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

  // Maps for conversational UI
  const experienceOptions: { val: PreviousExperience, label: string }[] = [
    { val: "Yes", label: "Yes, I have run a business before" },
    { val: "No", label: "No, this is my first time" }
  ];

  const typeOptions: { val: EntrepreneurType, label: string, icon: any }[] = [
    { val: "First-time Entrepreneur", label: "I am starting fresh", icon: GraduationCap },
    { val: "Existing Business Owner", label: "I want to expand", icon: Store },
    { val: "Individual", label: "I am an individual applicant", icon: UserRound }
  ];

  const socialOptions: SocialCategory[] = ["SC", "ST", "OBC", "Other", "Prefer not to say"];
  const genderOptions: Gender[] = ["Woman", "Man", "Other", "Prefer not to say"];
  const ageOptions: AgeGroup[] = ["18–25", "26–35", "36–50", "51+"];

  return (
    <main className="flex-1 flex flex-col bg-[var(--cream)] relative overflow-hidden fade-in">

      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 sm:px-8 py-10 lg:py-16 relative z-10">
        
        <header className="mb-10">
          <button 
            onClick={handleBack}
            className="ghost-button !p-0 !text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </header>
        
        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[var(--line)] flex items-center justify-center flex-shrink-0">
              <UserRound className="w-6 h-6 text-[var(--primary)]" />
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
             Who am I?
           </h1>
        </div>
        
        <p className="text-lg text-[var(--muted)] font-medium mb-12 leading-relaxed ml-0 sm:ml-16 max-w-xl">
          We use your demographic details to find targeted financial support and government schemes that match your profile.
        </p>

        <div className="ml-0 sm:ml-16 space-y-12 slide-up">
          
          {/* Conversational: Experience */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">Have you run a business before?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {experienceOptions.map((opt) => {
                const isSelected = previousBusinessExperience === opt.val;
                return (
                  <button
                    key={opt.val}
                    onClick={() => setProfile({ previousBusinessExperience: opt.val })}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-1 ${
                      isSelected 
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                        : 'border-[var(--line)] bg-white text-[var(--ink)] hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-lg">{opt.label}</span>
                    {isSelected && <CircleCheck className="w-6 h-6" />}
                  </button>
                )
              })}
            </div>

            {/* Follow up if yes */}
            <div className={`transition-all duration-300 overflow-hidden ${previousBusinessExperience === "Yes" ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="card-standard !bg-slate-50 p-6">
                <label htmlFor="experience-details" className="premium-label">Briefly describe your experience <span className="text-[var(--muted)] font-normal">(optional)</span></label>
                <span className="helper-text">This helps us match you with advanced business schemes.</span>
                <textarea
                  id="experience-details"
                  value={previousBusinessDetails || ""}
                  onChange={(e) => setProfile({ previousBusinessDetails: e.target.value })}
                  placeholder="E.g., I ran a small grocery shop for 2 years..."
                  className="input-standard resize-none shadow-sm mt-1"
                  rows={2}
                />
              </div>
            </div>
          </section>

          {/* Conversational: Type */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">What describes your goal best?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {typeOptions.map((opt) => {
                const isSelected = entrepreneurType === opt.val;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.val}
                    onClick={() => setProfile({ entrepreneurType: opt.val })}
                    className={`flex flex-col gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-1 ${
                      isSelected 
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm' 
                        : 'border-[var(--line)] bg-white text-[var(--ink)] hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--muted)]'}`} />
                    <span className="font-bold text-base leading-snug">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Demographics Group */}
          <section className="card-standard p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[var(--ink)] mb-1">Help us find the right government schemes for you</h2>
              <p className="text-sm text-[var(--muted)] font-medium">Certain schemes offer special benefits based on this data.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age */}
              <div>
                <label className="premium-label" id="age-group-label">Age Group</label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="age-group-label">
                  {ageOptions.map(option => (
                    <button
                      key={option}
                      role="radio"
                      aria-checked={ageGroup === option}
                      onClick={() => setProfile({ ageGroup: option })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all font-bold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                        ageGroup === option 
                          ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-sm' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--ink)] hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="premium-label" id="gender-label">Gender</label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="gender-label">
                  {genderOptions.map(option => (
                    <button
                      key={option}
                      role="radio"
                      aria-checked={gender === option}
                      onClick={() => setProfile({ gender: option })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all font-bold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                        gender === option 
                          ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-sm' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--ink)] hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Category */}
              <div className="md:col-span-2">
                <label className="premium-label" id="social-label">Social Category</label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="social-label">
                  {socialOptions.map(option => (
                    <button
                      key={option}
                      role="radio"
                      aria-checked={socialCategory === option}
                      onClick={() => setProfile({ socialCategory: option })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all font-bold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                        socialCategory === option 
                          ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-sm' 
                          : 'border-[var(--line)] bg-slate-50 text-[var(--ink)] hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </div>

        <div className="mt-16 ml-0 sm:ml-16 pt-8 border-t border-[var(--line)] flex items-center justify-between">
          <p className="text-sm text-[var(--muted)] font-medium hidden sm:block">Step 2 of 4</p>
          <button
            onClick={handleContinue}
            disabled={!isFormComplete}
            className={`primary-button btn-lg shadow-lg shadow-orange-500/20 w-full sm:w-auto hover:-translate-y-1 ${
              !isFormComplete ? 'opacity-50 cursor-not-allowed hover:-translate-y-0 shadow-none' : ''
            }`}
          >
            Define your business <ArrowRight className="btn-icon ml-1" />
          </button>
        </div>

      </div>
    </main>
  );
}
