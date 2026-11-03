import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Download, Eye, LinkIcon, X, Send, User, Mail, Smartphone } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function ResourceDetailPage() {
  const { slug } = useParams();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'choose' | 'ussd' | 'upload'>('choose');
  const [paymentForm, setPaymentForm] = useState({ name: '', email: '', screenshot: '' });
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [donePayment, setDonePayment] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/resources`).then(r => {
      const found = r.data.data?.find((item: any) => item.slug === slug || item.id === slug);
      setResource(found || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPayment(true);
    try {
      await api.post('/resources/request', {
        resourceId: resource.id,
        name: paymentForm.name,
        email: paymentForm.email,
        screenshot: paymentForm.screenshot,
      });
      setDonePayment(true);
      setTimeout(() => { setShowPayment(false); setDonePayment(false); setPaymentForm({ name: '', email: '', screenshot: '' }); setPaymentStep('choose'); }, 3000);
    } catch {
      toast.error('Failed to send request');
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (!resource) return <div className="pt-32 pb-16 text-center"><h1 className="text-h2">Resource Not Found</h1><Link to="/resources" className="text-primary-600 mt-4 inline-block">Back to Resources</Link></div>;

  const isPaid = resource.price > 0;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content max-w-3xl mx-auto">
        <Link to="/resources" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-100 p-8">
          <div className="flex items-start gap-4 mb-6">
            {resource.thumbnail ? (
              <img src={resource.thumbnail} alt={resource.title} className="w-16 h-16 object-contain rounded-xl bg-secondary-50 flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
            )}
            <div>
              <span className="text-primary-600 font-semibold text-sm">{resource.type || 'Resource'}</span>
              <h1 className="text-h2 font-bold mt-1">{resource.title}</h1>
            </div>
          </div>

          <p className="text-body-lg text-secondary-600 mb-6">{resource.description}</p>

          <div className="flex items-center gap-6 text-body-sm text-secondary-500 mb-8 pb-8 border-b">
            <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {resource.downloadCount || 0} Downloads</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {resource.views || 0} Views</span>
          </div>

          {resource.fileUrl ? (
            <div>
              {isPaid ? (
                <div className="text-center bg-secondary-50 rounded-xl p-6">
                  <p className="text-2xl font-bold text-secondary-900 mb-2">
                    {resource.price.toLocaleString()} RWF
                  </p>
                  <p className="text-secondary-500 text-sm mb-6">Pay to download this resource</p>
                  <Button onClick={() => setShowPayment(true)} rightIcon={<Send className="w-4 h-4" />}>
                    Pay & Download
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://niroflixx.onrender.com/api/v1/resources/${resource.id}/download`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-5 h-5" /> Download Resource
                  </a>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center gap-2 px-5 py-3.5 bg-secondary-100 text-secondary-700 rounded-xl font-medium hover:bg-secondary-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied!');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3.5 bg-secondary-100 text-secondary-700 rounded-xl font-medium hover:bg-secondary-200 transition-colors text-sm"
                  >
                    <LinkIcon className="w-4 h-4" /> Copy Link
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-secondary-500">No file attached yet.</p>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPayment(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            {donePayment ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-h4 font-semibold mb-2">Request Sent!</h3>
                <p className="text-secondary-500">We will verify your payment and send you the download link via email.</p>
              </div>
            ) : paymentStep === 'choose' ? (
              <>
                <h3 className="text-h4 font-semibold mb-2">Choose Payment Method</h3>
                <p className="text-secondary-500 text-sm mb-6">Amount: <strong>{resource.price.toLocaleString()} RWF</strong></p>
                <div className="space-y-3">
                  <button onClick={() => setPaymentStep('ussd')} className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-secondary-50 transition-colors">
                    <Smartphone className="w-6 h-6 text-yellow-600" />
                    <div className="text-left">
                      <p className="font-semibold text-secondary-900">MTN Mobile Money</p>
                      <p className="text-xs text-secondary-500">Pay via MTN USSD</p>
                    </div>
                  </button>
                  <button onClick={() => setPaymentStep('ussd')} className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-secondary-50 transition-colors">
                    <Smartphone className="w-6 h-6 text-red-600" />
                    <div className="text-left">
                      <p className="font-semibold text-secondary-900">Airtel Money</p>
                      <p className="text-xs text-secondary-500">Pay via Airtel USSD</p>
                    </div>
                  </button>
                  <button onClick={() => setPaymentStep('ussd')} className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-secondary-50 transition-colors">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-semibold text-secondary-900">MoMo Pay</p>
                      <p className="text-xs text-secondary-500">Pay via MoMo Pay USSD</p>
                    </div>
                  </button>
                </div>
              </>
            ) : paymentStep === 'ussd' ? (
              <>
                <h3 className="text-h4 font-semibold mb-2">Payment Instructions</h3>
                <p className="text-secondary-500 text-sm mb-4">Dial the code below on your phone to pay:</p>
                <div className="bg-secondary-50 p-4 rounded-xl text-center mb-6">
                  <p className="text-lg font-bold text-primary-700 mb-2">*182*1*1*0795064502#</p>
                  <p className="text-sm text-secondary-600">Name: ROBERT NIYONKURU</p>
                  <p className="text-sm text-secondary-600">Amount: {resource.price.toLocaleString()} RWF</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setPaymentStep('choose')}>Back</Button>
                  <Button className="flex-1" onClick={() => setPaymentStep('upload')}>I have paid</Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-h4 font-semibold mb-2">Upload Payment Proof</h3>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" /><input type="text" required value={paymentForm.name} onChange={e => setPaymentForm({ ...paymentForm, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" /><input type="email" required value={paymentForm.email} onChange={e => setPaymentForm({ ...paymentForm, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Screenshot *</label>
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-secondary-50 border rounded-lg cursor-pointer hover:bg-secondary-100 text-sm">
                      <Send className="w-4 h-4" /> {paymentForm.screenshot ? 'Screenshot Uploaded ✓' : 'Upload Screenshot'}
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const fd = new FormData();
                        fd.append('file', f);
                        try {
                          const res = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                          setPaymentForm({ ...paymentForm, screenshot: res.data.data.url });
                          toast.success('Screenshot uploaded');
                        } catch {
                          toast.error('Upload failed');
                        }
                      }} />
                    </label>
                    {paymentForm.screenshot && <span className="text-xs text-success">Uploaded ✓</span>}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setPaymentStep('ussd')}>Back</Button>
                    <Button type="submit" className="flex-1" isLoading={submittingPayment}>Submit</Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && resource.fileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
              <h3 className="font-semibold text-secondary-900">{resource.title}</h3>
              <button onClick={() => setShowPreview(false)} className="p-1.5 hover:bg-secondary-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-secondary-50" style={{ height: 'calc(90vh - 80px)' }}>
              <iframe
                src={`https://niroflixx.onrender.com/api/v1/resources/${resource.id}/preview`}
                title={resource.title}
                className="w-full h-full rounded-xl border bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}