import { useState, useEffect } from 'react';
import { Mail, Bell, Trash2 } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function SubscribersPage() {
  const [data, setData] = useState<any>({ subscribers: [], messages: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.get('/admin/subscribers').then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Delete this subscriber?')) return;
    try { await api.delete(`/admin/subscribers/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try { await api.delete(`/admin/messages/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="text-center py-16 text-secondary-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-h4 font-bold text-secondary-900 mb-6">Subscribers & Messages</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary-600" /> Notification Subscribers ({data.subscribers.length})</h3>
          {data.subscribers.length === 0 ? <p className="text-secondary-500 text-sm">No subscribers yet.</p> : (
            <div className="space-y-2">
              {data.subscribers.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b text-sm">
                  <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-secondary-400" /> {s.email}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-caption ${s.active ? 'bg-success-light text-success-dark' : 'bg-secondary-100'}`}>{s.active ? 'Active' : 'Inactive'}</span>
                    <button onClick={() => deleteSubscriber(s.id)} className="text-xs text-danger hover:underline"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-primary-600" /> Contact Messages ({data.messages.length})</h3>
          {data.messages.length === 0 ? <p className="text-secondary-500 text-sm">No messages yet.</p> : (
            <div className="space-y-3">
              {data.messages.map((m: any) => (
                <div key={m.id} className="p-3 bg-secondary-50 rounded-lg text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-secondary-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                      <button onClick={() => deleteMessage(m.id)} className="text-xs text-danger hover:underline"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <p className="text-secondary-500 text-xs mb-1">{m.subject}</p>
                  <p className="text-secondary-600">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}