import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product } from '../constants/products';

interface ProductsPageProps {
  user: any;
  onUpdateUser: (user: any) => void;
  onSelectProduct: (product: Product) => void;
}

const iconMap: Record<string, any> = {
  Leaf, Zap, Droplets, Wind, Sun, Globe, Trees, Sprout, Cpu, Shield
};

export const ProductsPage: React.FC<ProductsPageProps> = ({ user, onUpdateUser, onSelectProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 sm:gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Investment Grove</h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium">Discover sustainable opportunities for your capital.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-brand/50 transition-all w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
            <div className="flex items-center gap-2">
              {['All', 'Node', 'Energy', 'Agriculture', 'Carbon', 'RealEstate'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                    selectedType === type 
                      ? 'bg-brand text-bg-dark border-brand shadow-lg shadow-brand/20' 
                      : 'bg-white/5 text-slate-500 hover:text-white border-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, i) => {
          const Icon = iconMap[product.icon] || Leaf;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectProduct(product)}
              className="glass-dark rounded-[24px] sm:rounded-[32px] border border-white/5 p-6 sm:p-8 space-y-5 sm:space-y-6 hover:border-brand/30 transition-all group relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-16 h-16 sm:w-24 sm:h-24" />
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand/10 border border-brand/20 brand-glow`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="text-right">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{product.type}</p>
                  <div className={`mt-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter inline-block ${
                    product.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-500' :
                    product.riskLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {product.riskLevel} Risk
                  </div>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <h3 className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-brand transition-colors">{product.name}</h3>
                <div className="flex items-center gap-3 sm:gap-4 text-slate-400 text-[10px] sm:text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{product.durationDays} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand" />
                    <span className="text-brand">{product.dailyYield}% Daily</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 relative z-10">
                <div>
                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Min. Entry</p>
                  <p className="text-base sm:text-lg font-bold text-white">${product.minAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Return</p>
                  <p className="text-base sm:text-lg font-bold text-brand">{product.totalReturn.toFixed(1)}%</p>
                </div>
              </div>

              <div className="w-full py-4 bg-white/5 group-hover:bg-brand text-slate-400 group-hover:text-bg-dark rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border border-white/10 group-hover:border-brand flex items-center justify-center gap-2 group/btn">
                View Details
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
