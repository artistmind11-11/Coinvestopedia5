import React from 'react';
import { Database, Search, Settings, Cookie } from 'lucide-react';

export const Cookies: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-[800px] mx-auto pb-16">
      <div className="mb-12">
        <div className="flex items-center gap-3 text-primary mb-4">
          <Cookie size={32} />
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text">Cookie Policy</h1>
        </div>
        <p className="text-text-muted text-lg">Last updated: March 27, 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Database className="text-primary" size={24} /> 1. What are Cookies?
          </h2>
          <p>
            Cookies are small files—usually consisting of letters and numbers—placed on your computer or device when you visit our website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Search className="text-primary" size={24} /> 2. How We Use Cookies
          </h2>
          <p>
            Coinvestopedia uses cookies for several purposes, including:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Essential Cookies:</strong> These cookies are strictly necessary for our website to function properly. They allow you to browse our site and use its features.</li>
            <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our site's performance.</li>
            <li><strong>Preference Cookies:</strong> These cookies allow our website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced features.</li>
            <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Settings className="text-primary" size={24} /> 3. Managing Cookies
          </h2>
          <p>
            You can manage or disable cookies through your browser settings. Most browsers allow you to block all cookies, accept only first-party cookies, or clear all cookies upon closing your browser. Please note that if you disable cookies, some parts of our website may not function correctly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Cookie className="text-primary" size={24} /> 4. Updates to this Policy
          </h2>
          <p>
            We may update our Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;
