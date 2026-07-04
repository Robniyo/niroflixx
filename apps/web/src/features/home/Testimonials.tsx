import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import api from '@/services/api';

export default function Testimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/testimonials/published').then(r => setItems(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-white"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Testimonials</span>
          <h2 className="section-title mt-2">What Our Users Say</h2>
          <p className="section-subtitle">Real stories from students and professionals who use Niroflixx.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((t) => (
            <div key={t.id} className="bg-secondary-50 rounded-2xl border border-secondary-100 p-8 text-center">
              <Quote className="w-8 h-8 text-primary-200 mx-auto mb-4" />
              <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-5 h-5 fill-accent-400 text-accent-400" />)}</div>
              <p className="text-secondary-600 mb-6 italic">"{t.quote}"</p>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-primary-600 font-bold">{t.name?.[0]}</span></div>
              <p className="font-semibold text-secondary-900">{t.name}</p>
              {t.role && <p className="text-body-sm text-secondary-500">{t.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}