import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ShieldCheck,
  Info,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';

interface WithdrawPageProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({ user, onUpdateUser }) => {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [investments, setInvestments] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<{ isEligible: boolean, reason: string, nextUnlockDate: Date | null }>({
    isEligible: false,
    reason: 'Checking eligibility...',
    nextUnlockDate: null
  });

  useEffect(() => {
    fetchInvestments();
  }, [user.id]);

  const fetchInvestments = async () => {
    try {
      const res = await fetch(`/api/investments/${user.id}`);
      const data = await res.json();
      setInvestments(data);
      checkEligibility(data);
    } catch (err) {
      console.error("Failed to fetch investments", err);
    }
  };

  const checkEligibility = (invs: any[]) => {
    if (invs.length === 0) {
      setEligibility({
        isEligible: false,
        reason: 'You must have at least one completed investment cycle to withdraw.',
        nextUnlockDate: null
      });
      return;
    }

    const now = new Date();
    const completedInvs = invs.filter(inv => {
      const endDate = inv.endDate?.seconds ? new Date(inv.endDate.seconds * 1000) : new Date(inv.endDate);
      return endDate <= now;
    });

    if (completedInvs.length > 0) {
      setEligibility({
        isEligible: true,
        reason: 'Your investment cycle has finished. You are eligible for withdrawal.',
        nextUnlockDate: null
      });
    } else {
      // Find the one that finishes soonest
      const upcoming = [...invs].sort((a, b) => {
        const dateA = a.endDate?.seconds ? a.endDate.seconds * 1000 : new Date(a.endDate).getTime();
        const dateB = b.endDate?.seconds ? b.endDate.seconds * 1000 : new Date(b.endDate).getTime();
        return dateA - dateB;
      });
      
      const nextDate = upcoming[0].endDate?.seconds ? new Date(upcoming[0].endDate.seconds * 1000) : new Date(upcoming[0].endDate);
      
      setEligibility({
        isEligible: false,
        reason: `Your current investment cycle is still active. Withdrawal will be available after ${nextDate.toLocaleDateString()}.`,
        nextUnlockDate: nextDate
      });
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.isEligible) return;
    
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setStatus({ type: 'error', text: 'Please enter a valid amount.' });
      return;
    }

    if (withdrawAmount > user.balance) {
      setStatus({ type: 'error', text: 'Insufficient balance.' });
      return;
    }

    if (withdrawAmount < 50) {
      setStatus({ type: 'error', text: 'Minimum withdrawal is $50.' });
      return;
    }

    if (!walletAddress.startsWith('T') || walletAddress.length < 30) {
      setStatus({ type: 'error', text: 'Please enter a valid TRC20 wallet address.' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, text: '' });

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: withdrawAmount,
          walletAddress,
          network: 'TRC20'
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: 'success', text: 'Withdrawal request submitted! It will be processed within 24 hours.' });
        setAmount('');
        setWalletAddress('');
        
        // Update user balance locally
        const userRes = await fetch(`/api/user/${user.id}`);
        const userData = await userRes.json();
        if (userData) onUpdateUser(userData);
      } else {
        setStatus({ type: 'error', text: data.error || 'Failed to process withdrawal.' });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Withdraw Funds</h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium">Transfer your earnings to your external TRC20 wallet.</p>
          </div>
          
          <div className="glass-dark px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
              <Wallet className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Balance</p>
              <p className="text-lg sm:text-xl font-bold text-white">${user.balance?.toLocaleString() || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Eligibility Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border flex flex-col md:flex-row items-center gap-4 sm:gap-6 ${
            eligibility.isEligible 
              ? 'bg-brand/5 border-brand/20' 
              : 'bg-orange-500/5 border-orange-500/20'
          }`}
        >
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
            eligibility.isEligible ? 'bg-brand/10' : 'bg-orange-500/10'
          }`}>
            {eligibility.isEligible ? (
              <Unlock className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            ) : (
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            )}
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h3 className={`text-base sm:text-lg font-bold ${eligibility.isEligible ? 'text-brand' : 'text-orange-500'}`}>
              {eligibility.isEligible ? 'Withdrawal Unlocked' : 'Withdrawal Locked'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              {eligibility.reason}
            </p>
          </div>
          {!eligibility.isEligible && eligibility.nextUnlockDate && (
            <div className="ml-auto bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/5">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unlock Date</p>
              <p className="text-xs sm:text-sm font-bold text-white">{eligibility.nextUnlockDate.toLocaleDateString()}</p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark rounded-[24px] sm:rounded-[40px] border border-white/5 p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8"
            >
              <form onSubmit={handleWithdraw} className="space-y-6 sm:space-y-8">
                <div className="space-y-5 sm:space-y-6">
                  <div className="space-y-3">
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Withdrawal Amount (USD)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={!eligibility.isEligible || loading}
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-white text-lg sm:text-xl font-bold focus:outline-none focus:border-brand/50 transition-colors disabled:opacity-50"
                      />
                      <button 
                        type="button"
                        onClick={() => setAmount(user.balance.toString())}
                        className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-bold text-brand uppercase tracking-widest hover:underline"
                      >
                        Max
                      </button>
                    </div>
                    <div className="flex justify-between px-1">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Min: $50.00</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fee: $1.00</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">TRC20 Wallet Address</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="T..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        disabled={!eligibility.isEligible || loading}
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-brand/50 transition-colors disabled:opacity-50"
                      />
                      <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                      </div>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ensure this is a TRON (TRC20) network address.</p>
                  </div>
                </div>

                {status.text && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 ${
                      status.type === 'success' ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-xs font-bold uppercase tracking-widest">{status.text}</p>
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={!eligibility.isEligible || loading || !amount || !walletAddress}
                  className="w-full bg-brand text-bg-dark py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-brand/20 brand-glow disabled:opacity-50 disabled:brand-glow-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      Confirm Withdrawal
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark rounded-[32px] border border-white/5 p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-brand" />
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Withdrawal Rules</h4>
              </div>
              
              <ul className="space-y-4">
                {[
                  { label: 'Network', value: 'TRON (TRC20)' },
                  { label: 'Minimum', value: '$50.00' },
                  { label: 'Processing', value: '12-24 Hours' },
                  { label: 'Service Fee', value: '$1.00' }
                ].map((rule, i) => (
                  <li key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{rule.label}</span>
                    <span className="text-xs font-bold text-white">{rule.value}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Withdrawals are only enabled after at least one investment cycle has been successfully completed. This ensures ecosystem stability and security.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-dark rounded-[32px] border border-white/5 p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand" />
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Recent Activity</h4>
              </div>
              
              <div className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No recent withdrawals</p>
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                View Transaction History
                <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
