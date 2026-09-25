import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  BookOpen, 
  Check, 
  Copy
} from 'lucide-react';
import { Article } from '../types';

interface ArticlePdfViewerModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticlePdfViewerModal: React.FC<ArticlePdfViewerModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const handleCopyCitation = () => {
    const citation = `${article.authors.join(', ')} (${article.year}). ${article.title}. SRCAA Global Review of Contemporary Research (SGRCR), ${article.volume}(${article.issue}), ${article.pages}. https://doi.org/${article.doi}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f0707]/80 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className={`bg-[#ffffff] rounded-2xl shadow-2xl flex flex-col w-full border border-gray-200 overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'h-[98vh] max-w-[98vw]' 
            : 'h-[90vh] max-w-5xl'
        }`}
      >
        {/* Top Header */}
        <div className="bg-[#1f0707] text-[#ffffff] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b border-[#421413]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#a13533]/20 border border-[#a13533]/40 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#c97775]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-[#a13533] text-[#ffffff] text-[10px] font-bold uppercase tracking-wider">
                  Article {article.articleNumber}
                </span>
                <span className="text-[11px] text-[#c97775] font-semibold">
                  Peer-Reviewed Full Paper
                </span>
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#ffffff] truncate mt-0.5" title={article.title}>
                {article.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Download Button */}
            <a
              href={article.pdfUrl}
              download={article.pdfFileName || `sgrcr-article-${article.articleNumber}.pdf`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#a13533] hover:bg-[#781f1d] text-[#ffffff] text-xs font-bold rounded-lg transition-colors shadow-xs"
              title="Download PDF directly to your device"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Open in separate native tab */}
            <a
              href={article.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#cfb6b3] hover:text-[#ffffff] hover:bg-[#421413] rounded-lg transition-colors"
              title="Open raw PDF in new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-[#cfb6b3] hover:text-[#ffffff] hover:bg-[#421413] rounded-lg transition-colors"
              title={isFullscreen ? "Exit full screen" : "Full screen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#cfb6b3] hover:text-[#ffffff] hover:bg-[#421413] rounded-lg transition-colors ml-1"
              title="Close PDF viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="bg-[#faf6f3] px-4 sm:px-6 py-2 border-b border-[#cfb6b3] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[#421413]">
            <span><strong className="text-[#781f1d]">Authors:</strong> {article.authors.join('; ')}</span>
            <span className="text-gray-400">|</span>
            <span>Vol. {article.volume}, Issue {article.issue} ({article.year}) · pp. {article.pages}</span>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-[#781f1d] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#781f1d]" />
              DOI: <code className="bg-[#ffffff] px-1.5 py-0.5 rounded border border-gray-200 text-[11px] font-mono text-[#1f0707]">{article.doi}</code>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ffffff] hover:bg-[#ede4dc] border border-[#cfb6b3] text-[11px] font-bold text-[#421413] rounded-md transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#781f1d]" />}
              <span>{copied ? 'Citation Copied' : 'Copy APA Citation'}</span>
            </button>
          </div>
        </div>

        {/* Main PDF Frame */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">
          <iframe
            src={`${article.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            title={`PDF of ${article.title}`}
            className="w-full h-full border-0 flex-1 bg-white"
          />
          
          {/* Fallback Notice */}
          <div className="bg-[#ffffff] p-2 text-center text-xs text-[#581e1d] border-t border-gray-200 flex flex-wrap items-center justify-center gap-3">
            <span>File: <span className="font-mono text-[#781f1d] font-semibold">{article.pdfFileName}</span></span>
            <span className="text-gray-300">·</span>
            <a 
              href={article.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-[#781f1d] hover:underline inline-flex items-center gap-1"
            >
              Open in Native Window <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
