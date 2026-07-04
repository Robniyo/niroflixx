import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, ArrowRight, Plus, Bell, Send, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function LearningCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [requestForm, setRequestForm] = useState({ category: '', email: '' });
  const [notifyForm, setNotifyForm] = useState({ email: '' });

  useEffect(() => {
    Promise.all([
      api.get('/categories').then(r => r.data.data || []).catch(() => []),
      api.get('/courses', { params: { status: 'PUBLISHED' } }).then(r => r.data.data || []).catch(() => []),
    ]).then(([cats, courses]) => {
      const catsWithCount = cats.map((cat: any) => ({
        ...cat,
        courseCount: courses.filter((c: any) => c.categoryId === cat.id).length,
      }));
      setCategories(catsWithCount);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/subscribers', { name: requestForm.category, email: requestForm.email, interests: `Category Request: ${requestForm.category}` });
      toast.success('Request sent!');
      setShowRequest(false);
      setRequestForm({ category: '', email: '' });
    } catch { toast.error('Failed'); }
  };

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/subscribers', { name: selectedCat?.name, email: notifyForm.email, interests: `Notify: ${selectedCat?.name}` });
      toast.success("We'll notify you!");
      setShowNotify(false);
      setNotifyForm({ email: '' });
    } catch { toast.error('Failed'); }
  };

  const displayedCategories = expanded ? categories : categories.slice(0, 6);

  if (loading) return <section className="section-padding bg-white"><div className="container-page text-center py-8"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Explore</span>
          <h2 className="section-title mt-2">Learning Categories</h2>
          <p className="section-subtitle">Choose a field you're interested in. Don't see yours? Request it below.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {displayedCategories.map((cat) => (
            <div key={cat.id} className="group">
              {cat.courseCount > 0 ? (
                <Link to={`/academy?category=${cat.id}`} className="block bg-secondary-50 rounded-xl border border-secondary-100 p-4 text-center hover:shadow-md hover:border-primary-200 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-colors">
                    <Folder className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="font-medium text-secondary-900 text-sm">{cat.name}</p>
                  <p className="text-xs text-primary-600 mt-1">{cat.courseCount} course{cat.courseCount !== 1 ? 's' : ''}</p>
                </Link>
              ) : (
                <button onClick={() => { setSelectedCat(cat); setShowNotify(true); }} className="block w-full bg-secondary-50 rounded-xl border border-dashed border-secondary-200 p-4 text-center hover:bg-primary-50 hover:border-primary-200 transition-all">
                  <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-accent-500" />
                  </div>
                  <p className="font-medium text-secondary-900 text-sm">{cat.name}</p>
                  <span className="text-xs text-accent-600 mt-1 block">Coming Soon</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {categories.length > 6 && (
          <div className="text-center mb-4">
            <button onClick={() => setExpanded(!expanded)} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
              {expanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All ({categories.length} categories)</>}
            </button>
          </div>
        )}

        <div className="text-center">
          <button onClick={() => setShowRequest(true)} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
            <Plus className="w-4 h-4" /> Don't see your field? Request a category
          </button>
        </div>
      </div>

      {showRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRequest(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
            <h3 className="font-semibold text-lg mb-4">Request a Category</h3>
            <form onSubmit={handleRequest} className="space-y-3">
              <input type="text" required value={requestForm.category} onChange={e => setRequestForm({...requestForm, category: e.target.value})} placeholder="e.g. Robotics" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              <input type="email" required value={requestForm.email} onChange={e => setRequestForm({...requestForm, email: e.target.value})} placeholder="Your email" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              <Button type="submit" className="w-full" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>Send Request</Button>
            </form>
          </div>
        </div>
      )}

      {showNotify && selectedCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotify(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-in text-center">
            <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-accent-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{selectedCat.name}</h3>
            <p className="text-body-sm text-secondary-500 mb-4">No courses yet. We'll notify you when they're available!</p>
            <form onSubmit={handleNotify} className="space-y-3">
              <input type="email" required value={notifyForm.email} onChange={e => setNotifyForm({...notifyForm, email: e.target.value})} placeholder="Your email" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              <Button type="submit" className="w-full" size="sm" rightIcon={<Bell className="w-3.5 h-3.5" />}>Notify Me</Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}