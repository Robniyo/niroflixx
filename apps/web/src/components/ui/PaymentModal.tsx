import { useState, useEffect } from 'react';
import { Upload, CheckCircle, X } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  title: string;
  courseId?: string;
  paymentPlan?: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount, title, courseId, paymentPlan }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofSent, setProofSent] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>({ bankDetails: '', momoDetails: '', instructions: '' });

  useEffect(() => {
    if (isOpen) {
      setProofSent(false);
      setAgreed(false);
      api.get('/services/payment-settings').then(r => setPaymentDetails(r.data.data)).catch(() => {});
    }
  }, [isOpen]);

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const proofUrl = uploadRes.data.data.url;

      if (courseId) {
        // Create pending enrollment with proof
        await api.post('/courses/enroll', {
          courseId,
          paymentPlan,
          amountPaid: amount,
          proofUrl,
        });
      }

      setProofSent(true);
      toast.success('Payment proof uploaded! Awaiting admin approval.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setProofUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-secondary-50 rounded-lg">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-h4 font-bold mb-4">Complete Payment</h3>
        <p className="text-sm text-secondary-500 mb-4">Pay for <strong>{title}</strong></p>
        <div className="bg-primary-50 rounded-xl p-4 mb-4 text-center">
          <p className="text-xs text-secondary-500">Amount to Pay</p>
          <p className="text-2xl font-bold text-primary-600">{amount.toLocaleString()} RWF</p>
        </div>

        <div className="bg-secondary-50 rounded-xl p-4 space-y-2 text-sm mb-4">
          {paymentDetails.bankDetails && <p className="whitespace-pre-line">{paymentDetails.bankDetails}</p>}
          {paymentDetails.momoDetails && <p className="whitespace-pre-line">{paymentDetails.momoDetails}</p>}
          {paymentDetails.instructions && <p className="text-secondary-500 text-xs whitespace-pre-line">{paymentDetails.instructions}</p>}
        </div>

        <label className="flex items-start gap-2 mb-4">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 rounded" />
          <span className="text-sm text-secondary-600">I have sent the payment. I understand it will be verified by the admin.</span>
        </label>

        {!proofSent ? (
          <label className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg cursor-pointer ${agreed ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-secondary-300 text-secondary-500 cursor-not-allowed'}`}>
            <Upload className="w-4 h-4" /> Upload Screenshot
            <input type="file" accept="image/*" className="hidden" onChange={handleProofUpload} disabled={!agreed || proofUploading} />
          </label>
        ) : (
          <div className="bg-success-light border border-success rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
            <p className="text-sm text-success-dark">Proof uploaded! Awaiting admin approval...</p>
          </div>
        )}
      </div>
    </div>
  );
}