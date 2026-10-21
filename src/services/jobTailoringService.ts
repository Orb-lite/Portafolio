import { ResumeData, JobMatchResult, CoverLetterData } from '../types/resume';
import { GoogleGenAI } from '@google/genai';

/**
 * Detects whether the job offer text is primarily Spanish or English
 */
export function detectLanguage(text: string): 'es' | 'en' {
  if (!text || text.trim().length === 0) return 'es';

  const clean = text.toLowerCase();
  
  const spanishMarkers = [
    ' de ', ' en ', ' el ', ' la ', ' los ', ' las ', ' para ', ' con ', ' por ',
    'requisitos', 'experiencia', 'puesto', 'funciones', 'empresa', 'vacante',
    'habilidades', 'ofrecemos', 'conocimientos', 'años', 'sueldo', 'perfil',
    'licenciatura', 'ingeniería', 'remoto', 'híbrido', 'jornada', 'trabajo'
  ];

  const englishMarkers = [
    ' the ', ' in ', ' of ', ' to ', ' for ', ' with ', ' and ', ' at ', ' on ',
    'requirements', 'experience', 'position', 'responsibilities', 'company', 'role',
    'skills', 'qualifications', 'we offer', 'years', 'salary', 'profile',
    'bachelor', 'degree', 'remote', 'hybrid', 'full-time', 'job', 'seeking'
  ];

  let esScore = 0;
  let enScore = 0;

  for (const m of spanishMarkers) {
    const matches = clean.split(m).length - 1;
    esScore += matches * 2;
  }

  for (const m of englishMarkers) {
    const matches = clean.split(m).length - 1;
    enScore += matches * 2;
  }

  return esScore >= enScore ? 'es' : 'en';
}

/**
 * Sample job proposals for quick testing
 */
export const SAMPLE_JOB_OFFERS = [
  {
    id: 'sample-cgbot-devbot',
    title: 'CGBOT / DEVBOT - Artista Técnico / Technical Artist (Co-Desarrollo AAA & Perfil Discreto)',
    lang: 'es' as const,
    text: `Convocatoria: Artista Técnico (Technical Artist) - Videojuegos AAA & Co-Desarrollo
Empresa: CGBOT / DEVBOT
Ubicación: Guadalajara / Zapopan, Jalisco (Presencial / Híbrido) o Remoto

Sobre Nosotros:
En CGBOT / DEVBOT somos un estudio líder internacional especializado en co-desarrollo y external development para los publishers y franquicias AAA más prestigiosas de la industria de videojuegos. Buscamos incorporar a nuestro equipo a un Artista Técnico con experiencia probada en pipelines de producción de alta exigencia, rigor en control de versiones y estricto respeto a la confidencialidad de nuestros clientes y acuerdos de no divulgación (NDA).

Responsabilidades:
- Servir de puente técnico entre las áreas de arte y programación para la integración de UI/UX interactiva, shaders y optimización gráfica en tiempo real a 60+ FPS.
- Integración en motores de juego líderes (Unreal Engine / motores propietarios AAA) asegurando coherencia visual y estabilidad de frames.
- Integración disciplinada de assets mediante control de versiones empresarial Perforce (P4 Helix Core) y validación continua en Jenkins CI.
- Desarrollar y verificar los primeros builds funcionales y jugables para entregas clave a publishers internacionales.
- Salvaguardar la privacidad, discreción profesional y acuerdos de confidencialidad de todos los proyectos del estudio.

Requisitos:
- Grado universitario en Ingeniería en Tecnologías Interactivas de Animación Digital, Ciencias de la Computación o afín.
- Experiencia previa comprobable en pipelines de co-desarrollo AAA o estudios de videojuegos.
- Dominio de control de versiones con Perforce (P4) y automatización CI (Jenkins).
- Disponibilidad para colaborar presencialmente en Zapopan / Guadalajara o bajo esquema híbrido/remoto.
- Se valorará especialmente haber colaborado previamente en nuestro pipeline o contar con créditos públicos verificables en títulos AAA lanzados.`,
  },
  {
    id: 'sample-ta-ea',
    title: 'Senior Technical Artist (AAA Games & Real-Time Engines) - Remote / USA / MX',
    lang: 'en' as const,
    text: `Job Opportunity: Senior Technical Artist (AAA Sports / Real-Time 3D)
Company: Premier Interactive Studios
Location: Remote (US / Mexico)

About the Role:
We are seeking a seasoned Senior Technical Artist with deep expertise in real-time game engines (Unreal Engine 5, Frostbite, or proprietary engines) to build next-generation interactive systems for premier sports and action titles.

Key Responsibilities:
- Bridge the gap between art and engineering teams to ensure optimal UI/UX visual fidelity and solid 60+ FPS performance.
- Develop interactive UI systems, gameplay shaders, and technical art pipelines.
- Manage asset integration, version control workflows with Perforce (Helix Core), and continuous integration pipelines with Jenkins.
- Conduct technical validation on early playable builds, identifying performance bottlenecks and memory constraints.
- Maintain strict respect for studio confidentiality and client non-disclosure agreements (NDAs).

Requirements:
- 4+ years of professional experience as a Technical Artist or Engine Specialist on shipped PC/console or VR titles.
- Proven experience with Perforce, Jenkins CI/CD, and asset optimization.
- Strong knowledge of Unreal Engine (Blueprints, UI/UMG) or Frostbite engine is a major plus.
- Passion for sports titles, interactive fidelity, and scalable production pipelines.`,
  },
  {
    id: 'sample-commercial-saas',
    title: 'Gerente Comercial B2B / SaaS & Soluciones de Telemetría Vehicular - CDMX / Remoto',
    lang: 'es' as const,
    text: `Vacante: Gerente Comercial B2B & Desarrollo de Negocios Tecnológicos
Empresa: Soluciones Móviles & Telematics Corp.
Modalidad: Híbrido / Remoto (México)

Objetivo del Puesto:
Liderar la estrategia de ventas B2B para nuestra plataforma SaaS de gestión de flotas y telemetría vehicular, impulsando el cierre de contratos corporativos y la prospección estratégica mediante herramientas modernas de automatización e Inteligencia Artificial.

Responsabilidades Principales:
- Liderar el ciclo completo de ventas consultivas B2B para soluciones tecnológicas de rastreo y administración de activos vehiculares.
- Desarrollar e implementar métodos innovadores de prospección y calificación de leads con Inteligencia Artificial.
- Manejo integral de CRM y coordinación con el equipo de producto e ingeniería para atender requerimientos técnicos de clientes.
- Negociación y cierre con tomadores de decisiones (Directores de Operaciones, Logística y Finanzas).

Requisitos indispensables:
- Experiencia comprobable en ventas B2B de tecnología, plataformas SaaS o sistemas de telemetría/GPS.
- Comprensión de herramientas tecnológicas (CRM, ERP, automatizaciones y métricas comerciales).
- Excelente capacidad de comunicación estratégica y visión de negocio.`,
  },
  {
    id: 'sample-simulation-flex',
    title: 'Ingeniero de Simulación & Gemelos Digitales (Unreal Engine 5 / FlexSim)',
    lang: 'es' as const,
    text: `Posición: Ingeniero de Gemelos Digitales & Simulación Industrial en Realidad Virtual
Empresa: Global Manufacturing Innovations
Ubicación: Guadalajara / Zapopan, Jalisco

Descripción del Puesto:
Buscamos un Ingeniero Especialista en Simulación 3D para diseñar y ejecutar Gemelos Digitales (Digital Twins) de líneas de ensamble automatizadas para clientes industriales globales Fortune 500 (automotriz, farmacéutico y tech bajo acuerdos de confidencialidad).

Funciones:
- Desarrollar simulaciones interactivas en Unreal Engine 5 y FlexSim para predecir fallas de maquinaria y optimizar espacios en planta.
- Construir simuladores inmersivos en Realidad Virtual (VR) para capacitación segura de operadores.
- Colaborar estrechamente con equipos multidisciplinarios de ingeniería de manufactura.

Requisitos:
- Dominio avanzado de Unreal Engine 5 (Blueprints, optimización en tiempo real, colisiones y rendering).
- Experiencia en Realidad Virtual (Meta Quest / HTC Vive) y modelado de procesos industriales.`,
  },
];

/**
 * Analyzes a job offer and generates both a Cover Letter and an optimized CV profile
 */
export async function analyzeJobOffer(
  jobText: string,
  currentResume: ResumeData,
  manualLanguage?: 'es' | 'en'
): Promise<JobMatchResult> {
  const detectedLang = manualLanguage || detectLanguage(jobText);

  // Try Gemini API if an API key is available in the environment
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5) {
    try {
      const aiResult = await callGeminiAnalysis(jobText, currentResume, detectedLang, apiKey);
      if (aiResult) return aiResult;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local intelligent engine:', err);
    }
  }

  // Fallback to our high-precision deterministic NLP tailoring engine
  return runLocalJobTailoring(jobText, currentResume, detectedLang);
}

/**
 * Gemini API implementation using @google/genai and gemini-3.8-flash
 */
async function callGeminiAnalysis(
  jobText: string,
  resume: ResumeData,
  language: 'es' | 'en',
  apiKey: string
): Promise<JobMatchResult | null> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a high-level executive recruiter, game development producer, and career strategist.
Analyze the following job proposal and the candidate's real profile (Isaac Gómez Estrada), and create:
1. An exceptional, tailored Cover Letter addressed "A quien corresponda:" (if Spanish) or "To Whom It May Concern:" (if English), or to the specific hiring team if mentioned. It MUST be written entirely in ${language === 'es' ? 'Spanish' : 'English'}.
2. An optimized candidate Title and Professional Summary tailored specifically for this proposal, matching relevant keywords and Isaac's authentic achievements.
3. A match score (0-100) and list of matched keywords.

CRITICAL PRIVACY & DISCRETION RULE (NDA COMPLIANCE):
Isaac Gomez Estrada values client privacy, non-disclosure agreements (NDAs), and professional discretion above all. Do NOT carelessly broadcast internal client names (such as Ford, Google, Amazon, Pfizer, Electronic Arts). Instead, refer to them professionally and discreetly:
- For AAA game dev work: 'producciones y franquicias deportivas AAA de calibre internacional para publisher global líder (créditos públicos y verificables en títulos lanzados)' with Frostbite, Perforce (P4), and Jenkins CI.
- For industrial simulation: 'proyectos de Gemelos Digitales (Digital Twins) para corporativos globales Fortune 500 (sectores automotriz, tecnología avanzada y farmacéutica bajo estrictos acuerdos de confidencialidad)' with Unreal Engine 5 and FlexSim.
- If the job offer is from CGBOT or DEVBOT: Recognize that Isaac already worked at DEVBOT as Technical Artist on their major AAA productions. Express genuine enthusiasm to rejoin/reconnect with DEVBOT / CGBOT, highlight zero ramp-up time, proven mastery of their Perforce/Jenkins/Frostbite pipelines, availability on-site in Zapopan / Guadalajara (or hybrid/remote), and his proven dedication to protecting studio and client confidentiality!

Job Proposal:
${jobText}

Candidate Profile:
Name: ${resume.personalInfo.fullName}
Current: ${resume.personalInfo.title}
Location: ${resume.personalInfo.location || 'Zapopan / Guadalajara, Jalisco, México (Presencial, Híbrido o Remoto)'}
Contact: ${resume.personalInfo.email} · ${resume.personalInfo.phone}
Portfolio & Links:
- Website / SaaS Platform: ${resume.personalInfo.websiteUrl || 'https://orb-lite.com'}
- GitHub: ${resume.personalInfo.githubUrl || 'https://github.com/Orb-lite/Orb-Lite'}
- Portfolio Folder (Google Drive): ${resume.personalInfo.portfolioUrl || 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing'}
- LinkedIn: ${resume.personalInfo.linkedinUrl}
Key experience:
- Orblite (Jun 2026-Present): Lead Automation Engineer & Platform Developer (AI workflow automation, telematics & data simulation infrastructure, internal ERP/CRM tooling, TypeScript, React, RESTful APIs, SQL Supabase, AI/LLM API Integration, Cloudflare).
- Flex (Jun 2024-Apr 2026): Applications Developer & Unreal Engine Specialist (Digital Twins of assembly lines for Fortune 500 enterprise clients under NDA, UE5, FlexSim, real-time machine fault detection, thermal spacing, VR operator training).
- DEVBOT (Jan 2022-Aug 2023): Technical Artist on premier world-class AAA sports titles for a leading global publisher, interactive UI/UX, Frostbite engine, Perforce (P4 Helix Core), Jenkins automated CI testing, 60+ FPS verification.
- Education: Ingeniería en Tecnologías Interactivas de Animación Digital - Universidad del Valle de México (UVM 2013-2018). (English: B.S. in Interactive Technologies & Digital Animation Engineering - UVM 2013-2018).

Respond ONLY with valid JSON matching this schema:
{
  "extractedTitle": "Target position title",
  "extractedCompany": "Company name or Hiring Team",
  "matchScore": 92,
  "matchedKeywords": ["Keyword 1", "Keyword 2", ...],
  "suggestedTitle": "Optimized candidate professional title",
  "suggestedSummary": "Optimized professional summary in ${language === 'es' ? 'Spanish' : 'English'}",
  "coverLetter": {
    "salutation": "${language === 'es' ? 'A quien corresponda:' : 'To Whom It May Concern:'}",
    "opening": "Opening paragraph expressing targeted interest in the role...",
    "bodyParagraphs": [
      "First body paragraph detailing the most relevant track record matching the job...",
      "Second body paragraph detailing technical stack, methodologies, and specific achievements..."
    ],
    "closing": "Closing paragraph with value proposition and interview availability...",
    "signoff": "${language === 'es' ? 'Atentamente,' : 'Sincerely,'}"
  }
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  if (!parsed.coverLetter) return null;

  const todayStr = new Intl.DateTimeFormat(language === 'es' ? 'es-MX' : 'en-US', {
    dateStyle: 'long',
  }).format(new Date());

  const fullText = [
    resume.personalInfo.fullName,
    resume.personalInfo.title,
    `${resume.personalInfo.email} · ${resume.personalInfo.phone} · ${resume.personalInfo.location}`,
    [
      resume.personalInfo.linkedinUrl ? `LinkedIn: ${resume.personalInfo.linkedinUrl}` : '',
      `Website: ${resume.personalInfo.websiteUrl || 'https://orb-lite.com'}`,
      `GitHub: ${resume.personalInfo.githubUrl || 'https://github.com/Orb-lite/Orb-Lite'}`,
      `Portafolio Drive: ${resume.personalInfo.portfolioUrl || 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing'}`,
    ].filter(Boolean).join(' · '),
    '',
    todayStr,
    '',
    parsed.extractedCompany ? `Atención: ${parsed.extractedCompany}` : (language === 'es' ? 'A quien corresponda' : 'To Whom It May Concern'),
    `Ref: ${parsed.extractedTitle || 'Candidatura Profesional'}`,
    '',
    parsed.coverLetter.salutation,
    '',
    parsed.coverLetter.opening,
    '',
    ...(parsed.coverLetter.bodyParagraphs || []).map((p: string) => `${p}\n`),
    parsed.coverLetter.closing,
    '',
    parsed.coverLetter.signoff,
    resume.personalInfo.fullName,
  ].join('\n');

  let finalSummary = parsed.suggestedSummary || '';
  if (language === 'en') {
    const sLower = (finalSummary || '').toLowerCase();
    if (!finalSummary || sLower.includes('líder comercial') || sLower.includes('desarrollador') || sLower.includes('artista técnico') || sLower.includes('con un perfil integral')) {
      finalSummary = "Lead Automation Engineer and Platform Developer combining full-stack web and sensor telemetry with modern AI API integrations and 3D simulation engineering. Currently Lead Automation Engineer & Platform Developer at Orblite, engineering AI workflow automations, vehicle telematics infrastructure, and custom internal ERP/CRM applications (TypeScript, React, RESTful APIs, SQL Supabase, AI/LLM APIs, Cloudflare). Extensive background developing industrial Digital Twins for global Fortune 500 enterprise clients (automotive, tech, and pharmaceutical sectors under strict NDAs) and Technical Art for premier AAA sports franchise at an elite co-development studio (verified shipped credit on MobyGames for EA Sports College Football 25, interactive UI/UX in Frostbite, Perforce P4, and Jenkins CI).";
    }
  } else if (!finalSummary) {
    finalSummary = resume.personalInfo.summary;
  }

  return {
    detectedLanguage: language,
    matchScore: parsed.matchScore || 90,
    extractedTitle: parsed.extractedTitle || (language === 'es' ? 'Puesto Especializado' : 'Specialized Role'),
    extractedCompany: parsed.extractedCompany || (language === 'es' ? 'Empresa Líder' : 'Hiring Organization'),
    matchedKeywords: parsed.matchedKeywords || ['Unreal Engine 5', 'TypeScript', 'React', 'AI Automation', 'Telematics'],
    suggestedTitle: parsed.suggestedTitle || (language === 'en' ? 'Lead Automation Engineer & Platform Developer | Orblite' : resume.personalInfo.title),
    suggestedSummary: finalSummary,
    coverLetter: {
      recipient: parsed.extractedCompany || (language === 'es' ? 'A quien corresponda' : 'To Whom It May Concern'),
      jobTitle: parsed.extractedTitle || '',
      companyName: parsed.extractedCompany || '',
      date: todayStr,
      salutation: parsed.coverLetter.salutation,
      opening: parsed.coverLetter.opening,
      bodyParagraphs: parsed.coverLetter.bodyParagraphs,
      closing: parsed.coverLetter.closing,
      signoff: parsed.coverLetter.signoff,
      fullName: resume.personalInfo.fullName,
      language,
    },
    coverLetterFullText: fullText,
  };
}

/**
 * Robust deterministic tailoring engine with CGBOT / DEVBOT & Privacy Discretion detection
 */
function runLocalJobTailoring(
  jobText: string,
  resume: ResumeData,
  language: 'es' | 'en'
): JobMatchResult {
  const lower = jobText.toLowerCase();

  // Extract job title and company if recognizable
  let extractedTitle = '';
  let extractedCompany = '';

  const lines = jobText.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    const lLower = line.toLowerCase();
    if (lLower.includes('puesto:') || lLower.includes('vacante:') || lLower.includes('posición:') || lLower.includes('convocatoria:') || lLower.includes('role:') || lLower.includes('position:') || lLower.includes('title:')) {
      extractedTitle = line.replace(/^(puesto|vacante|posición|convocatoria|role|position|title|job title)\s*:\s*/i, '').trim();
    }
    if (lLower.includes('empresa:') || lLower.includes('company:')) {
      extractedCompany = line.replace(/^(empresa|company)\s*:\s*/i, '').trim();
    }
  }

  const isCgbotOrDevbot = lower.includes('cgbot') || lower.includes('devbot');
  if (isCgbotOrDevbot && !extractedCompany) {
    extractedCompany = 'CGBOT / DEVBOT';
  }

  // If not extracted with prefix, look for common role patterns
  if (!extractedTitle) {
    if (lower.includes('technical artist') || lower.includes('artista técnico')) {
      extractedTitle = language === 'es' ? 'Artista Técnico Senior (Technical Artist)' : 'Senior Technical Artist';
    } else if (lower.includes('unreal engine') || lower.includes('desarrollador unreal')) {
      extractedTitle = language === 'es' ? 'Desarrollador Unreal Engine 5 & Simulación' : 'Unreal Engine 5 & Simulation Developer';
    } else if (lower.includes('comercial') || lower.includes('b2b') || lower.includes('ventas') || lower.includes('sales')) {
      extractedTitle = language === 'es' ? 'Líder de Automatización & Plataformas Tecnológicas' : 'Lead Automation Engineer & Platform Leader';
    } else if (lower.includes('digital twin') || lower.includes('gemelos digitales') || lower.includes('simulaci')) {
      extractedTitle = language === 'es' ? 'Ingeniero de Gemelos Digitales & Realidad Virtual' : 'Digital Twins & VR Simulation Engineer';
    } else if (lines.length > 0) {
      extractedTitle = lines[0].replace(/^(vacante|oferta|convocatoria|job opportunity|opening)\s*:\s*/i, '').slice(0, 60);
    } else {
      extractedTitle = language === 'es' ? 'Posición Tecnológica' : 'Target Position';
    }
  }

  // Identify domain focus
  const isGaming = isCgbotOrDevbot || lower.includes('game') || lower.includes('juego') || lower.includes('frostbite') || lower.includes('college football') || lower.includes('cfb') || lower.includes('ea') || lower.includes('perforce') || lower.includes('technical artist');
  const isSimulation = lower.includes('digital twin') || lower.includes('gemelo') || lower.includes('flexsim') || lower.includes('vr') || lower.includes('virtual reality') || lower.includes('manufactura') || lower.includes('ensamble') || lower.includes('planta');
  const isCommercial = lower.includes('comercial') || lower.includes('ventas') || lower.includes('sales') || lower.includes('b2b') || lower.includes('crm') || lower.includes('erp') || lower.includes('telemetr') || lower.includes('vehicular') || lower.includes('prospecc') || lower.includes('saas');

  // Find matched keywords (All discreet and professional)
  const allPotentialKeywords = [
    'Unreal Engine 5', 'Unreal Engine 4', 'Frostbite Engine', 'Títulos AAA (Créditos Verificados)',
    'Perforce (P4 Helix Core)', 'Jenkins (CI/CD)', 'UI/UX interactiva', 'Realidad Virtual (VR)',
    'Digital Twins (Gemelos Digitales)', 'Arch FlexSim', 'Corporativos Fortune 500 (Bajo NDA)',
    'TypeScript', 'React', 'Tailwind CSS', 'Supabase', 'SQL', 'APIs REST', 'Vercel / Cloudflare',
    'Ventas B2B', 'Estrategia Comercial', 'Prospección con Inteligencia Artificial',
    'Sistemas CRM / ERP Propietarios', 'Administración y Telemetría Vehicular',
    'Confidencialidad & Acuerdos NDA'
  ];

  const matchedKeywords = allPotentialKeywords.filter((k) => {
    const kParts = k.toLowerCase().split(/[\s/()&,]+/);
    return kParts.some((part) => part.length > 2 && lower.includes(part));
  });

  if (matchedKeywords.length < 3) {
    if (isCgbotOrDevbot) matchedKeywords.push('Perforce (P4)', 'Jenkins (CI/CD)', 'Frostbite Engine', 'Confidencialidad & NDA');
    else if (isGaming) matchedKeywords.push('Frostbite Engine', 'Títulos AAA', 'Perforce', 'Jenkins');
    else if (isSimulation) matchedKeywords.push('Unreal Engine 5', 'Digital Twins', 'VR', 'FlexSim');
    else if (isCommercial) matchedKeywords.push('Ventas B2B', 'SaaS', 'CRM/ERP', 'Prospección IA');
  }

  // Calculate realistic match score
  let matchScore = 85 + Math.min(matchedKeywords.length * 3, 13);
  if (isCgbotOrDevbot) matchScore = 96;
  if (matchScore > 98) matchScore = 98;

  const todayStr = new Intl.DateTimeFormat(language === 'es' ? 'es-MX' : 'en-US', {
    dateStyle: 'long',
  }).format(new Date());

  // Generate localized Cover Letter
  let opening = '';
  let bodyParagraphs: string[] = [];
  let closing = '';
  let suggestedTitle = '';
  let suggestedSummary = '';

  if (language === 'es') {
    if (isCgbotOrDevbot) {
      suggestedTitle = 'Artista Técnico Senior | Co-Desarrollo AAA & Pipelines de Producción';
      suggestedSummary = `Artista Técnico Senior con probada trayectoria previa en DEVBOT colaborando en producciones deportivas AAA de calibre internacional para publisher global líder. Especializado en arquitectura e integración de UI/UX fluida a 60+ FPS, motor Frostbite y Unreal Engine, control de versiones con Perforce (P4) y automatización CI con Jenkins. Firme compromiso con la confidencialidad, acuerdos de no divulgación (NDA) y respeto absoluto a la propiedad intelectual de clientes y socios.`;

      opening = `Me dirijo a ustedes con gran entusiasmo y genuina satisfacción para presentar mi postulación a la posición de ${extractedTitle} en CGBOT / DEVBOT. Habiendo colaborado previamente como Artista Técnico en su equipo para producciones deportivas AAA de máximo nivel, conozco de primera mano la excelencia de sus flujos de trabajo, los rigurosos estándares de entrega y el valor fundamental que representan la confidencialidad, los acuerdos de no divulgación (NDA) y la discreción profesional en el co-desarrollo.`;

      bodyParagraphs = [
        `En mi etapa anterior en DEVBOT, tuve la satisfacción de desarrollar, integrar y validar técnicamente los primeros builds jugables de producciones deportivas AAA globales insignia, especializándome en UI/UX interactiva y motor Frostbite a 60+ FPS estables. Mi día a día implicó una gestión disciplinada de ramas en Perforce (P4 Helix Core), pipelines de integración continua con Jenkins y un estricto respeto a las políticas de privacidad y datos confidenciales del publisher, principios éticos que he mantenido de manera intachable a lo largo de toda mi carrera profesional.`,
        `Actualmente, mi experiencia como Gerente Comercial y Desarrollador en Orblite (plataforma SaaS, CRM/ERP y prospección con IA) sumada a mi trayectoria en gemelos digitales industriales en Flex para corporativos Fortune 500 me permite aportar una visión transversal y madura: capacidad de entrega técnica inmediata sin periodo de adaptación en sus flujos de trabajo, disponibilidad presencial en Zapopan y Guadalajara (o modalidad híbrida/remota), y la total tranquilidad ética de contar con un profesional que salvaguarda la reputación y acuerdos de privacidad del estudio.`
      ];

      closing = `Será un verdadero honor tener la oportunidad de conversar con el equipo directivo y técnico para evaluar mi reincorporación inmediata a CGBOT / DEVBOT. Agradezco de antemano su confianza y consideración.`;
    } else if (isGaming) {
      suggestedTitle = 'Artista Técnico Senior & Shipped AAA Titles | Frostbite & Unreal Engine';
      suggestedSummary = `Artista Técnico Senior con destacada experiencia en co-desarrollo para franquicias deportivas AAA de calibre internacional para publisher global líder (créditos verificados). Especializado en arquitectura e integración de UI/UX fluida a 60+ FPS en el motor Frostbite, gestión avanzada de control de versiones con Perforce (P4) y automatización CI mediante Jenkins. Riguroso respeto a los acuerdos de confidencialidad (NDA) y mejores prácticas de la industria.`;

      opening = `Me dirijo a ustedes con gran entusiasmo para presentar mi candidatura a la posición de ${extractedTitle}${extractedCompany ? ` en ${extractedCompany}` : ''}. Con más de 7 años de trayectoria integrando arte técnico, ingeniería de software y desarrollo interactivo de alto rendimiento, considero que mi experiencia se alinea plenamente con los desafíos y objetivos técnicos de su equipo.`;

      bodyParagraphs = [
        `Durante mi desempeño como Artista Técnico en producciones de co-desarrollo AAA a través de DEVBOT, tuve la responsabilidad directa de desarrollar, integrar y validar técnicamente los primeros builds jugables de títulos deportivos AAA de lanzamiento global para un publisher internacional de primer nivel. Me especialicé en el motor Frostbite, garantizando coherencia visual y fluidez estricta a 60+ FPS, administrando el flujo de ramas con Perforce (P4 Helix Core) y optimizando pipelines automatizados de CI mediante Jenkins, siempre bajo el más estricto apego a las normas de confidencialidad y protección de propiedad intelectual.`,
        `Complementariamente, mi rol actual como Gerente Comercial y Desarrollador en Orblite y mi experiencia previa en simulación industrial y Gemelos Digitales para corporativos globales Fortune 500 me han dotado de una visión transversal única: combinar rigor técnico de bajo nivel, optimización de pipelines y una comunicación estratégica orientada a resultados medibles.`
      ];

      closing = `Agradezco de antemano el tiempo dedicado a revisar mi postulación. Quedo a su entera disposición para conversar en una entrevista sobre cómo mi experiencia, rigor técnico y orientación al impacto pueden sumar valor inmediato a sus objetivos.`;
    } else if (isSimulation) {
      suggestedTitle = 'Desarrollador Unreal Engine 5 & Especialista en Gemelos Digitales (FlexSim, VR)';
      suggestedSummary = `Especialista en Gemelos Digitales (Digital Twins) industriales y simulación interactiva con Unreal Engine 5 y FlexSim. Experiencia probada en Flex desarrollando entornos de simulación de líneas de producción para corporativos globales Fortune 500 bajo acuerdos de confidencialidad, con detección de anomalías en tiempo real y entornos inmersivos de capacitación en Realidad Virtual (VR).`;

      opening = `Me dirijo a ustedes con gran entusiasmo para presentar mi candidatura a la posición de ${extractedTitle}${extractedCompany ? ` en ${extractedCompany}` : ''}.`;

      bodyParagraphs = [
        `En mi trayectoria como desarrollador de aplicaciones y especialista en simulación en Flex, lideré la creación de Gemelos Digitales (Digital Twins) industriales para corporativos globales Fortune 500 en sectores automotriz, farmacéutico y de alta tecnología. Utilizando Unreal Engine 5 y Arch FlexSim, modelamos líneas de manufactura complejas que detectaban fallas de maquinaria en tiempo real antes de llegar a etapas críticas de ensamble, reduciendo drásticamente costos y tiempos muertos.`,
        `Asimismo, diseñé simuladores inmersivos en Realidad Virtual (VR) para capacitación segura y estandarizada de operarios, acelerando las curvas de aprendizaje en planta. Mi experiencia previa en co-desarrollo de producciones AAA y mi rol en desarrollo de plataformas cloud SaaS me permiten aportar soluciones robustas, escalables y visualmente impecables.`
      ];

      closing = `Agradezco de antemano el tiempo dedicado a revisar mi postulación. Quedo a su disposición para coordinar una entrevista.`;
    } else {
      suggestedTitle = 'Gerente Comercial & Desarrollador de Plataforma SaaS | Orblite';
      suggestedSummary = `Líder comercial y desarrollador tecnológico de perfil integral con experiencia encabezando ventas B2B, diseño de plataformas SaaS de administración vehicular en Orblite y sistemas CRM/ERP propietarios potenciados con Inteligencia Artificial. Dominio de TypeScript, React, Tailwind, Supabase y arquitecturas cloud, complementado con experiencia previa en corporativos multinacionales en simulación e ingeniería interactiva.`;

      opening = `Me dirijo a ustedes para presentar mi postulación a la posición de ${extractedTitle}${extractedCompany ? ` en ${extractedCompany}` : ''}.`;

      bodyParagraphs = [
        `Actualmente me desempeño como Gerente Comercial en Orblite, donde encabezo simultáneamente la dirección estratégica de ventas corporativas B2B y el desarrollo de nuestra plataforma integral para administración y telemetría vehicular. En esta posición he arquitectado e implementado sistemas CRM y ERP propietarios, además de diseñar flujos automatizados de prospección con Inteligencia Artificial que incrementaron exponencialmente la conversión y calificación de cuentas clave.`,
        `Mi stack de producción abarca TypeScript, React, APIs REST, CSS/Tailwind, Supabase, Cloudflare, Vercel y Resend. Además, mi experiencia previa en corporativos multinacionales de manufactura y co-desarrollo AAA me brinda una disciplina metodológica y capacidad de ejecución excepcional en entornos de alta exigencia.`
      ];

      closing = `Agradezco de antemano el tiempo dedicado a revisar mi postulación. Quedo a su entera disposición para conversar sobre cómo mi perfil puede sumar valor a su equipo.`;
    }
  } else {
    // English Version
    if (isCgbotOrDevbot) {
      suggestedTitle = 'Senior Technical Artist | AAA Co-Development & Production Pipelines';
      suggestedSummary = `Senior Technical Artist with proven prior production track record at DEVBOT collaborating on world-class AAA sports franchises for a leading global publisher. Specialized in 60+ FPS interactive UI/UX architecture, Frostbite and Unreal Engine, Perforce (P4) version control, and Jenkins automated CI. Deep professional dedication to client confidentiality, strict NDA compliance, and studio IP protection.`;

      opening = `I am writing with great enthusiasm to submit my application for the ${extractedTitle} position at CGBOT / DEVBOT. Having previously contributed as a Technical Artist within your team on premier world-class AAA sports productions, I understand firsthand the high-level craft, rigorous technical standards, and foundational value of strict client confidentiality and NDA compliance in AAA co-development.`;

      bodyParagraphs = [
        `During my prior tenure at DEVBOT, I was directly responsible for developing, integrating, and technically validating initial playable builds for global flagship AAA sports releases, specializing in interactive UI/UX and Frostbite engine pipelines targeting a solid 60+ FPS. My daily responsibilities demanded disciplined Perforce (P4 Helix Core) branch management, Jenkins CI automation, and an unwavering respect for client proprietary assets and privacy—principles I have rigorously upheld across every phase of my career.`,
        `In addition, my recent experience engineering modern SaaS platforms at Orblite and industrial simulation digital twins at Flex brings cross-functional maturity: zero ramp-up time in your development environment, on-site presence in Zapopan and Guadalajara (or hybrid/remote flexibility), and total peace of mind regarding client data confidentiality.`
      ];

      closing = `It would be a privilege to reconnect with the leadership and production team at CGBOT / DEVBOT. Thank you for your time, consideration, and continued trust.`;
    } else if (isGaming) {
      suggestedTitle = 'Senior Technical Artist & Shipped AAA Titles | Frostbite & Unreal Engine';
      suggestedSummary = `Senior Technical Artist with proven AAA production track record in co-development on flagship sports titles for a leading global publisher (verified shipped credits). Specialized in interactive UI/UX architecture, Frostbite engine optimization, solid 60+ FPS compliance, enterprise Perforce (P4) branching, and automated Jenkins CI testing suites. Strict respect for client NDAs and industry privacy.`;

      opening = `I am writing to express my strong interest in the ${extractedTitle} role${extractedCompany ? ` with ${extractedCompany}` : ''}. With over seven years of professional experience bridging technical art, full-stack software development, and real-time interactive engineering, I am confident in my ability to make an immediate, meaningful impact on your team.`;

      bodyParagraphs = [
        `In my role as Technical Artist with DEVBOT for premier AAA releases, I was directly responsible for developing, integrating, and validating initial playable builds for world-class sports franchises. Working extensively within the proprietary Frostbite engine, I ensured high visual fidelity while maintaining a strict 60+ FPS performance target, managed complex branch merges using Perforce (P4 Helix Core), and maintained automated continuous integration (CI) pipelines using Jenkins—consistently adhering to strict client confidentiality.`,
        `In addition, my current position as Lead Automation Engineer and Platform Developer at Orblite—combined with my prior work engineering industrial digital twins for Fortune 500 enterprises—provides me with an exceptional balance of low-level technical discipline and strategic project execution.`
      ];

      closing = `Thank you for your time and consideration. I would welcome the opportunity to discuss how my technical expertise, disciplined delivery, and commitment to confidentiality can contribute to your team's upcoming milestones.`;
    } else if (isSimulation) {
      suggestedTitle = 'Unreal Engine 5 & Digital Twins Specialist (FlexSim, Industrial Simulation, VR)';
      suggestedSummary = `Industrial Digital Twins and Simulation Specialist with deep expertise in Unreal Engine 5 and Arch FlexSim. Proven history developing manufacturing simulation environments for Fortune 500 enterprise leaders with real-time equipment bottleneck detection, thermal layout modeling, and VR operator training programs under strict NDAs.`;

      opening = `I am writing to express my strong interest in the ${extractedTitle} position${extractedCompany ? ` with ${extractedCompany}` : ''}.`;

      bodyParagraphs = [
        `During my tenure as Applications Developer and Simulation Specialist at Flex, I spearheaded the creation of industrial Digital Twins for global manufacturing leaders in automotive, pharmaceutical, and high-tech sectors. Utilizing Unreal Engine 5 and Arch FlexSim, our team modeled automated assembly lines to detect equipment faults in real time prior to subsequent workstation handoffs, while optimizing floor spacing and machinery thermal distribution.`,
        `Furthermore, I created immersive Virtual Reality (VR) training simulators for factory floor personnel, drastically accelerating onboarding and minimizing operational error rates. My AAA co-development background ensures that every simulation I build adheres to the highest standards of frame rate stability and graphical excellence.`
      ];

      closing = `Thank you for your time and consideration. I look forward to hearing from you.`;
    } else {
      suggestedTitle = 'Lead Automation Engineer & Platform Developer | Orblite';
      suggestedSummary = `Lead Automation Engineer and Platform Developer combining full-stack web and sensor telemetry with modern AI API integrations and 3D simulation engineering. Currently Lead Automation Engineer & Platform Developer at Orblite, engineering AI workflow automations, vehicle telematics infrastructure, and custom internal ERP/CRM applications (TypeScript, React, RESTful APIs, SQL Supabase, AI/LLM APIs, Cloudflare).`;

      opening = `I am writing to express my interest in the ${extractedTitle} position${extractedCompany ? ` with ${extractedCompany}` : ''}.`;

      bodyParagraphs = [
        `Currently, as Lead Automation Engineer and Platform Developer at Orblite, I engineer AI workflow automation pipelines, architect real-time vehicle telematics and telemetry data simulation, and build custom internal ERP/CRM applications from scratch to optimize asset tracking and team workflows.`,
        `My production stack includes TypeScript, React, RESTful APIs, SQL (Supabase), AI/LLM API Integration, Cloudflare, and Vercel. Combined with my prior engineering background in multinational enterprises and AAA co-development, I offer a unique combination of high-reliability automation and rigorous software craftsmanship.`
      ];

      closing = `Thank you for your time and consideration. I look forward to the opportunity to speak with you.`;
    }
  }

  const salutation = language === 'es' ? 'A quien corresponda:' : 'To Whom It May Concern:';
  const signoff = language === 'es' ? 'Atentamente,' : 'Sincerely,';

  const recipient = extractedCompany
    ? (language === 'es' ? `Equipo de Selección / ${extractedCompany}` : `Hiring Team / ${extractedCompany}`)
    : (language === 'es' ? 'A quien corresponda' : 'To Whom It May Concern');

  const fullText = [
    resume.personalInfo.fullName,
    resume.personalInfo.title,
    `${resume.personalInfo.email} · ${resume.personalInfo.phone} · ${resume.personalInfo.location}`,
    [
      resume.personalInfo.linkedinUrl ? `LinkedIn: ${resume.personalInfo.linkedinUrl}` : '',
      `Website: ${resume.personalInfo.websiteUrl || 'https://orb-lite.com'}`,
      `GitHub: ${resume.personalInfo.githubUrl || 'https://github.com/Orb-lite/Orb-Lite'}`,
      `Portafolio Drive: ${resume.personalInfo.portfolioUrl || 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing'}`,
    ].filter(Boolean).join(' · '),
    '',
    todayStr,
    '',
    recipient,
    `${language === 'es' ? 'Asunto: Postulación para' : 'Subject: Application for'} ${extractedTitle}`,
    '',
    salutation,
    '',
    opening,
    '',
    bodyParagraphs[0],
    '',
    bodyParagraphs[1],
    '',
    closing,
    '',
    signoff,
    resume.personalInfo.fullName,
  ].join('\n');

  return {
    detectedLanguage: language,
    matchScore,
    extractedTitle,
    extractedCompany,
    matchedKeywords,
    suggestedTitle,
    suggestedSummary,
    coverLetter: {
      recipient,
      jobTitle: extractedTitle,
      companyName: extractedCompany,
      date: todayStr,
      salutation,
      opening,
      bodyParagraphs,
      closing,
      signoff,
      fullName: resume.personalInfo.fullName,
      language,
    },
    coverLetterFullText: fullText,
  };
}
