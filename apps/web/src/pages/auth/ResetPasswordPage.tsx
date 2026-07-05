import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setError('Invalid or expired reset link.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">Niro<span className="text-primary-600">flix</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {done ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <h2 className="text-h4 font-semibold mb-2">Password Reset!</h2>
              <p className="text-secondary-500">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <h1 className="text-h3 font-bold mb-2">Reset Password</h1>
              <p className="text-secondary-500 mb-6">Enter your new password.</p>
              {error && <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full pl-11 pr-4 py-3 bg-secondary-50 border rounded-xl text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                    <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" className="w-full pl-11 pr-4 py-3 bg-secondary-50 border rounded-xl text-sm" />
                  </div>
                </div>
                <Button type="submit" className="w-full" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>Reset Password</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}