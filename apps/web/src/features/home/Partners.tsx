import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/partners').then(r => setPartners(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-secondary-50"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;
  if (partners.length === 0) return null;

  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-page text-center">
        <span className="text-secondary-500 font-semibold text-label uppercase tracking-wider">Trusted By</span>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-8">
          {partners.map((p) => (
            <div key={p.id} className="text-secondary-400 font-bold text-h5 opacity-50 hover:opacity-100 transition-opacity">
              {p.logo ? <img src={p.logo} alt={p.name} className="h-10 object-contain" /> : p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}