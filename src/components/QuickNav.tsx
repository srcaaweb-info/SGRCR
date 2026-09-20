import React from 'react';
import { PenTool, Users, ShieldCheck, Archive, ExternalLink } from 'lucide-react';

interface QuickNavProps {
  onOpenArticleArchive?: () => void;
}

export const QuickNav: React.FC<QuickNavProps> = ({ onOpenArticleArchive }) => {
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
    <section className="bg-[#ffffff] border-b border-gray-200 py-3.5 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Journal Quick Navigation" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          
          <a
            href="#author-guidelines"
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-[#ffffff] hover:bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#1f0707] transition-colors shadow-2xs text-center"
          >
            <PenTool className="w-4 h-4 text-[#781f1d] shrink-0" />
            <span>Author Guidelines</span>
          </a>

          <a
            href="#editorial-board"
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-[#ffffff] hover:bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#1f0707] transition-colors shadow-2xs text-center"
          >
            <Users className="w-4 h-4 text-[#781f1d] shrink-0" />
            <span>Editorial Board</span>
          </a>

          <a
            href="#policies"
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-[#ffffff] hover:bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#1f0707] transition-colors shadow-2xs text-center"
          >
            <ShieldCheck className="w-4 h-4 text-[#781f1d] shrink-0" />
            <span>Publication Policies</span>
          </a>

          <a
            href="/archive.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenSeparateArchive}
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] border border-[#1f0707] rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-2xs group text-center"
            title="Open Archives & Publications in a separate tab"
          >
            <Archive className="w-4 h-4 text-[#a13533] shrink-0" />
            <span className="truncate">Archives & Publications</span>
            <ExternalLink className="w-3 h-3 text-[#a13533] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>

        </nav>
      </div>
    </section>
  );
};
