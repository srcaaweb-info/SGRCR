import React from 'react';
import { 
  Archive, 
  PenTool, 
  ExternalLink, 
  CheckCircle2, 
  Award, 
  Globe2, 
  FileText 
} from 'lucide-react';

interface HeroProps {
  onOpenArticleArchive?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenArticleArchive }) => {
  const handleOpenSeparateArchive = (e: React.MouseEvent) => {
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
    <section id="top" className="relative overflow-hidden bg-gradient-to-br from-[#260d0d] via-[#3d1615] to-[#421413] text-[#ffffff] py-12 sm:py-16 md:py-20 lg:py-24 border-b border-[#cfb6b3]">
      {/* Subtle academic background grid & ambient light */}
      <div className="absolute inset-0 hero-grid pointer-events-none opacity-40" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#a13533]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#781f1d]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Emblem */}
        <div className="inline-flex flex-col items-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-1.5 bg-[#ffffff] ring-4 ring-[#a13533]/80 shadow-2xl transition-transform hover:scale-105 duration-300">
            <img 
              src="/logo.svg" 
              alt="SRCAA bird and open book emblem" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1 rounded-full bg-[#a13533]/20 border border-[#a13533]/40 text-[#c97775] text-xs sm:text-sm font-bold tracking-widest uppercase shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#c97775]" />
            Peer-Reviewed International Academic Journal
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#ffffff] max-w-5xl mx-auto leading-tight tracking-tight drop-shadow-xs">
          SRCAA Global Review of Contemporary Research
        </h1>
        <p className="mt-2 text-xs sm:text-sm md:text-base font-semibold tracking-widest uppercase text-[#c97775]">
          (SGRCR) · Shakti Research Centre & Academia · Est. 2024
        </p>

        {/* Description */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-[#ede0de] max-w-3xl mx-auto font-normal leading-relaxed">
          An open-access, double-blind, multidisciplinary peer-reviewed journal publishing original research across Commerce, Management, Economics, Social Sciences, Technology, and Interdisciplinary Fields with Crossref DOI assignment.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
          
          {/* Option: Archives & Publications in Separate Tab */}
          <a
            href="/archive.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenSeparateArchive}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#a13533] hover:bg-[#781f1d] text-[#ffffff] font-bold text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-[#c97775]"
          >
            <Archive className="w-4 h-4 text-[#ffffff]" />
            <span>Archives & Publications</span>
            <span className="bg-[#ffffff]/20 text-[#ffffff] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 font-extrabold">
              Separate Tab <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </a>

          {/* Section Jump to Archives */}
          <a
            href="#archives"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1f0707]/80 hover:bg-[#1f0707] text-[#ffffff] font-bold text-sm sm:text-base rounded-full border border-[#a13533]/60 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4 text-[#a13533]" />
            <span>Volume 1 Overview</span>
          </a>

          {/* Submit Manuscript */}
          <a
            href="#author-guidelines"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#781f1d] hover:bg-[#732725] text-[#ffffff] font-bold text-sm sm:text-base rounded-full border border-[#a13533]/30 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <PenTool className="w-4 h-4 text-[#c97775]" />
            <span>Submit Manuscript</span>
          </a>
        </div>

        {/* Feature Badges / Highlights */}
        <div className="mt-10 pt-8 border-t border-[#cfb6b3]/20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-left max-w-4xl mx-auto">
          <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-[#a13533] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#ffffff]">Open Access</p>
              <p className="text-[11px] text-[#cfb6b3]">CC BY 4.0 International</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-[#a13533] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#ffffff]">Double-Blind Review</p>
              <p className="text-[11px] text-[#cfb6b3]">2+ Independent Referees</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/10">
            <Globe2 className="w-5 h-5 text-[#a13533] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#ffffff]">Bi-Annual Schedule</p>
              <p className="text-[11px] text-[#cfb6b3]">ISSN India Compliance</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/10">
            <Award className="w-5 h-5 text-[#a13533] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#ffffff]">COPE & DORA</p>
              <p className="text-[11px] text-[#cfb6b3]">Scopus CSAB Criteria</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
