import { useState, useEffect } from 'react';
import { X, Send, User, Mail, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import Button from './Button';
import AgreementModal from './AgreementModal';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityTitle: string;
  opportunityId: string;
}

export default function ApplyModal({ isOpen, onClose, opportunityTitle, opportunityId }: ApplyModalProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'agreement' | 'checking' | 'needsProfile' | 'form' | 'success'>('agreement');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Pre‑fill from logged‑in user
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || '',
        message: '',
      });
    }
  }, [isAuthenticated, user, isOpen]);

  if (!isOpen) return null;

  const checkCandidateProfile = async () => {
    try {
      const res = await api.get('/candidates/status');
      if (res.data.data?.exists) {
        setStep('form');
      } else {
        setStep('needsProfile');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleAgreementAccept = () => {
    if (!isAuthenticated) {
      // Save intent and go to login
      sessionStorage.setItem('applyAfterLogin', JSON.stringify({ opportunityId, opportunityTitle }));
      navigate('/login');
      onClose();
      return;
    }
    setStep('checking');
    checkCandidateProfile();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/applications', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        opportunityId,
      });
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('agreement');
        setForm({ name: '', email: '', phone: '', message: '' });
      }, 5000);
    } catch (err: any) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = () => {
    onClose();
    navigate('/dashboard/candidate-profile');
  };

  return (
    <>
      <AgreementModal
        isOpen={step === 'agreement'}
        opportunityTitle={opportunityTitle}
        onAccept={handleAgreementAccept}
        onDecline={onClose}
      />

      {step === 'needsProfile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-h4 font-semibold mb-2">Complete Your Candidate Profile</h3>
              <p className="text-secondary-500 mb-6">
                To apply for opportunities with our help, you need to set up your candidate profile
                with your skills, education, and documents. It only takes a few minutes.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>Later</Button>
                <Button className="flex-1" onClick={goToProfile}>Go to Profile</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-h4 font-semibold">Apply for this Opportunity</h3>
              <p className="text-body-sm text-secondary-500 mt-1">
                Our team will assist you with <strong>{opportunityTitle}</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (WhatsApp)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" />
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={loading} rightIcon={<Send className="w-4 h-4"/>}>
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in text-center">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-h4 font-semibold mb-2">Application Received! ✅</h3>
            <p className="text-secondary-500">
              We'll review your profile and assist you with <strong>{opportunityTitle}</strong>. Our team will contact you soon.
            </p>
          </div>
        </div>
      )}
    </>
  );
}