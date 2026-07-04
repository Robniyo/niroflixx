import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, BookOpen, Users, Calendar, MapPin } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const emptyForm: any = {
  name: '', courseId: '', trainerId: '', type: 'ONLINE_LIVE', location: '', meetingLink: '',
  capacity: 30, startDate: '', endDate: '', startTime: '', endTime: '', days: '',
  registrationDeadline: '', fee: 0, description: '', requirements: '', status: 'DRAFT'
};

export default function ClassesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState<any[]>([]);
  const [showStudents, setShowStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); fetchCourses(); fetchTrainers(); }, []);

  const fetchItems = async () => { try { const r = await api.get('/classes'); setItems(r.data.data); } catch {} finally { setLoading(false); } };
  const fetchCourses = async () => { try { const r = await api.get('/classes/courses'); setCourses(r.data.data); } catch {} };
  const fetchTrainers = async () => { try { const r = await api.get('/classes/trainers'); setTrainers(r.data.data); } catch {} };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = async (id: string) => {
    try {
      const r = await api.get(`/classes/${id}`);
      const d = r.data.data;
      setForm({
        name: d.name, courseId: d.courseId || '', trainerId: d.trainerId || '', type: d.type,
        location: d.location || '', meetingLink: d.meetingLink || '', capacity: d.capacity,
        startDate: d.startDate ? d.startDate.slice(0, 10) : '',
        endDate: d.endDate ? d.endDate.slice(0, 10) : '',
        startTime: d.startTime || '', endTime: d.endTime || '', days: d.days || '',
        registrationDeadline: d.registrationDeadline ? d.registrationDeadline.slice(0, 10) : '',
        fee: d.fee, description: d.description || '', requirements: d.requirements || '', status: d.status
      });
      setEditing(id); setShowModal(true);
    } catch { toast.error('Failed to load class'); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/classes/${editing}`, form); toast.success('Class updated'); }
      else { await api.post('/classes', form); toast.success('Class created'); }
      setShowModal(false); fetchItems();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel this class?')) return;
    try { await api.delete(`/classes/${id}`); toast.success('Cancelled'); fetchItems(); } catch {}
  };

  const viewStudents = async (classId: string) => {
    try {
      const r = await api.get(`/enrollments/class/${classId}`);
      setStudents(r.data.data);
      setShowStudents(true);
    } catch { toast.error('Failed to load students'); }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Classes & Cohorts</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} classes</p></div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Class</Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><BookOpen className="w-12 h-12 text-secondary-300 mx-auto mb-3" /><p className="text-secondary-500">No classes yet. Create a class under a course.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-secondary-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-secondary-900">{c.name}</h3>
                  <p className="text-body-sm text-primary-600">{c.course?.title || 'No course'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${
                  c.status === 'PUBLISHED' ? 'bg-success-light text-success-dark' :
                  c.status === 'RUNNING' ? 'bg-info-light text-info' :
                  c.status === 'CANCELLED' ? 'bg-danger-light text-danger-dark' :
                  'bg-secondary-100 text-secondary-600'
                }`}>{c.status}</span>
              </div>
              <div className="space-y-1.5 text-body-sm text-secondary-500 mb-4">
                {c.trainer && <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {c.trainer.user?.firstName} {c.trainer.user?.lastName}</div>}
                <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {c.type?.replace('_', ' ')}</div>
                {c.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {c.location}</div>}
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'TBD'} - {c.endDate ? new Date(c.endDate).toLocaleDateString() : 'TBD'}</div>
                <div><Users className="w-3.5 h-3.5 inline mr-1" />{c.enrolledCount}/{c.capacity} enrolled</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => viewStudents(c.id)} className="text-xs text-info hover:underline">Students</button>
                <button onClick={() => openEdit(c.id)} className="text-xs text-primary-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-xs text-danger hover:underline">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showStudents && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowStudents(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <h3 className="font-semibold mb-4">Enrolled Students ({students.length})</h3>
            {students.length === 0 ? (
              <p className="text-secondary-500 text-sm">No students enrolled yet.</p>
            ) : (
              <div className="space-y-2">
                {students.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b text-sm">
                    <div>
                      <p className="font-medium">{s.user?.firstName} {s.user?.lastName}</p>
                      <p className="text-secondary-500 text-xs">{s.user?.email}</p>
                    </div>
                    <span className="text-xs text-secondary-400">{new Date(s.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowStudents(false)} className="mt-4 text-sm text-primary-600 hover:underline w-full text-center">Close</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-semibold">{editing ? 'Edit Class' : 'New Class / Cohort'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-secondary-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Class Name *</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cohort 001 - Jan 2027" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Course *</label><select required value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"><option value="">Select course</option>{courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Trainer</label><select value={form.trainerId} onChange={e => setForm({ ...form, trainerId: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"><option value="">Select trainer</option>{trainers.map((t: any) => <option key={t.id} value={t.id}>{t.user?.firstName} {t.user?.lastName}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"><option value="ONLINE_LIVE">Online Live</option><option value="OFFLINE">Offline</option><option value="HYBRID">Hybrid</option></select></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Location</label><input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kigali Campus" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Meeting Link</label><input type="url" value={form.meetingLink} onChange={e => setForm({ ...form, meetingLink: e.target.value })} placeholder="Zoom/Meet link" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Capacity *</label><input type="number" required value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Fee (RWF)</label><input type="number" value={form.fee} onChange={e => setForm({ ...form, fee: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Start Time</label><input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">End Time</label><input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Days</label><input type="text" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} placeholder="e.g. Mon, Wed, Fri" className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-secondary-700 mb-1">Registration Deadline</label><input type="date" value={form.registrationDeadline} onChange={e => setForm({ ...form, registrationDeadline: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" /></div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm">
                    <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="RUNNING">Running</option><option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Description</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" /></div>
              <div><label className="block text-sm font-medium text-secondary-700 mb-1">Requirements</label><textarea rows={2} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm resize-none" /></div>
              <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" className="flex-1" isLoading={saving}>{editing ? 'Update' : 'Create'} Class</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}