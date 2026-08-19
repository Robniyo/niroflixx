import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function Statistics() {
  const [stats, setStats] = useState({
    courses: 0,
    opportunities: 0,
    users: 0,
    resources: 0,
    services: 0,
    enrollments: 0,
    servicesDelivered: 0,
  });

  useEffect(() => {
    api.get('/stats/public')
      .then(r => setStats(r.data.data))
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: stats.courses, label: 'Courses' },
            { value: stats.opportunities, label: 'Opportunities' },
            { value: stats.users, label: 'Community Members' },
            { value: stats.resources, label: 'Resources' },
            { value: stats.services, label: 'Services' },
            { value: stats.enrollments, label: 'Enrollments' },
            { value: stats.servicesDelivered, label: 'Services Delivered' },
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