import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Newspaper, BookOpen, Wrench, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import Carousel from '@/components/ui/Carousel';

export default function FeaturedRotator() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/opportunities', { params: { status: 'PUBLISHED', limit: 5 } }).then(r => r.data.data.map((x: any) => ({ ...x, typeLabel: 'Opportunity', link: `/opportunities/${x.id}`, icon: 'briefcase' }))).catch(() => []),
      api.get('/news', { params: { status: 'PUBLISHED', limit: 5 } }).then(r => r.data.data.map((x: any) => ({ ...x, typeLabel: 'News', link: `/news/${x.slug || x.id}`, icon: 'news' }))).catch(() => []),
      api.get('/courses', { params: { status: 'PUBLISHED', limit: 5 } }).then(r => r.data.data.map((x: any) => ({ ...x, typeLabel: 'Course', link: `/academy/${x.slug || x.id}`, icon: 'course' }))).catch(() => []),
      api.get('/services', { params: { status: 'PUBLISHED', limit: 5 } }).then(r => r.data.data.map((x: any) => ({ ...x, typeLabel: 'Service', link: `/services/${x.slug || x.id}`, icon: 'service' }))).catch(() => []),
    ]).then(([opps, news, courses, services]) => {
      const combined = [...opps, ...news, ...courses, ...services].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.publishedAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.publishedAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      }).slice(0, 8);
      setItems(combined);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-secondary-50"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Fresh from Future Scholars</span>
          <h2 className="section-title mt-2">What's New</h2>
          <p className="section-subtitle">Latest opportunities, news, courses, and services.</p>
        </div>

        <Carousel
          items={items}
          transition="slide"
          autoPlayInterval={8000}
          renderItem={(item) => (
            <div className="px-4 py-2">
              <Link to={item.link} className="group block">
                <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden shadow-lg hover:shadow-xl transition-all aspect-[16/9] flex flex-col md:flex-row">
                  <div className="h-48 md:h-full md:w-1/2 bg-secondary-100">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary-300">
                        {item.icon === 'briefcase' && <Briefcase className="w-16 h-16" />}
                        {item.icon === 'news' && <Newspaper className="w-16 h-16" />}
                        {item.icon === 'course' && <BookOpen className="w-16 h-16" />}
                        {item.icon === 'service' && <Wrench className="w-16 h-16" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center p-6 md:p-8">
                    <span className="text-caption font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full inline-block w-fit mb-3">
                      {item.typeLabel}
                    </span>
                    <h3 className="text-h3 md:text-h2 font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-body-lg text-secondary-600 mb-4 line-clamp-3">
                      {item.summary || item.description || item.content?.slice(0, 150)}
                    </p>
                    <div className="flex items-center gap-2 text-primary-600 font-medium">
                      View {item.typeLabel} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        />
      </div>
    </section>
  );
}