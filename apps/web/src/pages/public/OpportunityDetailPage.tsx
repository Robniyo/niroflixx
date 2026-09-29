import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Calendar, MapPin, Globe } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import ApplyModal from '@/components/ui/ApplyModal';
import DOMPurify from 'dompurify';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const [opp, setOpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/opportunities/${id}`)
      .then(r => setOpp(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="pt-32 pb-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  if (!opp)
    return (
      <div className="pt-32 pb-16 text-center">
        <h1 className="text-h2">Opportunity Not Found</h1>
        <Link to="/opportunities" className="text-primary-600 mt-4 inline-block">
          Back to Opportunities
        </Link>
      </div>
    );

  const computedStatus = opp.computedStatus;
  const isClosed = computedStatus === 'CLOSED';
  const badge = isClosed
    ? { text: 'Closed', color: 'bg-red-100 text-red-700' }
    : computedStatus === 'CLOSING_SOON'
    ? { text: 'Closing Soon', color: 'bg-yellow-100 text-yellow-700' }
    : null;

  return (
    <div className="pt-32 pb-16">
      <style>{`
        .opp-page-wrap {
          width: 100%;
          max-width: 896px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .opp-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          padding: 24px;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .opp-content {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          word-wrap: break-word;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
        }
        .opp-content * {
          max-width: 100% !important;
          min-width: 0 !important;
          width: auto !important;
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
          box-sizing: border-box !important;
        }
        .opp-content p { margin-bottom: 0.85rem; }
        .opp-content ul { list-style: disc !important; padding-left: 1.5rem !important; margin-bottom: 0.85rem; }
        .opp-content ol { list-style: decimal !important; padding-left: 1.5rem !important; margin-bottom: 0.85rem; }
        .opp-content li { margin-bottom: 0.25rem; }
        .opp-content h1, .opp-content h2, .opp-content h3, .opp-content h4 {
          font-weight: 600; margin: 1rem 0 0.5rem 0;
        }
        .opp-content a { color: #2563EB; text-decoration: underline; }
        .opp-content strong { font-weight: 600; }
        .opp-content img { max-width: 100% !important; height: auto !important; }
        .opp-content table { width: 100% !important; table-layout: fixed !important; }
        .opp-content pre { white-space: pre-wrap !important; word-break: break-word !important; }

        .opp-float-img {
          float: left;
          margin: 0 24px 16px 0;
          width: 260px;
          max-width: 45%;
        }
        @media (max-width: 640px) {
          .opp-float-img { float: none; width: 100%; max-width: 100%; margin: 0 0 16px 0; }
        }
      `}</style>

      <div className="opp-page-wrap">
        <Link
          to="/opportunities"
          className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunities
        </Link>

        <div className={`opp-card ${isClosed ? 'opacity-80' : ''}`}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1 rounded-full">
              {opp.type?.replace('_', ' ')}
            </span>
            {badge && (
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${badge.color}`}>
                {badge.text}
              </span>
            )}
          </div>

          <h1 className="text-h2 font-bold mt-2 mb-2" style={{ wordBreak: 'break-word' }}>
            {opp.title}
          </h1>
          <p className="text-body-lg text-secondary-600 mb-6" style={{ wordBreak: 'break-word' }}>
            {opp.organization}
          </p>

          <div className="flex flex-wrap gap-4 text-body-sm text-secondary-500 mb-8">
            {opp.country && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {opp.country}
                {opp.city ? `, ${opp.city}` : ''}
              </span>
            )}
            {opp.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Deadline:{' '}
                {new Date(opp.deadline).toLocaleDateString()}
              </span>
            )}
            {opp.educationLevel && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" /> {opp.educationLevel}
              </span>
            )}
          </div>

          {/* Description with float-left image, text flows beside and under */}
          <div className="mb-8">
            <h3 className="text-h4 font-semibold mb-3">Description</h3>
            <div className="opp-content text-secondary-600">
              {opp.coverImage && (
                <button
                  onClick={() => setImageZoomed(true)}
                  className="opp-float-img cursor-zoom-in"
                  style={{ padding: 0, border: 'none', background: 'none', display: 'block' }}
                >
                  <img
                    src={opp.coverImage}
                    alt={opp.title}
                    style={{ width: '100%', borderRadius: '8px', display: 'block' }}
                  />
                </button>
              )}
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(opp.description || '') }}
              />
            </div>
          </div>

          {opp.requirements && (
            <div className="mb-8">
              <h3 className="text-h4 font-semibold mb-3">Requirements</h3>
              <div
                className="opp-content text-secondary-600"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(opp.requirements) }}
              />
            </div>
          )}

          {opp.benefits && (
            <div className="mb-8">
              <h3 className="text-h4 font-semibold mb-3">Benefits</h3>
              <div
                className="opp-content text-secondary-600"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(opp.benefits) }}
              />
            </div>
          )}

          <div className="mt-8 pt-8 border-t flex flex-wrap gap-3" style={{ clear: 'both' }}>
            {opp.officialLink && (
              <a href={opp.officialLink} target="_blank" rel="noopener noreferrer">
                <Button rightIcon={<Globe className="w-4 h-4" />}>Official Website</Button>
              </a>
            )}
            {!isClosed && (
              <Button variant="outline" onClick={() => setShowApply(true)}>
                Apply Now
              </Button>
            )}
            {isClosed && (
              <span className="text-sm text-red-600 font-medium py-2">This opportunity is closed</span>
            )}
          </div>
        </div>
      </div>

      {imageZoomed && opp.coverImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setImageZoomed(false)}
        >
          <img
            src={opp.coverImage}
            alt={opp.title}
            className="max-w-full max-h-full object-contain cursor-zoom-out"
          />
        </div>
      )}

      <ApplyModal
        isOpen={showApply}
        onClose={() => setShowApply(false)}
        opportunityTitle={opp.title}
        opportunityId={opp.id}
      />
    </div>
  );
}