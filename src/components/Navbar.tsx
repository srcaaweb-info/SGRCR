import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  PenTool, 
  ShieldCheck, 
  BadgeCheck, 
  Archive, 
  Mail, 
  Menu, 
  X, 
  ExternalLink,
  Info,
  Moon,
  Sun
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
  theme = 'warm',
  onToggleTheme 
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
    if (onOpenArchives) {
      onOpenArchives();
    }
    if (onOpenArticleArchive) {
      onOpenArticleArchive();
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 ${isDark ? 'bg-[#120404]/95 border-[#451514]' : 'bg-[#ffffff] border-gray-200'} backdrop-blur-md border-b transition-colors duration-200 shadow-xs`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Emblem */}
          <a 
            href="#top" 
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#a13533] rounded-lg p-1 transition-transform"
            aria-label="SGRCR Home"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 ${isDark ? 'bg-[#1c0707] ring-[#781f1d]' : 'bg-[#ffffff] ring-[#a13533]'} ring-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0`}>
              <img 
                src="/logo.svg" 
                alt="SRCAA bird and open book emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif font-bold text-base sm:text-lg tracking-wider ${isDark ? 'text-[#f6ece9]' : 'text-[#1f0707]'} leading-tight`}>
                SRCAA
              </span>
              <span className={`text-[10px] sm:text-xs font-semibold tracking-widest ${isDark ? 'text-[#c27a67]' : 'text-[#781f1d]'} uppercase truncate max-w-[130px] sm:max-w-none`}>
                Global Review (SGRCR)
              </span>
            </div>
          </a>

          {/* Desktop Navigation (fitted to screen with xl breakpoint) */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2" aria-label="Main Navigation">
            <a 
              href="#about" 
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100'} rounded-md transition-colors flex items-center gap-1.5`}
            >
              <Info className="w-3.5 h-3.5 text-[#781f1d]" />
              About
            </a>
            <a 
              href="#journal-metadata" 
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100'} rounded-md transition-colors flex items-center gap-1.5`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#781f1d]" />
              Scope
            </a>
            <a 
              href="#author-guidelines" 
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100'} rounded-md transition-colors flex items-center gap-1.5`}
            >
              <PenTool className="w-3.5 h-3.5 text-[#781f1d]" />
              Submit
            </a>
            <a 
              href="#editorial-board" 
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100'} rounded-md transition-colors flex items-center gap-1.5`}
            >
              <Users className="w-3.5 h-3.5 text-[#781f1d]" />
              Editorial Board
            </a>
            <a 
              href="#policies" 
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100'} rounded-md transition-colors flex items-center gap-1.5`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#781f1d]" />
              Policies
            </a>
            <a 
              href="#issn-compliance" 
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100'} rounded-md transition-colors flex items-center gap-1.5`}
            >
              <BadgeCheck className="w-3.5 h-3.5 text-[#781f1d]" />
              ISSN
            </a>
            <a 
              href="#editorial-office" 
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100'} rounded-md transition-colors flex items-center gap-1.5`}
            >
              <Mail className="w-3.5 h-3.5 text-[#781f1d]" />
              Contact
            </a>

            {/* SRCAA Portal, Archives & Theme Switcher */}
            <div className={`pl-2 border-l ${isDark ? 'border-[#451514]' : 'border-gray-200'} flex items-center gap-2`}>
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    isDark 
                      ? 'bg-[#240909] text-amber-300 border-[#692625] hover:bg-[#330d0c]' 
                      : 'bg-[#ffffff] text-[#1f0707] border-gray-200 hover:bg-gray-100'
                  }`}
                  title={isDark ? "Current: Deep Dark. Click to switch to White/Clean Theme." : "Current: White/Clean Theme. Click to switch to Deep Dark Theme."}
                  aria-label="Toggle Theme"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Deep Dark</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#781f1d]" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>
              )}

              <a
                href="https://www.srcaa.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${isDark ? 'bg-[#1c0707] text-[#e5cfcc] hover:text-[#ffffff] border-[#451514]' : 'bg-[#ffffff] text-[#1f0707] hover:text-[#781f1d] hover:bg-gray-100 border-gray-200'} text-xs xl:text-sm font-bold rounded-full shadow-xs transition-all border`}
                title="Visit Shakti Research Centre and Academia (SRCAA) Official Website"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#781f1d]" />
                <span>SRCAA Portal</span>
              </a>

              <a
                href="/archive.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleArchivesClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1f0707] text-[#ffffff] hover:bg-[#421413] text-xs xl:text-sm font-bold rounded-full shadow-xs transition-all transform hover:-translate-y-0.5 border border-[#781f1d]"
                title="Open Archives & Publications in a separate tab"
              >
                <Archive className="w-3.5 h-3.5 text-[#a13533]" />
                <span>Archives & Publications</span>
                <ExternalLink className="w-3 h-3 text-[#a13533]" />
              </a>
            </div>
          </nav>

          {/* Right Mobile Actions & Hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark 
                    ? 'bg-[#240909] text-amber-300 border-[#692625]' 
                    : 'bg-[#ffffff] text-[#1f0707] border-gray-200 hover:bg-gray-100'
                }`}
                title="Toggle Dark Theme"
                aria-label="Toggle Dark Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#781f1d]" />}
              </button>
            )}

            <a
              href="/archive.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleArchivesClick}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#1f0707] text-[#ffffff] text-xs font-bold rounded-full shadow-xs shrink-0"
              title="Archives & Publications in separate tab"
            >
              <Archive className="w-3 h-3 text-[#a13533]" />
              <span className="hidden sm:inline">Archives</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#a13533]" />
            </a>

            <button
              type="button"
              id="mobile-nav-toggle"
              onClick={toggleMobileMenu}
              className={`p-2 rounded-lg ${isDark ? 'text-[#f6ece9] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'} transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#a13533]`}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-nav-menu"
          className={`xl:hidden ${isDark ? 'bg-[#180505] border-[#451514]' : 'bg-[#ffffff] border-gray-200'} border-t px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200 max-w-full overflow-hidden`}
        >
          <div className={`p-2.5 mb-2 ${isDark ? 'bg-[#240909] border-[#451514]' : 'bg-gray-50 border-gray-200'} rounded-lg border`}>
            <p className="text-xs font-bold text-[#781f1d] uppercase tracking-wider mb-1">
              Direct Publication Access
            </p>
            <a
              href="/archive.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                closeMobileMenu();
                if (onOpenArticleArchive) onOpenArticleArchive();
                window.open('/archive.html', '_blank', 'noopener,noreferrer');
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-[#1f0707] text-[#ffffff] font-bold text-sm rounded-md shadow-xs"
            >
              <span className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-[#a13533]" />
                Archives & Publications
              </span>
              <span className="flex items-center gap-1 text-xs text-[#a13533]">
                Separate Tab <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <a 
              href="#about" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <Info className="w-4 h-4 text-[#781f1d]" />
              About the Journal
            </a>
            <a 
              href="#journal-metadata" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <BookOpen className="w-4 h-4 text-[#781f1d]" />
              Journal Metadata & Domains
            </a>
            <a 
              href="#author-guidelines" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <PenTool className="w-4 h-4 text-[#781f1d]" />
              Submission & Author Guidelines
            </a>
            <a 
              href="#editorial-board" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <Users className="w-4 h-4 text-[#781f1d]" />
              Editorial Board & Editors
            </a>
            <a 
              href="#policies" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <ShieldCheck className="w-4 h-4 text-[#781f1d]" />
              Publication Policies (1–7)
            </a>
            <a 
              href="#issn-compliance" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <BadgeCheck className="w-4 h-4 text-[#781f1d]" />
              ISSN & Indexing Compliance
            </a>
            <a 
              href="#archives" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <Archive className="w-4 h-4 text-[#781f1d]" />
              Archives Section
            </a>
            <a 
              href="#editorial-office" 
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <Mail className="w-4 h-4 text-[#781f1d]" />
              Contact & Editorial Office
            </a>
            <a 
              href="https://www.srcaa.co.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-semibold ${isDark ? 'text-[#e5cfcc] hover:bg-[#240909]' : 'text-[#1f0707] hover:bg-gray-100'}`}
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-[#781f1d]" />
                SRCAA Website (srcaa.co.in)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[#781f1d]" />
            </a>
          </div>

          <div className={`pt-3 border-t ${isDark ? 'border-[#451514]' : 'border-gray-200'} flex flex-col gap-2`}>
            <a
              href="#author-guidelines"
              onClick={closeMobileMenu}
              className="w-full text-center py-2.5 bg-[#781f1d] text-[#ffffff] font-bold text-sm rounded-md shadow-xs hover:bg-[#421413]"
            >
              Submit Manuscript
            </a>
            {onOpenSubmissionsLog && (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenSubmissionsLog();
                }}
                className={`w-full py-2 px-3 text-center text-xs font-semibold ${isDark ? 'text-[#c27a67]' : 'text-[#781f1d]'} hover:underline`}
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
