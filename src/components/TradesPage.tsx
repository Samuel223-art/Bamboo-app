import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeftRight, 
  Leaf, 
  TrendingUp, 
  Clock, 
  Calendar,
  Wallet,
  CheckCircle2,
  Timer
} from 'lucide-react';

interface Investment {
  id: string;
  productName: string;
  amount: number;
  dailyYield: number;
  durationDays: number;
  status: string;
  startDate: any;
  endDate: any;
  lastClaimDate?: any;
  totalProjectedReturn: number;
}

interface TradesPageProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

export const TradesPage: React.FC<TradesPageProps> = ({ user, onUpdateUser }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const fetchInvestments = () => {
    fetch(`/api/investments/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setInvestments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch investments", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInvestments();
  }, [user.id]);

  const calculateStats = (inv: Investment) => {
    if (!inv.startDate) return { earned: 0, remainingDays: inv.durationDays, progress: 0 };
    
    const start = inv.startDate.seconds ? inv.startDate.seconds * 1000 : Date.now();
    const lastClaim = inv.lastClaimDate?.seconds ? inv.lastClaimDate.seconds * 1000 : start;
    const now = Date.now();
    
    const diffMs = now - start;
    const diffDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
    
    // Earned since last claim
    const diffMsSinceClaim = now - lastClaim;
    const diffDaysSinceClaim = Math.max(0, diffMsSinceClaim / (1000 * 60 * 60 * 24));
    const claimableDays = Math.min(diffDaysSinceClaim, Math.max(0, inv.durationDays - (diffDays - diffDaysSinceClaim)));
    
    const earned = (inv.amount * inv.dailyYield * Math.min(diffDays, inv.durationDays)) / 100;
    const claimable = (inv.amount * inv.dailyYield * claimableDays) / 100;
    const remainingDays = Math.max(0, Math.ceil(inv.durationDays - diffDays));
    const progress = Math.min(100, (diffDays / inv.durationDays) * 100);
    
    return { earned, claimable, remainingDays, progress };
  };

  const handleClaim = async (investmentId: string) => {
    setClaiming(investmentId);
    try {
      const res = await fetch('/api/claim-earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, investmentId })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateUser({ ...user, balance: data.newBalance });
        fetchInvestments();
      } else {
        alert(data.error || "Failed to claim");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalEarned = investments.reduce((acc, inv) => acc + calculateStats(inv).earned, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">My Active Trades</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">Monitor your growing portfolio and harvest cycles.</p>
        </div>
        
        <div className="glass-dark p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-white/10 flex items-center gap-4 sm:gap-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-brand/20 brand-glow">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Accrued Profit</p>
            <p className="text-xl sm:text-2xl font-display font-bold text-white">${totalEarned.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {investments.length === 0 ? (
        <div className="glass-dark rounded-[40px] border border-white/10 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10 mx-auto">
            <ArrowLeftRight className="w-10 h-10 text-slate-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-bold text-white">No Active Trades</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm">You haven't planted any investments yet. Visit the Grove to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {investments.map((inv, i) => {
            const { earned, remainingDays, progress } = calculateStats(inv);
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-[24px] sm:rounded-[32px] border border-white/5 p-6 sm:p-8 relative overflow-hidden group hover:border-brand/30 transition-all"
              >
                <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Leaf className="w-24 h-24 sm:w-32 sm:h-32" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 relative z-10">
                  <div className="flex items-center gap-4 sm:gap-6 min-w-[200px] sm:min-w-[240px]">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-brand/20 brand-glow">
                      <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-white">{inv.productName}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          ID: {inv.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-brand uppercase tracking-widest">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1">
                    <div className="space-y-1">
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">Invested</p>
                      <p className="text-base sm:text-lg font-bold text-white">${inv.amount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">Daily Yield</p>
                      <p className="text-base sm:text-lg font-bold text-brand">{inv.dailyYield}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">Claimable</p>
                      <p className="text-base sm:text-lg font-bold text-emerald-500">${calculateStats(inv).claimable.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">Remaining</p>
                      <p className="text-base sm:text-lg font-bold text-white">{calculateStats(inv).remainingDays} Days</p>
                    </div>
                  </div>

                  <div className="min-w-[120px]">
                    <button 
                      onClick={() => handleClaim(inv.id)}
                      disabled={claiming === inv.id || calculateStats(inv).claimable < 0.01}
                      className="w-full py-3 bg-brand/10 hover:bg-brand text-brand hover:text-bg-dark rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {claiming === inv.id ? 'Claiming...' : 'Claim Yield'}
                    </button>
                  </div>
                </div>

                <div className="mt-8 space-y-3 relative z-10">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Harvest Progress</span>
                    </div>
                    <span className="text-[10px] font-bold text-brand uppercase tracking-widest">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-brand/50 to-brand shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Cycle: {inv.durationDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Total: ${inv.totalProjectedReturn.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Verified Harvest</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
