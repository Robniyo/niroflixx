import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function Statistics() {
  const [stats, setStats] = useState({ courses: 0, opportunities: 0, resources: 0, services: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/courses').then(r => r.data.pagination?.total || r.data.data?.length || 0).catch(() => 0),
      api.get('/opportunities').then(r => r.data.pagination?.total || r.data.data?.length || 0).catch(() => 0),
      api.get('/resources').then(r => r.data.pagination?.total || r.data.data?.length || 0).catch(() => 0),
      api.get('/services').then(r => r.data.data?.length || 0).catch(() => 0),
    ]).then(([courses, opportunities, resources, services]) => {
      setStats({ courses, opportunities, resources, services });
    });
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: stats.courses, label: 'Courses' },
            { value: stats.opportunities, label: 'Opportunities' },
            { value: stats.resources, label: 'Resources' },
            { value: stats.services, label: 'Services' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-h3 md:text-h2 font-bold text-primary-600 mb-1">{stat.value}</div>
              <div className="text-body text-secondary-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}