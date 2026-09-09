"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Store, 
  Wallet, 
  FileCheck, 
  ArrowRight, 
  Languages, 
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
  LineChart
} from "lucide-react";

const baseContent = {
  eyebrow: "RURAL BUSINESS ADVISOR",
  title: "Know before you borrow.",
  description: "Turn your business idea, local market and budget into a practical plan before taking a loan.",
  button: "Start Assessment",
  how: "See How It Works",
  trust: "Evidence-based guidance • Transparent calculations • Government scheme matching"
};

const LANGUAGES = ["English", "Hindi", "Gujarati"];

const TRANSLATIONS: Record<string, typeof baseContent> = {
  English: baseContent,
  Hindi: {
    eyebrow: "ग्रामीण व्यापार सलाहकार",
    title: "ऋण लेने से पहले सही जानकारी पाएं।",
    description: "ऋण लेने से पहले अपने व्यवसायिक विचार, स्थानीय बाजार और बजट के आधार पर एक व्यावहारिक योजना तैयार करें।",
    button: "मूल्यांकन शुरू करें",
    how: "यह कैसे काम करता है",
    trust: "प्रमाण-आधारित मार्गदर्शन • पारदर्शी गणना • सरकारी योजनाओं से मिलान"
  },
  Gujarati: {
    eyebrow: "ગ્રામીણ વ્યાપાર સલાહકાર",
    title: "ઋણ લેતા પહેલાં યોગ્ય માહિતી મેળવો.",
    description: "લોન લેતા પહેલાં તમારા વ્યવસાયિક વિચાર, સ્થાનિક બજાર અને બજેટના આધારે વ્યવહારુ યોજના તૈયાર કરો.",
    button: "મૂલ્યાંકન શરૂ કરો",
    how: "તે કેવી રીતે કામ કરે છે",
    trust: "પુરાવા આધારિત માર્ગદર્શન • પારદર્શક ગણતરીઓ • સરકારી યોજનાઓ સાથે મેળ"
  }
};

import { useAuthStore } from "@/store/auth-store";
import { useAssessmentStore } from "@/store/assessment-store";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { resetAssessment } = useAssessmentStore();
  
  const [language, setLanguage] = useState("English");
  const [text, setText] = useState(baseContent);

  useEffect(() => {
    setText(TRANSLATIONS[language] || baseContent);
  }, [language]);

  const handleStart = () => {
    resetAssessment();
    router.push("/assessment/location");
  };

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--ink)] font-sans overflow-x-hidden">

      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm shrink-0 p-1.5 transition-transform group-hover:scale-105">
            <img src="/udaan-logo.jpg" alt="Udaan Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-extrabold text-[var(--ink)] tracking-[0.1em] leading-none text-xl uppercase">UDAAN</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/60 backdrop-blur-md border border-[var(--line)] p-1 rounded-full shadow-sm">
            <Languages className="w-4 h-4 text-[var(--muted)] ml-3 hidden sm:block" />
            <div className="flex gap-1 ml-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 ${
                    language === lang 
                      ? "bg-[var(--ink)] text-white shadow-sm" 
                      : "text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--ink)]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          
          {/* AUTH SECTION */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-[var(--line)] pl-3 ml-2">
              <button 
                onClick={() => router.push('/dashboard')}
                className="hidden sm:block text-sm font-bold text-[var(--ink)] hover:text-[var(--primary)] transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-9 h-9 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-[var(--ink)] overflow-hidden transition-transform hover:scale-105"
              >
                {user.firstName.charAt(0).toUpperCase()}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-[var(--line)] pl-3 ml-2">
              <button 
                onClick={() => router.push('/auth/signin')}
                className="text-sm font-bold text-[var(--ink)] hover:text-[var(--primary)] transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push('/auth/signup')}
                className="primary-button !h-9 !px-4 text-xs"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 pb-20 pt-10 lg:pt-16">
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center mb-32 relative">
          
          {/* Left: Copy & Actions */}
          <div className="flex-1 max-w-2xl slide-up relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--primary)]">{text.eyebrow}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6 text-[var(--ink)]">
              {text.title}
            </h1>
            <p className="text-xl text-[var(--muted)] mb-10 leading-relaxed font-medium max-w-xl">
              {text.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button
                className="group w-full sm:w-auto primary-button btn-lg shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
                onClick={handleStart}
              >
                {text.button} 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="group w-full sm:w-auto secondary-button btn-lg bg-transparent border-none text-[var(--ink)] hover:bg-slate-100 transition-colors"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {text.how}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span>{text.trust}</span>
            </div>
          </div>

          {/* Right: Abstract Product Visualization */}
          <div className="flex-1 w-full max-w-xl slide-up delay-200 relative lg:h-[500px] flex items-center justify-center pointer-events-none">
             {/* Background glow */}
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-transparent to-orange-50/50 rounded-full blur-3xl -z-10"></div>
             
             {/* Central Hub (Analysis) */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full shadow-2xl border-4 border-slate-50 flex items-center justify-center z-20">
                <div className="w-24 h-24 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-inner animate-[pulse_4s_ease-in-out_infinite]">
                   <LineChart className="w-10 h-10" />
                </div>
             </div>

             {/* Connecting SVG Lines */}
             <svg className="absolute inset-0 w-full h-full z-0 text-[var(--line)]" style={{ strokeDasharray: '4 4' }}>
                <path d="M 100 150 Q 250 150 250 250" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 400 100 Q 250 150 250 250" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 100 400 Q 250 350 250 250" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 450 350 Q 250 350 250 250" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[dash_20s_linear_infinite]" />
             </svg>

             {/* Node 1: Idea */}
             <div className="absolute top-[20%] left-[10%] bg-white p-4 rounded-2xl shadow-lg border border-[var(--line)] flex items-center gap-3 z-10 animate-[float_6s_ease-in-out_infinite]">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                   <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                   <div className="w-16 h-2 bg-slate-100 rounded-full mb-1.5"></div>
                   <div className="w-10 h-2 bg-slate-100 rounded-full"></div>
                </div>
             </div>

             {/* Node 2: Market */}
             <div className="absolute top-[10%] right-[15%] bg-white p-4 rounded-2xl shadow-lg border border-[var(--line)] flex items-center gap-3 z-10 animate-[float_7s_ease-in-out_infinite_1s]">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                   <MapPin className="w-5 h-5" />
                </div>
                <div>
                   <div className="w-12 h-2 bg-slate-100 rounded-full mb-1.5"></div>
                   <div className="w-20 h-2 bg-slate-100 rounded-full"></div>
                </div>
             </div>

             {/* Node 3: Financials */}
             <div className="absolute bottom-[20%] left-[15%] bg-white p-4 rounded-2xl shadow-lg border border-[var(--line)] flex items-center gap-3 z-10 animate-[float_5s_ease-in-out_infinite_2s]">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                   <Wallet className="w-5 h-5" />
                </div>
                <div>
                   <div className="w-14 h-2 bg-slate-100 rounded-full mb-1.5"></div>
                   <div className="w-14 h-2 bg-slate-100 rounded-full"></div>
                </div>
             </div>

             {/* Node 4: Schemes */}
             <div className="absolute bottom-[15%] right-[10%] bg-white p-4 rounded-2xl shadow-lg border border-[var(--line)] flex items-center gap-3 z-10 animate-[float_8s_ease-in-out_infinite_0.5s]">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                   <FileCheck className="w-5 h-5" />
                </div>
                <div>
                   <div className="w-20 h-2 bg-slate-100 rounded-full mb-1.5"></div>
                   <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
                </div>
             </div>

             {/* Small decorative floating dots */}
             <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full blur-[1px] animate-pulse"></div>
             <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-orange-400 rounded-full blur-[1px] animate-pulse delay-700"></div>

          </div>
        </section>


        {/* HOW IT WORKS (VISUAL JOURNEY) */}
        <section id="how-it-works" className="mb-32 slide-up delay-300 pt-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink)] tracking-tight mb-4">From idea to informed decision.</h2>
            <p className="text-[var(--muted)] font-medium text-lg">Understand your business potential in 5 simple steps.</p>
          </div>

          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-[4.5rem] left-0 w-full h-1 bg-gradient-to-r from-[var(--line)] via-[var(--primary-light)] to-[var(--line)] -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { step: "01", title: "INPUT DETAILS", desc: "Your location, experience and business idea.", icon: MapPin },
                { step: "02", title: "UNDERSTAND", desc: "We look at your local market and competition.", icon: Store },
                { step: "03", title: "PLAN", desc: "We estimate investment, funding gap and repayment burden.", icon: Wallet },
                { step: "04", title: "MATCH", desc: "We identify potentially relevant government schemes.", icon: FileCheck },
                { step: "05", title: "DECIDE", desc: "Get a feasibility result and practical next steps.", icon: CheckCircle2 }
              ].map((item, idx) => (
                <div key={idx} className="group relative flex flex-col items-center text-center">
                  {/* Mobile Connecting Line */}
                  {idx !== 4 && <div className="md:hidden absolute top-[4.5rem] left-1/2 w-0.5 h-16 bg-[var(--line)] -z-10"></div>}
                  
                  <div className="text-sm font-extrabold text-[var(--primary)] mb-4">{item.step}</div>
                  
                  <div className="w-16 h-16 card-standard flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:border-[var(--primary)] group-hover:shadow-md transition-all duration-300">
                    <item.icon className="w-7 h-7 text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                  
                  <h3 className="font-bold text-[var(--ink)] text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-[var(--muted)] font-medium leading-relaxed max-w-[200px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="bg-[var(--ink)] rounded-3xl p-10 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 slide-up">
          <div className="md:max-w-md">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">Built around evidence, not guesses.</h2>
            <p className="text-slate-400 font-medium leading-relaxed">We analyze local data to give you a clear picture of feasibility, without making false promises.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-left">
            {[
              "Government & public data",
              "Local market signals",
              "Transparent calculations",
              "Potential scheme matches",
              "Source and date visibility"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
                </div>
                <span className="text-sm font-medium text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
      `}</style>
    </main>
  );
}
