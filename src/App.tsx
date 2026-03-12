import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { ReferralsPage } from './components/ReferralsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { ProductsPage } from './components/ProductsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { TradesPage } from './components/TradesPage';
import { DepositPage } from './components/DepositPage';
import { WithdrawPage } from './components/WithdrawPage';
import { Settings } from './components/Settings';
import { RankProgress } from './components/RankProgress';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { MainLayout } from './components/MainLayout';
import { Leaf } from 'lucide-react';
import { Product } from './constants/products';

type AuthView = 'login' | 'register' | 'dashboard' | 'privacy-policy' | 'terms-conditions';

export default function App() {
  const [view, setView] = useState<AuthView>('login');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      if (!user.my_referral_code) {
        fetch(`/api/user/${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.my_referral_code) {
              setUser(data);
            }
          });
      }

      // Fetch investments for rank progress
      fetch(`/api/investments/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setInvestments(data);
          }
        })
        .catch(err => console.error("Failed to fetch investments", err));
    }
  }, [user]);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setView('dashboard');
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <Dashboard 
          user={user} 
          onTabChange={setActiveTab}
        />
      );
    }

    if (activeTab === 'notifications') {
      return (
        <NotificationsPage 
          user={user} 
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <Profile 
          user={user} 
          onTabChange={setActiveTab}
        />
      );
    }

    if (activeTab === 'settings') {
      return (
        <Settings 
          user={user} 
          onUpdateUser={setUser}
          onLogout={() => {
            setUser(null);
            setView('login');
          }}
        />
      );
    }

    if (activeTab === 'referrals') {
      return (
        <ReferralsPage 
          user={user} 
        />
      );
    }

    if (activeTab === 'trades') {
      return (
        <TradesPage 
          user={user} 
          onUpdateUser={setUser}
        />
      );
    }

    if (activeTab === 'deposit') {
      return (
        <DepositPage 
          user={user} 
          onUpdateUser={setUser}
        />
      );
    }

    if (activeTab === 'withdraw') {
      return (
        <WithdrawPage 
          user={user} 
          onUpdateUser={setUser}
        />
      );
    }

    if (activeTab === 'rank-progress') {
      return (
        <RankProgress 
          user={user} 
          investments={investments}
        />
      );
    }

    if (activeTab === 'products') {
      if (viewingProduct) {
        return (
          <ProductDetailPage 
            product={viewingProduct}
            user={user}
            onBack={() => setViewingProduct(null)}
            onUpdateUser={setUser}
          />
        );
      }
      return (
        <ProductsPage 
          user={user} 
          onUpdateUser={setUser}
          onSelectProduct={setViewingProduct}
        />
      );
    }

    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-brand/5 rounded-[32px] flex items-center justify-center border border-brand/10 brand-glow">
          <Leaf className="w-10 h-10 text-brand/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase">Coming Soon</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">
            The <span className="text-brand">{activeTab}</span> module is currently under development.
          </p>
        </div>
      </div>
    );
  };

  if (view === 'dashboard' && user) {
    return (
      <MainLayout
        user={user}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setViewingProduct(null);
        }}
        onLogout={() => {
          setUser(null);
          setView('login');
        }}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </MainLayout>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'login' ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your account."
          >
            <LoginForm 
              onToggle={() => setView('register')} 
              onSuccess={handleAuthSuccess}
            />
          </AuthLayout>
        </motion.div>
      ) : view === 'register' ? (
        <motion.div
          key="register"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthLayout
            title="Create an account"
            subtitle="Join the Bamboo Investment grove today and plant your node for long-term growth."
          >
            <RegisterForm 
              onToggle={() => setView('login')} 
              onSuccess={handleAuthSuccess}
              onViewPolicy={(type) => setView(type === 'privacy' ? 'privacy-policy' : 'terms-conditions')}
            />
          </AuthLayout>
        </motion.div>
      ) : view === 'privacy-policy' ? (
        <motion.div
          key="privacy"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-bg-dark min-h-screen"
        >
          <PrivacyPolicy onBack={() => setView('register')} />
        </motion.div>
      ) : (
        <motion.div
          key="terms"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-bg-dark min-h-screen"
        >
          <TermsAndConditions onBack={() => setView('register')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
