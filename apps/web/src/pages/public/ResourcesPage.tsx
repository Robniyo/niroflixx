import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Download } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import AdBanner from '@/components/ui/AdBanner';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources').then(r => setResources(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-accent-600 font-semibold text-label uppercase tracking-wider">Resources</span>
          <h1 className="text-h1 mt-3 mb-4">Free Learning Resources</h1>
          <p className="text-body-lg text-secondary-600 max-w-2xl mx-auto">Download guides, templates, cheat sheets, and study materials.</p>
        </div>

        <AdBanner position="resources" />

        {resources.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6"><BookOpen className="w-10 h-10 text-accent-400" /></div>
            <h3 className="text-h4 font-semibold mb-3">Resources Coming Soon</h3>
            <p className="text-secondary-500 mb-8">Free materials are being prepared.</p>
            <Link to="/contact"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Request a Resource</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-all text-center">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4"><BookOpen className="w-6 h-6 text-primary-600" /></div>
                <span className="text-caption text-primary-600 font-medium">{r.type || 'Resource'}</span>
                <h3 className="font-semibold mt-1 mb-2">{r.title}</h3>
                <p className="text-body-sm text-secondary-500 mb-4">{r.description?.slice(0, 80)}...</p>
                <div className="flex items-center justify-center gap-2 text-body-sm text-secondary-400 mb-3"><Download className="w-3.5 h-3.5" /> {r.downloadCount || 0} downloads</div>
                {r.fileUrl && (
                  <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" className="text-primary-600 text-sm font-medium hover:underline" download>
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}