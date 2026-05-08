import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
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
          <h1 className="text-4xl font-bold mb-2">
            Terms of Service (TODA MAX)
          </h1>
          <p className="text-gray-500 mb-8">Last Updated: May 8, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using TODA MAX (&quot;Service&quot;), you agree to
              be bound by these Terms of Service. If you do not agree, you must
              not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-4">
              TODA MAX is a mobile application designed to help patients manage
              and track medications for hypertension and diabetes. The Service
              includes medication tracking, ordering and delivery,
              notifications, and reporting features for patients and healthcare
              providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Medical Disclaimer</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>TODA MAX does not provide medical advice.</li>
              <li>
                The app is intended for informational and management purposes
                only.
              </li>
              <li>
                Always consult a licensed healthcare professional for diagnosis,
                treatment, and medical decisions.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Users must provide accurate and complete information.</li>
              <li>
                You are responsible for maintaining account confidentiality.
              </li>
              <li>You agree to notify us of any unauthorized access.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              5. User Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">You agree to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Provide accurate health and medication information</li>
              <li>Use the app only for lawful purposes</li>
              <li>Not misuse or attempt to manipulate medical data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              6. Medication Orders and Delivery
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>TODA MAX facilitates medication ordering and delivery.</li>
              <li>
                Availability of medications depends on partner pharmacies.
              </li>
              <li>Delivery times are estimates and may vary.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              7. Notifications and Reminders
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>
                The app provides automated reminders for medication and
                restocking.
              </li>
              <li>Users are responsible for acting on these reminders.</li>
              <li>
                TODA MAX is not liable for missed doses or incorrect usage.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              8. Healthcare Provider Access
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>
                With user consent, healthcare providers may access relevant
                patient data.
              </li>
              <li>
                Users control permissions and may revoke access at any time.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">TODA MAX is not liable for:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Medical outcomes resulting from app usage</li>
              <li>Inaccurate or incomplete user-provided data</li>
              <li>Delays in medication delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              10. Data Use and Privacy
            </h2>
            <p className="text-gray-700 mb-4">
              Your use of the Service is also governed by our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may suspend or terminate accounts for violations of these
              Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms. Continued use indicates acceptance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the Philippines.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions or concerns about these Terms, please contact us
              through the in-app support chat.
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

export default TermsOfServicePage;
