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
    <div className="pt-32 pb-16">
      <div className="container-content max-w-4xl">
        <Link
          to="/news"
          className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-100 p-6 md:p-8">
          {/* Image at top, full width but constrained */}
          {article.coverImage && (
            <>
              <button
                onClick={() => setImageZoomed(true)}
                className="block w-full mb-6 cursor-zoom-in"
              >
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full max-h-96 object-contain rounded-lg shadow-sm hover:opacity-90 transition-opacity bg-secondary-50"
                />
              </button>
              {imageZoomed && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                  onClick={() => setImageZoomed(false)}
                >
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="max-w-full max-h-full object-contain cursor-zoom-out"
                  />
                </div>
              )}
            </>
          )}

          <span className="text-info font-semibold text-sm">
            {article.category?.name || 'General'}
          </span>
          <h1 className="text-h2 font-bold mt-2 mb-4 break-words">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-body-sm text-secondary-500 mb-8 pb-8 border-b">
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {article.author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />{' '}
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div
            className="text-secondary-700 leading-relaxed break-words whitespace-pre-line prose max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }}
          />
        </div>
      </div>
    </div>
  );
}