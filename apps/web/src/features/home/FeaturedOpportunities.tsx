import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Calendar, MapPin } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function FeaturedOpportunities() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/opportunities', { params: { status: 'PUBLISHED', featured: true, limit: 4 } })
      .then(r => setItems(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-white"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-accent-600 font-semibold text-label uppercase tracking-wider">Don't Miss Out</span>
          <h2 className="section-title mt-2">Featured Opportunities</h2>
          <p className="section-subtitle">Scholarships, jobs, internships, and admissions curated for you.</p>
        </div>

        {items.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-accent-50 rounded-2xl shadow-sm border border-accent-100 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-accent-400" />
            </div>
            <h4 className="text-h4 font-semibold text-secondary-800 mb-3">Opportunities Coming Soon</h4>
            <p className="text-secondary-500 mb-8">We're gathering the best opportunities for you.</p>
            <Link to="/opportunities"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>View All Opportunities</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {items.map((opp) => (
              <Link to={`/opportunities/${opp.id}`} key={opp.id} className="group">
                <div className="bg-secondary-50 rounded-xl border border-secondary-100 p-6 h-full flex gap-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-caption font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{opp.type?.replace('_', ' ')}</span>
                    <h3 className="font-semibold text-secondary-900 mt-1.5 group-hover:text-primary-600 transition-colors">{opp.title}</h3>
                    <p className="text-body-sm text-secondary-500 mt-0.5">{opp.organization}</p>
                    <div className="flex items-center gap-3 mt-3 text-body-sm text-secondary-400">
                      {opp.country && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {opp.country}</span>}
                      {opp.deadline && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(opp.deadline).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}