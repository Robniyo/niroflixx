import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Calendar, MapPin, Globe } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import ApplyModal from '@/components/ui/ApplyModal';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const [opp, setOpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);

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

  const computedStatus = opp.computedStatus; // from API
  const isClosed = computedStatus === 'CLOSED';
  const badge = isClosed
    ? { text: 'Closed', color: 'bg-red-100 text-red-700' }
    : computedStatus === 'CLOSING_SOON'
    ? { text: 'Closing Soon', color: 'bg-yellow-100 text-yellow-700' }
    : null;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content">
        <Link
          to="/opportunities"
          className="flex items-center gap-2 text-body-sm text-secondary-500 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunities
        </Link>

      <div
  className={`bg-white rounded-2xl border border-secondary-100 p-8 ${
    isClosed ? 'opacity-80' : ''
  }`}
>
  {opp.coverImage && (
    <img src={opp.coverImage} alt={opp.title} className="w-full aspect-video object-cover rounded-xl mb-6" />
  )}
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
          <h1 className="text-h2 font-bold mt-2 mb-2">{opp.title}</h1>
          <p className="text-body-lg text-secondary-600 mb-6">{opp.organization}</p>

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

          <div className="prose max-w-none space-y-6">
            <div>
              <h3 className="text-h4 font-semibold mb-2">Description</h3>
              <p className="text-secondary-600">{opp.description}</p>
            </div>
            {opp.requirements && (
              <div>
                <h3 className="text-h4 font-semibold mb-2">Requirements</h3>
                <p className="text-secondary-600">{opp.requirements}</p>
              </div>
            )}
            {opp.benefits && (
              <div>
                <h3 className="text-h4 font-semibold mb-2">Benefits</h3>
                <p className="text-secondary-600">{opp.benefits}</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t flex flex-wrap gap-3">
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

      <ApplyModal
        isOpen={showApply}
        onClose={() => setShowApply(false)}
        opportunityTitle={opp.title}
        opportunityId={opp.id}
      />
    </div>
  );
}