import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news', { params: { status: 'PUBLISHED' } }).then(r => setNews(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-info font-semibold text-label uppercase tracking-wider">News</span>
          <h1 className="text-h1 mt-3 mb-4">Technology News & Updates</h1>
          <p className="text-body-lg text-secondary-600 max-w-2xl mx-auto">Stay updated with technology trends, educational news, and opportunity alerts.</p>
        </div>
        {news.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-info-light rounded-2xl flex items-center justify-center mx-auto mb-6"><Newspaper className="w-10 h-10 text-info" /></div>
            <h3 className="text-h4 font-semibold mb-3">Articles Coming Soon</h3>
            <p className="text-secondary-500 mb-8">Stay tuned.</p>
            <Link to="/register"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Subscribe</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link to={`/news/${item.slug || item.id}`} key={item.id} className="group">
                <div className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="h-40 bg-gradient-to-br from-info to-blue-700 flex items-center justify-center">
                    {item.coverImage ? <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" /> : <Newspaper className="w-12 h-12 text-white/40" />}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-caption text-info font-medium">{item.category?.name || 'General'}</span>
                    <h3 className="font-semibold mt-1 mb-2 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                    <p className="text-body-sm text-secondary-500 mb-4 flex-1">{item.summary?.slice(0, 120)}...</p>
                    <div className="flex items-center gap-3 text-caption text-secondary-400 pt-3 border-t">
                      {item.author && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.author}</span>}
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
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