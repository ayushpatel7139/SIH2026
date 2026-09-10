import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[var(--cream)] flex flex-col md:flex-row relative overflow-hidden fade-in">
      
      {/* LEFT SIDE: Brand Story (Hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 lg:p-20 bg-[var(--ink)] text-white relative overflow-hidden">
        
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-green-500/20 to-transparent rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-4 slide-up">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-lg shrink-0 p-1.5">
            <img src="/udaan-logo.jpg" alt="Mirai Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold tracking-[0.1em] leading-none text-3xl uppercase">MIRAI</div>
          </div>
        </div>

        <div className="relative z-10 mt-auto slide-up delay-200">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
            {title}
          </h1>
          <p className="text-lg lg:text-xl font-medium text-slate-400 leading-relaxed max-w-md">
            {subtitle}
          </p>
        </div>

      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 relative bg-white md:bg-transparent slide-up">
        
        <div className="md:hidden flex items-center gap-4 mb-12 self-start">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-sm shrink-0 p-1.5">
            <img src="/udaan-logo.jpg" alt="Mirai Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--ink)] tracking-[0.1em] leading-none text-3xl uppercase">MIRAI</div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
      
    </main>
  );
}
