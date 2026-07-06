import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Globe, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    siteName: 'Niroflixx',
    siteDescription: 'Learn, Grow, Succeed',
    contactEmail: 'robertniyonkuru001@gmail.com',
    contactPhone: '+250795064502',
    contactAddress: 'Kigali, Rwanda',
    facebook: 'https://facebook.com/niroflixx',
    twitter: 'https://x.com/niroflixx',
    instagram: 'https://instagram.com/niroflixx',
    linkedin: 'https://linkedin.com/in/nirobwimba',
    youtube: 'https://youtube.com/@niroflixx',
    github: 'https://github.com/nirobwimba',
    tiktok: 'https://tiktok.com/@niroflixx',
    whatsapp: '+250795064502',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const r = await api.get('/admin/settings');
      if (r.data.data) {
        const settings: any = {};
        r.data.data.forEach((s: any) => { settings[s.key] = s.value; });
        setForm(prev => ({ ...prev, ...settings }));
      }
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(form)) {
        await api.put('/admin/settings', { key, value, group: 'general' });
      }
      toast.success('Settings saved successfully!');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="text-h4 font-bold text-secondary-900 mb-6">Platform Settings</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Admin Profile */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h3 className="font-semibold text-secondary-900 mb-4">Admin Profile</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b"><span className="text-secondary-500">Name</span><span className="font-medium">{user?.firstName} {user?.lastName}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-secondary-500">Email</span><span className="font-medium">{user?.email}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-secondary-500">Role</span><span className="font-medium">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role}</span></div>
            <div className="flex justify-between py-2"><span className="text-secondary-500">Platform</span><span className="font-medium">Niroflixx v1.0</span></div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h3 className="font-semibold text-secondary-900 mb-4">System Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b"><span className="text-secondary-500">Database</span><span className="font-medium text-success flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Connected</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-secondary-500">API Status</span><span className="font-medium text-success flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Running</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-secondary-500">Frontend</span><span className="font-medium text-success flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Live</span></div>
            <div className="flex justify-between py-2"><span className="text-secondary-500">Email</span><span className="font-medium text-success flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> SendGrid Active</span></div>
          </div>
        </div>

        {/* Brand Settings */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6 lg:col-span-2">
          <h3 className="font-semibold text-secondary-900 mb-4">Brand & Contact Information</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1"><Globe className="w-3.5 h-3.5 inline mr-1" /> Site Name</label>
                <input type="text" value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tagline</label>
                <input type="text" value={form.siteDescription} onChange={e => setForm({ ...form, siteDescription: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1"><Mail className="w-3.5 h-3.5 inline mr-1" /> Contact Email</label>
                <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1"><Phone className="w-3.5 h-3.5 inline mr-1" /> Contact Phone</label>
                <input type="text" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1"><MapPin className="w-3.5 h-3.5 inline mr-1" /> Address</label>
                <input type="text" value={form.contactAddress} onChange={e => setForm({ ...form, contactAddress: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
            </div>

            <h4 className="font-medium text-sm text-secondary-700 pt-2">Social Media Links</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'facebook', label: 'Facebook' }, { key: 'twitter', label: 'X (Twitter)' },
                { key: 'instagram', label: 'Instagram' }, { key: 'linkedin', label: 'LinkedIn' },
                { key: 'youtube', label: 'YouTube' }, { key: 'github', label: 'GitHub' },
                { key: 'tiktok', label: 'TikTok' }, { key: 'whatsapp', label: 'WhatsApp Number' },
              ].map((s) => (
                <div key={s.key}>
                  <label className="block text-sm font-medium mb-1">{s.label}</label>
                  <input type="text" value={(form as any)[s.key]} onChange={e => setForm({ ...form, [s.key]: e.target.value })} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button type="submit" isLoading={saving} rightIcon={<Save className="w-4 h-4" />}>Save Settings</Button>
            </div>
          </form>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6 lg:col-span-2">
          <h3 className="font-semibold text-secondary-900 mb-3">Advanced Settings (Coming Soon)</h3>
          <div className="grid sm:grid-cols-3 gap-3 text-sm text-secondary-500">
            <span>• Email configuration</span>
            <span>• SMS notifications</span>
            <span>• Backup management</span>
            <span>• Theme customization</span>
            <span>• SEO settings</span>
            <span>• Maintenance mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}