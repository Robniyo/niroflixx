import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Download, Eye, LinkIcon } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

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

  const handleDownload = () => {
    if (!resource) return;
    const downloadUrl = `https://niroflixx.onrender.com/api/v1/resources/${resource.id}/file`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setResource({ ...resource, downloadCount: (resource.downloadCount || 0) + 1 });
  };

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
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                <Download className="w-5 h-5" /> Download Resource
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied!');
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-secondary-100 text-secondary-700 rounded-xl font-medium hover:bg-secondary-200 transition-colors text-sm"
              >
                <LinkIcon className="w-4 h-4" /> Copy Link
              </button>
            </div>
          ) : (
            <p className="text-secondary-500">No file attached yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}