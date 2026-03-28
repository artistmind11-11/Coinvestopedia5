import React from 'react';
import { FileText, Scale, Gavel, UserCheck } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-[800px] mx-auto pb-16">
      <div className="mb-12">
        <div className="flex items-center gap-3 text-primary mb-4">
          <FileText size={32} />
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text">Terms of Service</h1>
        </div>
        <p className="text-text-muted text-lg">Last updated: March 27, 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Scale className="text-primary" size={24} /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Coinvestopedia website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <UserCheck className="text-primary" size={24} /> 2. Use License
          </h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Coinvestopedia's website for personal, non-commercial transitory viewing only. 
            This is the grant of a license, not a transfer of title, and under this license, you may not:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Modify or copy the materials.</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
            <li>Attempt to decompile or reverse engineer any software contained on Coinvestopedia's website.</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Gavel className="text-primary" size={24} /> 3. Disclaimer
          </h2>
          <p>
            The materials on Coinvestopedia's website are provided on an 'as is' basis. Coinvestopedia makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="mt-4">
            Further, Coinvestopedia does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Scale className="text-primary" size={24} /> 4. Limitations
          </h2>
          <p>
            In no event shall Coinvestopedia or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Coinvestopedia's website, even if Coinvestopedia or a Coinvestopedia authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
