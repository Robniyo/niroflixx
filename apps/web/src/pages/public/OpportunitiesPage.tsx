import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, Briefcase, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';

const TYPES = [
  'SCHOLARSHIP', 'ADMISSION', 'INTERNSHIP', 'JOB', 'COMPETITION',
  'HACKATHON', 'GRANT', 'EXCHANGE_PROGRAM', 'VOLUNTEER', 'RESEARCH',
  'BOOTCAMP', 'FELLOWSHIP', 'EVENT',
];

export default function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('dest') || searchParams.get('country') || '');
  const [educationLevelFilter, setEducationLevelFilter] = useState(searchParams.get('level') || '');
  const [computedStatusFilter, setComputedStatusFilter] = useState(''); 
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params: any = { status: 'PUBLISHED', limit: 100 };
      if (typeFilter) params.type = typeFilter;
      if (countryFilter) params.country = countryFilter;
      if (computedStatusFilter) params.computedStatus = computedStatusFilter;
      if (search) params.search = search;

      const r = await api.get('/opportunities', { params });
      setAllItems(r.data.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [typeFilter, countryFilter, computedStatusFilter, search]);

  const filteredItems = allItems.filter(item => {
    if (!educationLevelFilter) return true;
    const itemLevel = item.educationLevel || '';
    return itemLevel.toLowerCase().includes(educationLevelFilter.toLowerCase()) || 
           (educationLevelFilter === "Undergraduate" && itemLevel.toLowerCase().includes("bachelor"));
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (pagination.page - 1) * itemsPerPage,
    pagination.page * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSearch('');
    setTypeFilter('');
    setCountryFilter('');
    setEducationLevelFilter('');
    setComputedStatusFilter('');
    setPagination({ page: 1, totalPages: 1 });
  };

  return (
    <div className="bg-secondary-50/30 min-h-screen pb-20 font-sans">
      
      <div className="bg-white border-b border-secondary-100 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-accent-600 font-semibold text-label uppercase tracking-wider block mb-2">
            Explore Opportunities
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4 tracking-tight">
            Find Your Next Opportunity
          </h1>
          <p className="text-secondary-500 max-w-2xl mx-auto text-lg">
            Scholarships, jobs, internships, and admissions curated for you from around the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="bg-white rounded-2xl border border-secondary-100 p-4 sm:p-6 mb-8 shadow-sm">
          
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by title, organization, or keyword..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination({ page: 1, totalPages: 1 }); }}
              className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPagination({ page: 1, totalPages: 1 }); }}
              className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 focus:outline-none focus:border-primary-400"
            >
              <option value="">All Types</option>
              {TYPES.map(t => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Destination / Country"
              value={countryFilter}
              onChange={(e) => { setCountryFilter(e.target.value); setPagination({ page: 1, totalPages: 1 }); }}
              className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 focus:outline-none focus:border-primary-400"
            />

            <select
              value={educationLevelFilter}
              onChange={(e) => {
                setEducationLevelFilter(e.target.value);
                setComputedStatusFilter(''); 
                setPagination({ page: 1, totalPages: 1 });
              }}
              className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 focus:outline-none focus:border-primary-400"
            >
              <option value="">All Study Levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Master">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-secondary-100">
            <span className="text-sm font-semibold text-secondary-500 mr-2">Status:</span>
            {[
              { label: 'All', value: '' },
              { label: 'Open Now', value: 'OPEN' },
              { label: 'Closing Soon', value: 'CLOSING_SOON' },
              { label: 'Archived (Closed)', value: 'CLOSED' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => {
                  setComputedStatusFilter(tab.value);
                  setPagination({ page: 1, totalPages: 1 });
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  computedStatusFilter === tab.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            {(search || typeFilter || countryFilter || educationLevelFilter || computedStatusFilter) && (
              <button onClick={handleReset} className="ml-auto text-sm text-danger hover:underline">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-secondary-100">
            <Briefcase className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No Opportunities Found</h3>
            <p className="text-secondary-500 mb-6">Try adjusting your filters or check back later.</p>
            <button onClick={handleReset} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((opp) => {
                const isClosed = opp.computedStatus === 'CLOSED';
                const isClosingSoon = opp.computedStatus === 'CLOSING_SOON';

                return (
                  <Link
                    to={`/opportunities/${opp.id}`}
                    key={opp.id}
                    className={`group bg-white rounded-2xl border border-secondary-100 overflow-hidden transition-all flex flex-col ${
                      isClosed ? 'opacity-70 grayscale-[30%]' : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="relative h-48 w-full bg-secondary-50 overflow-hidden flex-shrink-0">
                      {opp.coverImage ? (
                        <img src={opp.coverImage} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Briefcase className="w-10 h-10 text-secondary-300" /></div>
                      )}
                      
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                        <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm uppercase tracking-wide truncate max-w-[120px]">
                          {opp.type?.replace('_', ' ')}
                        </span>
                        
                        {isClosingSoon && !isClosed && (
                          <span className="bg-warning/90 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                            Closing Soon
                          </span>
                        )}
                        {isClosed && (
                          <span className="bg-danger/90 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-secondary-900 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                        {opp.title}
                      </h3>
                      <p className="text-sm font-medium text-secondary-500 mb-4 line-clamp-1">{opp.organization}</p>
                      
                      <div className="mt-auto pt-4 border-t border-secondary-100 flex items-center justify-between text-xs font-semibold text-secondary-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-secondary-400" /> 
                          <span className="truncate max-w-[100px]">{opp.country || 'Global'}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${isClosed ? 'text-danger' : isClosingSoon ? 'text-warning-dark' : 'text-secondary-600'}`}>
                          <Calendar className="w-4 h-4" /> 
                          <span>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Open'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                      p === pagination.page
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white border border-secondary-200 text-secondary-600 hover:bg-primary-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* MONETAG IN-PAGE PUSH AD */}
            <div className="mt-12 flex justify-center w-full">
               <script 
                 dangerouslySetInnerHTML={{ 
                   __html: `(function(s){s.dataset.zone='12178377',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` 
                 }} 
               />
            </div>
          </>
        )}
      </div>
    </div>
  );
}