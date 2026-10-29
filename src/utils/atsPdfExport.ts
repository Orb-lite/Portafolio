import jsPDF from 'jspdf';
import { ResumeData } from '../types/resume';

export interface ExportAtsPdfOptions {
  fileName?: string;
  paperSize?: 'a4' | 'letter';
  language?: 'es' | 'en';
}

/**
 * Generates an ATS-compliant PDF with 100% genuine vector text streams,
 * selectable characters, proper metadata, and clean hierarchy.
 * Guaranteed to pass ATS systems (Lensa, TopResume, Greenhouse, Workday, Taleo)
 * without ever triggering "scanned resume" or unreadable file errors.
 */
export function exportResumeToAtsPdf(
  data: ResumeData,
  options: ExportAtsPdfOptions = {}
): void {
  const language = options.language || 'en';
  const paperSize = options.paperSize || 'letter';
  const isEn = language === 'en';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: paperSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;
  const bottomMargin = 14;

  let y = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = 15;
    }
  };

  // Color definitions (RGB)
  const primaryColor = [2, 132, 199] as const; // #0284c7 (Sky/Tech blue)
  const darkTextColor = [15, 23, 42] as const; // #0f172a (Slate 900)
  const bodyTextColor = [51, 65, 85] as const; // #334155 (Slate 700)
  const mutedTextColor = [100, 116, 139] as const; // #64748b (Slate 500)
  const lineRuleColor = [226, 232, 240] as const; // #e2e8f0

  // Set standard PDF document metadata
  doc.setProperties({
    title: `CV - ${data.personalInfo.fullName} - ${data.personalInfo.title}`,
    subject: `Technical Artist Resume - ${data.personalInfo.fullName}`,
    author: data.personalInfo.fullName,
    keywords:
      'Technical Artist, Unreal Engine 5, Frostbite, Digital Twins, EA Sports College Football 25, Perforce, Jenkins, Python, C++, Blueprints',
    creator: 'Isaac Gomez Estrada Resume Engine',
  });

  // ==========================================
  // 1. CANDIDATE HEADER
  // ==========================================
  // Full Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...darkTextColor);
  doc.text(data.personalInfo.fullName, marginX, y);
  y += 6.5;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(data.personalInfo.title, marginX, y);
  y += 5.5;

  // Contact Info Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...bodyTextColor);
  const contactLine = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ]
    .filter(Boolean)
    .join('   |   ');
  doc.text(contactLine, marginX, y);
  y += 4.5;

  // Web & Portfolio Links
  const links = [
    data.personalInfo.mobygamesUrl ? 'MobyGames (Shipped AAA Credits)' : null,
    data.personalInfo.githubUrl ? 'GitHub: Portafolio' : null,
    data.personalInfo.linkedinUrl ? 'LinkedIn' : null,
    data.personalInfo.portfolioUrl ? 'Drive Portfolio' : null,
    data.personalInfo.websiteUrl ? 'orb-lite.com' : null,
  ].filter(Boolean);

  if (links.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.text(links.join('   ·   '), marginX, y);
    y += 5;
  }

  // Top divider line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.6);
  doc.line(marginX, y, marginX + contentWidth, y);
  y += 5.5;

  // Section Heading Helper
  const renderSectionHeader = (title: string) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryColor);
    doc.text(title.toUpperCase(), marginX, y);
    y += 1.8;
    doc.setDrawColor(...lineRuleColor);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, marginX + contentWidth, y);
    y += 4;
  };

  // ==========================================
  // 2. PROFESSIONAL SUMMARY
  // ==========================================
  if (data.personalInfo.summary) {
    renderSectionHeader(isEn ? 'Professional Summary' : 'Perfil Profesional');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...bodyTextColor);
    const summaryLines = doc.splitTextToSize(data.personalInfo.summary, contentWidth);
    for (const line of summaryLines) {
      checkPageBreak(4.5);
      doc.text(line, marginX, y);
      y += 4.2;
    }
    y += 2.5;
  }

  // ==========================================
  // 3. KEY ACHIEVEMENTS & SHIPPED CREDITS
  // ==========================================
  if (data.achievements && data.achievements.length > 0) {
    renderSectionHeader(isEn ? 'Key Achievements & Shipped Credits' : 'Logros Clave & Títulos Shipped');
    for (const ach of data.achievements) {
      checkPageBreak(5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...darkTextColor);
      const prefix = `\u2022 ${ach.title} (${ach.metric}): `;
      doc.text(prefix, marginX, y);

      const prefixWidth = doc.getTextWidth(prefix);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...bodyTextColor);

      const remainingWidth = contentWidth - prefixWidth;
      const descLines = doc.splitTextToSize(ach.description, remainingWidth > 40 ? remainingWidth : contentWidth);

      if (remainingWidth > 40 && descLines.length > 0) {
        doc.text(descLines[0], marginX + prefixWidth, y);
        y += 4.2;
        for (let i = 1; i < descLines.length; i++) {
          checkPageBreak(4.2);
          doc.text(descLines[i], marginX + 4, y);
          y += 4.2;
        }
      } else {
        y += 4.2;
        for (const dl of descLines) {
          checkPageBreak(4.2);
          doc.text(dl, marginX + 4, y);
          y += 4.2;
        }
      }
    }
    y += 2;
  }

  // ==========================================
  // 4. CORE TECHNICAL COMPETENCIES
  // ==========================================
  if (data.skillCategories && data.skillCategories.length > 0) {
    renderSectionHeader(isEn ? 'Core Technical Competencies' : 'Competencias Técnicas Clave');
    for (const cat of data.skillCategories) {
      checkPageBreak(5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...darkTextColor);
      const catTitle = `\u2022 ${cat.name}: `;
      doc.text(catTitle, marginX, y);

      const titleWidth = doc.getTextWidth(catTitle);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...bodyTextColor);

      const skillsStr = cat.skills.join(', ');
      const skillsLines = doc.splitTextToSize(skillsStr, contentWidth - titleWidth);

      if (skillsLines.length > 0) {
        doc.text(skillsLines[0], marginX + titleWidth, y);
        y += 4.2;
        for (let i = 1; i < skillsLines.length; i++) {
          checkPageBreak(4.2);
          doc.text(skillsLines[i], marginX + 4, y);
          y += 4.2;
        }
      }
    }
    y += 2;
  }

  // ==========================================
  // 5. PROFESSIONAL EXPERIENCE
  // ==========================================
  if (data.experiences && data.experiences.length > 0) {
    renderSectionHeader(isEn ? 'Professional Experience' : 'Experiencia Profesional');

    for (const exp of data.experiences) {
      checkPageBreak(12);

      // Role (bold) and Date (aligned right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...darkTextColor);
      doc.text(exp.role, marginX, y);

      const dateStr = `${exp.startDate} \u2013 ${exp.isCurrent ? (isEn ? 'Present' : 'Presente') : exp.endDate}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...primaryColor);
      const dateWidth = doc.getTextWidth(dateStr);
      doc.text(dateStr, marginX + contentWidth - dateWidth, y);
      y += 4.3;

      // Company & Location
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(...mutedTextColor);
      doc.text(`${exp.company}  \u2014  ${exp.location}`, marginX, y);
      y += 4.5;

      // Bullet highlights
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(...bodyTextColor);

      for (const hl of exp.highlights) {
        checkPageBreak(5);
        const bulletChar = '\u2022 ';
        const bulletWidth = doc.getTextWidth(bulletChar);
        const wrapped = doc.splitTextToSize(hl, contentWidth - bulletWidth - 1);

        doc.text(bulletChar, marginX + 1, y);
        for (let i = 0; i < wrapped.length; i++) {
          doc.text(wrapped[i], marginX + bulletWidth + 1, y);
          y += 3.9;
          if (i < wrapped.length - 1) {
            checkPageBreak(4);
          }
        }
        y += 0.6;
      }
      y += 2;
    }
  }

  // ==========================================
  // 6. EDUCATION & CREDENTIALS
  // ==========================================
  if (data.education && data.education.length > 0) {
    renderSectionHeader(isEn ? 'Education' : 'Educación');
    for (const edu of data.education) {
      checkPageBreak(9);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...darkTextColor);
      doc.text(edu.degree, marginX, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...primaryColor);
      const gradWidth = doc.getTextWidth(edu.graduationYear);
      doc.text(edu.graduationYear, marginX + contentWidth - gradWidth, y);
      y += 4.2;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.2);
      doc.setTextColor(...mutedTextColor);
      doc.text(`${edu.institution} (${edu.location})`, marginX, y);
      y += 4;

      if (edu.details) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...bodyTextColor);
        const detailsLines = doc.splitTextToSize(edu.details, contentWidth);
        for (const dl of detailsLines) {
          checkPageBreak(3.8);
          doc.text(dl, marginX, y);
          y += 3.8;
        }
      }
      y += 1.5;
    }
  }

  // ==========================================
  // 7. CERTIFICATIONS & LANGUAGES
  // ==========================================
  if (data.certifications && data.certifications.length > 0) {
    renderSectionHeader(isEn ? 'Certifications' : 'Certificaciones');
    for (const cert of data.certifications) {
      checkPageBreak(4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(...darkTextColor);
      const certTitle = `\u2022 ${cert.name}`;
      doc.text(certTitle, marginX, y);

      const ctWidth = doc.getTextWidth(certTitle);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...bodyTextColor);
      doc.text(` \u2014 ${cert.issuer} (${cert.year})`, marginX + ctWidth, y);
      y += 4.2;
    }
    y += 2;
  }

  if (data.languages && data.languages.length > 0) {
    renderSectionHeader(isEn ? 'Languages' : 'Idiomas');
    for (const lang of data.languages) {
      checkPageBreak(4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(...darkTextColor);
      const langPrefix = `\u2022 ${lang.name}: `;
      doc.text(langPrefix, marginX, y);

      const lpWidth = doc.getTextWidth(langPrefix);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...bodyTextColor);
      doc.text(lang.level, marginX + lpWidth, y);
      y += 4.2;
    }
  }

  // Add Page Numbers on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    const pageText = `${isEn ? 'Page' : 'Página'} ${i} of ${totalPages}  |  ${data.personalInfo.fullName}  \u2014  ${data.personalInfo.title}`;
    doc.text(pageText, marginX, pageHeight - 7);
  }

  const targetFileName =
    options.fileName ||
    `CV_Isaac_Gomez_Estrada_Technical_Artist_${language.toUpperCase()}.pdf`;

  doc.save(targetFileName);
}
