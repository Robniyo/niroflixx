import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, FileText } from 'lucide-react';
import api from '@/services/api';

export default function FreeResources() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources', { params: { status: 'PUBLISHED', limit: 3 } })
      .then(r => setResources(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-6"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {resources.length === 0 ? (
        <p className="text-secondary-500 text-sm">Resources coming soon.</p>
      ) : (
        resources.map((item) => (
          <Link to={`/resources/${item.slug || item.id}`} key={item.id} className="group flex items-center gap-3 bg-white p-3 rounded-xl border border-secondary-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-secondary-900 text-xs truncate group-hover:text-primary-600 transition-colors">{item.title}</p>
              <div className="flex items-center gap-2 text-[10px] text-secondary-400 mt-1">
                <span>{item.type}</span>
                <span className="flex items-center gap-0.5"><Download className="w-3 h-3" /> {item.downloads || 0}</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}