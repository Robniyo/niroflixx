import { useState } from 'react';
import { X, Bell, Mail, Phone, User, Send } from 'lucide-react';
import api from '@/services/api';
import Button from './Button';

interface NotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const interestsList = ['Scholarships', 'Jobs', 'Internships', 'Admissions', 'Hackathons', 'All Opportunities'];

export default function NotifyModal({ isOpen, onClose }: NotifyModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interests: 'All Opportunities' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/subscribers', form);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setForm({ name: '', email: '', phone: '', interests: 'All Opportunities' });
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50">
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-h4 font-semibold text-secondary-900 mb-2">You're on the List!</h3>
            <p className="text-secondary-500">We'll notify you as soon as new opportunities are available.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-h4 font-semibold text-secondary-900">Get Notified</h3>
              <p className="text-body-sm text-secondary-500 mt-1">Be the first to know about new opportunities.</p>
            </div>

            {error && <div className="bg-danger-light text-danger-dark px-4 py-3 rounded-lg mb-4 text-body-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label text-secondary-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ROBERT NIYONKURU" className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
                </div>
              </div>
              <div>
                <label className="block text-label text-secondary-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="robertniyonkuru001@gmail.com" className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
                </div>
              </div>
              <div>
                <label className="block text-label text-secondary-700 mb-1.5">Phone Number (for WhatsApp)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+250 795 064 502" className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm" />
                </div>
              </div>
              <div>
                <label className="block text-label text-secondary-700 mb-1.5">I'm Interested In</label>
                <select value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-secondary-900 text-body-sm">
                  {interestsList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={loading} rightIcon={<Send className="w-4 h-4" />}>Notify Me</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}