import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from './Input';

interface LoginFormProps {
  onToggle: () => void;
  onSuccess: (user: any) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggle, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm rounded-xl">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          required
          icon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            icon={<Lock className="w-4 h-4" />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand text-bg-dark rounded-xl py-3.5 sm:py-4 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group brand-glow"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="pt-4 border-t border-white/5">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          New to Bamboo Capital?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-brand hover:text-white transition-colors ml-2"
          >
            Create Account
          </button>
        </p>
      </div>
    </form>
  );
};
