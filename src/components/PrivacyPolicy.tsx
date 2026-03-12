import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-bg-dark text-slate-300 p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Registration</span>
        </button>
      )}

      <div className="space-y-4">
        <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center border border-brand/20 mb-6">
          <Shield className="w-8 h-8 text-brand" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 font-medium">Last updated: March 11, 2026</p>
      </div>

      <div className="glass-dark rounded-[40px] border border-white/5 p-8 lg:p-12 space-y-12 leading-relaxed">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white">
            <Eye className="w-5 h-5 text-brand" />
            <h2 className="text-xl font-bold">1. Information We Collect</h2>
          </div>
          <p>
            Bamboo Capital collects information to provide better services to all our cultivators. We collect information in the following ways:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Information you give us: Account details, profile information, and contact data.</li>
            <li>Information we get from your use of our services: Transaction history, node performance, and device information.</li>
            <li>Blockchain data: Public wallet addresses and transaction hashes related to your investments.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white">
            <Lock className="w-5 h-5 text-brand" />
            <h2 className="text-xl font-bold">2. How We Use Information</h2>
          </div>
          <p>
            We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect Bamboo Capital and our users.
          </p>
          <p>
            Specifically, we use your data to process your investments, calculate your daily yields, and maintain your cultivation streak. Your email is used for critical security alerts and account recovery.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white">
            <FileText className="w-5 h-5 text-brand" />
            <h2 className="text-xl font-bold">3. Information Security</h2>
          </div>
          <p>
            We work hard to protect Bamboo Capital and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.
          </p>
          <p>
            We restrict access to personal information to Bamboo Capital employees, contractors and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white">
            <Shield className="w-5 h-5 text-brand" />
            <h2 className="text-xl font-bold">4. Data Retention</h2>
          </div>
          <p>
            We store your data as long as your account is active. If you choose to delete your account via the Danger Zone in Settings, all your personal data will be permanently purged from our active databases within 30 days.
          </p>
        </section>
      </div>

      <footer className="pt-10 border-t border-white/5 text-center">
        <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">
          &copy; 2026 Bamboo Capital Ecosystem • Secure & Transparent
        </p>
      </footer>
    </div>
  );
};
