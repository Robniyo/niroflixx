import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, GraduationCap, Briefcase, Newspaper, FileText } from 'lucide-react';
import api from '@/services/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any>({ courses: [], opportunities: [], news: [], resources: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    Promise.all([
      api.get('/courses', { params: { search: query } }).then(r => r.data.data || []).catch(() => []),
      api.get('/opportunities', { params: { search: query } }).then(r => r.data.data || []).catch(() => []),
      api.get('/news', { params: { search: query } }).then(r => r.data.data || []).catch(() => []),
      api.get('/resources', { params: { search: query } }).then(r => r.data.data || []).catch(() => []),
    ]).then(([courses, opportunities, news, resources]) => {
      setResults({ courses, opportunities, news, resources });
      setLoading(false);
    });
  }, [query]);

  const hasResults = results.courses.length > 0 || results.opportunities.length > 0 || results.news.length > 0 || results.resources.length > 0;

  return (
    <div className="pt-32 pb-16 min-h-screen bg-secondary-50">
      <div className="container-page">
        <h1 className="text-h3 font-bold text-secondary-900 mb-2">Search Results</h1>
        <p className="text-secondary-500 mb-8">Showing results for "{query}"</p>

        {loading ? (
          <div className="text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" /></div>
        ) : !hasResults ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <Search className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.courses.length > 0 && (
              <div>
                <h2 className="text-h4 font-semibold mb-3 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary-600" /> Courses</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.courses.map((c: any) => (
                    <Link key={c.id} to={`/academy/${c.slug || c.id}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition-all">
                      <p className="font-medium">{c.title}</p>
                      <p className="text-body-sm text-secondary-500">{c.level} • {c.type?.replace('_', ' ')}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.opportunities.length > 0 && (
              <div>
                <h2 className="text-h4 font-semibold mb-3 flex items-center gap-2"><Briefcase className="w-5 h-5 text-accent-600" /> Opportunities</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.opportunities.map((o: any) => (
                    <Link key={o.id} to={`/opportunities/${o.id}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition-all">
                      <p className="font-medium">{o.title}</p>
                      <p className="text-body-sm text-secondary-500">{o.organization} • {o.type}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.news.length > 0 && (
              <div>
                <h2 className="text-h4 font-semibold mb-3 flex items-center gap-2"><Newspaper className="w-5 h-5 text-info" /> News</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.news.map((n: any) => (
                    <Link key={n.id} to={`/news/${n.slug || n.id}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition-all">
                      <p className="font-medium">{n.title}</p>
                      <p className="text-body-sm text-secondary-500">{n.author || 'Niroflixx'}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.resources.length > 0 && (
              <div>
                <h2 className="text-h4 font-semibold mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-accent-600" /> Resources</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.resources.map((r: any) => (
                    <Link key={r.id} to={`/resources/${r.slug || r.id}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition-all">
                      <p className="font-medium">{r.title}</p>
                      <p className="text-body-sm text-secondary-500">{r.type || 'Resource'}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}