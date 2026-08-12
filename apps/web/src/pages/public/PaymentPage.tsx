import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, Upload, DollarSign } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const { link } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofSent, setProofSent] = useState(false);

  useEffect(() => {
    if (!link) return;
    api.get(`/services/payment/${link}`)
      .then(r => setData(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'Payment link invalid or expired'))
      .finally(() => setLoading(false));
  }, [link]);

    const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const proofUrl = uploadRes.data.data.url;

      // Submit proof to backend using the paymentLink from URL
      await api.post('/services/payment-proof', { paymentLink: link, proofUrl });
      setProofSent(true);
      toast.success('Payment proof uploaded! We will verify it shortly.');
    } catch {
      toast.error('Upload failed');
    } finally {
      setProofUploading(false);
    }
  };

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (error) return <div className="pt-32 pb-16 text-center"><h2 className="text-h2 text-danger mb-2">Error</h2><p className="text-secondary-500">{error}</p></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content max-w-2xl">
        <h1 className="text-h2 font-bold mb-6">Complete Your Payment</h1>
        <div className="bg-white rounded-2xl border p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-h4 font-semibold">{data.serviceName}</h3>
            <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">{data.paymentStatus}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-secondary-50 rounded-xl p-4">
              <p className="text-xs text-secondary-500">Total Amount</p>
              <p className="text-xl font-bold">{data.totalAmount?.toLocaleString()} RWF</p>
            </div>
            <div className="bg-secondary-50 rounded-xl p-4">
              <p className="text-xs text-secondary-500">Remaining</p>
              <p className="text-xl font-bold">{data.remainingBalance?.toLocaleString()} RWF</p>
            </div>
          </div>

          {/* Payment instructions */}
          <div className="bg-secondary-50 rounded-xl p-5 space-y-3 text-sm">
            {data.bankDetails && (
              <div>
                <p className="font-medium text-secondary-700">Bank Transfer</p>
                <p className="text-secondary-600 whitespace-pre-line">{data.bankDetails}</p>
              </div>
            )}
            {data.momoDetails && (
              <div>
                <p className="font-medium text-secondary-700">Mobile Money</p>
                <p className="text-secondary-600 whitespace-pre-line">{data.momoDetails}</p>
              </div>
            )}
            {data.instructions && (
              <div>
                <p className="font-medium text-secondary-700">Instructions</p>
                <p className="text-secondary-600 whitespace-pre-line">{data.instructions}</p>
              </div>
            )}
          </div>

          {/* Agreement */}
          <div className="flex items-start gap-3">
            <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 rounded" />
            <label htmlFor="agree" className="text-sm text-secondary-600">
              I understand and agree to the terms. I confirm I have made the payment for this service.
            </label>
          </div>

          {/* Upload Proof */}
          {!proofSent ? (
            <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-3" />
              <p className="font-medium text-secondary-700 mb-1">Upload Payment Proof</p>
              <p className="text-sm text-secondary-500 mb-4">Take a screenshot of your payment and upload it here.</p>
              <label className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg cursor-pointer transition-colors ${agreed ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-secondary-300 text-secondary-500 cursor-not-allowed'}`}>
                <Upload className="w-4 h-4" /> Choose File
                <input type="file" accept="image/*" className="hidden" onChange={handleProofUpload} disabled={!agreed || proofUploading} />
              </label>
              {proofUploading && <p className="text-sm text-secondary-500 mt-2">Uploading...</p>}
            </div>
          ) : (
            <div className="bg-success-light border border-success rounded-2xl p-5 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-success-dark">Proof Uploaded!</h4>
                <p className="text-sm text-success-dark/80">We will verify and confirm your payment shortly.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}