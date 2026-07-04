import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, Calendar, User } from 'lucide-react';
import api from '@/services/api';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get(`/news/${slug}`).then(r => setArticle(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (!article) return <div className="pt-32 pb-16 text-center"><h1 className="text-h2">Article Not Found</h1><Link to="/news" className="text-primary-600 mt-4 inline-block">Back to News</Link></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content">
        <Link to="/news" className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
          <div className="h-56 bg-gradient-to-br from-info to-blue-700 flex items-center justify-center">
            {article.coverImage ? <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" /> : <Newspaper className="w-16 h-16 text-white/40" />}
          </div>
          <div className="p-8">
            <span className="text-info font-semibold text-sm">{article.category?.name || 'General'}</span>
            <h1 className="text-h2 font-bold mt-2 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-body-sm text-secondary-500 mb-8 pb-8 border-b">
              {article.author && <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="prose max-w-none text-secondary-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}