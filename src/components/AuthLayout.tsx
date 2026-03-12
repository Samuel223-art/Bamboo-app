import React from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg-dark relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 50%)', filter: 'blur(100px)' }} 
      />
      
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative z-10">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
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
                <span className="font-display font-bold text-2xl tracking-tight uppercase text-white block leading-none">Bamboo</span>
                <span className="text-[10px] font-bold text-brand uppercase tracking-[0.3em] mt-1 block">Capital</span>
              </motion.div>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-display font-bold tracking-tight text-white"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 font-medium"
              >
                {subtitle}
              </motion.p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-black/20 border-l border-white/5">
        <div className="absolute inset-0 flex items-center justify-center p-24">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                  Secure Trading v2.4
                </div>
                <h2 className="text-6xl font-display font-bold text-white tracking-tighter leading-[0.9]">
                  Invest in <br />
                  <span className="text-brand italic">Excellence.</span>
                </h2>
                <p className="text-slate-400 max-w-sm mx-auto text-lg font-medium leading-relaxed">
                  A sophisticated platform for modern investors. Build your portfolio with precision and speed.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Bamboo Capital</p>
            <p className="text-brand text-xs font-mono">SECURE_ASSET_PROTOCOL</p>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-12 h-1 bg-brand/${i === 0 ? '40' : '10'} rounded-full`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
