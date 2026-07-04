import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Download } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function FreeResources() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources', { params: { limit: 4 } }).then(r => setResources(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="section-padding bg-secondary-50"><div className="container-page text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div></section>;

  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-accent-600 font-semibold text-label uppercase tracking-wider">Free Downloads</span>
          <h2 className="section-title mt-2">Free Learning Resources</h2>
          <p className="section-subtitle">Guides, templates, cheat sheets, and study materials at no cost.</p>
        </div>
        {resources.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-accent-50 rounded-2xl shadow-sm border border-accent-100 flex items-center justify-center mx-auto mb-6"><BookOpen className="w-10 h-10 text-accent-400" /></div>
            <h4 className="text-h4 font-semibold text-secondary-800 mb-3">Resources Coming Soon</h4>
            <p className="text-secondary-500 mb-8">Free PDFs and study materials being prepared.</p>
            <Link to="/resources"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Browse Resources</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {resources.map((r) => (
              <Link to={`/resources/${r.slug || r.id}`} key={r.id} className="group">
                <div className="bg-white rounded-xl border border-secondary-100 p-6 text-center hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4"><BookOpen className="w-5 h-5 text-primary-600" /></div>
                  <h4 className="font-semibold text-secondary-900 mb-2">{r.title}</h4>
                  <div className="flex items-center justify-center gap-1 text-body-sm text-secondary-400"><Download className="w-3.5 h-3.5" /> {r.downloadCount || 0}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}