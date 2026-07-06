import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { navLinks } from '@/constants/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/ui/NotificationBell';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'CONTENT_MANAGER';

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full max-w-[100vw]', scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-100' : 'bg-transparent')}>
      <div className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">Niro<span className="text-primary-600">flixx</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={cn('px-3 py-2 rounded-md text-body-sm font-medium transition-colors', location.pathname === link.href ? (scrolled ? 'text-primary-600 bg-primary-50' : 'text-white bg-white/10') : (scrolled ? 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50' : 'text-white/80 hover:text-white hover:bg-white/10'))}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />{isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin ? <Link to="/admin"><Button variant="primary" size="sm">Dashboard</Button></Link> : <Link to="/dashboard"><Button variant="ghost" size="sm">My Account</Button></Link>}
                <button onClick={() => { logout().catch(()=>{}); window.location.href = '/'; }} className="text-body-sm text-secondary-500 hover:text-danger transition-colors">Sign Out</button>
              </div>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">Get Started</Button></Link>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-secondary-600 hover:text-secondary-900 rounded-md">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-secondary-100 animate-slide-down">
          <div className="container-page py-4 space-y-1 pb-28">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={cn('block px-3 py-2.5 rounded-md text-body font-medium transition-colors', location.pathname === link.href ? 'text-primary-600 bg-primary-50' : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50')}>
                {link.label}
              </Link>
            ))}
            <hr className="my-3" />
            {isAuthenticated ? (
              <>
                {isAdmin ? <Link to="/admin"><Button variant="primary" className="w-full mb-2">Dashboard</Button></Link> : <Link to="/dashboard"><Button variant="ghost" className="w-full mb-2">My Account</Button></Link>}
                <button onClick={() => { logout().catch(()=>{}); window.location.href = '/'; }} className="w-full text-left px-3 py-2.5 rounded-md text-body font-medium text-danger hover:bg-danger-light/30 transition-colors">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="outline" className="w-full mb-2">Sign In</Button></Link>
                <Link to="/register"><Button variant="primary" className="w-full">Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}