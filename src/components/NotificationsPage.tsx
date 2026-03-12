import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  Info, 
  AlertCircle,
  Trash2,
  Leaf
} from 'lucide-react';

interface NotificationsPageProps {
  user: any;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [user.id]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return <CheckCircle2 className="w-5 h-5 text-bamboo" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-wood" />;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10 w-full space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Grove Alerts</h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-bamboo/10 rounded-lg sm:rounded-xl flex items-center justify-center glow-bamboo">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-bamboo" />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-6 sm:p-8 rounded-[24px] sm:rounded-[40px] border border-white/10 animate-pulse space-y-4">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((n, index) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] border border-white/10 shadow-sm hover:bg-white/[0.02] transition-all group relative"
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base sm:text-lg">{n.title}</h3>
                      <span className="text-[8px] sm:text-[10px] font-bold text-sage/40 flex items-center gap-1 uppercase tracking-[0.2em]">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Live Feed
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-sage/40 leading-relaxed font-medium">
                      {n.message}
                    </p>
                  </div>
                </div>
                
                <button className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100 p-1.5 sm:p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg sm:rounded-xl transition-all text-sage/20">
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-32 space-y-4 sm:space-y-6 glass rounded-[24px] sm:rounded-[40px] border border-white/10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-sage/20">
              <Leaf className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">Garden in Harmony</h3>
              <p className="text-xs sm:text-sm text-sage/40 font-medium px-4">No new alerts. Your investments are growing steadily in the grove.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
