import HeroSection from '@/features/home/HeroSection';
import Statistics from '@/features/home/Statistics';
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
  return (
    <>
      <HeroSection />
      <WelcomeGuide />
      <Statistics />
      <FeaturedCourses />
      <LearningCategories />
      <FeaturedOpportunities />
      <PopularServices />
      <LatestNews />
      <FreeResources />
      <Testimonials />
      <AdBanner position="between_content" />
      <Partners />
      <CTASection />
      <Newsletter />
    </>
  );
}