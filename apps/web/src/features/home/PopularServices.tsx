import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function PopularServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-secondary-50"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-success font-semibold text-label uppercase tracking-wider">Professional Services</span>
          <h2 className="section-title mt-2">Services We Offer</h2>
          <p className="section-subtitle">CV writing, web development, graphic design, and more.</p>
        </div>

        {services.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-success-light rounded-2xl shadow-sm border border-success-100 flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-10 h-10 text-success" />
            </div>
            <h4 className="text-h4 font-semibold text-secondary-800 mb-3">Services Coming Soon</h4>
            <p className="text-secondary-500 mb-8">Our team is setting up professional services.</p>
            <Link to="/services"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>View All Services</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {services.map((s) => (
              <Link to={`/services/${s.slug || s.id}`} key={s.id} className="group">
                <div className="bg-white rounded-xl border border-secondary-100 p-6 text-center hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Wrench className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-semibold text-secondary-900 mb-2">{s.title}</h4>
                  <p className="text-body-sm text-secondary-500 mb-4 line-clamp-2">{s.description}</p>
                  <span className="text-primary-600 font-semibold text-body-sm">{s.startingPrice === 0 ? 'Free' : `From ${s.startingPrice.toLocaleString()} RWF`}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}