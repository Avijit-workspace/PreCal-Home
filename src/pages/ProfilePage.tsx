import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Save, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth, useToast } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    showToast('Profile updated successfully!', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm text-charcoal-700 hover:text-sage-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-display font-bold text-charcoal-800 mb-6">Profile & Settings</h1>

      {/* Avatar */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-gradient-sage rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-3xl">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-xl text-charcoal-800">{user?.name}</h2>
            <p className="text-charcoal-700 opacity-60">{user?.email}</p>
            <span className="badge-green mt-1">Free Plan</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" className="form-input pl-9" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" className="form-input pl-9 bg-gray-50 cursor-not-allowed opacity-60" value={user?.email || ''} disabled />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed in demo mode.</p>
          </div>
          <div>
            <label className="form-label">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" className="form-input pl-9" placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-800 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPwd ? 'text' : 'password'} className="form-input pl-9 pr-9" placeholder="••••••••" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPwd ? 'text' : 'password'} className="form-input pl-9 pr-9" placeholder="••••••••" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-800 mb-4">Notification Preferences</h3>
        {[
          { label: 'Email updates on analysis results', checked: true },
          { label: 'Professional booking confirmations', checked: true },
          { label: 'Weekly renovation tips newsletter', checked: false },
          { label: 'Promotional offers and discounts', checked: false },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-warm-50 last:border-0">
            <span className="text-sm text-charcoal-700">{item.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-sage-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn-primary w-full justify-center py-3.5">
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
    </div>
  );
};
