import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function DashboardSettingsPage() {
  const { user } = useAuth();
  
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated (coming soon)');
  };

  return (
    <div className="pt-24 pb-16 bg-secondary-50 min-h-screen">
      <div className="container-page max-w-lg">
        <Link to="/dashboard" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-h3 font-bold text-secondary-900 mb-6">Account Settings</h1>

        <div className="bg-white rounded-xl border p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} disabled className="w-full px-3 py-2.5 bg-secondary-100 border rounded-lg text-sm text-secondary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm" />
            </div>
            <Button type="submit" rightIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </form>
        </div>
      </div>
    </div>
  );
}