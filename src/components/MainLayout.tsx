import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Bell, LogOut, Leaf, User } from 'lucide-react';

interface MainLayoutProps {
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  user, 
  onLogout, 
  children,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex min-h-screen bg-bg-dark">
      <Navigation user={user} activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass-dark border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-[100] sm:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center brand-glow">
              <Leaf className="w-5 h-5 text-brand" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white uppercase block leading-none">Bamboo</span>
              <span className="text-[8px] font-bold text-brand uppercase tracking-[0.3em] mt-0.5 block">Capital</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onTabChange('notifications')}
              className={`p-2 rounded-full transition-colors ${activeTab === 'notifications' ? 'text-brand bg-brand/10' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onTabChange('profile')}
              className={`p-2 rounded-full transition-colors ${activeTab === 'profile' ? 'text-brand bg-brand/10' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Desktop Header (Simplified since we have sidebar) */}
        <header className="hidden sm:flex glass-dark border-b border-white/5 px-8 py-4 items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              {activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-4 w-px bg-white/10" />
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{user.name}</p>
                {user.isPremium && (
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Premium Member</p>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
};
