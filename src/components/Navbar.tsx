import React, { useState } from 'react';
import {
  Info,
  BookOpen,
  Users,
  ShieldCheck,
  Archive,
  Mail,
  Menu,
  X,
  ExternalLink,
  PenTool,
} from 'lucide-react';

interface NavbarProps {
  onOpenArchives?: () => void;
  onOpenArticleArchive?: () => void;
  onOpenSubmissionsLog?: () => void;
  theme?: 'warm' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchives,
  onOpenArticleArchive,
  onOpenSubmissionsLog,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleArchivesClick = (e: React.MouseEvent) => {
    try {
      window.open('/archive.html', '_blank', 'noopener,noreferrer');
    } catch {
      // Ignored if window.open is restricted in iframe
    }
    if (onOpenArchives) onOpenArchives();
    if (onOpenArticleArchive) onOpenArticleArchive();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff] border-b border-gray-200 backdrop-blur-md shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Logo & Emblem */}
          <a
            href="#top"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#a13533] rounded-lg p-1 transition-transform"
            aria-label="SGRCR Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden p-0.5 bg-[#ffffff] ring-2 ring-[#a13533] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img
                src="/logo.svg"
                alt="SRCAA bird and open book emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-[#1f0707] leading-tight">
                SGRCR
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#781f1d] uppercase truncate max-w-[140px] sm:max-w-none">
                SRCAA Global Review
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <a href="#about" className="px-3 py-1.5 text-sm font-semibold text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#781f1d]" />
              About
            </a>
            <a href="#journal-metadata" className="px-3 py-1.5 text-sm font-semibold text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#781f1d]" />
              Scope
            </a>
            <a href="#author-guidelines" className="px-3 py-1.5 text-sm font-semibold text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#781f1d]" />
              Submit
            </a>
            <a href="#editorial-board" className="px-3 py-1.5 text-sm font-semibold text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#781f1d]" />
              Editorial Board
            </a>
            <a href="#policies" className="px-3 py-1.5 text-sm font-semibold text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#781f1d]" />
              Policies
            </a>
            <a href="#archives" className="px-3 py-1.5 text-sm font-semibold text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-[#781f1d]" />
              Archives
            </a>
            <a href="#contact" className="px-3 py-1.5 text-sm font-semibold text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#781f1d]" />
              Contact
            </a>

            <div className="pl-2 border-l border-gray-200 flex items-center gap-2">
              <a
                href="https://www.srcaa.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 border border-gray-200 text-sm font-bold rounded-full shadow-xs transition-all"
                title="Visit SRCAA Official Website"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#781f1d]" />
                <span>SRCAA Portal</span>
              </a>

              <a
                href="/archive.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleArchivesClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1f0707] text-[#ffffff] hover:bg-[#421413] text-sm font-bold rounded-full shadow-xs transition-all transform hover:-translate-y-0.5 border border-[#781f1d]"
                title="Open Archives & Publications"
              >
                <Archive className="w-3.5 h-3.5 text-[#a13533]" />
                <span>Archives</span>
                <ExternalLink className="w-3 h-3 text-[#a13533]" />
              </a>
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="/archive.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleArchivesClick}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#1f0707] text-[#ffffff] text-xs font-bold rounded-full shadow-xs shrink-0"
              title="Archives"
            >
              <Archive className="w-3 h-3 text-[#a13533]" />
              <span className="hidden sm:inline">Archives</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#a13533]" />
            </a>

            <button
              type="button"
              id="mobile-nav-toggle"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-[#1f0707] hover:bg-gray-100 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#a13533]"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden bg-[#ffffff] border-gray-200 border-t px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200 max-w-full overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <a href="#about" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <Info className="w-4 h-4 text-[#781f1d]" />
              About the Journal
            </a>
            <a href="#journal-metadata" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <BookOpen className="w-4 h-4 text-[#781f1d]" />
              Scope & Domains
            </a>
            <a href="#author-guidelines" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <PenTool className="w-4 h-4 text-[#781f1d]" />
              Submit Manuscript
            </a>
            <a href="#editorial-board" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <Users className="w-4 h-4 text-[#781f1d]" />
              Editorial Board
            </a>
            <a href="#policies" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <ShieldCheck className="w-4 h-4 text-[#781f1d]" />
              Publication Policies
            </a>
            <a href="#archives" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <Archive className="w-4 h-4 text-[#781f1d]" />
              Archives
            </a>
            <a href="#contact" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <Mail className="w-4 h-4 text-[#781f1d]" />
              Contact
            </a>
            <a href="https://www.srcaa.co.in/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#1f0707] hover:bg-gray-100">
              <ExternalLink className="w-4 h-4 text-[#781f1d]" />
              SRCAA Website
            </a>
          </div>

          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
            <a
              href="/archive.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                closeMobileMenu();
                if (onOpenArticleArchive) onOpenArticleArchive();
                window.open('/archive.html', '_blank', 'noopener,noreferrer');
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1f0707] text-[#ffffff] font-bold text-sm rounded-md shadow-xs"
            >
              <Archive className="w-4 h-4 text-[#a13533]" />
              Archives & Publications
              <ExternalLink className="w-3 h-3 text-[#a13533]" />
            </a>
            {onOpenSubmissionsLog && (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenSubmissionsLog();
                }}
                className="w-full py-2 px-3 text-center text-xs font-semibold text-[#781f1d] hover:underline"
              >
                Editorial Submissions Management Log
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
