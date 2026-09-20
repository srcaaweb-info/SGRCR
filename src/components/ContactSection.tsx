import React, { useState } from 'react';
import { 
  Mail, 
  Building2, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Globe2, 
  FileText,
  Send
} from 'lucide-react';

const CONTACT_EMAILS = [
  {
    id: 'editorial',
    title: 'Primary Editorial & Manuscript Inquiries',
    email: 'srcaacontact@gmail.com',
    description: 'For manuscript submissions, peer review follow-ups, author guidelines questions, revision tracking, and general editorial inquiries.',
    badge: 'Editorial Desk',
    primary: true,
  },
  {
    id: 'admin',
    title: 'Administrative & Institutional Secretariat',
    email: 'admin@srcaa.co.in',
    description: 'For institutional affiliations, publisher partnerships, licensing, accreditation, copyright verification, and administrative communications.',
    badge: 'Administration',
    primary: false,
  },
];

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2500);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#ffffff] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#781f1d] bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Contact Secretariat
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1f0707] mt-3 mb-4">
            Editorial Secretariat & Official Contacts
          </h2>
          <p className="text-[#581e1d] text-base sm:text-lg leading-relaxed">
            Connect directly with the editorial office and administrative secretariat of the 
            <strong> SRCAA Global Review of Contemporary Research (SGRCR)</strong>.
          </p>
        </div>

        {/* Primary Contact Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {CONTACT_EMAILS.map((item) => (
            <div 
              key={item.id}
              className={`rounded-2xl p-7 sm:p-9 border transition-all shadow-xs flex flex-col justify-between ${
                item.primary 
                  ? 'bg-[#ffffff] border-[#781f1d]/40 ring-1 ring-[#781f1d]/20' 
                  : 'bg-[#ffffff] border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-[#421413] border border-gray-200">
                    {item.badge}
                  </span>
                  <Mail className="w-5 h-5 text-[#781f1d]" />
                </div>

                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1f0707] mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-[#581e1d] leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Email Display Box */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Mail className="w-4 h-4 text-[#781f1d] shrink-0" />
                    <a 
                      href={`mailto:${item.email}`}
                      className="font-mono font-bold text-sm sm:text-base text-[#1f0707] hover:text-[#781f1d] hover:underline truncate"
                      title={`Send email to ${item.email}`}
                    >
                      {item.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.email)}
                    className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-[#421413] transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-gray-200"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail === item.email ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#781f1d]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
                <a
                  href={`mailto:${item.email}?subject=Inquiry%20to%20SGRCR%20Secretariat`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.email)}&su=Inquiry%20to%20SGRCR%20Secretariat`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#ffffff] hover:bg-gray-50 border border-gray-200 text-[#421413] font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-2xs"
                >
                  <span>Open in Gmail</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#781f1d]" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Secretariat & Guidelines Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Institution Affiliation */}
          <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#781f1d] mb-4 border border-gray-200">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1f0707] mb-1">
              Publishing Institution
            </h4>
            <p className="text-xs text-[#421413] font-semibold">
              Shakti Research Centre and Academia (SRCAA)
            </p>
            <p className="text-xs text-[#581e1d] mt-1.5 leading-relaxed">
              Academic research consortium operating under international academic standards and institutional frameworks.
            </p>
            <a 
              href="https://www.srcaa.co.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#781f1d] hover:underline mt-3"
            >
              <span>Visit Official SRCAA Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Working Hours & Response Times */}
          <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#781f1d] mb-4 border border-gray-200">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1f0707] mb-1">
              Desk Working Hours
            </h4>
            <p className="text-xs text-[#421413] font-semibold">
              Monday – Friday: 09:30 AM – 05:30 PM (IST)
            </p>
            <p className="text-xs text-[#581e1d] mt-1.5 leading-relaxed">
              Inquiries, submissions, and editorial correspondence are typically acknowledged within <strong>24 to 48 working hours</strong>.
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-[#781f1d] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prompt Peer-Review Assistance</span>
            </div>
          </div>

          {/* Submissions & Peer Review Help */}
          <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#781f1d] mb-4 border border-gray-200">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1f0707] mb-1">
              Manuscript Submissions
            </h4>
            <p className="text-xs text-[#421413] font-semibold">
              Double-Blind Peer Review
            </p>
            <p className="text-xs text-[#581e1d] mt-1.5 leading-relaxed">
              Authors may submit papers directly via our online portal or email their manuscripts in Word/PDF format to <a href="mailto:srcaacontact@gmail.com" className="text-[#781f1d] font-bold hover:underline">srcaacontact@gmail.com</a>.
            </p>
            <a 
              href="#submit-manuscript" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#781f1d] hover:underline mt-3"
            >
              <span>Submit Manuscript Online</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
