import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import api from '@/services/api';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '', lastName: '', username: '', email: '', phone: '', password: '', passwordConfirm: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [counts, setCounts] = useState({ courses: 0, opportunities: 0 });

  useEffect(() => {
    api.get('/stats/public').then(r => setCounts(r.data.data)).catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const userData = await login(loginForm.email, loginForm.password);
      if (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN' || userData.role === 'CONTENT_MANAGER') navigate('/admin');
      else if (userData.role === 'INSTRUCTOR') navigate('/trainer');
      else navigate('/');
    } catch (err: any) { setError(err.response?.data?.message || 'Invalid email or password'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (registerForm.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!/[A-Z]/.test(registerForm.password)) { setError('Password must contain at least one uppercase letter'); return; }
    if (!/[0-9]/.test(registerForm.password)) { setError('Password must contain at least one number'); return; }
    if (!/[^A-Za-z0-9]/.test(registerForm.password)) { setError('Password must contain at least one special character'); return; }
    if (registerForm.password !== registerForm.passwordConfirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({
        firstName: registerForm.firstName, lastName: registerForm.lastName,
        username: registerForm.username, email: registerForm.email,
        password: registerForm.password,
      });
      navigate('/dashboard/candidate');
    } catch (err: any) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-repeat" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <span className="text-white font-bold text-3xl">N</span>
          </div>
          <h1 className="text-display-lg text-white font-bold mb-4">Welcome to Niroflixx</h1>
          <p className="text-white/70 text-body-lg leading-relaxed mb-8">Learn digital skills, discover opportunities, and grow your career — all in one platform.</p>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[{ value: counts.courses || '—', label: 'Courses' },{ value: counts.opportunities || '—', label: 'Opportunities' }].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl py-4">
                <div className="text-white font-bold text-lg">{s.value}</div>
                <div className="text-white/60 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div>
              <span className="text-xl font-bold text-secondary-900">Niro<span className="text-primary-600">flixx</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 overflow-hidden">
            <div className="flex border-b border-secondary-100">
              <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-4 text-sm font-semibold transition-all relative ${tab === 'login' ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}>
                Sign In{tab === 'login' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary-600 rounded-full" />}
              </button>
              <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-4 text-sm font-semibold transition-all relative ${tab === 'register' ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}>
                Create Account{tab === 'register' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary-600 rounded-full" />}
              </button>
            </div>

            <div className="p-8">
              {error && <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-xl mb-6 text-body-sm border border-danger/20">{error}</div>}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input type="email" required value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@example.com" className="w-full pl-11 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input type={showPassword ? 'text' : 'password'} required value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="Enter your password" className="w-full pl-11 pr-12 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400"><Eye className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-secondary-600"><input type="checkbox" className="rounded" /> Remember me</label>
                    <Link to="/forgot-password" className="text-primary-600 hover:underline font-medium">Forgot password?</Link>
                  </div>
                  <Button type="submit" className="w-full" size="lg" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>Sign In</Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium mb-1.5">First Name</label><input type="text" required value={registerForm.firstName} onChange={e => setRegisterForm({...registerForm, firstName: e.target.value})} className="w-full px-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Last Name</label><input type="text" required value={registerForm.lastName} onChange={e => setRegisterForm({...registerForm, lastName: e.target.value})} className="w-full px-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" /></div>
                  </div>
                  <div><label className="block text-sm font-medium mb-1.5">Username</label><input type="text" required value={registerForm.username} onChange={e => setRegisterForm({...registerForm, username: e.target.value})} className="w-full px-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" /></div>
                  <div><label className="block text-sm font-medium mb-1.5">Email Address</label><input type="email" required value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full px-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" /></div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <PhoneInput country={'rw'} value={registerForm.phone} onChange={(phone) => setRegisterForm({ ...registerForm, phone })} inputClass="w-full !pl-14 !py-3.5 !bg-secondary-50 !border !border-secondary-200 !rounded-xl !text-sm" buttonClass="!bg-secondary-50 !border !border-secondary-200 !rounded-l-xl" placeholder="7XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Password</label>
                    <input type={showPassword ? 'text' : 'password'} required value={registerForm.password} onChange={e => { const pw = e.target.value; setRegisterForm({...registerForm, password: pw}); let score = 0; if (pw.length >= 8) score++; if (pw.length >= 12) score++; if (/[A-Z]/.test(pw)) score++; if (/[0-9]/.test(pw)) score++; if (/[^A-Za-z0-9]/.test(pw)) score++; setPasswordStrength(score); if (score <= 2) setPasswordFeedback('Weak'); else if (score <= 3) setPasswordFeedback('Medium'); else if (score <= 4) setPasswordFeedback('Strong'); else setPasswordFeedback('Very Strong!'); }} className="w-full px-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" />
                    {registerForm.password && (
                      <div className="mt-2">
                        <div className="flex gap-1">{[1,2,3,4,5].map(i => (<div key={i} className={`h-1 flex-1 rounded-full ${i <= passwordStrength ? 'bg-success' : 'bg-secondary-200'}`} />))}</div>
                        <p className="text-xs mt-1 text-secondary-400">{passwordFeedback}</p>
                      </div>
                    )}
                  </div>
                  <div><label className="block text-sm font-medium mb-1.5">Confirm Password</label><input type={showPassword ? 'text' : 'password'} required value={registerForm.passwordConfirm} onChange={e => setRegisterForm({...registerForm, passwordConfirm: e.target.value})} className="w-full px-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500" /></div>
                  <Button type="submit" className="w-full" size="lg" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>Create Account</Button>
                  <p className="text-xs text-secondary-400 text-center mt-4">By creating an account, you agree to our <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.</p>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-body-sm text-secondary-400 mt-8">
            <Link to="/" className="hover:text-primary-600 transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}