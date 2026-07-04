export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-16">
      <div className="container-content">
        <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">Legal</span>
        <h1 className="text-h1 mt-3 mb-8">Privacy Policy</h1>
        <p className="text-secondary-500 mb-8">Last updated: July 1, 2026</p>

        <div className="prose prose-secondary max-w-none space-y-8">
          <section>
            <h2 className="text-h4 font-semibold mb-3">1. Introduction</h2>
            <p className="text-secondary-600 leading-relaxed">
              Niroflixx ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our platform, 
              accessible at niroflixx.com and related services.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">2. Information We Collect</h2>
            <h3 className="text-h5 font-semibold mt-4 mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-1">
              <li>Full name (first and last name)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Username and password</li>
              <li>Profile picture (optional)</li>
              <li>Educational background and work experience (candidate profiles)</li>
              <li>Uploaded documents (CV, certificates, transcripts)</li>
            </ul>

            <h3 className="text-h5 font-semibold mt-4 mb-2">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-1">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referring website or source</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-secondary-600 space-y-1">
              <li>To provide and maintain our platform services</li>
              <li>To process course enrollments and service requests</li>
              <li>To send notifications about opportunities, courses, and updates</li>
              <li>To improve our platform and user experience</li>
              <li>To communicate with you regarding your account and inquiries</li>
              <li>To ensure platform security and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">4. Data Protection</h2>
            <p className="text-secondary-600 leading-relaxed">
              We implement industry-standard security measures including encryption (bcrypt for passwords), 
              HTTPS protocols, secure HTTP-only cookies for authentication, rate limiting, and input 
              validation. Your data is stored securely and access is restricted to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">5. Data Sharing</h2>
            <p className="text-secondary-600 leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-1">
              <li>Service providers who help us operate the platform</li>
              <li>Partner organizations when you apply to their opportunities</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">6. Your Rights</h2>
            <p className="text-secondary-600 leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 font-semibold mb-3">7. Contact Us</h2>
            <p className="text-secondary-600 leading-relaxed">
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:robertniyonkuru001@gmail.com" className="text-primary-600 hover:underline">
                robertniyonkuru001@gmail.com
              </a>{' '}
              or call <a href="tel:+250795064502" className="text-primary-600 hover:underline">+250 795 064 502</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}