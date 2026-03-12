import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">Last updated: March 11, 2026</p>
      </div>

      <div className="glass-dark rounded-[24px] sm:rounded-[40px] border border-white/5 p-6 sm:p-8 lg:p-12 space-y-8 sm:space-y-12 leading-relaxed text-sm sm:text-base">
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">1. Information We Collect</h2>
          </div>
          <p className="text-slate-400">
            Bamboo Capital collects information to provide better services to all our cultivators. We collect information in the following ways:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-slate-400">
            <li>Information you give us: Account details, profile information, and contact data.</li>
            <li>Information we get from your use of our services: Transaction history, node performance, and device information.</li>
            <li>Blockchain data: Public wallet addresses and transaction hashes related to your investments.</li>
          </ul>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">2. How We Use Information</h2>
          </div>
          <p className="text-slate-400">
            We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect Bamboo Capital and our users.
          </p>
          <p className="text-slate-400">
            Specifically, we use your data to process your investments, calculate your daily yields, and maintain your cultivation streak. Your email is used for critical security alerts and account recovery.
          </p>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">3. Information Security</h2>
          </div>
          <p className="text-slate-400">
            We work hard to protect Bamboo Capital and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.
          </p>
          <p className="text-slate-400">
            We restrict access to personal information to Bamboo Capital employees, contractors and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations.
          </p>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            <h2 className="text-lg sm:text-xl font-bold">4. Data Retention</h2>
          </div>
          <p className="text-slate-400">
            We store your data as long as your account is active. If you choose to delete your account via the Danger Zone in Settings, all your personal data will be permanently purged from our active databases within 30 days.
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
