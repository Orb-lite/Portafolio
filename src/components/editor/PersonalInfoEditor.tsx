import React from 'react';
import { PersonalInfo } from '../../types/resume';
import { Sparkles, Linkedin, Mail, Phone, MapPin, Globe, User, Languages, Check, Github, FolderOpen, Trophy } from 'lucide-react';

interface PersonalInfoEditorProps {
  personalInfo: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
  language?: 'es' | 'en';
  onLanguageChange?: (lang: 'es' | 'en') => void;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  personalInfo,
  onChange,
  language = 'es',
  onLanguageChange,
}) => {
  const isEn = language === 'en';

  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...personalInfo,
      [field]: value,
    });
  };

  // English & Spanish Summary Presets
  const presets = {
    orblite_leader: {
      es: 'Lead Automation Engineer y Desarrollador de Plataformas con sólida experiencia en integración de APIs de Inteligencia Artificial (LLMs), sistemas telemáticos en tiempo real y aplicaciones web de alto rendimiento. Actualmente Lead Automation Engineer & Platform Developer en Orblite, liderando automatizaciones de flujos con IA, infraestructura telemática vehicular y desarrollo de sistemas ERP/CRM propietarios (TypeScript, React, APIs REST, SQL Supabase, Cloudflare). Experiencia previa destacada en simulación industrial y gemelos digitales para corporativos globales Fortune 500 y como Artista Técnico en estudio de co-desarrollo para título deportivo AAA de clase mundial con crédito verificado en MobyGames (EA Sports College Football 25).',
      en: 'Lead Automation Engineer and Platform Developer combining full-stack web and sensor telemetry with modern AI API integrations and 3D simulation engineering. Currently Lead Automation Engineer & Platform Developer at Orblite, engineering AI workflow automations, vehicle telematics infrastructure, and custom internal ERP/CRM applications (TypeScript, React, RESTful APIs, SQL Supabase, AI/LLM APIs, Cloudflare). Extensive background developing industrial Digital Twins for global Fortune 500 enterprise clients (automotive, tech, and pharmaceutical sectors under strict NDAs) and Technical Art for premier AAA sports franchise at an elite co-development studio (verified shipped credit on MobyGames for EA Sports College Football 25, interactive UI/UX in Frostbite, Perforce P4, and Jenkins CI).',
    },
    digital_twins: {
      es: 'Especialista en Simulación 3D y Gemelos Digitales (Digital Twins) con Unreal Engine 5 y FlexSim. Amplia experiencia modelando líneas de manufactura y ensamble para corporativos globales Fortune 500 con detección de fallas en tiempo real, optimización térmica y espacial de maquinaria, y programas inmersivos de capacitación en Realidad Virtual para reducción de riesgos y aumento de eficiencia operativa.',
      en: 'Industrial 3D Simulation & Digital Twins Specialist with Unreal Engine 5 and Arch FlexSim. Extensive background engineering manufacturing simulation environments for global Fortune 500 leaders with real-time bottleneck detection, thermal layout optimization, and immersive VR operator training simulators to minimize risks and accelerate manufacturing throughput.',
    },
    game_dev: {
      es: 'Desarrollador de Videojuegos y Technical Artist con experiencia en producción deportiva AAA para Electronic Arts (EA Sports College Football 25) mediante el motor Frostbite, así como desarrollo integral en Unreal Engine y plataformas interactivas. Especializado en sistemas de UI/UX interactiva, shaders, integración de animaciones, pruebas automatizadas en Jenkins y gestión de repositorios a gran escala con Perforce.',
      en: 'Senior Technical Artist with proven AAA production track record on premier title EA Sports College Football 25 (CFB 25). Specialized in interactive UI/UX architecture, Frostbite engine optimization, solid 60+ FPS compliance, enterprise Perforce (P4) branching, and automated Jenkins CI testing suites. Balanced background in software engineering, real-time graphics, and tech leadership.',
    },
  };

  const applySummaryPreset = (presetType: 'orblite_leader' | 'digital_twins' | 'game_dev') => {
    updateField('summary', presets[presetType][language]);
  };

  // Quick translate between Spanish and English
  const handleTranslateSummary = () => {
    const current = personalInfo.summary.trim();
    const isCurrentlyEnglish =
      current.startsWith('High-impact') ||
      current.includes('Lead Automation') ||
      current.includes('Commercial Manager') ||
      current.includes('Industrial 3D') ||
      current.includes('Specialized in') ||
      current.includes('Senior Technical Artist with proven');

    if (isCurrentlyEnglish) {
      // Translate to Spanish
      if (current.includes('FlexSim') || current.includes('Digital Twins')) {
        updateField('summary', presets.digital_twins.es);
      } else if (current.includes('College Football') || current.includes('CFB') || current.includes('Technical Artist')) {
        updateField('summary', presets.game_dev.es);
      } else {
        updateField('summary', presets.orblite_leader.es);
      }
    } else {
      // Translate to English
      if (current.includes('FlexSim') || current.includes('Gemelos') || current.includes('simulación')) {
        updateField('summary', presets.digital_twins.en);
      } else if (current.includes('College Football') || current.includes('Frostbite') || current.includes('Artista Técnico')) {
        updateField('summary', presets.game_dev.en);
      } else {
        updateField('summary', presets.orblite_leader.en);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with active language indicator & switch */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            {isEn ? 'Personal & Contact Information' : 'Datos de Contacto y Perfil'}
          </h3>
          <p className="text-xs text-slate-500">
            {isEn
              ? 'This information will be displayed in the header of your CV.'
              : 'Esta información se mostrará en el encabezado de tu Curriculum Vitae.'}
          </p>
        </div>

        {onLanguageChange && (
          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 font-medium px-1">
              {isEn ? 'CV Language:' : 'Idioma CV:'}
            </span>
            <button
              type="button"
              onClick={() => onLanguageChange('es')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                !isEn ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇲🇽 ES
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                isEn ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'Full Name' : 'Nombre Completo'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="Isaac Gómez Estrada"
            />
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'Professional Title / Specialization' : 'Título Profesional / Especialidad'}
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
            placeholder={
              isEn
                ? 'Lead Automation Engineer & Platform Developer | Orblite'
                : 'Lead Automation Engineer & Platform Developer | Orblite'
            }
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'Email Address' : 'Correo Electrónico'}
          </label>
          <div className="relative">
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="isaacgestrada94@gmail.com"
            />
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'Phone Number' : 'Teléfono Móvil'}
          </label>
          <div className="relative">
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="+52 33 1835 9421"
            />
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'Location (City / Work Mode)' : 'Ubicación (Ciudad / Modalidad)'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder={isEn ? 'Zapopan / Guadalajara (On-site / Hybrid / Remote)' : 'Zapopan / Guadalajara (Presencial / Híbrido / Remoto)'}
            />
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <p className="text-[10px] text-emerald-700 font-medium mt-1">
            {isEn ? '✓ On-site availability: Zapopan & Guadalajara, Jalisco' : '✓ Disponibilidad presencial: Zapopan y Guadalajara, Jalisco'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'LinkedIn Profile' : 'Perfil de LinkedIn'}
          </label>
          <div className="relative">
            <input
              type="url"
              value={personalInfo.linkedinUrl}
              onChange={(e) => updateField('linkedinUrl', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="https://www.linkedin.com/in/isaac-gomez-estrada-6959872a0/"
            />
            <Linkedin className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'Website / SaaS Platform' : 'Sitio Web / Plataforma SaaS'}
          </label>
          <div className="relative">
            <input
              type="url"
              value={personalInfo.websiteUrl || ''}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="https://orb-lite.com"
            />
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'GitHub Repository' : 'Repositorio GitHub'}
          </label>
          <div className="relative">
            <input
              type="url"
              value={personalInfo.githubUrl || ''}
              onChange={(e) => updateField('githubUrl', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="https://github.com/Orb-lite/Orb-Lite"
            />
            <Github className="w-3.5 h-3.5 text-slate-800 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'MobyGames Credits (Shipped AAA Titles)' : 'Créditos MobyGames (Títulos AAA)'}
          </label>
          <div className="relative">
            <input
              type="url"
              value={personalInfo.mobygamesUrl || ''}
              onChange={(e) => updateField('mobygamesUrl', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/"
            />
            <Trophy className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-2.5" />
          </div>
          <p className="text-[10px] text-amber-700 font-medium mt-1">
            {isEn
              ? '✓ Verified credit on MobyGames (EA Sports College Football 25)'
              : '✓ Crédito público en MobyGames (EA Sports College Football 25)'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isEn ? 'Portfolio Folder (Google Drive)' : 'Carpeta de Portafolio (Google Drive)'}
          </label>
          <div className="relative">
            <input
              type="url"
              value={personalInfo.portfolioUrl || ''}
              onChange={(e) => updateField('portfolioUrl', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
              placeholder="https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing"
            />
            <FolderOpen className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-2.5" />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {isEn
              ? 'Public Google Drive folder containing showcase works, gameplay demos & certificates'
              : 'Carpeta compartida en Google Drive con muestras de trabajo, demos de videojuegos y certificaciones'}
          </p>
        </div>
      </div>

      {/* Summary Area */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <label className="block text-xs font-bold text-slate-800">
            {isEn ? 'Professional Summary / About Me' : 'Resumen Profesional / Acerca de mí'}
          </label>

          <div className="flex items-center gap-2">
            {/* Translate Button */}
            <button
              type="button"
              onClick={handleTranslateSummary}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md border border-sky-200 transition-colors"
              title={
                isEn
                  ? 'Switch or translate summary between English and Spanish'
                  : 'Traducir o alternar el resumen entre Español e Inglés'
              }
            >
              <Languages className="w-3 h-3 text-sky-600" />
              <span>{isEn ? 'Traducir / Toggle ES ⇄ EN' : 'Traducir al Inglés (ES ⇄ EN)'}</span>
            </button>
          </div>
        </div>

        {/* Preset Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="font-medium text-slate-600">{isEn ? 'Presets (EN):' : 'Sugerencias (ES):'}</span>
          <button
            type="button"
            onClick={() => applySummaryPreset('orblite_leader')}
            className="px-2 py-0.5 bg-white hover:bg-sky-50 text-sky-700 rounded border border-slate-200 hover:border-sky-300 transition-colors font-medium"
          >
            {isEn ? 'Orblite (Commercial & SaaS)' : 'Orblite (Gerente & Full-Stack)'}
          </button>
          <button
            type="button"
            onClick={() => applySummaryPreset('digital_twins')}
            className="px-2 py-0.5 bg-white hover:bg-sky-50 text-sky-700 rounded border border-slate-200 hover:border-sky-300 transition-colors font-medium"
          >
            Digital Twins (Flex)
          </button>
          <button
            type="button"
            onClick={() => applySummaryPreset('game_dev')}
            className="px-2 py-0.5 bg-white hover:bg-sky-50 text-sky-700 rounded border border-slate-200 hover:border-sky-300 transition-colors font-medium"
          >
            AAA EA Sports (College Football 25)
          </button>
        </div>

        <textarea
          rows={6}
          value={personalInfo.summary}
          onChange={(e) => updateField('summary', e.target.value)}
          className="w-full p-2.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none leading-relaxed bg-white"
          placeholder={
            isEn
              ? 'Enter your professional summary highlighting Orblite B2B leadership, Flex Digital Twins, and EA Sports College Football 25 technical art...'
              : 'Escribe tu resumen profesional enfocado en Orblite SaaS, Unreal Engine 5, Digital Twins y EA Sports College Football 25...'
          }
        />
        <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
          <span>
            {isEn
              ? 'Tip: Highlight your achievements in real-time simulation and EA Sports College Football 25.'
              : 'Consejo: Menciona tus logros en simulación en tiempo real y EA Sports College Football 25.'}
          </span>
          <span>{personalInfo.summary.length} {isEn ? 'characters' : 'caracteres'}</span>
        </div>
      </div>
    </div>
  );
};
