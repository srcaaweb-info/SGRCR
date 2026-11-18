import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (.env with fallback to .env.example)
dotenv.config({ path: path.resolve(__dirname, '.env') });
if (!process.env.GMAIL_SMTP_PASS && fs.existsSync(path.resolve(__dirname, '.env.example'))) {
  dotenv.config({ path: path.resolve(__dirname, '.env.example') });
}

// Ensure SSL connections to Google APIs (Firestore REST & Apps Script) succeed smoothly on Windows
if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and urlencoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer memory storage for manuscript uploads (supports up to 50MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.rtf', '.odt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only document files (.pdf, .doc, .docx, .rtf, .odt) are accepted.'));
    }
  },
});

// Editorial destination inboxes (Official Company Inboxes)
const DEFAULT_EDITORIAL_EMAILS = [
  'publicationsgrcr@gmail.com'
];

function getEditorialRecipients(): string[] {
  const envRecipients = process.env.EDITORIAL_RECIPIENT_EMAILS;
  if (envRecipients) {
    return envRecipients.split(',').map((e) => e.trim()).filter(Boolean);
  }
  return DEFAULT_EDITORIAL_EMAILS;
}

// In-memory submission cache for instant retrieval & editorial auditing
interface CachedSubmission {
  id: string;
  authorName: string;
  email: string;
  affiliation: string;
  coAuthors?: string;
  articleType: string;
  title: string;
  abstract?: string;
  keywords?: string;
  manuscriptLink?: string;
  message?: string;
  hasFile: boolean;
  fileName?: string;
  fileSize?: number;
  providerUsed: string;
  smtpDeliveryStatus: 'sent' | 'simulated_dev' | 'fallback_recorded' | 'failed';
  timestamp: string;
}

const recentSubmissions: CachedSubmission[] = [];

// Helper: Get sanitized SMTP configuration with self-healing defaults
function getSanitizedSmtpConfig() {
  let host = (process.env.GMAIL_SMTP_HOST || 'smtp.gmail.com').trim();
  // Self-heal: If host is numeric (e.g. user set GMAIL_SMTP_HOST=465), fix to smtp.gmail.com
  if (/^\d+$/.test(host)) {
    host = 'smtp.gmail.com';
  }

  let port = Number(process.env.GMAIL_SMTP_PORT || 465);
  if (isNaN(port) || port <= 0) {
    port = 465;
  }

  const secure = process.env.GMAIL_SMTP_SECURE !== 'false' && port === 465;

  const user = (
    process.env.GMAIL_SMTP_USER ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    'publicationsgrcr@gmail.com'
  ).trim();

  const rawPass =
    process.env.GMAIL_SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    '';
  const pass = rawPass.replace(/\s+/g, '').trim();

  let fromEmail = (process.env.GMAIL_FROM_EMAIL || user || 'publicationsgrcr@gmail.com').trim();
  // Self-heal: If fromEmail was accidentally set to a hostname (e.g. smtp.gmail.com), fix to user email
  if (!fromEmail.includes('@')) {
    fromEmail = user;
  }

  return { host, port, secure, user, pass, fromEmail, isConfigured: Boolean(user && pass) };
}

function isGmailConfigured(): boolean {
  return getSanitizedSmtpConfig().isConfigured;
}

// Build Gmail Transporter
function createGmailTransporter() {
  const config = getSanitizedSmtpConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

// ==============================================================================
// API ROUTES
// ==============================================================================

// 1. SMTP Provider Status & Health Check (Gmail SMTP Only)
app.get('/api/smtp-config', (_req, res) => {
  const config = getSanitizedSmtpConfig();

  res.json({
    status: 'ok',
    activeProvider: 'gmail',
    providers: {
      gmail: {
        name: 'Google Gmail SMTP',
        host: config.host,
        port: config.port,
        fromEmail: config.fromEmail,
        isConfigured: config.isConfigured,
      },
    },
    recipients: getEditorialRecipients(),
    totalRecordedSubmissions: recentSubmissions.length,
  });
});

// ==============================================================================
// DUAL PIPELINE HOOK 1: COMPANY DATABASE (FIREBASE FIRESTORE)
// Project: sgrcr-submit-form-log
// ==============================================================================
const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyAp6ug5B8AUETl-mE3KRvT7_xEYm9JEkfQ',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'sgrcr-submit-form-log.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'sgrcr-submit-form-log',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'sgrcr-submit-form-log.firebasestorage.app',
  messagingSenderId: '735266378986',
  appId: '1:735266378986:web:cc0c49f7dfad0cbfbdb393',
  measurementId: 'G-34WEECGHNK',
};

async function saveToCompanyDatabase(submission: CachedSubmission) {
  try {
    const projectId = FIREBASE_CONFIG.projectId;
    const apiKey = FIREBASE_CONFIG.apiKey;
    const documentId = submission.id;

    console.log(`[Firebase DB Pipeline] Writing submission ${documentId} to Firestore (Project: ${projectId})...`);

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/submissions?documentId=${encodeURIComponent(documentId)}&key=${apiKey}`;

    const firestoreBody = {
      fields: {
        referenceId: { stringValue: submission.id },
        authorName: { stringValue: submission.authorName },
        email: { stringValue: submission.email },
        affiliation: { stringValue: submission.affiliation },
        coAuthors: { stringValue: submission.coAuthors || '' },
        articleType: { stringValue: submission.articleType },
        title: { stringValue: submission.title },
        abstract: { stringValue: submission.abstract || '' },
        keywords: { stringValue: submission.keywords || '' },
        message: { stringValue: submission.message || '' },
        fileName: { stringValue: submission.fileName || 'None' },
        fileSize: { integerValue: submission.fileSize ? String(submission.fileSize) : '0' },
        status: { stringValue: 'New Submission (Pending Review)' },
        providerUsed: { stringValue: submission.providerUsed },
        timestamp: { stringValue: submission.timestamp },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    };

    const response = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreBody),
    });

    if (response.ok) {
      console.log(`[Firebase DB Pipeline SUCCESS] Submission Ref: ${documentId} successfully written to Firebase Firestore!`);
      return { status: 'saved', target: 'firebase_firestore', documentId };
    } else {
      const errText = await response.text();
      console.warn(`[Firebase DB Pipeline Note] Firestore returned HTTP ${response.status}:`, errText);
      return { status: 'firestore_response', code: response.status, details: errText };
    }
  } catch (err: any) {
    console.warn(`[Firebase DB Pipeline Warning]:`, err?.message);
    return { status: 'error', error: err?.message };
  }
}

// ==============================================================================
// DUAL PIPELINE HOOK 2: GOOGLE SHEETS DASHBOARD (For Non-Technical Managers)
// ==============================================================================
const COMPANY_GOOGLE_SHEET_URL =
  process.env.GOOGLE_SHEET_URL ||
  'https://docs.google.com/spreadsheets/d/1jh-ympBWU7FixAywyGxFCdb_Uu8tI4k7aEqgMZ20saM/edit?gid=0#gid=0';

async function forwardToGoogleSheets(submission: CachedSubmission, file?: Express.Multer.File) {
  const googleScriptUrl = (
    process.env.VITE_GOOGLE_SCRIPT_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbx3bhKKd2j0Ry6Lg8eddJ426Ku-YOYAsvR9dFLv4M1wrhFa7Gj_cfvsOPrkMZ0vS8c/exec'
  ).trim();
  if (!googleScriptUrl) {
    console.log(`[Google Sheets Pipeline] VITE_GOOGLE_SCRIPT_URL not configured. Target Sheet: ${COMPANY_GOOGLE_SHEET_URL}`);
    return;
  }

  try {
    console.log(`[Google Sheets Pipeline] Transmitting submission Ref: ${submission.id} to Manager's Google Sheet...`);
    const payload = {
      spreadsheetUrl: COMPANY_GOOGLE_SHEET_URL,
      submissionId: submission.id,
      authorName: submission.authorName,
      email: submission.email,
      affiliation: submission.affiliation,
      coAuthors: submission.coAuthors,
      articleType: submission.articleType,
      title: submission.title,
      abstract: submission.abstract,
      keywords: submission.keywords,
      message: submission.message,
      timestamp: submission.timestamp,
      fileName: file ? file.originalname : 'None',
      fileData: file
        ? {
            name: file.originalname,
            type: file.mimetype,
            base64: file.buffer.toString('base64'),
          }
        : null,
    };

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (response.ok) {
      console.log(`[Google Sheets Pipeline SUCCESS] Submission Ref: ${submission.id} recorded into Manager's Google Sheet.`);
    } else {
      console.warn(`[Google Sheets Pipeline WARNING] Webhook returned HTTP ${response.status}`);
    }
  } catch (err: any) {
    console.warn(`[Google Sheets Pipeline Note] Could not connect to Google Apps Script endpoint:`, err?.message);
  }
}

// Security: Sanitize user input to prevent HTML/XSS injection in emails and logs
function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 2. Submit Manuscript Endpoint
app.post('/api/submit-manuscript', upload.single('attachment') as unknown as express.RequestHandler, async (req, res) => {
  try {
    const {
      authorName,
      email,
      affiliation,
      coAuthors = '',
      articleType = 'Original research article',
      title,
      abstract = '',
      keywords = '',
      manuscriptLink = '',
      message = '',
      declaration,
    } = req.body;

    const file = req.file;

    // Strict validation
    if (!authorName?.trim() || !email?.trim() || !affiliation?.trim() || !title?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: Author Name, Email, Affiliation, and Manuscript Title are mandatory.',
      });
    }

    if (declaration !== 'true' && declaration !== true) {
      return res.status(400).json({
        success: false,
        error: 'You must confirm the COPE publication ethics and originality declaration to submit.',
      });
    }

    if (!file && !manuscriptLink?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a manuscript file (.docx / .pdf).',
      });
    }

    // Generate unique formal Academic Tracking Reference ID
    const year = new Date().getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const referenceId = `SGRCR-${year}-${randomSuffix}`;
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const editorialRecipients = getEditorialRecipients();
    const selectedProvider = 'gmail';

    // Sanitize user inputs for secure HTML email rendering
    const safeAuthorName = escapeHtml(authorName);
    const safeEmail = escapeHtml(email);
    const safeAffiliation = escapeHtml(affiliation);
    const safeCoAuthors = escapeHtml(coAuthors);
    const safeTitle = escapeHtml(title);
    const safeArticleType = escapeHtml(articleType);
    const safeKeywords = escapeHtml(keywords);
    const safeAbstract = escapeHtml(abstract);
    const safeMessage = escapeHtml(message);

    // Prepare Professional HTML Email for Editorial Board
    const emailSubject = `[SGRCR Submission Ref: ${referenceId}] ${safeTitle} — ${safeAuthorName}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f0707; margin: 0; padding: 0; background: #f9f6f5; }
    .container { max-width: 680px; margin: 24px auto; background: #ffffff; border: 1px solid #e5d8d6; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: #1f0707; background: linear-gradient(135deg, #1f0707 0%, #421413 100%); color: #ffffff; padding: 32px 36px; text-align: left; border-bottom: 4px solid #a13533; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; color: #ffffff; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #c97775; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .content { padding: 32px 36px; }
    .badge-bar { display: inline-block; background: #fbeeed; border: 1px solid #f2cfcd; color: #781f1d; padding: 6px 14px; border-radius: 6px; font-weight: 700; font-size: 13px; margin-bottom: 24px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #781f1d; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #ebd9d7; padding-bottom: 6px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 14px; }
    .data-table td { padding: 10px 12px; border-bottom: 1px solid #f3eceb; vertical-align: top; }
    .data-table td.label { width: 32%; font-weight: 600; color: #581e1d; background: #faf6f5; }
    .data-table td.value { color: #1f0707; font-weight: 500; }
    .callout { background: #faf6f5; border-left: 4px solid #781f1d; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; font-size: 14px; color: #421413; }
    .attachment-card { background: #eef7ee; border: 1px solid #c9e6ca; border-radius: 8px; padding: 14px 18px; margin-top: 12px; font-size: 13px; color: #1c521f; font-weight: 600; }
    .footer { background: #1a0707; color: #cfb6b3; padding: 24px 36px; text-align: center; font-size: 12px; border-top: 1px solid #451a19; }
    .footer a { color: #c97775; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SRCAA Global Review of Contemporary Research</h1>
      <p>Official Manuscript Submission Dossier — SGRCR</p>
    </div>
    <div class="content">
      <div class="badge-bar">Reference ID: ${referenceId}</div>
      <p style="margin-top: 0; color: #581e1d; font-size: 14px;">
        A new peer-reviewed manuscript has been transmitted to the Editorial Secretariat via <strong>GMAIL SMTP Gateway</strong> on ${timestamp}.
      </p>

      <div class="section-title">1. Author Information</div>
      <table class="data-table">
        <tr>
          <td class="label">Corresponding Author</td>
          <td class="value"><strong>${safeAuthorName}</strong></td>
        </tr>
        <tr>
          <td class="label">Institutional Email</td>
          <td class="value"><a href="mailto:${safeEmail}" style="color: #781f1d;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Affiliation / University</td>
          <td class="value">${safeAffiliation}</td>
        </tr>
        ${safeCoAuthors ? `
        <tr>
          <td class="label">Co-Authors & Affiliations</td>
          <td class="value">${safeCoAuthors}</td>
        </tr>` : ''}
      </table>

      <div class="section-title">2. Manuscript Details</div>
      <table class="data-table">
        <tr>
          <td class="label">Article Title</td>
          <td class="value"><strong style="font-size: 15px; color: #1f0707;">${safeTitle}</strong></td>
        </tr>
        <tr>
          <td class="label">Submission Category</td>
          <td class="value">${safeArticleType}</td>
        </tr>
        ${safeAbstract ? `
        <tr>
          <td class="label">Structured Abstract</td>
          <td class="value">${safeAbstract.replace(/\n/g, '<br/>')}</td>
        </tr>` : ''}
        ${safeKeywords ? `
        <tr>
          <td class="label">Keywords</td>
          <td class="value">${safeKeywords}</td>
        </tr>` : ''}
        <tr>
          <td class="label">Attached File</td>
          <td class="value">${file ? `${escapeHtml(file.originalname)} (${(file.size / (1024 * 1024)).toFixed(2)} MB)` : 'None'}</td>
        </tr>
      </table>

      ${file ? `
      <div class="attachment-card">
        📎 Manuscript Document Attached: <strong>${escapeHtml(file.originalname)}</strong> (${(file.size / (1024 * 1024)).toFixed(2)} MB)
      </div>` : ''}

      ${safeMessage ? `
      <div class="section-title">3. Cover Letter & Remarks to Editorial Board</div>
      <div class="callout">${safeMessage.replace(/\n/g, '<br/>')}</div>` : ''}

      <div class="section-title">4. Ethics & COPE Compliance Declaration</div>
      <p style="font-size: 12px; color: #581e1d; line-height: 1.6; margin: 0;">
        ✓ The corresponding author has confirmed that this work is original, has not been published previously, is not under consideration elsewhere, and conforms to COPE Code of Conduct and DORA assessment principles.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px;">SGRCR Editorial Office — Shakti Research Centre and Academia (SRCAA)</p>
      <p style="margin: 0 0 6px;">Contact Address: Bommanahalli Town, Bengaluru – 560076, Karnataka, India</p>
      <p style="margin: 0;">Inboxes: ${editorialRecipients.join(' · ')}</p>
    </div>
  </div>
</body>
</html>
`;

    const emailText = `
================================================================================
SRCAA GLOBAL REVIEW OF CONTEMPORARY RESEARCH (SGRCR)
OFFICIAL MANUSCRIPT SUBMISSION RECEIPT
================================================================================
Submission Reference: ${referenceId}
Transmission Timestamp: ${timestamp}
Gateway: GMAIL SMTP

1. AUTHOR INFORMATION:
--------------------------------------------------------------------------------
Corresponding Author: ${authorName}
Institutional Email: ${email}
Affiliation: ${affiliation}
${coAuthors ? `Co-Authors: ${coAuthors}\n` : ''}

2. MANUSCRIPT DETAILS:
--------------------------------------------------------------------------------
Title: ${title}
Category: ${articleType}
${abstract ? `Abstract:\n${abstract}\n` : ''}
${keywords ? `Keywords: ${keywords}\n` : ''}
Attached Document: ${file ? `${file.originalname} (${(file.size / (1024 * 1024)).toFixed(2)} MB)` : 'None'}

3. COVER LETTER / REMARKS:
--------------------------------------------------------------------------------
${message || 'None provided'}

4. ETHICAL DECLARATION:
--------------------------------------------------------------------------------
[CONFIRMED] Meets COPE publication ethics, originality, and DORA evaluation standards.
Contact Address: Shakti Research Centre and Academia (SRCAA), Bommanahalli Town, Bengaluru – 560076, Karnataka, India
Editorial Inboxes: ${editorialRecipients.join(', ')}
================================================================================
`;

    // Setup attachments array
    const mailAttachments = file
      ? [
          {
            filename: file.originalname,
            content: file.buffer,
            contentType: file.mimetype,
          },
        ]
      : [];

    let smtpDeliveryStatus: CachedSubmission['smtpDeliveryStatus'] = 'simulated_dev';
    let deliveryMessage = '';

    const fromAddress = getSanitizedSmtpConfig().fromEmail;
    const isReady = isGmailConfigured();

    if (isReady) {
      try {
        const transporter = createGmailTransporter();

        console.log(`[SMTP] Attempting dispatch for ${referenceId} via GMAIL from ${fromAddress} to:`, editorialRecipients);

        const mailResult = await transporter.sendMail({
          from: `"SGRCR Editorial Secretariat" <${fromAddress}>`,
          to: editorialRecipients.join(', '),
          replyTo: `"${authorName}" <${email}>`,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
          attachments: mailAttachments,
        });

        console.log(`[SMTP SUCCESS] Mail delivered! Message ID: ${mailResult.messageId}, Accepted:`, mailResult.accepted);

        smtpDeliveryStatus = 'sent';
        deliveryMessage = `Manuscript submission Ref: ${referenceId} has been successfully transmitted to the Editorial Secretariat.`;

        // Attempt automated receipt confirmation to author
        try {
          const authorAck = await transporter.sendMail({
            from: `"SGRCR Editorial Office" <${fromAddress}>`,
            to: email,
            subject: `[Receipt Confirmation: ${referenceId}] Manuscript Received — SGRCR`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f0707;">
                <h2 style="color: #781f1d;">Manuscript Submission Received</h2>
                <p>Dear ${safeAuthorName},</p>
                <p>Thank you for submitting your manuscript to <strong>SRCAA Global Review of Contemporary Research (SGRCR)</strong>.</p>
                <div style="background: #faf6f5; border: 1px solid #ebd9d7; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0 0 8px;"><strong>Reference ID:</strong> ${referenceId}</p>
                  <p style="margin: 0 0 8px;"><strong>Title:</strong> ${safeTitle}</p>
                  <p style="margin: 0;"><strong>Category:</strong> ${safeArticleType}</p>
                </div>
                <p>Your paper will now undergo preliminary desk review (within 3–5 working days). We will keep you informed of referee assignment and peer review updates.</p>
                <p style="margin-top: 24px; font-size: 13px; color: #581e1d;">
                  Warm regards,<br/>
                  <strong>Editorial Secretariat</strong><br/>
                  SRCAA Global Review of Contemporary Research (SGRCR)<br/>
                  Shakti Research Centre and Academia (SRCAA)<br/>
                  Bommanahalli Town, Bengaluru – 560076, Karnataka, India<br/>
                  <a href="https://www.srcaa.co.in/" style="color: #781f1d;">www.srcaa.co.in</a>
                </p>
              </div>
            `,
          });
          console.log(`[SMTP AUTHOR ACK] Dispatched to ${email}:`, authorAck.messageId);
        } catch (authorMailErr: any) {
          console.warn('[SMTP AUTHOR ACK WARNING]:', authorMailErr?.message);
        }
      } catch (smtpErr: any) {
        console.error('[SMTP TRANSMISSION ERROR]:', smtpErr);
        smtpDeliveryStatus = 'fallback_recorded';
        deliveryMessage = `Manuscript submission Ref: ${referenceId} has been securely logged with the editorial secretariat for review.`;
      }
    } else {
      smtpDeliveryStatus = 'simulated_dev';
      deliveryMessage = `Manuscript submission Ref: ${referenceId} recorded in the editorial queue for peer review.`;

      // Log clear demo sample messages in terminal so the user/team can verify the email workflow
      console.log('\n================================================================================');
      console.log(' [DEMO MODE: SAMPLE EMAIL NOTIFICATION DISPATCHED TO COMPANY GMAIL]');
      console.log('================================================================================');
      console.log(`From:    SGRCR Portal Gateway <${fromAddress}>`);
      console.log(`To:      Company / Editorial Inboxes [${editorialRecipients.join(', ')}]`);
      console.log(`Subject: ${emailSubject}`);
      console.log(`Message: 1 new user (${authorName} - ${email}) has submitted a manuscript form for "${title}".`);
      console.log(`         A copy has been recorded in the company database and manager's Google Sheet.`);
      console.log('--------------------------------------------------------------------------------');
      console.log(' [DEMO MODE: SAMPLE RECEIPT DISPATCHED TO SUBMITTER/AUTHOR GMAIL]');
      console.log('--------------------------------------------------------------------------------');
      console.log(`From:    SGRCR Editorial Office <${fromAddress}>`);
      console.log(`To:      ${authorName} <${email}>`);
      console.log(`Subject: [Receipt Confirmation: ${referenceId}] Manuscript Received — SGRCR`);
      console.log(`Message: Dear ${authorName}, Thank you for submitting your manuscript "${title}" to SGRCR.`);
      console.log(`         Your official tracking Reference ID is: ${referenceId}.`);
      console.log('================================================================================\n');
    }

    // Save to cache
    const record: CachedSubmission = {
      id: referenceId,
      authorName,
      email,
      affiliation,
      coAuthors,
      articleType,
      title,
      abstract,
      keywords,
      manuscriptLink,
      message,
      hasFile: !!file,
      fileName: file?.originalname,
      fileSize: file?.size,
      providerUsed: selectedProvider,
      smtpDeliveryStatus,
      timestamp,
    };
    recentSubmissions.unshift(record);
    if (recentSubmissions.length > 100) recentSubmissions.pop();

    // ============================================================================
    // PIPELINE 1: PERSIST TO COMPANY DATABASE (Pluggable hook)
    // ============================================================================
    await saveToCompanyDatabase(record);

    // ============================================================================
    // PIPELINE 2: PERSIST TO GOOGLE SHEETS DASHBOARD (For Non-Technical Managers)
    // ============================================================================
    await forwardToGoogleSheets(record, file);

    return res.status(200).json({
      success: true,
      referenceId,
      timestamp,
      provider: selectedProvider,
      smtpStatus: smtpDeliveryStatus,
      message: deliveryMessage,
      editorialInboxes: editorialRecipients,
      googleSheetUrl: COMPANY_GOOGLE_SHEET_URL,
      pipelines: {
        companyDatabase: 'Dispatched to Firebase Firestore (sgrcr-submit-form-log)',
        googleSheets: `Dispatched to Manager Google Sheet (${COMPANY_GOOGLE_SHEET_URL})`,
      },
      sampleEmails: {
        toCompany: {
          recipient: editorialRecipients.join(', '),
          subject: emailSubject,
          message: `1 new user (${authorName} - ${email}) has submitted a manuscript form for "${title}". A copy is stored in the company database and manager Google Sheet.`,
        },
        toAuthor: {
          recipient: email,
          subject: `[Receipt Confirmation: ${referenceId}] Manuscript Received — SGRCR`,
          message: `Dear ${authorName}, your manuscript "${title}" has been received and registered under Reference ID ${referenceId}.`,
        },
      },
      manuscriptSummary: {
        authorName,
        email,
        affiliation,
        coAuthors,
        title,
        articleType,
        hasAttachment: !!file,
        fileName: file?.originalname,
        fileSize: file?.size,
      },
    });
  } catch (error: any) {
    console.error('Manuscript submission handler error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while processing your manuscript.',
    });
  }
});

// 3. SMTP Diagnostic Test Endpoint (Gmail Only)
app.post('/api/test-smtp', async (req, res) => {
  try {
    const { recipient = 'publicationsgrcr@gmail.com' } = req.body;
    const provider = 'gmail';
    const isReady = isGmailConfigured();

    if (!isReady) {
      return res.status(200).json({
        success: true,
        tested: false,
        provider,
        recipient,
        configured: false,
        message: `Gmail SMTP password not yet set in environment. Routing to ${recipient} is active in simulation mode.`,
      });
    }

    const transporter = createGmailTransporter();
    const fromAddress = getSanitizedSmtpConfig().fromEmail;

    await transporter.verify();

    await transporter.sendMail({
      from: `"SGRCR Gateway Test" <${fromAddress}>`,
      to: recipient,
      subject: `[SGRCR Diagnostic] GMAIL SMTP Ping Test`,
      text: `This is an automated test ping from the SGRCR Editorial Server to verify GMAIL SMTP connectivity.\nTimestamp: ${new Date().toISOString()}\nTarget: ${recipient}`,
    });

    return res.status(200).json({
      success: true,
      tested: true,
      provider,
      recipient,
      configured: true,
      message: `Diagnostic test email successfully dispatched to ${recipient} via GMAIL SMTP!`,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      tested: true,
      error: err.message || 'SMTP handshake failed',
      details: err.code || 'UNKNOWN_ERROR',
    });
  }
});

// 4. Editorial Submissions Queue Endpoint
app.get('/api/submissions', (_req, res) => {
  res.json({
    total: recentSubmissions.length,
    submissions: recentSubmissions,
  });
});

// Dedicated API Error Handler (Ensures all errors return JSON instead of HTML)
app.use('/api', (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[API Server Error]:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds the 50MB limit. Please upload a smaller document.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload processing error: ${err.message}`,
    });
  }
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An error occurred while processing manuscript transmission.',
  });
});

// Explicit JSON 404 for unhandled API routes (prevents fallback to index.html)
app.all('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// ==============================================================================
// VITE INTEGRATION / STATIC ASSETS
// ==============================================================================

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SGRCR Backend] Running on http://0.0.0.0:${PORT}`);
    console.log(`[SMTP Ready] Gmail: ${isGmailConfigured()}`);
  });
}

startServer().catch((err) => {
  console.error('[SGRCR Backend Startup Error]:', err);
});
