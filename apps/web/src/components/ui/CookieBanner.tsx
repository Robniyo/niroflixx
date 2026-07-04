import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-secondary-200 shadow-2xl p-4 animate-slide-up">
      <div className="container-page flex items-center justify-between gap-4 flex-wrap">
        <p className="text-body-sm text-secondary-600 flex-1 min-w-[200px]">
          We use cookies to enhance your experience. By continuing, you agree to our{' '}
          <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={accept}>Accept All</Button>
          <button onClick={accept} className="p-1 text-secondary-400 hover:text-secondary-600"><X className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}