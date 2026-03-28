import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Password", 
  required = true,
  className = "" 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative group ${className}`}>
      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
      <input 
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-14 pr-14 text-sm outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-all font-medium"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};
