import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Mentalism Mastery',
  description: 'Privacy Policy for Mentalism Mastery mobile application by OVC Tech.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 4, 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Introduction</h2>
          <p>
            This Privacy Policy describes how <strong>OVC Tech</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and
            shares information in connection with your use of the <strong>Mentalism Mastery</strong> mobile application
            (the &quot;App&quot;), available on Google Play (package name: <code>com.mentalismmastery.app</code>).
          </p>
          <p>
            By using the App, you agree to the collection and use of information in accordance with this
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">Information Collected Automatically</h3>
          <p>When you use Mentalism Mastery, we may automatically collect certain information, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Device information (device model, operating system version)</li>
            <li>App usage data and analytics (pages viewed, features used, session duration)</li>
            <li>Crash reports and performance data</li>
            <li>Advertising identifier (for analytics purposes)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">Information You Provide</h3>
          <p>
            Mentalism Mastery may collect information you voluntarily provide, such as your preferences
            and settings within the App.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve the App</li>
            <li>Understand how users interact with the App</li>
            <li>Diagnose and fix technical issues</li>
            <li>Send push notifications (if you have opted in)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Third-Party Services</h2>
          <p>
            Mentalism Mastery may use third-party services that collect information used to identify you.
            These third-party service providers have their own privacy policies addressing how they use
            such information. The third-party services we may use include:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Analytics for Firebase</li>
            <li>Firebase Crashlytics</li>
            <li>Expo Push Notification Services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Data Retention</h2>
          <p>
            We retain collected information for as long as necessary to provide you with the App and
            fulfill the purposes described in this Privacy Policy. Analytics data is retained in
            accordance with our third-party providers&apos; retention policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Data Security</h2>
          <p>
            We value your trust in providing us your information and strive to use commercially
            acceptable means of protecting it. However, no method of transmission over the internet or
            method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Children&apos;s Privacy</h2>
          <p>
            Mentalism Mastery is not intended for use by children under the age of 13. We do not
            knowingly collect personal information from children under 13. If we discover that a child
            under 13 has provided us with personal information, we will delete it immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are
            advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
          <p>
            If you have any questions or suggestions about this Privacy Policy, do not hesitate to
            contact us:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Developer: <strong>OVC Tech</strong></li>
            <li>App: <strong>Mentalism Mastery</strong></li>
            <li>Website: <a href="https://imrizwan.com" className="text-blue-600 hover:underline">https://imrizwan.com</a></li>
            <li>Email: <a href="mailto:segmentbi@gmail.com" className="text-blue-600 hover:underline">segmentbi@gmail.com</a></li>
          </ul>
        </section>
      </div>
    </main>
  )
}
