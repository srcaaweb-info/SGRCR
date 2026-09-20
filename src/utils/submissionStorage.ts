export interface StoredManuscript {
  id: string;
  authorName: string;
  email: string;
  affiliation: string;
  articleType: string;
  title: string;
  manuscriptLink?: string;
  fileName?: string;
  fileSize?: number;
  hasAttachment?: boolean;
  message?: string;
  timestamp: string;
  forwardStatus?: 'forwarded' | 'pending' | 'manual';
}

export interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  forwardStatus?: 'forwarded' | 'pending' | 'manual';
}

const MANUSCRIPTS_KEY = 'sgrcr_manuscript_submissions';
const INQUIRIES_KEY = 'sgrcr_editorial_inquiries';
const DB_NAME = 'SGRCR_Editorial_Files_DB';
const DB_STORE = 'manuscript_files';
const DB_VERSION = 1;

// IndexedDB Helper for Storing Large Files (DOCX, PDF)
function openFilesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in this environment'));
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveManuscriptFile(id: string, file: File): Promise<void> {
  try {
    const db = await openFilesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      const record = {
        id,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        blob: file,
        savedAt: new Date().toISOString(),
      };
      const putReq = store.put(record);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    console.warn('Could not cache file into IndexedDB:', err);
  }
}

export async function getManuscriptFile(id: string): Promise<{ blob: Blob; name: string; type: string } | null> {
  try {
    const db = await openFilesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        if (getReq.result) {
          resolve({
            blob: getReq.result.blob,
            name: getReq.result.name,
            type: getReq.result.type,
          });
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch {
    return null;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadTextFile(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, filename);
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function saveManuscriptSubmission(data: Omit<StoredManuscript, 'id'>, file?: File | null): StoredManuscript {
  const item: StoredManuscript = {
    ...data,
    id: 'MS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    fileSize: file ? file.size : data.fileSize,
    hasAttachment: !!file || data.hasAttachment,
  };

  try {
    const existing = getManuscriptSubmissions();
    existing.unshift(item);
    localStorage.setItem(MANUSCRIPTS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('sgrcr-storage-update'));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }

  // If a file object was passed, persist in IndexedDB
  if (file) {
    saveManuscriptFile(item.id, file).catch(console.warn);
  }

  return item;
}

export function getManuscriptSubmissions(): StoredManuscript[] {
  try {
    const raw = localStorage.getItem(MANUSCRIPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEditorialInquiry(data: Omit<StoredInquiry, 'id'>): StoredInquiry {
  const item: StoredInquiry = {
    ...data,
    id: 'INQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
  };

  try {
    const existing = getEditorialInquiries();
    existing.unshift(item);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('sgrcr-storage-update'));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }

  return item;
}

export function getEditorialInquiries(): StoredInquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ==========================================
// Google Form / Sheets / Drive API Integration
// ==========================================
const GOOGLE_FORM_ENDPOINT_KEY = 'sgrcr_google_form_endpoint';
const GOOGLE_FORM_FIELD_MAP_KEY = 'sgrcr_google_form_field_map';
const GOOGLE_DRIVE_FOLDER_KEY = 'sgrcr_google_drive_folder_url';

export const DEFAULT_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/u/0/my-drive';

export function getGoogleDriveFolderUrl(): string {
  try {
    return localStorage.getItem(GOOGLE_DRIVE_FOLDER_KEY) || DEFAULT_DRIVE_FOLDER_URL;
  } catch {
    return DEFAULT_DRIVE_FOLDER_URL;
  }
}

export function setGoogleDriveFolderUrl(url: string): void {
  try {
    localStorage.setItem(GOOGLE_DRIVE_FOLDER_KEY, url.trim());
    window.dispatchEvent(new CustomEvent('sgrcr-storage-update'));
  } catch (err) {
    console.warn('Failed to save Google Drive folder URL:', err);
  }
}

export interface GoogleFormFieldMap {
  authorName?: string;
  email?: string;
  affiliation?: string;
  articleType?: string;
  title?: string;
  manuscriptLink?: string;
  message?: string;
}

export function getGoogleFormEndpoint(): string {
  try {
    return localStorage.getItem(GOOGLE_FORM_ENDPOINT_KEY) || '';
  } catch {
    return '';
  }
}

export function setGoogleFormEndpoint(url: string): void {
  try {
    localStorage.setItem(GOOGLE_FORM_ENDPOINT_KEY, url.trim());
    window.dispatchEvent(new CustomEvent('sgrcr-storage-update'));
  } catch (err) {
    console.warn('Failed to save Google Form endpoint:', err);
  }
}

export function getGoogleFormFieldMap(): GoogleFormFieldMap {
  try {
    const raw = localStorage.getItem(GOOGLE_FORM_FIELD_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setGoogleFormFieldMap(map: GoogleFormFieldMap): void {
  try {
    localStorage.setItem(GOOGLE_FORM_FIELD_MAP_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to save field map:', err);
  }
}

export function fileToBase64(file: File): Promise<{ base64: string; name: string; type: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] || '';
      resolve({
        base64: base64Data,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Pushes manuscript data and optional attached document directly to a Google Apps Script Web App
 * or Google Forms response endpoint.
 */
export async function pushToGoogleEndpoint(
  endpointUrl: string, 
  payload: {
    submissionId: string;
    authorName: string;
    email: string;
    affiliation: string;
    articleType: string;
    title: string;
    manuscriptLink?: string;
    message?: string;
    timestamp: string;
    fileData?: { base64: string; name: string; type: string; size: number } | null;
  }
): Promise<boolean> {
  const cleanUrl = endpointUrl.trim();
  if (!cleanUrl) return false;

  try {
    // If it's a standard Google Form formResponse endpoint:
    if (cleanUrl.includes('docs.google.com/forms')) {
      const formBody = new URLSearchParams();
      // If user configured custom entry IDs:
      const fieldMap = getGoogleFormFieldMap();
      if (fieldMap.authorName) formBody.append(fieldMap.authorName, payload.authorName);
      if (fieldMap.email) formBody.append(fieldMap.email, payload.email);
      if (fieldMap.affiliation) formBody.append(fieldMap.affiliation, payload.affiliation);
      if (fieldMap.articleType) formBody.append(fieldMap.articleType, payload.articleType);
      if (fieldMap.title) formBody.append(fieldMap.title, payload.title);
      if (fieldMap.manuscriptLink) formBody.append(fieldMap.manuscriptLink, payload.manuscriptLink || payload.fileData?.name || '');
      if (fieldMap.message) formBody.append(fieldMap.message, payload.message || '');

      await fetch(cleanUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });
      return true;
    }

    // Default & Recommended: Google Apps Script Web App Endpoint
    // (Accepts JSON + base64 file to automatically upload document to Google Drive and append row to Google Sheets)
    await fetch(cleanUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        source: 'SGRCR Journal Portal',
        ...payload,
        submittedAt: payload.timestamp,
      }),
    });
    return true;
  } catch (err) {
    console.warn('Error pushing to Google endpoint:', err);
    return false;
  }
}
