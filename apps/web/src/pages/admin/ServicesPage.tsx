import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Wrench, MessageSquare, Copy, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm = { title:'', description:'', categoryId:'', startingPrice:0, estimatedTime:'', icon:'', status:'PUBLISHED', featured:false };

export default function ServicesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'services' | 'requests'>('services');
  
  // For payment link generation
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [quoteAmount, setQuoteAmount] = useState('');

  useEffect(()=>{
    fetchItems();
    fetchServiceRequests();
  },[]);

  const fetchItems = async()=>{try{const r=await api.get('/services');setItems(r.data.data);}catch{}finally{setLoading(false);}};
  
  const fetchServiceRequests = async () => {
    try {
      const r = await api.get('/admin/service-requests');
      setServiceRequests(r.data.data);
    } catch {}
  };

  const openCreate = ()=>{setEditing(null);setForm(emptyForm);setShowModal(true);};
    const openEdit = async(id:string)=>{try{const r=await api.get(`/services/id/${id}`);const d=r.data.data;setForm({title:d.title||'',description:d.description||'',categoryId:d.categoryId||'',startingPrice:d.startingPrice||0,estimatedTime:d.estimatedTime||'',icon:d.icon||'',status:d.status,featured:d.featured});setEditing(id);setShowModal(true);}catch{}};
  const handleSave = async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{if(editing){await api.put(`/services/${editing}`,form);toast.success('Updated');}else{await api.post('/services',form);toast.success('Created');}setShowModal(false);fetchItems();}catch(err:any){toast.error(err.response?.data?.message||'Failed');}finally{setSaving(false);}};
  const handleDelete = async(id:string)=>{if(!confirm('Archive?'))return;try{await api.delete(`/services/${id}`);toast.success('Archived');fetchItems();}catch{}};

  // Generate payment link for a service request
  const handleGeneratePaymentLink = async (reqId: string) => {
    setGeneratingLink(reqId);
    try {
      const amount = quoteAmount || null;
      const res = await api.post(`/services/generate-payment-link/${reqId}`, { totalAmount: amount ? Number(amount) : undefined });
      const paymentLink = res.data.data.paymentLink;
      const fullUrl = `${window.location.origin}/pay/${paymentLink}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Payment link generated and copied!');
      setQuoteAmount('');
      setSelectedRequest(null);
      fetchServiceRequests();
    } catch {
      toast.error('Failed to generate link');
    } finally {
      setGeneratingLink(null);
    }
  };
    const updatePaymentStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/services/payment-status/${id}`, { paymentStatus: status });
      toast.success(`Payment ${status}`);
      fetchServiceRequests();
    } catch {
      toast.error('Failed to update');
    }
  };

  if(loading)return<div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Services</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} services</p></div>
        <Button leftIcon={<Plus className="w-4 h-4"/>} onClick={openCreate}>Add Service</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('services')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'services' ? 'bg-primary-600 text-white shadow-md' : 'bg-white border text-secondary-600 hover:bg-secondary-50'}`}>Services</button>
        <button onClick={() => setTab('requests')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === 'requests' ? 'bg-primary-600 text-white shadow-md' : 'bg-white border text-secondary-600 hover:bg-secondary-50'}`}>
          <MessageSquare className="w-4 h-4" /> Requests {serviceRequests.length > 0 && <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">{serviceRequests.length}</span>}
        </button>
      </div>

      {/* Services Tab */}
      {tab === 'services' && (
        <>
          {items.length===0?(
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><Wrench className="w-12 h-12 text-secondary-300 mx-auto mb-3"/><p className="text-secondary-500">No services yet.</p></div>
          ):(
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(s=>(<div key={s.id} className="bg-white rounded-xl border border-secondary-100 p-5 hover:shadow-md transition-all"><h3 className="font-semibold text-secondary-900">{s.title}</h3><p className="text-body-sm text-secondary-500 mt-1 line-clamp-2">{s.description}</p><div className="flex items-center justify-between mt-3"><span className="text-primary-600 font-semibold text-sm">{s.startingPrice===0?'Free':`${s.startingPrice.toLocaleString()} RWF`}</span><span className={`px-2 py-0.5 rounded-full text-caption ${s.status==='PUBLISHED'?'bg-success-light text-success-dark':'bg-secondary-100 text-secondary-600'}`}>{s.status}</span></div><div className="flex gap-2 mt-3"><button onClick={()=>openEdit(s.id)} className="text-xs text-primary-600 hover:underline">Edit</button><button onClick={()=>handleDelete(s.id)} className="text-xs text-danger hover:underline">Delete</button></div></div>))}
            </div>
          )}
        </>
      )}

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {serviceRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-secondary-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500 font-medium">No service requests yet</p>
              <p className="text-secondary-400 text-body-sm mt-1">When clients request a service, they will appear here.</p>
            </div>
          ) : (
            serviceRequests.map((req: any) => (
              <div key={req.id} className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{req.service?.title || 'Unknown Service'}</h3>
                   {(() => {
                    let info: any = {};
                    try { info = JSON.parse(req.notes || '{}'); } catch {}
                    return (
                      <>
                        <p className="text-body-sm text-secondary-500">Requested by: {info.name || 'Unknown'} ({info.email || 'no email'})</p>
                        <p className="text-sm text-secondary-400">Phone: {info.phone || 'N/A'}</p>
                      </>
                    );
                  })()}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      req.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                      req.paymentStatus === 'PENDING_VERIFICATION' ? 'bg-yellow-100 text-yellow-700' :
                      req.paymentStatus === 'UNPAID' ? 'bg-gray-100 text-gray-600' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {req.paymentStatus === 'PENDING_VERIFICATION' && <AlertCircle className="w-3.5 h-3.5" />}
                      {req.paymentStatus === 'PAID' && <CheckCircle className="w-3.5 h-3.5" />}
                      {req.paymentStatus || 'UNPAID'}
                    </span>
                    {req.paymentLink && (
                      <div className="mt-1 text-xs text-primary-600">
                        <button onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/pay/${req.paymentLink}`);
                          toast.success('Payment link copied!');
                        }} className="hover:underline flex items-center gap-1">
                          <Copy className="w-3 h-3" /> Copy Payment Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-secondary-600 mb-4">{req.description || 'No description'}</p>
                <div className="flex gap-2">
                  {!req.paymentLink && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSelectedRequest(req); setQuoteAmount(''); }}
                      className="text-primary-600 border-primary-300 hover:bg-primary-50"
                    >
                      Generate Payment Link
                    </Button>
                  )}
                  {req.paymentProof && (
                    <div className="flex items-center gap-3">
                      <a href={req.paymentProof} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> View Proof
                      </a>
                      {req.paymentStatus === 'PENDING_VERIFICATION' && (
                        <>
                          <button
                            onClick={() => updatePaymentStatus(req.id, 'PAID')}
                            className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(req.id, 'REJECTED')}
                            className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Generate Payment Link Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <h3 className="text-h4 font-bold mb-4">Generate Payment Link</h3>
            <p className="text-sm text-secondary-500 mb-4">Service: {selectedRequest.service?.title || 'N/A'}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Amount (RWF)</label>
              <input
                type="number"
                value={quoteAmount}
                onChange={e => setQuoteAmount(e.target.value)}
                placeholder="e.g., 50000"
                className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedRequest(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => handleGeneratePaymentLink(selectedRequest.id)} isLoading={generatingLink === selectedRequest.id}>
                Generate & Copy Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Service Create/Edit Modal (unchanged) */}
      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setShowModal(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl"><h3 className="font-semibold">{editing?'Edit':'New'} Service</h3><button onClick={()=>setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5"/></button></div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Title *</label><input type="text" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. CV Writing" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Description</label><textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Starting Price (RWF)</label><input type="number" value={form.startingPrice} onChange={e=>setForm({...form,startingPrice:Number(e.target.value)})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Estimated Time</label><input type="text" value={form.estimatedTime} onChange={e=>setForm({...form,estimatedTime:e.target.value})} placeholder="e.g. 3-5 days" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
              </div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/><label className="text-sm">Featured</label></div>
              <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={()=>setShowModal(false)}>Cancel</Button><Button type="submit" className="flex-1" isLoading={saving}>{editing?'Update':'Create'}</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}