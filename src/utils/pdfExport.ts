import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface ExportPdfOptions {
  fileName?: string;
  paperSize?: 'a4' | 'letter';
  onStart?: () => void;
  onFinish?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Normalizes modern CSS color functions (oklch, lab, lch) to standard sRGB
 */
function normalizeColor(colorStr: string): string {
  if (!colorStr) return colorStr;
  if (
    !colorStr.includes('oklch') &&
    !colorStr.includes('color(') &&
    !colorStr.includes('lab(') &&
    !colorStr.includes('lch(')
  ) {
    return colorStr;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return colorStr;
    ctx.fillStyle = '#000000';
    ctx.fillStyle = colorStr;
    return ctx.fillStyle;
  } catch {
    return colorStr;
  }
}

export async function exportElementToPdf(
  elementId: string,
  options: ExportPdfOptions = {}
): Promise<void> {
  const {
    fileName = 'CV_Isaac_Gomez_Estrada.pdf',
    paperSize = 'a4',
    onStart,
    onFinish,
    onError,
  } = options;

  let sandboxContainer: HTMLDivElement | null = null;

  try {
    if (onStart) onStart();

    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Wait for all web fonts to be completely ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Exact paper dimensions in millimeters
    const mmDimensions =
      paperSize === 'letter'
        ? { width: 215.9, height: 279.4 } // Letter
        : { width: 210, height: 297 }; // A4

    // Exact standard print width in CSS pixels (96 DPI)
    // A4: 210mm ~ 794px, Letter: 215.9mm ~ 816px
    const targetPixelWidth = paperSize === 'letter' ? 816 : 794;
    const standardPagePixelHeight = Math.round(
      (targetPixelWidth * mmDimensions.height) / mmDimensions.width
    );

    // Create an isolated, unscaled sandbox container attached to document.body
    sandboxContainer = document.createElement('div');
    sandboxContainer.id = 'pdf-render-sandbox-wrapper';
    sandboxContainer.style.position = 'fixed';
    sandboxContainer.style.left = '-10000px';
    sandboxContainer.style.top = '0';
    sandboxContainer.style.width = `${targetPixelWidth}px`;
    sandboxContainer.style.margin = '0';
    sandboxContainer.style.padding = '0';
    sandboxContainer.style.zIndex = '-99999';
    sandboxContainer.style.backgroundColor = '#ffffff';
    sandboxContainer.style.overflow = 'visible';

    // Clone the resume sheet into the sandbox
    const clonedSheet = originalElement.cloneNode(true) as HTMLElement;
    clonedSheet.id = 'pdf-render-sandbox-sheet';
    clonedSheet.style.width = `${targetPixelWidth}px`;
    clonedSheet.style.maxWidth = `${targetPixelWidth}px`;
    clonedSheet.style.transform = 'none';
    clonedSheet.style.boxShadow = 'none';
    clonedSheet.style.margin = '0';
    clonedSheet.style.borderRadius = '0';

    sandboxContainer.appendChild(clonedSheet);
    document.body.appendChild(sandboxContainer);

    // Give DOM a tick to layout
    await new Promise((resolve) => setTimeout(resolve, 80));

    const sanitizeClone = (clonedDoc: Document) => {
      try {
        const sheet = clonedDoc.getElementById('pdf-render-sandbox-sheet');
        if (sheet) {
          const allElements = [sheet, ...Array.from(sheet.querySelectorAll('*'))];
          for (const el of allElements) {
            const htmlEl = el as HTMLElement;
            const computed = window.getComputedStyle(htmlEl);

            // Normalize colors for html2canvas
            if (computed.backgroundColor && computed.backgroundColor.includes('oklch')) {
              htmlEl.style.backgroundColor = normalizeColor(computed.backgroundColor);
            }
            if (computed.color && computed.color.includes('oklch')) {
              htmlEl.style.color = normalizeColor(computed.color);
            }
            if (computed.borderColor && computed.borderColor.includes('oklch')) {
              htmlEl.style.borderColor = normalizeColor(computed.borderColor);
            }

            // Strictly enforce break-inside: avoid on tagged elements
            if (
              htmlEl.classList.contains('break-inside-avoid') ||
              htmlEl.getAttribute('data-break-avoid') === 'true' ||
              htmlEl.tagName.toLowerCase() === 'article' ||
              htmlEl.tagName.toLowerCase() === 'header'
            ) {
              htmlEl.style.setProperty('break-inside', 'avoid', 'important');
              htmlEl.style.setProperty('page-break-inside', 'avoid', 'important');
            }
          }
        }
      } catch (e) {
        console.warn('Sandbox color and break-avoid normalization warning:', e);
      }
    };

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: paperSize === 'letter' ? 'letter' : 'a4',
    });

    const pdfWidth = mmDimensions.width;
    const pdfHeight = mmDimensions.height;

    // Check if the document has explicit .resume-page sections (e.g. Page 1 and Page 2)
    const pageElements = Array.from(
      clonedSheet.querySelectorAll<HTMLElement>('.resume-page')
    );

    if (pageElements.length >= 2) {
      // Direct high-fidelity multi-page rendering
      for (let i = 0; i < pageElements.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const pageEl = pageElements[i];
        pageEl.style.width = `${targetPixelWidth}px`;
        pageEl.style.minHeight = `${standardPagePixelHeight}px`;

        const pageCanvas = await html2canvas(pageEl, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: targetPixelWidth,
          windowWidth: 1200,
          onclone: sanitizeClone,
        });

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
    } else {
      // Single continuous sheet capture
      const canvas = await html2canvas(clonedSheet, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: targetPixelWidth,
        windowWidth: 1200,
        onclone: sanitizeClone,
      });

      const pageCanvasHeight = Math.round(
        (canvas.width * pdfHeight) / pdfWidth
      );

      if (canvas.height <= pageCanvasHeight * 1.05) {
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
      } else {
        // Multi-page fallback slicing
        let currentSourceY = 0;
        let pageIndex = 0;

        while (currentSourceY < canvas.height) {
          if (pageIndex > 0) pdf.addPage();
          const sliceHeight = Math.min(pageCanvasHeight, canvas.height - currentSourceY);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageCanvasHeight;
          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, currentSourceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
          }
          const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          currentSourceY += sliceHeight;
          pageIndex++;
        }
      }
    }

    pdf.save(fileName);
    if (onFinish) onFinish();
  } catch (err) {
    console.error('Error generating PDF:', err);
    if (onError) onError(err);
    if (onFinish) onFinish();
  } finally {
    if (sandboxContainer && sandboxContainer.parentNode) {
      sandboxContainer.parentNode.removeChild(sandboxContainer);
    }
  }
}

export function printResumeDocument(targetName: string = 'CV_Isaac_Gomez_Estrada'): void {
  const previousTitle = document.title;
  document.title = targetName;
  window.print();
  setTimeout(() => {
    document.title = previousTitle;
  }, 1000);
}
