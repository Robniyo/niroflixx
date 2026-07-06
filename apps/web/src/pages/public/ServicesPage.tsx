import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, Send, User, Mail, Phone } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/services/request', {
        serviceId: selectedService?.id,
        description: form.message,
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      setDone(true);
      setTimeout(() => { setShowRequest(false); setDone(false); setForm({ name: '', email: '', phone: '', message: '' }); }, 3000);
    } catch { toast.error('Failed to send request'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-success font-semibold text-label uppercase tracking-wider">Services</span>
          <h1 className="text-h1 mt-3 mb-4">Professional Services</h1>
          <p className="text-body-lg text-secondary-600 max-w-2xl mx-auto">Get professional help for your career, business, and creative projects.</p>
        </div>

        {services.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-success-light rounded-2xl flex items-center justify-center mx-auto mb-6"><Wrench className="w-10 h-10 text-success" /></div>
            <h3 className="text-h4 font-semibold mb-3">Services Coming Soon</h3>
            <p className="text-secondary-500 mb-8">Our team is setting up services.</p>
            <Link to="/contact"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Contact Us</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-secondary-100 p-6 hover:shadow-lg transition-all text-center group">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Wrench className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg text-secondary-900 mb-2">{s.title}</h3>
                <p className="text-body-sm text-secondary-500 mb-4 line-clamp-3">{s.description}</p>
                <p className="text-primary-600 font-bold text-lg mb-4">{s.startingPrice === 0 ? 'Free' : `From ${s.startingPrice.toLocaleString()} RWF`}</p>
                {s.estimatedTime && <p className="text-caption text-secondary-400 mb-4">⏱ {s.estimatedTime}</p>}
                <Button variant="outline" onClick={() => { setSelectedService(s); setShowRequest(true); }} className="w-full">
                  Request Service
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRequest(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 animate-scale-in">
            {done ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-h4 font-semibold mb-2">Request Sent!</h3>
                <p className="text-secondary-500">We'll contact you about <strong>{selectedService?.title}</strong>.</p>
              </div>
            ) : (
              <>
                <h3 className="text-h4 font-semibold mb-2">Request: {selectedService?.title}</h3>
                <p className="text-secondary-500 text-body-sm mb-6">Fill your details and we'll get back to you.</p>
                <form onSubmit={handleRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" /><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" /><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" /><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRequest(false)}>Cancel</Button>
                    <Button type="submit" className="flex-1" isLoading={submitting} rightIcon={<Send className="w-4 h-4" />}>Send Request</Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}