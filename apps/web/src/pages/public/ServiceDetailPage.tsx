import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wrench, Clock, Send, CheckCircle } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', paymentMethod: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/services/${slug}`).then(r => setService(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prev => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/services/request', {
        serviceId: service.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        description: form.message,
        paymentMethod: form.paymentMethod,
      });
      setSubmitted(true);
      toast.success('Request sent! We will contact you shortly.');
    } catch {
      toast.error('Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (!service) return <div className="pt-32 pb-16 text-center"><h1 className="text-h2">Service Not Found</h1><Link to="/services" className="text-primary-600 mt-4 inline-block">Back to Services</Link></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content max-w-2xl">
        <Link to="/services" className="flex items-center gap-2 text-sm text-secondary-500 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
        <div className="bg-white rounded-2xl border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center"><Wrench className="w-8 h-8 text-primary-600" /></div>
            <div>
              <span className="text-primary-600 font-semibold text-sm">Professional Service</span>
              <h1 className="text-h2 font-bold">{service.title}</h1>
            </div>
          </div>
          <p className="text-body-lg text-secondary-600 mb-6">{service.description}</p>
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="text-center">
              <p className="text-h3 font-bold text-primary-600">{service.startingPrice === 0 ? 'Free' : `${service.startingPrice.toLocaleString()} RWF`}</p>
              <p className="text-sm text-secondary-500">Starting Price</p>
            </div>
            {service.estimatedTime && (
              <div className="text-center">
                <p className="text-h3 font-bold text-secondary-900 flex items-center gap-1"><Clock className="w-5 h-5" /> {service.estimatedTime}</p>
                <p className="text-sm text-secondary-500">Estimated Time</p>
              </div>
            )}
          </div>

          {!showForm ? (
            <Button size="lg" onClick={() => setShowForm(true)}>Request This Service</Button>
          ) : !submitted ? (
            <form onSubmit={handleRequestSubmit} className="space-y-5 animate-fade-in">
              <h3 className="text-h4 font-semibold">Request This Service</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone (WhatsApp)</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm">
                    <option value="">Select...</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project Details</label>
                <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" placeholder="Describe what you need..." />
              </div>
              <Button type="submit" className="w-full" isLoading={submitting} rightIcon={<Send className="w-4 h-4" />}>Submit Request</Button>
            </form>
          ) : (
            <div className="bg-success-light border border-success rounded-2xl p-5 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-success-dark">Request Submitted!</h4>
                <p className="text-sm text-success-dark/80">Thank you! We will contact you shortly to discuss details and payment.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}