import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, Calendar, Clock, MapPin, LogOut, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

function getTodayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function isClassDay(classDays: string): boolean {
  if (!classDays) return false;
  const today = getTodayName().toLowerCase().substring(0, 3);
  const days = classDays.toLowerCase().split(',').map(d => d.trim().substring(0, 3));
  return days.includes(today);
}

function isWithinClassTime(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return true;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return currentMinutes >= (sh * 60 + sm) && currentMinutes <= (eh * 60 + em);
}

export default function TrainerDashboard() {
  const { user } = useAuth();
if (!user) {
  window.location.href = '/login';
  return null;
}
  const { user, logout } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [todayDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      window.location.href = '/';
      return;
    }
    api.get('/classes').then(r => {
      const myClasses = (r.data.data || []).filter((c: any) => c.trainer?.userId === user.id);
      setClasses(myClasses);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const viewStudents = async (classId: string) => {
    try {
      const cls = classes.find(c => c.id === classId);
      setSelectedClass(cls);
      const r = await api.get(`/enrollments/class/${classId}`);
      setStudents(r.data.data);
      const attRes = await api.get(`/attendance/class/${classId}`);
      const todayAttendance = (attRes.data.data || []).filter((a: any) => a.date?.startsWith(todayDate));
      const attMap: Record<string, string> = {};
      r.data.data.forEach((s: any) => {
        const existing = todayAttendance.find((a: any) => a.userId === s.user?.id);
        attMap[s.user?.id] = existing?.status || 'PRESENT';
      });
      setAttendance(attMap);
    } catch { toast.error('Failed to load students'); }
  };

  const toggleAttendance = (userId: string) => {
    setAttendance(prev => {
      const current = prev[userId] || 'PRESENT';
      const next = current === 'PRESENT' ? 'ABSENT' : current === 'ABSENT' ? 'LATE' : 'PRESENT';
      return { ...prev, [userId]: next };
    });
  };

  const saveAttendance = async () => {
    if (!selectedClass) return;
    try {
      for (const [userId, status] of Object.entries(attendance)) {
        await api.post('/attendance', { classId: selectedClass.id, userId, status, date: todayDate });
      }
      toast.success('Attendance saved!');
      setSelectedClass(null);
      setStudents([]);
    } catch { toast.error('Failed to save'); }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'PRESENT') return 'border-l-4 border-l-success bg-success-light/30';
    if (status === 'ABSENT') return 'border-l-4 border-l-danger bg-danger-light/30';
    if (status === 'LATE') return 'border-l-4 border-l-accent-400 bg-accent-50/30';
    return '';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PRESENT') return 'bg-success-light text-success-dark';
    if (status === 'ABSENT') return 'bg-danger-light text-danger-dark';
    if (status === 'LATE') return 'bg-accent-50 text-accent-700';
    return 'bg-secondary-100 text-secondary-600';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'PRESENT') return <CheckCircle className="w-5 h-5 text-success" />;
    if (status === 'ABSENT') return <XCircle className="w-5 h-5 text-danger" />;
    if (status === 'LATE') return <AlertCircle className="w-5 h-5 text-accent-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-secondary-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-secondary-100 sticky top-0 z-30">
          <div className="px-4 lg:container-page flex items-center justify-between h-14 lg:h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <div>
              <h1 className="font-semibold text-secondary-900">Trainer Portal</h1>
              <p className="text-xs text-secondary-500">{user.firstName} {user.lastName} • {getTodayName()}</p>
            </div>
          </div>
          <button onClick={() => { logout().catch(()=>{}); window.location.href = '/'; }} className="flex items-center gap-2 px-3 py-2 text-body-sm text-secondary-500 hover:text-danger hover:bg-danger-light/20 rounded-lg transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Welcome */}
        <div className="mb-8">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Trainer Dashboard</span>
          <h1 className="text-h3 font-bold text-secondary-900 mt-1">Welcome, {user.firstName} 👋</h1>
          <p className="text-secondary-500 mt-2">Manage your classes, students, and attendance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-10">
          <div className="bg-white rounded-2xl border border-secondary-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center"><BookOpen className="w-6 h-6 text-primary-600" /></div>
              <div><p className="text-display-lg font-bold text-secondary-900">{classes.length}</p><p className="text-body-sm text-secondary-500">My Classes</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-secondary-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-success-light rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-success" /></div>
              <div><p className="text-display-lg font-bold text-secondary-900">{classes.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)}</p><p className="text-body-sm text-secondary-500">Total Students</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-secondary-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6 text-accent-600" /></div>
              <div><p className="text-display-lg font-bold text-secondary-900">{todayDate}</p><p className="text-body-sm text-secondary-500">Today</p></div>
            </div>
          </div>
        </div>

        {/* Classes */}
        <h2 className="text-h4 font-bold text-secondary-900 mb-5">My Classes</h2>
        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-secondary-200 p-12 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4"><BookOpen className="w-8 h-8 text-primary-400" /></div>
            <p className="text-secondary-500 font-medium">No classes assigned yet.</p>
            <p className="text-secondary-400 text-body-sm mt-1">Contact an administrator to get assigned to a class.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {classes.map((c) => {
              const today = isClassDay(c.days);
              const inTime = isWithinClassTime(c.startTime, c.endTime);
              const canTakeAttendance = today && inTime;
              return (
                <div key={c.id} className={`bg-white rounded-2xl border p-6 hover:shadow-lg transition-all ${canTakeAttendance ? 'ring-2 ring-success/30' : ''}`}>
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-secondary-900">{c.name}</h3>
                      <p className="text-body-sm text-primary-600 font-medium">{c.course?.title || 'No course'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-caption font-semibold h-fit ${c.status === 'PUBLISHED' ? 'bg-success-light text-success-dark' : c.status === 'RUNNING' ? 'bg-info-light text-info' : 'bg-secondary-100 text-secondary-600'}`}>{c.status}</span>
                  </div>

                  <div className="space-y-2 text-body-sm text-secondary-500 mb-4">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-secondary-400" /><span className="font-medium text-secondary-700">{c.days || 'Schedule TBD'}</span>{today && <span className="text-success text-xs font-semibold">• TODAY</span>}</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-secondary-400" />{c.startTime || '?'} - {c.endTime || '?'}{inTime && <span className="text-success text-xs font-semibold">• NOW</span>}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary-400" />{c.location || c.type?.replace('_', ' ') || 'Online'}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-secondary-400" /><span className="font-medium">{c.enrolledCount || 0}/{c.capacity} students</span></div>
                  </div>

                  {c.description && <p className="text-body-sm text-secondary-600 mb-4 pb-4 border-b border-secondary-100">{c.description}</p>}

                  <div className="flex flex-wrap gap-2">
                    {c.meetingLink && (
                      <a href={c.meetingLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full" leftIcon={<Video className="w-4 h-4" />}>Join Meeting</Button>
                      </a>
                    )}
                    <Button size="sm" variant={canTakeAttendance ? 'primary' : 'outline'} onClick={() => viewStudents(c.id)} leftIcon={<Users className="w-4 h-4" />}>
                      {canTakeAttendance ? 'Take Attendance' : 'View Students'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Attendance Modal */}
        {selectedClass && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setSelectedClass(null); setStudents([]); }} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div>
                  <h3 className="font-semibold text-lg">{selectedClass.name}</h3>
                  <p className="text-body-sm text-secondary-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {students.length} students</p>
                </div>
                <button onClick={() => { setSelectedClass(null); setStudents([]); }} className="p-2 hover:bg-secondary-50 rounded-lg text-secondary-400 text-lg">✕</button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-2 text-body-sm">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success"></span> Present</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-danger"></span> Absent</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent-400"></span> Late</span>
                </div>
                <p className="text-xs text-secondary-400 mb-4">Click on a student to cycle: Present → Absent → Late → Present</p>
                {students.length === 0 ? (
                  <p className="text-secondary-500 text-center py-8">No students enrolled yet.</p>
                ) : (
                  <div className="space-y-2 mb-6">
                    {students.map((s: any) => (
                      <div key={s.user?.id} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all hover:shadow-sm ${getStatusStyle(attendance[s.user?.id] || 'PRESENT')}`} onClick={() => toggleAttendance(s.user?.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-sm text-secondary-600 shadow-sm">{s.user?.firstName?.[0]}{s.user?.lastName?.[0]}</div>
                          <div>
                            <p className="font-medium text-secondary-900">{s.user?.firstName} {s.user?.lastName}</p>
                            <p className="text-xs text-secondary-500">{s.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(attendance[s.user?.id] || 'PRESENT')}
                          <span className={`px-2 py-0.5 rounded-full text-caption font-semibold ${getStatusBadge(attendance[s.user?.id] || 'PRESENT')}`}>{attendance[s.user?.id] || 'PRESENT'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => { setSelectedClass(null); setStudents([]); }}>Cancel</Button>
                  <Button className="flex-1" onClick={saveAttendance} leftIcon={<CheckCircle className="w-4 h-4" />}>Save Attendance</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}