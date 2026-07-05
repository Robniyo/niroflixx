import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Briefcase, Download, Settings, LogOut, User, TrendingUp, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import AdBanner from '@/components/ui/AdBanner';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ enrollments: 0, downloads: 0, applications: 0 });
  const [candidateStatus, setCandidateStatus] = useState<any>(null);

  useEffect(() => {
    api.get('/enrollments').then(r => setStats(prev => ({ ...prev, enrollments: r.data.data?.length || 0 }))).catch(() => {});
    api.get('/candidates/status').then(r => setCandidateStatus(r.data.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-secondary-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-lg font-bold text-secondary-900">Niro<span className="text-primary-600">flixx</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-secondary-50 rounded-full">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-body-sm font-medium text-secondary-700">{user?.firstName} {user?.lastName}</span>
            </div>
            <button onClick={() => { logout(); window.location.href = '/'; }} className="flex items-center gap-2 px-4 py-2 text-body-sm text-secondary-500 hover:text-danger hover:bg-danger-light/20 rounded-lg transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Dashboard</span>
          <h1 className="text-h3 md:text-h2 font-bold text-secondary-900 mt-1">Welcome back, {user?.firstName} 👋</h1>
          <p className="text-secondary-500 mt-2">Here's an overview of your learning journey.</p>
        </div>

        {/* Candidate Status Banner */}
        {candidateStatus && !candidateStatus.exists && (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Complete Your Candidate Profile</h3>
                <p className="text-white/80 text-body-sm mt-1">Unlock scholarship, job, and internship opportunities by completing your profile. We'll match you with the best opportunities.</p>
                <Link to="/dashboard/candidate" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white text-primary-600 rounded-lg text-sm font-semibold hover:bg-white/90 transition-all">
                  Complete Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {candidateStatus && candidateStatus.exists && candidateStatus.status === 'active' && (
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Profile Under Review</h3>
                <p className="text-white/80 text-body-sm mt-1">Our team is reviewing your candidate profile. We'll notify you via email or WhatsApp when matching opportunities are found.</p>
              </div>
            </div>
          </div>
        )}

        {candidateStatus && candidateStatus.exists && candidateStatus.status === 'approved' && (
          <div className="bg-gradient-to-r from-success to-emerald-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Profile Approved ✅</h3>
                <p className="text-white/80 text-body-sm mt-1">Your candidate profile has been approved! We're actively matching you with opportunities. Be patient — we'll contact you soon.</p>
              </div>
            </div>
          </div>
        )}

        {candidateStatus && candidateStatus.exists && candidateStatus.status === 'rejected' && (
          <div className="bg-gradient-to-r from-danger to-red-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Profile Not Approved</h3>
                <p className="text-white/80 text-body-sm mt-1">Your profile needs some updates. Please review and update your information, then resubmit.</p>
                <Link to="/dashboard/candidate" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white text-danger rounded-lg text-sm font-semibold hover:bg-white/90 transition-all">
                  Update Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-10">
          {[
            { label: 'Enrolled Courses', value: stats.enrollments, icon: BookOpen, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', text: 'text-primary-600' },
            { label: 'Applications', value: stats.applications, icon: Briefcase, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50', text: 'text-accent-600' },
            { label: 'Downloads', value: stats.downloads, icon: Download, color: 'from-success to-emerald-600', bg: 'bg-success-light', text: 'text-success-dark' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-secondary-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${s.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <s.icon className={`w-6 h-6 ${s.text}`} />
                </div>
                <div>
                  <p className="text-display-lg font-bold text-secondary-900">{s.value}</p>
                  <p className="text-body-sm text-secondary-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <AdBanner position="dashboard" />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-secondary-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h3 className="text-h5 font-semibold text-secondary-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Candidate Profile', desc: 'Complete to unlock opportunities', href: '/dashboard/candidate', icon: User, highlight: true },
                { label: 'Browse Courses', desc: 'Find and enroll in training', href: '/academy', icon: BookOpen },
                { label: 'View Opportunities', desc: 'Scholarships, jobs & more', href: '/opportunities', icon: Briefcase },
                { label: 'Download Resources', desc: 'Free PDFs & templates', href: '/resources', icon: Download },
                { label: 'Request Services', desc: 'CV writing, design & more', href: '/services', icon: Settings },
                { label: 'Account Settings', desc: 'Update your info', href: '/dashboard/settings', icon: Settings },
              ].map((a) => (
                <Link key={a.label} to={a.href} className={`flex items-start gap-3 p-4 rounded-xl border transition-all group ${a.highlight ? 'border-primary-300 bg-primary-50/50 hover:bg-primary-50 hover:border-primary-400' : 'border-secondary-100 hover:border-primary-200 hover:bg-primary-50/30'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 ${a.highlight ? 'bg-primary-100' : 'bg-primary-50'}`}>
                    <a.icon className={`w-4 h-4 ${a.highlight ? 'text-primary-700' : 'text-primary-600'}`} />
                  </div>
                  <div>
                    <p className={`font-medium text-body-sm ${a.highlight ? 'text-primary-700' : 'text-secondary-900'}`}>{a.label}</p>
                    <p className="text-caption text-secondary-400 mt-0.5">{a.desc}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 ml-auto flex-shrink-0 transition-all group-hover:translate-x-1 ${a.highlight ? 'text-primary-400' : 'text-secondary-300 group-hover:text-primary-600'}`} />
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-secondary-100 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
                <span className="text-white font-bold text-2xl">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
              </div>
              <h3 className="font-semibold text-lg text-secondary-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-body-sm text-secondary-500">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-caption font-medium">{user?.role}</span>
            </div>
            <div className="space-y-3 pt-4 border-t border-secondary-100">
              <Link to="/dashboard/settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 text-body-sm transition-colors">
                <span className="flex items-center gap-2"><Settings className="w-4 h-4 text-secondary-400" /> Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary-300" />
              </Link>
              <Link to="/dashboard/candidate" className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 text-body-sm transition-colors">
                <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary-500" /> Candidate Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}