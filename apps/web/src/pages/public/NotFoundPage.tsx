import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="container-page py-32 text-center">
      <h1 className="text-display-xl text-primary-600">404</h1>
      <p className="text-h4 mt-4">Page Not Found</p>
      <p className="text-secondary-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="inline-block mt-8">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}