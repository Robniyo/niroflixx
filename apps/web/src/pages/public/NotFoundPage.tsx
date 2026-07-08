import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary-200 mb-4">404</div>
        <h1 className="text-h2 font-bold text-secondary-900 mb-3">Page Not Found</h1>
        <p className="text-secondary-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/"><Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>Go Home</Button></Link>
          <Link to="/search"><Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>Search</Button></Link>
        </div>
      </div>
    </div>
  );
}