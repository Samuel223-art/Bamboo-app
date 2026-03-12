import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp,
  Leaf,
  Package,
  Cpu,
  Zap,
  Users,
  Trophy,
  ChevronDown,
  MoreHorizontal,
  Shield,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface DashboardProps {
  user: any;
  onTabChange: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onTabChange }) => {
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
  const hourlyYield = dailyYield / 24;

  const ranks = [
    { name: 'Seedling', level: 1, minNodes: 0 },
    { name: 'Sprout', level: 2, minNodes: 3 },
    { name: 'Stalk', level: 3, minNodes: 7 },
    { name: 'Grove Keeper', level: 4, minNodes: 15 },
    { name: 'Bamboo Master', level: 5, minNodes: 30 },
  ];

  const currentRankIndex = ranks.findIndex((r, i) => activeNodes >= r.minNodes && (i === ranks.length - 1 || activeNodes < ranks[i+1].minNodes));
  const currentRank = ranks[currentRankIndex];

  // Generate dynamic projection data (last 7 days cumulative growth %)
  const dynamicProjectionData = Array.from({ length: 8 }, (_, i) => {
    const day = i;
    const totalGrowth = dailyYield * day;
    const percentage = user.balance > 0 ? (totalGrowth / user.balance) * 100 : 0;
    return {
      name: day === 0 ? 'Start' : `Day ${day}`,
      percentage: parseFloat(percentage.toFixed(2))
    };
  });

  // Generate dynamic velocity data (last 5 hours)
  const dynamicVelocityData = Array.from({ length: 5 }, (_, i) => {
    // Show the hourly yield with a tiny bit of noise for visual flair
    const noise = (Math.random() - 0.5) * (hourlyYield * 0.02); 
    return {
      name: i === 4 ? 'Now' : `-${4-i}h`,
      value: parseFloat((hourlyYield + noise).toFixed(4))
    };
  });

  const displayedInvestments = investments.slice(0, 3);

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Top Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0a1a14] via-[#050b09] to-[#020617] p-6 sm:p-10 lg:p-12 shadow-2xl"
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10 space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20">
                  <Leaf className="w-4 h-4 text-brand" />
                  <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">Bamboo Prime Yield</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Total Harvest Value</p>
                  <div className="flex items-baseline gap-1">
                    <h1 className="text-4xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-white">
                      ${user.balance?.toLocaleString() || "0"}
                    </h1>
                    <span className="text-xl sm:text-3xl font-display font-bold text-slate-600">.00</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-display font-bold text-white">{Math.floor(dailyYield * 10)}</p>
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">Impact Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-display font-bold text-white">
                        {user.isVerified ? `Tier ${currentRank.level}` : 'Unverified'}
                      </p>
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">{currentRank.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-auto min-w-[240px] sm:min-w-[280px]">
                <button 
                  onClick={() => onTabChange('deposit')}
                  className="w-full bg-white text-bg-dark py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  Deposit Funds
                </button>
                <button 
                  onClick={() => onTabChange('withdraw')}
                  className="w-full glass-dark border border-white/10 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4 text-brand" />
                  Withdraw Funds
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Nodes', value: activeNodes.toString(), icon: Cpu, color: 'text-brand' },
            { label: 'Daily Yield', value: `$${dailyYield.toFixed(2)}`, icon: Zap, color: 'text-yellow-500' },
            { label: 'Referral Bonus', value: '$0.00', icon: Users, color: 'text-blue-500' },
            { label: 'Active Streak', value: `${user.streak || 0} Days`, icon: Trophy, color: 'text-rose-500' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-white/10 space-y-4 sm:space-y-6 group hover:border-brand/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20">
                  <TrendingUp className="w-3 h-3 text-brand" />
                  <span className="text-[9px] font-bold text-brand">{(activeNodes * 0.5).toFixed(1)}%</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Season Velocity</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Investments List */}
        {investments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-[24px] sm:rounded-[40px] border border-white/10 overflow-hidden"
          >
            <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg sm:text-xl text-white">Active Grove Investments</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 border border-brand/10">
                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                <span className="text-[8px] sm:text-[9px] font-bold text-brand uppercase tracking-widest">Harvesting</span>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {displayedInvestments.map((inv, i) => (
                <div key={i} className="p-6 sm:p-8 flex flex-wrap items-center gap-4 sm:gap-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-brand/20 group-hover:brand-glow transition-all">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                  </div>
                  <div className="flex-1 min-w-[160px] sm:min-w-[200px]">
                    <p className="font-bold text-white text-base sm:text-lg">{inv.productName}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      Started: {inv.startDate?.seconds ? new Date(inv.startDate.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Invested</p>
                      <p className="text-xs sm:text-sm font-bold text-white">${inv.amount}</p>
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Daily Yield</p>
                      <p className="text-xs sm:text-sm font-bold text-brand">{inv.dailyYield}%</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Proj. Return</p>
                      <p className="text-xs sm:text-sm font-bold text-white">${inv.totalProjectedReturn.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {investments.length > 3 && (
              <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
                <button 
                  onClick={() => onTabChange('trades')}
                  className="px-8 py-3 rounded-xl bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Show More Investments
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Growth Projection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 border border-white/10 space-y-6 sm:space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-brand rounded-full" />
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">Growth Projection</h3>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-bold text-brand uppercase tracking-widest">
                Cumulative %
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicProjectionData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    formatter={(value: any) => [`${value}%`, 'Growth']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Asset Velocity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 border border-white/10 space-y-6 sm:space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-brand rounded-full" />
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">Asset Velocity</h3>
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-lg border border-brand/20">
                ${hourlyYield.toFixed(4)} / hr
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicVelocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    formatter={(value: any) => [`$${value}`, 'Hourly Yield']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
