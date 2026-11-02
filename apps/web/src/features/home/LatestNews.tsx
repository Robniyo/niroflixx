import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';
import api from '@/services/api';

export default function LatestNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news', { params: { status: 'PUBLISHED', limit: 3 } })
      .then(r => setNews(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-6"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="space-y-4">
      {news.length === 0 ? (
        <p className="text-secondary-500 text-sm">Articles coming soon.</p>
      ) : (
        news.map((item) => (
          <Link to={`/news/${item.slug || item.id}`} key={item.id} className="group flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-secondary-100 hover:shadow-md transition-all">
            {/* Ifoto: Kuri mobile iba hejuru (w-full), kuri desktop iba ibumoso (w-32) */}
            <div className="w-full sm:w-32 h-40 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary-50">
              {item.coverImage ? (
                <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Newspaper className="w-6 h-6 text-secondary-300" /></div>
              )}
            </div>
            {/* Amakuru: Kuri mobile aba munsi y'ifoto */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="text-xs font-semibold text-primary-600 mb-1">{item.category?.name || 'General'}</span>
              <h4 className="font-bold text-secondary-900 text-sm leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-secondary-500 mt-1 line-clamp-2">
                {item.summary}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-secondary-400 mt-2">
                {item.author && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.author}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}