import React, { useState, useEffect } from 'react';
import { 
  X, 
  Inbox, 
  FileText, 
  MessageSquare, 
  Mail, 
  ExternalLink, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Send,
  RefreshCw,
  Database,
  Save,
  Play,
  Sparkles,
  Code
} from 'lucide-react';
import { 
  getManuscriptSubmissions, 
  getEditorialInquiries, 
  getManuscriptFile,
  downloadBlob,
  formatFileSize,
  getGoogleFormEndpoint,
  setGoogleFormEndpoint,
  pushToGoogleEndpoint,
  StoredManuscript, 
  StoredInquiry 
} from '../utils/submissionStorage';

const RECIPIENT_GMAIL = 'srcaacontact@gmail.com';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'manuscripts' | 'inquiries' | 'google-forms' | 'setup';
}

export const EditorialSubmissionsModal: React.FC<Props> = ({ isOpen, onClose, defaultTab = 'manuscripts' }) => {
  const [activeTab, setActiveTab] = useState<'manuscripts' | 'inquiries' | 'google-forms' | 'setup'>(defaultTab);
  const [manuscripts, setManuscripts] = useState<StoredManuscript[]>([]);
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activationStatus, setActivationStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Google Form / Sheets API state
  const [googleEndpoint, setGoogleEndpointState] = useState<string>(() => getGoogleFormEndpoint());
  const [saveEndpointSuccess, setSaveEndpointSuccess] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const handleSaveEndpoint = () => {
    setGoogleFormEndpoint(googleEndpoint);
    setSaveEndpointSuccess(true);
    setTimeout(() => setSaveEndpointSuccess(false), 3000);
  };

  const handleClearEndpoint = () => {
    setGoogleEndpointState('');
    setGoogleFormEndpoint('');
    setSaveEndpointSuccess(true);
    setTimeout(() => setSaveEndpointSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!googleEndpoint.trim()) return;
    setTestStatus('testing');
    try {
      const success = await pushToGoogleEndpoint(googleEndpoint.trim(), {
        submissionId: 'TEST-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        authorName: 'Editorial Verification Test',
        email: RECIPIENT_GMAIL,
        affiliation: 'SGRCR Journal Editorial Office',
        articleType: 'System Verification',
        title: 'Google Form & Sheets API Connection Test',
        manuscriptLink: 'https://docs.google.com',
        message: 'This test verifies that submissions and document data are successfully pushed to your Google Form / Sheets response table.',
        timestamp: new Date().toLocaleString(),
        fileData: null,
      });
      setTestStatus(success ? 'success' : 'error');
      setTimeout(() => setTestStatus('idle'), 5000);
    } catch {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 5000);
    }
  };

  const handleCopyScript = () => {
    const script = `// ========================================================
// SGRCR Journal: Google Form / Google Sheets & Drive Webhook
// Automatically stores all manuscript submissions & documents
// ========================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission ID", 
        "Timestamp", 
        "Author Name", 
        "Email", 
        "Affiliation", 
        "Category", 
        "Manuscript Title", 
        "Document Link (Google Drive)", 
        "Cloud Link", 
        "Cover Letter"
      ]);
    }
    
    // Save uploaded document (.docx / .pdf) directly into Google Drive
    var fileUrl = "No file attached";
    if (data.fileData && data.fileData.base64) {
      var decoded = Utilities.base64Decode(data.fileData.base64);
      var blob = Utilities.newBlob(decoded, data.fileData.type || "application/octet-stream", data.fileData.name || "manuscript.docx");
      var file = DriveApp.createFile(blob);
      fileUrl = file.getUrl();
    }
    
    // Append row into Google Sheets (acts as your Form responses sheet)
    sheet.appendRow([
      data.submissionId || "",
      data.timestamp || new Date().toLocaleString(),
      data.authorName || "",
      data.email || "",
      data.affiliation || "",
      data.articleType || "",
      data.title || "",
      fileUrl,
      data.manuscriptLink || "",
      data.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", documentUrl: fileUrl }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const reloadData = () => {
    setManuscripts(getManuscriptSubmissions());
    setInquiries(getEditorialInquiries());
    setGoogleEndpointState(getGoogleFormEndpoint());
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
      if (defaultTab) {
        setActiveTab(defaultTab);
      }
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    const handleUpdate = () => reloadData();
    window.addEventListener('sgrcr-storage-update', handleUpdate);
    return () => window.removeEventListener('sgrcr-storage-update', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const handleSendActivationPing = async () => {
    setActivationStatus('sending');
    try {
      await fetch(`https://formsubmit.co/ajax/${RECIPIENT_GMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: '[SGRCR Activation Test] Verify Form Forwarding',
          _captcha: 'false',
          notice: `Please click the Activate Form button if this is your first time setting up FormSubmit for ${RECIPIENT_GMAIL}`,
          timestamp: new Date().toLocaleString(),
        }),
      });
      setActivationStatus('sent');
    } catch {
      setActivationStatus('error');
    }
  };

  const getManuscriptGmailUrl = (m: StoredManuscript) => {
    const subject = `[SGRCR Manuscript] ${m.title} - ${m.authorName}`;
    const body = `Dear Editorial Office (${RECIPIENT_GMAIL}),\n\nManuscript Submission Details:\n- Author: ${m.authorName}\n- Email: ${m.email}\n- Affiliation: ${m.affiliation}\n- Category: ${m.articleType}\n- Title: ${m.title}\n- Link/File: ${m.manuscriptLink || m.fileName || 'N/A'}\n- Date: ${m.timestamp}\n\nCover Letter:\n${m.message || 'None'}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(RECIPIENT_GMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getInquiryGmailUrl = (inq: StoredInquiry) => {
    const subject = `[SGRCR Inquiry] ${inq.subject} - from ${inq.name}`;
    const body = `Dear Editorial Secretariat (${RECIPIENT_GMAIL}),\n\nInquiry Details:\n- From: ${inq.name} (${inq.email})\n- Subject: ${inq.subject}\n- Date: ${inq.timestamp}\n\nMessage:\n${inq.message}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(RECIPIENT_GMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Type', 'ID', 'Name', 'Email', 'Subject/Title', 'Category/Affiliation', 'Details', 'Timestamp'],
      ...manuscripts.map(m => ['Manuscript', m.id, m.authorName, m.email, m.title, `${m.articleType} | ${m.affiliation}`, m.message || '', m.timestamp]),
      ...inquiries.map(i => ['Inquiry', i.id, i.name, i.email, i.subject, '', i.message, i.timestamp]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SGRCR_Submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#ffffff] border-2 border-[#781f1d]/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#1f0707] text-[#ffffff] flex items-center justify-between border-b border-[#421413]">
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-[#a13533]" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">
                Editorial Inbox & Submissions Log
              </h3>
              <p className="text-[11px] text-[#cfb6b3]">
                Target Email: <strong className="text-[#c97775]">{RECIPIENT_GMAIL}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#cfb6b3] hover:text-[#ffffff] hover:bg-[#421413] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#f2ebe7] border-b border-[#cfb6b3] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('manuscripts')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'manuscripts' 
                  ? 'bg-[#781f1d] text-[#ffffff]' 
                  : 'text-[#421413] hover:bg-[#e5d7d5]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Manuscripts ({manuscripts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'inquiries' 
                  ? 'bg-[#781f1d] text-[#ffffff]' 
                  : 'text-[#421413] hover:bg-[#e5d7d5]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries ({inquiries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('google-forms')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'google-forms' 
                  ? 'bg-[#781f1d] text-[#ffffff]' 
                  : 'text-[#421413] hover:bg-[#e5d7d5]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Google Form / Sheets API</span>
              {googleEndpoint && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'setup' 
                  ? 'bg-[#781f1d] text-[#ffffff]' 
                  : 'text-[#421413] hover:bg-[#e5d7d5]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Delivery Guide</span>
            </button>
          </div>

          {(manuscripts.length > 0 || inquiries.length > 0) && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] hover:bg-[#e9ded8] border border-[#cfb6b3] text-[#421413] rounded-lg text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#781f1d]" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: MANUSCRIPTS */}
          {activeTab === 'manuscripts' && (
            <div>
              {manuscripts.length === 0 ? (
                <div className="py-12 text-center text-[#581e1d]">
                  <FileText className="w-12 h-12 text-[#cfb6b3] mx-auto mb-3" />
                  <p className="font-semibold text-sm">No manuscripts recorded yet</p>
                  <p className="text-xs text-[#781f1d] mt-1">
                    When visitors submit through "Submit Your Manuscript Online", all data is stored here and dispatched to {RECIPIENT_GMAIL}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {manuscripts.map((m) => (
                    <div 
                      key={m.id}
                      className="p-4 bg-[#ffffff] border border-[#cfb6b3] rounded-xl shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#cfb6b3]/60 pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-[#e9ded8] text-[#781f1d] px-2 py-0.5 rounded-sm">
                            {m.id}
                          </span>
                          <h4 className="font-serif font-bold text-[#1f0707] text-base mt-1">
                            {m.title}
                          </h4>
                          <p className="text-xs text-[#581e1d]">
                            By <strong>{m.authorName}</strong> ({m.email}) • {m.affiliation}
                          </p>
                        </div>
                        <span className="text-[11px] text-[#781f1d] self-start sm:self-auto shrink-0 font-medium">
                          {m.timestamp}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#421413]">
                        <div>
                          <strong className="text-[#781f1d]">Category:</strong> {m.articleType}
                        </div>
                        {(m.manuscriptLink || m.fileName) && (
                          <div>
                            <strong className="text-[#781f1d]">Document:</strong>{' '}
                            <span>{m.fileName || 'Cloud Document'}</span>
                            {m.fileSize && (
                              <span className="text-[10px] text-[#781f1d] ml-1">
                                ({formatFileSize(m.fileSize)})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {m.message && (
                        <p className="text-xs text-[#581e1d] bg-[#ffffff] p-2 rounded-lg border border-[#cfb6b3] whitespace-pre-wrap">
                          {m.message}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#cfb6b3]/60">
                        {/* Download Document Button */}
                        {m.fileName && (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const fileRec = await getManuscriptFile(m.id);
                                if (fileRec) {
                                  downloadBlob(fileRec.blob, fileRec.name);
                                } else {
                                  alert(`The manuscript document "${m.fileName}" was attached directly to the email forwarded to ${RECIPIENT_GMAIL}. If this submission originated from an external author browser, please download the attachment directly from that email in your ${RECIPIENT_GMAIL} inbox.`);
                                }
                              } catch {
                                alert(`Please download the attachment from your email inbox at ${RECIPIENT_GMAIL}.`);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold text-xs rounded-lg transition-all shadow-xs"
                            title="Download manuscript document (.docx / .pdf)"
                          >
                            <Download className="w-3.5 h-3.5 text-[#a13533]" />
                            <span>Download Manuscript File</span>
                          </button>
                        )}

                        {m.manuscriptLink && (
                          <a
                            href={m.manuscriptLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] hover:bg-[#e9ded8] border border-[#cfb6b3] text-[#781f1d] hover:text-[#421413] font-bold text-xs rounded-lg transition-all"
                            title="Open Google Drive or Cloud Document"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Cloud Document</span>
                          </a>
                        )}

                        <a
                          href={getManuscriptGmailUrl(m)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#a13533] hover:bg-[#a64d4b] text-[#1f0707] font-bold text-xs rounded-lg transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Push via Gmail</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopyText(`Title: ${m.title}\nAuthor: ${m.authorName} (${m.email})\nAffiliation: ${m.affiliation}\nType: ${m.articleType}\nLink: ${m.manuscriptLink || m.fileName || 'N/A'}\nCover Letter: ${m.message}`, m.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#ffffff] border border-[#cfb6b3] text-[#421413] hover:bg-[#e9ded8] text-xs font-semibold rounded-lg transition-colors"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#781f1d]" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div>
              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-[#581e1d]">
                  <MessageSquare className="w-12 h-12 text-[#cfb6b3] mx-auto mb-3" />
                  <p className="font-semibold text-sm">No editorial inquiries recorded yet</p>
                  <p className="text-xs text-[#781f1d] mt-1">
                    When visitors submit the contact form, inquiries will appear here and be dispatched to {RECIPIENT_GMAIL}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="p-4 bg-[#ffffff] border border-[#cfb6b3] rounded-xl shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#cfb6b3]/60 pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-[#e9ded8] text-[#781f1d] px-2 py-0.5 rounded-sm">
                            {inq.id}
                          </span>
                          <h4 className="font-serif font-bold text-[#1f0707] text-base mt-1">
                            {inq.subject}
                          </h4>
                          <p className="text-xs text-[#581e1d]">
                            From: <strong>{inq.name}</strong> ({inq.email})
                          </p>
                        </div>
                        <span className="text-[11px] text-[#781f1d] self-start sm:self-auto shrink-0 font-medium">
                          {inq.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-[#581e1d] bg-[#ffffff] p-2.5 rounded-lg border border-[#cfb6b3] whitespace-pre-wrap">
                        {inq.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#cfb6b3]/60">
                        <a
                          href={getInquiryGmailUrl(inq)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#a13533] hover:bg-[#a64d4b] text-[#1f0707] font-bold text-xs rounded-lg transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply / Push via Gmail</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopyText(`From: ${inq.name} (${inq.email})\nSubject: ${inq.subject}\nMessage: ${inq.message}`, inq.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#ffffff] border border-[#cfb6b3] text-[#421413] hover:bg-[#e9ded8] text-xs font-semibold rounded-lg transition-colors"
                        >
                          {copiedId === inq.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#781f1d]" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE FORM / SHEETS API INTEGRATION */}
          {activeTab === 'google-forms' && (
            <div className="space-y-6 text-sm text-[#421413]">
              
              {/* Introduction Card */}
              <div className="p-4 sm:p-5 bg-[#ffffff] border border-[#cfb6b3] rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#e9ded8] rounded-lg text-[#781f1d]">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1f0707]">
                        Google Form & Google Sheets API Integration
                      </h4>
                      <p className="text-xs text-[#581e1d]">
                        Push all manuscript data and documents directly into your Google Sheets / Google Drive responses
                      </p>
                    </div>
                  </div>
                  {googleEndpoint ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      Connected & Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shrink-0">
                      Not Configured
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#421413] leading-relaxed">
                  When configured, every manuscript submission automatically sends the author info, article category, manuscript title, and <strong>uploads the attached document file (.docx / .pdf) directly to your Google Drive</strong> while appending a new responsive row to your <strong>Google Sheet</strong>!
                </p>
              </div>

              {/* Endpoint Configuration Input */}
              <div className="p-4 sm:p-5 bg-[#ffffff] border border-[#cfb6b3] rounded-xl space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421413] mb-1">
                    Google Webhook / Apps Script Web App URL *
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="url"
                      value={googleEndpoint}
                      onChange={(e) => setGoogleEndpointState(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec or https://docs.google.com/forms/d/e/.../formResponse"
                      className="flex-1 px-3.5 py-2.5 bg-[#ffffff] border border-[#cfb6b3] rounded-lg text-xs sm:text-sm text-[#1f0707] font-mono focus:ring-2 focus:ring-[#781f1d] focus:outline-hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveEndpoint}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] text-xs font-bold rounded-lg transition-colors shadow-xs shrink-0"
                      >
                        <Save className="w-3.5 h-3.5 text-[#a13533]" />
                        <span>Save Endpoint</span>
                      </button>

                      {googleEndpoint && (
                        <button
                          type="button"
                          onClick={handleClearEndpoint}
                          className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg transition-colors shrink-0"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#781f1d] mt-1.5">
                    Paste your Google Apps Script Web App URL or Google Form response endpoint here.
                  </p>
                </div>

                {saveEndpointSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Google API endpoint saved successfully! All new submissions will push to this URL.</span>
                  </div>
                )}

                {/* Test Connection Button */}
                <div className="pt-2 border-t border-[#cfb6b3]/60 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={!googleEndpoint.trim() || testStatus === 'testing'}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#a13533] hover:bg-[#a64d4b] disabled:opacity-50 text-[#1f0707] text-xs font-bold rounded-lg transition-all shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{testStatus === 'testing' ? 'Pushing Test Submission...' : 'Send Test Submission to Google Sheet / Form'}</span>
                  </button>

                  {testStatus === 'success' && (
                    <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Test payload pushed successfully! Check your Google Sheet / Form responses.
                    </span>
                  )}

                  {testStatus === 'error' && (
                    <span className="text-xs text-red-800 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Unable to push. Ensure the Google Apps Script is deployed as Web App with access set to "Anyone".
                    </span>
                  )}
                </div>
              </div>

              {/* 2-Minute Setup Instructions for Google Drive & Sheets */}
              <div className="p-4 sm:p-5 bg-[#ffffff] border border-[#cfb6b3] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-serif font-bold text-sm sm:text-base text-[#1f0707]">
                      How to Set Up in 2 Minutes (Receives Both Document & Form Data)
                    </h5>
                    <p className="text-xs text-[#581e1d]">
                      Follow these 3 quick steps in Google Sheets to receive live responsive submissions and documents:
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] text-xs font-bold rounded-lg transition-colors shadow-xs shrink-0"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#a13533]" />
                        <span>Copy Apps Script</span>
                      </>
                    )}
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-[#421413]">
                  <li>
                    Create a new spreadsheet at <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-[#781f1d] underline font-bold">sheets.new</a> (or use your existing Google Form Responses sheet).
                  </li>
                  <li>
                    In the top menu, click <strong>Extensions</strong> → <strong>Apps Script</strong>.
                  </li>
                  <li>
                    Delete any code there, paste the code provided below, and click <strong>Save</strong> (disk icon).
                  </li>
                  <li>
                    Click <strong>Deploy</strong> (top right blue button) → <strong>New deployment</strong>.
                  </li>
                  <li>
                    Click the gear icon next to "Select type" and select <strong>Web app</strong>.
                  </li>
                  <li>
                    Set <strong>Execute as:</strong> <em>Me</em>, and set <strong>Who has access:</strong> to <strong className="text-[#781f1d]">Anyone</strong> (required so public authors can submit).
                  </li>
                  <li>
                    Click <strong>Deploy</strong>, authorize permissions, and copy the <strong>Web app URL</strong> into the field above!
                  </li>
                </ol>

                {/* Ready-to-copy code block */}
                <div className="relative">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#1f0707] text-[#cfb6b3] rounded-t-lg text-xs font-mono">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-[#a13533]" />
                      Google Apps Script Code (Code.gs)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="text-xs text-[#a13533] hover:text-[#ffffff] font-bold"
                    >
                      {copiedScript ? 'Copied to clipboard ✓' : 'Click to Copy'}
                    </button>
                  </div>
                  <pre className="p-3.5 bg-[#200a0a] text-[#e9ded8] text-[11px] sm:text-xs font-mono rounded-b-lg overflow-x-auto max-h-56">
{`function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission ID", "Timestamp", "Author Name", "Email", 
        "Affiliation", "Category", "Manuscript Title", 
        "Document Link (Google Drive)", "Cloud Link", "Cover Letter"
      ]);
    }
    
    var fileUrl = "No file attached";
    if (data.fileData && data.fileData.base64) {
      var decoded = Utilities.base64Decode(data.fileData.base64);
      var blob = Utilities.newBlob(decoded, data.fileData.type, data.fileData.name);
      var file = DriveApp.createFile(blob);
      fileUrl = file.getUrl();
    }
    
    sheet.appendRow([
      data.submissionId || "",
      data.timestamp || new Date().toLocaleString(),
      data.authorName || "",
      data.email || "",
      data.affiliation || "",
      data.articleType || "",
      data.title || "",
      fileUrl,
      data.manuscriptLink || "",
      data.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", documentUrl: fileUrl }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}
                  </pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: EMAIL DELIVERY SETUP & ACTIVATION */}
          {activeTab === 'setup' && (
            <div className="space-y-5 text-sm text-[#421413]">
              
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Why isn't email pushing automatically into your inbox?</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  The automated form forwarder (FormSubmit) requires a <strong>one-time activation</strong> for every new email address. 
                  Until you click the activation link sent to <strong className="text-amber-950">{RECIPIENT_GMAIL}</strong>, FormSubmit holds all submissions to prevent spam.
                </p>
              </div>

              <div className="p-5 bg-[#ffffff] border border-[#cfb6b3] rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-base text-[#1f0707]">
                  Step 1: Check your Gmail ({RECIPIENT_GMAIL}) for the Activation Email
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[#581e1d]">
                  <li>
                    Open <strong>{RECIPIENT_GMAIL}</strong> in your email app or browser.
                  </li>
                  <li>
                    Check your <strong>Inbox</strong>, and importantly, your <strong>Spam / Junk</strong> folder or <strong>Updates</strong> tab.
                  </li>
                  <li>
                    Look for an email from <strong>FormSubmit</strong> with subject: <em>"Action Required: Activate your form"</em>.
                  </li>
                  <li>
                    Click the <strong>"Activate Form"</strong> button inside that email.
                  </li>
                  <li>
                    Once activated, all future manuscript submissions and inquiries will arrive instantly in your inbox!
                  </li>
                </ol>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSendActivationPing}
                    disabled={activationStatus === 'sending'}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1f0707] hover:bg-[#421413] disabled:opacity-50 text-[#ffffff] text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${activationStatus === 'sending' ? 'animate-spin' : ''}`} />
                    <span>{activationStatus === 'sending' ? 'Sending Activation Ping...' : `Resend Activation Email to ${RECIPIENT_GMAIL}`}</span>
                  </button>

                  {activationStatus === 'sent' && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Activation email dispatched! Check your Gmail now.
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 bg-[#ffffff] border border-[#cfb6b3] rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-base text-[#1f0707]">
                  Step 2: Instant Delivery via Gmail (No Activation Needed)
                </h4>
                <p className="text-xs text-[#581e1d] leading-relaxed">
                  Both forms now include an instant <strong>"Open in Gmail to Send Now"</strong> button. 
                  Clicking it opens your Gmail composer pre-filled with all manuscript and inquiry details addressed directly to <strong>{RECIPIENT_GMAIL}</strong>, allowing 100% guaranteed delivery from your own email account.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f2ebe7] border-t border-[#cfb6b3] flex items-center justify-between text-xs text-[#581e1d]">
          <span>
            Target Address: <strong className="text-[#1f0707]">{RECIPIENT_GMAIL}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1f0707] hover:bg-[#421413] text-[#ffffff] font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
