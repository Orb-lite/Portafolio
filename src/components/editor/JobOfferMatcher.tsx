import React, { useState } from 'react';
import { ResumeData, StyleConfig, JobMatchResult, CoverLetterData } from '../../types/resume';
import { analyzeJobOffer, SAMPLE_JOB_OFFERS, detectLanguage } from '../../services/jobTailoringService';
import { resumeDataEs, resumeDataEn } from '../../data/defaultResume';
import { CoverLetterView } from '../coverLetter/CoverLetterView';
import {
  Sparkles,
  FileText,
  Briefcase,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Download,
  RotateCcw,
  Languages,
  Loader2,
  AlertCircle,
  Copy,
} from 'lucide-react';

interface JobOfferMatcherProps {
  currentResume: ResumeData;
  styleConfig: StyleConfig;
  appLanguage: 'es' | 'en';
  onApplyOptimization: (updatedResume: ResumeData, targetLanguage: 'es' | 'en') => void;
  onDownloadResumePdf: (targetLang?: 'es' | 'en') => void;
  onShowNotification: (msg: string) => void;
}

export const JobOfferMatcher: React.FC<JobOfferMatcherProps> = ({
  currentResume,
  styleConfig,
  appLanguage,
  onApplyOptimization,
  onDownloadResumePdf,
  onShowNotification,
}) => {
  const [jobText, setJobText] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'en' | 'auto'>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'cover_letter' | 'optimized_cv'>('cover_letter');

  const detectedLang = selectedLanguage === 'auto' ? detectLanguage(jobText) : selectedLanguage;

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_JOB_OFFERS.find((s) => s.id === sampleId);
    if (found) {
      setJobText(found.text);
      setSelectedLanguage(found.lang);
      onShowNotification(`Propuesta cargada: ${found.title.slice(0, 40)}...`);
    }
  };

  const handleRunAnalysis = async () => {
    if (!jobText.trim() || jobText.trim().length < 20) {
      onShowNotification('Por favor pega el texto de la propuesta de trabajo para analizar.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeJobOffer(
        jobText,
        currentResume,
        selectedLanguage === 'auto' ? undefined : selectedLanguage
      );
      setMatchResult(result);
      setActiveSubTab('cover_letter');
      onShowNotification(
        result.detectedLanguage === 'es'
          ? '¡Cover Letter redactada y CV optimizado para la propuesta!'
          : 'Cover Letter drafted & Resume optimized for this job offer!'
      );
    } catch (err) {
      console.error(err);
      onShowNotification('Ocurrió un error al procesar la propuesta. Intenta nuevamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyToCv = () => {
    if (!matchResult) return;

    const base = matchResult.detectedLanguage === 'en' ? resumeDataEn : resumeDataEs;
    const updated: ResumeData = JSON.parse(JSON.stringify(base));
    updated.personalInfo.fullName = currentResume.personalInfo.fullName;
    updated.personalInfo.email = currentResume.personalInfo.email || 'isaacgestrada94@gmail.com';
    updated.personalInfo.phone = currentResume.personalInfo.phone || '+52 33 1835 9421';
    updated.personalInfo.location = currentResume.personalInfo.location || (matchResult.detectedLanguage === 'en' ? 'Zapopan / Guadalajara, Jalisco, Mexico (On-site, Hybrid, or Remote)' : 'Zapopan / Guadalajara, Jalisco, México (Presencial, Híbrido o Remoto)');
    updated.personalInfo.linkedinUrl = currentResume.personalInfo.linkedinUrl;
    updated.personalInfo.websiteUrl = currentResume.personalInfo.websiteUrl || 'https://orb-lite.com';
    updated.personalInfo.githubUrl = currentResume.personalInfo.githubUrl || 'https://github.com/Orb-lite/Orb-Lite';
    updated.personalInfo.portfolioUrl = currentResume.personalInfo.portfolioUrl || 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing';
    updated.personalInfo.title = matchResult.suggestedTitle;
    updated.personalInfo.summary = matchResult.suggestedSummary;

    onApplyOptimization(updated, matchResult.detectedLanguage);
    onShowNotification(
      matchResult.detectedLanguage === 'es'
        ? '¡CV actualizado con el perfil optimizado para la vacante!'
        : 'Resume updated with tailored profile for this opening!'
    );
  };

  const handleUpdateCoverLetter = (updatedLetter: CoverLetterData) => {
    if (!matchResult) return;
    setMatchResult({
      ...matchResult,
      coverLetter: updatedLetter,
    });
    onShowNotification('Carta de presentación actualizada.');
  };

  return (
    <div className="space-y-5">
      {/* Title & Explanatory Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 p-4 rounded-xl text-white shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold tracking-tight">
            Ajustar a Propuesta de Trabajo & Cover Letter
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Pega el texto de la vacante u oferta de empleo. El sistema detecta el idioma,
          analiza los requisitos y redacta automáticamente una **Carta de Presentación (Cover Letter)**
          personalizada a quien corresponda, además de **optimizar tu CV** para maximizar la compatibilidad.
        </p>
      </div>

      {/* 1. SECCIÓN: TEXTO DE LA PROPUESTA DE TRABAJO */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Texto de la Propuesta / Oferta de Trabajo</span>
          </label>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
            <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              type="button"
              onClick={() => setSelectedLanguage('auto')}
              className={`px-2 py-0.5 rounded transition-all ${
                selectedLanguage === 'auto'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Detectar automáticamente según el texto"
            >
              Auto ({detectedLang.toUpperCase()})
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('es')}
              className={`px-2 py-0.5 rounded transition-all ${
                selectedLanguage === 'es'
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇲🇽 Español
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('en')}
              className={`px-2 py-0.5 rounded transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-1">
          <div className="text-[11px] font-medium text-slate-500">
            O prueba con una propuesta de ejemplo:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_JOB_OFFERS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSample(s.id)}
                className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors flex items-center gap-1"
              >
                <span>{s.lang === 'es' ? '🇲🇽' : '🇺🇸'}</span>
                <span>{s.title.slice(0, 36)}...</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="relative">
          <textarea
            rows={7}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Pega aquí la descripción completa de la vacante, responsabilidades, requisitos, tecnologías deseadas o perfil de la empresa (en español o en inglés)..."
            className="w-full p-3 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
          />
          {jobText && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>{jobText.trim().split(/\s+/).filter(Boolean).length} palabras</span>
              <button
                type="button"
                onClick={() => setJobText('')}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Limpiar texto
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={isAnalyzing || !jobText.trim()}
          onClick={handleRunAnalysis}
          className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analizando propuesta y redactando Cover Letter...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                Redactar Cover Letter en {detectedLang === 'es' ? 'Español' : 'Inglés'} + Optimizar CV
              </span>
            </>
          )}
        </button>
      </div>

      {/* 2. RESULTADOS GENERADOS */}
      {matchResult && (
        <div className="space-y-4 animate-fade-in">
          {/* Sub Tab Switcher */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSubTab('cover_letter')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'cover_letter'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                Carta de Presentación ({matchResult.detectedLanguage.toUpperCase()})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('optimized_cv')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'optimized_cv'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                CV Optimizado ({matchResult.matchScore}% Match)
              </span>
            </button>
          </div>

          {/* SUB-VIEW 1: CARTA DE PRESENTACIÓN (COVER LETTER) */}
          {activeSubTab === 'cover_letter' && (
            <div className="space-y-3">
              <CoverLetterView
                coverLetter={matchResult.coverLetter}
                styleConfig={styleConfig}
                candidateEmail={currentResume.personalInfo.email}
                candidatePhone={currentResume.personalInfo.phone}
                candidateLocation={currentResume.personalInfo.location}
                candidateLinkedin={currentResume.personalInfo.linkedinUrl}
                candidateWebsite={currentResume.personalInfo.websiteUrl || 'https://orb-lite.com'}
                candidateGithub={currentResume.personalInfo.githubUrl || 'https://github.com/Orb-lite/Orb-Lite'}
                candidatePortfolio={currentResume.personalInfo.portfolioUrl || 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing'}
                onUpdateCoverLetter={handleUpdateCoverLetter}
              />
            </div>
          )}

          {/* SUB-VIEW 2: CV OPTIMIZADO PARA LA PROPUESTA */}
          {activeSubTab === 'optimized_cv' && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
              {/* Match Score Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Compatibilidad con la vacante
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="text-emerald-600">{matchResult.matchScore}%</span>
                    <span className="text-xs font-medium text-slate-500">
                      (Nivel de afinidad técnica muy alto)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyToCv}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Aplicar esta Optimización al CV</span>
                  </button>
                </div>
              </div>

              {/* Matched Keywords */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1.5">
                  Palabras Clave Identificadas y Alineadas:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.matchedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título Profesional Sugerido para la Vacante:
                </label>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900">
                  {matchResult.suggestedTitle}
                </div>
              </div>

              {/* Suggested Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resumen Ejecutivo Optimizado (Palabras Clave Integradas):
                </label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed text-justify">
                  {matchResult.suggestedSummary}
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleApplyToCv}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Ver en Visualizador y Descargar PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDownloadResumePdf(matchResult.detectedLanguage)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar CV Directo ({matchResult.detectedLanguage.toUpperCase()})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
