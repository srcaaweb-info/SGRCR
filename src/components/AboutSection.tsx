import React from 'react';
import { Info, CheckCircle, Award, ShieldAlert, FileBadge } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#ffffff] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#781f1d] text-xs font-bold uppercase tracking-widest border border-gray-200">
            <Info className="w-3.5 h-3.5" />
            Institutional Context
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1f0707] mt-3">
            SGRCR — A New Era of Research & Discovery
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#581e1d] max-w-3xl">
            Advancing rigorous, ethical, and multidisciplinary academic enquiry under the institutional auspices of Shakti Research Centre and Academia (SRCAA).
          </p>
        </div>

        {/* Main Panel with Consistent White Theme Styling */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs space-y-6 text-[#421413] text-sm sm:text-base leading-relaxed">
          <p>
            The <strong>SRCAA Global Review of Contemporary Research (SGRCR)</strong> is a peer-reviewed, multidisciplinary academic journal published under the aegis of <strong>Shakti Research Centre and Academia (SRCAA)</strong>, a digital academic and research institution established in 2024 and accredited under the <em>International Trade Council (ITC) Conformity Assessment and Recognition Framework</em>. The journal is committed to disseminating high-quality, original research across Commerce, Management, Economics, Social Sciences, Technology, and allied interdisciplinary fields.
          </p>

          <p>
            The journal strictly upholds the principles of the <strong>San Francisco Declaration on Research Assessment (DORA)</strong>, the <strong>Committee on Publication Ethics (COPE)</strong> Code of Conduct, and the editorial and content-selection criteria applied by <strong>Scopus/Elsevier's Content Selection and Advisory Board (CSAB)</strong>, with the long-term objective of qualifying for and sustaining indexation in Scopus and other internationally recognised abstracting and indexing databases.
          </p>

          <p>
            This policy manual consolidates the eight core policies of the journal — <em>Editorial Guidelines, Reviewer Guidelines, Plagiarism Guidelines, Author Guidelines, Withdrawal Policy, Legal Policy, and Academic & Publication Policy</em> — and is referenced in all submission, review, and correspondence templates.
          </p>

          {/* Core Alignment Pillars */}
          <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 text-[#781f1d] font-bold text-sm mb-1">
                <Award className="w-4 h-4" />
                <span>COPE Code of Conduct</span>
              </div>
              <p className="text-xs text-[#581e1d]">
                Zero tolerance for unethical authorship, plagiarism, or fabricated data, strictly adhering to COPE flowcharts.
              </p>
            </div>

            <div className="p-4 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 text-[#781f1d] font-bold text-sm mb-1">
                <FileBadge className="w-4 h-4" />
                <span>DORA Principles</span>
              </div>
              <p className="text-xs text-[#581e1d]">
                Assessing individual research outputs purely on scientific merit, methodology rigor, and societal contribution.
              </p>
            </div>

            <div className="p-4 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 text-[#781f1d] font-bold text-sm mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Scopus CSAB Criteria</span>
              </div>
              <p className="text-xs text-[#581e1d]">
                Regular bi-annual frequency, diverse international editorial board, and persistent Crossref DOI registration.
              </p>
            </div>
          </div>

          {/* Policy Metadata Footer */}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-semibold text-[#781f1d]">
            <div>
              <span className="text-[#581e1d] block font-normal">Policy Version</span>
              <span>v1.0 (2026 Release)</span>
            </div>
            <div>
              <span className="text-[#581e1d] block font-normal">Print ISSN</span>
              <span>Applied for</span>
            </div>
            <div>
              <span className="text-[#581e1d] block font-normal">Online e-ISSN</span>
              <span>Applied for</span>
            </div>
            <div>
              <span className="text-[#581e1d] block font-normal">DOI Prefix</span>
              <span>To be assigned (Crossref)</span>
            </div>
            <div>
              <span className="text-[#581e1d] block font-normal">Review Protocol</span>
              <span>Double-Blind Peer Review</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
