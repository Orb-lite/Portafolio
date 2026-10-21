import React, { useState, useRef, useEffect } from 'react';
import { resumeDataEs, resumeDataEn, defaultStyleConfig } from './data/defaultResume';
import { ResumeData, StyleConfig } from './types/resume';
import { ResumeDocument } from './components/resume/ResumeDocument';
import { PersonalInfoEditor } from './components/editor/PersonalInfoEditor';
import { ExperienceEditor } from './components/editor/ExperienceEditor';
import { SkillsEducationEditor } from './components/editor/SkillsEducationEditor';
import { DesignSettingsEditor } from './components/editor/DesignSettingsEditor';
import { JobOfferMatcher } from './components/editor/JobOfferMatcher';
import { LinkedInImportModal } from './components/modals/LinkedInImportModal';
import { exportElementToPdf, printResumeDocument } from './utils/pdfExport';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { AboutMeView } from './components/about/AboutMeView';
import {
  Download,
  Printer,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Sliders,
  RotateCcw,
  Eye,
  FileCheck,
  Loader2,
  CheckCircle,
  Globe,
  FileText,
  Github,
  FolderOpen,
  Trophy,
  Layers,
  Heart,
  Lock,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  const [mainTab, setMainTab] = useState<'portfolio' | 'about' | 'cv'>('portfolio');
  const [language, setLanguage] = useState<'es' | 'en'>('en'); // Default to English
  const [resumeData, setResumeData] = useState<ResumeData>(resumeDataEn);
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(defaultStyleConfig);
  const [activeTab, setActiveTab] = useState<'job_match' | 'personal' | 'experience' | 'skills' | 'design'>('job_match');
  const [showHiddenEditor, setShowHiddenEditor] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState<boolean>(false);
  const [previewScale, setPreviewScale] = useState<number>(0.92);

  const documentRef = useRef<HTMLDivElement>(null);

  // Check URL parameters on mount to allow direct access to hidden editor (?editor=true or #editor)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('editor') === 'true' || window.location.hash === '#editor') {
        setShowHiddenEditor(true);
        setMainTab('cv');
      }
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3800);
  };

  const handleLanguageSwitch = (lang: 'es' | 'en') => {
    setLanguage(lang);
    if (lang === 'en') {
      setResumeData(resumeDataEn);
      showNotification('English version activated (Discreet / NDA-compliant profile).');
    } else {
      setResumeData(resumeDataEs);
      showNotification('Versión en Español activada (Perfil discreto y confidencial).');
    }
  };

  const handleDownloadPdf = async (targetLang?: 'es' | 'en', isCustomized = false) => {
    const langToExport = targetLang || language;
    if (targetLang && targetLang !== language) {
      setLanguage(targetLang);
      setResumeData(targetLang === 'en' ? resumeDataEn : resumeDataEs);
      await new Promise((r) => setTimeout(r, 120));
    }

    setIsExporting(true);
    const fileName = isCustomized
      ? `CV_Isaac_Gomez_Estrada_Customized_${langToExport.toUpperCase()}.pdf`
      : `CV_Isaac_Gomez_Estrada_${langToExport.toUpperCase()}.pdf`;

    await exportElementToPdf('resume-print-sheet', {
      fileName,
      paperSize: styleConfig.paperSize,
      onStart: () => {
        showNotification(
          langToExport === 'es'
            ? isCustomized
              ? 'Generando PDF Personalizado en Español con tus ajustes...'
              : 'Generando PDF oficial en Español de 2 páginas...'
            : isCustomized
              ? 'Generating Customized English PDF Resume with your tailored adjustments...'
              : 'Generating official 2-page English PDF with calibrated margins...'
        );
      },
      onFinish: () => {
        setIsExporting(false);
        showNotification(
          langToExport === 'es'
            ? isCustomized
              ? '¡Tu CV Personalizado en PDF se ha descargado exitosamente!'
              : '¡Tu CV oficial en PDF (Español) se ha descargado exitosamente!'
            : isCustomized
              ? 'Your Customized PDF resume downloaded successfully!'
              : 'Your official PDF resume (English) downloaded successfully!'
        );
      },
      onError: (err) => {
        console.error(err);
        setIsExporting(false);
        showNotification(
          langToExport === 'es'
            ? 'Ocurrió un error al generar el PDF. Puedes usar la opción de "Imprimir / Guardar en PDF".'
            : 'Error generating PDF. You can also use the "Print / Save as PDF" option.'
        );
      },
    });
  };

  const handleNativePrint = () => {
    printResumeDocument(`CV_Isaac_Gomez_Estrada_${language.toUpperCase()}`);
    showNotification(
      language === 'es'
        ? 'Abriendo ventana de impresión nativa (selecciona "Guardar como PDF").'
        : 'Opening native print dialog (choose "Save as PDF").'
    );
  };

  const handleAutoFitOnePage = () => {
    setStyleConfig((prev) => ({
      ...prev,
      spacing: 'compact',
      fontSize: 'sm',
    }));
    showNotification('Ajustado a densidad compacta.');
  };

  const handleResetData = () => {
    const confirmMsg =
      language === 'es'
        ? '¿Deseas restaurar todos los datos predeterminados de Isaac Gómez Estrada?'
        : 'Do you want to reset all data to default for Isaac Gómez Estrada?';
    if (window.confirm(confirmMsg)) {
      setResumeData(language === 'es' ? resumeDataEs : resumeDataEn);
      setStyleConfig(defaultStyleConfig);
      showNotification(language === 'es' ? 'Datos restaurados correctamente.' : 'Data reset to defaults.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* 1. Global Navigation Bar (Hidden during print) */}
      <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        {/* Top Info & Brand Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
          {/* Brand & Profile Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              IG
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm font-bold tracking-tight text-white">
                  {resumeData.personalInfo.fullName}
                </h1>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-950/70 border border-amber-700/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Shipped AAA Credits</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-medium bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  32 yo · Virtual Environments (Since 2018)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                <span>{resumeData.personalInfo.email}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">
                  Zapopan & Guadalajara (On-site / Hybrid / Remote)
                </span>
                <span aria-hidden="true">·</span>
                <a
                  href="https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trophy className="w-2.5 h-2.5" />
                  <span>MobyGames (EA Sports College Football 25)</span>
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://github.com/Orb-lite/Portafolio.git"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:text-white hover:underline flex items-center gap-1"
                >
                  <Github className="w-2.5 h-2.5" />
                  <span>GitHub: Portafolio</span>
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:underline flex items-center gap-1"
                >
                  <FolderOpen className="w-2.5 h-2.5" />
                  <span>Drive Folder</span>
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://orb-lite.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <Globe className="w-2.5 h-2.5" />
                  <span>orb-lite.com</span>
                </a>
              </p>
            </div>
          </div>

          {/* Quick PDF Export Buttons Always Accessible */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleDownloadPdf('en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-all disabled:opacity-50"
              title="Download English PDF Resume (2 Pages)"
            >
              {isExporting && language === 'en' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>PDF English</span>
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleDownloadPdf('es')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all disabled:opacity-50"
              title="Descargar PDF en Español (2 Páginas)"
            >
              {isExporting && language === 'es' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>PDF Español</span>
            </button>
          </div>
        </div>

        {/* Primary Page Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
          <div className="flex items-center gap-2">
            {/* Tab 1: Portfolio */}
            <button
              type="button"
              onClick={() => setMainTab('portfolio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mainTab === 'portfolio'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>📁 Portfolio Showcases</span>
            </button>

            {/* Tab 2: About Me & Passions */}
            <button
              type="button"
              onClick={() => setMainTab('about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mainTab === 'about'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
              <span>🌟 About Me & Passions (English)</span>
            </button>

            {/* Tab 3: CV & Resume */}
            <button
              type="button"
              onClick={() => setMainTab('cv')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mainTab === 'cv'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>📄 CV & Resume (2-Page PDF)</span>
            </button>
          </div>

          {/* Quick info or quick toggle on the right */}
          <div className="flex items-center gap-2">
            {mainTab === 'cv' && (
              <button
                type="button"
                onClick={() => setShowHiddenEditor(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/60 transition-all"
                title="Open the hidden editor to tailor CV for specific job posts and export customized versions"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'es' ? 'Editor Oculto' : 'Hidden Editor'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIEW 1: Portfolio View */}
      {mainTab === 'portfolio' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6">
          <PortfolioView
            onSwitchToCv={() => setMainTab('cv')}
            onSwitchToAbout={() => setMainTab('about')}
          />
        </main>
      )}

      {/* VIEW 2: About Me View (Entirely in English) */}
      {mainTab === 'about' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6">
          <AboutMeView
            onSwitchToPortfolio={() => setMainTab('portfolio')}
            onSwitchToCv={() => setMainTab('cv')}
          />
        </main>
      )}

      {/* VIEW 3: Clean CV & Resume Presentation (Without In-Page Editor) */}
      {mainTab === 'cv' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col items-center">
          {/* Executive Document Presentation Toolbar */}
          <div className="no-print w-full flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs mb-6">
            {/* Left: Document details */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-slate-800">
                  {language === 'es' ? 'Currículum Vitae Oficial (2 Páginas)' : 'Official 2-Page Executive CV'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {styleConfig.paperSize.toUpperCase()} · Calibrated
              </span>
            </div>

            {/* Center: Language Switcher & Zoom */}
            <div className="flex items-center gap-3">
              {/* Dual Language Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleLanguageSwitch('en')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    language === 'en'
                      ? 'bg-sky-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch CV to English"
                >
                  <span>🇺🇸 English</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageSwitch('es')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    language === 'es'
                      ? 'bg-sky-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Cambiar CV a Español"
                >
                  <span>🇲🇽 Español</span>
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setPreviewScale(0.8)}
                  className={`px-2 py-0.5 rounded ${previewScale === 0.8 ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-600'}`}
                >
                  80%
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(0.92)}
                  className={`px-2 py-0.5 rounded ${previewScale === 0.92 ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-600'}`}
                >
                  92%
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(1)}
                  className={`px-2 py-0.5 rounded ${previewScale === 1 ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-600'}`}
                >
                  100%
                </button>
              </div>
            </div>

            {/* Right: Print, Download & Hidden Editor access */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleDownloadPdf()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all disabled:opacity-50"
                title="Download official PDF resume (2 pages)"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{language === 'es' ? 'Descargar PDF' : 'Download PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handleNativePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
                title="Imprimir o Guardar como PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">{language === 'es' ? 'Imprimir' : 'Print'}</span>
              </button>

              {/* Discreet Button to open Hidden Editor */}
              <button
                type="button"
                onClick={() => setShowHiddenEditor(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all shadow-xs"
                title="Open the hidden customizer to match job offers and export customized versions"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'es' ? 'Editor Oculto' : 'Hidden Editor'}</span>
              </button>
            </div>
          </div>

          {/* Clean, Full-Width Centered CV Document (No Editor Sidebar) */}
          <div className="w-full flex justify-center overflow-x-auto pb-16">
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: 'top center',
                width: styleConfig.paperSize === 'letter' ? '216mm' : '210mm',
                transition: 'transform 0.15s ease',
              }}
              className="space-y-4 shadow-xl"
            >
              <ResumeDocument
                innerRef={documentRef}
                data={resumeData}
                styleConfig={styleConfig}
                language={language}
              />
            </div>
          </div>

          {/* Floating Discreet Button at Bottom-Right */}
          <div className="no-print fixed bottom-6 right-6 z-30">
            <button
              type="button"
              onClick={() => setShowHiddenEditor(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-amber-400 hover:text-amber-300 shadow-xl border border-slate-700 text-xs font-bold transition-all hover:scale-105"
              title="Access hidden resume customizer & job tailoring"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'es' ? 'Editor Oculto & Exportador' : 'Hidden Editor & Exporter'}</span>
            </button>
          </div>
        </main>
      )}

      {/* HIDDEN RESUME EDITOR DRAWER / MODAL */}
      {showHiddenEditor && (
        <div className="no-print fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-xs flex justify-end animate-fade-in">
          {/* Backdrop click to close */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setShowHiddenEditor(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="w-full max-w-2xl bg-slate-50 h-full flex flex-col shadow-2xl border-l border-slate-300">
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      {language === 'es' ? 'Editor Oculto & Adaptador de CV' : 'Hidden Editor & Resume Customizer'}
                    </h2>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Tailor
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {language === 'es'
                      ? 'Edita cualquier sección o ajusta según una vacante. Luego exporta la versión personalizada en PDF.'
                      : 'Tailor any section or match against a job description, then export your customized PDF version.'}
                  </p>
                </div>
              </div>

              {/* Primary Header Action: Export Customized PDF & Close */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadPdf(language, true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-950/50 transition-all disabled:opacity-50"
                  title="Export tailored version directly to PDF"
                >
                  {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{language === 'es' ? 'Exportar Personalizado' : 'Export Customized PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHiddenEditor(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Cerrar Editor Oculto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Editor Navigation Tabs */}
            <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold gap-1 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('job_match')}
                className={`py-2 px-3 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'job_match'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-amber-900 bg-amber-50 hover:bg-amber-100'
                }`}
                title="Ajustar a propuesta de trabajo y redactar Cover Letter"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'es' ? '🎯 Oferta & Carta' : '🎯 Job Match & Letter'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`py-2 px-3 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'personal'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Contacto' : 'Personal'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={`py-2 px-3 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'experience'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Experiencia' : 'Experience'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`py-2 px-3 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'skills'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Habilidades' : 'Skills & Edu'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`py-2 px-3 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'design'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Diseño' : 'Design'}</span>
              </button>
            </div>

            {/* Active Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {activeTab === 'job_match' && (
                <JobOfferMatcher
                  currentResume={resumeData}
                  styleConfig={styleConfig}
                  appLanguage={language}
                  onApplyOptimization={(updatedResume, targetLang) => {
                    setResumeData(updatedResume);
                    if (targetLang !== language) {
                      setLanguage(targetLang);
                    }
                  }}
                  onDownloadResumePdf={(targetLang) => handleDownloadPdf(targetLang, true)}
                  onShowNotification={showNotification}
                />
              )}

              {activeTab === 'personal' && (
                <PersonalInfoEditor
                  personalInfo={resumeData.personalInfo}
                  onChange={(updated) =>
                    setResumeData({ ...resumeData, personalInfo: updated })
                  }
                  language={language}
                  onLanguageChange={handleLanguageSwitch}
                />
              )}

              {activeTab === 'experience' && (
                <ExperienceEditor
                  experiences={resumeData.experiences}
                  onChange={(updated) =>
                    setResumeData({ ...resumeData, experiences: updated })
                  }
                />
              )}

              {activeTab === 'skills' && (
                <SkillsEducationEditor
                  skillCategories={resumeData.skillCategories}
                  education={resumeData.education}
                  certifications={resumeData.certifications}
                  languages={resumeData.languages}
                  achievements={resumeData.achievements}
                  onSkillsChange={(cats) =>
                    setResumeData({ ...resumeData, skillCategories: cats })
                  }
                  onEducationChange={(edus) =>
                    setResumeData({ ...resumeData, education: edus })
                  }
                  onCertificationsChange={(certs) =>
                    setResumeData({ ...resumeData, certifications: certs })
                  }
                  onLanguagesChange={(langs) =>
                    setResumeData({ ...resumeData, languages: langs })
                  }
                  onAchievementsChange={(achs) =>
                    setResumeData({ ...resumeData, achievements: achs })
                  }
                />
              )}

              {activeTab === 'design' && (
                <DesignSettingsEditor
                  styleConfig={styleConfig}
                  onChange={(updated) => setStyleConfig(updated)}
                  onAutoFitOnePage={handleAutoFitOnePage}
                />
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="bg-white p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-lg shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Restaurar Predeterminado' : 'Reset Defaults'}</span>
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setIsLinkedInModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{language === 'es' ? 'Perfiles Sugeridos' : 'Role Presets'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHiddenEditor(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                >
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleDownloadPdf(language, true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-sky-600 hover:bg-sky-500 shadow-md transition-all disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{language === 'es' ? 'Exportar Versión Personalizada' : 'Export Customized PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Import / Presets Modal */}
      <LinkedInImportModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        currentData={resumeData}
        language={language}
        onApply={(newData) => {
          setResumeData(newData);
          showNotification(language === 'es' ? '¡Perfil actualizado con las sugerencias!' : 'Profile updated with suggestions!');
        }}
      />
    </div>
  );
}
