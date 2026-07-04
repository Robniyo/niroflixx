import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Megaphone, Eye, MousePointerClick, Calendar, Upload, Video } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const positions = ['sidebar', 'between_content', 'footer', 'dashboard', 'resources', 'news'];
const emptyForm = { title: '', description: '', imageUrl: '', videoUrl: '', link: '', position: 'sidebar', status: 'PUBLISHED', startDate: '', endDate: '' };

export default function AdvertisementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const r = await api.get('/advertisements'); setItems(r.data.data); } catch {} finally { setLoading(false); } };
  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = async (id: string) => {
    try {
      const r = await api.get(`/advertisements/${id}`);
      const d = r.data.data;
      setForm({
        title: d.title || '',
        description: d.description || '',
        imageUrl: d.imageUrl || '',
        videoUrl: d.videoUrl || '',
        link: d.link || '',
        position: d.position || 'sidebar',
        status: d.status || 'PUBLISHED',
        startDate: d.startDate ? d.startDate.slice(0, 10) : '',
        endDate: d.endDate ? d.endDate.slice(0, 10) : '',
      });
      setEditing(id);
      setShowModal(true);
    } catch { toast.error('Failed to load ad'); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      const r = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, imageUrl: r.data.data.url });
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;

      if (editing) {
        await api.put(`/advertisements/${editing}`, payload);
        toast.success('Ad updated');
      } else {
        await api.post('/advertisements', payload);
        toast.success('Ad created');
      }
      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save ad');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this ad?')) return;
    try { await api.delete(`/advertisements/${id}`); toast.success('Deleted'); fetchItems(); } catch {}
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Advertisements</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} ads</p></div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Ad</Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200">
          <Megaphone className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-500 font-medium">No advertisements yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-secondary-100 overflow-hidden hover:shadow-md transition-all">
              <div className="h-28 bg-gradient-to-br from-secondary-100 to-secondary-50 flex items-center justify-center relative">
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt={a.title} className="w-full h-full object-contain bg-secondary-50" />
                ) : a.videoUrl ? (
                  <Video className="w-10 h-10 text-secondary-300" />
                ) : (
                  <Megaphone className="w-10 h-10 text-secondary-300" />
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-caption font-semibold ${a.status === 'PUBLISHED' ? 'bg-success text-white' : 'bg-secondary-400 text-white'}`}>{a.status}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-secondary-900 mb-2">{a.title}</h3>
                <div className="space-y-1.5 text-body-sm text-secondary-500 mb-4">
                  <span className="text-caption bg-secondary-100 px-2 py-0.5 rounded-full">{a.position?.replace('_', ' ')}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {a.views || 0}</span>
                    <span className="flex items-center gap-1"><MousePointerClick className="w-3.5 h-3.5" /> {a.clicks || 0}</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-3 border-t border-secondary-100">
                  <button onClick={() => openEdit(a.id)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline"><Edit className="w-3 h-3" /> Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="flex items-center gap-1 text-xs text-danger hover:underline"><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold">{editing ? 'Edit Advertisement' : 'New Advertisement'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Join AI Bootcamp" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Upload Image</label>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-secondary-50 border rounded-lg cursor-pointer hover:bg-secondary-100 text-sm">
                  <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : form.imageUrl ? 'Change Image' : 'Choose Image'}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>
                {form.imageUrl && <p className="text-xs text-success mt-1">Image uploaded ✓</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">OR Video URL (YouTube/Vimeo)</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input type="url" value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
                <p className="text-xs text-secondary-400 mt-1">Video takes priority over image if both provided.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Link URL (optional)</label>
                <input type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Position</label>
                  <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">
                    {positions.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">
                    <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={saving}>{editing ? 'Update' : 'Create'} Ad</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}