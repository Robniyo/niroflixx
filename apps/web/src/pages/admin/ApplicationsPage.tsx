import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import ResponsiveTable from '@/components/ui/ResponsiveTable';
export default function ApplicationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const r = await api.get('/applications'); setItems(r.data.data); } catch {} finally { setLoading(false); } };

  const updateStatus = async (id: string, status: string) => {
    try { await api.patch(`/applications/${id}`, { status, adminNotes: notes }); toast.success(`Application ${status}`); fetchItems(); setSelected(null); setNotes(''); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="mb-6"><h1 className="text-h4 font-bold text-secondary-900">Applications</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} applications</p></div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><p className="text-secondary-500">No applications yet.</p></div>
      ) : (
        <ResponsiveTable
  columns={[
    { key: 'candidate', label: 'Candidate', render: (a) => <span className="font-medium text-sm">{a.candidate?.user?.firstName} {a.candidate?.user?.lastName}</span> },
    { key: 'opportunity', label: 'Opportunity', render: (a) => <span className="text-xs text-secondary-600">{a.opportunity?.title}</span> },
    { key: 'status', label: 'Status', render: (a) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status==='APPROVED'?'bg-success-light text-success-dark':a.status==='REJECTED'?'bg-danger-light text-danger-dark':'bg-secondary-100 text-secondary-600'}`}>{a.status}</span> },
    { key: 'date', label: 'Date', render: (a) => <span className="text-xs text-secondary-500">{new Date(a.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: '', render: (a) => (
      <button onClick={() => { setSelected(a); setNotes(''); }} className="text-xs text-primary-600 hover:underline"><Eye className="w-3 h-3 inline"/> Review</button>
    ), hideOnMobile: true },
  ]}
  data={items}
  emptyMessage="No applications yet"
/>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in p-6">
            <h3 className="text-h4 font-bold mb-4">Application Review</h3>
            <p className="text-sm mb-2"><strong>Candidate:</strong> {selected.candidate?.user?.firstName} {selected.candidate?.user?.lastName}</p>
            <p className="text-sm mb-2"><strong>Email:</strong> {selected.candidate?.user?.email}</p>
            <p className="text-sm mb-2"><strong>Opportunity:</strong> {selected.opportunity?.title}</p>
            <p className="text-sm mb-2"><strong>Type:</strong> {selected.opportunity?.type}</p>
            <p className="text-sm mb-4"><strong>Submitted:</strong> {new Date(selected.createdAt).toLocaleDateString()}</p>
            <div className="mb-4"><label className="block text-sm font-medium mb-1">Admin Notes</label><textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 bg-secondary-50 border rounded-lg text-sm resize-none" /></div>
            <div className="flex gap-3">
              <button onClick={() => updateStatus(selected.id, 'APPROVED')} className="flex-1 px-4 py-2.5 bg-success text-white rounded-lg text-sm font-medium hover:bg-emerald-600">Approve</button>
              <button onClick={() => updateStatus(selected.id, 'REJECTED')} className="flex-1 px-4 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-600">Reject</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2.5 bg-secondary-100 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}