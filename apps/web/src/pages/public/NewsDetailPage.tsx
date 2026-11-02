import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, Calendar, User } from 'lucide-react';
import api from '@/services/api';
import DOMPurify from 'dompurify';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageZoomed, setImageZoomed] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/news/${slug}`)
      .then(r => setArticle(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    document.title = article.seoTitle || article.title || 'Future Scholars News';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', article.seoDescription || article.summary || '');
    }
    if (article.seoKeywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', article.seoKeywords);
    }
  }, [article]);

  if (loading)
    return (
      <div className="pt-32 pb-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  if (!article)
    return (
      <div className="pt-32 pb-16 text-center">
        <h1 className="text-h2">Article Not Found</h1>
        <Link to="/news" className="text-primary-600 mt-4 inline-block">
          Back to News
        </Link>
      </div>
    );

  return (
    <div className="pt-32 pb-16 bg-secondary-50/30 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          to="/news"
          className="flex items-center gap-2 text-sm font-medium text-secondary-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden shadow-sm">
          
          {/* Ifoto nto iri hejuru gato */}
          {article.coverImage && (
            <div className="p-6 pb-0">
              <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-xl bg-secondary-50 cursor-zoom-in">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  onClick={() => setImageZoomed(true)}
                  className="w-full h-auto max-h-[300px] object-contain hover:opacity-90 transition-opacity"
                />
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            <span className="text-info font-semibold text-sm">
              {article.category?.name || 'General'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-4 leading-tight break-words text-secondary-900">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 mb-8 pb-6 border-b border-secondary-100">
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {article.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />{' '}
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div
              className="text-secondary-700 leading-relaxed break-words prose max-w-none prose-img:rounded-xl prose-img:mx-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }}
            />
          </div>
        </div>
      </div>

      {/* Lightbox (Iyo ukanda ku ifoto) */}
      {imageZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setImageZoomed(false)}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="max-w-full max-h-full object-contain cursor-zoom-out rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}