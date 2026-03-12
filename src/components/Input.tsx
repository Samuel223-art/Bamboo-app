import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, ...props }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          {label}
        </label>
        {props.required && (
          <span className="text-[8px] font-bold text-bamboo/40 uppercase tracking-widest">Required</span>
        )}
      </div>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40 group-focus-within:text-bamboo transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white
            ${icon ? 'pl-12' : ''}
            focus:outline-none focus:ring-1 focus:ring-bamboo/30 focus:border-bamboo/40
            transition-all placeholder:text-sage/20 text-sm font-medium
          `}
        />
      </div>
    </div>
  );
};
