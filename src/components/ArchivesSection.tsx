import React, { useState } from 'react';
import { 
  Archive, 
  ExternalLink, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Layers, 
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ARTICLES } from '../data/journalData';
import { Article } from '../types';

interface ArchivesSectionProps {
  onOpenArchives?: () => void;
}

export const ArchivesSection: React.FC<ArchivesSectionProps> = ({ onOpenArchives }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  const handleCopyCitation = (article: Article) => {
    const citation = `${article.authors.join(', ')} (${article.year}). ${article.title}. SRCAA Global Review of Contemporary Research (SGRCR), ${article.volume}(${article.issue}), ${article.pages}. https://doi.org/${article.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenSeparateTab = (e: React.MouseEvent) => {
    try {
      window.open('/archive.html', '_blank', 'noopener,noreferrer');
    } catch {
      // Ignored if window.open is restricted in iframe
    }
    if (onOpenArchives) {
      onOpenArchives();
    }
  };

  return (
    <section id="archives" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#ffffff] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Separate Tab Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#781f1d] text-xs font-bold uppercase tracking-widest border border-gray-200">
              <Archive className="w-3.5 h-3.5" />
              Permanent Repository
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1f0707] mt-3">
              Archives & Publications
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#581e1d] max-w-2xl">
              Every published issue and peer-reviewed manuscript is retained here permanently with persistent metadata, article-level DOI assignments, and open-access PDF access under ISSN India and COPE archiving standards.
            </p>
          </div>

          {/* Prominent Separate Tab Button: As requested by User */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="/archive.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenSeparateTab}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-[#781f1d]"
              title="Open full Archives & Publications repository in a dedicated separate tab"
            >
              <Archive className="w-4 h-4 text-[#a13533]" />
              <span>Archives & Publications</span>
              <span className="inline-flex items-center gap-1 bg-[#a13533] text-[#1f0707] text-xs font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Open in Separate Tab <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>

        {/* Highlight Card for Volume 1 · Issue 1 */}
        <div className="bg-gray-50/70 border-2 border-[#a13533]/40 rounded-2xl p-5 sm:p-8 shadow-xs mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1f0707] text-[#a13533] flex items-center justify-center shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#781f1d]">
                  Current Inaugural Issue
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1f0707]">
                  Volume 1 · Issue 1 (2026)
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#581e1d]">
              <Calendar className="w-4 h-4 text-[#781f1d]" />
              <span>Published: Bi-annual (January – June 2026)</span>
            </div>
          </div>

          {/* Articles List */}
          <div className="mt-6 space-y-6">
            {ARTICLES.map((article) => {
              const isExpanded = expandedAbstractId === article.id;
              const isCopied = copiedId === article.id;

              return (
                <article
                  key={article.id}
                  className="bg-[#ffffff] border border-gray-200 rounded-xl p-5 sm:p-6 transition-all hover:border-[#781f1d] hover:shadow-md shadow-2xs"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Main Article Details */}
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#1f0707] text-[#c97775] text-[11px] font-bold uppercase tracking-wider rounded-md">
                          Article {article.articleNumber}
                        </span>
                        <span className="px-2.5 py-0.5 bg-gray-100 text-[#421413] text-[11px] font-semibold rounded-md border border-gray-200">
                          {article.category}
                        </span>
                        <span className="text-xs text-[#781f1d] font-semibold">
                          Pages: {article.pages}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-lg sm:text-xl text-[#1f0707] leading-snug hover:text-[#781f1d] transition-colors">
                        <a 
                          href={article.driveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline flex items-start gap-1.5"
                        >
                          {article.title}
                          <ExternalLink className="w-4 h-4 shrink-0 text-[#781f1d] mt-1" />
                        </a>
                      </h4>

                      <p className="text-xs sm:text-sm font-semibold text-[#581e1d]">
                        <span className="text-[#781f1d] font-bold">Authors:</span> {article.authors.join('; ')}
                      </p>

                      {/* Keywords */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-[#781f1d]">Keywords:</span>
                        {article.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-50 text-[#421413] rounded-sm text-[11px] border border-gray-200"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Abstract Accordion */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setExpandedAbstractId(isExpanded ? null : article.id)}
                          className="text-xs font-bold text-[#781f1d] hover:text-[#1f0707] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Hide Abstract ▲' : 'Read Abstract ▼'}</span>
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-[#421413] leading-relaxed animate-in fade-in-50 duration-200">
                            <p className="font-bold text-xs uppercase tracking-wider text-[#781f1d] mb-1">
                              Abstract:
                            </p>
                            <p className="whitespace-pre-line leading-relaxed">{article.abstract}</p>
                            <p className="mt-2 text-[11px] text-[#781f1d]">
                              <strong>DOI Identifier:</strong> {article.doi} (Crossref)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Column */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                      
                      {/* Open Full Article Link (Google Drive in new tab) */}
                      <a
                        href={article.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-colors"
                      >
                        <Download className="w-4 h-4 text-[#a13533]" />
                        <span>Open Article (PDF)</span>
                        <ExternalLink className="w-3 h-3 text-[#a13533]" />
                      </a>

                      {/* Copy Citation Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyCitation(article)}
                        className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#ffffff] hover:bg-gray-50 border border-gray-200 text-[#421413] font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Citation Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#781f1d]" />
                            <span>Cite (APA 7th)</span>
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Separate Tab Banner within the archive box */}
          <div className="mt-8 p-4 sm:p-5 bg-gradient-to-r from-[#1f0707] to-[#421413] text-[#ffffff] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <Sparkles className="w-6 h-6 text-[#a13533] shrink-0 hidden sm:block" />
              <div>
                <p className="font-serif font-bold text-base text-[#ffffff]">
                  Need full search, category filtering & exportable BibTeX citations?
                </p>
                <p className="text-xs text-[#cfb6b3] mt-0.5">
                  Launch the dedicated Archives & Publications repository in a separate browser tab for search, category filtering, and citation tools.
                </p>
              </div>
            </div>
            <a
              href="/archive.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenSeparateTab}
              className="shrink-0 px-5 py-2.5 bg-[#a13533] hover:bg-[#c97775] text-[#1f0707] font-bold text-xs sm:text-sm rounded-lg shadow-xs flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span>Open Archives & Publications</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Future Volume Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#581e1d]">
          <div className="p-4 bg-[#ffffff] border border-gray-200 rounded-xl flex items-start gap-3 shadow-xs">
            <Layers className="w-5 h-5 text-[#781f1d] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1f0707] block mb-1">Volume 1 · Issue 2 (Call for Papers Open)</strong>
              <p>Manuscript submissions for the second bi-annual issue of 2026 are actively being accepted for peer review.</p>
              <a href="#author-guidelines" className="text-[#781f1d] font-bold hover:underline mt-2 inline-block">
                View submission criteria →
              </a>
            </div>
          </div>
          <div className="p-4 bg-[#ffffff] border border-gray-200 rounded-xl flex items-start gap-3 shadow-xs">
            <Archive className="w-5 h-5 text-[#781f1d] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1f0707] block mb-1">Perpetual Open Access Archiving</strong>
              <p>All published manuscripts receive perpetual digital archiving and persistent web URLs to guarantee perpetual scholarly discovery.</p>
              <a href="#issn-compliance" className="text-[#781f1d] font-bold hover:underline mt-2 inline-block">
                Read ISSN India compliance details →
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
