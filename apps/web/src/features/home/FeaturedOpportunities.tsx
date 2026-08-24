import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Calendar, MapPin } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import Carousel from '@/components/ui/Carousel';

export default function FeaturedOpportunities() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/opportunities', { params: { status: 'PUBLISHED', featured: true, limit: 8 } })
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
          <Carousel
            items={items}
            transition="slide"
            autoPlayInterval={10000}
            renderItem={(opp) => (
              <div className="px-4 py-2">
                <Link to={`/opportunities/${opp.id}`} className="group block">
                  <div className="bg-secondary-50 rounded-2xl border border-secondary-100 overflow-hidden shadow-sm hover:shadow-lg transition-all grid md:grid-cols-2">
                    <div className="h-64 md:h-auto">
                      {opp.coverImage ? (
                        <img src={opp.coverImage} alt={opp.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-accent-100 flex items-center justify-center">
                          <Briefcase className="w-20 h-20 text-accent-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-caption font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                          {opp.type?.replace('_', ' ')}
                        </span>
                        {opp.deadline && (
                          <span className="text-caption font-medium text-accent-700 bg-accent-50 px-3 py-1 rounded-full">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-h3 font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-body-lg text-secondary-600 mb-4">{opp.organization}</p>
                      <div className="flex items-center gap-4 text-body-sm text-secondary-400 mb-6">
                        {opp.country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {opp.country}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-primary-600 font-medium">
                        View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          />
        )}
      </div>
    </section>
  );
}