import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  showValidation?: boolean;
}

export default function PasswordInput({ 
  value, 
  onChange, 
  label = "Password", 
  placeholder = "Enter your password",
  showValidation = false
}: PasswordInputProps) {
  
  const [showPassword, setShowPassword] = useState(false);

  // Validation logic
  const hasMinLength = value.length >= 8;
  const hasNumber = /\d/.test(value);
  const hasUpperLower = /[a-z]/.test(value) && /[A-Z]/.test(value);

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)]">
          <Lock className="w-5 h-5" />
        </div>
        
        <input
          type={showPassword ? "text" : "password"}
          required
          className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-[var(--line)] rounded-xl text-[var(--ink)] font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {showValidation && value.length > 0 && (
        <div className="mt-3 space-y-1.5 animate-in fade-in slide-in-from-top-1">
          <div className={`text-xs font-medium flex items-center gap-2 ${hasMinLength ? 'text-green-600' : 'text-slate-400'}`}>
            <span className="text-lg leading-none">{hasMinLength ? '✓' : '•'}</span> 8+ characters
          </div>
          <div className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
            <span className="text-lg leading-none">{hasNumber ? '✓' : '•'}</span> Contains a number
          </div>
          <div className={`flex items-center gap-1.5 transition-colors ${hasUpperLower ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
            <span className="text-lg leading-none">{hasUpperLower ? '✓' : '•'}</span> Uppercase & lowercase
          </div>
        </div>
      )}
    </div>
  );
}
