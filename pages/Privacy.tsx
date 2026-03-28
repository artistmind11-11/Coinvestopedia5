import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-[800px] mx-auto pb-16">
      <div className="mb-12">
        <div className="flex items-center gap-3 text-primary mb-4">
          <Shield size={32} />
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text">Privacy Policy</h1>
        </div>
        <p className="text-text-muted text-lg">Last updated: March 27, 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Eye className="text-primary" size={24} /> 1. Information We Collect
          </h2>
          <p>
            At Coinvestopedia, we collect information to providing better services to all our users. The types of personal information we collect include:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Personal Identifiers:</strong> Name, email address, and account preferences when you register for an account or subscribe to our newsletter.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, such as pages visited, time spent, and links clicked.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Lock className="text-primary" size={24} /> 2. How We Use Information
          </h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Providing, maintaining, and improving our services.</li>
            <li>Processing your transactions and managing your account.</li>
            <li>Sending you technical notices, updates, and security alerts.</li>
            <li>Responding to your comments, questions, and customer service requests.</li>
            <li>Personalizing your experience and providing content that matches your interests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Shield className="text-primary" size={24} /> 3. Data Security
          </h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. We use state-of-the-art encryption to protect sensitive data transmitted online. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <FileText className="text-primary" size={24} /> 4. Your Rights
          </h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the data we have collected about you. To exercise these rights, please contact us at privacy@coinvestopedia.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
