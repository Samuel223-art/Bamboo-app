import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Trash2, 
  ChevronRight,
  Mail,
  Smartphone,
  Globe,
  Eye,
  EyeOff,
  Leaf,
  LogOut,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface SettingsProps {
  user: any;
  onUpdateUser?: (user: any) => void;
  onLogout?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeSection, setActiveSection] = React.useState('profile');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  
  const [profileData, setProfileData] = React.useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    avatar: user.avatar || ''
  });

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = React.useState({
    harvest: true,
    market: true,
    security: true
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        if (onUpdateUser) {
          onUpdateUser({ ...user, ...profileData });
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("An error occurred while updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsSaving(false);
    alert("Password updated successfully!");
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 space-y-2">
            <div className="px-4 py-2 mb-4">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Account Settings</h2>
            </div>
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                    activeSection === section.id 
                      ? 'bg-brand/10 text-brand border border-brand/20 shadow-lg shadow-brand/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-brand' : 'text-slate-500'}`} />
                  {section.label}
                  {activeSection === section.id && <div className="ml-auto w-1.5 h-1.5 bg-brand rounded-full brand-glow" />}
                </button>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 mt-8">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark rounded-[40px] border border-white/5 p-8 lg:p-12 space-y-10"
            >
              {activeSection === 'profile' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-white">Profile Settings</h3>
                    <p className="text-slate-500 text-sm">Manage your public information and account identity.</p>
                  </div>

                  <div className="flex items-center gap-8 pb-10 border-b border-white/5">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-brand/20 p-1 overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.avatar || profileData.name || "Samuel"}`} 
                          alt="Avatar" 
                          className="w-full h-full rounded-2xl"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newSeed = Math.random().toString(36).substring(7);
                          setProfileData({ ...profileData, avatar: newSeed });
                        }}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand rounded-xl flex items-center justify-center border-4 border-[#050b09] hover:scale-110 transition-transform shadow-lg"
                      >
                        <Globe className="w-4 h-4 text-bg-dark" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-bold">{profileData.name || "Samuel"}</h4>
                      <p className="text-xs text-slate-500">Cultivator ID: {user.id?.substring(0, 8).toUpperCase()}</p>
                      <button 
                        onClick={() => {
                          const newSeed = Math.random().toString(36).substring(7);
                          setProfileData({ ...profileData, avatar: newSeed });
                        }}
                        className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline"
                      >
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-brand/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-brand/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bio</label>
                      <textarea 
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell the ecosystem about yourself..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-brand/50 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex items-center gap-4">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-brand text-bg-dark px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-brand/10 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </button>
                    {saveSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-brand text-[10px] font-bold uppercase tracking-widest"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Updated Successfully
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-white">Security</h3>
                    <p className="text-slate-500 text-sm">Protect your account with advanced security measures.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20">
                          <Lock className="w-6 h-6 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Change Password</p>
                          <p className="text-xs text-slate-500">Update your password regularly for better security.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 pt-4">
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-brand/50 transition-colors"
                          />
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <input 
                          type="password" 
                          placeholder="New Password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-brand/50 transition-colors"
                        />
                        <input 
                          type="password" 
                          placeholder="Confirm New Password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-brand/50 transition-colors"
                        />
                        <button 
                          onClick={handleChangePassword}
                          disabled={isSaving || !passwordData.newPassword}
                          className="w-full py-4 rounded-2xl bg-white/5 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-white">Notifications</h3>
                    <p className="text-slate-500 text-sm">Choose how you want to stay updated with the ecosystem.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'harvest', title: 'Harvest Alerts', desc: 'Get notified when your bamboo is ready for harvest.', icon: Leaf },
                      { id: 'market', title: 'Market Updates', desc: 'Stay informed about price fluctuations and trends.', icon: Globe },
                      { id: 'security', title: 'Security Alerts', desc: 'Critical updates about your account security.', icon: Shield }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notifications[item.id as keyof typeof notifications]} 
                            onChange={() => toggleNotification(item.id as keyof typeof notifications)}
                          />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-white">Privacy</h3>
                    <p className="text-slate-500 text-sm">Control your visibility and data sharing preferences.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">Public Profile</p>
                          <p className="text-xs text-slate-500">Allow other cultivators to see your rank and impact score.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">Anonymous Harvesting</p>
                          <p className="text-xs text-slate-500">Hide your investment activity from the global leaderboard.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                          <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Danger Zone</p>
                          <p className="text-xs text-slate-500">Permanently delete your account and all associated data.</p>
                        </div>
                      </div>
                      <button className="w-full py-4 rounded-2xl bg-red-500/10 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
