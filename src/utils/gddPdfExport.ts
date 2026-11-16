import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface ExportGddPdfOptions {
  fileName?: string;
  paperSize?: 'letter' | 'a4';
  onStart?: () => void;
  onProgress?: (current: number, total: number) => void;
  onFinish?: () => void;
  onError?: (error: unknown) => void;
}

function normalizeColor(colorStr: string): string {
  if (!colorStr) return colorStr;
  if (
    !colorStr.includes('oklch') &&
    !colorStr.includes('oklab') &&
    !colorStr.includes('color(') &&
    !colorStr.includes('color-mix(') &&
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

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 4000);
      });
    })
  );
}

export async function exportGddToPdf(
  containerId: string,
  options: ExportGddPdfOptions = {}
): Promise<void> {
  const {
    fileName = 'GDD_The_Last_Relic_INDAUTOR.pdf',
    paperSize = 'letter',
    onStart,
    onProgress,
    onFinish,
    onError,
  } = options;

  let sandboxContainer: HTMLDivElement | null = null;

  try {
    if (onStart) onStart();

    const originalContainer = document.getElementById(containerId);
    if (!originalContainer) {
      throw new Error(`Element with id "${containerId}" not found`);
    }

    if (document.fonts) {
      await document.fonts.ready;
    }

    const mmDimensions =
      paperSize === 'letter'
        ? { width: 215.9, height: 279.4 }
        : { width: 210, height: 297 };

    const targetPixelWidth = paperSize === 'letter' ? 816 : 794;
    const standardPagePixelHeight = Math.round(
      (targetPixelWidth * mmDimensions.height) / mmDimensions.width
    );

    sandboxContainer = document.createElement('div');
    sandboxContainer.id = 'gdd-pdf-sandbox-wrapper';
    sandboxContainer.style.position = 'fixed';
    sandboxContainer.style.left = '-12000px';
    sandboxContainer.style.top = '0';
    sandboxContainer.style.width = `${targetPixelWidth}px`;
    sandboxContainer.style.margin = '0';
    sandboxContainer.style.padding = '0';
    sandboxContainer.style.zIndex = '-99999';
    sandboxContainer.style.backgroundColor = '#ffffff';
    sandboxContainer.style.overflow = 'visible';

    const clonedSheet = originalContainer.cloneNode(true) as HTMLElement;
    clonedSheet.id = 'gdd-pdf-sandbox-sheet';
    clonedSheet.style.width = `${targetPixelWidth}px`;
    clonedSheet.style.maxWidth = `${targetPixelWidth}px`;
    clonedSheet.style.transform = 'none';
    clonedSheet.style.boxShadow = 'none';
    clonedSheet.style.margin = '0';
    clonedSheet.style.borderRadius = '0';

    sandboxContainer.appendChild(clonedSheet);
    document.body.appendChild(sandboxContainer);

    await waitForImages(clonedSheet);
    await new Promise((resolve) => setTimeout(resolve, 120));

    const sanitizeClone = (clonedDoc: Document) => {
      try {
        const sheet = clonedDoc.getElementById('gdd-pdf-sandbox-sheet');
        if (!sheet) return;
        const allElements = [sheet, ...Array.from(sheet.querySelectorAll('*'))];
        for (const el of allElements) {
          const htmlEl = el as HTMLElement;
          const computed = window.getComputedStyle(htmlEl);
          if (computed.backgroundColor) {
            htmlEl.style.backgroundColor = normalizeColor(computed.backgroundColor);
          }
          if (computed.color) {
            htmlEl.style.color = normalizeColor(computed.color);
          }
          if (computed.borderColor) {
            htmlEl.style.borderColor = normalizeColor(computed.borderColor);
          }
        }
      } catch (e) {
        console.warn('GDD PDF color normalization warning:', e);
      }
    };

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: paperSize,
    });

    const pdfWidth = mmDimensions.width;
    const pdfHeight = mmDimensions.height;

    const pageElements = Array.from(
      clonedSheet.querySelectorAll<HTMLElement>('.gdd-pdf-page')
    );

    if (pageElements.length === 0) {
      throw new Error('No .gdd-pdf-page sections found for export');
    }

    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) pdf.addPage();
      if (onProgress) onProgress(i + 1, pageElements.length);

      const pageEl = pageElements[i];
      pageEl.style.width = `${targetPixelWidth}px`;
      pageEl.style.minHeight = `${standardPagePixelHeight}px`;
      pageEl.style.boxShadow = 'none';
      pageEl.style.borderRadius = '0';
      pageEl.style.margin = '0';

      const pageCanvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FBF9F5',
        width: targetPixelWidth,
        windowWidth: 1200,
        onclone: sanitizeClone,
      });

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.96);
      const proportionalHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;

      if (proportionalHeight <= pdfHeight * 1.02) {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(proportionalHeight, pdfHeight));
      } else {
        // Scale down gently to preserve full single-page layout integrity
        const fitRatio = pdfHeight / proportionalHeight;
        const fitWidth = pdfWidth * fitRatio;
        const offsetX = (pdfWidth - fitWidth) / 2;
        pdf.addImage(imgData, 'JPEG', offsetX, 0, fitWidth, pdfHeight);
      }
    }

    pdf.save(fileName);
    if (onFinish) onFinish();
  } catch (err) {
    console.error('Error generating GDD PDF:', err);
    if (onError) onError(err);
    if (onFinish) onFinish();
  } finally {
    if (sandboxContainer && sandboxContainer.parentNode) {
      sandboxContainer.parentNode.removeChild(sandboxContainer);
    }
  }
}
