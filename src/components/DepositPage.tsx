import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  QrCode,
  ArrowRight,
  ExternalLink,
  Coins
} from 'lucide-react';

interface DepositPageProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

export const DepositPage: React.FC<DepositPageProps> = ({ user, onUpdateUser }) => {
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const walletAddress = "TJEMQbShoVakT5dP7NBBpU5ALF7HNcv4dh";
  const network = "Tron (TRC20)";
  const minDeposit = 100;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) < minDeposit) {
      setStatus({ type: 'error', text: `Minimum deposit is $${minDeposit}` });
      return;
    }
    if (!txHash.trim()) {
      setStatus({ type: 'error', text: 'Please enter the transaction hash' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: Number(amount),
          txHash: txHash.trim(),
          network
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: 'success', text: 'Deposit confirmed! Your balance has been updated.' });
        setAmount('');
        setTxHash('');
        
        // Fetch updated user data
        const userRes = await fetch(`/api/user/${user.id}`);
        const userData = await userRes.json();
        if (userData) onUpdateUser(userData);
      } else {
        setStatus({ type: 'error', text: data.error || 'Failed to submit request' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Deposit Funds</h1>
          <p className="text-slate-400 mt-1 font-medium">Add capital to your grove using cryptocurrency.</p>
        </div>
        
        <div className="glass-dark px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
            <ShieldCheck className="w-5 h-5 text-brand" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Security Status</p>
            <p className="text-sm font-bold text-white">End-to-End Encrypted</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment Details */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-[40px] border border-white/10 p-8 lg:p-10 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center border border-brand/20 brand-glow">
                <QrCode className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Payment Address</h3>
                <p className="text-xs text-slate-500 font-medium">Send only USDT to this address via {network}.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network</span>
                  <span className="text-xs font-bold text-brand px-3 py-1 bg-brand/10 rounded-full border border-brand/20">{network}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Wallet Address</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-bg-dark/50 border border-white/5 rounded-2xl px-6 py-4 font-mono text-sm text-white break-all">
                      {walletAddress}
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="px-6 bg-brand/10 hover:bg-brand text-brand hover:text-bg-dark rounded-2xl transition-all border border-brand/20 flex items-center justify-center group"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-brand">
                    <Info className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Minimum Deposit</span>
                  </div>
                  <p className="text-xl font-bold text-white">${minDeposit}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Deposits below this amount will not be credited.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-brand">
                    <ExternalLink className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Confirmation</span>
                  </div>
                  <p className="text-xl font-bold text-white">~5-10 Mins</p>
                  <p className="text-[10px] text-slate-500 font-medium">Average time for network confirmation.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Important Warning</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sending any other cryptocurrency or using a different network (like ERC20 or BEP20) will result in permanent loss of funds. Always double-check before sending.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submission Form */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark rounded-[40px] border border-white/10 p-8 sticky top-8 space-y-8"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-white">Confirm Deposit</h3>
              <p className="text-xs text-slate-500 font-medium">Submit your transaction details for verification.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Amount Sent (USD)</label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-white focus:outline-none focus:border-brand/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Transaction Hash (TXID)</label>
                  <input 
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Enter TXID..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-mono text-white focus:outline-none focus:border-brand/50 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 ${
                    status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="text-xs font-bold">{status.text}</p>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-brand disabled:bg-slate-800 disabled:text-slate-500 text-bg-dark rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-brand/20 brand-glow flex items-center justify-center gap-2 group"
              >
                {submitting ? 'Verifying...' : (
                  <>
                    Submit for Verification
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed text-center">
                Our automated system will verify the transaction on the blockchain. Once confirmed, the balance will be added to your account.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
