import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Building2 } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm = { name: '', logo: '', website: '' };

export default function PartnersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const r = await api.get('/partners'); setItems(r.data.data); } catch {} finally { setLoading(false); } };
  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = async (id: string) => { try { const r = await api.get(`/partners/${id}`); const d = r.data.data; setForm({ name: d.name, logo: d.logo || '', website: d.website || '' }); setEditing(id); setShowModal(true); } catch {} };
  const handleSave = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { if (editing) { await api.put(`/partners/${editing}`, form); toast.success('Updated'); } else { await api.post('/partners', form); toast.success('Created'); } setShowModal(false); fetchItems(); } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); } };
  const handleDelete = async (id: string) => { if (!confirm('Remove?')) return; try { await api.delete(`/partners/${id}`); toast.success('Removed'); fetchItems(); } catch {} };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Partners & Trusted By</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} partners</p></div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Partner</Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><Building2 className="w-12 h-12 text-secondary-300 mx-auto mb-3" /><p className="text-secondary-500">No partners yet.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-secondary-100 p-5 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-secondary-400">{p.name?.[0]}</div>
              <h3 className="font-semibold text-secondary-900">{p.name}</h3>
              {p.website && <a href={p.website} target="_blank" className="text-body-sm text-primary-600 hover:underline">{p.website}</a>}
              <div className="flex justify-center gap-3 mt-3">
                <button onClick={() => openEdit(p.id)} className="text-xs text-primary-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-danger hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl"><h3 className="font-semibold">{editing ? 'Edit' : 'New'} Partner</h3><button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Company Name *</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Andela" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Website</label><input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Logo URL</label><input type="url" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" className="flex-1" isLoading={saving}>{editing ? 'Update' : 'Create'}</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}