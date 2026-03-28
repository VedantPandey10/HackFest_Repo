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
      <div className="absolute left-6 inset-y-0 flex items-center pointer-events-none">
        <Lock className="text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
      </div>
      <input 
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-14 pr-14 text-sm outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-all font-medium"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <div className="absolute right-6 inset-y-0 flex items-center">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 flex items-center justify-center"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};
