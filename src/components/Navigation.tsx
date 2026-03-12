import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Users, 
  User, 
  Settings,
  Bell,
  Leaf,
  Wallet,
  ArrowUpRight,
  LucideIcon
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  id: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'trades', label: 'My Trades', icon: ArrowLeftRight },
  { id: 'referrals', label: 'Referrals', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface NavigationProps {
  user: any;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, activeTab, onTabChange }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col w-[280px] glass-dark border-r border-white/5 h-screen sticky top-0 z-50">
        <div className="p-8 flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center brand-glow cursor-pointer"
          >
            <Leaf className="w-6 h-6 text-brand" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none uppercase">Bamboo</h1>
            <p className="text-[10px] font-bold text-brand uppercase tracking-[0.3em] mt-1">Capital</p>
          </motion.div>
        </div>

        <div className="px-4 py-2">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive 
                      ? 'bg-brand/10 text-brand brand-glow' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand' : 'text-slate-500 group-hover:text-white'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="glass rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand font-bold text-lg brand-glow overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar || user.name || "Samuel"}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                {user.isPremium && (
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Premium Member</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Account Status</span>
                <span className={`${user.isVerified ? 'text-brand animate-pulse' : 'text-slate-500'}`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-brand shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ${user.isVerified ? 'w-full' : 'w-1/3 opacity-30'}`} />
              </div>
            </div>

            <button 
              onClick={() => onTabChange('settings')}
              className="w-full py-2.5 bg-brand/10 hover:bg-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-brand/20"
            >
              Account Settings
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Menu */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 px-2 py-2 z-[100] flex items-center justify-around pb-safe">
        {navItems.filter(item => ['overview', 'products', 'trades', 'referrals'].includes(item.id)).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand' : 'text-slate-500'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-brand' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-brand rounded-full mt-0.5 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
