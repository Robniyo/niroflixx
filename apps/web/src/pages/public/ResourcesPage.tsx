import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Download, Eye, X } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import AdBanner from '@/components/ui/AdBanner';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.get('/resources').then(r => setResources(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-16">
        <div className="container-page">
          <div className="text-center mb-12">
            <div className="h-5 w-20 bg-secondary-200 rounded animate-pulse mx-auto mb-3" />
            <div className="h-10 w-64 bg-secondary-200 rounded animate-pulse mx-auto mb-4" />
            <div className="h-5 w-96 max-w-full bg-secondary-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden">
                <div className="h-40 bg-secondary-100 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-16 bg-secondary-100 rounded animate-pulse mx-auto" />
                  <div className="h-5 w-3/4 bg-secondary-100 rounded animate-pulse mx-auto" />
                  <div className="h-4 w-full bg-secondary-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-secondary-100 rounded animate-pulse mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            <div className="w-20 h-20 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-accent-400" />
            </div>
            <h3 className="text-h4 font-semibold mb-3">Resources Coming Soon</h3>
            <p className="text-secondary-500 mb-8">Free materials are being prepared.</p>
            <Link to="/contact"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Request a Resource</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all flex flex-col">
                {r.thumbnail ? (
                  <img src={r.thumbnail} alt={r.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="h-40 bg-primary-50 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary-300" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1 text-center">
                  <span className="text-caption text-primary-600 font-medium">{r.type || 'Resource'}</span>
                  <h3 className="font-semibold mt-1 mb-2">{r.title}</h3>
                  <p className="text-body-sm text-secondary-500 mb-4 flex-1">{r.description?.slice(0, 80)}...</p>
                  <div className="flex items-center justify-center gap-2 text-body-sm text-secondary-400 mb-3">
                    <Download className="w-3.5 h-3.5" /> {r.downloadCount || 0} downloads
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(r)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {r.fileUrl && (
                      <a
                        href={`https://niroflixx.onrender.com/api/v1/resources/${r.id}/file`}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resource View Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
              <h3 className="font-semibold text-secondary-900">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-secondary-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-secondary-50" style={{ height: 'calc(90vh - 80px)' }}>
              {selected.fileUrl ? (
                <iframe src={selected.fileUrl} title={selected.title} className="w-full h-full rounded-xl border bg-white" />
              ) : (
                <div className="flex items-center justify-center h-full text-secondary-400">
                  <p>No preview available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}