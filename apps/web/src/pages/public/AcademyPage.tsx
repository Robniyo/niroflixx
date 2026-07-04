import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Clock, Users } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import AdBanner from '@/components/ui/AdBanner';


export default function AcademyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses', { params: { status: 'PUBLISHED' } }).then(r => setCourses(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Academy</span>
          <h1 className="text-h1 mt-3 mb-4">Digital Skills Academy</h1>
          <p className="text-body-lg text-secondary-600 max-w-2xl mx-auto">Master in-demand tech skills with expert-led training.</p>
        </div>
        <AdBanner position="sidebar" />

        {courses.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6"><GraduationCap className="w-10 h-10 text-primary-400" /></div>
            <h3 className="text-h4 font-semibold mb-3">Courses Coming Soon</h3>
            <p className="text-secondary-500 mb-8">Our team is preparing high-quality courses.</p>
            <Link to="/contact"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Suggest a Course</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Link to={`/academy/${c.slug || c.id}`} key={c.id} className="group">
                <div className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    {c.thumbnail ? <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" /> : <GraduationCap className="w-12 h-12 text-white/40" />}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-caption text-primary-600 font-medium">{c.level} • {c.type?.replace('_', ' ')}</span>
                    <h3 className="font-semibold mt-1 mb-2 group-hover:text-primary-600 transition-colors">{c.title}</h3>
                    <p className="text-body-sm text-secondary-500 mb-4 line-clamp-2">{c.description}</p>
                    <div className="flex items-center gap-4 text-body-sm text-secondary-400 mt-auto pt-3 border-t">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.duration || 'Flexible'}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.enrollmentCount || 0}</span>
                    </div>
                    <p className="text-primary-600 font-bold mt-2">{c.price === 0 ? 'Free' : `${c.price.toLocaleString()} RWF`}</p>
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