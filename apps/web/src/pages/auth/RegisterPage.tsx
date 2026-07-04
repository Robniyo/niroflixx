import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', passwordConfirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-h3 font-bold text-secondary-900">Create Account</h1>
          <p className="text-secondary-500 mt-2">Join the Niroflixx community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
          {error && <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-lg mb-6 text-body-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label text-secondary-700 mb-1.5">First Name</label>
                <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-all text-secondary-900" />
              </div>
              <div>
                <label className="block text-label text-secondary-700 mb-1.5">Last Name</label>
                <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-all text-secondary-900" />
              </div>
            </div>
            <div>
              <label className="block text-label text-secondary-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input type="text" name="username" required value={form.username} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-all text-secondary-900" />
              </div>
            </div>
            <div>
              <label className="block text-label text-secondary-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-all text-secondary-900" />
              </div>
            </div>
            <div>
              <label className="block text-label text-secondary-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange} className="w-full pl-10 pr-12 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-all text-secondary-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-label text-secondary-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input type={showPassword ? 'text' : 'password'} name="passwordConfirm" required value={form.passwordConfirm} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-all text-secondary-900" />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={loading} rightIcon={<UserPlus className="w-4 h-4" />}>Create Account</Button>
          </form>

          <p className="text-center text-body-sm text-secondary-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}