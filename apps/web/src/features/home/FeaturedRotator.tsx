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
      api.get('/opportunities', { params: { status: 'PUBLISHED', limit: 3 } })
        .then(r => r.data.data
          .filter((x: any) => x.computedStatus !== 'CLOSED')
          .map((x: any) => ({ ...x, typeLabel: 'Opportunity', link: `/opportunities/${x.id}`, icon: 'briefcase' }))
        )
        .catch(() => []),
      api.get('/news', { params: { status: 'PUBLISHED', limit: 3 } })
        .then(r => r.data.data.map((x: any) => ({ ...x, typeLabel: 'News', link: `/news/${x.slug || x.id}`, icon: 'news' })))
        .catch(() => []),
      api.get('/courses', { params: { status: 'PUBLISHED', limit: 3 } })
        .then(r => r.data.data.map((x: any) => ({ ...x, typeLabel: 'Course', link: `/academy/${x.slug || x.id}`, icon: 'course' })))
        .catch(() => []),
      api.get('/services', { params: { status: 'PUBLISHED', limit: 3 } })
        .then(r => r.data.data.map((x: any) => ({ ...x, typeLabel: 'Service', link: `/services/${x.slug || x.id}`, icon: 'service' })))
        .catch(() => []),
    ]).then(([opps, news, courses, services]) => {
      const combined = [...opps, ...news, ...courses, ...services]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.publishedAt || a.updatedAt || 0).getTime();
          const dateB = new Date(b.createdAt || b.publishedAt || b.updatedAt || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 6);
      setItems(combined);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-secondary-50"><div className="container-page text-center py-10"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  if (items.length === 0) return null;

  return (
    <section className="section-padding-sm bg-secondary-50">
      <div className="container-page">
        <div className="text-center mb-4">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Fresh from Future Scholars</span>
          <h2 className="section-title mt-1">What's New</h2>
        </div>

        <Carousel
          items={items}
          transition="slide"
          autoPlayInterval={6000}
          renderItem={(item) => (
            <div className="px-2">
              <Link to={item.link} className="group block">
                <div className="bg-white rounded-xl border border-secondary-100 shadow-sm hover:shadow-md transition-all flex items-center h-32 md:h-36 overflow-hidden">
                  {/* Small thumbnail */}
                  <div className="w-24 h-full md:w-32 bg-secondary-100 flex-shrink-0">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary-300">
                        {item.icon === 'briefcase' && <Briefcase className="w-6 h-6" />}
                        {item.icon === 'news' && <Newspaper className="w-6 h-6" />}
                        {item.icon === 'course' && <BookOpen className="w-6 h-6" />}
                        {item.icon === 'service' && <Wrench className="w-6 h-6" />}
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center">
                    <span className="text-caption font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full inline-block w-fit mb-1">
                      {item.typeLabel}
                    </span>
                    <h3 className="font-semibold text-secondary-900 text-sm md:text-base group-hover:text-primary-600 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-secondary-500 line-clamp-1 md:line-clamp-2 mt-0.5">
                      {item.summary || item.description || item.content?.slice(0, 120)}
                    </p>
                  </div>

                  <div className="pr-4 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-secondary-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
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