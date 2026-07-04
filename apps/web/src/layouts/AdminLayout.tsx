import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Briefcase, FileText, Newspaper, Settings, LogOut, Wrench, BookOpen, Quote, Building2, UserCheck, Megaphone, Bell, Calendar, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const allLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'INSTRUCTOR'] },
  { label: 'Users', href: '/admin/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Courses', href: '/admin/courses', icon: GraduationCap, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'INSTRUCTOR'] },
  { label: 'Classes', href: '/admin/classes', icon: BookOpen, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Opportunities', href: '/admin/opportunities', icon: Briefcase, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Services', href: '/admin/services', icon: Wrench, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Resources', href: '/admin/resources', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'News', href: '/admin/news', icon: Newspaper, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Settings', href: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Quote, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Partners', href: '/admin/partners', icon: Building2, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Trainers', href: '/admin/trainers', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Candidates', href: '/admin/candidates', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Applications', href: '/admin/applications', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Ads', href: '/admin/advertisements', icon: Megaphone, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Subscribers', href: '/admin/subscribers', icon: Bell, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Sessions', href: '/admin/sessions', icon: Calendar, roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Reports', href: '/admin/reports', icon: Calendar, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Categories', href: '/admin/categories', icon: Folder, roles: ['SUPER_ADMIN', 'ADMIN'] },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const visibleLinks = allLinks.filter(link => user && link.roles.includes(user.role));

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-secondary-50">
      <aside className="w-64 bg-white border-r border-secondary-100 flex flex-col">
        <div className="p-5 border-b border-secondary-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-lg font-bold text-secondary-900">
              Niro<span className="text-primary-600">flixx</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors',
                location.pathname === link.href
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-secondary-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-secondary-500 hover:text-danger hover:bg-danger-light/30 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}