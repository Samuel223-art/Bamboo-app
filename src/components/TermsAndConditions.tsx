import React from 'react';
import { motion } from 'motion/react';
import { FileText, Shield, Zap, AlertTriangle, ArrowLeft } from 'lucide-react';

interface TermsAndConditionsProps {
  onBack?: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-bg-dark text-slate-300 p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto space-y-6 sm:space-y-10">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Back to Registration</span>
        </button>
      )}

      <div className="space-y-3 sm:space-y-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-brand/20 mb-4 sm:mb-6">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Terms & Conditions</h1>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">Last updated: March 11, 2026</p>
      </div>

      <div className="glass-dark rounded-[24px] sm:rounded-[40px] border border-white/5 p-6 sm:p-8 lg:p-12 space-y-8 sm:space-y-12 leading-relaxed text-sm sm:text-base">
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">1. Agreement to Terms</h2>
          </div>
          <p className="text-slate-400">
            By accessing or using Bamboo Capital, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the service.
          </p>
          <p className="text-slate-400">
            Bamboo Capital is a decentralized ecosystem for specialized node cultivation. You are responsible for maintaining the security of your account and any activities that occur under your account.
          </p>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">2. Investment & Yields</h2>
          </div>
          <p className="text-slate-400">
            Investments in Bamboo Capital nodes are made using TRON (TRX) or USDT. Yields are calculated daily based on the node's performance and your current rank.
          </p>
          <p className="text-slate-400">
            Please note that all investments carry risk. While we strive for consistent yields, market conditions can affect the ecosystem's performance. Past performance is not indicative of future results.
          </p>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">3. Prohibited Activities</h2>
          </div>
          <p className="text-slate-400">
            You agree not to use Bamboo Capital for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-slate-400">
            <li>Attempting to gain unauthorized access to any part of the service.</li>
            <li>Using automated systems or software to extract data (scraping).</li>
            <li>Engaging in any activity that interferes with or disrupts the ecosystem's functionality.</li>
            <li>Creating multiple accounts to exploit referral bonuses or streak rewards.</li>
          </ul>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">4. Termination</h2>
          </div>
          <p className="text-slate-400">
            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="text-slate-400">
            Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service.
          </p>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">5. Limitation of Liability</h2>
          </div>
          <p className="text-slate-400">
            In no event shall Bamboo Capital, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>
      </div>

      <footer className="pt-6 sm:pt-10 border-t border-white/5 text-center">
        <p className="text-[9px] sm:text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">
          &copy; 2026 Bamboo Capital Ecosystem • Secure & Transparent
        </p>
      </footer>
    </div>
  );
};
