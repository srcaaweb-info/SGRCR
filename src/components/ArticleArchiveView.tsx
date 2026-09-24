import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  FileText, 
  Copy, 
  Check, 
  ArrowLeft, 
  Calendar, 
  Sparkles,
  BookOpen,
  Share2,
  Server,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { ARTICLES } from '../data/journalData';
import { Article } from '../types';
import { ArticlePdfViewerModal } from './ArticlePdfViewerModal';

interface ArticleArchiveViewProps {
  onBackToMain?: () => void;
}

export const ArticleArchiveView: React.FC<ArticleArchiveViewProps> = ({ onBackToMain }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVolume, setSelectedVolume] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [citationFormat, setCitationFormat] = useState<'apa' | 'bibtex'>('apa');
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
  const [selectedArticleForPdf, setSelectedArticleForPdf] = useState<Article | null>(null);

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.doi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'all' || article.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesVolume = 
      selectedVolume === 'all' || `vol-${article.volume}-issue-${article.issue}` === selectedVolume;

    return matchesSearch && matchesCategory && matchesVolume;
  });

  const handleCopyCitation = (article: Article) => {
    let citation = '';
    if (citationFormat === 'apa') {
      citation = `${article.authors.join(', ')} (${article.year}). ${article.title}. SRCAA Global Review of Contemporary Research (SGRCR), ${article.volume}(${article.issue}), ${article.pages}. https://doi.org/${article.doi}`;
    } else {
      citation = `@article{sgrcr_${article.year}_${article.articleNumber},
  title={${article.title}},
  author={${article.authors.join(' and ')}},
  journal={SRCAA Global Review of Contemporary Research},
  volume={${article.volume}},
  number={${article.issue}},
  pages={${article.pages}},
  year={${article.year}},
  doi={${article.doi}}
}`;
    }
    navigator.clipboard.writeText(citation);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#ede4dc] text-[#1f0707] flex flex-col font-sans">
      
      {/* Dedicated Archive Header */}
      <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#cfb6b3] py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {onBackToMain ? (
              <button
                type="button"
                onClick={onBackToMain}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f2ebe7] hover:bg-[#e9ded8] border border-[#cfb6b3] text-xs font-bold rounded-lg text-[#421413] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Main Website</span>
              </button>
            ) : (
              <a
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f2ebe7] hover:bg-[#e9ded8] border border-[#cfb6b3] text-xs font-bold rounded-lg text-[#421413] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Main Website</span>
              </a>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-[#ffffff] ring-1 ring-[#a13533]">
                <img 
                  src="/logo.svg" 
                  alt="SRCAA Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-serif font-bold text-sm sm:text-base text-[#1f0707] leading-tight">
                  Archives & Publications
                </h1>
                <p className="text-[10px] text-[#781f1d] uppercase tracking-wider font-semibold">
                  SRCAA Global Review of Contemporary Research
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#781f1d]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-900 text-emerald-100 rounded-full text-[11px] font-bold">
              <Server className="w-3 h-3 text-emerald-300" />
              Website Server Repository
            </span>
            <span className="hidden md:inline text-[#581e1d]">
              ISSN India & Open Access Archive (CC BY 4.0)
            </span>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Banner Area */}
        <div className="bg-gradient-to-r from-[#1f0707] to-[#421413] text-[#ffffff] rounded-2xl p-6 sm:p-10 shadow-md mb-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a13533]/30 border border-[#a13533]/50 text-[#c97775] text-xs font-bold uppercase tracking-widest">
                <Archive className="w-3.5 h-3.5" />
                Publications & Repository Index
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                ISSN Requirement Compliant: Hosted on Website Server
              </span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">
              Archives & Publications Repository
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-[#cfb6b3] leading-relaxed">
              Explore all published issues, volumes, and peer-reviewed articles published in SGRCR. All manuscript PDFs are hosted directly on the journal's official web server with persistent URIs, meeting ISSN National Centre statutory digital archiving requirements.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#faf6f3] border border-[#cfb6b3] rounded-2xl p-4 sm:p-6 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#781f1d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, author, keyword, or DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf6f3] border border-[#cfb6b3] rounded-xl text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#faf6f3] border border-[#cfb6b3] rounded-xl text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden font-medium"
              >
                <option value="all">All Academic Categories</option>
                <option value="Commerce">Commerce & Management</option>
                <option value="Technology">AI & Digital Systems</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            {/* Volume Select */}
            <div className="md:col-span-3">
              <select
                value={selectedVolume}
                onChange={(e) => setSelectedVolume(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#faf6f3] border border-[#cfb6b3] rounded-xl text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden font-medium"
              >
                <option value="all">All Volumes & Issues</option>
                <option value="vol-1-issue-1">Volume 1 · Issue 1 (2026)</option>
              </select>
            </div>

          </div>

          {/* Active stats & citation style switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#cfb6b3] text-xs">
            <span className="text-[#581e1d] font-semibold">
              Showing <strong className="text-[#1f0707]">{filteredArticles.length}</strong> published article{filteredArticles.length === 1 ? '' : 's'} · All 8 available via direct server download
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[#781f1d] font-bold">Citation format:</span>
              <button
                type="button"
                onClick={() => setCitationFormat('apa')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  citationFormat === 'apa' 
                    ? 'bg-[#1f0707] text-[#ffffff]' 
                    : 'bg-[#ffffff] text-[#421413] border border-[#cfb6b3]'
                }`}
              >
                APA 7th Edition
              </button>
              <button
                type="button"
                onClick={() => setCitationFormat('bibtex')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  citationFormat === 'bibtex' 
                    ? 'bg-[#1f0707] text-[#ffffff]' 
                    : 'bg-[#ffffff] text-[#421413] border border-[#cfb6b3]'
                }`}
              >
                BibTeX
              </button>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          {filteredArticles.map((article) => {
            const isExpanded = expandedAbstractId === article.id;
            const isCopied = copiedId === article.id;

            return (
              <article
                key={article.id}
                className="bg-[#faf6f3] border border-[#cfb6b3] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-[#1f0707] text-[#c97775] text-xs font-bold rounded-lg uppercase tracking-wider">
                      Article {article.articleNumber}
                    </span>
                    <span className="px-2.5 py-1 bg-[#e9ded8] text-[#421413] text-xs font-bold rounded-lg">
                      {article.category}
                    </span>
                    <span className="text-xs text-[#781f1d] font-semibold">
                      Vol. {article.volume}, Issue {article.issue} ({article.year}) · pp. {article.pages}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Server className="w-3 h-3 text-emerald-600" />
                      Server Hosted
                    </span>
                  </div>

                  <span className="text-xs text-[#581e1d]">
                    Date: {article.publishedDate}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1f0707] leading-snug hover:text-[#781f1d] transition-colors">
                  <button
                    type="button"
                    onClick={() => setSelectedArticleForPdf(article)}
                    className="text-left hover:underline inline-flex items-baseline gap-2 cursor-pointer"
                  >
                    <span>{article.title}</span>
                    <Eye className="w-4 h-4 shrink-0 text-[#781f1d] inline" />
                  </button>
                </h3>

                {/* Authors */}
                <div className="flex flex-wrap items-center gap-1.5 text-sm text-[#421413]">
                  <strong className="text-[#781f1d]">Authors:</strong>
                  {article.authors.map((author, idx) => (
                    <span key={idx} className="font-medium">
                      {author}{idx < article.authors.length - 1 ? ';' : ''}
                    </span>
                  ))}
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-bold text-[#781f1d]">Keywords:</span>
                  {article.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-[#ffffff] text-[#421413] rounded-md text-xs border border-[#cfb6b3]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Abstract Section */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedAbstractId(isExpanded ? null : article.id)}
                    className="text-xs font-bold text-[#781f1d] hover:text-[#1f0707] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isExpanded ? 'Hide Full Abstract ▲' : 'Read Full Abstract ▼'}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 sm:p-5 bg-[#f2ebe7] border border-[#cfb6b3] rounded-xl text-xs sm:text-sm text-[#421413] leading-relaxed animate-in fade-in-50 duration-200 space-y-2">
                      <p className="font-bold text-xs uppercase tracking-wider text-[#781f1d]">
                        Article Abstract:
                      </p>
                      <p className="whitespace-pre-line leading-relaxed">{article.abstract}</p>
                      <div className="pt-2 text-xs text-[#781f1d] flex flex-wrap gap-4 font-semibold">
                        <span>DOI: {article.doi} (Crossref)</span>
                        <span>Direct URL: <code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono">{article.pdfUrl}</code></span>
                        <span>License: Open Access CC BY 4.0</span>
                        <span>Double-Blind Peer Reviewed</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons Bar */}
                <div className="pt-4 border-t border-[#cfb6b3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  
                  {/* Left: View PDF & Direct Download from Website Server */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View in Interactive PDF Viewer Modal */}
                    <button
                      type="button"
                      onClick={() => setSelectedArticleForPdf(article)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#a13533]" />
                      <span>View PDF</span>
                    </button>

                    {/* Direct Server Download */}
                    <a
                      href={article.pdfUrl}
                      download={article.pdfFileName || `sgrcr-article-${article.articleNumber}.pdf`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#781f1d] hover:bg-[#a13533] text-[#ffffff] font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform hover:-translate-y-0.5"
                    >
                      <Download className="w-4 h-4 text-[#ffffff]" />
                      <span>Download PDF ({article.fileSize || 'Direct'})</span>
                    </a>

                    {/* Direct link to open raw PDF in new browser tab */}
                    <a
                      href={article.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#ffffff] hover:bg-[#e9ded8] border border-[#cfb6b3] text-[#421413] font-semibold text-xs rounded-xl transition-colors"
                      title="Open raw PDF file in new browser window"
                    >
                      <span>Direct Tab</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#781f1d]" />
                    </a>

                    {/* Optional Google Drive Mirror (secondary link) */}
                    {article.driveLink && article.driveLink !== 'https://drive.google.com/' && (
                      <a
                        href={article.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#781f1d] hover:underline px-2 py-1 inline-flex items-center gap-1"
                        title="Secondary Google Drive Mirror"
                      >
                        <span className="text-[11px]">Drive Mirror</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Right: Copy Citation */}
                  <button
                    type="button"
                    onClick={() => handleCopyCitation(article)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffffff] hover:bg-[#e9ded8] border border-[#cfb6b3] text-[#421413] font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Citation Copied ({citationFormat.toUpperCase()})!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#781f1d]" />
                        <span>Copy Citation ({citationFormat.toUpperCase()})</span>
                      </>
                    )}
                  </button>

                </div>

              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-[#faf6f3] border border-[#cfb6b3] rounded-2xl">
            <Archive className="w-12 h-12 text-[#781f1d] mx-auto mb-3 opacity-50" />
            <h3 className="font-serif font-bold text-xl text-[#1f0707]">No matching articles found</h3>
            <p className="text-sm text-[#581e1d] mt-1">Try clearing search keywords or selecting another category.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedVolume('all');
              }}
              className="mt-4 px-4 py-2 bg-[#1f0707] text-[#ffffff] text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* In-App PDF Viewer Modal */}
      <ArticlePdfViewerModal
        article={selectedArticleForPdf}
        isOpen={Boolean(selectedArticleForPdf)}
        onClose={() => setSelectedArticleForPdf(null)}
      />

      {/* Archive Footer */}
      <footer className="bg-[#260d0d] text-[#cfb6b3] py-6 border-t border-[#451a19] text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 SRCAA — Shakti Research Centre and Academia. Digital Academic Repository.</p>
          <p className="mt-1 text-[#781f1d]">
            All articles published under Creative Commons CC BY 4.0 license. Hosted on SGRCR Web Server Repository.
          </p>
        </div>
      </footer>

    </div>
  );
};

