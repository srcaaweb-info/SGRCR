import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  GraduationCap, 
  Building2, 
  MapPin, 
  Mail, 
  Globe2, 
  BookOpen, 
  ShieldCheck, 
  Search,
  ExternalLink,
  Briefcase,
  Layers,
  Fingerprint,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Compass,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import { EDITORIAL_MEMBERS } from '../data/journalData';
import { EditorialMember } from '../types';

export const EditorialBoardSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredMembers = EDITORIAL_MEMBERS.filter((member) => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'chairperson' && member.groupTier === 'chairperson') ||
      (selectedCategory === 'chief_editor' && member.groupTier === 'chief_editor') ||
      (selectedCategory === 'chief_reviewer' && member.groupTier === 'chief_reviewer') ||
      (selectedCategory === 'associate_editor' && member.groupTier === 'associate_editor') ||
      (selectedCategory === 'section_editor' && member.groupTier === 'section_editor') ||
      (selectedCategory === 'advisory_international' && member.groupTier === 'advisory_international') ||
      (selectedCategory === 'advisory_national' && member.groupTier === 'advisory_national') ||
      (selectedCategory === 'editorial_member' && member.groupTier === 'editorial_member') ||
      // Aggregate convenience filters
      (selectedCategory === 'editors' && (member.groupTier === 'chief_editor' || member.groupTier === 'associate_editor' || member.groupTier === 'section_editor')) ||
      (selectedCategory === 'all_advisory' && (member.groupTier === 'advisory_international' || member.groupTier === 'advisory_national'));

    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.editorialRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.affiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.officialPostalAddress && member.officialPostalAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.subAffiliation && member.subAffiliation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.emails && member.emails.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const getRoleCategoryBadge = (member: EditorialMember) => {
    switch (member.groupTier) {
      case 'chairperson':
        return {
          icon: <Award className="w-3.5 h-3.5 text-[#ffffff]" />,
          label: 'Chairperson – SGRCR',
          badgeClass: 'bg-[#1f0707] text-[#ffffff] border-[#1f0707]',
        };
      case 'chief_editor':
        return {
          icon: <Award className="w-3.5 h-3.5 text-[#781f1d]" />,
          label: 'Chief Editor',
          badgeClass: 'bg-[#781f1d]/10 border-[#781f1d]/30 text-[#781f1d]',
        };
      case 'chief_reviewer':
        return {
          icon: <FileCheck2 className="w-3.5 h-3.5 text-[#781f1d]" />,
          label: 'Chief Reviewer – SGRCR',
          badgeClass: 'bg-[#a13533]/15 border-[#a13533]/40 text-[#781f1d] font-bold',
        };
      case 'associate_editor':
        return {
          icon: <BookOpen className="w-3.5 h-3.5 text-[#781f1d]" />,
          label: 'Associate Editor',
          badgeClass: 'bg-gray-100 border-gray-200 text-[#421413]',
        };
      case 'section_editor':
        return {
          icon: <Layers className="w-3.5 h-3.5 text-[#781f1d]" />,
          label: 'Section Editor',
          badgeClass: 'bg-gray-100 border-gray-200 text-[#421413]',
        };
      case 'advisory_international':
        return {
          icon: <Globe2 className="w-3.5 h-3.5 text-[#781f1d]" />,
          label: 'Advisory Board – International',
          badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        };
      case 'advisory_national':
        return {
          icon: <Compass className="w-3.5 h-3.5 text-[#781f1d]" />,
          label: 'Advisory Board Member',
          badgeClass: 'bg-amber-50 border-amber-200 text-amber-900',
        };
      case 'editorial_member':
      default:
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-[#781f1d]" />,
          label: 'Editorial Board Member',
          badgeClass: 'bg-gray-50 border-gray-200 text-[#421413]',
        };
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Members', count: EDITORIAL_MEMBERS.length },
    { id: 'chairperson', label: 'Chairperson', count: 1 },
    { id: 'chief_editor', label: 'Chief Editors', count: 2 },
    { id: 'chief_reviewer', label: 'Chief Reviewer', count: 1 },
    { id: 'associate_editor', label: 'Associate Editors', count: 2 },
    { id: 'section_editor', label: 'Section Editors', count: 2 },
    { id: 'advisory_international', label: 'Advisory (International)', count: 3 },
    { id: 'advisory_national', label: 'Advisory Board', count: 1 },
    { id: 'editorial_member', label: 'Editorial Board Members', count: 5 },
  ];

  return (
    <section id="editorial-board" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#ffffff] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Refined Icons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#781f1d] text-xs font-bold uppercase tracking-widest border border-gray-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#781f1d]" />
              Scholarly Governance & Editorial Council
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1f0707] mt-3 flex items-center gap-2.5">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-[#781f1d] shrink-0" />
              <span>Editorial Board & Review Leadership</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#581e1d] max-w-2xl leading-relaxed">
              Distinguished researchers, academic administrators, university chairs, and institutional leaders directing the peer review integrity, publication ethics, and scholarly standards of SGRCR.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#781f1d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, role, college, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#ffffff] border border-gray-200 rounded-full text-[#1f0707] focus:outline-hidden focus:ring-2 focus:ring-[#781f1d] transition-all placeholder:text-[#781f1d]/70 shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Pills / Options */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-200 pb-4">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedCategory(opt.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === opt.id
                  ? 'bg-[#1f0707] text-[#ffffff] shadow-xs'
                  : 'bg-[#ffffff] text-[#421413] border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === opt.id ? 'bg-[#ffffff]/20 text-[#ffffff]' : 'bg-gray-100 text-[#781f1d]'
              }`}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredMembers.map((member) => {
            const badge = getRoleCategoryBadge(member);
            const allEmails = member.emails || (member.email ? [member.email] : []);

            return (
              <article
                key={member.id}
                className="flex flex-col justify-between bg-[#ffffff] border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Top Header: Avatar & Category Badge + Serial Number */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#1f0707] text-[#ffffff] font-serif font-bold text-base sm:text-lg flex items-center justify-center shadow-xs ring-2 ring-[#a13533]/60 group-hover:ring-[#781f1d] transition-all">
                        {member.initials}
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-1 bg-[#ffffff] rounded-full shadow-xs border border-gray-200">
                        {badge.icon}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${badge.badgeClass}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      {member.serialNumber ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#781f1d] bg-gray-100 px-2 py-0.5 rounded-sm border border-gray-200">
                          Member #{member.serialNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#781f1d] bg-gray-100 px-2 py-0.5 rounded-sm border border-gray-200">
                          Executive Chairperson
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Member Name */}
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1f0707] leading-snug">
                    {member.name}
                  </h3>

                  {/* SGRCR Designation */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#781f1d] bg-[#781f1d]/10 px-2.5 py-1 rounded-md mt-1.5 mb-2">
                    <Award className="w-3.5 h-3.5 text-[#781f1d]" />
                    <span>{member.editorialRole}</span>
                  </div>

                  {/* Academic / Institutional Designation */}
                  <div className="flex items-start gap-1.5 text-xs sm:text-sm font-semibold text-[#421413] mt-1 mb-1 leading-relaxed">
                    <Briefcase className="w-4 h-4 text-[#781f1d] shrink-0 mt-0.5" />
                    <span><strong>Designation:</strong> {member.role}</span>
                  </div>

                  {/* Department (if provided) */}
                  {member.department && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#581e1d] mb-2">
                      <Layers className="w-3.5 h-3.5 text-[#a13533] shrink-0" />
                      <span><strong>Department:</strong> {member.department}</span>
                    </div>
                  )}

                  {/* Institutional Affiliation & Details with Icons */}
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-200 text-xs sm:text-sm text-[#421413]">
                    {/* Primary Institution */}
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-[#781f1d] shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong>Institution:</strong> {member.affiliation}
                      </p>
                    </div>

                    {/* Official Postal Address (if provided, e.g. Dr. S. M. Anas Iqbal) */}
                    {member.officialPostalAddress && (
                      <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-[#421413] space-y-1">
                        <div className="flex items-start gap-1.5 font-bold text-[#781f1d]">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Official Postal Address:</span>
                        </div>
                        <p className="text-[11px] text-[#581e1d] pl-5 leading-relaxed">
                          {member.officialPostalAddress}
                        </p>
                      </div>
                    )}

                    {/* Sub Affiliation / University Affiliation */}
                    {member.subAffiliation && (
                      <div className="flex items-start gap-2 text-xs text-[#581e1d]">
                        <GraduationCap className="w-3.5 h-3.5 text-[#a13533] shrink-0 mt-0.5" />
                        <p className="leading-snug">{member.subAffiliation}</p>
                      </div>
                    )}

                    {/* Location */}
                    {!member.officialPostalAddress && (
                      <div className="flex items-start gap-2 text-xs text-[#781f1d]">
                        <MapPin className="w-3.5 h-3.5 text-[#781f1d] shrink-0 mt-0.5" />
                        <span className="leading-snug">{member.location}</span>
                      </div>
                    )}

                    {/* Additional Roles / Responsibilities Tags */}
                    {member.additionalRoles && member.additionalRoles.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {member.additionalRoles.map((roleText, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-[#421413] rounded-md text-[11px] border border-gray-200 font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#781f1d] shrink-0" />
                            <span>{roleText}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Contact Links & Profile Badges */}
                <div className="mt-5 pt-3.5 border-t border-gray-200 space-y-2">
                  {/* Email Contact Bar with Multi-Email Support */}
                  {allEmails.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#781f1d] flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>Official Contact {allEmails.length > 1 ? 'Emails' : 'Email'}:</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {allEmails.map((emailAddr) => (
                          <div key={emailAddr} className="flex items-center justify-between gap-2 p-1.5 bg-gray-50 rounded border border-gray-200 text-xs">
                            <a
                              href={`mailto:${emailAddr}`}
                              className="text-xs font-semibold text-[#781f1d] hover:text-[#1f0707] hover:underline truncate"
                              title={`Email ${member.name} at ${emailAddr}`}
                            >
                              {emailAddr}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(emailAddr)}
                              className="shrink-0 p-1 text-gray-500 hover:text-[#781f1d] transition-colors"
                              title="Copy email"
                            >
                              {copiedEmail === emailAddr ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links: Institutional Profile & ORCID */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                    {member.institutionalProfile ? (
                      <a
                        href={member.institutionalProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#781f1d] hover:text-[#1f0707] hover:underline"
                        title="View Institutional Faculty Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Institutional Profile</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#581e1d] font-medium">
                        SRCAA Editorial Office
                      </span>
                    )}

                    {member.orcid && (
                      <a
                        href={`https://orcid.org/${member.orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#a6ce39]/15 text-[#335500] border border-[#a6ce39]/40 rounded text-xs font-semibold hover:bg-[#a6ce39]/25 transition-colors"
                        title="View Verified ORCID Researcher Record"
                      >
                        <Fingerprint className="w-3 h-3 text-[#4c7800]" />
                        <span>ORCID: {member.orcid}</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
            <Users className="w-10 h-10 text-[#781f1d] mx-auto mb-3 opacity-60" />
            <p className="font-serif font-bold text-lg text-[#1f0707]">No editorial members found</p>
            <p className="text-sm text-[#581e1d] mt-1">Try changing your search term or category filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#1f0707] text-[#ffffff] text-xs font-bold rounded-full cursor-pointer hover:bg-[#421413] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Editorial Standards Note */}
        <div className="mt-10 p-5 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#781f1d] shrink-0 mt-1" />
            <div>
              <p className="font-serif font-bold text-base text-[#1f0707]">
                Editorial Independence & Conflict of Interest Policy
              </p>
              <p className="text-xs sm:text-sm text-[#581e1d] mt-0.5">
                All editorial decisions are strictly separated from publisher administrative interests. Referees and editors with competing interests recuse themselves in adherence to COPE Guidelines.
              </p>
            </div>
          </div>
          <a
            href="#policies"
            className="shrink-0 px-4 py-2 bg-[#ffffff] border border-[#781f1d] text-[#781f1d] hover:bg-[#781f1d] hover:text-[#ffffff] text-xs font-bold rounded-full transition-colors"
          >
            Review Policy 1 & 2
          </a>
        </div>

      </div>
    </section>
  );
};

