import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import Button from './Button';
import { useAuth } from '@/contexts/AuthContext';
export default function WelcomeGuide() {
  const { isAuthenticated } = useAuth();

// Don't show to logged-in users
if (isAuthenticated) return null;
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem('welcome-dismissed');
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('welcome-dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-secondary-200 p-6 relative">
        <button onClick={dismiss} className="absolute top-3 right-3 p-1.5 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg">
          <X className="w-4 h-4" />
        </button>

        {step === 0 && (
          <div className="text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Looking for opportunities?</h3>
            <p className="text-body-sm text-secondary-500 mb-4">Scholarships, jobs, internships — we'll match you with the best ones.</p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" onClick={() => setStep(1)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Yes, Show Me</Button>
              <button onClick={() => { dismiss(); window.location.href = '/academy'; }} className="text-sm text-secondary-400 hover:text-secondary-600">I'm here to learn</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="text-center">
            <div className="w-14 h-14 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Create your free account</h3>
            <p className="text-body-sm text-secondary-500 mb-4">Fill your profile once, apply to unlimited opportunities. Takes 2 minutes.</p>
            <Link to="/register" onClick={dismiss}>
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}