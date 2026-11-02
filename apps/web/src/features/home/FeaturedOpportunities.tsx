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

  if (loading) return <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div>
      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-secondary-500">Opportunities coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((opp) => (
            <Link to={`/opportunities/${opp.id}`} key={opp.id} className="group bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-lg transition-all flex flex-col">
              
              {/* Image Section */}
              <div className="relative h-48 w-full bg-secondary-100 overflow-hidden">
                {opp.coverImage ? (
                  <img 
                    src={opp.coverImage} 
                    alt={opp.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary-50">
                    <Briefcase className="w-10 h-10 text-secondary-300" />
                  </div>
                )}
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm">
                  {opp.type?.replace('_', ' ')}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-secondary-900 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                  {opp.title}
                </h3>
                <p className="text-sm text-secondary-500 mb-4">{opp.organization}</p>
                
                <div className="mt-auto pt-4 border-t border-secondary-100 flex items-center justify-between text-xs font-medium text-secondary-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-secondary-400" /> 
                    <span className="truncate max-w-[100px]">{opp.country || 'Global'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-danger">
                    <Calendar className="w-4 h-4" /> 
                    <span>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Open'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}