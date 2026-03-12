import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Ticket } from 'lucide-react';
import { Input } from './Input';

interface RegisterFormProps {
  onToggle: () => void;
  onSuccess: (user: any) => void;
  onViewPolicy?: (type: 'privacy' | 'terms') => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle, onSuccess, onViewPolicy }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('You must accept the terms and conditions to continue.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data.user);
      } else {
        setError(data.error || 'Registration failed');
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
          label="Full Name"
          type="text"
          placeholder="John Doe"
          required
          icon={<User className="w-4 h-4" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          required
          icon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          icon={<Lock className="w-4 h-4" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Input
          label="Referral Code (Optional)"
          type="text"
          placeholder="AURUM-2026"
          icon={<Ticket className="w-4 h-4" />}
          value={formData.referralCode}
          onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
        />

        <div className="flex items-start gap-3 px-1">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand focus:ring-brand focus:ring-offset-bg-dark transition-all cursor-pointer"
            />
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            I agree to the{' '}
            <button 
              type="button" 
              onClick={() => onViewPolicy?.('terms')}
              className="text-brand hover:underline"
            >
              Terms & Conditions
            </button>
            {' '}and{' '}
            <button 
              type="button" 
              onClick={() => onViewPolicy?.('privacy')}
              className="text-brand hover:underline"
            >
              Privacy Policy
            </button>
          </div>
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
            Create Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="pt-4 border-t border-white/5">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-brand hover:text-white transition-colors ml-2"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};
