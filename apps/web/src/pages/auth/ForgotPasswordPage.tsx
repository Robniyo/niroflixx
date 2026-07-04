import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, Lock } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const r = await api.post('/auth/forgot-password', { email });
      if (r.data.resetToken) {
        setToken(r.data.resetToken);
        setStep('reset');
      } else {
        setStep('done');
      }
    } catch { setError('Failed. Try again.'); }
    finally { setLoading(false); }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setStep('done');
    } catch { setError('Invalid or expired reset link.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">Niro<span className="text-primary-600">flixx</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
          {step === 'done' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-h4 font-semibold mb-2">Check Your Email</h2>
              <p className="text-secondary-500 mb-6">If an account exists, we've sent a reset link.</p>
              <Link to="/login"><Button variant="outline" className="w-full">Back to Login</Button></Link>
            </div>
          ) : step === 'reset' ? (
            <>
              <h1 className="text-h3 font-bold text-secondary-900 mb-2">Reset Password</h1>
              <p className="text-secondary-500 mb-6">Enter your new password.</p>
              {error && <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-lg mb-4 text-body-sm">{error}</div>}
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-label text-secondary-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary-50 border rounded-lg text-sm" placeholder="Min 6 characters" />
                  </div>
                </div>
                <div>
                  <label className="block text-label text-secondary-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input type="password" required value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary-50 border rounded-lg text-sm" />
                  </div>
                </div>
                <Button type="submit" className="w-full" isLoading={loading} rightIcon={<Send className="w-4 h-4" />}>Reset Password</Button>
              </form>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
              <h1 className="text-h3 font-bold text-secondary-900 mb-2">Forgot Password?</h1>
              <p className="text-secondary-500 mb-6">Enter your email and we'll send you a reset link.</p>
              {error && <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-lg mb-4 text-body-sm">{error}</div>}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-label text-secondary-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary-50 border rounded-lg text-sm" placeholder="robertniyonkuru001@gmail.com" />
                  </div>
                </div>
                <Button type="submit" className="w-full" isLoading={loading} rightIcon={<Send className="w-4 h-4" />}>Send Reset Link</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}