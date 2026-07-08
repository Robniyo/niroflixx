import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function CTASection() {
  const { isAuthenticated } = useAuth();

if (isAuthenticated) return null;
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-primary-700 to-primary-600">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="container-page text-center relative z-10">
        <h2 className="text-h3 md:text-h2 font-bold text-white mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-white/80 text-body-lg mb-8 max-w-xl mx-auto">
          Join thousands of learners and professionals building their future with Niroflixx.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/register">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Free Account
            </Button>
          </Link>
          <Link to="/academy">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Explore Academy
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}