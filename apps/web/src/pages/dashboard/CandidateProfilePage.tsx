import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Plus, Save, User, GraduationCap, Briefcase, Wrench, CheckCircle, XCircle, Clock, Upload, FileText, ExternalLink } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CandidateProfilePage() {
  const { user } = useAuth();
  
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ headline: '', summary: '', currentEducation: '', currentInstitution: '', availability: '' });
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', field: '', startDate: '', current: false });
  const [newExp, setNewExp] = useState({ company: '', position: '', startDate: '', current: false, description: '' });
  const [newSkill, setNewSkill] = useState({ name: '', level: 'beginner' });
  const [saving, setSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string>('');

  useEffect(() => {
    fetchProfile();
    api.get('/candidates/status').then(r => {
      if (r.data.data?.exists) setProfileStatus(r.data.data.status);
    }).catch(() => {});
  }, []);

  const fetchProfile = async () => {
    try {
      const r = await api.get('/candidates/me');
      if (r.data.data) {
        setProfile(r.data.data);
        setForm({
          headline: r.data.data.headline || '',
          summary: r.data.data.summary || '',
          currentEducation: r.data.data.currentEducation || '',
          currentInstitution: r.data.data.currentInstitution || '',
          availability: r.data.data.availability || '',
        });
      }
    } catch {} finally { setLoading(false); }
  };

  const updateProfile = async () => {
    setSaving(true);
    try { await api.put('/candidates/me', form); toast.success('Profile updated'); fetchProfile(); } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const addEducation = async () => {
    if (!newEdu.institution) return;
    try { await api.post('/candidates/education', newEdu); toast.success('Education added'); fetchProfile(); setNewEdu({ institution: '', degree: '', field: '', startDate: '', current: false }); } catch { toast.error('Failed'); }
  };

  const addExperience = async () => {
    if (!newExp.company) return;
    try { await api.post('/candidates/experience', newExp); toast.success('Experience added'); fetchProfile(); setNewExp({ company: '', position: '', startDate: '', current: false, description: '' }); } catch { toast.error('Failed'); }
  };

  const addSkill = async () => {
    if (!newSkill.name) return;
    try { await api.post('/candidates/skills', newSkill); toast.success('Skill added'); fetchProfile(); setNewSkill({ name: '', level: 'beginner' }); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="min-h-screen bg-secondary-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="container-page max-w-4xl py-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-h3 font-bold text-secondary-900 mb-3">Candidate Profile</h1>
        <p className="text-secondary-500 mb-8">Complete your profile to unlock scholarship, job, and internship opportunities.</p>

        {/* Status Banners */}
        {profileStatus === 'approved' && (
          <div className="bg-success-light border border-success rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center flex-shrink-0"><CheckCircle className="w-6 h-6 text-white" /></div>
            <div><h4 className="font-semibold text-success-dark">Profile Approved ✅</h4><p className="text-success-dark/80 text-body-sm">We're matching you with opportunities. We'll contact you soon!</p></div>
          </div>
        )}
        {profileStatus === 'rejected' && (
          <div className="bg-danger-light border border-danger rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-danger rounded-xl flex items-center justify-center flex-shrink-0"><XCircle className="w-6 h-6 text-white" /></div>
            <div><h4 className="font-semibold text-danger-dark">Profile Not Approved</h4><p className="text-danger-dark/80 text-body-sm">Please update your information and resubmit.</p></div>
          </div>
        )}
        {profileStatus === 'active' && (
          <div className="bg-accent-50 border border-accent-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-400 rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-white" /></div>
            <div><h4 className="font-semibold text-accent-700">Under Review</h4><p className="text-accent-700/80 text-body-sm">Our team is reviewing your profile. We'll notify you soon.</p></div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 mb-6 shadow-sm">
          <h2 className="text-h4 font-semibold mb-5 flex items-center gap-2"><User className="w-5 h-5 text-primary-600" /> Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Headline</label><input type="text" value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} placeholder="e.g. Aspiring Software Developer" className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" /></div>
            <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Availability</label><input type="text" value={form.availability} onChange={e => setForm({...form, availability: e.target.value})} placeholder="e.g. Immediate" className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" /></div>
            <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Current Education</label><input type="text" value={form.currentEducation} onChange={e => setForm({...form, currentEducation: e.target.value})} placeholder="e.g. Bachelor's Degree" className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" /></div>
            <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Current Institution</label><input type="text" value={form.currentInstitution} onChange={e => setForm({...form, currentInstitution: e.target.value})} placeholder="e.g. University of the world" className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" /></div>
          </div>
          <div className="mb-5"><label className="block text-sm font-medium text-secondary-700 mb-1.5">Summary</label><textarea rows={3} value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} placeholder="Brief summary about yourself, your goals, and what you're looking for..." className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm resize-none focus:outline-none focus:border-primary-500 transition-all" /></div>
          <Button onClick={updateProfile} isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>Save Profile</Button>
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 mb-6 shadow-sm">
          <h2 className="text-h4 font-semibold mb-5 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary-600" /> Education</h2>
          {profile?.education?.length > 0 && (
            <div className="space-y-3 mb-5">
              {profile.education.map((e: any) => (
                <div key={e.id} className="flex justify-between items-center p-4 bg-secondary-50 rounded-xl text-sm">
                  <div><p className="font-medium text-secondary-900">{e.degree} in {e.field}</p><p className="text-secondary-500 text-body-sm">{e.institution} {e.current && '• Current'}</p></div>
                </div>
              ))}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="Institution *" value={newEdu.institution} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
            <input type="text" placeholder="Degree *" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
            <input type="text" placeholder="Field of Study" value={newEdu.field} onChange={e => setNewEdu({...newEdu, field: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
            <input type="date" value={newEdu.startDate} onChange={e => setNewEdu({...newEdu, startDate: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
          </div>
          <label className="flex items-center gap-2 text-sm text-secondary-700 mb-4"><input type="checkbox" checked={newEdu.current} onChange={e => setNewEdu({...newEdu, current: e.target.checked})} className="rounded" /> Currently studying here</label>
          <Button size="sm" variant="outline" onClick={addEducation} leftIcon={<Plus className="w-3.5 h-3.5" />}>Add Education</Button>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 mb-6 shadow-sm">
          <h2 className="text-h4 font-semibold mb-5 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary-600" /> Work Experience</h2>
          {profile?.experiences?.length > 0 && (
            <div className="space-y-3 mb-5">
              {profile.experiences.map((e: any) => (
                <div key={e.id} className="p-4 bg-secondary-50 rounded-xl text-sm">
                  <p className="font-medium text-secondary-900">{e.position} at {e.company}</p>
                  <p className="text-secondary-500 text-body-sm">{e.current ? 'Current • ' : ''}{e.description?.slice(0, 80)}</p>
                </div>
              ))}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="Company *" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
            <input type="text" placeholder="Position" value={newExp.position} onChange={e => setNewExp({...newExp, position: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
            <input type="date" value={newExp.startDate} onChange={e => setNewExp({...newExp, startDate: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
            <input type="text" placeholder="Description" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
          </div>
          <Button size="sm" variant="outline" onClick={addExperience} leftIcon={<Plus className="w-3.5 h-3.5" />}>Add Experience</Button>
        </div>

        {/* Documents */}
<div className="bg-white rounded-2xl border border-secondary-100 p-6 mb-6 shadow-sm">
  <h2 className="text-h4 font-semibold mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600" /> Documents</h2>
  <p className="text-secondary-500 text-body-sm mb-5">Upload your documents for applications. These help us match you with opportunities.</p>
  
  <div className="grid sm:grid-cols-2 gap-4 mb-4">
    {[
      { label: 'CV / Resume', key: 'cv' },
      { label: 'Diploma / Transcript', key: 'diploma' },
      { label: 'Recommendation Letter', key: 'recommendation' },
      { label: 'National ID / Passport', key: 'id' },
    ].map((doc) => {
      const existing = profile?.documents?.find((d: any) => d.type === doc.key);
      return (
        <div key={doc.key} className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
          <p className="text-sm font-medium text-secondary-900 mb-2">{doc.label}</p>
          {existing ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              <a href={`http://localhost:5000${existing.fileUrl}`} target="_blank" className="text-sm text-primary-600 hover:underline truncate">{existing.fileName}</a>
            </div>
          ) : (
            <div>
              <label className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg cursor-pointer hover:bg-primary-50 text-sm text-secondary-600 transition-all">
                <Upload className="w-4 h-4" /> Upload
                <input type="file" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const fd = new FormData();
                    fd.append('file', f);
                    const r = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                    await api.post('/candidates/documents', { type: doc.key, fileName: f.name, fileUrl: r.data.data.url });
                    toast.success(`${doc.label} uploaded!`);
                    fetchProfile();
                  } catch { toast.error('Upload failed'); }
                }} />
              </label>
              {(doc.key === 'cv' || doc.key === 'recommendation') && (
                <Link to="/services" className="flex items-center gap-1 text-xs text-accent-600 hover:underline mt-2">
                  <ExternalLink className="w-3 h-3" /> Don't have one? We can help
                </Link>
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 mb-6 shadow-sm">
          <h2 className="text-h4 font-semibold mb-5 flex items-center gap-2"><Wrench className="w-5 h-5 text-primary-600" /> Skills</h2>
          {profile?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {profile.skills.map((s: any) => (
                <span key={s.id} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">{s.name} {s.level && <span className="text-primary-400">• {s.level}</span>}</span>
              ))}
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            <input type="text" placeholder="Skill name" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="flex-1 min-w-[150px] px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all" />
            <select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})} className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all">
              <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="expert">Expert</option>
            </select>
            <Button size="sm" variant="outline" onClick={addSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}