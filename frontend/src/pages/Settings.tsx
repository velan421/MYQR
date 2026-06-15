import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';

export const Settings: React.FC = () => {
  const { user, updatePrivacySettings, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Page Header */}
      <div>
        <span className="font-label-caps text-xs text-on-surface-variant/70 tracking-widest block mb-1">Preferences</span>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface font-bold">Settings &amp; Privacy</h1>
        <p className="text-xs text-on-surface-variant mt-1">Manage your clinical profile, security, and account preferences.</p>
      </div>

      {/* Category: Profile Visibility */}
      <section className="space-y-3">
        <h3 className="font-title-md text-sm text-primary font-semibold px-2">Privacy &amp; Visibility (Visible on Scan)</h3>
        <GlassCard className="p-0 overflow-hidden flex flex-col border border-white/60 shadow-sm divide-y divide-outline-variant/10">
          {/* Vitals Toggle */}
          <div className="p-5 flex justify-between items-center hover:bg-white/50 transition-colors">
            <div>
              <div className="font-semibold text-sm text-on-surface">Vitals &amp; Demographics</div>
              <div className="text-xs text-on-surface-variant mt-1">Age, Gender, Blood Group, Height, Weight</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={user.privacySettings.showVitals}
                onChange={() => updatePrivacySettings({ showVitals: !user.privacySettings.showVitals })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
            </label>
          </div>

          {/* Conditions Toggle */}
          <div className="p-5 flex justify-between items-center hover:bg-white/50 transition-colors">
            <div>
              <div className="font-semibold text-sm text-on-surface">Medical Conditions</div>
              <div className="text-xs text-on-surface-variant mt-1">Chronic or active clinical conditions</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={user.privacySettings.showConditions}
                onChange={() => updatePrivacySettings({ showConditions: !user.privacySettings.showConditions })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
            </label>
          </div>

          {/* Allergies Toggle */}
          <div className="p-5 flex justify-between items-center hover:bg-white/50 transition-colors">
            <div>
              <div className="font-semibold text-sm text-on-surface">Documented Allergies</div>
              <div className="text-xs text-on-surface-variant mt-1">Severe reactions, anaphylaxis alerts</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={user.privacySettings.showAllergies}
                onChange={() => updatePrivacySettings({ showAllergies: !user.privacySettings.showAllergies })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
            </label>
          </div>

          {/* Medications Toggle */}
          <div className="p-5 flex justify-between items-center hover:bg-white/50 transition-colors">
            <div>
              <div className="font-semibold text-sm text-on-surface">Active Medications</div>
              <div className="text-xs text-on-surface-variant mt-1">Current prescriptions, dosages &amp; schedule</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={user.privacySettings.showMedications}
                onChange={() => updatePrivacySettings({ showMedications: !user.privacySettings.showMedications })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
            </label>
          </div>

          {/* Contacts Toggle */}
          <div className="p-5 flex justify-between items-center hover:bg-white/50 transition-colors">
            <div>
              <div className="font-semibold text-sm text-on-surface">Emergency Contacts</div>
              <div className="text-xs text-on-surface-variant mt-1">Immediate tap-to-call contacts info</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={user.privacySettings.showContacts}
                onChange={() => updatePrivacySettings({ showContacts: !user.privacySettings.showContacts })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
            </label>
          </div>
        </GlassCard>
      </section>

      {/* Category: Security */}
      <section className="space-y-3">
        <h3 className="font-title-md text-sm text-primary font-semibold px-2">Security</h3>
        <GlassCard className="overflow-hidden p-0 flex flex-col border border-white/60 shadow-sm">
          {/* 2FA */}
          <button className="w-full text-left p-5 flex items-center justify-between hover:bg-white/90 transition-colors cursor-pointer border-b border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-on-surface">Two-Factor Authentication</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Currently enabled via SMS</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>

          {/* Regenerate QR */}
          <button className="w-full text-left p-5 flex items-center justify-between hover:bg-white/90 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined">qr_code</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-on-surface">Regenerate QR Key</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Invalidate old printed codes</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
        </GlassCard>
      </section>

      {/* Category: Account */}
      <section className="space-y-3">
        <h3 className="font-title-md text-sm text-primary font-semibold px-2">Account</h3>
        <GlassCard className="overflow-hidden p-0 flex flex-col border border-white/60 shadow-sm">
          {/* Account Email */}
          <div className="w-full text-left p-5 flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-on-surface">Email Address</div>
                <div className="text-xs text-on-surface-variant mt-0.5">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Change Phone */}
          <button className="w-full text-left p-5 flex items-center justify-between hover:bg-white/90 transition-colors cursor-pointer border-b border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">phone_iphone</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-on-surface">Change Phone Number</div>
                <div className="text-xs text-on-surface-variant mt-0.5">{user.phone}</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>

          {/* Delete Account */}
          <button className="w-full text-left p-5 flex items-center justify-between hover:bg-error/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                <span className="material-symbols-outlined">delete_forever</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-error">Delete Account</div>
                <div className="text-xs text-error/85 mt-0.5">Permanently erase medical data</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-error/55">chevron_right</span>
          </button>
        </GlassCard>
      </section>

      {/* Destructive Action */}
      <section className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full bg-error/10 hover:bg-error/20 active:scale-95 border border-error/20 text-error font-semibold rounded-[16px] py-4 flex justify-center items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          Log Out
        </button>
      </section>
    </div>
  );
};
