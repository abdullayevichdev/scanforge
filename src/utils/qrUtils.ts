import { jsPDF } from 'jspdf';
import { 
  WIFIConfig, 
  SMSConfig, 
  EmailConfig, 
  VCardConfig, 
  WhatsAppConfig, 
  TelegramConfig, 
  InstagramConfig, 
  LocationConfig, 
  EventConfig 
} from '../types';

/**
 * Formats a Wi-Fi network configuration into the official QR code standard string.
 */
export function formatWifiString(config: WIFIConfig): string {
  const { ssid, password, security, hidden } = config;
  const escapedSsid = escapeWifiField(ssid);
  const escapedPassword = password ? escapeWifiField(password) : '';
  const hiddenFlag = hidden ? 'H:true;' : '';
  
  if (security === 'nopass') {
    return `WIFI:S:${escapedSsid};T:nopass;${hiddenFlag};`;
  }
  return `WIFI:S:${escapedSsid};T:${security};P:${escapedPassword};${hiddenFlag};`;
}

function escapeWifiField(val: string): string {
  return val.replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/:/g, '\\:');
}

/**
 * Formats an SMS configuration into standard SMSTO format.
 */
export function formatSMSString(config: SMSConfig): string {
  const { phone, message } = config;
  return `SMSTO:${phone.trim()}:${message || ''}`;
}

/**
 * Formats an email configuration into standard mailto format.
 */
export function formatEmailString(config: EmailConfig): string {
  const { email, subject, body } = config;
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  
  const query = parts.length > 0 ? `?${parts.join('&')}` : '';
  return `mailto:${email.trim()}${query}`;
}

/**
 * Formats contact details into standard vCard 3.0 format.
 */
export function formatVCardString(config: VCardConfig): string {
  const { firstName, lastName, organization, title, phone, email, address, url } = config;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName || ''};${firstName || ''};;;`,
    `FN:${firstName || ''} ${lastName || ''}`.trim(),
  ];
  
  if (organization) lines.push(`ORG:${organization}`);
  if (title) lines.push(`TITLE:${title}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
  if (address) lines.push(`ADR:;;${address};;;;`);
  if (url) lines.push(`URL:${url}`);
  
  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Formats WhatsApp direct chat URL.
 */
export function formatWhatsAppString(config: WhatsAppConfig): string {
  // Clean phone number: remove spaces, +, dashes
  const cleanPhone = config.phone.replace(/[^0-9]/g, '');
  if (!cleanPhone) return '';
  const textQuery = config.message ? `?text=${encodeURIComponent(config.message)}` : '';
  return `https://wa.me/${cleanPhone}${textQuery}`;
}

/**
 * Formats Telegram user or channel link.
 */
export function formatTelegramString(config: TelegramConfig): string {
  let user = config.username.trim();
  if (user.startsWith('@')) user = user.substring(1);
  if (user.startsWith('https://t.me/')) return user;
  return `https://t.me/${user}`;
}

/**
 * Formats Instagram profile link.
 */
export function formatInstagramString(config: InstagramConfig): string {
  let user = config.username.trim();
  if (user.startsWith('@')) user = user.substring(1);
  if (user.startsWith('https://instagram.com/')) return user;
  return `https://instagram.com/${user}`;
}

/**
 * Formats geographical location or maps link.
 */
export function formatLocationString(config: LocationConfig): string {
  if (config.query && config.query.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.query.trim())}`;
  }
  const lat = config.latitude.trim();
  const lng = config.longitude.trim();
  if (lat && lng) {
    return `https://maps.google.com/?q=${lat},${lng}`;
  }
  return '';
}

/**
 * Formats calendar event into standard iCalendar VEVENT standard.
 */
export function formatEventString(config: EventConfig): string {
  const { title, startDate, startTime, endDate, endTime, location, description } = config;
  
  // Format date-time YYYYMMDDTHHmmSS
  const formatDT = (d: string, t?: string) => {
    if (!d) return '';
    const cleanDate = d.replace(/-/g, '');
    const cleanTime = (t || '09:00').replace(/:/g, '') + '00';
    return `${cleanDate}T${cleanTime}`;
  };

  const dtStart = formatDT(startDate, startTime);
  const dtEnd = formatDT(endDate || startDate, endTime || '10:00');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ScanForge//QR Calendar Event//UZ',
    'BEGIN:VEVENT',
    `SUMMARY:${title || 'ScanForge Event'}`,
  ];

  if (dtStart) lines.push(`DTSTART:${dtStart}`);
  if (dtEnd) lines.push(`DTEND:${dtEnd}`);
  if (location) lines.push(`LOCATION:${location}`);
  if (description) lines.push(`DESCRIPTION:${description}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\n');
}

/**
 * Converts Hex string to RGB numbers.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 19, g: 42, b: 134 }; // Fallback navy
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Computes standard WCAG relative luminance.
 */
export function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG contrast ratio (1:1 to 21:1) between two hex colors.
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  try {
    const lum1 = getRelativeLuminance(hexToRgb(color1));
    const lum2 = getRelativeLuminance(hexToRgb(color2));
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
  } catch {
    return 7.0;
  }
}

/**
 * Renders an SVG element to a Canvas object at the specified resolution.
 */
function svgToCanvas(svgElementId: string, resolution: number, backgroundColor?: string): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    const svg = document.getElementById(svgElementId);
    if (!svg) {
      console.error(`svgToCanvas: element with id "${svgElementId}" not found`);
      resolve(null);
      return;
    }

    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

    // Calculate aspect ratio from viewBox
    const viewBoxAttr = svg.getAttribute('viewBox');
    let vbWidth = 360;
    let vbHeight = 360;
    if (viewBoxAttr) {
      const parts = viewBoxAttr.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        vbWidth = parts[2];
        vbHeight = parts[3];
      }
    }
    const aspect = vbHeight / vbWidth;
    const canvasWidth = resolution;
    const canvasHeight = Math.round(resolution * aspect);

    clonedSvg.setAttribute('width', canvasWidth.toString());
    clonedSvg.setAttribute('height', canvasHeight.toString());

    if (!clonedSvg.getAttribute('xmlns')) {
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    if (!clonedSvg.getAttribute('xmlns:xlink')) {
      clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    }

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = window.URL.createObjectURL(svgBlob);

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        window.URL.revokeObjectURL(blobURL);
        resolve(null);
        return;
      }

      if (backgroundColor && backgroundColor !== 'transparent') {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      window.URL.revokeObjectURL(blobURL);
      resolve(canvas);
    };

    image.onerror = (err) => {
      console.error('Image rendering from SVG failed:', err);
      window.URL.revokeObjectURL(blobURL);
      resolve(null);
    };

    image.src = blobURL;
  });
}

/**
 * Downloads QR Code as PNG at exact requested resolution (Standard, HD, 2K, 4K, 8K).
 */
export async function downloadQRAsPNG(
  svgElementId: string, 
  filename: string, 
  resolution: number = 1024,
  backgroundColor?: string
): Promise<boolean> {
  const canvas = await svgToCanvas(svgElementId, resolution, backgroundColor);
  if (!canvas) return false;

  try {
    const pngURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngURL;
    downloadLink.download = `${filename}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    return true;
  } catch (err) {
    console.error('PNG download error:', err);
    return false;
  }
}

/**
 * Downloads QR Code as JPG at exact resolution with solid background (JPG doesn't support transparency).
 */
export async function downloadQRAsJPG(
  svgElementId: string, 
  filename: string, 
  resolution: number = 1024,
  backgroundColor: string = '#FFFFFF'
): Promise<boolean> {
  const bg = (!backgroundColor || backgroundColor === 'transparent') ? '#FFFFFF' : backgroundColor;
  const canvas = await svgToCanvas(svgElementId, resolution, bg);
  if (!canvas) return false;

  try {
    const jpgURL = canvas.toDataURL('image/jpeg', 0.98);
    const downloadLink = document.createElement('a');
    downloadLink.href = jpgURL;
    downloadLink.download = `${filename}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    return true;
  } catch (err) {
    console.error('JPG download error:', err);
    return false;
  }
}

/**
 * Downloads QR Code as a professional high-resolution PDF document using jsPDF.
 */
export async function downloadQRAsPDF(
  svgElementId: string, 
  filename: string, 
  resolution: number = 2048,
  backgroundColor: string = '#FFFFFF'
): Promise<boolean> {
  const bg = (!backgroundColor || backgroundColor === 'transparent') ? '#FFFFFF' : backgroundColor;
  const canvas = await svgToCanvas(svgElementId, resolution, bg);
  if (!canvas) return false;

  try {
    const imgData = canvas.toDataURL('image/png');
    // Create A4 PDF (210 x 297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Center QR code on page with correct aspect ratio
    const canvasAspect = canvas.height / canvas.width;
    const qrWidth = 140;
    const qrHeight = qrWidth * canvasAspect;
    const qrX = (pageWidth - qrWidth) / 2;
    const qrY = (pageHeight - qrHeight) / 2 - 5;

    // Background accent card
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(qrX - 10, qrY - 10, qrWidth + 20, qrHeight + 20, 8, 8, 'F');

    // Embed QR code image
    pdf.addImage(imgData, 'PNG', qrX, qrY, qrWidth, qrHeight);

    // Header title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(19, 42, 134); // #132A86
    pdf.text('ScanForge QR Code', pageWidth / 2, qrY - 18, { align: 'center' });

    // Footer domain / tagline
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(74, 87, 125);
    pdf.text('Generated with ScanForge • scanforge.uz • High Print Resolution', pageWidth / 2, qrY + qrHeight + 14, { align: 'center' });

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  }
}

/**
 * Directly downloads raw SVG as vector format.
 */
export function downloadQRAsSVG(svgElementId: string, filename: string, size: number = 1024): boolean {
  const svg = document.getElementById(svgElementId);
  if (!svg) {
    console.error('SVG element not found for SVG download');
    return false;
  }

  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  const viewBoxAttr = svg.getAttribute('viewBox');
  let vbWidth = 360;
  let vbHeight = 360;
  if (viewBoxAttr) {
    const parts = viewBoxAttr.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      vbWidth = parts[2];
      vbHeight = parts[3];
    }
  }
  const aspect = vbHeight / vbWidth;
  clonedSvg.setAttribute('width', size.toString());
  clonedSvg.setAttribute('height', Math.round(size * aspect).toString());

  if (!clonedSvg.getAttribute('xmlns')) {
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!clonedSvg.getAttribute('xmlns:xlink')) {
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }

  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const blobURL = window.URL.createObjectURL(svgBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = blobURL;
  downloadLink.download = `${filename}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(blobURL);
  return true;
}

/**
 * Copies the QR code as a PNG image directly to clipboard.
 */
export async function copyQRToClipboard(svgElementId: string): Promise<boolean> {
  const canvas = await svgToCanvas(svgElementId, 1024, '#FFFFFF');
  if (!canvas) return false;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        resolve(true);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        resolve(false);
      }
    }, 'image/png');
  });
}
