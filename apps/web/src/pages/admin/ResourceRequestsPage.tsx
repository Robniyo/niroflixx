import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, User, Mail, Calendar, X } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function ResourceRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const r = await api.get('/resources/requests');
      setRequests(r.data.data);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/resources/requests/${id}/approve`);
      toast.success('Request approved');
      fetchRequests();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.put(`/resources/requests/${id}/reject`);
      toast.success('Request rejected');
      fetchRequests();
    } catch {
      toast.error('Failed to reject');
    }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h4 font-bold text-secondary-900">Resource Requests</h1>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200">
          <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-500">No requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-secondary-900">{req.name}</p>
                  <p className="text-sm text-secondary-500">{req.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {req.status}
                </span>
              </div>
              <p className="text-sm text-secondary-600 mb-2">Resource: <strong>{req.resource?.title}</strong></p>
              
              {/* SCREENSHOT - Iyo uyikandije irafunguka */}
              {req.screenshot && (
                <div className="mb-3">
                  <p className="text-xs text-secondary-500 mb-1">Payment Proof (Click to enlarge):</p>
                  <img 
                    src={req.screenshot} 
                    alt="Proof" 
                    className="w-32 h-20 object-cover rounded-lg border cursor-zoom-in hover:opacity-80 transition-opacity" 
                    onClick={() => setZoomedImage(req.screenshot)}
                  />
                </div>
              )}

              <div className="flex gap-3">
                {req.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleApprove(req.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleReject(req.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox (Zoom) */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" 
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt="Zoomed Proof" className="max-w-full max-h-full object-contain cursor-zoom-out rounded-lg shadow-2xl" />
          <button 
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}