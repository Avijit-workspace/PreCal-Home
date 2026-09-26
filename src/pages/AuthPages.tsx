import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Leaf, Check } from 'lucide-react';
import { useAuth, useToast, useLang } from '../context/AppContext';

const BG_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

const FormInput: React.FC<InputProps> = ({ label, icon, error, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = props.type === 'password';

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        <input
          {...props}
          type={isPassword && show ? 'text' : props.type}
          className={`form-input ${icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${error ? 'border-red-400 focus:ring-red-200' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal-700"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const { t } = useLang();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login(email, password);
    if (ok) {
      showToast(t('toast.loginSuccess'), 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={BG_IMAGE} alt="Interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-sage rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">PreCal <span className="text-sage-400">Home</span></span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4 leading-tight">
            Design Smarter.<br />Build Better.<br />Spend Wisely.
          </h2>
          <div className="space-y-3 mt-6">
            {['AI-powered design recommendations', 'Accurate material & cost estimates', 'Verified professional network'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 glass rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-2 text-gold-400 mb-2">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-semibold">Demo Mode Active</span>
            </div>
            <p className="text-xs text-gray-300">Enter any email & password to explore the platform. No real account required.</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-cream-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-sage rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-xl text-charcoal-800">PreCal <span className="text-sage-600">Home</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-charcoal-800 mb-2">Welcome back</h1>
            <p className="text-charcoal-700 opacity-70">Sign in to continue to your renovation dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Email Address"
              type="email"
              id="login-email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <FormInput
              label="Password"
              type="password"
              id="login-password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-sage-600 rounded"
                />
                <span className="text-sm text-charcoal-700">Remember me</span>
              </label>
              <button type="button" className="text-sm text-sage-600 hover:text-sage-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-700 opacity-70 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sage-600 font-semibold hover:text-sage-700">Create one free</Link>
          </p>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 text-center">
              <strong>Demo:</strong> Use any email & password (min 6 chars) to log in. No real data required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const { t } = useLang();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await register(form.name, form.email, form.phone, form.password);
    if (ok) {
      showToast(t('toast.registerSuccess'), 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80" alt="Interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-sage rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">PreCal <span className="text-sage-400">Home</span></span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4 leading-tight">
            Start Your Renovation Journey Today
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Join thousands of homeowners who have transformed their spaces with AI-powered planning.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-cream-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-sage rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-xl text-charcoal-800">PreCal <span className="text-sage-600">Home</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-charcoal-800 mb-2">Create your account</h1>
            <p className="text-charcoal-700 opacity-70">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Full Name" type="text" id="reg-name" placeholder="Priya Sharma" icon={<User className="w-4 h-4" />} value={form.name} onChange={set('name')} error={errors.name} />
            <FormInput label="Email Address" type="email" id="reg-email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} value={form.email} onChange={set('email')} error={errors.email} />
            <FormInput label="Phone Number" type="tel" id="reg-phone" placeholder="9876543210" icon={<Phone className="w-4 h-4" />} value={form.phone} onChange={set('phone')} error={errors.phone} />
            <FormInput label="Password" type="password" id="reg-password" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} value={form.password} onChange={set('password')} error={errors.password} />
            <FormInput label="Confirm Password" type="password" id="reg-confirm" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} value={form.confirm} onChange={set('confirm')} error={errors.confirm} />

            <button
              type="submit"
              id="register-submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <>Create Free Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-700 opacity-70 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sage-600 font-semibold hover:text-sage-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
