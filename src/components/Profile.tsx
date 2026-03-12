import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  BarChart3, 
  CheckCircle2, 
  Camera,
  Activity,
  Clock,
  Cpu,
  Zap,
  Gift,
  ShieldCheck,
  Leaf
} from 'lucide-react';

interface ProfileProps {
  user: any;
  onTabChange?: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onTabChange }) => {
  const [investments, setInvestments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
  }, [user.id]);

  const activeNodes = investments.filter(inv => inv.status === 'active').length;
  const dailyYield = investments.reduce((acc, inv) => acc + (inv.amount * inv.dailyYield / 100), 0);

  const ranks = [
    { name: 'Seedling', level: 1, minNodes: 0 },
    { name: 'Sprout', level: 2, minNodes: 3 },
    { name: 'Stalk', level: 3, minNodes: 7 },
    { name: 'Grove Keeper', level: 4, minNodes: 15 },
    { name: 'Bamboo Master', level: 5, minNodes: 30 },
  ];

  const currentRankIndex = ranks.findIndex((r, i) => activeNodes >= r.minNodes && (i === ranks.length - 1 || activeNodes < ranks[i+1].minNodes));
  const currentRank = ranks[currentRankIndex];
  
  // Calculate days since joining (mocking for now based on user.createdAt or just 1 if not available)
  const daysSinceJoining = user.createdAt ? Math.max(1, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))) : 1;

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0a1a14] via-[#050b09] to-[#020617] p-10 lg:p-12 shadow-2xl flex flex-col items-center text-center space-y-8"
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-brand/20 p-1 bg-slate-900 shadow-2xl shadow-brand/20">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar || user.name || "Samuel"}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full bg-slate-800"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => onTabChange?.('settings')}
                className="absolute bottom-0 right-0 w-10 h-10 bg-brand rounded-full flex items-center justify-center border-4 border-[#050b09] hover:scale-110 transition-transform shadow-lg"
              >
                <Camera className="w-5 h-5 text-bg-dark" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-5xl font-display font-bold text-white tracking-tight">{user.name || "Samuel"}</h1>
                {user.isVerified && <CheckCircle2 className="w-7 h-7 text-brand fill-brand/10" />}
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span className="px-4 py-1.5 rounded-lg bg-brand/10 text-brand border border-brand/20 text-[10px] font-bold uppercase tracking-widest">
                  {user.isVerified ? `Level ${currentRank.level}: ${currentRank.name}` : 'Account Unverified'}
                </span>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>ID: {user.id?.substring(0, 8).toUpperCase() || "B9TCZNVP"}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md pt-4">
              <button 
                onClick={() => onTabChange?.('settings')}
                className="flex-1 glass-dark border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
              >
                <SettingsIcon className="w-4 h-4 text-brand" />
                Settings
              </button>
              <button 
                onClick={() => onTabChange?.('rank-progress')}
                className="flex-1 glass-dark border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
              >
                <Activity className="w-4 h-4 text-brand" />
                Rank Up Progress
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Harvest Balance', value: `$${user.balance?.toLocaleString() || '0'}`, sub: 'Real-time valuation', icon: Activity, color: 'text-brand' },
            { label: 'Earnings Today', value: `+$${dailyYield.toFixed(2)}`, sub: 'Updated daily', icon: Clock, color: 'text-slate-400' },
            { label: 'Active Streak', value: `${user.streak || 0} Days`, sub: 'Daily harvest active', icon: Zap, color: 'text-orange-500' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-[32px] p-8 border border-white/5 space-y-4 hover:border-brand/20 transition-all group"
            >
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-4xl font-display font-bold text-white tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cultivation Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-dark rounded-[40px] p-10 lg:p-12 border border-white/5 space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
            <Leaf className="w-64 h-64 text-brand" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl font-display font-bold text-white">Cultivation Summary</h2>
            <p className="text-slate-400 leading-relaxed font-medium text-lg max-w-2xl">
              Your journey in the Bamboo ecosystem began <span className="text-brand">{daysSinceJoining} days ago</span>. Since then, you've deployed <span className="text-white font-bold">{activeNodes} specialized nodes</span>. Your commitment to the daily harvest has maintained a streak of <span className="text-white font-bold">{user.streak || 0} days</span>, securing your position as a top-tier cultivator.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Rank</p>
                <p className="text-2xl font-display font-bold text-white">NAN</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact Score</p>
                <p className="text-2xl font-display font-bold text-brand">{(dailyYield * 10).toFixed(1)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ecosystem Share</p>
                <p className="text-2xl font-display font-bold text-white">{(activeNodes * 0.001).toFixed(3)}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referral Sprout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0a1a14] to-[#020617] p-10 text-center space-y-8"
        >
          <div className="w-16 h-16 bg-brand/20 rounded-2xl flex items-center justify-center mx-auto brand-glow border border-brand/20">
            <Gift className="w-8 h-8 text-brand" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-display font-bold text-white">Referral Sprout</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Invite a friend to join Bamboo Capital using your referral code. You'll receive a $6 bonus, and they'll get a $5 welcome bonus immediately!
            </p>
          </div>
          <button 
            onClick={() => onTabChange?.('referrals')}
            className="w-full bg-brand text-bg-dark py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-brand/20 brand-glow"
          >
            Invite Cultivators
          </button>
        </motion.div>

        {/* Ecosystem Guardian */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 py-10"
        >
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <ShieldCheck className="w-8 h-8 text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Ecosystem Guardian</p>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Secure connection verified</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
