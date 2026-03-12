import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Leaf, 
  Droplets, 
  Wind, 
  Sun, 
  Globe, 
  Trees, 
  Sprout,
  Cpu,
  Shield,
  TrendingUp,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck,
  BarChart3,
  Coins
} from 'lucide-react';
import { Product } from '../constants/products';

interface ProductDetailPageProps {
  product: Product;
  user: any;
  onBack: () => void;
  onUpdateUser: (user: any) => void;
}

const iconMap: Record<string, any> = {
  Leaf, Zap, Droplets, Wind, Sun, Globe, Trees, Sprout, Cpu, Shield
};

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, user, onBack, onUpdateUser }) => {
  const [investAmount, setInvestAmount] = useState<number>(product.minAmount);
  const [investing, setInvesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const Icon = iconMap[product.icon] || Leaf;

  const handleInvest = async () => {
    if (investAmount < product.minAmount) return;
    
    setInvesting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          amount: investAmount
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Investment successful!' });
        onUpdateUser({ ...user, balance: data.newBalance });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to invest' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setInvesting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Grove</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Info */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-[40px] border border-white/10 p-10 space-y-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center border border-brand/20 brand-glow">
                <Icon className="w-10 h-10 text-brand" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">{product.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand/20">
                    {product.type}
                  </span>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
                    product.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    product.riskLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {product.riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-white/5">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Daily Yield</p>
                <p className="text-xl font-bold text-brand">{product.dailyYield}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Duration</p>
                <p className="text-xl font-bold text-white">{product.durationDays} Days</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Min. Entry</p>
                <p className="text-xl font-bold text-white">${product.minAmount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Return</p>
                <p className="text-xl font-bold text-brand">{product.totalReturn.toFixed(1)}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-brand" />
                Product Summary
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-brand">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Security</span>
                </div>
                <p className="text-xs text-slate-400">
                  This asset is fully insured and backed by physical infrastructure or verified carbon credits.
                </p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-brand">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Performance</span>
                </div>
                <p className="text-xs text-slate-400">
                  Historical data shows consistent yield delivery with minimal volatility in this asset class.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-dark rounded-[40px] border border-white/10 p-10 space-y-6"
          >
            <h3 className="text-lg font-display font-bold text-white">Investment Notes</h3>
            <ul className="space-y-4">
              {[
                "Daily rewards are credited directly to your Bamboo balance.",
                "Principal amount is locked for the duration of the cycle.",
                "Early withdrawal is not available for this high-yield product.",
                "Rewards are calculated based on the 24-hour cycle from investment time."
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Column: Investment Form */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark rounded-[40px] border border-white/10 p-8 sticky top-8 space-y-8"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-white">Start Investment</h3>
              <p className="text-xs text-slate-500 font-medium">Enter amount to begin harvesting yields.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</label>
                <span className="text-[10px] font-bold text-slate-400">Balance: ${user.balance.toFixed(2)}</span>
              </div>
              <div className="relative">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  min={product.minAmount}
                  max={product.maxAmount}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-white focus:outline-none focus:border-brand/50 transition-all"
                />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Min: ${product.minAmount}</span>
                <span>Max: ${product.maxAmount}</span>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-brand/5 rounded-3xl border border-brand/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Profit</span>
                <span className="text-sm font-bold text-brand">${((investAmount * product.dailyYield) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Return</span>
                <span className="text-sm font-bold text-white">${((investAmount * product.dailyYield * product.durationDays) / 100).toFixed(2)}</span>
              </div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-xs font-bold">{message.text}</p>
              </motion.div>
            )}

            <button 
              onClick={handleInvest}
              disabled={investing || investAmount < product.minAmount || investAmount > user.balance}
              className="w-full py-5 bg-brand disabled:bg-slate-800 disabled:text-slate-500 text-bg-dark rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-brand/20 brand-glow flex items-center justify-center gap-2"
            >
              {investing ? 'Processing...' : 'Confirm Investment'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
