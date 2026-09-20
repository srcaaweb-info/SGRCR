import React from 'react';
import { BookOpen, ShieldCheck, Mail, ArrowUp, ExternalLink, Archive } from 'lucide-react';

interface FooterProps {
  onOpenSubmissionsLog?: () => void;
  onOpenArticleArchive?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSubmissionsLog, onOpenArticleArchive }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticleArchive = (e: React.MouseEvent) => {
    try {
      window.open('/archive.html', '_blank', 'noopener,noreferrer');
    } catch {
      // Ignored if window.open is restricted in iframe
    }
    if (onOpenArticleArchive) {
      e.preventDefault();
      onOpenArticleArchive();
    }
  };

  return (
    <footer className="bg-[#260d0d] text-[#ede0de] border-t border-[#451a19]">
      {/* Upper Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Col 1: Emblem & Publisher */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-[#ffffff] ring-2 ring-[#a13533] shrink-0">
                <img 
                  src="/logo.svg" 
                  alt="SRCAA bird and open book emblem" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#ffffff] tracking-wide block leading-tight">
                  SRCAA
                </span>
                <span className="text-xs text-[#a13533] tracking-widest uppercase">
                  Global Review
                </span>
              </div>
            </div>

            <p className="text-xs text-[#cfb6b3] leading-relaxed">
              <strong>Shakti Research Centre and Academia (SRCAA)</strong>. Digital academic and research institution established in 2024, accredited under the International Trade Council (ITC) Framework.
            </p>
          </div>

          {/* Col 2: Journal Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#ffffff] mb-3 pb-1 border-b border-[#451a19]">
              Journal Sections
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#about" className="hover:text-[#ffffff] transition-colors">
                  About SGRCR
                </a>
              </li>
              <li>
                <a href="#journal-metadata" className="hover:text-[#ffffff] transition-colors">
                  Scope & Covered Disciplines
                </a>
              </li>
              <li>
                <a href="#editorial-board" className="hover:text-[#ffffff] transition-colors">
                  Editorial Board & Our Editors
                </a>
              </li>
              <li>
                <a href="#author-guidelines" className="hover:text-[#ffffff] transition-colors">
                  Author Guidelines & Manuscript Submission
                </a>
              </li>
              <li>
                <a href="#archives" className="hover:text-[#ffffff] transition-colors">
                  Archives (Volume 1 · Issue 1)
                </a>
              </li>
              <li>
                {/* Highlighted Link for Archives & Publications in Separate Tab */}
                <a 
                  href="/archive.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleOpenArticleArchive}
                  className="text-[#c97775] font-bold hover:underline inline-flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5 text-[#a13533]" />
                  <span>Archives & Publications (Separate Tab)</span>
                  <ExternalLink className="w-3 h-3 text-[#a13533]" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.srcaa.co.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#a13533] hover:text-[#ffffff] transition-colors inline-flex items-center gap-1 font-semibold"
                >
                  <span>SRCAA Official Website (srcaa.co.in)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Policies */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#ffffff] mb-3 pb-1 border-b border-[#451a19]">
              Statutory Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#editorial-guidelines" className="hover:text-[#ffffff] transition-colors">
                  Policy 1 · Editorial Guidelines
                </a>
              </li>
              <li>
                <a href="#reviewer-guidelines" className="hover:text-[#ffffff] transition-colors">
                  Policy 2 · Reviewer Guidelines
                </a>
              </li>
              <li>
                <a href="#plagiarism-guidelines" className="hover:text-[#ffffff] transition-colors">
                  Policy 3 · Plagiarism & AI Guidelines
                </a>
              </li>
              <li>
                <a href="#withdrawal-policy" className="hover:text-[#ffffff] transition-colors">
                  Policy 5 · Withdrawal & Retraction Policy
                </a>
              </li>
              <li>
                <a href="#legal-policy" className="hover:text-[#ffffff] transition-colors">
                  Policy 6 · Legal & Licensing (CC BY 4.0)
                </a>
              </li>
              <li>
                <a href="#academic-publication-policy" className="hover:text-[#ffffff] transition-colors">
                  Policy 7 · Academic & Publication Policy
                </a>
              </li>
              <li>
                <a href="#issn-compliance" className="hover:text-[#ffffff] transition-colors">
                  ISSN India Particulars & Frequency
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Indexing Roadmaps */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#ffffff] mb-3 pb-1 border-b border-[#451a19]">
              Editorial Contact
            </h4>
            <div className="space-y-2 text-xs text-[#cfb6b3]">
              
              <p>
                <strong className="text-[#ffffff] block">Manuscript Inquiries:</strong>
                <a href="mailto:admin@srcaa.co.in" className="text-[#a13533] hover:underline">
                  admin@srcaa.co.in
                </a>
              </p>
              <p>
                <strong className="text-[#ffffff] block">General Secretariat:</strong>
                <a href="mailto:srcaacontact@gmail.com" className="text-[#a13533] hover:underline">
                  srcaacontact@gmail.com
                </a>
              </p>

              <div className="pt-3 border-t border-[#451a19]">
                <a
                  href="https://www.srcaa.co.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1f0707] hover:bg-[#421413] text-[#c97775] hover:text-[#ffffff] border border-[#781f1d] rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#a13533]" />
                  <span>Visit SRCAA (srcaa.co.in)</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#451a19] bg-[#1a0707] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#cfb6b3]">
          <p className="text-center sm:text-left">
            © 2026 SRCAA — Shakti Research Centre and Academia. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-[#c97775] hover:text-[#ffffff] transition-colors p-1"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
