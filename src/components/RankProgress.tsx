import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Shield, 
  Star, 
  Zap,
  ArrowRight,
  ChevronRight,
  Lock
} from 'lucide-react';

interface RankProgressProps {
  user: any;
  investments: any[];
}

export const RankProgress: React.FC<RankProgressProps> = ({ user, investments }) => {
  const ranks = [
    { name: 'Seedling', level: 1, minNodes: 0, bonus: '0%', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Sprout', level: 2, minNodes: 3, bonus: '2%', color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'Stalk', level: 3, minNodes: 7, bonus: '5%', color: 'text-lime-400', bg: 'bg-lime-400/10' },
    { name: 'Grove Keeper', level: 4, minNodes: 15, bonus: '10%', color: 'text-brand', bg: 'bg-brand/10' },
    { name: 'Bamboo Master', level: 5, minNodes: 30, bonus: '20%', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  const activeNodes = investments.filter(inv => inv.status === 'active').length;
  const currentRankIndex = ranks.findIndex((r, i) => activeNodes >= r.minNodes && (i === ranks.length - 1 || activeNodes < ranks[i+1].minNodes));
  const nextRank = ranks[currentRankIndex + 1];
  const progress = nextRank ? (activeNodes / nextRank.minNodes) * 100 : 100;

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Rank Up Progress</h1>
          <p className="text-slate-400 mt-1 font-medium">Climb the ecosystem hierarchy to unlock exclusive bonuses.</p>
        </div>
        
        <div className="glass-dark px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
            <Trophy className="w-5 h-5 text-brand" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Rank</p>
            <p className="text-sm font-bold text-white">{ranks[currentRankIndex].name}</p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-[40px] border border-white/10 p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
          <Target className="w-64 h-64 text-brand" />
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-lg ${ranks[currentRankIndex].bg} ${ranks[currentRankIndex].color} text-[10px] font-bold uppercase tracking-widest border border-current/20`}>
                  Level {ranks[currentRankIndex].level}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                {nextRank && (
                  <span className={`px-4 py-1.5 rounded-lg ${nextRank.bg} ${nextRank.color} text-[10px] font-bold uppercase tracking-widest border border-current/20 opacity-50`}>
                    Level {nextRank.level}
                  </span>
                )}
              </div>
              <h2 className="text-4xl font-display font-bold text-white">
                {nextRank ? `Next Rank: ${nextRank.name}` : 'Maximum Rank Achieved'}
              </h2>
            </div>
            
            <div className="text-right space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nodes Required</p>
              <p className="text-3xl font-display font-bold text-white">
                {activeNodes} <span className="text-slate-600 text-xl">/ {nextRank ? nextRank.minNodes : ranks[currentRankIndex].minNodes}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-brand/50 to-brand rounded-full brand-glow"
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
              <span>{ranks[currentRankIndex].name}</span>
              <span>{nextRank ? nextRank.name : 'Master'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
              <TrendingUp className="w-5 h-5 text-brand" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yield Bonus</p>
              <p className="text-xl font-bold text-white">+{ranks[currentRankIndex].bonus}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
              <Shield className="w-5 h-5 text-brand" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Governance</p>
              <p className="text-xl font-bold text-white">{ranks[currentRankIndex].level >= 4 ? 'Unlocked' : 'Locked'}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
              <Star className="w-5 h-5 text-brand" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exclusive Pools</p>
              <p className="text-xl font-bold text-white">{ranks[currentRankIndex].level >= 3 ? 'Available' : 'Locked'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rank List */}
      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold text-white px-2">Ecosystem Hierarchy</h3>
        <div className="grid grid-cols-1 gap-4">
          {ranks.map((rank, i) => {
            const isCurrent = i === currentRankIndex;
            const isLocked = i > currentRankIndex;

            return (
              <motion.div 
                key={rank.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group flex items-center justify-between p-6 rounded-[32px] border transition-all ${
                  isCurrent 
                    ? 'bg-brand/10 border-brand/30 shadow-lg shadow-brand/5' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    isCurrent ? 'bg-brand/20 border-brand/30' : 'bg-white/5 border-white/10'
                  }`}>
                    {isLocked ? <Lock className="w-6 h-6 text-slate-600" /> : <Zap className={`w-6 h-6 ${rank.color}`} />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className={`text-lg font-bold ${isLocked ? 'text-slate-500' : 'text-white'}`}>{rank.name}</h4>
                      {isCurrent && <span className="text-[10px] font-bold text-brand uppercase tracking-widest bg-brand/10 px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Requires {rank.minNodes} active nodes • {rank.bonus} yield bonus</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level</p>
                    <p className={`text-lg font-bold ${isLocked ? 'text-slate-600' : 'text-white'}`}>{rank.level}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${isLocked ? 'text-slate-700' : 'text-slate-400'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
