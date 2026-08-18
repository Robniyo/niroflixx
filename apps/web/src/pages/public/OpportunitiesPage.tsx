import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Calendar, MapPin, Search, Filter } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

const TYPES = [
  'SCHOLARSHIP', 'ADMISSION', 'INTERNSHIP', 'JOB', 'COMPETITION',
  'HACKATHON', 'GRANT', 'EXCHANGE_PROGRAM', 'VOLUNTEER', 'RESEARCH',
  'BOOTCAMP', 'FELLOWSHIP', 'EVENT',
];

export default function OpportunitiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Filter states
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [educationLevelFilter, setEducationLevelFilter] = useState('');
  const [computedStatusFilter, setComputedStatusFilter] = useState(''); // OPEN, CLOSING_SOON, CLOSED or ''
  const [search, setSearch] = useState('');

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params: any = { status: 'PUBLISHED', page: pagination.page, limit: 12 };
      if (typeFilter) params.type = typeFilter;
      if (countryFilter) params.country = countryFilter;
      if (educationLevelFilter) params.educationLevel = educationLevelFilter;
      if (computedStatusFilter) params.computedStatus = computedStatusFilter;
      if (search) params.search = search;

      const r = await api.get('/opportunities', { params });
      setItems(r.data.data);
      setPagination(r.data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [typeFilter, countryFilter, educationLevelFilter, computedStatusFilter, search, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && items.length === 0) {
  return (
    <div className="pt-32 pb-16">
      <div className="container-page">
        {/* Title skeleton */}
        <div className="text-center mb-12">
          <div className="h-5 w-24 bg-secondary-200 rounded animate-pulse mx-auto mb-3" />
          <div className="h-10 w-64 bg-secondary-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-96 max-w-full bg-secondary-200 rounded animate-pulse mx-auto" />
        </div>

        {/* Filters skeleton */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-11 bg-secondary-100 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-20 bg-secondary-100 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border p-6 flex gap-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-secondary-100 rounded-full animate-pulse" />
                  <div className="h-5 w-16 bg-secondary-100 rounded-full animate-pulse" />
                </div>
                <div className="h-5 w-3/4 bg-secondary-100 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-secondary-100 rounded animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-4 w-20 bg-secondary-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-secondary-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="pt-32 pb-16">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="text-accent-600 font-semibold text-label uppercase tracking-wider">
            Opportunities
          </span>
          <h1 className="text-h1 mt-3 mb-4">Find Your Next Opportunity</h1>
          <p className="text-body-lg text-secondary-600 max-w-2xl mx-auto">
            Scholarships, jobs, internships, and admissions curated for you.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border rounded-lg text-sm"
              />
            </div>

            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary-50 border rounded-lg text-sm"
            >
              <option value="">All Types</option>
              {TYPES.map(t => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Country */}
            <input
              type="text"
              placeholder="Country"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm"
            />

            {/* Education Level */}
            <input
              type="text"
              placeholder="Education Level"
              value={educationLevelFilter}
              onChange={(e) => setEducationLevelFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary-50 border rounded-lg text-sm"
            />
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {[
              { label: 'All', value: '' },
              { label: 'Open', value: 'OPEN' },
              { label: 'Closing Soon', value: 'CLOSING_SOON' },
              { label: 'Closed', value: 'CLOSED' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => {
                  setComputedStatusFilter(tab.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  computedStatusFilter === tab.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {items.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-accent-400" />
            </div>
            <h3 className="text-h4 font-semibold mb-3">No Opportunities Found</h3>
            <p className="text-secondary-500 mb-8">Try adjusting your filters or check back later.</p>
            <Link to="/register">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Notified
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((opp) => {
                const computedStatus = opp.computedStatus;
                const badge =
                  computedStatus === 'CLOSED'
                    ? { text: 'Closed', color: 'bg-red-100 text-red-700' }
                    : computedStatus === 'CLOSING_SOON'
                    ? { text: 'Closing Soon', color: 'bg-yellow-100 text-yellow-700' }
                    : null;

                return (
                  <Link
                  to={`/opportunities/${opp.id}`}
                  key={opp.id}
                  className={`group ${computedStatus === 'CLOSED' ? 'pointer-events-none' : ''}`}
                >
                  <div
                    className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all ${
                      computedStatus === 'CLOSED' ? 'opacity-60' : ''
                    }`}
                  >
                    {opp.coverImage ? (
                      <img
                        src={opp.coverImage}
                        alt={opp.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-40 bg-accent-50 flex items-center justify-center">
                        <Briefcase className="w-10 h-10 text-accent-400" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-caption text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                          {opp.type?.replace('_', ' ')}
                        </span>
                        {badge && (
                          <span className={`text-caption px-2 py-0.5 rounded-full ${badge.color}`}>
                            {badge.text}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold group-hover:text-primary-600 transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-body-sm text-secondary-500">{opp.organization}</p>
                      <div className="flex gap-3 mt-3 text-body-sm text-secondary-400">
                        {opp.country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {opp.country}
                          </span>
                        )}
                        {opp.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />{' '}
                            {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      p === pagination.page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border text-secondary-600 hover:bg-primary-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}