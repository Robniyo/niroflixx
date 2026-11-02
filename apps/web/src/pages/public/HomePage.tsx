import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, GraduationCap, ArrowRight, ChevronDown } from 'lucide-react';

import FeaturedCourses from '@/features/home/FeaturedCourses';
import FeaturedOpportunities from '@/features/home/FeaturedOpportunities';
import PopularServices from '@/features/home/PopularServices';
import LatestNews from '@/features/home/LatestNews';
import FreeResources from '@/features/home/FreeResources';
import Testimonials from '@/features/home/Testimonials';
import Partners from '@/features/home/Partners';
import CTASection from '@/features/home/CTASection';
import Newsletter from '@/features/home/Newsletter';
import AdBanner from '@/components/ui/AdBanner';
import WelcomeGuide from '@/components/ui/WelcomeGuide';
import LearningCategories from '@/features/home/LearningCategories';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-secondary-50/30">
      
      {/* 1. HERO SECTION (Search First) */}
      <section className="bg-gradient-to-b from-primary-50 to-white pt-16 pb-12 px-4 border-b border-secondary-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-secondary-900 mb-4 tracking-tight leading-tight">
            Unlock Your Potential with <span className="text-primary-600">Global Scholarships</span>
          </h1>
          <p className="text-secondary-500 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Explore a range of opportunities to help fund your education and achieve your dreams. Apply now and invest in your future.
          </p>

          {/* Search Bar - Iyi yahinduwe kugira ngo ibe nto kuri mobile */}
          <div className="bg-white p-2 rounded-full shadow-lg border border-secondary-100 flex flex-col sm:flex-row items-center max-w-3xl mx-auto mb-6 gap-2 sm:gap-0">
            <div className="flex items-center w-full pl-4 text-secondary-400">
              <Search className="w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search for scholarships..." 
                className="flex-1 bg-transparent border-none outline-none px-3 py-2 sm:py-3 text-secondary-900 placeholder-secondary-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to={`/search?q=${searchQuery}`} className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-colors text-sm whitespace-nowrap">
              Search
            </Link>
          </div>

          {/* Filter Pills (Tabs) - Zagenzuwe kuri mobile */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium">
            <span className="text-secondary-500 mr-2 hidden sm:inline">Popular:</span>
            <Link to="/opportunities?level=Undergraduate" className="px-3 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors whitespace-nowrap">Undergraduate</Link>
            <Link to="/opportunities?level=Masters" className="px-3 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors whitespace-nowrap">Masters</Link>
            <Link to="/opportunities?level=PhD" className="px-3 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors whitespace-nowrap">PhD</Link>
            <Link to="/opportunities?dest=Canada" className="px-3 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors whitespace-nowrap">Canada</Link>
            <Link to="/opportunities?dest=United States of America" className="px-3 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors whitespace-nowrap">USA</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 2. TOP STUDY DESTINATIONS */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">Top Study Destinations</h2>
            <Link to="/opportunities" className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: 'Rwanda', code: 'rw' }, { name: 'Canada', code: 'ca' }, 
              { name: 'United States of America', code: 'us' }, { name: 'United Kingdom', code: 'gb' }, 
              { name: 'Australia', code: 'au' }, { name: 'Germany', code: 'de' },
            ].map((dest) => (
              <Link key={dest.name} to={`/opportunities?dest=${dest.name}`} className="bg-white border border-secondary-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center hover:shadow-md hover:border-primary-200 transition-all group">
                <img 
                  src={`https://flagcdn.com/w80/${dest.code}.png`} 
                  alt={`${dest.name} flag`} 
                  className="w-10 sm:w-12 h-7 sm:h-8 object-contain mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-sm rounded-sm"
                />
                <span className="font-semibold text-secondary-900 text-xs sm:text-sm text-center">{dest.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <LearningCategories />

        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">Featured Scholarships</h2>
              <p className="text-secondary-500 text-sm mt-1">Explore a range of opportunities.</p>
            </div>
            <Link to="/opportunities" className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FeaturedOpportunities />
        </section>

        <AdBanner position="between_content" />

        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">Learn & Grow</h2>
              <p className="text-secondary-500 text-sm mt-1">Master in-demand tech skills.</p>
            </div>
            <Link to="/academy" className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FeaturedCourses />
        </section>

        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">Professional Services</h2>
            <Link to="/services" className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PopularServices />
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">Latest News</h2>
              <Link to="/news" className="text-primary-600 font-medium text-sm hover:underline">View All</Link>
            </div>
            <LatestNews />
          </section>
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">Free Resources</h2>
              <Link to="/resources" className="text-primary-600 font-medium text-sm hover:underline">View All</Link>
            </div>
            <FreeResources />
          </section>
        </div>

        <Testimonials />
        <Partners />
        <CTASection />
        <Newsletter />
              {/* MONETAG IN-PAGE PUSH AD */}
      <div className="flex justify-center w-full py-8">
         <script 
           dangerouslySetInnerHTML={{ 
             __html: `(function(s){s.dataset.zone='12178377',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` 
           }} 
         />
      </div>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto pt-8 border-t border-secondary-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-secondary-500 text-sm">Everything you need to know about Future Scholars.</p>
          </div>
          <div className="space-y-3">
            {[
              { q: 'What is Future Scholars?', a: 'Future Scholars is a unified education and opportunities platform offering scholarships, jobs, courses, and professional services.' },
              { q: 'How do I apply for Scholarships?', a: 'Browse our Opportunities page, find a scholarship, and click "Apply Now".' },
              { q: 'Is Future Scholars free to use?', a: 'Creating an account and browsing opportunities is completely free. Some professional services have a fee.' },
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-secondary-100 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                >
                  <span className="font-semibold text-secondary-900 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-secondary-600 text-sm leading-relaxed border-t border-secondary-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}