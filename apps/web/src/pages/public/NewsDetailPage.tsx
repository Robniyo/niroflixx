import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, Calendar, User, Image as ImageIcon } from 'lucide-react';
import api from '@/services/api';
import DOMPurify from 'dompurify';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageZoomed, setImageZoomed] = useState<string | null>(null);

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
        <Link to="/news" className="text-primary-600 mt-4 inline-block">Back to News</Link>
      </div>
    );

  // Gutandukanya amafoto ya gallery niba ari string itandukanyijwe na comma
  const galleryImages = article.galleryImages 
    ? article.galleryImages.split(',').filter((url: string) => url.trim() !== '') 
    : [];

  return (
    <div className="pt-32 pb-16 bg-secondary-50/30 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          to="/news"
          className="flex items-center gap-2 text-sm font-medium text-secondary-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-100 p-6 md:p-8 shadow-sm">
          
          {/* Category na Title */}
          <span className="text-info font-semibold text-sm uppercase tracking-wider">
            {article.category?.name || 'General'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-4 leading-tight text-secondary-900">
            {article.title}
          </h1>

          {/* Author na Date */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 mb-6 pb-6 border-b border-secondary-100">
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {article.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Iyi ni layout nshya: Ifoto ibumoso, Amagambo iburyo (Nka Opportunity) */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {article.coverImage && (
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  onClick={() => setImageZoomed(article.coverImage)}
                  className="w-full h-auto object-cover rounded-xl shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
                />
              </div>
            )}
            
            <div className="flex-1">
              {/* Summary niba ihari */}
              {article.summary && (
                <p className="text-lg font-medium text-secondary-700 mb-4 border-l-4 border-primary-500 pl-4 italic">
                  {article.summary}
                </p>
              )}
              {/* Content y'ingenzi */}
              <div
                className="text-secondary-600 leading-relaxed break-words prose max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }}
              />
            </div>
          </div>

          {/* GALLERY IMAGES (Izindi foto) */}
          {galleryImages.length > 0 && (
            <div className="mt-10 pt-8 border-t border-secondary-100">
              <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary-600" /> More Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img: string, index: number) => (
                  <div key={index} className="relative group cursor-zoom-in">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      onClick={() => setImageZoomed(img)}
                      className="w-full h-40 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Lightbox (Iyo ukanda ku ifoto) */}
      {imageZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setImageZoomed(null)}
        >
          <img
            src={imageZoomed}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain cursor-zoom-out rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}