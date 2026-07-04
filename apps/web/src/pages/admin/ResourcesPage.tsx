import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, FileText, Upload } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm = { title:'', description:'', categoryId:'', type:'PDF', fileUrl:'', price:0, status:'PUBLISHED', featured:false };

export default function ResourcesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(()=>{fetchItems();},[]);
  const fetchItems = async()=>{try{const r=await api.get('/resources');setItems(r.data.data);}catch{}finally{setLoading(false);}};
  const openCreate = ()=>{setEditing(null);setForm(emptyForm);setShowModal(true);};
  const openEdit = async(id:string)=>{try{const r=await api.get(`/resources/${id}`);const d=r.data.data;setForm({title:d.title||'',description:d.description||'',categoryId:d.categoryId||'',type:d.type||'PDF',fileUrl:d.fileUrl||'',price:d.price||0,status:d.status,featured:d.featured});setEditing(id);setShowModal(true);}catch{toast.error('Failed to load');}};
  const handleFileUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      const res = await api.post('/uploads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, fileUrl: res.data.data.url });
      toast.success('Uploaded');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };
  const handleSave = async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{if(editing){await api.put(`/resources/${editing}`,form);toast.success('Updated');}else{await api.post('/resources',form);toast.success('Created');}setShowModal(false);fetchItems();}catch(err:any){toast.error(err.response?.data?.message||'Failed');}finally{setSaving(false);}};
  const handleDelete = async(id:string)=>{if(!confirm('Archive?'))return;try{await api.delete(`/resources/${id}`);toast.success('Archived');fetchItems();}catch{}};

  if(loading)return<div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Resources</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} resources</p></div>
        <Button leftIcon={<Plus className="w-4 h-4"/>} onClick={openCreate}>Add Resource</Button>
      </div>
      {items.length===0?(
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><FileText className="w-12 h-12 text-secondary-300 mx-auto mb-3"/><p className="text-secondary-500">No resources yet.</p></div>
      ):(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(r=>(
            <div key={r.id} className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-secondary-900">{r.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${r.status==='PUBLISHED'?'bg-success-light text-success-dark':'bg-secondary-100 text-secondary-600'}`}>{r.status}</span>
              </div>
              <p className="text-body-sm text-secondary-500">Downloads: {r.downloadCount||0}</p>
              {r.fileUrl && <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" className="text-xs text-primary-600 hover:underline mt-1 inline-block" download>Download File</a>}
              <div className="flex gap-3 mt-3 pt-3 border-t border-secondary-100">
                <button onClick={()=>openEdit(r.id)} className="text-xs text-primary-600 hover:underline flex items-center gap-1"><Edit className="w-3 h-3"/> Edit</button>
                <button onClick={()=>handleDelete(r.id)} className="text-xs text-danger hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3"/> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setShowModal(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl"><h3 className="font-semibold">{editing?'Edit':'New'} Resource</h3><button onClick={()=>setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5"/></button></div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Title *</label><input type="text" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. JavaScript Cheat Sheet" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Description</label><textarea rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none"/></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Upload File</label><label className="flex items-center gap-2 px-4 py-2.5 bg-secondary-50 border rounded-lg cursor-pointer hover:bg-secondary-100 text-sm"><Upload className="w-4 h-4"/>{uploading?'Uploading...':'Choose File'}<input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading}/></label>{form.fileUrl&&<span className="text-xs text-success">Uploaded ✓</span>}</div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
              <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={()=>setShowModal(false)}>Cancel</Button><Button type="submit" className="flex-1" isLoading={saving}>{editing?'Update':'Create'}</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}