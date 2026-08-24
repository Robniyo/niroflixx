import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import Carousel from '@/components/ui/Carousel';

export default function LatestNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news', { params: { status: 'PUBLISHED', limit: 8 } }).then(r => setNews(r.data.data)).catch(() => {}).finally(() => setLoading(false));
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
            <div className="w-20 h-20 bg-info-light rounded-2xl shadow-sm border border-info-100 flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-10 h-10 text-info" />
            </div>
            <h4 className="text-h4 font-semibold text-secondary-800 mb-3">Articles Coming Soon</h4>
            <p className="text-secondary-500 mb-8">Stay tuned for the latest in tech and education.</p>
            <Link to="/news"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Visit News Page</Button></Link>
          </div>
        ) : (
          <Carousel
            items={news}
            transition="slide"
            autoPlayInterval={10000}
            renderItem={(item) => (
              <div className="px-4 py-2">
                <Link to={`/news/${item.slug || item.id}`} className="group block">
                  <div className="bg-secondary-50 rounded-2xl border border-secondary-100 overflow-hidden shadow-sm hover:shadow-lg transition-all grid md:grid-cols-2">
                    <div className="h-64 md:h-auto">
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-info-100 flex items-center justify-center">
                          <Newspaper className="w-20 h-20 text-info" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className="text-caption font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full inline-block w-fit mb-4">
                        {item.category?.name || 'General'}
                      </span>
                      <h3 className="text-h3 font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-body-lg text-secondary-600 mb-6 line-clamp-3">
                        {item.summary?.slice(0, 180)}...
                      </p>
                      <div className="flex items-center gap-4 text-body-sm text-secondary-400 mb-6">
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" /> {item.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary-600 font-medium">
                        Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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