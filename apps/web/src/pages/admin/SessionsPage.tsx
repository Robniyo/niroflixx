import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm: any = { name: '', classId: '', description: '', capacity: 30, startDate: '', endDate: '', location: '', status: 'DRAFT' };

export default function SessionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); fetchClasses(); }, []);
  const fetchItems = async () => { try { const r = await api.get('/sessions'); setItems(r.data.data); } catch {} finally { setLoading(false); } };
  const fetchClasses = async () => { try { const r = await api.get('/classes'); setClasses(r.data.data || []); } catch {} };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = async (id: string) => {
    try {
      const r = await api.get(`/sessions/${id}`);
      const d = r.data.data;
      setForm({
        name: d.name || '', classId: d.classId || '', description: d.description || '',
        capacity: d.capacity || 30, startDate: d.startDate ? d.startDate.slice(0,10) : '',
        endDate: d.endDate ? d.endDate.slice(0,10) : '', location: d.location || '', status: d.status || 'DRAFT'
      });
      setEditing(id); setShowModal(true);
    } catch { toast.error('Failed to load session'); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/sessions/${editing}`, form); toast.success('Updated'); }
      else { await api.post('/sessions', form); toast.success('Created'); }
      setShowModal(false); fetchItems();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this session?')) return;
    try { await api.delete(`/sessions/${id}`); toast.success('Deleted'); fetchItems(); } catch {}
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Sessions</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} sessions</p></div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Session</Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200">
          <Calendar className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-500 font-medium">No sessions yet</p>
          <p className="text-secondary-400 text-body-sm mt-1">Create sessions for classes or standalone workshops.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-secondary-900">{s.name}</h3>
                  {s.class ? (
                    <p className="text-body-sm text-primary-600 font-medium">{s.class.name}</p>
                  ) : (
                    <span className="text-caption bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full">Standalone</span>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-caption font-semibold ${
                  s.status === 'PUBLISHED' ? 'bg-success-light text-success-dark' : 'bg-secondary-100 text-secondary-600'
                }`}>{s.status}</span>
              </div>

              {s.description && <p className="text-body-sm text-secondary-600 mb-4">{s.description.slice(0, 100)}...</p>}

              <div className="space-y-1.5 text-body-sm text-secondary-500 mb-4">
                {s.startDate && <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(s.startDate).toLocaleDateString()}{s.endDate ? ` → ${new Date(s.endDate).toLocaleDateString()}` : ''}</div>}
                {s.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {s.location}</div>}
                <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Capacity: {s.capacity}</div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-secondary-100">
                <button onClick={() => openEdit(s.id)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline"><Edit className="w-3 h-3" /> Edit</button>
                <button onClick={() => handleDelete(s.id)} className="flex items-center gap-1 text-xs text-danger hover:underline"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-semibold text-lg">{editing ? 'Edit Session' : 'New Session'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Session Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. HTML Basics Workshop" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Class (optional — leave empty for standalone)</label>
                <select value={form.classId} onChange={e => setForm({...form, classId: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">
                  <option value="">Standalone Session</option>
                  {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What this session covers..." className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Online / Kigali Campus" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={saving}>{editing ? 'Update' : 'Create'} Session</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}