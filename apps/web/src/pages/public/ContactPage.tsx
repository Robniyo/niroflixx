import { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { user, isAuthenticated } = useAuth();

useEffect(() => {
  if (isAuthenticated && user) {
    setForm({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email || '',
      subject: '',
      message: '',
    });
  }
}, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await api.post('/contact', form);
    } catch (error) {
      console.error('Contact form failed:', error);
    }
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }, 5000);
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="container-page text-center max-w-2xl">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Contact Us</span>
          <h1 className="text-h1 mt-3 mb-4">We'd Love to Hear From You</h1>
          <p className="text-body-lg text-secondary-600">
            Have a question, suggestion, or want to work with us? Reach out and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-8 md:py-20 bg-white w-full overflow-hidden w-full overflow-hidden">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-5">
              <div className="flex gap-4 p-5 rounded-xl bg-primary-50">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Location</h4>
                  <p className="text-body-sm text-secondary-600">Kigali, Rwanda</p>
                  <p className="text-body-sm text-secondary-600">Available for remote work worldwide</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl bg-success-light">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Email</h4>
                  <a href="mailto:robertniyonkuru001@gmail.com" className="text-body-sm text-primary-600 hover:underline break-all">robertniyonkuru001@gmail.com</a>
                  <p className="text-body-sm text-secondary-500 mt-0.5">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl bg-accent-50">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Phone</h4>
                  <a href="tel:+250795064502" className="text-body-sm text-primary-600 hover:underline">+250 795 064 502</a>
                  <p className="text-body-sm text-secondary-500 mt-0.5">Mon-Fri, 8AM-6PM CAT</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl bg-info-light">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Business Hours</h4>
                  <p className="text-body-sm text-secondary-600">Available 24/7 — Online Platform</p>
                  <p className="text-body-sm text-secondary-600">Response within 24 hours</p>
                  <p className="text-body-sm text-secondary-600">Support available daily</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-secondary-50 rounded-2xl p-8">
                <h2 className="text-h4 mb-6">Send Us a Message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4"><MessageSquare className="w-8 h-8 text-success" /></div>
                    <h3 className="text-h4 font-semibold text-success-dark mb-2">Message Sent!</h3>
                    <p className="text-secondary-600">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-label text-secondary-700 mb-1.5">Full Name *</label>
                        <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="ROBERT NIYONKURU" className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-secondary-900" />
                      </div>
                      <div>
                        <label className="block text-label text-secondary-700 mb-1.5">Email Address *</label>
                        <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="robertniyonkuru001@gmail.com" className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-secondary-900" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-label text-secondary-700 mb-1.5">Subject *</label>
                      <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help you?" className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-secondary-900" />
                    </div>
                    <div>
                      <label className="block text-label text-secondary-700 mb-1.5">Message *</label>
                      <textarea required rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us more about your inquiry..." className="w-full px-4 py-3 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-secondary-900 resize-none" />
                    </div>
                    <Button type="submit" size="lg" rightIcon={<Send className="w-4 h-4" />}>Send Message</Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Map */}
<section className="pb-16 bg-white">
  <div className="container-page">
    <div className="rounded-2xl overflow-hidden shadow-md h-64 sm:h-80">
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=30.0400,-1.9650,30.0800,-1.9350&layer=mapnik&marker=-1.9500,30.0600"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Kigali, Rwanda"
      />
    </div>
    <p className="text-center text-xs text-secondary-400 mt-2">📍 Kigali, Rwanda — Available worldwide online</p>
  </div>
</section>
    </>
  );
}