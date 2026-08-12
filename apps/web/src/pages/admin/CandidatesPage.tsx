import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, User, Mail, Phone, Award, BookOpen, Briefcase, Wrench, FileText, Clock } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const r = await api.get('/candidates');
      setCandidates(r.data.data);
    } catch {} finally { setLoading(false); }
  };

  const fetchCandidateDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const r = await api.get(`/candidates/${id}`);
      setSelected(r.data.data);
    } catch { toast.error('Failed to load candidate details'); }
    finally { setDetailLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/candidates/${id}/status`, { status });
      toast.success(`Candidate ${status}`);
      fetchCandidates();
      setSelected(null);
    } catch { toast.error('Failed'); }
  };

  const filtered = candidates.filter(c => {
    const name = `${c.user?.firstName} ${c.user?.lastName}`.toLowerCase();
    const email = c.user?.email?.toLowerCase() || '';
    const matchSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h4 font-bold text-secondary-900">Candidates</h1>
        <p className="text-secondary-500 text-body-sm mt-1">{filtered.length} candidates</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border rounded-lg text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase">Candidate</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-secondary-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b hover:bg-secondary-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-700">
                        {c.user?.firstName?.[0]}{c.user?.lastName?.[0]}
                      </span>
                    </div>
                    <span className="font-medium text-sm">
                      {c.user?.firstName} {c.user?.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-secondary-500 hidden sm:table-cell">{c.user?.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-secondary-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          c.completionScore >= 80 ? 'bg-success' : c.completionScore >= 50 ? 'bg-accent-500' : 'bg-danger'
                        }`}
                        style={{ width: `${c.completionScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{c.completionScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    c.status === 'approved' ? 'bg-success-light text-success-dark' :
                    c.status === 'rejected' ? 'bg-danger-light text-danger-dark' :
                    'bg-secondary-100 text-secondary-600'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => fetchCandidateDetail(c.id)}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    <Eye className="w-3 h-3 inline mr-1" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in p-6">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 hover:bg-secondary-50 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>

            {detailLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <>
                {/* Basic Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-700">
                      {selected.user?.firstName?.[0]}{selected.user?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-h4 font-bold">{selected.user?.firstName} {selected.user?.lastName}</h3>
                    <p className="text-sm text-secondary-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selected.user?.email}</p>
                    {selected.user?.phone && <p className="text-sm text-secondary-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selected.user.phone}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-32 h-2 bg-secondary-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            selected.completionScore >= 80 ? 'bg-success' : selected.completionScore >= 50 ? 'bg-accent-500' : 'bg-danger'
                          }`}
                          style={{ width: `${selected.completionScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{selected.completionScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Headline</h4>
                    <p className="text-sm text-secondary-600">{selected.headline || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Summary</h4>
                    <p className="text-sm text-secondary-600">{selected.summary || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Current Education</h4>
                    <p className="text-sm text-secondary-600">{selected.currentEducation || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Institution</h4>
                    <p className="text-sm text-secondary-600">{selected.currentInstitution || 'N/A'}</p>
                  </div>
                </div>

                {/* Education List */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><BookOpen className="w-4 h-4" /> Education</h4>
                  {selected.education?.length > 0 ? (
                    selected.education.map((edu: any) => (
                      <div key={edu.id} className="text-sm py-1 border-b last:border-0">
                        <span className="font-medium">{edu.degree}</span> in {edu.field} — {edu.institution}
                      </div>
                    ))
                  ) : <p className="text-sm text-secondary-400">None</p>}
                </div>

                {/* Experience List */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><Briefcase className="w-4 h-4" /> Experience</h4>
                  {selected.experiences?.length > 0 ? (
                    selected.experiences.map((exp: any) => (
                      <div key={exp.id} className="text-sm py-1 border-b last:border-0">
                        <span className="font-medium">{exp.position}</span> at {exp.company}
                      </div>
                    ))
                  ) : <p className="text-sm text-secondary-400">None</p>}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><Wrench className="w-4 h-4" /> Skills</h4>
                  {selected.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selected.skills.map((skill: any) => (
                        <span key={skill.id} className="px-3 py-1 bg-secondary-100 rounded-full text-xs font-medium">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-sm text-secondary-400">None</p>}
                </div>

                {/* Documents */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><FileText className="w-4 h-4" /> Documents</h4>
                  {selected.documents?.length > 0 ? (
                    selected.documents.map((doc: any) => (
                      <div key={doc.id} className="text-sm flex justify-between py-1 border-b last:border-0">
                        <span>{doc.type} — {doc.fileName}</span>
                        <a href={doc.fileUrl} target="_blank" className="text-primary-600 hover:underline">View</a>
                      </div>
                    ))
                  ) : <p className="text-sm text-secondary-400">None</p>}
                </div>

                {/* Applications */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><Award className="w-4 h-4" /> Applications</h4>
                  {selected.applications?.length > 0 ? (
                    selected.applications.map((app: any) => (
                      <div key={app.id} className="text-sm py-1 border-b last:border-0 flex justify-between">
                        <span>{app.opportunity?.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          app.status === 'APPROVED' ? 'bg-success-light text-success-dark' : 'bg-secondary-100 text-secondary-600'
                        }`}>{app.status}</span>
                      </div>
                    ))
                  ) : <p className="text-sm text-secondary-400">None</p>}
                </div>

                {/* Admin Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selected.status !== 'approved' && (
                    <Button onClick={() => updateStatus(selected.id, 'approved')} className="bg-success text-white hover:bg-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                  {selected.status !== 'rejected' && (
                    <Button onClick={() => updateStatus(selected.id, 'rejected')} className="bg-danger text-white hover:bg-red-600">
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}