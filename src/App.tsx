import React, { useState, useEffect } from 'react';
import { CookieBanner } from './components/CookieBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickNav } from './components/QuickNav';
import { AboutSection } from './components/AboutSection';
import { JournalMetadataSection } from './components/JournalMetadataSection';
import { AuthorGuidelinesSection } from './components/AuthorGuidelinesSection';
import { EditorialBoardSection } from './components/EditorialBoardSection';
import { PoliciesSection } from './components/PoliciesSection';
import { IssnSection } from './components/IssnSection';
import { ArchivesSection } from './components/ArchivesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ArticleArchiveView } from './components/ArticleArchiveView';
import { EditorialSubmissionsModal } from './components/EditorialSubmissionsModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'main' | 'archive'>('main');
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'warm' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('sgrcr-theme');
      return saved === 'dark' ? 'dark' : 'warm';
    } catch {
      return 'warm';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sgrcr-theme', theme);
    } catch {
      // Ignored
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-deep-dark');
      document.body.classList.remove('bg-[#ffffff]');
      document.body.classList.remove('bg-[#ede4dc]');
      document.body.classList.add('bg-[#120404]');
    } else {
      document.documentElement.classList.remove('theme-deep-dark');
      document.body.classList.remove('bg-[#120404]');
      document.body.classList.remove('bg-[#ede4dc]');
      document.body.classList.add('bg-[#ffffff]');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'warm' : 'dark'));
  };

  // Check URL params on initial load (e.g. ?view=archive or ?tab=archive or ?modal=submissions)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'archive' || params.get('tab') === 'archive') {
      setCurrentView('archive');
    }
    if (params.get('modal') === 'submissions' || params.get('view') === 'submissions') {
      setIsSubmissionsModalOpen(true);
    }
  }, []);

  const handleOpenArticleArchive = () => {
    try {
      window.open('/archive.html', '_blank', 'noopener,noreferrer');
    } catch {
      // In case window.open is blocked in preview iframe
    }
    setCurrentView('archive');
  };

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-[#120404] text-[#f6ece9]' : 'bg-[#ffffff] text-[#1f0707]'} min-h-screen transition-colors duration-200 overflow-x-hidden`}>
      {currentView === 'archive' ? (
        <ArticleArchiveView onBackToMain={() => setCurrentView('main')} />
      ) : (
        <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
          <CookieBanner />
          <Navbar 
            onOpenArticleArchive={handleOpenArticleArchive} 
            onOpenSubmissionsLog={() => setIsSubmissionsModalOpen(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">
            <Hero onOpenArticleArchive={handleOpenArticleArchive} />
            <QuickNav onOpenArticleArchive={handleOpenArticleArchive} />
            <AboutSection />
            <JournalMetadataSection />
            <AuthorGuidelinesSection onOpenSubmissionsLog={() => setIsSubmissionsModalOpen(true)} />
            <EditorialBoardSection />
            <PoliciesSection />
            <IssnSection />
            <ArchivesSection onOpenArchives={handleOpenArticleArchive} />
            <ContactSection />
          </main>
          <Footer 
            onOpenArticleArchive={handleOpenArticleArchive}
            onOpenSubmissionsLog={() => setIsSubmissionsModalOpen(true)}
          />

          <EditorialSubmissionsModal 
            isOpen={isSubmissionsModalOpen} 
            onClose={() => setIsSubmissionsModalOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}
