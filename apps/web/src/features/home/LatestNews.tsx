import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function LatestNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news', { params: { status: 'PUBLISHED', limit: 3 } })
      .then(r => setNews(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div>
      {news.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-secondary-500">Articles coming soon.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {news.map((item) => (
            <Link to={`/news/${item.slug || item.id}`} key={item.id} className="group flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-secondary-100 hover:shadow-md transition-all">
              <div className="w-full sm:w-40 h-32 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl bg-secondary-50">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Newspaper className="w-8 h-8 text-secondary-300" /></div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                <span className="text-xs font-semibold text-primary-600 mb-1">{item.category?.name || 'General'}</span>
                <h4 className="font-bold text-secondary-900 text-base sm:text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-sm text-secondary-500 mt-1 line-clamp-2">
                  {item.summary}
                </p>
                <div className="flex items-center gap-4 text-xs text-secondary-400 mt-3">
                  {item.author && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {item.author}</span>}
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}