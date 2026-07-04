import { useState, useEffect } from 'react';
import { Eye, UserCheck, UserX } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function CandidatesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const r = await api.get('/candidates'); setItems(r.data.data); } catch {} finally { setLoading(false); } };

  const viewCandidate = async (id: string) => {
    try { const r = await api.get(`/candidates/${id}`); setSelected(r.data.data); } catch { toast.error('Failed to load'); }
  };

  const updateStatus = async (id: string, status: string) => {
    try { await api.patch(`/candidates/${id}/status`, { status }); toast.success(`Candidate ${status}`); fetchItems(); setSelected(null); } catch {}
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-h4 font-bold text-secondary-900">Candidates</h1><p className="text-secondary-500 text-body-sm mt-1">{items.length} candidates</p></div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-200"><UserCheck className="w-12 h-12 text-secondary-300 mx-auto mb-3" /><p className="text-secondary-500">No candidates yet.</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b"><tr><th className="text-left px-5 py-3 text-label">Candidate</th><th className="text-left px-5 py-3 text-label">Contact</th><th className="text-left px-5 py-3 text-label">Score</th><th className="text-left px-5 py-3 text-label">Status</th><th className="text-left px-5 py-3 text-label">Actions</th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-secondary-50 hover:bg-secondary-50">
                  <td className="px-5 py-3.5 font-medium">{c.user?.firstName} {c.user?.lastName}</td>
                  <td className="px-5 py-3.5 text-body-sm text-secondary-600">{c.user?.email}</td>
                  <td className="px-5 py-3.5"><span className="font-semibold">{c.completionScore}%</span></td>
                  <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-caption ${c.status === 'active' ? 'bg-success-light text-success-dark' : 'bg-secondary-100'}`}>{c.status}</span></td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => viewCandidate(c.id)} className="text-primary-600 hover:underline text-sm flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in p-6">
            <h2 className="text-h4 font-bold mb-4">{selected.user?.firstName} {selected.user?.lastName}</h2>
            <p className="text-secondary-500 mb-2">{selected.user?.email} | {selected.user?.phone}</p>
            <p className="text-sm mb-4"><strong>Headline:</strong> {selected.headline || 'N/A'}</p>
            <p className="text-sm mb-4"><strong>Summary:</strong> {selected.summary || 'N/A'}</p>
            
            {selected.education?.length > 0 && (
              <div className="mb-4"><h4 className="font-semibold mb-2">Education</h4>
                {selected.education.map((e: any, i: number) => <p key={i} className="text-sm text-secondary-600">{e.degree} - {e.institution}</p>)}
              </div>
            )}
            {selected.experiences?.length > 0 && (
              <div className="mb-4"><h4 className="font-semibold mb-2">Experience</h4>
                {selected.experiences.map((e: any, i: number) => <p key={i} className="text-sm text-secondary-600">{e.position} at {e.company}</p>)}
              </div>
            )}
            {selected.skills?.length > 0 && (
              <div className="mb-4"><h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">{selected.skills.map((s: any) => <span key={s.id} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-xs">{s.name}</span>)}</div>
              </div>
            )}
            {selected.documents?.length > 0 && (
              <div className="mb-4"><h4 className="font-semibold mb-2">Documents</h4>
                {selected.documents.map((d: any) => <p key={d.id} className="text-sm text-secondary-600">{d.type}: <a href={d.fileUrl} target="_blank" className="text-primary-600 hover:underline">{d.fileName}</a></p>)}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => updateStatus(selected.id, 'approved')} className="px-4 py-2 bg-success text-white rounded-lg text-sm hover:bg-emerald-600">Approve</button>
              <button onClick={() => updateStatus(selected.id, 'rejected')} className="px-4 py-2 bg-danger text-white rounded-lg text-sm hover:bg-red-600">Reject</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-secondary-100 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}