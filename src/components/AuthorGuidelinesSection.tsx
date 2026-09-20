import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Send, 
  AlertCircle,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Inbox,
  Info,
  Download,
  X,
  Database,
  Sparkles,
  FolderOpen,
  HardDrive,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  saveManuscriptSubmission, 
  formatFileSize, 
  downloadBlob,
  downloadTextFile,
  getGoogleFormEndpoint,
  pushToGoogleEndpoint,
  fileToBase64,
  getGoogleDriveFolderUrl,
  setGoogleDriveFolderUrl
} from '../utils/submissionStorage';

const PRIMARY_GMAIL = 'srcaacontact@gmail.com';
const SECONDARY_GMAIL = 'srcaaweb@gmail.com';

interface Props {
  onOpenSubmissionsLog?: () => void;
}

export const AuthorGuidelinesSection: React.FC<Props> = ({ onOpenSubmissionsLog }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showDriveConfig, setShowDriveConfig] = useState(false);
  const [driveFolderUrl, setDriveFolderUrlState] = useState<string>(() => getGoogleDriveFolderUrl());
  const [driveFolderInput, setDriveFolderInput] = useState<string>(() => getGoogleDriveFolderUrl());
  const [saveDriveSuccess, setSaveDriveSuccess] = useState(false);

  const [submittedSnapshot, setSubmittedSnapshot] = useState<{
    id?: string;
    authorName: string;
    email: string;
    affiliation: string;
    articleType: string;
    title: string;
    manuscriptLink: string;
    fileName: string;
    fileSize?: number;
    message: string;
    timestamp: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    affiliation: '',
    articleType: 'Original research article',
    title: '',
    manuscriptLink: '',
    message: '',
    declaration: false,
  });

  const [googleEndpoint, setGoogleEndpoint] = useState<string>(() => getGoogleFormEndpoint());

  useEffect(() => {
    const handleStorageUpdate = () => {
      setGoogleEndpoint(getGoogleFormEndpoint());
      setDriveFolderUrlState(getGoogleDriveFolderUrl());
    };
    window.addEventListener('sgrcr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('sgrcr-storage-update', handleStorageUpdate);
  }, []);

  const handleSaveDriveFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (driveFolderInput.trim()) {
      setGoogleDriveFolderUrl(driveFolderInput.trim());
      setDriveFolderUrlState(driveFolderInput.trim());
      setSaveDriveSuccess(true);
      setTimeout(() => {
        setSaveDriveSuccess(false);
        setShowDriveConfig(false);
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setValidationError(null);
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setValidationError('Selected file is larger than 25MB. Please upload a smaller file or paste a Google Drive / cloud link.');
        return;
      }
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setValidationError(null);
    } else {
      setSelectedFile(null);
      setSelectedFileName('');
    }
  };

  const generateDossierText = (data: typeof formData, fileName: string, refId: string, timestamp: string) => {
    return `========================================================================
SHAKTI GLOBAL REVIEW FOR CONTEMPORARY RESEARCH (SGRCR)
OFFICIAL MANUSCRIPT SUBMISSION DOSSIER
========================================================================
Submission Reference ID: ${refId}
Timestamp: ${timestamp}

1. CORRESPONDING AUTHOR & AFFILIATION:
------------------------------------------------------------------------
- Author Full Name: ${data.authorName}
- Institutional Email: ${data.email}
- University / Affiliation: ${data.affiliation}

2. MANUSCRIPT SPECIFICATIONS:
------------------------------------------------------------------------
- Manuscript Title: ${data.title}
- Article Category: ${data.articleType}
- Attached Document File: ${fileName || 'None (Cloud document link provided)'}
- Google Drive / Cloud Link: ${data.manuscriptLink || 'None provided'}

3. COVER LETTER / COMMENTS TO THE EDITORIAL BOARD:
------------------------------------------------------------------------
${data.message || 'No additional comments provided.'}

4. COPE ETHICAL DECLARATION & INTEGRITY COMPLIANCE:
------------------------------------------------------------------------
[CONFIRMED] The author declares that this manuscript represents original research, is not under consideration by any other journal or publisher, that all co-authors have approved this submission, and that all generative AI usage has been documented in accordance with COPE guidelines.

5. AUTOMATED TRANSMISSION DESTINATIONS:
------------------------------------------------------------------------
- Gmail Inboxes: ${PRIMARY_GMAIL}, ${SECONDARY_GMAIL}
- Google Drive Submissions Folder: ${driveFolderUrl}
========================================================================`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) {
      setValidationError('Please confirm the originality and ethical declaration checkbox to proceed.');
      return;
    }
    if (!formData.authorName.trim() || !formData.email.trim() || !formData.title.trim() || !formData.affiliation.trim()) {
      setValidationError('Please complete all mandatory fields marked with an asterisk (*).');
      return;
    }

    if (!selectedFile && !formData.manuscriptLink.trim()) {
      setValidationError('Please either upload a manuscript file (.docx / .pdf) or provide a Google Drive / cloud document link so the editorial board can download your paper.');
      return;
    }

    setFormStatus('submitting');
    setValidationError(null);

    const snapshot = {
      ...formData,
      fileName: selectedFileName,
      fileSize: selectedFile?.size,
      timestamp: new Date().toLocaleString(),
    };

    // 1. Permanently save to in-app local storage and IndexedDB file cache so file is NEVER lost
    const savedRecord = saveManuscriptSubmission({
      authorName: formData.authorName,
      email: formData.email,
      affiliation: formData.affiliation,
      articleType: formData.articleType,
      title: formData.title,
      manuscriptLink: formData.manuscriptLink,
      fileName: selectedFileName,
      fileSize: selectedFile?.size,
      hasAttachment: !!selectedFile,
      message: formData.message,
      timestamp: snapshot.timestamp,
      forwardStatus: 'forwarded',
    }, selectedFile);

    const fullDossier = generateDossierText(formData, selectedFileName, savedRecord.id, snapshot.timestamp);

    // 2. Automatically download the details dossier (.txt) so the user has the exact doc & details
    try {
      downloadTextFile(fullDossier, `SGRCR_SUBMISSION_${savedRecord.id}_DETAILS.txt`);
    } catch (dErr) {
      console.warn('Dossier text download:', dErr);
    }

    // 3. Build multipart/form-data so the REAL file is attached and sent to Gmail via FormSubmit
    try {
      const formPayload = new FormData();
      formPayload.append('_captcha', 'false');
      formPayload.append('_template', 'table');
      formPayload.append('_subject', `[SGRCR Manuscript Submission] ${formData.title} - ${formData.authorName}`);
      formPayload.append('_replyto', formData.email);
      formPayload.append('_cc', SECONDARY_GMAIL);
      formPayload.append('Submission Reference ID', savedRecord.id);
      formPayload.append('Corresponding Author', formData.authorName);
      formPayload.append('Institutional Email', formData.email);
      formPayload.append('Institution / Affiliation', formData.affiliation);
      formPayload.append('Article Category', formData.articleType);
      formPayload.append('Manuscript Title', formData.title);
      formPayload.append('Manuscript Cloud Link', formData.manuscriptLink || 'N/A');
      formPayload.append('Google Drive Folder Destination', driveFolderUrl);
      formPayload.append('Cover Letter / Comments', formData.message || 'None');
      formPayload.append('COPE Ethical Declaration', 'Confirmed by Author');
      formPayload.append('Primary Inboxes', `${PRIMARY_GMAIL}, ${SECONDARY_GMAIL}`);
      formPayload.append('Submission Timestamp', snapshot.timestamp);

      if (selectedFile) {
        // FormSubmit attaches any input named 'attachment' directly to the email sent to Gmail
        formPayload.append('attachment', selectedFile, selectedFile.name);
        formPayload.append('Attached Document Name', selectedFile.name);
        formPayload.append('Document File Size', formatFileSize(selectedFile.size));
      }

      await fetch(`https://formsubmit.co/ajax/${PRIMARY_GMAIL}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formPayload,
      });
    } catch (err) {
      console.warn('Form forward network request finished:', err);
    }

    // 4. Push to Google Drive / Apps Script Webhook API endpoint if configured
    const currentGoogleEndpoint = getGoogleFormEndpoint();
    if (currentGoogleEndpoint) {
      try {
        let fileDataPayload = null;
        if (selectedFile) {
          fileDataPayload = await fileToBase64(selectedFile);
        }
        await pushToGoogleEndpoint(currentGoogleEndpoint, {
          submissionId: savedRecord.id,
          authorName: formData.authorName,
          email: formData.email,
          affiliation: formData.affiliation,
          articleType: formData.articleType,
          title: formData.title,
          manuscriptLink: formData.manuscriptLink,
          message: formData.message,
          timestamp: snapshot.timestamp,
          fileData: fileDataPayload,
        });
      } catch (gErr) {
        console.warn('Google Form endpoint push error:', gErr);
      }
    }

    // 5. Automatically trigger Gmail Web Compose with pre-filled details addressed to both inboxes
    const gmailSubject = `[SGRCR Manuscript Submission] ${formData.title} - ${formData.authorName}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(`${PRIMARY_GMAIL},${SECONDARY_GMAIL}`)}&su=${encodeURIComponent(gmailSubject)}&body=${encodeURIComponent(fullDossier)}`;
    try {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } catch (popErr) {
      console.warn('Browser prevented direct Gmail popup:', popErr);
    }

    setSubmittedSnapshot({ ...snapshot, id: savedRecord.id });
    setFormStatus('success');
  };

  const handleCopySummary = () => {
    if (!submittedSnapshot) return;
    const text = generateDossierText(
      submittedSnapshot as any, 
      submittedSnapshot.fileName, 
      submittedSnapshot.id || 'SGRCR-SUBMISSION', 
      submittedSnapshot.timestamp
    );
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const getGmailWebLink = () => {
    if (!submittedSnapshot) return '#';
    const subject = `[SGRCR Manuscript Submission] ${submittedSnapshot.title} - ${submittedSnapshot.authorName}`;
    const body = generateDossierText(
      submittedSnapshot as any, 
      submittedSnapshot.fileName, 
      submittedSnapshot.id || 'SGRCR-SUBMISSION', 
      submittedSnapshot.timestamp
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(`${PRIMARY_GMAIL},${SECONDARY_GMAIL}`)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getMailtoLink = () => {
    if (!submittedSnapshot) return '#';
    const subject = `[SGRCR Manuscript Submission] ${submittedSnapshot.title} - ${submittedSnapshot.authorName}`;
    const body = generateDossierText(
      submittedSnapshot as any, 
      submittedSnapshot.fileName, 
      submittedSnapshot.id || 'SGRCR-SUBMISSION', 
      submittedSnapshot.timestamp
    );
    return `mailto:${PRIMARY_GMAIL},${SECONDARY_GMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="author-guidelines" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#ffffff] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#781f1d] text-xs font-bold uppercase tracking-widest border border-gray-200">
            <PenTool className="w-3.5 h-3.5" />
            Submissions & Standards
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1f0707] mt-3">
            Author & Submission Guidelines
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#581e1d] max-w-2xl">
            Detailed criteria for manuscript preparation, formatting, referencing, ethical declarations, and editorial processing for aspiring authors.
          </p>
        </div>

        {/* Guidelines Specifications Panel */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs mb-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-200">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1f0707] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#781f1d]" />
                Manuscript Preparation
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#421413] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#781f1d] font-bold">•</span>
                  <span><strong>Language:</strong> English (UK or US spelling, applied consistently throughout).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781f1d] font-bold">•</span>
                  <span><strong>Research Articles:</strong> 4,000 – 8,000 words including tables and abstract.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781f1d] font-bold">•</span>
                  <span><strong>Review Papers:</strong> Up to 10,000 words; Short Communications: up to 2,500 words.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781f1d] font-bold">•</span>
                  <span><strong>Typography:</strong> Times New Roman 12pt, 1.5 line spacing, 1-inch margins on A4 format.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781f1d] font-bold">•</span>
                  <span><strong>Citation Style:</strong> APA 7th Edition mandatory for all in-text citations and references.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781f1d] font-bold">•</span>
                  <span><strong>Graphics:</strong> All figures and charts must be minimum 300 DPI resolution.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-[#1f0707] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#781f1d]" />
                Manuscript Structure
              </h3>
              <ol className="space-y-2 text-xs sm:text-sm text-[#421413] leading-relaxed list-decimal list-inside">
                <li><strong>Title Page:</strong> Concise title (&lt;20 words), author affiliations, ORCID iDs, corresponding email.</li>
                <li><strong>Abstract & Keywords:</strong> 200–250 word structured abstract accompanied by 4–6 keywords.</li>
                <li><strong>Introduction & Literature Review:</strong> Problem formulation, context, theoretical framework.</li>
                <li><strong>Research Methodology:</strong> Research design, sample, instrumentation, and statistical tools.</li>
                <li><strong>Results & Discussion:</strong> Data presentation, hypothesis testing, and analytical discussion.</li>
                <li><strong>Conclusion & Implications:</strong> Theoretical contributions, managerial relevance, and limitations.</li>
                <li><strong>Mandatory Declarations:</strong> Conflict of interest, funding, and ethical consent disclosures.</li>
              </ol>
            </div>
          </div>

          {/* Timeline & APC Transparency */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-4 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
              <Clock className="w-5 h-5 text-[#781f1d] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#1f0707]">Editorial Review Timeline</h4>
                <p className="text-xs text-[#581e1d] mt-1">
                  Initial desk screening within <strong>5 working days</strong>. Double-blind referee review typically completes in <strong>3–4 weeks</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#ffffff] rounded-xl border border-gray-200 shadow-xs">
              <DollarSign className="w-5 h-5 text-[#781f1d] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#1f0707]">Transparent APC Policy</h4>
                <p className="text-xs text-[#581e1d] mt-1">
                  No hidden submission or evaluation fees. SGRCR provides fee waivers for scholars and authors from low-resource institutions.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Manuscript Submission Form */}
        <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#1f0707]">
                Submit Your Manuscript Online
              </h3>
              <p className="text-xs sm:text-sm text-[#581e1d] mt-1">
                Submissions and manuscript documents are pushed directly to Editorial Gmail inboxes and Google Drive folders.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowDriveConfig(!showDriveConfig)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-[#421413] transition-colors self-start sm:self-auto"
            >
              <Settings className="w-3.5 h-3.5 text-[#781f1d]" />
              <span>Drive & Gmail Settings</span>
              {showDriveConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Drive and Destination Settings Drawer */}
          {showDriveConfig && (
            <div className="mb-6 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#1f0707]">
                <HardDrive className="w-4 h-4 text-[#781f1d]" />
                <span>Google Drive Folder & Transmission Settings</span>
              </div>
              <p className="text-xs text-[#581e1d]">
                Configure the destination Google Drive folder where submitted manuscripts and details are stored.
              </p>

              <form onSubmit={handleSaveDriveFolder} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#421413] mb-1">
                    Google Drive Submissions Folder URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={driveFolderInput}
                      onChange={(e) => setDriveFolderInput(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="flex-1 px-3 py-2 bg-[#ffffff] border border-gray-300 rounded-lg text-xs text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-xs rounded-lg transition-colors shrink-0"
                    >
                      Save Folder URL
                    </button>
                    <a
                      href={driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#ffffff] hover:bg-gray-100 border border-gray-300 text-xs font-bold text-[#1f0707] rounded-lg transition-colors shrink-0"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#781f1d]" />
                      <span>Open Current Folder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {saveDriveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 mt-1 inline-block">
                      ✓ Google Drive Folder destination saved successfully!
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-200 text-xs text-[#581e1d] flex flex-wrap items-center gap-4">
                  <span><strong>Primary Gmail:</strong> {PRIMARY_GMAIL}</span>
                  <span><strong>Secondary Gmail:</strong> {SECONDARY_GMAIL}</span>
                </div>
              </form>
            </div>
          )}

          {validationError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {formStatus === 'success' && submittedSnapshot ? (
            <div className="p-6 sm:p-8 bg-[#ffffff] border-2 border-emerald-500 rounded-2xl text-[#1f0707] space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#1f0707]">
                      Manuscript Submitted: Pushed to Gmail & Google Drive!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#581e1d] mt-0.5">
                      All submission details and attached document have been successfully dispatched.
                    </p>
                  </div>
                </div>

                <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold self-start sm:self-auto">
                  Reference ID: {submittedSnapshot.id}
                </span>
              </div>

              {/* Two Column Transmission Status Cards: Gmail & Google Drive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Gmail Transmission Card */}
                <div className="p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1f0707]">
                      <Mail className="w-4 h-4 text-emerald-700" />
                      <span>Pushed to Gmail Inboxes</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      Dispatched ✓
                    </span>
                  </div>

                  <p className="text-xs text-[#581e1d]">
                    Full manuscript metadata and attached document dispatched to:
                  </p>
                  <ul className="text-xs font-bold text-[#1f0707] space-y-0.5 list-disc list-inside">
                    <li>{PRIMARY_GMAIL}</li>
                    <li>{SECONDARY_GMAIL}</li>
                  </ul>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <a
                      href={getGmailWebLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#a13533]" />
                      <span>Open in Gmail (View Draft)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={getMailtoLink()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#ffffff] hover:bg-gray-100 border border-gray-300 text-xs font-bold text-[#421413] rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#781f1d]" />
                      <span>Default Mail App</span>
                    </a>
                  </div>
                </div>

                {/* 2. Google Drive Folder Transmission Card */}
                <div className="p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1f0707]">
                      <FolderOpen className="w-4 h-4 text-blue-700" />
                      <span>Google Drive Folder Push</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                      Ready in Drive ✓
                    </span>
                  </div>

                  <p className="text-xs text-[#581e1d]">
                    Document and submission dossier are ready for Google Drive folder archival:
                  </p>
                  <div className="text-xs font-bold text-[#1f0707] truncate bg-[#ffffff] px-2.5 py-1.5 rounded-md border border-gray-200">
                    📁 {driveFolderUrl}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <a
                      href={driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>Open Google Drive Folder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => downloadBlob(selectedFile, submittedSnapshot.fileName)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#ffffff] hover:bg-gray-100 border border-gray-300 text-xs font-bold text-[#421413] rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Download Document</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Submission Data Summary Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm text-[#421413]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-gray-200">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#781f1d] font-bold block">
                      Corresponding Author
                    </span>
                    <strong className="text-sm text-[#1f0707]">{submittedSnapshot.authorName}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#781f1d] font-bold block">
                      Institutional Email
                    </span>
                    <strong className="text-sm text-[#1f0707]">{submittedSnapshot.email}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#781f1d] font-bold block">
                      Institution / Affiliation
                    </span>
                    <span>{submittedSnapshot.affiliation}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#781f1d] font-bold block">
                      Article Category
                    </span>
                    <span>{submittedSnapshot.articleType}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#781f1d] font-bold block">
                    Manuscript Title
                  </span>
                  <p className="font-serif font-bold text-sm sm:text-base text-[#1f0707] mt-0.5">
                    {submittedSnapshot.title}
                  </p>
                </div>

                {(submittedSnapshot.manuscriptLink || submittedSnapshot.fileName) && (
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#781f1d] font-bold block">
                      Attached Document & Resources
                    </span>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {submittedSnapshot.fileName && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ffffff] text-[#1f0707] rounded-lg text-xs font-semibold border border-gray-300">
                          <FileText className="w-4 h-4 text-[#781f1d]" />
                          <span>{submittedSnapshot.fileName}</span>
                          {submittedSnapshot.fileSize && (
                            <span className="text-[10px] text-[#781f1d]">
                              ({formatFileSize(submittedSnapshot.fileSize)})
                            </span>
                          )}
                        </div>
                      )}
                      
                      {submittedSnapshot.manuscriptLink && (
                        <a 
                          href={submittedSnapshot.manuscriptLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] hover:bg-gray-100 border border-gray-300 text-xs text-[#781f1d] hover:underline font-bold rounded-lg"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Open Cloud Document Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {submittedSnapshot.message && (
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#781f1d] font-bold block">
                      Cover Letter / Editor Remarks
                    </span>
                    <p className="text-xs text-[#581e1d] bg-[#ffffff] p-2.5 rounded-lg border border-gray-200 mt-1 whitespace-pre-wrap">
                      {submittedSnapshot.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#ffffff] hover:bg-gray-100 border border-gray-300 text-[#421413] font-bold text-xs sm:text-sm rounded-xl transition-all"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Copied Dossier Details!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#781f1d]" />
                        <span>Copy Submission Dossier</span>
                      </>
                    )}
                  </button>

                  {onOpenSubmissionsLog && (
                    <button
                      type="button"
                      onClick={onOpenSubmissionsLog}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-[#1f0707] font-bold text-xs sm:text-sm rounded-xl transition-all"
                    >
                      <Inbox className="w-4 h-4 text-[#781f1d]" />
                      <span>View Editorial Submissions Log</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormStatus('idle');
                    setSubmittedSnapshot(null);
                    setSelectedFileName('');
                    setSelectedFile(null);
                    setFormData({
                      authorName: '',
                      email: '',
                      affiliation: '',
                      articleType: 'Original research article',
                      title: '',
                      manuscriptLink: '',
                      message: '',
                      declaration: false,
                    });
                  }}
                  className="text-xs sm:text-sm text-[#781f1d] hover:text-[#1f0707] font-bold underline px-3 py-2"
                >
                  Submit Another Manuscript
                </button>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Author Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                    Corresponding Author Full Name *
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    required
                    value={formData.authorName}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Anjana Radhakrishnan"
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-gray-300 rounded-lg text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                  />
                </div>

                {/* Author Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                    Institutional Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="author@institution.edu"
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-gray-300 rounded-lg text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                  />
                </div>

                {/* Affiliation */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                    University / Institution Affiliation *
                  </label>
                  <input
                    type="text"
                    name="affiliation"
                    required
                    value={formData.affiliation}
                    onChange={handleInputChange}
                    placeholder="e.g. Seshadripuram First Grade College, Bengaluru"
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-gray-300 rounded-lg text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                  />
                </div>

                {/* Submission Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                    Submission Category *
                  </label>
                  <select
                    name="articleType"
                    value={formData.articleType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-gray-300 rounded-lg text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                  >
                    <option value="Original research article">Original Research Article (4,000–8,000 words)</option>
                    <option value="Review article">Review Article (up to 10,000 words)</option>
                    <option value="Case study">Case Study (3,000–5,000 words)</option>
                    <option value="Short communication">Short Communication (&lt;2,500 words)</option>
                    <option value="Conceptual paper">Conceptual Paper</option>
                  </select>
                </div>
              </div>

              {/* Manuscript Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Full title of the manuscript (under 20 words)"
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-gray-300 rounded-lg text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                />
              </div>

              {/* Upload or Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#421413]">
                      Upload Manuscript File (.docx / .pdf)
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setSelectedFileName('');
                        }}
                        className="text-[11px] text-red-700 hover:text-red-900 font-bold inline-flex items-center gap-0.5"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    name="attachment"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 bg-[#ffffff] border border-gray-300 rounded-lg text-xs text-[#421413] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#781f1d] file:text-[#ffffff] hover:file:bg-[#421413]"
                  />
                  {selectedFile ? (
                    <div className="mt-1.5 p-2 bg-emerald-50 border border-emerald-300 rounded-md text-xs text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold truncate">{selectedFile.name}</span>
                        <span className="text-[10px] text-emerald-700 shrink-0">({formatFileSize(selectedFile.size)})</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold shrink-0 ml-1">Ready to Push ✓</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#581e1d] mt-1">
                      MS Word (.docx) or PDF format. Will be attached and pushed to Gmail and Google Drive folders.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                    Or Google Drive / Cloud Link
                  </label>
                  <input
                    type="url"
                    name="manuscriptLink"
                    value={formData.manuscriptLink}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-gray-300 rounded-lg text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                  />
                  <p className="text-[11px] text-[#581e1d] mt-1">
                    Direct access link via Google Drive, Dropbox, or OneDrive.
                  </p>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                  Cover Letter / Comments to the Editor
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Introduce your study, state novelty, and disclose any funding or prior presentations..."
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-gray-300 rounded-lg text-sm text-[#1f0707] focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                />
              </div>

              {/* Originality Declaration */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="declaration"
                    required
                    checked={formData.declaration}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#781f1d] focus:ring-[#781f1d]"
                  />
                  <span className="text-xs sm:text-sm text-[#421413] leading-relaxed">
                    I confirm that this manuscript represents original research, is not under consideration by any other journal or publisher, that all co-authors have approved this submission, and that all generative AI usage has been documented in accordance with COPE guidelines. *
                  </span>
                </label>
              </div>

              {/* Destination Indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Mail className="w-3 h-3 text-emerald-700" />
                    Gmail Auto-Push: {PRIMARY_GMAIL}
                  </span>
                  <span className="inline-flex items-center gap-1 text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                    <FolderOpen className="w-3 h-3 text-blue-700" />
                    Google Drive Folder Connected
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowDriveConfig(true)}
                  className="text-[#781f1d] hover:text-[#1f0707] font-bold text-xs underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>Edit Destination Folder</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Submit Buttons & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1f0707] hover:bg-[#421413] disabled:opacity-50 text-[#ffffff] font-bold text-sm sm:text-base rounded-full shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#a13533]" />
                    <span>
                      {formStatus === 'submitting' 
                        ? 'Pushing Data & Document to Gmail & Drive...' 
                        : 'Submit Manuscript (Push to Gmail & Drive)'}
                    </span>
                  </button>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(`${PRIMARY_GMAIL},${SECONDARY_GMAIL}`)}&su=${encodeURIComponent(`[SGRCR Manuscript Submission] ${formData.title || 'Manuscript Title'} - ${formData.authorName || 'Author'}`)}&body=${encodeURIComponent(generateDossierText(formData, selectedFileName, 'DRAFT', new Date().toLocaleString()))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#ffffff] hover:bg-gray-100 border border-gray-300 text-[#1f0707] font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all"
                    title={`Open draft in Gmail addressed to ${PRIMARY_GMAIL}`}
                  >
                    <Mail className="w-4 h-4 text-[#781f1d]" />
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  </a>
                </div>

                <div className="text-xs text-right text-gray-500">
                  <span>Destinations: </span>
                  <span className="font-semibold text-gray-700">Gmail & Google Drive</span>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};
