import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Wrench, MessageSquare } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm = { title:'', description:'', categoryId:'', startingPrice:0, estimatedTime:'', icon:'', status:'PUBLISHED', featured:false };

export default function ServicesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'services' | 'requests'>('services');

  useEffect(()=>{
    fetchItems();
    api.get('/admin/subscribers').then(r => {
      const serviceRequests = (r.data.data?.messages || []).filter((m: any) => m.subject?.includes('Service Request'));
      setRequests(serviceRequests);
    }).catch(() => {});
  },[]);

  const fetchItems = async()=>{try{const r=await api.get('/services');setItems(r.data.data);}catch{}finally{setLoading(false);}};
  const openCreate = ()=>{setEditing(null);setForm(emptyForm);setShowModal(true);};
  const openEdit = async(id:string)=>{try{const r=await api.get(`/services/${id}`);const d=r.data.data;setForm({title:d.title||'',description:d.description||'',categoryId:d.categoryId||'',startingPrice:d.startingPrice||0,estimatedTime:d.estimatedTime||'',icon:d.icon||'',status:d.status,featured:d.featured});setEditing(id);setShowModal(true);}catch{}};
  const handleSave = async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{if(editing){await api.put(`/services/${editing}`,form);toast.success('Updated');}else{await api.post('/services',form);toast.success('Created');}setShowModal(false);fetchItems();}catch(err:any){toast.error(err.response?.data?.message||'Failed');}finally{setSaving(false);}};
  const handleDelete = async(id:string)=>{if(!confirm('Archive?'))return;try{await api.delete(`/services/${id}`);toast.success('Archived');fetchItems();}catch{}};

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
          <MessageSquare className="w-4 h-4" /> Requests {requests.length > 0 && <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">{requests.length}</span>}
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
          {requests.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-secondary-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500 font-medium">No service requests yet</p>
              <p className="text-secondary-400 text-body-sm mt-1">When clients request a service, they will appear here.</p>
            </div>
          ) : (
            requests.map((r: any) => (
              <div key={r.id} className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{r.subject?.replace('Service Request: ', '')}</h3>
                    <p className="text-body-sm text-secondary-500">{r.name} • {r.email}</p>
                  </div>
                  <span className="text-xs text-secondary-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bg-secondary-50 rounded-lg p-4 text-body-sm text-secondary-700 whitespace-pre-line">{r.message}</div>
              </div>
            ))
          )}
        </div>
      )}

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