import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import api from '@/services/api';
import { footerLinks } from '@/constants/navigation';
import AdBanner from '@/components/ui/AdBanner';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Robniyo', icon: 'github' },
  { label: 'YouTube', href: 'https://youtube.com/@niroflixx', icon: 'youtube' },
  { label: 'X (Twitter)', href: 'https://x.com/niroflixx', icon: 'twitter' },
  { label: 'Instagram', href: 'https://instagram.com/niroflixx', icon: 'instagram' },
  { label: 'TikTok', href: 'https://tiktok.com/@niroflixx', icon: 'tiktok' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/subscribers', { email, interests: 'Newsletter' });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-secondary-900 text-secondary-100 pt-16 pb-8 w-full overflow-hidden">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-300 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-white">Niro<span className="text-primary-400">flixx</span></span>
            </Link>
            <p className="text-secondary-400 text-body-sm mb-6 max-w-sm">
              Learn, discover opportunities, request professional services, and grow your career through one unified digital ecosystem.
            </p>
            <div className="space-y-2 text-body-sm text-secondary-400">
              <a href="mailto:robertniyonkuru001@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> robertniyonkuru001@gmail.com
              </a>
              <a href="tel:+250795064502" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" /> +250 795 064 502
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Kigali, the world
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-white font-semibold mb-4">Company</h5>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-secondary-400 hover:text-white transition-colors text-body-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academy */}
          <div>
            <h5 className="text-white font-semibold mb-4">Academy</h5>
            <ul className="space-y-2.5">
              {footerLinks.academy.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-secondary-400 hover:text-white transition-colors text-body-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div>
            <h5 className="text-white font-semibold mb-4">Opportunities</h5>
            <ul className="space-y-2.5">
              {footerLinks.opportunities.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-secondary-400 hover:text-white transition-colors text-body-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-white font-semibold mb-4">Services</h5>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-secondary-400 hover:text-white transition-colors text-body-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

       

        {/* Bottom */}
        <AdBanner position="footer" />
        <div className="border-t border-secondary-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-secondary-500 text-body-sm">
            &copy; {new Date().getFullYear()} Niroflixx. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
  <a
    key={social.label}
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 bg-secondary-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white transition-all"
    title={social.label}
  >
    {social.icon === 'github' && (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    )}
    {social.icon === 'youtube' && (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
    )}
    {social.icon === 'twitter' && (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    )}
    {social.icon === 'instagram' && (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    )}
    {social.icon === 'tiktok' && (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
    )}
  </a>
))}
<a
  href="https://wa.me/250795064502"
  target="_blank"
  rel="noopener noreferrer"
  className="w-9 h-9 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center text-white transition-all"
  title="WhatsApp"
>
  <Phone className="w-4 h-4" />
</a>
          </div>
        </div>
      </div>
    </footer>
  );
}