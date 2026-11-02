import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, GraduationCap, ArrowRight, ChevronDown } from 'lucide-react';

// Ibice wari usanzwe ufite
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
          <h1 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4 tracking-tight">
            Unlock Your Potential with <span className="text-primary-600">Global Scholarships</span>
          </h1>
          <p className="text-secondary-500 text-lg mb-8 max-w-2xl mx-auto">
            Explore a range of opportunities to help fund your education and achieve your dreams. Apply now and invest in your future.
          </p>

          {/* Search Bar nini */}
          <div className="bg-white p-2 rounded-full shadow-lg border border-secondary-100 flex items-center max-w-3xl mx-auto mb-6">
            <div className="pl-4 text-secondary-400">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search for scholarships, study level, courses, and more..." 
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-secondary-900 placeholder-secondary-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link to={`/search?q=${searchQuery}`} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Search
            </Link>
          </div>

          {/* Filter Pills (Tabs) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
            <span className="text-secondary-500 mr-2">Popular:</span>
            <Link to="/opportunities?level=Undergraduate" className="px-4 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors">Undergraduate</Link>
            <Link to="/opportunities?level=Masters" className="px-4 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors">Masters</Link>
            <Link to="/opportunities?level=PhD" className="px-4 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors">PhD</Link>
            <Link to="/opportunities?dest=Canada" className="px-4 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors">Canada</Link>
            <Link to="/opportunities?dest=USA" className="px-4 py-1.5 bg-white border border-secondary-200 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors">USA</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* 2. TOP STUDY DESTINATIONS (Grid nziza) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Top Study Destinations</h2>
            <Link to="/opportunities" className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Rwanda', code: 'rw' }, { name: 'Canada', code: 'ca' }, 
              { name: 'USA', code: 'us' }, { name: 'UK', code: 'gb' }, 
              { name: 'Australia', code: 'au' }, { name: 'Germany', code: 'de' },
            ].map((dest) => (
              <Link key={dest.name} to={`/opportunities?dest=${dest.name}`} className="bg-white border border-secondary-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:shadow-md hover:border-primary-200 transition-all group">
                {/* Hano turakoresha ifoto y'ibendera aho gukoresha emoji */}
                <img 
                  src={`https://flagcdn.com/w80/${dest.code}.png`} 
                  alt={`${dest.name} flag`} 
                  className="w-12 h-8 object-contain mb-3 group-hover:scale-110 transition-transform shadow-sm rounded-sm"
                />
                <span className="font-semibold text-secondary-900 text-sm">{dest.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. LEARNING CATEGORIES (Ibice byawe) */}
        <LearningCategories />

        {/* 4. FEATURED OPPORTUNITIES (Amakuru agezweho) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">Featured Scholarships</h2>
              <p className="text-secondary-500 mt-1">Explore a range of opportunities to help fund your education.</p>
            </div>
            <Link to="/opportunities" className="hidden sm:flex text-primary-600 font-medium text-sm hover:underline items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FeaturedOpportunities />
        </section>

        <AdBanner position="between_content" />

        {/* 5. FEATURED COURSES */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">Learn & Grow</h2>
              <p className="text-secondary-500 mt-1">Master in-demand tech skills with expert-led training.</p>
            </div>
            <Link to="/academy" className="hidden sm:flex text-primary-600 font-medium text-sm hover:underline items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FeaturedCourses />
        </section>

        {/* 6. SERVICES & RESOURCES */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Professional Services</h2>
            <Link to="/services" className="text-primary-600 font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PopularServices />
        </section>

        {/* 7. NEWS & RESOURCES */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">Latest News</h2>
              <Link to="/news" className="text-primary-600 font-medium text-sm hover:underline">View All</Link>
            </div>
            <LatestNews />
          </section>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">Free Resources</h2>
              <Link to="/resources" className="text-primary-600 font-medium text-sm hover:underline">View All</Link>
            </div>
            <FreeResources />
          </section>
        </div>

        <Testimonials />
        <Partners />
        <CTASection />
        <Newsletter />

        {/* 8. FREQUENTLY ASKED QUESTIONS (FAQs) */}
        <section className="max-w-4xl mx-auto pt-10 border-t border-secondary-200">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-secondary-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-secondary-500">Everything you need to know about Future Scholars and applying for opportunities.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'What is Future Scholars?', a: 'Future Scholars is a unified education and opportunities platform offering scholarships, jobs, courses, and professional services to help you achieve your academic and career goals.' },
              { q: 'How do I apply for Scholarships?', a: 'Browse our Opportunities page, find a scholarship that matches your profile, and click "Apply Now". You may need to create an account or complete your candidate profile first.' },
              { q: 'Who can use Future Scholars?', a: 'Anyone! Whether you are a student looking for scholarships, a professional seeking services, or a lifelong learner looking for courses, our platform is built for you.' },
              { q: 'Is Future Scholars free to use?', a: 'Yes, creating an account and browsing opportunities is completely free. Some professional services (like CV writing or web development) have a fee, which is clearly stated.' },
              { q: 'How do I create an account?', a: 'Click the "Get Started" button at the top right of the page. You can register using your email address or sign in with Google.' },
              { q: 'How do I update my profile information?', a: 'Once logged in, go to your Dashboard and click on "My Profile" or "Settings" to update your personal information, academic details, and documents.' },
              { q: 'How do I search for Scholarships?', a: 'Use the search bar on our Homepage or Opportunities page. You can filter by destination, study level, or type of opportunity to find exactly what you need.' },
              { q: 'Who do I contact if I need help?', a: 'You can reach us through the Contact page, email us at info@fscholars.online, or call our helpline at +250 795 064 502.' },
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-secondary-100 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-secondary-900 text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-secondary-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-secondary-600 text-sm leading-relaxed border-t border-secondary-50 pt-4">
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