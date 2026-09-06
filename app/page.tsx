"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Calculator, ShieldCheck, ArrowRight, Languages, Lightbulb, Target, LayoutDashboard } from "lucide-react";

const baseContent = {
  title: "Before you borrow,",
  highlight: "know your business.",
  description:
    "Turn your business idea, local market data, and budget into a practical plan—before you take on a loan.",
  button: "Start My Assessment",
  how: "See How It Works",
  trust: "Built for Rural India • Multi-language Support",
};

const LANGUAGES = ["English", "Hindi", "Gujarati"];

// Using a free translation API (MyMemory) so you can see real translations immediately!
async function translateWithAPI(text: string, targetLanguage: string) {
  if (targetLanguage === "English") return text;
  
  const langCode = targetLanguage === "Hindi" ? "hi" : "gu";
  
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`);
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text;
  } catch (error) {
    console.error("Translation API error:", error);
    return text; 
  }
}

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState("English");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [text, setText] = useState(baseContent);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    async function updateTranslations() {
      if (language === "English") {
        setText(baseContent);
        return;
      }
      setIsTranslating(true);
      try {
        const translatedContent = { ...baseContent };
        for (const [key, value] of Object.entries(baseContent)) {
          translatedContent[key as keyof typeof baseContent] = await translateWithAPI(value, language);
        }
        setText(translatedContent);
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setIsTranslating(false);
      }
    }
    updateTranslations();
  }, [language]);

  return (
    <main className="welcome-page fade-in bg-[var(--cream)] relative overflow-hidden">
      {/* Decorative abstract background element */}
      <div className="absolute top-0 right-0 w-3/4 h-[800px] bg-gradient-to-bl from-[var(--primary-light)] via-transparent to-transparent -z-10 rounded-bl-[200px] opacity-70"></div>
      
      <div className="welcome-container p-6 sm:p-8 lg:p-12 min-h-screen flex flex-col relative z-10">

        {/* HEADER */}
        <header className="flex items-center justify-between py-4 mb-12 sm:mb-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xl rounded-2xl shadow-sm">
              R
            </div>
            <div>
              <div className="font-extrabold text-[var(--ink)] tracking-tight leading-none text-lg">Rural Business</div>
              <div className="text-xs font-bold text-[var(--primary)] tracking-widest uppercase mt-1">Advisor</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--line)] p-1.5 rounded-full shadow-sm">
            <Languages className="w-4 h-4 text-[var(--muted)] ml-3 hidden sm:block" />
            <div className="flex gap-1 ml-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  disabled={isTranslating}
                  onClick={() => setLanguage(lang)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    language === lang 
                      ? "bg-[var(--ink)] text-white shadow-md" 
                      : "text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--ink)]"
                  } ${isTranslating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 flex-1">
          
          {/* LEFT: COPY */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[var(--line)] shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--action)] animate-pulse" />
              <span className="text-xs font-bold text-[var(--ink)] tracking-wider uppercase">Smart Assessment Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--ink)] tracking-tighter leading-[1.05] mb-8">
              {text.title} <br className="hidden md:block"/> <span className="text-[var(--primary)]">{text.highlight}</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--muted)] mb-12 leading-relaxed font-medium max-w-xl">
              {text.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <button
                className="primary-button w-full sm:w-auto px-8 py-4 text-lg"
                onClick={() => router.push("/assessment/location")}
              >
                {text.button} <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button
                className="secondary-button w-full sm:w-auto px-8 py-4 text-lg bg-transparent border-[var(--line)] text-[var(--ink)] hover:bg-white hover:border-[var(--ink)]"
                onClick={() => setShowHowItWorks(!showHowItWorks)}
              >
                {text.how}
              </button>
            </div>

            {showHowItWorks && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 p-8 bg-white border border-[var(--line)] rounded-3xl shadow-lg fade-in relative">
                <div className="absolute -top-3 left-8 bg-[var(--action)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  The Process
                </div>
                <div>
                  <div className="text-[var(--primary)] font-extrabold text-2xl mb-3 tracking-tighter">01</div>
                  <h4 className="font-bold text-[var(--ink)] mb-2">Locate & Detail</h4>
                  <p className="text-xs font-medium text-[var(--muted)] leading-relaxed">Tell us where you are and what you want to build.</p>
                </div>
                <div>
                  <div className="text-[var(--primary)] font-extrabold text-2xl mb-3 tracking-tighter">02</div>
                  <h4 className="font-bold text-[var(--ink)] mb-2">Analyze Market</h4>
                  <p className="text-xs font-medium text-[var(--muted)] leading-relaxed">We evaluate local demand and estimate financial needs.</p>
                </div>
                <div>
                  <div className="text-[var(--primary)] font-extrabold text-2xl mb-3 tracking-tighter">03</div>
                  <h4 className="font-bold text-[var(--ink)] mb-2">Get Action Plan</h4>
                  <p className="text-xs font-medium text-[var(--muted)] leading-relaxed">Receive a clear feasibility report and financing options.</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-xs font-bold text-[var(--ink)]">
              <ShieldCheck className="w-5 h-5 text-[var(--success)]" />
              {text.trust}
            </div>
          </div>

          {/* RIGHT VISUAL AREA - The Journey Visualization */}
          <div className="flex-1 w-full max-w-xl hidden lg:block relative">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-2xl"></div>
            
            <div className="relative p-12 flex flex-col gap-6">
              {/* Node 1: Idea */}
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-[var(--line)] flex items-center justify-center flex-shrink-0 group-hover:-translate-y-1 transition-transform">
                  <Lightbulb className="w-8 h-8 text-[var(--action)]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] text-lg tracking-tight">1. Idea & Profile</h3>
                  <p className="text-sm text-[var(--muted)] font-medium">Define your business concept</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--line)] to-[var(--primary-light)] ml-8 rounded-full"></div>

              {/* Node 2: Market */}
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-[var(--line)] flex items-center justify-center flex-shrink-0 group-hover:-translate-y-1 transition-transform">
                  <MapPin className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] text-lg tracking-tight">2. Local Market</h3>
                  <p className="text-sm text-[var(--muted)] font-medium">Analyze demand and competition</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--line)] to-[var(--primary-light)] ml-8 rounded-full"></div>

              {/* Node 3: Money */}
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-[var(--line)] flex items-center justify-center flex-shrink-0 group-hover:-translate-y-1 transition-transform">
                  <Calculator className="w-8 h-8 text-[var(--success)]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] text-lg tracking-tight">3. Financial Capacity</h3>
                  <p className="text-sm text-[var(--muted)] font-medium">Estimate gap and repayment</p>
                </div>
              </div>
              
              {/* Connecting Line */}
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--line)] to-[var(--primary-light)] ml-8 rounded-full"></div>

              {/* Node 4: Plan */}
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-[var(--ink)] rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0 group-hover:-translate-y-1 transition-transform">
                  <LayoutDashboard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] text-xl tracking-tight">4. Feasibility Plan</h3>
                  <p className="text-sm text-[var(--muted)] font-medium">Your customized advisory report</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-auto py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-t border-[var(--line)] relative z-10">
          <span>Smart India Hackathon</span>
          <div className="flex gap-4">
             <span>Data-Driven</span>
             <span>Hyper-Local</span>
             <span>Actionable</span>
          </div>
        </footer>

      </div>
    </main>
  );
}