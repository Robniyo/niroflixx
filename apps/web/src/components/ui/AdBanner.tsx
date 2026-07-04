import { useState, useEffect } from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';
import api from '@/services/api';

interface AdBannerProps {
  position: string;
}

export default function AdBanner({ position }: AdBannerProps) {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    api.get('/advertisements').then(r => {
      const ads = r.data.data || [];
      const active = ads.find((a: any) => a.position === position && a.status === 'PUBLISHED');
      setAd(active || null);
    }).catch(() => {});
  }, [position]);

  if (!ad) return null;

  const isVideo = ad.videoUrl && (ad.videoUrl.includes('youtube') || ad.videoUrl.includes('vimeo') || ad.videoUrl.includes('youtu.be'));
  const hasImage = ad.imageUrl;
  const isTextOnly = !ad.imageUrl && !ad.videoUrl;

  return (
    <div className="my-6 flex justify-center">
      {isVideo ? (
        <div className="relative w-full max-w-xl rounded-xl overflow-hidden bg-secondary-900 aspect-video">
          <iframe
            src={ad.videoUrl?.replace('watch?v=', 'embed/')}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={ad.title}
          />
        </div>
      ) : hasImage ? (
        <a
          href={ad.link || '#'}
          target={ad.link ? '_blank' : undefined}
          rel={ad.link ? 'noopener noreferrer' : undefined}
          className="block rounded-xl overflow-hidden bg-secondary-50 shadow-sm hover:shadow-md transition-all max-w-sm w-full"
        >
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-auto max-h-48 object-contain"
            loading="lazy"
          />
          {ad.title && (
            <div className="px-4 py-3 bg-white border-t">
              <p className="text-sm font-semibold text-secondary-900 line-clamp-1">{ad.title}</p>
              {ad.description && <p className="text-xs text-secondary-500 mt-0.5 line-clamp-2">{ad.description}</p>}
            </div>
          )}
        </a>
      ) : isTextOnly ? (
        <div className="w-full max-w-md bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl px-5 py-4 text-center shadow-sm">
          <p className="text-white font-semibold text-sm">{ad.title}</p>
          {ad.description && <p className="text-white/70 text-xs mt-1">{ad.description}</p>}
          {ad.link && (
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-white text-xs underline hover:no-underline">
              Learn More →
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}