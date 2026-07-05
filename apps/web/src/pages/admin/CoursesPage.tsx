import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, BookOpen, Upload } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Course {
  id: string; title: string; level: string; type: string; status: string; price: number; enrollmentCount: number; category?: { name: string }; thumbnail?: string;
}

const emptyForm = { title: '', description: '', categoryId: '', level: 'BEGINNER', type: 'ONLINE_LIVE', language: 'en', price: 0, discount: 0, duration: '', capacity: 0, thumbnail: '', status: 'DRAFT', featured: false };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchCourses(); fetchCategories(); }, []);

  const fetchCourses = async () => {
    try { const res = await api.get('/courses'); setCourses(res.data.data); } catch { toast.error('Failed'); } finally { setLoading(false); }
  };
  const fetchCategories = async () => {
    try { const res = await api.get('/categories'); setCategories(res.data.data || []); } catch {}
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = async (id: string) => {
    try { const res = await api.get(`/courses/${id}`); const c = res.data.data; setForm({ title: c.title || '', description: c.description || '', categoryId: c.categoryId || '', level: c.level, type: c.type, language: c.language, price: c.price, discount: c.discount || 0, duration: c.duration || '', capacity: c.capacity || 0, thumbnail: c.thumbnail || '', status: c.status, featured: c.featured }); setEditing(id); setShowModal(true); } catch { toast.error('Failed'); }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/uploads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, thumbnail: res.data.data.url });
      toast.success('Image uploaded');
    } catch (err: any) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/courses/${editing}`, form); toast.success('Updated'); }
      else { await api.post('/courses', form); toast.success('Created'); }
      setShowModal(false); fetchCourses();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive?')) return;
    try { await api.delete(`/courses/${id}`); toast.success('Archived'); fetchCourses(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Courses</h1><p className="text-secondary-500 text-body-sm mt-1">{courses.length} courses</p></div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Course</Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200">
          <BookOpen className="w-12 h-12 text-secondary-300 mx-auto mb-3" /><p className="text-secondary-500">No courses yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b"><tr><th className="text-left px-5 py-3 text-label text-secondary-600">Title</th><th className="text-left px-5 py-3 text-label text-secondary-600">Level</th><th className="text-left px-5 py-3 text-label text-secondary-600">Type</th><th className="text-left px-5 py-3 text-label text-secondary-600">Price</th><th className="text-left px-5 py-3 text-label text-secondary-600">Status</th><th className="text-right px-5 py-3">Actions</th></tr></thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-secondary-50 hover:bg-secondary-50">
                  <td className="px-5 py-3.5 font-medium text-body-sm">{c.title}</td>
                  <td className="px-5 py-3.5 text-body-sm text-secondary-600">{c.level}</td>
                  <td className="px-5 py-3.5 text-body-sm text-secondary-600">{c.type?.replace('_',' ')}</td>
                  <td className="px-5 py-3.5 text-body-sm">{c.price.toLocaleString()} RWF</td>
                  <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-caption font-medium ${c.status==='PUBLISHED'?'bg-success-light text-success-dark':'bg-secondary-100 text-secondary-600'}`}>{c.status}</span></td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={()=>openEdit(c.id)} className="p-1.5 text-secondary-400 hover:text-primary-600"><Edit className="w-4 h-4"/></button>
                    <button onClick={()=>handleDelete(c.id)} className="p-1.5 text-secondary-400 hover:text-danger"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setShowModal(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-semibold">{editing?'Edit Course':'New Course'}</h3>
              <button onClick={()=>setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Web Development Bootcamp" className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the course..." className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                  <select value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm">
                    <option value="">Select category</option>
                    {categories.map((cat:any)=><option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Level</label>
                  <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm">
                    <option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option><option value="PROFESSIONAL">Professional</option><option value="EXPERT">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm">
                    <option value="ONLINE_LIVE">Online Live</option><option value="OFFLINE">Offline</option><option value="HYBRID">Hybrid</option><option value="RECORDED">Recorded</option><option value="WORKSHOP">Workshop</option><option value="BOOTCAMP">Bootcamp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Duration</label>
                  <input type="text" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="e.g. 8 Weeks" className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Price (RWF)</label>
                  <input type="number" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm" />
                </div>
               <div>
  <label className="block text-sm font-medium text-secondary-700 mb-1">Capacity</label>
  <input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})} className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm" />
</div>
<div>
  <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm">
    <option value="DRAFT">Draft</option>
    <option value="PUBLISHED">Published</option>
  </select>
</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Thumbnail</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-100 text-sm text-secondary-600">
                    <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Choose Image'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                  </label>
                  {form.thumbnail && <span className="text-xs text-success truncate max-w-[200px]">Uploaded ✓</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} id="featured" />
                <label htmlFor="featured" className="text-sm text-secondary-700">Featured on homepage</label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={()=>setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={saving}>{editing?'Update':'Create'} Course</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}