import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, ArrowLeft, Calendar, User, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '@/services/api';
import DOMPurify from 'dompurify';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageZoomed, setImageZoomed] = useState<string | null>(null);
  
  // State zo gukoresha muri Gallery (Slider)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      <style>{`
        .news-page-wrap {
          width: 100%;
          max-width: 896px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .news-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          padding: 24px;
          box-sizing: border-box;
        }
        .news-desc-wrap { overflow: hidden; }
        
        /* Iyi ni float image nka kuri Opportunity */
        .news-float-img {
          float: left;
          margin: 0 20px 12px 0;
          width: 220px;
          max-width: 45%;
          display: block;
          padding: 0;
          border: none;
          background: none;
          cursor: zoom-in;
        }
        .news-float-img img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
        }
        @media (max-width: 640px) {
          .news-float-img {
            float: none;
            width: 100%;
            max-width: 100%;
            margin: 0 0 16px 0;
          }
        }
        .news-content {
          min-width: 0;
          word-wrap: break-word;
          overflow-wrap: anywhere;
        }
        .news-content p, .news-content ul, .news-content ol, .news-content h1, .news-content h2, .news-content h3, .news-content h4, .news-content blockquote, .news-content pre {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .news-content a { word-break: break-all; color: #2563EB; text-decoration: underline; }
        .news-content img { max-width: 100%; height: auto; }
      `}</style>

      <div className="news-page-wrap">
        <Link to="/news" className="flex items-center gap-2 text-sm font-medium text-secondary-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="news-card">
          <div className="mb-4">
            <span className="text-info font-semibold text-sm uppercase tracking-wider">
              {article.category?.name || 'General'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2 leading-tight text-secondary-900 break-words">
              {article.title}
            </h1>
          </div>

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

          {/* Description: Ifoto iri kuri float, amagambo arayikikije */}
          <div className="mb-8">
            <div className="news-desc-wrap text-secondary-600">
              {article.coverImage && (
                <button onClick={() => setImageZoomed(article.coverImage)} className="news-float-img" aria-label="Zoom image">
                  <img src={article.coverImage} alt={article.title} />
                </button>
              )}
              {article.summary && (
                <p className="text-lg font-medium text-secondary-700 mb-4 border-l-4 border-primary-500 pl-4 italic">
                  {article.summary}
                </p>
              )}
              <div className="news-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }} />
            </div>
          </div>

          {/* GALLERY (CAROUSEL) - Amafoto menshi muri card imwe */}
          {galleryImages.length > 0 && (
            <div className="mt-8 pt-8 border-t border-secondary-100" style={{ clear: 'both' }}>
              <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary-600" /> More Images ({galleryImages.length})
              </h3>
              
              <div className="relative bg-secondary-900 rounded-2xl overflow-hidden group">
                {/* Ifoto nini iri kuri slider */}
                <div className="relative h-64 sm:h-96 w-full flex items-center justify-center">
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={`Gallery ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain cursor-zoom-in"
                    onClick={() => setImageZoomed(galleryImages[currentImageIndex])}
                  />
                </div>

                {/* Controls (Previous/Next) */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Counter (1 / 3) */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      {currentImageIndex + 1} / {galleryImages.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox (Zoom) */}
      {imageZoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setImageZoomed(null)}>
          <img src={imageZoomed} alt="Zoomed" className="max-w-full max-h-full object-contain cursor-zoom-out rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}