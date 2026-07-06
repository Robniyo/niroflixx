import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wrench, Clock } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get(`/services/${slug}`).then(r => setService(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 pb-16 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>;
  if (!service) return <div className="pt-32 pb-16 text-center"><h1 className="text-h2">Service Not Found</h1><Link to="/services" className="text-primary-600 mt-4 inline-block">Back to Services</Link></div>;

  return (
    <div className="pt-32 pb-16">
      <div className="container-content">
        <Link to="/services" className="flex items-center gap-2 text-sm text-secondary-500 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
        <div className="bg-white rounded-2xl border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center"><Wrench className="w-8 h-8 text-primary-600" /></div>
            <div>
              <span className="text-primary-600 font-semibold text-sm">Professional Service</span>
              <h1 className="text-h2 font-bold">{service.title}</h1>
            </div>
          </div>
          <p className="text-body-lg text-secondary-600 mb-6">{service.description}</p>
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="text-center">
              <p className="text-h3 font-bold text-primary-600">{service.startingPrice === 0 ? 'Free' : `${service.startingPrice.toLocaleString()} RWF`}</p>
              <p className="text-sm text-secondary-500">Starting Price</p>
            </div>
            {service.estimatedTime && (
              <div className="text-center">
                <p className="text-h3 font-bold text-secondary-900 flex items-center gap-1"><Clock className="w-5 h-5" /> {service.estimatedTime}</p>
                <p className="text-sm text-secondary-500">Estimated Time</p>
              </div>
            )}
          </div>
          <Link to="/contact"><Button size="lg">Request This Service</Button></Link>
        </div>
      </div>
    </div>
  );
}