import React, { useState } from 'react';
import { CoverLetterData, StyleConfig } from '../../types/resume';
import { exportElementToPdf, printResumeDocument } from '../../utils/pdfExport';
import {
  Copy,
  Check,
  Download,
  Printer,
  Edit3,
  Eye,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  FolderOpen,
  Loader2,
} from 'lucide-react';

interface CoverLetterViewProps {
  coverLetter: CoverLetterData;
  styleConfig: StyleConfig;
  candidateEmail: string;
  candidatePhone: string;
  candidateLocation: string;
  candidateLinkedin: string;
  candidateWebsite?: string;
  candidateGithub?: string;
  candidatePortfolio?: string;
  onUpdateCoverLetter?: (updated: CoverLetterData) => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  coverLetter,
  styleConfig,
  candidateEmail,
  candidatePhone,
  candidateLocation,
  candidateLinkedin,
  candidateWebsite,
  candidateGithub,
  candidatePortfolio,
  onUpdateCoverLetter,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable text buffer
  const [editedOpening, setEditedOpening] = useState(coverLetter.opening);
  const [editedBody0, setEditedBody0] = useState(coverLetter.bodyParagraphs[0] || '');
  const [editedBody1, setEditedBody1] = useState(coverLetter.bodyParagraphs[1] || '');
  const [editedClosing, setEditedClosing] = useState(coverLetter.closing);
  const [editedRecipient, setEditedRecipient] = useState(coverLetter.recipient);
  const [editedSubject, setEditedSubject] = useState(coverLetter.jobTitle);

  const isEn = coverLetter.language === 'en';

  const fullRawText = [
    coverLetter.fullName,
    `${candidateEmail} · ${candidatePhone} · ${candidateLocation}`,
    [
      candidateLinkedin ? `LinkedIn: ${candidateLinkedin}` : '',
      candidateWebsite ? `Website: ${candidateWebsite}` : '',
      candidateGithub ? `GitHub: ${candidateGithub}` : '',
      candidatePortfolio ? `Portfolio: ${candidatePortfolio}` : '',
    ].filter(Boolean).join(' · '),
    '',
    coverLetter.date,
    '',
    isEditing ? editedRecipient : coverLetter.recipient,
    `${isEn ? 'Subject: Application for' : 'Asunto: Postulación para'} ${isEditing ? editedSubject : coverLetter.jobTitle}`,
    '',
    coverLetter.salutation,
    '',
    isEditing ? editedOpening : coverLetter.opening,
    '',
    isEditing ? editedBody0 : (coverLetter.bodyParagraphs[0] || ''),
    '',
    isEditing ? editedBody1 : (coverLetter.bodyParagraphs[1] || ''),
    '',
    isEditing ? editedClosing : coverLetter.closing,
    '',
    coverLetter.signoff,
    coverLetter.fullName,
  ].join('\n');

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullRawText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = fullRawText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleSaveChanges = () => {
    if (onUpdateCoverLetter) {
      onUpdateCoverLetter({
        ...coverLetter,
        recipient: editedRecipient,
        jobTitle: editedSubject,
        opening: editedOpening,
        bodyParagraphs: [editedBody0, editedBody1],
        closing: editedClosing,
      });
    }
    setIsEditing(false);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await exportElementToPdf('cover-letter-sheet', {
      fileName: `Cover_Letter_Isaac_Gomez_Estrada_${coverLetter.language.toUpperCase()}.pdf`,
      paperSize: styleConfig.paperSize,
      onFinish: () => setIsExporting(false),
      onError: () => setIsExporting(false),
    });
  };

  const handlePrint = () => {
    printResumeDocument(`Cover_Letter_Isaac_Gomez_Estrada_${coverLetter.language.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white p-2.5 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sky-400">
            {isEn ? 'Cover Letter Document' : 'Carta de Presentación'}
          </span>
          <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
            {isEn ? '🇺🇸 English' : '🇲🇽 Español'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              isEditing ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isEditing ? 'Ver vista previa' : 'Editar texto de la carta'}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? (isEn ? 'Done' : 'Listo') : (isEn ? 'Edit' : 'Editar')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
            title="Copiar texto al portapapeles"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? (isEn ? 'Copied!' : '¡Copiado!') : (isEn ? 'Copy' : 'Copiar')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
            title="Imprimir / PDF nativo"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isEn ? 'Print' : 'Imprimir'}</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded shadow-xs transition-colors disabled:opacity-50"
            title="Descargar carta en PDF de alta resolución"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Edit Mode Inputs */}
      {isEditing && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900">
              {isEn ? 'Editing Cover Letter Text' : 'Editando Texto de la Carta'}
            </span>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-2.5 py-0.5 bg-amber-600 text-white font-bold rounded hover:bg-amber-700"
            >
              {isEn ? 'Apply Changes' : 'Guardar Cambios'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-amber-900 mb-0.5">
                {isEn ? 'Recipient' : 'Destinatario'}
              </label>
              <input
                type="text"
                value={editedRecipient}
                onChange={(e) => setEditedRecipient(e.target.value)}
                className="w-full p-1.5 border border-amber-300 rounded bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-amber-900 mb-0.5">
                {isEn ? 'Subject / Position' : 'Asunto / Posición'}
              </label>
              <input
                type="text"
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="w-full p-1.5 border border-amber-300 rounded bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-amber-900 mb-0.5">
              {isEn ? 'Opening Paragraph' : 'Párrafo de Introducción'}
            </label>
            <textarea
              rows={3}
              value={editedOpening}
              onChange={(e) => setEditedOpening(e.target.value)}
              className="w-full p-2 border border-amber-300 rounded bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-amber-900 mb-0.5">
              {isEn ? 'Body Paragraph 1 (Track record & Experience)' : 'Párrafo de Desarrollo 1 (Trayectoria y experiencia)'}
            </label>
            <textarea
              rows={4}
              value={editedBody0}
              onChange={(e) => setEditedBody0(e.target.value)}
              className="w-full p-2 border border-amber-300 rounded bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-amber-900 mb-0.5">
              {isEn ? 'Body Paragraph 2 (Tech stack & Methodology)' : 'Párrafo de Desarrollo 2 (Tecnología y métodos)'}
            </label>
            <textarea
              rows={4}
              value={editedBody1}
              onChange={(e) => setEditedBody1(e.target.value)}
              className="w-full p-2 border border-amber-300 rounded bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-amber-900 mb-0.5">
              {isEn ? 'Closing Paragraph & Availability' : 'Párrafo de Cierre y Disponibilidad'}
            </label>
            <textarea
              rows={2}
              value={editedClosing}
              onChange={(e) => setEditedClosing(e.target.value)}
              className="w-full p-2 border border-amber-300 rounded bg-white text-xs"
            />
          </div>
        </div>
      )}

      {/* Rendered Document Container (for view and PDF capture) */}
      <div className="flex justify-center overflow-x-auto pb-4">
        <div
          id="cover-letter-sheet"
          className="resume-page bg-white shadow-lg text-slate-800 flex flex-col relative"
          style={{
            width: styleConfig.paperSize === 'letter' ? '216mm' : '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
        >
          {/* Header Banner */}
          <header
            className="p-7 text-white"
            style={{ backgroundColor: styleConfig.accentColor }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              {coverLetter.fullName}
            </h1>
            <p className="text-sm font-medium text-slate-200">
              {isEn
                ? 'Lead Automation Engineer & Platform Developer | Orblite'
                : 'Lead Automation Engineer & Platform Developer | Orblite'}
            </p>

            {/* Contact details */}
            <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-slate-200">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 opacity-80" />
                <span>{candidateEmail}</span>
              </span>
              {candidatePhone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 opacity-80" />
                  <span>{candidatePhone}</span>
                </span>
              )}
              {candidateLocation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 opacity-80" />
                  <span>{candidateLocation}</span>
                </span>
              )}
              {candidateLinkedin && (
                <span className="flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 opacity-80" />
                  <span>LinkedIn</span>
                </span>
              )}
              {candidateWebsite && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 opacity-80" />
                  <span>{candidateWebsite.replace(/^https?:\/\//, '')}</span>
                </span>
              )}
              {candidateGithub && (
                <span className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 opacity-80" />
                  <span>github.com/Orb-lite</span>
                </span>
              )}
              {candidatePortfolio && (
                <span className="flex items-center gap-1.5 text-amber-200 font-medium">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-300 opacity-90" />
                  <span>{isEn ? 'Drive Portfolio' : 'Portafolio Drive'}</span>
                </span>
              )}
            </div>
          </header>

          {/* Letter Body */}
          <div className="p-8 sm:p-10 text-slate-800 text-[12px] leading-relaxed flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Date */}
              <div className="text-slate-500 font-medium">
                {coverLetter.date}
              </div>

              {/* Recipient Block */}
              <div className="text-slate-900 font-semibold leading-snug">
                <div>{isEditing ? editedRecipient : coverLetter.recipient}</div>
                <div className="text-slate-600 font-medium text-[11px] mt-0.5">
                  <span className="font-semibold text-slate-900">
                    {isEn ? 'Subject: ' : 'Asunto: '}
                  </span>
                  {isEn ? 'Application for ' : 'Postulación para '}
                  <span style={{ color: styleConfig.accentColor }} className="font-bold">
                    {isEditing ? editedSubject : coverLetter.jobTitle}
                  </span>
                </div>
              </div>

              {/* Salutation */}
              <div className="font-semibold text-slate-900 pt-1">
                {coverLetter.salutation}
              </div>

              {/* Paragraphs */}
              <p className="text-justify text-slate-700 leading-relaxed indent-4">
                {isEditing ? editedOpening : coverLetter.opening}
              </p>

              {(isEditing ? [editedBody0, editedBody1] : coverLetter.bodyParagraphs).map((para, idx) => (
                <p key={idx} className="text-justify text-slate-700 leading-relaxed indent-4">
                  {para}
                </p>
              ))}

              <p className="text-justify text-slate-700 leading-relaxed indent-4">
                {isEditing ? editedClosing : coverLetter.closing}
              </p>

              {/* Sign-off */}
              <div className="pt-5 space-y-1">
                <p className="text-slate-700">{coverLetter.signoff}</p>
                <p className="font-bold text-slate-900 text-sm pt-2">
                  {coverLetter.fullName}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {candidateEmail} · {candidatePhone}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>{coverLetter.fullName} · Carta de Presentación / Cover Letter</span>
              <span>{isEn ? 'Page 1 of 1' : 'Página 1 de 1'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
