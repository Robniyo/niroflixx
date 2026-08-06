import { useState } from 'react';
import { Shield, FileText, CheckCircle } from 'lucide-react';
import Button from './Button';

interface Props {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  opportunityTitle: string;
}

export default function AgreementModal({ isOpen, onAccept, onDecline, opportunityTitle }: Props) {
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onDecline} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-h4 font-bold text-secondary-900 mb-2">Get Expert Help with Your Application</h2>
          <p className="text-secondary-500 text-body-sm">
            Niroflixx will assist you in applying for <strong>{opportunityTitle}</strong>
          </p>
        </div>

        <div className="bg-secondary-50 rounded-xl p-5 mb-6 space-y-3 text-sm text-secondary-700">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <p>You'll need to complete your <strong>candidate profile</strong> with your skills, education, and documents.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <p>Your documents are <strong>stored securely</strong> and can be reused for future applications.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <p>Our team will review your profile and <strong>guide you through the application process</strong>.</p>
          </div>
        </div>

        <p className="text-body-sm text-secondary-600 mb-6">
          By continuing, you agree that Niroflixx may store your personal information, documents, and use them to assist
          you with this and future opportunities. We will never share your data without your permission.
        </p>

        <div className="flex items-start gap-3 mb-6">
          <input
            type="checkbox"
            id="agree"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="agree" className="text-sm text-secondary-700 cursor-pointer">
            I understand and agree to the terms. I want Niroflixx to help me with this application.
          </label>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onDecline}>Cancel</Button>
          <Button className="flex-1" disabled={!checked} onClick={onAccept}>Continue to Apply</Button>
        </div>
      </div>
    </div>
  );
}