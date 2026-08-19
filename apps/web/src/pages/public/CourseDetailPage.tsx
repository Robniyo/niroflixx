import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, DollarSign, BookOpen, CheckCircle, X, LogIn } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import PaymentModal from '@/components/ui/PaymentModal';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [plan, setPlan] = useState('FULL');
  const [enrollment, setEnrollment] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [payRemainingMode, setPayRemainingMode] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/courses/${slug}`)
      .then(r => setCourse(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (isAuthenticated && course) {
      api.get('/courses/my-enrollments')
        .then(r => {
          const existing = r.data.data.find((e: any) => e.courseId === course.id);
          setEnrollment(existing || null);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, course]);

  const handleLoginConfirm = () => {
    if (!course) return;
    sessionStorage.setItem('enrollAfterLogin', JSON.stringify({ courseSlug: course.slug }));
    setShowLoginPrompt(false);
    window.location.href = '/login';
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (course.price === 0) {
      setEnrolling(true);
      api.post('/courses/enroll', { courseId: course.id, paymentPlan: 'FREE' })
        .then(() => {
          toast.success('Enrolled successfully!');
          return api.get('/courses/my-enrollments');
        })
        .then(r => {
          const existing = r.data.data.find((e: any) => e.courseId === course.id);
          setEnrollment(existing || null);
          return api.get(`/courses/${course.slug}`);
        })
        .then(c => setCourse(c.data.data))
        .catch(err => toast.error(err.response?.data?.message || 'Enrollment failed'))
        .finally(() => setEnrolling(false));
      return;
    }

    let amount = 0;
    if (plan === 'FULL') amount = course.price;
    else if (plan === 'HALF') amount = Math.round(course.price / 2);
    else {
      const input = prompt('Enter amount you are paying now (RWF):', String(Math.round(course.price / 2)));
      amount = input ? Number(input) : 0;
    }

    if (amount <= 0) {
      toast.error('Payment amount required to enroll');
      return;
    }

    setPayRemainingMode(false);
    setPaymentAmount(amount);
    setShowPayment(true);
  };

  const handlePayRemaining = () => {
    if (!enrollment) return;
    const remaining = enrollment.remainingBalance || 0;
    if (remaining <= 0) return;
    setPayRemainingMode(true);
    setPaymentAmount(remaining);
    setShowPayment(true);
  };

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (!course) return <div className="pt-32 pb-16 text-center"><h1 className="text-h2">Course Not Found</h1><Link to="/academy" className="text-primary-600 mt-4 inline-block">Back to Academy</Link></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content max-w-4xl">
        <Link to="/academy" className="flex items-center gap-2 text-sm text-secondary-500 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Academy
        </Link>
        <div className="bg-white rounded-2xl border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <span className="text-primary-600 font-semibold text-sm">{course.level || 'All Levels'}</span>
              <h1 className="text-h2 font-bold">{course.title}</h1>
            </div>
          </div>
          <p className="text-body-lg text-secondary-600 mb-6">{course.description}</p>
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b">
            <div className="text-center">
              <p className="text-h3 font-bold text-primary-600">{course.price === 0 ? 'Free' : `${course.price.toLocaleString()} RWF`}</p>
              <p className="text-sm text-secondary-500">Price</p>
            </div>
            {course.duration && (
              <div className="text-center">
                <p className="text-h3 font-bold text-secondary-900 flex items-center gap-1"><Clock className="w-5 h-5" /> {course.duration}</p>
                <p className="text-sm text-secondary-500">Duration</p>
              </div>
            )}
            {course.enrollmentCount !== undefined && (
              <div className="text-center">
                <p className="text-h3 font-bold text-secondary-900 flex items-center gap-1"><Users className="w-5 h-5" /> {course.enrollmentCount || 0}</p>
                <p className="text-sm text-secondary-500">Enrolled</p>
              </div>
            )}
          </div>

          {course.price === 0 ? (
            <Button size="lg" onClick={handleEnrollClick} isLoading={enrolling}>
              Enroll for Free
            </Button>
          ) : enrollment ? (
            enrollment.paymentStatus === 'PENDING_VERIFICATION' ? (
              <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-700">Payment Under Review</h4>
                  <p className="text-sm text-yellow-700/80">
                    We've received your payment proof. Our team will verify it shortly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-success-light border border-success rounded-2xl p-5 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-success-dark">Already Enrolled</h4>
                  <p className="text-sm text-success-dark/80">
                    Payment status: {enrollment.paymentStatus} | Paid: {(enrollment.amountPaid || 0).toLocaleString()} RWF
                    {enrollment.remainingBalance > 0 && ` | Remaining: ${enrollment.remainingBalance.toLocaleString()} RWF`}
                  </p>
                  <Link to="/dashboard/enrollments" className="text-primary-600 text-sm font-medium underline mt-1 inline-block">
                    View My Enrollments
                  </Link>
                  {enrollment.remainingBalance > 0 && (
                    <div className="mt-3">
                      <Button size="sm" onClick={handlePayRemaining}>
                        Pay Remaining ({enrollment.remainingBalance.toLocaleString()} RWF)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <h3 className="text-h4 font-semibold">Choose a Payment Plan</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {['FULL', 'HALF', 'CUSTOM'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      plan === p ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
                    }`}
                  >
                    <DollarSign className={`w-5 h-5 mx-auto mb-2 ${plan === p ? 'text-primary-600' : 'text-secondary-400'}`} />
                    <p className="font-semibold text-sm">{p === 'FULL' ? 'Full Payment' : p === 'HALF' ? '50% Now' : 'Custom'}</p>
                    <p className="text-xs text-secondary-500 mt-1">
                      {p === 'FULL' ? `${course.price.toLocaleString()} RWF` : p === 'HALF' ? `${Math.round(course.price / 2).toLocaleString()} RWF` : 'Pay what you can'}
                    </p>
                  </button>
                ))}
              </div>
              <Button size="lg" onClick={handleEnrollClick}>
                Enroll Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={() => {
          api.get('/courses/my-enrollments').then(r => {
            const existing = r.data.data.find((e: any) => e.courseId === course.id);
            setEnrollment(existing || null);
          });
          api.get(`/courses/${course.slug}`).then(c => setCourse(c.data.data));
        }}
        amount={paymentAmount}
        title={course.title}
        courseId={payRemainingMode ? undefined : course.id}
        paymentPlan={plan}
        enrollmentId={payRemainingMode ? enrollment?.id : undefined}
        maxAmount={payRemainingMode ? enrollment?.remainingBalance : undefined}
      />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginPrompt(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-h4 font-bold text-secondary-900 mb-2">Login Required</h3>
              <p className="text-body-sm text-secondary-500">
                You need a Future Scholars account to enroll in this course.
              </p>
            </div>
            <div className="bg-secondary-50 rounded-xl p-5 mb-6 text-sm text-secondary-700 space-y-2">
              <p>✅ Your enrollment and payment progress will be saved.</p>
              <p>✅ You can complete your payment after login.</p>
              <p>✅ Access your courses anytime from your dashboard.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowLoginPrompt(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleLoginConfirm}>
                <LogIn className="w-4 h-4 mr-1" /> Continue to Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}