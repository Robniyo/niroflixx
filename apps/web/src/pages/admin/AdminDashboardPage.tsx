import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Briefcase, FileText, Newspaper, Wrench, LogOut, TrendingUp } from 'lucide-react';
import api from '@/services/api';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [counts, setCounts] = useState<any>({});

  useEffect(() => {
    Promise.all([
      api.get('/admin/users').then(r => r.data.data?.length || 0).catch(() => 0),
      api.get('/courses').then(r => r.data.pagination?.total || 0).catch(() => 0),
      api.get('/opportunities').then(r => r.data.pagination?.total || 0).catch(() => 0),
      api.get('/resources').then(r => r.data.pagination?.total || 0).catch(() => 0),
      api.get('/news').then(r => r.data.pagination?.total || 0).catch(() => 0),
      api.get('/services').then(r => r.data.data?.length || 0).catch(() => 0),
    ]).then(([users, courses, opportunities, resources, news, services]) => {
      setCounts({ users, courses, opportunities, resources, news, services });
    });
  }, []);

  const stats = [
    { label: 'Total Users', value: counts.users ?? '—', icon: Users, color: 'bg-primary-50 text-primary-600', href: '/admin/users' },
    { label: 'Courses', value: counts.courses ?? '—', icon: GraduationCap, color: 'bg-success-light text-success-dark', href: '/admin/courses' },
    { label: 'Opportunities', value: counts.opportunities ?? '—', icon: Briefcase, color: 'bg-accent-50 text-accent-600', href: '/admin/opportunities' },
    { label: 'Resources', value: counts.resources ?? '—', icon: FileText, color: 'bg-info-light text-info', href: '/admin/resources' },
    { label: 'News', value: counts.news ?? '—', icon: Newspaper, color: 'bg-purple-50 text-purple-600', href: '/admin/news' },
    { label: 'Services', value: counts.services ?? '—', icon: Wrench, color: 'bg-warning-light text-warning-dark', href: '/admin/services' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h4 font-bold text-secondary-900">Welcome back, {user?.firstName}</h1>
          <p className="text-secondary-500 mt-1">Here's what's happening with your platform.</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-danger transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.href} className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-h3 font-bold text-secondary-900">{stat.value}</p>
                <p className="text-body-sm text-secondary-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h2 className="text-h5 font-semibold text-secondary-900">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Add Course', href: '/admin/courses', desc: 'Create a new training course' },
            { label: 'Add Opportunity', href: '/admin/opportunities', desc: 'Post scholarship or job' },
            { label: 'Write Article', href: '/admin/news', desc: 'Publish news or updates' },
            { label: 'Add Service', href: '/admin/services', desc: 'Create a new service' },
          ].map((action) => (
            <Link key={action.label} to={action.href} className="p-4 rounded-lg border border-secondary-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
              <p className="font-medium text-secondary-900 text-sm">{action.label}</p>
              <p className="text-xs text-secondary-500 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}