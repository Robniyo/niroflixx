import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, DollarSign, Clock, ArrowRight, Upload } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/my-enrollments')
      .then(r => setEnrollments(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleQuickPay = async (enrollmentId: string, amount: number) => {
    if (!amount || amount <= 0) return;
    try {
      await api.post('/courses/pay', { enrollmentId, amount });
      toast.success('Payment recorded!');
      // Refresh list
      const r = await api.get('/courses/my-enrollments');
      setEnrollments(r.data.data);
    } catch {
      toast.error('Payment failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="container-page max-w-4xl py-8">
        <h1 className="text-h3 font-bold text-secondary-900 mb-6">My Enrollments</h1>
        {enrollments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <BookOpen className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">You haven't enrolled in any courses yet.</p>
            <Link to="/academy" className="text-primary-600 font-medium mt-4 inline-block">Browse Courses</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map(e => (
              <div key={e.id} className="bg-white rounded-2xl border p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{e.course?.title || 'Unknown Course'}</h3>
                    <p className="text-sm text-secondary-500">Plan: {e.paymentPlan || 'Not selected'}</p>
                    <div className="flex gap-4 mt-3">
                      <div className="text-center">
                        <p className="text-xs text-secondary-500">Paid</p>
                        <p className="font-bold text-success">{(e.amountPaid || 0).toLocaleString()} RWF</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-secondary-500">Total</p>
                        <p className="font-bold">{(e.totalAmount || 0).toLocaleString()} RWF</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-secondary-500">Remaining</p>
                        <p className={`font-bold ${e.remainingBalance > 0 ? 'text-danger' : 'text-success'}`}>
                          {(e.remainingBalance || 0).toLocaleString()} RWF
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      e.paymentStatus === 'PAID' ? 'bg-success-light text-success-dark' :
                      e.paymentStatus === 'PARTIALLY_PAID' ? 'bg-accent-100 text-accent-700' :
                      'bg-secondary-100 text-secondary-600'
                    }`}>{e.paymentStatus}</span>
                    {e.remainingBalance > 0 && (
                      <Button size="sm" onClick={() => {
                        const amt = prompt('Enter amount paid (RWF):', String(e.remainingBalance));
                        if (amt) handleQuickPay(e.id, Number(amt));
                      }}>
                        <DollarSign className="w-3.5 h-3.5 mr-1" /> Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}