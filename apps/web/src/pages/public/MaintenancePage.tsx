import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-accent-600" />
        </div>
        <h1 className="text-h2 font-bold text-secondary-900 mb-3">We'll Be Right Back</h1>
        <p className="text-secondary-500 mb-6">Niroflixx is currently undergoing maintenance. We'll be back shortly. Thank you for your patience!</p>
        <p className="text-sm text-secondary-400">Contact: robertniyonkuru001@gmail.com | +250 795 064 502</p>
      </div>
    </div>
  );
}