import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Briefcase, Calendar, MapPin } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const types = ['SCHOLARSHIP','ADMISSION','INTERNSHIP','JOB','COMPETITION','HACKATHON','GRANT','EXCHANGE_PROGRAM','VOLUNTEER','RESEARCH','BOOTCAMP','FELLOWSHIP','EVENT'];
const emptyForm = { title:'', organization:'', country:'Rwanda', city:'Kigali', type:'SCHOLARSHIP', educationLevel:'', deadline:'', description:'', requirements:'', benefits:'', officialLink:'', status:'DRAFT', featured:false };

export default function OpportunitiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{fetchItems();},[]);
  const fetchItems = async ()=>{try{const r=await api.get('/opportunities');setItems(r.data.data);}catch{}finally{setLoading(false);}};
  const openCreate = ()=>{setEditing(null);setForm(emptyForm);setShowModal(true);};
  const openEdit = async(id:string)=>{try{const r=await api.get(`/opportunities/${id}`);const d=r.data.data;setForm({title:d.title||'',organization:d.organization||'',country:d.country||'Rwanda',city:d.city||'',type:d.type,educationLevel:d.educationLevel||'',deadline:d.deadline?d.deadline.slice(0,10):'',description:d.description||'',requirements:d.requirements||'',benefits:d.benefits||'',officialLink:d.officialLink||'',status:d.status,featured:d.featured});setEditing(id);setShowModal(true);}catch{}};
  const handleSave = async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{if(editing){await api.put(`/opportunities/${editing}`,form);toast.success('Updated');}else{await api.post('/opportunities',form);toast.success('Created');}setShowModal(false);fetchItems();}catch(err:any){toast.error(err.response?.data?.message||'Failed');}finally{setSaving(false);}};
  const handleDelete = async(id:string)=>{if(!confirm('Archive?'))return;try{await api.delete(`/opportunities/${id}`);toast.success('Archived');fetchItems();}catch{}};

  if(loading)return<div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Opportunities</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} opportunities</p></div>
        <Button leftIcon={<Plus className="w-4 h-4"/>} onClick={openCreate}>Add Opportunity</Button>
      </div>
      {items.length===0?(
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><Briefcase className="w-12 h-12 text-secondary-300 mx-auto mb-3"/><p className="text-secondary-500">No opportunities yet.</p></div>
      ):(
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          <table className="w-full"><thead className="bg-secondary-50 border-b"><tr><th className="text-left px-5 py-3 text-label text-secondary-600">Title</th><th className="text-left px-5 py-3 text-label text-secondary-600">Type</th><th className="text-left px-5 py-3 text-label text-secondary-600">Organization</th><th className="text-left px-5 py-3 text-label text-secondary-600">Deadline</th><th className="text-left px-5 py-3 text-label text-secondary-600">Status</th><th className="text-right px-5 py-3">Actions</th></tr></thead>
          <tbody>{items.map(o=>(<tr key={o.id} className="border-b border-secondary-50 hover:bg-secondary-50"><td className="px-5 py-3.5 font-medium text-body-sm">{o.title}</td><td className="px-5 py-3.5 text-body-sm text-secondary-600">{o.type}</td><td className="px-5 py-3.5 text-body-sm text-secondary-600">{o.organization||'—'}</td><td className="px-5 py-3.5 text-body-sm">{o.deadline?new Date(o.deadline).toLocaleDateString():'—'}</td><td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-caption font-medium ${o.status==='PUBLISHED'?'bg-success-light text-success-dark':'bg-secondary-100 text-secondary-600'}`}>{o.status}</span></td><td className="px-5 py-3.5 text-right"><button onClick={()=>openEdit(o.id)} className="p-1.5 text-secondary-400 hover:text-primary-600"><Edit className="w-4 h-4"/></button><button onClick={()=>handleDelete(o.id)} className="p-1.5 text-secondary-400 hover:text-danger"><Trash2 className="w-4 h-4"/></button></td></tr>))}</tbody></table>
        </div>
      )}

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setShowModal(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl z-10"><h3 className="font-semibold">{editing?'Edit':'New'} Opportunity</h3><button onClick={()=>setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5"/></button></div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Title *</label><input type="text" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Mastercard Scholarship 2027" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm focus:outline-none focus:border-primary-500"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">{types.map(t=><option key={t} value={t}>{t.replace('_',' ')}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Organization</label><input type="text" value={form.organization} onChange={e=>setForm({...form,organization:e.target.value})} placeholder="e.g. Mastercard Foundation" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Country</label><input type="text" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">City</label><input type="text" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Deadline</label><input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Education Level</label><input type="text" value={form.educationLevel} onChange={e=>setForm({...form,educationLevel:e.target.value})} placeholder="e.g. Bachelor" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
              </div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Description</label><textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none"/></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Requirements</label><textarea rows={2} value={form.requirements} onChange={e=>setForm({...form,requirements:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none"/></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Benefits</label><textarea rows={2} value={form.benefits} onChange={e=>setForm({...form,benefits:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none"/></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Official Link</label><input type="url" value={form.officialLink} onChange={e=>setForm({...form,officialLink:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"/></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} id="feat"/><label htmlFor="feat" className="text-sm">Featured on homepage</label></div>
              <div>
  <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">
    <option value="DRAFT">Draft</option>
    <option value="PUBLISHED">Published</option>
  </select>
</div>
              <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={()=>setShowModal(false)}>Cancel</Button><Button type="submit" className="flex-1" isLoading={saving}>{editing?'Update':'Create'}</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}