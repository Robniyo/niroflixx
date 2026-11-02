import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, Briefcase, Download, Settings, LogOut, User, 
  ArrowRight, Clock, CheckCircle, XCircle, LayoutDashboard, 
  Search, Bell, FileText, Wrench, Menu, X, GraduationCap
} from 'lucide-react';
import api from '@/services/api';
import AdBanner from '@/components/ui/AdBanner';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ enrollments: 0, downloads: 0, applications: 0 });
  const [candidateStatus, setCandidateStatus] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    
    // Fetch real stats from your API
    Promise.all([
      api.get('/courses/my-enrollments').then(r => r.data.data?.length || 0).catch(() => 0),
      api.get('/applications').then(r => r.data.data?.length || 0).catch(() => 0),
      api.get('/resources').then(r => r.data.pagination?.total || r.data.data?.length || 0).catch(() => 0),
    ]).then(([enrollments, applications, downloads]) => {
      setStats({ enrollments, applications, downloads });
    });

    // You can also fetch candidate status here if needed
    api.get('/candidates/my-profile').then(r => setCandidateStatus(r.data.data)).catch(() => {});
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const handleLogout = async () => {
    try { await logout(); } catch (e) {}
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden font-sans">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR (Left) - Like Scholarship Region */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-full w-64 bg-white border-r border-secondary-100 
        flex flex-col transition-transform duration-300 overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-secondary-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <img src="/flogo.png" alt="Future Scholars" className="h-8 w-auto" />
            <span className="text-lg font-bold text-secondary-900">Future Scholars</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-secondary-50 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-primary-50 text-primary-700">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/academy" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors">
            <GraduationCap className="w-5 h-5" /> Academy
          </Link>
          <Link to="/opportunities" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors">
            <Briefcase className="w-5 h-5" /> Opportunities
          </Link>
          <Link to="/services" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors">
            <Wrench className="w-5 h-5" /> Services
          </Link>
          <Link to="/resources" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors">
            <FileText className="w-5 h-5" /> Resources
          </Link>
          
          <div className="pt-4 mt-4 border-t border-secondary-100">
             <Link to="/dashboard/candidate" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors">
              <User className="w-5 h-5" /> My Profile
            </Link>
            <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-secondary-100">
          <Link to="/dashboard/candidate" className="flex items-center justify-center w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-sm">
            Complete Profile
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT (Right) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-secondary-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-50 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search Bar */}
            <div className="hidden sm:flex items-center gap-2 max-w-md w-full bg-secondary-50 px-4 py-2 rounded-full border border-secondary-100 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <Search className="w-4 h-4 text-secondary-400" />
              <input type="text" placeholder="Search opportunities, courses..." className="bg-transparent border-none outline-none text-sm w-full placeholder-secondary-400 text-secondary-900" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-secondary-500 hover:bg-secondary-50 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-secondary-100">
              <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-secondary-900 leading-tight">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-secondary-500">Student</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-secondary-400 hover:text-danger hover:bg-danger-light/20 rounded-lg ml-2 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Welcome back, {user?.firstName} 👋</h1>
                <p className="text-secondary-500 mt-1">Here is what is happening with your account today.</p>
              </div>
            </div>

            {/* Candidate Status Banner */}
            {candidateStatus && !candidateStatus.exists && (
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Complete Your Candidate Profile</h3>
                    <p className="text-white/80 text-sm mt-1">Unlock scholarship, job, and internship opportunities by completing your profile.</p>
                    <Link to="/dashboard/candidate" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-primary-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
                      Complete Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Stat Cards (Quick Navigation) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/dashboard/enrollments" className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{stats.enrollments}</p>
                    <p className="text-sm text-secondary-500 font-medium">My Enrollments</p>
                  </div>
                </div>
              </Link>

              <Link to="/dashboard/requests" className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{stats.applications}</p>
                    <p className="text-sm text-secondary-500 font-medium">My Requests</p>
                  </div>
                </div>
              </Link>

              <Link to="/resources" className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6 text-success-dark" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900">{stats.downloads}</p>
                    <p className="text-sm text-secondary-500 font-medium">Resources</p>
                  </div>
                </div>
              </Link>
            </div>

            <AdBanner position="dashboard" />

            {/* Main Grid Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Left Column (Quick Actions) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-secondary-100 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4">Quick Actions</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Browse Courses', desc: 'Find new skills', href: '/academy', icon: BookOpen },
                      { label: 'Find Opportunities', desc: 'Scholarships & jobs', href: '/opportunities', icon: Briefcase },
                      { label: 'Service Requests', desc: 'CV, Web, Design', href: '/services', icon: Settings },
                      { label: 'Candidate Profile', desc: 'Update your info', href: '/dashboard/candidate', icon: User },
                    ].map((a) => (
                      <Link key={a.label} to={a.href} className="flex items-start gap-3 p-4 rounded-xl border border-secondary-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                          <a.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900 text-sm">{a.label}</p>
                          <p className="text-xs text-secondary-500 mt-0.5">{a.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Profile / Tips) */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-secondary-100 p-6 shadow-sm">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <h3 className="font-bold text-secondary-900">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-sm text-secondary-500">{user?.email}</p>
                  </div>
                  <Link to="/dashboard/settings" className="mt-4 flex items-center justify-center w-full py-2.5 border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
                    Edit Profile
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100 p-6">
                  <h4 className="font-bold text-primary-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-600" /> Quick Tips
                  </h4>
                  <ul className="space-y-3 text-sm text-primary-800">
                    <li className="flex gap-2"><span>•</span> Complete your profile to get matched 21x faster.</li>
                    <li className="flex gap-2"><span>•</span> Check deadlines regularly to avoid missing out.</li>
                    <li className="flex gap-2"><span>•</span> Save scholarships to apply for them later.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}