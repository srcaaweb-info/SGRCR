import React, { useState, useEffect } from 'react';
import { CookieBanner } from './components/CookieBanner';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IndexingPartners } from './components/IndexingPartners';
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

  useEffect(() => {
    document.body.classList.remove('bg-[#120404]');
    document.body.classList.remove('bg-[#ede4dc]');
    document.body.classList.add('bg-[#ffffff]');
  }, []);

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
    <div className="w-full bg-[#ffffff] text-[#1f0707] min-h-screen transition-colors duration-200 overflow-x-hidden">
      {currentView === 'archive' ? (
        <ArticleArchiveView onBackToMain={() => setCurrentView('main')} />
      ) : (
        <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
          <CookieBanner />
          <TopBar onOpenSubmissionsLog={() => setIsSubmissionsModalOpen(true)} />
          <Navbar
            onOpenArticleArchive={handleOpenArticleArchive}
            onOpenSubmissionsLog={() => setIsSubmissionsModalOpen(true)}
          />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">
            <Hero onOpenArticleArchive={handleOpenArticleArchive} />
            <IndexingPartners />
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
