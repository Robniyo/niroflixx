export default function TermsPage() {
  return (
    <div className="pt-32 pb-16">
      <div className="container-content">
        <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Legal</span>
        <h1 className="text-h1 mt-3 mb-8">Terms of Service</h1>
        <p className="text-secondary-500 mb-8">Last updated: July 1, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-h4 font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-secondary-600 leading-relaxed">
              By accessing or using Niroflixx ("the Platform"), you agree to be bound by these Terms of Service. 
              If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">2. Account Registration</h2>
            <p className="text-secondary-600 leading-relaxed mb-2">You agree to:</p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-1">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not share your account with others</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">3. Platform Services</h2>
            <p className="text-secondary-600 leading-relaxed">
              Niroflixx provides digital learning courses, opportunity listings, professional services, 
              and digital resources. We reserve the right to modify, suspend, or discontinue any service 
              with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">4. User Conduct</h2>
            <p className="text-secondary-600 leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Upload malicious content or malware</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Use the Platform for spam or unsolicited communications</li>
              <li>Impersonate others or provide false information</li>
              <li>Interfere with the Platform's operation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">5. Intellectual Property</h2>
            <p className="text-secondary-600 leading-relaxed">
              All content on the Platform including text, graphics, logos, icons, and software is the property 
              of Niroflixx and is protected by applicable intellectual property laws. You may not reproduce, 
              distribute, or create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">6. Payment Terms</h2>
            <p className="text-secondary-600 leading-relaxed">
              Certain services and courses require payment. All fees are stated in the worldn Francs (RWF) 
              unless otherwise indicated. Payments are processed securely and are non-refundable unless 
              otherwise stated for specific services.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-secondary-600 leading-relaxed">
              Niroflixx is provided "as is." We do not guarantee uninterrupted or error-free service. 
              We are not liable for any indirect, incidental, or consequential damages arising from the use 
              of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">8. Termination</h2>
            <p className="text-secondary-600 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms. You may 
              delete your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">9. Contact</h2>
            <p className="text-secondary-600 leading-relaxed">
              For questions about these terms, contact{' '}
              <a href="mailto:robertniyonkuru001@gmail.com" className="text-primary-600 hover:underline">
                robertniyonkuru001@gmail.com
              </a>{' '}
              or call{' '}
              <a href="tel:+250795064502" className="text-primary-600 hover:underline">+250 795 064 502</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}