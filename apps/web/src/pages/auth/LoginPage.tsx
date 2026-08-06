import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import api from '@/services/api';

// Extend Window interface for Google Identity Services
declare global {
  interface Window {
    google?: any;
    handleGoogleResponse?: (response: any) => void;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleScriptLoaded = useRef(false);

  // Load Google Identity Services script safely
  useEffect(() => {
    if (googleScriptLoaded.current) return;
    googleScriptLoaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleGoogleResponse = async (response: any) => {
      setError('');
      try {
        const res = await api.post('/auth/google', {
          idToken: response.credential,
        });
        // On success, redirect to home; AuthContext will pick up the session on next load
        navigate('/');
      } catch (err: any) {
        setError('Google login failed. Please try again.');
      }
    };

    // No cleanup needed – the script stays mounted for the lifetime of the page
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN' || userData.role === 'CONTENT_MANAGER') {
        navigate('/admin');
      } else if (userData.role === 'INSTRUCTOR') {
        navigate('/trainer');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">
              Niro<span className="text-primary-600">flixx</span>
            </span>
          </Link>
          <h1 className="text-h3 font-bold text-secondary-900">Welcome Back</h1>
          <p className="text-secondary-500 mt-2">Sign in to access your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
          {/* Google Login Button */}
          <div className="mb-6 flex justify-center">
            <div
              id="g_id_onload"
              data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              data-context="signin"
              data-ux_mode="popup"
              data-callback="handleGoogleResponse"
              data-auto_prompt="false"
            />
            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="pill"
              data-theme="outline"
              data-text="continue_with"
              data-size="large"
              data-logo_alignment="left"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">or sign in with email</span>
            </div>
          </div>

          {error && (
            <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-lg mb-6 text-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-label text-secondary-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="robertniyonkuru001@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-secondary-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-label text-secondary-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-secondary-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-body-sm text-secondary-600">
                <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-body-sm text-primary-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={loading} rightIcon={<LogIn className="w-4 h-4" />}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-body-sm text-secondary-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}