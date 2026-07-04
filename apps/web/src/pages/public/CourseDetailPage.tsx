import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, GraduationCap, ArrowLeft, Calendar } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    api.get(`/courses/${slug}`).then(r => {
      setCourse(r.data.data);
      api.get('/classes').then(clsRes => {
        const allClasses = clsRes.data.data || [];
        const matching = allClasses.filter((c: any) => c.courseId === r.data.data.id && c.status === 'PUBLISHED');
        setClasses(matching);
      }).catch(() => {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await api.post('/enrollments', { courseId: course.id });
      toast.success('Enrolled successfully!');
      setCourse({ ...course, enrollmentCount: (course.enrollmentCount || 0) + 1 });
    } catch (err: any) { toast.error(err.response?.data?.message || 'Enrollment failed'); }
  };

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (!course) return <div className="pt-32 pb-16 text-center"><h1 className="text-h2">Course Not Found</h1><Link to="/academy" className="text-primary-600 mt-4 inline-block">Back to Academy</Link></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-page">
        <Link to="/academy" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-8"><ArrowLeft className="w-4 h-4" /> Back to Academy</Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-64 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-8">
              {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-2xl" /> : <GraduationCap className="w-20 h-20 text-white/40" />}
            </div>
            <span className="text-primary-600 font-semibold text-sm">{course.level} • {course.type?.replace('_', ' ')}</span>
            <h1 className="text-h2 font-bold mt-2 mb-4">{course.title}</h1>
            <p className="text-body-lg text-secondary-600 mb-8">{course.description}</p>

            {classes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-h4 font-semibold mb-4">Available Classes</h3>
                <div className="space-y-3">
                  {classes.map((cls: any) => (
                    <div key={cls.id} className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{cls.name}</h4>
                          <div className="flex items-center gap-3 text-body-sm text-secondary-500 mt-1">
                            {cls.startDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(cls.startDate).toLocaleDateString()}</span>}
                            {cls.startTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {cls.startTime}</span>}
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {cls.enrolledCount || 0}/{cls.capacity} enrolled</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-caption font-medium bg-success-light text-success-dark">{cls.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-secondary-100 p-6 sticky top-24">
              <div className="text-h3 font-bold text-primary-600 mb-4">{course.price === 0 ? 'Free' : `${course.price.toLocaleString()} RWF`}</div>
              <div className="space-y-3 mb-6 text-body-sm text-secondary-600">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Duration: {course.duration || 'Flexible'}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {course.enrollmentCount || 0} Students Enrolled</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Level: {course.level}</div>
              </div>
              <Button className="w-full" size="lg" onClick={handleEnroll}>{isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}