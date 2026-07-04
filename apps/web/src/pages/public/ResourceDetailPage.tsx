import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Download, Eye } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function ResourceDetailPage() {
  const { slug } = useParams();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get(`/resources`).then(r => {
      const found = r.data.data?.find((item: any) => item.slug === slug || item.id === slug);
      setResource(found || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (!resource) return <div className="pt-32 pb-16 text-center"><h1 className="text-h2">Resource Not Found</h1><Link to="/resources" className="text-primary-600 mt-4 inline-block">Back to Resources</Link></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content">
        <Link to="/resources" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-100 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <span className="text-primary-600 font-semibold text-sm">{resource.type || 'Resource'}</span>
              <h1 className="text-h2 font-bold mt-1">{resource.title}</h1>
            </div>
          </div>

          <p className="text-body-lg text-secondary-600 mb-8">{resource.description}</p>

          <div className="flex items-center gap-6 text-body-sm text-secondary-500 mb-8 pb-8 border-b">
            <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {resource.downloadCount || 0} Downloads</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {resource.views || 0} Views</span>
          </div>

          {resource.fileUrl ? (
            <a href={`http://localhost:5000${resource.fileUrl}`} target="_blank" download>
              <Button size="lg" rightIcon={<Download className="w-4 h-4" />}>Download Resource</Button>
            </a>
          ) : (
            <p className="text-secondary-500">No file attached yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}