import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertInchesToTwip,
  ExternalHyperlink,
} from 'docx';
import { ResumeData } from '../types/resume';

export interface ExportDocxOptions {
  fileName?: string;
  language?: 'es' | 'en';
}

/**
 * Creates and downloads an ATS-compliant Microsoft Word (.docx) document
 * with native OpenXML headings, paragraphs, bullet lists, and standard formatting
 * that all ATS parsers (Lensa, TopResume, Workday, Taleo, Greenhouse, Lever) parse cleanly.
 */
export async function exportResumeToDocx(
  data: ResumeData,
  options: ExportDocxOptions = {}
): Promise<void> {
  const language = options.language || 'en';
  const isEn = language === 'en';

  const labels = {
    summary: isEn ? 'PROFESSIONAL SUMMARY' : 'PERFIL PROFESIONAL',
    achievements: isEn ? 'KEY ACHIEVEMENTS & SHIPPED TITLES' : 'LOGROS CLAVE & TÍTULOS AAA',
    skills: isEn ? 'CORE TECHNICAL COMPETENCIES' : 'COMPETENCIAS TÉCNICAS CLAVE',
    experience: isEn ? 'PROFESSIONAL EXPERIENCE' : 'EXPERIENCIA PROFESIONAL',
    education: isEn ? 'EDUCATION' : 'EDUCACIÓN',
    certifications: isEn ? 'CERTIFICATIONS' : 'CERTIFICACIONES',
    languages: isEn ? 'LANGUAGES' : 'IDIOMAS',
    present: isEn ? 'Present' : 'Presente',
  };

  const primaryColor = '0284C7'; // Tech Blue
  const darkTextColor = '0F172A'; // Slate 900
  const bodyTextColor = '334155'; // Slate 700
  const mutedTextColor = '64748B'; // Slate 500

  // Helper for section heading paragraphs
  const createSectionHeading = (titleText: string): Paragraph => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: primaryColor,
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        new TextRun({
          text: titleText,
          bold: true,
          size: 22, // 11pt
          color: primaryColor,
          font: 'Calibri',
        }),
      ],
    });
  };

  const children: Paragraph[] = [];

  // ==========================================
  // 1. CANDIDATE HEADER
  // ==========================================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: data.personalInfo.fullName,
          bold: true,
          size: 36, // 18pt
          color: darkTextColor,
          font: 'Calibri',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: data.personalInfo.title,
          bold: true,
          size: 24, // 12pt
          color: primaryColor,
          font: 'Calibri',
        }),
      ],
    })
  );

  // Contact line (single clean line easily parsed by ATS)
  const contactParts: string[] = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ].filter(Boolean);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: contactParts.join('  |  '),
          size: 19, // ~9.5pt
          color: bodyTextColor,
          font: 'Calibri',
        }),
      ],
    })
  );

  // Links line
  const linkRuns: (TextRun | ExternalHyperlink)[] = [];
  if (data.personalInfo.mobygamesUrl) {
    linkRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'MobyGames (Shipped AAA Credits)',
            color: '0369A1',
            underline: {},
            size: 18,
            font: 'Calibri',
          }),
        ],
        link: data.personalInfo.mobygamesUrl,
      })
    );
  }
  if (data.personalInfo.githubUrl) {
    if (linkRuns.length > 0) {
      linkRuns.push(new TextRun({ text: '  ·  ', size: 18, color: mutedTextColor, font: 'Calibri' }));
    }
    linkRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'GitHub Portfolio',
            color: '0369A1',
            underline: {},
            size: 18,
            font: 'Calibri',
          }),
        ],
        link: data.personalInfo.githubUrl,
      })
    );
  }
  if (data.personalInfo.linkedinUrl) {
    if (linkRuns.length > 0) {
      linkRuns.push(new TextRun({ text: '  ·  ', size: 18, color: mutedTextColor, font: 'Calibri' }));
    }
    linkRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'LinkedIn',
            color: '0369A1',
            underline: {},
            size: 18,
            font: 'Calibri',
          }),
        ],
        link: data.personalInfo.linkedinUrl,
      })
    );
  }
  if (data.personalInfo.portfolioUrl) {
    if (linkRuns.length > 0) {
      linkRuns.push(new TextRun({ text: '  ·  ', size: 18, color: mutedTextColor, font: 'Calibri' }));
    }
    linkRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'Drive Portfolio',
            color: '0369A1',
            underline: {},
            size: 18,
            font: 'Calibri',
          }),
        ],
        link: data.personalInfo.portfolioUrl,
      })
    );
  }
  if (data.personalInfo.websiteUrl) {
    if (linkRuns.length > 0) {
      linkRuns.push(new TextRun({ text: '  ·  ', size: 18, color: mutedTextColor, font: 'Calibri' }));
    }
    linkRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'orb-lite.com',
            color: '0369A1',
            underline: {},
            size: 18,
            font: 'Calibri',
          }),
        ],
        link: data.personalInfo.websiteUrl,
      })
    );
  }

  if (linkRuns.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 180 },
        children: linkRuns,
      })
    );
  }

  // ==========================================
  // 2. PROFESSIONAL SUMMARY
  // ==========================================
  if (data.personalInfo.summary) {
    children.push(createSectionHeading(labels.summary));
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 160 },
        children: [
          new TextRun({
            text: data.personalInfo.summary,
            size: 20, // 10pt
            color: bodyTextColor,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // ==========================================
  // 3. KEY ACHIEVEMENTS & SHIPPED TITLES
  // ==========================================
  if (data.achievements && data.achievements.length > 0) {
    children.push(createSectionHeading(labels.achievements));
    for (const ach of data.achievements) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: `${ach.title} (${ach.metric}): `,
              bold: true,
              size: 20,
              color: darkTextColor,
              font: 'Calibri',
            }),
            new TextRun({
              text: ach.description,
              size: 20,
              color: bodyTextColor,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  // ==========================================
  // 4. CORE TECHNICAL COMPETENCIES / SKILLS
  // ==========================================
  if (data.skillCategories && data.skillCategories.length > 0) {
    children.push(createSectionHeading(labels.skills));
    for (const cat of data.skillCategories) {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 50 },
          children: [
            new TextRun({
              text: `• ${cat.name}: `,
              bold: true,
              size: 20,
              color: darkTextColor,
              font: 'Calibri',
            }),
            new TextRun({
              text: cat.skills.join(', '),
              size: 20,
              color: bodyTextColor,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  // ==========================================
  // 5. PROFESSIONAL EXPERIENCE
  // ==========================================
  if (data.experiences && data.experiences.length > 0) {
    children.push(createSectionHeading(labels.experience));

    for (const exp of data.experiences) {
      // Role & Dates
      const dateRange = `${exp.startDate} – ${exp.isCurrent ? labels.present : exp.endDate}`;

      children.push(
        new Paragraph({
          spacing: { before: 140, after: 20 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 22, // 11pt
              color: darkTextColor,
              font: 'Calibri',
            }),
            new TextRun({
              text: `   |   ${dateRange}`,
              bold: true,
              size: 20,
              color: primaryColor,
              font: 'Calibri',
            }),
          ],
        })
      );

      // Company & Location
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: `${exp.company} — ${exp.location}`,
              italics: true,
              size: 19,
              color: mutedTextColor,
              font: 'Calibri',
            }),
          ],
        })
      );

      // Highlights
      for (const h of exp.highlights) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: h,
                size: 20, // 10pt
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // ==========================================
  // 6. EDUCATION
  // ==========================================
  if (data.education && data.education.length > 0) {
    children.push(createSectionHeading(labels.education));
    for (const edu of data.education) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: edu.degree,
              bold: true,
              size: 21,
              color: darkTextColor,
              font: 'Calibri',
            }),
            new TextRun({
              text: `   |   ${edu.graduationYear}`,
              size: 19,
              color: primaryColor,
              font: 'Calibri',
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({
              text: `${edu.institution} (${edu.location})`,
              italics: true,
              size: 19,
              color: mutedTextColor,
              font: 'Calibri',
            }),
          ],
        })
      );
      if (edu.details) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: edu.details,
                size: 19,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // ==========================================
  // 7. CERTIFICATIONS & LANGUAGES
  // ==========================================
  if (data.certifications && data.certifications.length > 0) {
    children.push(createSectionHeading(labels.certifications));
    for (const cert of data.certifications) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({
              text: `${cert.name} `,
              bold: true,
              size: 19,
              color: darkTextColor,
              font: 'Calibri',
            }),
            new TextRun({
              text: `— ${cert.issuer} (${cert.year})`,
              size: 19,
              color: bodyTextColor,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  if (data.languages && data.languages.length > 0) {
    children.push(createSectionHeading(labels.languages));
    for (const lang of data.languages) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({
              text: `${lang.name}: `,
              bold: true,
              size: 19,
              color: darkTextColor,
              font: 'Calibri',
            }),
            new TextRun({
              text: lang.level,
              size: 19,
              color: bodyTextColor,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  // Create standard document
  const doc = new Document({
    title: `Resume - ${data.personalInfo.fullName} - ${data.personalInfo.title}`,
    description: `ATS-Compliant Resume for ${data.personalInfo.fullName}`,
    creator: 'Isaac Gomez Estrada',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.65),
              right: convertInchesToTwip(0.65),
            },
          },
        },
        children,
      },
    ],
  });

  // Pack to Blob and trigger direct browser download
  const blob = await Packer.toBlob(doc);
  const targetFileName =
    options.fileName ||
    `CV_Isaac_Gomez_Estrada_Technical_Artist_${language.toUpperCase()}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = targetFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
