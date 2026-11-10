import React from 'react';
import {
  ResumeData,
  StyleConfig,
} from '../../types/resume';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  FolderOpen,
  Award,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Wrench,
  CheckCircle2,
  Gamepad2,
  Trophy,
} from 'lucide-react';

interface ResumeDocumentProps {
  data: ResumeData;
  styleConfig: StyleConfig;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  language?: 'es' | 'en';
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  data,
  styleConfig,
  innerRef,
  language = 'es',
}) => {
  const isEn = language === 'en';

  const t = {
    page1Of2: isEn ? 'Page 1 of 2' : 'Página 1 de 2',
    page2Of2: isEn ? 'Page 2 of 2' : 'Página 2 de 2',
    page2Break: isEn
      ? 'Page 2 Break · 3 spaces from top margin'
      : 'Salto a Página 2 · 3 espacios del borde superior',
    summary: isEn ? 'Professional Summary' : 'Perfil Profesional',
    experienceRecent: isEn
      ? 'Professional Experience (Selected)'
      : 'Experiencia Profesional (Reciente)',
    experienceContinued: isEn
      ? 'Professional Experience (Continued)'
      : 'Continuación de Trayectoria Profesional',
    present: isEn ? 'Present' : 'Presente',
    achievements: isEn ? 'Key Achievements & Metrics' : 'Logros & Métricas',
    skills: isEn ? 'Core Competencies' : 'Competencias Clave',
    skillsAndExpertise: isEn ? 'Skills & Technical Expertise' : 'Habilidades & Especialidad',
    education: isEn ? 'Education' : 'Educación',
    certifications: isEn ? 'Certifications' : 'Certificaciones',
    languages: isEn ? 'Languages' : 'Idiomas',
  };

  const {
    personalInfo,
    experiences,
    education,
    skillCategories,
    languages,
    certifications,
    achievements,
  } = data;
  const {
    template,
    accentColor,
    fontFamily,
    spacing,
    showPhoto,
    fontSize,
  } = styleConfig;

  // Split experiences between Page 1 and Page 2
  const splitIndex = experiences.length > 3 ? 3 : experiences.length;
  const page1Experiences = experiences.slice(0, splitIndex);
  const page2Experiences = experiences.slice(splitIndex);

  // Smart language-aware title & summary resolver to guarantee English when language === 'en'
  const displayTitle = React.useMemo(() => {
    if (!personalInfo.title) return '';
    if (language === 'en') {
      const tLower = personalInfo.title.toLowerCase();
      if (tLower.includes('artista técnico') || tLower.includes('technical artist')) {
        return 'Technical Artist';
      }
      if (tLower.includes('gerente comercial') || tLower.includes('commercial manager')) {
        return 'Technical Artist';
      }
      if (tLower.includes('líder en realidad virtual')) {
        return 'Virtual Reality (VR) & Simulation Lead';
      }
      if (tLower.includes('desarrollador de aplicaciones')) {
        return 'Applications Developer & Unreal Engine Specialist';
      }
    }
    return personalInfo.title;
  }, [personalInfo.title, language]);

  const displaySummary = React.useMemo(() => {
    if (!personalInfo.summary) return '';
    if (language === 'en') {
      const s = personalInfo.summary.trim();
      const sLower = s.toLowerCase();
      // If it contains Spanish words or matches Spanish presets:
      const hasSpanishWords =
        sLower.includes('artista técnico') ||
        sLower.includes('ingeniero de 32 años') ||
        sLower.includes('líder comercial') ||
        sLower.includes('desarrollador') ||
        sLower.includes('especialista en') ||
        sLower.includes('gemelos digitales') ||
        sLower.includes('mi trabajo se enfocó') ||
        sLower.includes('experiencia previa') ||
        sLower.includes('con un perfil integral') ||
        sLower.includes('actualmente');

      if (hasSpanishWords) {
        return "Senior Technical Artist and Real-Time 3D Simulation Engineer with 8+ years of experience bridging art, interactive systems, and production pipelines across AAA game development, industrial digital twins, and virtual environments. Shipped Technical Artist on premier world-class sports franchise EA Sports College Football 25 for a leading global publisher (verified public credit on MobyGames), specializing in interactive UI/UX architecture, Frostbite engine pipelines, 60+ FPS performance optimization, Perforce P4 Helix Core branching, and Jenkins automated CI/CD validation. Extensive background building manufacturing Digital Twins and real-time assembly line simulations for Fortune 500 enterprise leaders (automotive, advanced tech, and pharmaceutical sectors under strict NDAs) with Unreal Engine 5 (UE5) and Arch FlexSim. Strong technical background in custom pipeline tooling (Python, TypeScript, C++, Blueprints, HLSL/Shaders) and cross-platform deployment (PC, Console, VR, Mobile, WebGL).";
      }
    }
    return personalInfo.summary;
  }, [personalInfo.summary, language]);

  // Spacing configurations
  const sectionMargin =
    spacing === 'compact' ? 'mb-3' : spacing === 'relaxed' ? 'mb-6' : 'mb-4';
  const itemGap = spacing === 'compact' ? 'space-y-2' : spacing === 'relaxed' ? 'space-y-4' : 'space-y-3';
  const bulletSpacing = spacing === 'compact' ? 'space-y-0.5' : 'space-y-1';

  // Font family styling
  const fontClass =
    fontFamily === 'serif'
      ? 'font-serif-custom'
      : fontFamily === 'mono'
      ? 'font-mono-custom'
      : 'font-sans-custom';

  // Base font size scaling
  const textScale =
    fontSize === 'sm'
      ? 'text-xs'
      : fontSize === 'md'
      ? 'text-sm'
      : 'text-xs';

  const breakAvoidStyle: React.CSSProperties = {
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  };

  return (
    <div
      ref={innerRef}
      id="resume-print-sheet"
      className={`w-full bg-slate-200/60 text-slate-800 ${fontClass} ${textScale} leading-relaxed selection:bg-slate-200 shadow-xl print:shadow-none print:m-0 print:p-0 print:bg-white`}
    >
      {/* ============================================================ */}
      {/* PAGE 1: HEADER + TOP EXPERIENCES + METRICS + SKILLS           */}
      {/* ============================================================ */}
      <div
        id="resume-page-1"
        className="resume-page bg-white shadow-md print:shadow-none flex flex-col relative"
        style={{ minHeight: '297mm', boxSizing: 'border-box' }}
      >
        {/* TEMPLATE 1: EXECUTIVE CLASSIC */}
        {template === 'executive' && (
          <div className="flex flex-col flex-1">
            {/* Header Banner */}
            <header
              className="p-7 text-white relative overflow-hidden break-inside-avoid"
              data-break-avoid="true"
              style={{ backgroundColor: accentColor, ...breakAvoidStyle }}
            >
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {showPhoto && personalInfo.photoUrl && (
                    <img
                      src={personalInfo.photoUrl}
                      alt={personalInfo.fullName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/80 shadow-md shrink-0"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                      {personalInfo.fullName}
                    </h1>
                    <p className="text-sm font-medium text-slate-200">
                      {displayTitle}
                    </p>
                  </div>
                </div>

                {/* Direct Metrics Callout */}
                {achievements.length > 0 && (
                  <div className="flex items-center gap-3 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/20 shrink-0">
                    <div className="text-center">
                      <div className="text-base font-bold text-white">
                        {achievements[0].metric}
                      </div>
                      <div className="text-[9px] text-slate-200 uppercase tracking-wider">
                        {achievements[0].title}
                      </div>
                    </div>
                    {achievements[1] && (
                      <>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="text-center">
                          <div className="text-base font-bold text-white">
                            {achievements[1].metric}
                          </div>
                          <div className="text-[9px] text-slate-200 uppercase tracking-wider">
                            {achievements[1].title}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Contact Bar */}
              <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-slate-200">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 opacity-80" />
                  <span>{personalInfo.email}</span>
                </a>
                {personalInfo.phone && (
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 opacity-80" />
                    <span>{personalInfo.phone}</span>
                  </a>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 opacity-80" />
                    <span>{personalInfo.location}</span>
                  </span>
                )}
                {personalInfo.linkedinUrl && (
                  <a
                    href={personalInfo.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors underline decoration-white/40"
                  >
                    <Linkedin className="w-3.5 h-3.5 opacity-80" />
                    <span>linkedin.com/in/isaac-gomez-estrada</span>
                  </a>
                )}
                {personalInfo.websiteUrl && (
                  <a
                    href={personalInfo.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 opacity-80" />
                    <span>{personalInfo.websiteUrl.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {personalInfo.githubUrl && (
                  <a
                    href={personalInfo.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 opacity-80" />
                    <span>github.com/Orb-lite/Portafolio</span>
                  </a>
                )}
                {personalInfo.mobygamesUrl && (
                  <a
                    href={personalInfo.mobygamesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors text-amber-200 font-semibold underline decoration-amber-300/40"
                    title="Verified credits on MobyGames"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-300 opacity-95" />
                    <span>{language === 'en' ? 'MobyGames (Shipped AAA Credits)' : 'MobyGames (Créditos Títulos AAA)'}</span>
                  </a>
                )}
                {personalInfo.portfolioUrl && (
                  <a
                    href={personalInfo.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors text-amber-200"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-300 opacity-90" />
                    <span>{language === 'en' ? 'Drive Portfolio' : 'Portafolio Drive'}</span>
                  </a>
                )}
              </div>
            </header>

            {/* Page 1 Body Grid */}
            <div className="p-7 grid grid-cols-12 gap-6 flex-1">
              {/* Main Column (8 cols): Summary + First Experiences */}
              <main className="col-span-8 space-y-4">
                {displaySummary && (
                  <section
                    className={`break-inside-avoid summary-card ${sectionMargin}`}
                    data-break-avoid="true"
                    style={breakAvoidStyle}
                  >
                    <h2
                      className="text-xs uppercase font-bold tracking-wider mb-1.5 flex items-center gap-2"
                      style={{ color: accentColor }}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{t.summary}</span>
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-justify text-[11px]">
                      {displaySummary}
                    </p>
                  </section>
                )}

                <section className={sectionMargin}>
                  <h2
                    className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-2 break-inside-avoid"
                    data-break-avoid="true"
                    style={{ color: accentColor, ...breakAvoidStyle }}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{t.experienceRecent}</span>
                  </h2>

                  <div className={itemGap}>
                    {page1Experiences.map((exp) => (
                      <article
                        key={exp.id}
                        className="break-inside-avoid job-item"
                        data-break-avoid="true"
                        style={breakAvoidStyle}
                      >
                        <div className="flex flex-row items-baseline justify-between gap-1 mb-0.5">
                          <h3 className="font-semibold text-slate-900 text-xs">
                            {exp.role}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-medium shrink-0">
                            {exp.startDate} — {exp.isCurrent ? t.present : (exp.endDate === 'Presente' || exp.endDate === 'Present' ? t.present : exp.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-1.5 font-medium">
                          <span style={{ color: accentColor }}>{exp.company}</span>
                          {exp.location && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>

                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className={`${bulletSpacing} text-slate-600 text-[11px] pl-3.5`}>
                            {exp.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="list-disc list-outside marker:text-slate-400 pl-0.5 leading-normal break-inside-avoid"
                                data-break-avoid="true"
                                style={breakAvoidStyle}
                              >
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              </main>

              {/* Sidebar Column (4 cols): Logros & Competencias Clave */}
              <aside className="col-span-4 space-y-4 border-l border-slate-200 pl-5">
                {achievements && achievements.length > 0 && (
                  <section className={sectionMargin}>
                    <h2
                      className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 break-inside-avoid"
                      data-break-avoid="true"
                      style={{ color: accentColor, ...breakAvoidStyle }}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{t.achievements}</span>
                    </h2>
                    <div className="space-y-1.5">
                      {achievements.map((ach) => (
                        <div
                          key={ach.id}
                          className="p-2 rounded bg-slate-50 border border-slate-100 break-inside-avoid achievement-card"
                          data-break-avoid="true"
                          style={breakAvoidStyle}
                        >
                          <div className="flex items-baseline justify-between mb-0.5">
                            <span className="text-[11px] font-semibold text-slate-800">
                              {ach.title}
                            </span>
                            <span
                              className="font-bold text-xs"
                              style={{ color: accentColor }}
                            >
                              {ach.metric}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {ach.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className={sectionMargin}>
                  <h2
                    className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 break-inside-avoid"
                    data-break-avoid="true"
                    style={{ color: accentColor, ...breakAvoidStyle }}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{t.skills}</span>
                  </h2>
                  <div className="space-y-2.5">
                    {skillCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="space-y-0.5 break-inside-avoid skill-card"
                        data-break-avoid="true"
                        style={breakAvoidStyle}
                      >
                        <h4 className="text-[11px] font-semibold text-slate-700">
                          {cat.name}
                        </h4>
                        <ul className="text-[11px] text-slate-600 space-y-0.5">
                          {cat.skills.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: accentColor }}
                              />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        )}

        {/* TEMPLATE 2: MODERN CLEAN (Page 1) */}
        {template === 'modern' && (
          <div className="p-7 space-y-4 flex-1">
            <header
              className="border-b-2 pb-3 break-inside-avoid"
              data-break-avoid="true"
              style={{ borderColor: accentColor, ...breakAvoidStyle }}
            >
              <div className="flex flex-row justify-between items-end gap-3 mb-2">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {personalInfo.fullName}
                  </h1>
                  <p className="text-sm font-semibold tracking-wide" style={{ color: accentColor }}>
                    {displayTitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1.5">
                <span>{personalInfo.email}</span>
                <span>·</span>
                <span>{personalInfo.phone}</span>
                <span>·</span>
                <span>{personalInfo.location}</span>
                <span>·</span>
                <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>
                {personalInfo.websiteUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.websiteUrl} target="_blank" rel="noreferrer" className="underline">
                      {personalInfo.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </>
                )}
                {personalInfo.githubUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline">GitHub: Portafolio</a>
                  </>
                )}
                {personalInfo.mobygamesUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.mobygamesUrl} target="_blank" rel="noreferrer" className="underline font-semibold text-amber-700">
                      MobyGames (Shipped Credits)
                    </a>
                  </>
                )}
                {personalInfo.portfolioUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline font-medium text-amber-700">
                      {language === 'en' ? 'Drive Portfolio' : 'Portafolio Drive'}
                    </a>
                  </>
                )}
              </div>
            </header>

            {displaySummary && (
              <section
                className="bg-slate-50/80 p-3 rounded border-l-4 border-slate-300 break-inside-avoid"
                style={{ borderLeftColor: accentColor }}
              >
                <p className="text-slate-700 text-justify text-[11px] leading-relaxed">
                  {displaySummary}
                </p>
              </section>
            )}

            <section>
              <h2
                className="text-xs uppercase font-bold tracking-wider pb-1 mb-2.5 border-b border-slate-200"
                style={{ color: accentColor }}
              >
                {t.experienceRecent}
              </h2>
              <div className={itemGap}>
                {page1Experiences.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid job-item">
                    <div className="flex flex-row justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-slate-900 text-xs">{exp.role}</h3>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {exp.startDate} — {exp.isCurrent ? t.present : (exp.endDate === 'Presente' || exp.endDate === 'Present' ? t.present : exp.endDate)}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 mb-1.5">
                      <span style={{ color: accentColor }}>{exp.company}</span>
                      {exp.location && ` · ${exp.location}`}
                    </div>
                    <ul className={`${bulletSpacing} text-slate-600 text-[11px] pl-4`}>
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="list-disc marker:text-slate-400">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-2 border-t border-slate-200">
              <h2
                className="text-xs uppercase font-bold tracking-wider pb-1 mb-2 border-b border-slate-200"
                style={{ color: accentColor }}
              >
                {t.skillsAndExpertise}
              </h2>
              <div className="space-y-1.5">
                {skillCategories.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold text-slate-800 text-[11px]">{c.name}: </span>
                    <span className="text-slate-600 text-[11px]">{c.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TEMPLATE 3 & 4 (Page 1) */}
        {(template === 'minimal' || template === 'tech') && (
          <div className="p-7 space-y-4 flex-1">
            <header className="p-5 bg-slate-900 text-white rounded-lg">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-0.5">
                {personalInfo.fullName}
              </h1>
              <p className="text-sm font-medium text-slate-300 mb-2">
                {displayTitle}
              </p>
              <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-300">
                <span>{personalInfo.email}</span>
                <span>·</span>
                <span>{personalInfo.phone}</span>
                <span>·</span>
                <span>{personalInfo.location}</span>
                {personalInfo.websiteUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.websiteUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                      {personalInfo.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </>
                )}
                {personalInfo.githubUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                      github.com/Orb-lite/Portafolio
                    </a>
                  </>
                )}
                {personalInfo.mobygamesUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.mobygamesUrl} target="_blank" rel="noreferrer" className="underline hover:text-amber-300 text-amber-300 font-semibold">
                      MobyGames (Shipped Credits)
                    </a>
                  </>
                )}
                {personalInfo.portfolioUrl && (
                  <>
                    <span>·</span>
                    <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:text-amber-300 text-amber-200 font-medium">
                      {language === 'en' ? 'Drive Portfolio' : 'Portafolio Drive'}
                    </a>
                  </>
                )}
              </div>
            </header>

            {displaySummary && (
              <section className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="text-slate-700 text-justify text-[11px] leading-relaxed">
                  {displaySummary}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 pb-1 border-b border-slate-200">
                {t.experienceRecent}
              </h2>
              <div className={itemGap}>
                {page1Experiences.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-slate-900 text-xs">{exp.role}</span>
                      <span className="text-[10px] text-slate-500">
                        {exp.startDate} — {exp.isCurrent ? t.present : (exp.endDate === 'Presente' || exp.endDate === 'Present' ? t.present : exp.endDate)}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-blue-900 mb-1">{exp.company}</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                      {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-2 border-t border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                {t.skills}
              </h2>
              <div className="space-y-1 text-[11px]">
                {skillCategories.map((c) => (
                  <div key={c.id}>
                    <strong className="text-slate-800">{c.name}:</strong> <span className="text-slate-600">{c.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Page 1 Footer indicator */}
        <div className="px-7 py-2 text-right text-[10px] text-slate-400 border-t border-slate-100">
          {t.page1Of2}
        </div>
      </div>

      {/* Visual Page Break Guide in Preview */}
      <div className="no-print my-4 flex items-center justify-center gap-3">
        <div className="h-px bg-slate-300 flex-1 max-w-xs" />
        <span className="text-[11px] font-semibold text-slate-500 bg-white px-3 py-1 rounded-full shadow-xs border border-slate-200">
          {t.page2Break}
        </span>
        <div className="h-px bg-slate-300 flex-1 max-w-xs" />
      </div>

      {/* ============================================================ */}
      {/* PAGE 2: 3 SPACES TOP MARGIN + REMAINING JOBS + EDUCACIÓN     */}
      {/* ============================================================ */}
      <div
        id="resume-page-2"
        className="resume-page bg-white shadow-md print:shadow-none flex flex-col relative"
        style={{
          minHeight: '297mm',
          boxSizing: 'border-box',
          breakBefore: 'page',
          pageBreakBefore: 'always',
        }}
      >
        {/* TEMPLATE 1: EXECUTIVE CLASSIC (Page 2) */}
        {template === 'executive' && (
          <div className="flex flex-col flex-1">
            {/* 3 espacios del borde superior: pt-10 (~40px) en ambas columnas */}
            <div className="pt-10 px-7 pb-7 grid grid-cols-12 gap-6 flex-1">
              {/* Main Column (8 cols): Continuación de Experiencia */}
              <main className="col-span-8 space-y-4">
                <section className={sectionMargin}>
                  <h2
                    className="text-xs uppercase font-bold tracking-wider mb-2.5 flex items-center gap-2 break-inside-avoid"
                    data-break-avoid="true"
                    style={{ color: accentColor, ...breakAvoidStyle }}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{t.experienceContinued}</span>
                  </h2>

                  <div className={itemGap}>
                    {page2Experiences.map((exp) => (
                      <article
                        key={exp.id}
                        className="break-inside-avoid job-item"
                        data-break-avoid="true"
                        style={breakAvoidStyle}
                      >
                        <div className="flex flex-row items-baseline justify-between gap-1 mb-0.5">
                          <h3 className="font-semibold text-slate-900 text-xs">
                            {exp.role}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-medium shrink-0">
                            {exp.startDate} — {exp.isCurrent ? t.present : (exp.endDate === 'Presente' || exp.endDate === 'Present' ? t.present : exp.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-1.5 font-medium">
                          <span style={{ color: accentColor }}>{exp.company}</span>
                          {exp.location && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>

                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className={`${bulletSpacing} text-slate-600 text-[11px] pl-3.5`}>
                            {exp.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="list-disc list-outside marker:text-slate-400 pl-0.5 leading-normal break-inside-avoid"
                                data-break-avoid="true"
                                style={breakAvoidStyle}
                              >
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              </main>

              {/* Sidebar Column (4 cols, el lateral con los 3 espacios del borde superior):
                  EDUCACIÓN COMPLETO + CERTIFICACIONES + IDIOMAS */}
              <aside className="col-span-4 space-y-5 border-l border-slate-200 pl-5">
                {/* 1. EDUCACIÓN (COMPLETO EN LA SEGUNDA PÁGINA) */}
                <section className={sectionMargin}>
                  <h2
                    className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 break-inside-avoid"
                    data-break-avoid="true"
                    style={{ color: accentColor, ...breakAvoidStyle }}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{t.education}</span>
                  </h2>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className="break-inside-avoid edu-item p-2 rounded bg-slate-50 border border-slate-100"
                        data-break-avoid="true"
                        style={breakAvoidStyle}
                      >
                        <h3 className="font-semibold text-slate-900 text-[11px] leading-snug">
                          {edu.degree}
                        </h3>
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          {edu.institution} · {edu.graduationYear}
                        </p>
                        {edu.details && (
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {edu.details}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. CERTIFICACIONES PROFESIONALES */}
                {certifications && certifications.length > 0 && (
                  <section className={sectionMargin}>
                    <h2
                      className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 break-inside-avoid"
                      data-break-avoid="true"
                      style={{ color: accentColor, ...breakAvoidStyle }}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{t.certifications}</span>
                    </h2>
                    <div className="space-y-1.5">
                      {certifications.map((cert) => (
                        <div
                          key={cert.id}
                          className="break-inside-avoid cert-item text-[10px] p-1.5 rounded bg-slate-50/80 border border-slate-100"
                          data-break-avoid="true"
                          style={breakAvoidStyle}
                        >
                          <p className="font-medium text-slate-800 leading-tight">
                            {cert.name}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {cert.issuer} {cert.year ? `(${cert.year})` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. IDIOMAS */}
                {languages && languages.length > 0 && (
                  <section
                    className={`break-inside-avoid languages-card ${sectionMargin}`}
                    data-break-avoid="true"
                    style={breakAvoidStyle}
                  >
                    <h2
                      className="text-xs uppercase font-bold tracking-wider mb-1.5"
                      style={{ color: accentColor }}
                    >
                      {t.languages}
                    </h2>
                    <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                      {languages.map((l) => (
                        <div key={l.id} className="flex items-center gap-1">
                          <span className="font-medium text-slate-800">{l.name}:</span>
                          <span>{l.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </aside>
            </div>
          </div>
        )}

        {/* TEMPLATE 2, 3, 4 (Page 2) */}
        {template !== 'executive' && (
          <div className="pt-10 px-7 pb-7 grid grid-cols-12 gap-6 flex-1">
            <main className="col-span-8 space-y-4">
              <section>
                <h2
                  className="text-xs uppercase font-bold tracking-wider pb-1 mb-2.5 border-b border-slate-200"
                  style={{ color: accentColor }}
                >
                  {t.experienceContinued}
                </h2>
                <div className={itemGap}>
                  {page2Experiences.map((exp) => (
                    <div key={exp.id} className="break-inside-avoid job-item">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-slate-900 text-xs">{exp.role}</span>
                        <span className="text-[10px] text-slate-500">
                          {exp.startDate} — {exp.isCurrent ? t.present : (exp.endDate === 'Presente' || exp.endDate === 'Present' ? t.present : exp.endDate)}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 mb-1">
                        <span style={{ color: accentColor }}>{exp.company}</span>
                      </div>
                      <ul className={`${bulletSpacing} text-slate-600 text-[11px] pl-4`}>
                        {exp.highlights.map((h, i) => <li key={i} className="list-disc">{h}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            <aside className="col-span-4 space-y-4 border-l border-slate-200 pl-5">
              <section>
                <h2
                  className="text-xs uppercase font-bold tracking-wider pb-1 mb-2 border-b border-slate-200"
                  style={{ color: accentColor }}
                >
                  {t.education}
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                      <div className="font-semibold text-slate-800 text-[11px]">{edu.degree}</div>
                      <div className="text-[10px] text-slate-500">{edu.institution} ({edu.graduationYear})</div>
                      {edu.details && <p className="text-[10px] text-slate-500 mt-1">{edu.details}</p>}
                    </div>
                  ))}
                </div>
              </section>

              {certifications.length > 0 && (
                <section>
                  <h2
                    className="text-xs uppercase font-bold tracking-wider pb-1 mb-2 border-b border-slate-200"
                    style={{ color: accentColor }}
                  >
                    {t.certifications}
                  </h2>
                  <div className="space-y-1 text-[10px] text-slate-600">
                    {certifications.map((c) => (
                      <div key={c.id}>• {c.name} — {c.issuer} ({c.year})</div>
                    ))}
                  </div>
                </section>
              )}

              {languages.length > 0 && (
                <section>
                  <h2
                    className="text-xs uppercase font-bold tracking-wider pb-1 mb-1 border-b border-slate-200"
                    style={{ color: accentColor }}
                  >
                    {t.languages}
                  </h2>
                  <div className="text-[11px] text-slate-600">
                    {languages.map((l) => `${l.name} (${l.level})`).join(' · ')}
                  </div>
                </section>
              )}
            </aside>
          </div>
        )}

        {/* Page 2 Footer indicator */}
        <div className="px-7 py-2 text-right text-[10px] text-slate-400 border-t border-slate-100">
          {t.page2Of2}
        </div>
      </div>
    </div>
  );
};
