import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy (TODA MAX)</h1>
          <p className="text-gray-500 mb-8">Last Updated: May 8, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">We collect:</p>
            <div className="text-gray-700 space-y-4 mb-4">
              <div>
                <h3 className="font-semibold">a. Personal Information</h3>
                <p className="ml-4">
                  Name, contact number, email, philhealth number(optional)
                </p>
              </div>
              <div>
                <h3 className="font-semibold">
                  b. Health Information (Sensitive Data)
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Medical conditions (hypertension, diabetes)</li>
                  <li>Medication details and schedules</li>
                  <li>Health tracking data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">c. Usage Data</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>App interactions</li>
                  <li>Device and log information</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">We use your data to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Manage medication tracking and reminders</li>
              <li>Process medication orders and deliveries</li>
              <li>Enable healthcare provider monitoring</li>
              <li>Improve system functionality</li>
              <li>Ensure compliance with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              3. Sensitive Data Protection
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>
                Your health information is treated as sensitive personal data
                under the Data Privacy Act of 2012.
              </li>
              <li>
                We implement safeguards to protect confidentiality and security.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing</h2>
            <p className="text-gray-700 mb-4">We may share data with:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Healthcare providers</li>
              <li>Partner pharmacies (for order fulfillment)</li>
              <li>Service providers (hosting, analytics)</li>
              <li>Authorities when required by law</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not sell your personal or health data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We use administrative, technical, and organizational safeguards to
              protect your data. However, no system is completely secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain data only as long as necessary for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Providing services</li>
              <li>Legal compliance</li>
              <li>Medical and reporting purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              Under applicable laws, you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccuracies</li>
              <li>Withdraw consent</li>
              <li>Request deletion (subject to legal limits)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Consent</h2>
            <p className="text-gray-700 mb-4">
              By using TODA MAX, you explicitly consent to the collection and
              processing of your personal and health data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We may integrate third-party services. Their privacy practices may
              differ.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy. Continued use indicates
              acceptance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us
              through the in-app support chat or by emailing us at
              pototanrhu@toda-max.com.
            </p>
          </section>

          {/* Back to Login */}
          <div className="border-t pt-8">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
