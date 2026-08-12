import { useState, useEffect } from 'react';
import { Mail, Bell, Trash2 } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.get('/admin/subscribers')
      .then(r => setSubscribers(r.data.data.subscribers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    try {
      await api.delete(`/admin/subscribers/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-h4 font-bold text-secondary-900 mb-6">Newsletter Subscribers</h1>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-600" /> Subscribers ({subscribers.length})
        </h3>
        {subscribers.length === 0 ? (
          <p className="text-secondary-500 text-sm">No subscribers yet.</p>
        ) : (
          <div className="space-y-2">
            {subscribers.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b text-sm">
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-secondary-400" /> {s.email}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-caption ${s.active ? 'bg-success-light text-success-dark' : 'bg-secondary-100'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => deleteSubscriber(s.id)} className="text-xs text-danger hover:underline">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}