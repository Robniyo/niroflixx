import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Star, Quote } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm = { name: '', role: '', quote: '', photo: '', rating: 5, status: 'DRAFT' };

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const r = await api.get('/testimonials'); setItems(r.data.data); } catch {} finally { setLoading(false); } };
  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = async (id: string) => { try { const r = await api.get(`/testimonials/${id}`); const d = r.data.data; setForm({ name: d.name, role: d.role || '', quote: d.quote, photo: d.photo || '', rating: d.rating, status: d.status }); setEditing(id); setShowModal(true); } catch {} };
  const handleSave = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { if (editing) { await api.put(`/testimonials/${editing}`, form); toast.success('Updated'); } else { await api.post('/testimonials', form); toast.success('Created'); } setShowModal(false); fetchItems(); } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); } };
  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; try { await api.delete(`/testimonials/${id}`); toast.success('Deleted'); fetchItems(); } catch {} };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Testimonials</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} testimonials</p></div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Testimonial</Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><Quote className="w-12 h-12 text-secondary-300 mx-auto mb-3" /><p className="text-secondary-500">No testimonials yet.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-sm">{t.name?.[0]}</div>
                <div><p className="font-semibold text-secondary-900">{t.name}</p><p className="text-body-sm text-secondary-500">{t.role}</p></div>
              </div>
              <div className="flex gap-0.5 mb-2">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />)}</div>
              <p className="text-body-sm text-secondary-600 italic mb-3">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${t.status === 'PUBLISHED' ? 'bg-success-light text-success-dark' : 'bg-secondary-100 text-secondary-600'}`}>{t.status}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(t.id)} className="text-xs text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-xs text-danger hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl"><h3 className="font-semibold">{editing ? 'Edit' : 'New'} Testimonial</h3><button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Name *</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jean Claude" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Role / Title</label><input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Software Developer at BK" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Quote *</label><textarea rows={3} required value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} placeholder="What did they say?" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Rating</label><select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option></select></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Photo URL</label><input type="url" value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" className="flex-1" isLoading={saving}>{editing ? 'Update' : 'Create'}</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}