import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Clock, Users, Star } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses', { params: { status: 'PUBLISHED', featured: true, limit: 6 } })
      .then(r => setCourses(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-secondary-50"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Learn & Grow</span>
          <h2 className="section-title mt-2">Featured Courses</h2>
          <p className="section-subtitle">Master in-demand tech skills with expert-led training.</p>
        </div>

        {courses.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-secondary-100 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-primary-400" />
            </div>
            <h4 className="text-h4 font-semibold text-secondary-800 mb-3">Courses Coming Soon</h4>
            <p className="text-secondary-500 mb-8">Our team is preparing high-quality courses. Check back soon.</p>
            <Link to="/academy"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Browse Academy</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           {courses.map((course) => (
  <Link to={`/academy/${course.slug || course.id}`} key={course.id} className="group">
    <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="h-44 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <GraduationCap className="w-16 h-16 text-white/40" />
        )}
        <div className="absolute top-3 left-3"><span className="bg-white/90 backdrop-blur-sm text-secondary-900 text-caption font-medium px-2.5 py-1 rounded-full">{course.level}</span></div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors mb-2">{course.title}</h3>
        <div className="flex items-center gap-4 text-body-sm text-secondary-400 mt-auto pt-4 border-t border-secondary-100">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration || 'Flexible'}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrollmentCount || 0}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-h6 font-bold text-primary-600">{course.price === 0 ? 'Free' : `${course.price.toLocaleString()} RWF`}</span>
          <span className="text-primary-600 text-body-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Learn More <ArrowRight className="w-3.5 h-3.5" /></span>
        </div>
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