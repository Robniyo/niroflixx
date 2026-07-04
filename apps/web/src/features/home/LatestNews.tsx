import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function LatestNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news', { params: { status: 'PUBLISHED', limit: 3 } }).then(r => setNews(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-white"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-info font-semibold text-label uppercase tracking-wider">Stay Informed</span>
          <h2 className="section-title mt-2">Latest News & Updates</h2>
          <p className="section-subtitle">Technology trends, educational news, and opportunity alerts.</p>
        </div>
        {news.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-info-light rounded-2xl shadow-sm border border-info-100 flex items-center justify-center mx-auto mb-6"><Newspaper className="w-10 h-10 text-info" /></div>
            <h4 className="text-h4 font-semibold text-secondary-800 mb-3">Articles Coming Soon</h4>
            <p className="text-secondary-500 mb-8">Stay tuned for the latest in tech and education.</p>
            <Link to="/news"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Visit News Page</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {news.map((item) => (
              <Link to={`/news/${item.slug || item.id}`} key={item.id} className="group">
                <div className="bg-secondary-50 rounded-xl border border-secondary-100 p-6 h-full flex flex-col hover:shadow-md transition-all">
                  <span className="text-caption font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full inline-block w-fit mb-3">{item.category?.name || 'General'}</span>
                  <h4 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors mb-2">{item.title}</h4>
                  <p className="text-body-sm text-secondary-500 mb-4 flex-1">{item.summary?.slice(0, 100)}...</p>
                  <div className="flex items-center gap-3 text-caption text-secondary-400 pt-3 border-t border-secondary-200">
                    {item.author && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.author}</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
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