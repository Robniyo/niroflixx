import { useState } from 'react';
import { X, Send, User, Mail, Phone, FileText } from 'lucide-react';
import api from '@/services/api';
import Button from './Button';
import toast from 'react-hot-toast';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityTitle: string;
  opportunityId: string;
}

export default function ApplyModal({ isOpen, onClose, opportunityTitle, opportunityId }: ApplyModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create application directly — no account required
      await api.post('/applications', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        opportunityId,
        status: 'SUBMITTED',
      });

      setSuccess(true);
      setTimeout(() => { onClose(); setSuccess(false); setForm({ name: '', email: '', phone: '', message: '' }); }, 4000);
    } catch (err: any) {
      toast.error('Failed to submit. Please try again.');
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
              <FileText className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-h4 font-semibold mb-2">Application Received! ✅</h3>
            <p className="text-secondary-500 mb-4">We'll review your interest for <strong>{opportunityTitle}</strong> and contact you soon.</p>
            <p className="text-body-sm text-primary-600">Create an account to track your applications.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-h4 font-semibold">Apply for this Opportunity</h3>
              <p className="text-body-sm text-secondary-500 mt-1">Express your interest in <strong>{opportunityTitle}</strong>. We'll contact you to help with the application.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" placeholder="Niro Bwimba" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (WhatsApp)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" placeholder="+250 7XX XXX XXX" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" placeholder="Tell us anything specific..." />
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={loading} rightIcon={<Send className="w-4 h-4" />}>Submit Application</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}