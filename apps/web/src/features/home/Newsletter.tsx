import { useState } from 'react';
import { Mail, Send, CheckCircle, X } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/subscribers', { email, interests: 'Newsletter' });
      setSubscribed(true);
      toast.success('Subscribed!');
      setEmail('');
      setTimeout(() => { setSubscribed(false); setExpanded(false); }, 5000);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <section className="section-padding bg-secondary-900">
      <div className="container-page max-w-lg text-center">
        <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-6 h-6 text-primary-400" />
        </div>
        <h2 className="text-h3 font-bold text-white mb-3">Stay Updated</h2>
        <p className="text-secondary-400 mb-4 text-sm sm:text-base">
          Get the latest opportunities, courses, and tech news directly in your inbox.
        </p>

        {subscribed ? (
          <div className="bg-success/20 text-success border border-success/30 px-4 py-3 rounded-lg flex items-center gap-2 justify-center">
            <CheckCircle className="w-4 h-4" /> You're subscribed!
          </div>
        ) : expanded ? (
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-3 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-white text-sm placeholder:text-secondary-500 focus:outline-none focus:border-primary-500 min-w-0"
            />
            <Button type="submit" isLoading={loading} rightIcon={<Send className="w-4 h-4" />} className="flex-shrink-0">Subscribe</Button>
          </form>
        ) : (
          <Button onClick={() => setExpanded(true)} leftIcon={<Mail className="w-4 h-4" />}>Subscribe to Updates</Button>
        )}
        <p className="text-secondary-600 text-caption mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}