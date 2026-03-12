import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Gift, 
  ArrowUpRight, 
  Copy, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  Leaf,
  Clock
} from 'lucide-react';

interface ReferralsPageProps {
  user: any;
}

export const ReferralsPage: React.FC<ReferralsPageProps> = ({ user }) => {
  const [stats, setStats] = React.useState({
    totalReferrals: 0,
    totalEarned: 0,
    referrals: [] as any[]
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/referral-stats/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch referral stats", err);
        setLoading(false);
      });
  }, [user.id]);

  const referralStats = [
    { label: 'Total Referrals', value: stats.totalReferrals.toString(), icon: Users, color: 'text-brand' },
    { label: 'Pending Rewards', value: '$0.00', icon: Clock, color: 'text-slate-400' },
    { label: 'Active Boost', value: '0%', icon: Zap, color: 'text-orange-500' },
    { label: 'Total Earned', value: `$${stats.totalEarned.toFixed(2)}`, icon: Gift, color: 'text-brand' }
  ];

  const referralHistory = stats.referrals.length > 0 ? stats.referrals : [
    { name: 'No referrals yet', date: 'Start inviting to earn rewards', status: 'Pending' }
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 sm:space-y-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0a1a14] via-[#050b09] to-[#020617] p-6 sm:p-10 lg:p-14 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand/10 border border-brand/20">
                <Leaf className="w-3.5 h-3.5 sm:w-4 h-4 text-brand" />
                <span className="text-[9px] sm:text-[10px] font-bold text-brand uppercase tracking-[0.2em]">Referral Program</span>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tighter text-white leading-[0.9]">
                  Grow Your Grove, <br />
                  <span className="text-brand italic">Earn Together.</span>
                </h1>
                <p className="text-slate-400 max-w-md text-sm sm:text-lg font-medium leading-relaxed">
                  Invite your friends to Bamboo Capital. When they join using your code, you'll receive a $6 bonus and they'll get $5 instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between group hover:bg-white/10 transition-all">
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Your Referral Code</p>
                    <p className="text-lg sm:text-xl font-mono font-bold text-brand tracking-widest">{user.my_referral_code || "REF-XXXX"}</p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(user.my_referral_code || "");
                      const btn = document.activeElement as HTMLButtonElement;
                      if (btn) {
                        const originalContent = btn.innerHTML;
                        btn.innerHTML = '<span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Copied!</span>';
                        setTimeout(() => {
                          btn.innerHTML = originalContent;
                        }, 2000);
                      }
                    }}
                    className="p-2 sm:p-3 bg-brand/10 rounded-lg sm:rounded-xl text-brand hover:bg-brand hover:text-bg-dark transition-all min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    const link = `${window.location.origin}?ref=${user.my_referral_code}`;
                    navigator.clipboard.writeText(link);
                    const btn = document.activeElement as HTMLButtonElement;
                    if (btn) {
                      const originalContent = btn.innerHTML;
                      btn.innerHTML = '<span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Link Copied!</span>';
                      setTimeout(() => {
                        btn.innerHTML = originalContent;
                      }, 2000);
                    }
                  }}
                  className="bg-brand text-bg-dark px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-brand/20 brand-glow flex items-center justify-center gap-2"
                >
                  Share Link
                </button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-brand/20 blur-[100px] rounded-full" />
              <div className="relative glass-dark rounded-[48px] p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center brand-glow">
                    <Gift className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Current Reward Tier</p>
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Tier 1: Sprout</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Next Tier Progress</span>
                    <span>0 / 5 Referrals</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand w-0" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Reach 5 referrals to unlock <span className="text-white font-bold">Tier 2: Sapling</span> and increase your yield boost to 2.5%.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Total Referrals', value: '0', icon: Users, color: 'text-brand' },
            { label: 'Pending Rewards', value: '$0.00', icon: Clock, color: 'text-slate-400' },
            { label: 'Active Boost', value: '0%', icon: Zap, color: 'text-orange-500' },
            { label: 'Total Earned', value: '$0.00', icon: Gift, color: 'text-brand' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-white/5 space-y-3 sm:space-y-4 hover:border-brand/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <stat.icon className={`w-3.5 h-3.5 sm:w-4 h-4 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-white/5">
                <TrendingUp className="w-3 h-3 text-brand" />
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Season Performance</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Referral History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-dark rounded-[24px] sm:rounded-[40px] border border-white/5 overflow-hidden"
        >
          <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Referral History</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {referralHistory.map((ref, i) => (
              <div key={i} className="p-6 sm:p-8 flex items-center gap-4 sm:gap-6 hover:bg-white/[0.02] transition-colors group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 group-hover:brand-glow transition-all">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 group-hover:text-brand" />
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-bold text-white">{ref.name}</p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{ref.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold text-slate-400">{ref.status}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ecosystem Guardian */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4 py-10"
        >
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <ShieldCheck className="w-8 h-8 text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Ecosystem Guardian</p>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Referral integrity verified</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
