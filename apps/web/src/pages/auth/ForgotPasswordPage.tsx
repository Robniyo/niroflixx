import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed. Try again.');
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
          <Link to="/login" className="flex items-center gap-2 text-sm text-secondary-500 hover:text-primary-600 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-h4 font-semibold mb-2">Check Your Email</h2>
              <p className="text-secondary-500 mb-1">We've sent a password reset link to</p>
              <p className="font-semibold text-secondary-900 mb-4">{email}</p>
              <p className="text-body-sm text-secondary-400">Click the link in the email to reset your password. If you don't see it, check your spam folder.</p>
            </div>
          ) : (
            <>
              <h1 className="text-h3 font-bold mb-2">Forgot Password?</h1>
              <p className="text-secondary-500 mb-6">Enter your email and we'll send you a reset link.</p>
              {error && <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 bg-secondary-50 border rounded-xl text-sm" />
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