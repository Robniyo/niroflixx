import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Copy, ExternalLink } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function MyRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services/my-requests')
      .then(r => setRequests(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyPaymentLink = (link: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/pay/${link}`);
    toast.success('Payment link copied!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="container-page max-w-4xl py-8">
        <h1 className="text-h3 font-bold text-secondary-900 mb-6">My Service Requests</h1>
        {requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <Wrench className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">You haven't made any service requests yet.</p>
            <Link to="/services" className="text-primary-600 font-medium mt-4 inline-block">Browse Services</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl border p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{req.service?.title || 'Unknown Service'}</h3>
                    <p className="text-sm text-secondary-500">{req.description || 'No description'}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-secondary-100 px-2 py-1 rounded-full">Status: {req.status}</span>
                      <span className="text-xs bg-secondary-100 px-2 py-1 rounded-full">Payment: {req.paymentStatus}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {req.totalAmount && (
                      <div className="text-sm">
                        <span className="text-secondary-500">Amount: </span>
                        <span className="font-bold">{req.totalAmount.toLocaleString()} RWF</span>
                      </div>
                    )}
                    {req.paymentLink && req.paymentStatus !== 'PAID' && (
                      <Button size="sm" variant="outline" onClick={() => copyPaymentLink(req.paymentLink)}>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Payment Link
                      </Button>
                    )}
                    {req.paymentProof && (
                      <a href={req.paymentProof} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> View Proof
                      </a>
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