import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import api from '@/services/api';

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources').then(r => setDownloads(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-24 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="pt-24 pb-16 bg-secondary-50 min-h-screen">
      <div className="container-page max-w-2xl">
        <Link to="/dashboard" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-h3 font-bold text-secondary-900 mb-6">My Downloads</h1>
        {downloads.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <Download className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No downloads yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloads.map((r: any) => (
              <div key={r.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-body-sm text-secondary-500">{r.type || 'Resource'}</p>
                  </div>
                </div>
                {r.fileUrl && (
                  <a href={`http://localhost:5000${r.fileUrl}`} download className="text-primary-600 text-sm hover:underline">Download</a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}