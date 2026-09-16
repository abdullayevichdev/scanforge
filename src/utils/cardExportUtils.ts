import { jsPDF } from 'jspdf';

/**
 * Downloads a canvas element as PNG or JPG.
 */
export function downloadCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'png' | 'jpg' = 'png',
  quality = 0.95
): boolean {
  try {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Error downloading canvas as image:', err);
    return false;
  }
}

/**
 * Downloads a canvas element as a high-quality PDF.
 */
export function downloadCanvasAsPDF(
  canvas: HTMLCanvasElement,
  filename: string,
  options: {
    orientation?: 'portrait' | 'landscape';
    unit?: 'mm' | 'pt';
    format?: string | [number, number]; // e.g. 'a4', 'a5', or custom [width, height] in mm
  } = {}
): boolean {
  try {
    const orientation = options.orientation || (canvas.width >= canvas.height ? 'landscape' : 'portrait');
    const pdf = new jsPDF({
      orientation,
      unit: options.unit || 'mm',
      format: options.format || (orientation === 'landscape' ? [85, 55] : [55, 85]),
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    pdf.save(`${filename}.pdf`);
    return true;
  } catch (err) {
    console.error('Error downloading canvas as PDF:', err);
    return false;
  }
}
