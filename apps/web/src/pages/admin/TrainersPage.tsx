import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Users } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', bio: '', skills: '', experience: '' };

export default function TrainersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const r = await api.get('/trainers'); setItems(r.data.data); } catch {} finally { setLoading(false); } };
  const openCreate = () => { setForm(emptyForm); setShowModal(true); };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await api.post('/trainers', form); toast.success('Trainer created! Password: trainer123'); setShowModal(false); fetchItems(); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate?')) return;
    try { await api.delete(`/trainers/${id}`); toast.success('Deactivated'); fetchItems(); } catch {}
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Trainers</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} trainers</p></div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Trainer</Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><Users className="w-12 h-12 text-secondary-300 mx-auto mb-3" /><p className="text-secondary-500">No trainers yet.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-secondary-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-sm">{t.user?.firstName?.[0]}{t.user?.lastName?.[0]}</div>
                <div><p className="font-semibold">{t.user?.firstName} {t.user?.lastName}</p><p className="text-body-sm text-secondary-500">{t.user?.email}</p></div>
              </div>
              {t.bio && <p className="text-body-sm text-secondary-600 mb-2">{t.bio.slice(0, 100)}...</p>}
              {t.skills && <p className="text-xs text-primary-600 mb-2"><strong>Skills:</strong> {t.skills}</p>}
              <span className={`px-2 py-0.5 rounded-full text-caption ${t.status === 'ACTIVE' ? 'bg-success-light text-success-dark' : 'bg-secondary-100 text-secondary-600'}`}>{t.status}</span>
              <button onClick={() => handleDelete(t.id)} className="block mt-2 text-xs text-danger hover:underline">Deactivate</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl"><h3 className="font-semibold">New Trainer</h3><button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">First Name *</label><input type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium mb-1">Last Name *</label><input type="text" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Bio</label><textarea rows={2} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" /></div>
              <div><label className="block text-sm font-medium mb-1">Skills</label><input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Node.js, Python" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Experience</label><input type="text" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 5 years" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              <p className="text-xs text-secondary-400">Default password: <strong>trainer123</strong></p>
              <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" className="flex-1" isLoading={saving}>Create Trainer</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}