import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Users, 
  AlertTriangle, 
  FileX, 
  Scale, 
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { POLICIES } from '../data/journalData';

export const PoliciesSection: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<string>('editorial-guidelines');

  return (
    <section id="policies" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#ffffff] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#781f1d] text-xs font-bold uppercase tracking-widest border border-gray-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Governance & Standards
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1f0707] mt-3">
            Editorial Integrity & Publication Policies
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#581e1d] max-w-2xl">
            SGRCR operates under eight codified governance standards benchmarked against COPE, DORA, ICMJE, and Scopus CSAB criteria.
          </p>
        </div>

        {/* Policy Quick Nav Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
          {POLICIES.map((p) => {
            const isActive = activePolicy === p.slug;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePolicy(p.slug)}
                className={`px-3 py-3 rounded-xl text-left border transition-all text-xs font-bold flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-[#1f0707] text-[#ffffff] border-[#1f0707] shadow-xs'
                    : 'bg-[#ffffff] text-[#421413] border-gray-200 hover:bg-gray-50 shadow-2xs'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-[#a13533]' : 'text-[#781f1d]'}`}>
                  Policy {p.number}
                </span>
                <span className="leading-snug">{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Policy Content Panel */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs space-y-6 text-[#421413] leading-relaxed text-sm sm:text-base">
          
          {/* Policy 1: Editorial Guidelines */}
          {activePolicy === 'editorial-guidelines' && (
            <div id="editorial-guidelines" className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-[#781f1d] text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Policy 1 · Editorial Guidelines
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#1f0707]">
                Editorial Guidelines & Decision-Making Framework
              </h3>
              <p>
                These guidelines govern the composition, responsibilities, and decision-making processes of the Editorial Board of SGRCR, ensuring consistency, transparency, and academic rigour across all stages from submission screening to publication.
              </p>

              <h4 className="font-bold text-base text-[#1f0707] pt-2">Editorial Board Structure</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm list-disc list-inside text-[#581e1d]">
                <li><strong>Editor-in-Chief:</strong> Overall responsibility for editorial policy, ethics enforcement, and final decisions.</li>
                <li><strong>Associate Editors / Section Editors:</strong> Domain triage, referee coordination, and preliminary evaluation.</li>
                <li><strong>International Advisory Board:</strong> Scholarly advisors drawn from multiple countries ensuring geographical breadth in alignment with Scopus board-diversity standards.</li>
                <li><strong>Managing & IT Editors:</strong> Manuscript pipeline management, typesetting verification, and Crossref DOI metadata deposit.</li>
              </ul>

              <h4 className="font-bold text-base text-[#1f0707] pt-2">Core Editorial Responsibilities</h4>
              <ol className="space-y-1.5 text-xs sm:text-sm list-decimal list-inside text-[#581e1d]">
                <li>Evaluate all submissions solely on intellectual merit without regard to race, gender, nationality, or institutional affiliation.</li>
                <li>Preserve strict confidentiality of unpublished manuscripts and referee identities.</li>
                <li>Maintain a documented, auditable review log for all editorial decisions.</li>
                <li>Address any potential conflicts of interest immediately through formal recusal.</li>
              </ol>
            </div>
          )}

          {/* Policy 2: Reviewer Guidelines */}
          {activePolicy === 'reviewer-guidelines' && (
            <div id="reviewer-guidelines" className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-[#781f1d] text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4" /> Policy 2 · Reviewer Guidelines
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#1f0707]">
                Reviewer Selection & Double-Blind Protocol
              </h3>
              <p>
                Peer review is the cornerstone of SGRCR quality assurance. It provides independent, expert scrutiny of manuscript originality, methodology soundness, and scientific contribution.
              </p>

              <h4 className="font-bold text-base text-[#1f0707] pt-2">Reviewer Code of Practice</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm list-disc list-inside text-[#581e1d]">
                <li>Respond to review invitations within <strong>3 working days</strong>.</li>
                <li>Deliver comprehensive, evidence-based critique within the agreed <strong>21-day timeline</strong>.</li>
                <li>Treat all manuscript materials as strictly confidential privileged information.</li>
                <li>Report any suspicion of plagiarism, data fabrication, or duplicate publication immediately to the Editor-in-Chief.</li>
              </ul>

              <h4 className="font-bold text-base text-[#1f0707] pt-2">Decision Categories</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <span className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold text-center">Accept as Submitted</span>
                <span className="p-2.5 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-xs font-bold text-center">Minor Revisions</span>
                <span className="p-2.5 bg-orange-50 border border-orange-300 text-orange-800 rounded-lg text-xs font-bold text-center">Major Revisions</span>
                <span className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg text-xs font-bold text-center">Reject</span>
              </div>
            </div>
          )}

          {/* Policy 3: Plagiarism & AI Guidelines */}
          {activePolicy === 'plagiarism-guidelines' && (
            <div id="plagiarism-guidelines" className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-[#781f1d] text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Policy 3 · Plagiarism & AI Guidelines
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#1f0707]">
                Plagiarism Prevention & AI-Content Thresholds
              </h3>
              <p>
                SGRCR maintains zero tolerance for plagiarism, data fabrication, falsification, and undisclosed generative AI writing. Every submission undergoes systematic automated screening prior to peer review.
              </p>

              <h4 className="font-bold text-base text-[#1f0707] pt-2">Mandatory Similarity Index Thresholds</h4>
              <div className="policy-table-wrapper overflow-x-auto rounded-xl border border-gray-200 shadow-xs w-full max-w-full">
                <table className="policy-table min-w-full">
                  <thead>
                    <tr>
                      <th>Submitter Category</th>
                      <th>Maximum Acceptable Similarity</th>
                      <th>Single-Source Ceiling</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Students & Research Scholars</strong> (UG / PG / Ph.D.)</td>
                      <td className="font-bold text-[#781f1d]">Below 15%</td>
                      <td>&lt; 3% per source</td>
                    </tr>
                    <tr>
                      <td><strong>Faculty & Established Academicians</strong></td>
                      <td className="font-bold text-[#781f1d]">Below 10%</td>
                      <td>&lt; 3% per source</td>
                    </tr>
                    <tr>
                      <td><strong>AI-Generated Content Score</strong> (All Submissions)</td>
                      <td className="font-bold text-rose-700">Strictly Below 20%</td>
                      <td>Mandatory Declaration</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[#581e1d]">
                * Note: In accordance with COPE guidance, authors must clearly specify if LLMs or generative AI assistants were utilized for language refinement or translation in their Declarations statement.
              </p>
            </div>
          )}

          {/* Policy 5: Withdrawal Policy */}
          {activePolicy === 'withdrawal-policy' && (
            <div id="withdrawal-policy" className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-[#781f1d] text-xs font-bold uppercase tracking-wider">
                <FileX className="w-4 h-4" /> Policy 5 · Withdrawal Policy
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#1f0707]">
                Manuscript Withdrawal & Retraction Procedures
              </h3>
              <p>
                To preserve editorial resources and maintain publishing continuity, manuscript withdrawals are strictly regulated across the review cycle.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm list-disc list-inside text-[#581e1d]">
                <li><strong>Pre-Review Withdrawal:</strong> Permitted without sanction within 5 working days of initial acknowledgement.</li>
                <li><strong>During Peer Review:</strong> Requires written request countersigned by all co-authors detailing academic justification.</li>
                <li><strong>Post-Acceptance / Publication:</strong> Withdrawals are not permitted. Post-publication removal is exclusively handled via formal COPE Retraction Notices in cases of proven misconduct or fatal error.</li>
              </ul>
            </div>
          )}

          {/* Policy 6: Legal & Licensing Policy */}
          {activePolicy === 'legal-policy' && (
            <div id="legal-policy" className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-[#781f1d] text-xs font-bold uppercase tracking-wider">
                <Scale className="w-4 h-4" /> Policy 6 · Legal & Licensing Policy
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#1f0707]">
                Copyright, Licensing & Indian Legal Jurisdiction
              </h3>
              <p>
                Authors retain complete copyright ownership of their scholarly works published with SGRCR under an open-access Creative Commons licence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
                  <strong className="block text-sm text-[#1f0707] mb-1">Creative Commons CC BY 4.0</strong>
                  <p className="text-xs text-[#581e1d]">
                    Anyone may read, download, redistribute, and adapt the material provided appropriate citation and credit is given to the original authors.
                  </p>
                </div>

                <div className="p-4 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
                  <strong className="block text-sm text-[#1f0707] mb-1">Bengaluru Court Jurisdiction</strong>
                  <p className="text-xs text-[#581e1d]">
                    All matters and agreements relating to SGRCR and SRCAA publications are governed by the laws of India under the exclusive jurisdiction of the competent courts at Bengaluru, Karnataka.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Policy 7: Academic & Publication Policy */}
          {activePolicy === 'academic-publication-policy' && (
            <div id="academic-publication-policy" className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-[#781f1d] text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" /> Policy 7 · Academic & Publication Policy
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#1f0707]">
                Academic Standards & Scopus CSAB Readiness
              </h3>
              <p>
                SGRCR's editorial policies are structured in full compliance with the core benchmarking criteria applied by Scopus/Elsevier Content Selection and Advisory Board (CSAB).
              </p>

              <h4 className="font-bold text-base text-[#1f0707] pt-2">Key Quality Benchmarks</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm list-disc list-inside text-[#581e1d]">
                <li>Mandatory assignment of persistent Digital Object Identifiers (Crossref DOI).</li>
                <li>Fixed bi-annual publication periodicity strictly maintained without delay.</li>
                <li>Complete article-level metadata with verified references formatted in APA 7th Edition.</li>
                <li>Diversity across editorial board appointments and contributing author institutions.</li>
              </ul>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
