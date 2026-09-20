import React from 'react';
import { 
  BookOpen, 
  LockOpen, 
  ShieldCheck, 
  Layers3, 
  Briefcase, 
  Users, 
  Cpu, 
  Scale, 
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { RESEARCH_DOMAINS } from '../data/journalData';

export const JournalMetadataSection: React.FC = () => {
  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-[#781f1d]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#781f1d]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#781f1d]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#781f1d]" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#781f1d]" />;
      case 'Layers':
      default:
        return <Layers3 className="w-5 h-5 text-[#781f1d]" />;
    }
  };

  return (
    <section id="journal-metadata" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#ffffff] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#781f1d] text-xs font-bold uppercase tracking-widest border border-gray-200">
            <BookOpen className="w-3.5 h-3.5" />
            Journal Scope & Specifications
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1f0707] mt-3">
            Key Features & Research Domains
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#581e1d] max-w-2xl">
            SGRCR publishes cutting-edge empirical, conceptual, and review articles across interconnected disciplines that shape contemporary business, governance, and societal progress.
          </p>
        </div>

        {/* 3 Core Structural Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <article className="bg-[#ffffff] border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#781f1d] mb-4">
              <LockOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1f0707] mb-1">
              Open Access Repository
            </h3>
            <p className="text-xs sm:text-sm text-[#581e1d] leading-relaxed">
              Immediate, unrestricted global access to all peer-reviewed articles under Creative Commons CC BY 4.0 license. No subscription or paywall barrier.
            </p>
          </article>

          <article className="bg-[#ffffff] border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#781f1d] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1f0707] mb-1">
              Double-Blind Peer Review
            </h3>
            <p className="text-xs sm:text-sm text-[#581e1d] leading-relaxed">
              Rigorous, blinded assessment by at least two independent subject-matter referees ensuring impartial merit, originality, and methodological soundness.
            </p>
          </article>

          <article className="bg-[#ffffff] border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#781f1d] mb-4">
              <Layers3 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1f0707] mb-1">
              Multidisciplinary Breadth
            </h3>
            <p className="text-xs sm:text-sm text-[#581e1d] leading-relaxed">
              Bridging commerce, management, applied analytics, social sciences, and jurisprudence to encourage interdisciplinary inquiry on complex global challenges.
            </p>
          </article>
        </div>

        {/* 6 Research Domains Grid - Responsive on Mobile, Laptop, and Lab */}
        <div className="mt-8">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1f0707] mb-6">
            Covered Academic Disciplines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {RESEARCH_DOMAINS.map((domain) => (
              <div
                key={domain.id}
                className="bg-[#ffffff] border border-gray-200 rounded-xl p-5 sm:p-6 transition-all hover:border-[#781f1d] hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors">
                    {getDomainIcon(domain.icon)}
                  </div>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-[#1f0707] mb-2 group-hover:text-[#781f1d] transition-colors">
                    {domain.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#581e1d] leading-relaxed mb-4">
                    {domain.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <span className="text-[11px] font-bold text-[#781f1d] block mb-1.5">
                    Key Focus Areas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-50 text-[#421413] text-[10px] font-medium rounded-sm border border-gray-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
