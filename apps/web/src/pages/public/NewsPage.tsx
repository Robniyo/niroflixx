import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news', { params: { status: 'PUBLISHED' } })
      .then(r => setNews(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="pt-32 pb-16 bg-secondary-50/30 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-info font-semibold text-label uppercase tracking-wider">News</span>
          <h1 className="text-3xl md:text-5xl font-bold text-secondary-900 mt-3 mb-4">Technology News & Updates</h1>
          <p className="text-secondary-500 text-lg max-w-2xl mx-auto">Stay updated with technology trends, educational news, and opportunity alerts.</p>
        </div>
        
        {news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-secondary-100">
            <Newspaper className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Articles Coming Soon</h3>
            <p className="text-secondary-500 mb-6">Stay tuned for updates.</p>
            <Link to="/register"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Subscribe</Button></Link>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <Link to={`/news/${item.slug || item.id}`} key={item.id} className="group block bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row">
                  {/* Ifoto nto ku ruhande */}
                  <div className="sm:w-1/3 h-56 sm:h-auto bg-secondary-50 relative overflow-hidden flex-shrink-0">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Newspaper className="w-10 h-10 text-secondary-300" /></div>
                    )}
                  </div>
                  {/* Amakuru */}
                  <div className="p-6 flex flex-col justify-center flex-1">
                    <span className="text-xs font-bold text-info uppercase tracking-wider mb-2">{item.category?.name || 'General'}</span>
                    <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-secondary-500 text-sm mb-4 line-clamp-2">{item.summary}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-secondary-400 mt-auto pt-4 border-t border-secondary-50">
                      {item.author && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {item.author}</span>}
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}