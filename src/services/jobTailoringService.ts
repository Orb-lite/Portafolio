import { ResumeData, JobMatchResult, CoverLetterData } from '../types/resume';

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
    id: 'sample-platform-systems-engineer',
    title: 'Lead Platform & Telematics Systems Engineer (Python, GCP, Cloud Operations)',
    lang: 'en' as const,
    text: `Job Description: Lead Platform & Telematics Systems Engineer
Experience Level: Intermediate / Senior
Job Type: Contract / Full-Time
Role Overview:
We are seeking a high-performing Systems & Platform Engineer to design, develop, deploy, operate, and continuously improve distributed backend pipelines, real-time telemetry ingestion, and high-availability cloud services.
Candidates will be responsible for the complete production lifecycle, including microservice development, RESTful integration, automated testing, deployment, monitoring, production support, incident resolution, and database migrations.

Requirements added by the job poster:
• 4+ years of work experience with Distributed Systems & Real-Time Pipelines
• 3+ years of work experience with Python (FastAPI, AsyncIO) & TypeScript
• 2+ years of work experience with Google Cloud Platform (GCP)`,
  },
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
Liderar la estrategia de ventas B2B para nuestra plataforma SaaS de gestión de flotas y telemetría vehicular, impulsando el cierre de contratos corporativos y la prospección estratégica mediante herramientas modernas de automatización operativa y CRM.

Responsabilidades Principales:
- Liderar el ciclo completo de ventas consultivas B2B para soluciones tecnológicas de rastreo y administración de activos vehiculares.
- Desarrollar e implementar métodos innovadores de prospección y calificación de leads con flujos automatizados.
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
  return runLocalJobTailoring(jobText, currentResume, detectedLang);
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
  const isPlatformCloud = lower.includes('cloud run') || lower.includes('telematics') || lower.includes('python') && lower.includes('gcp') || lower.includes('distributed');
  const isGaming = isCgbotOrDevbot || lower.includes('game') || lower.includes('juego') || lower.includes('frostbite') || lower.includes('college football') || lower.includes('cfb') || lower.includes('ea') || lower.includes('perforce') || lower.includes('technical artist');
  const isSimulation = lower.includes('digital twin') || lower.includes('gemelo') || lower.includes('flexsim') || lower.includes('vr') || lower.includes('virtual reality') || lower.includes('manufactura') || lower.includes('ensamble') || lower.includes('planta');
  const isCommercial = lower.includes('comercial') || lower.includes('ventas') || lower.includes('sales') || lower.includes('b2b') || lower.includes('crm') || lower.includes('erp') || lower.includes('telemetr') || lower.includes('vehicular') || lower.includes('prospecc') || lower.includes('saas');

  // Find matched keywords (All discreet and professional)
  const allPotentialKeywords = [
    'Distributed Telemetry Pipelines', 'Python (FastAPI & AsyncIO)', 'Google Cloud Platform (GCP)',
    'Production Operations & SRE', 'Microservices Architecture', 'Real-Time Ingestion & Routing',
    'Unreal Engine 5', 'Unreal Engine 4', 'Frostbite Engine', 'Títulos AAA (Créditos Verificados)',
    'Perforce (P4 Helix Core)', 'Jenkins (CI/CD)', 'UI/UX interactiva', 'Realidad Virtual (VR)',
    'Digital Twins (Gemelos Digitales)', 'Arch FlexSim', 'Corporativos Fortune 500 (Bajo NDA)',
    'TypeScript', 'React', 'Tailwind CSS', 'Supabase', 'SQL', 'APIs REST', 'Vercel / Cloudflare',
    'Ventas B2B', 'Estrategia Comercial', 'Automatización de Prospección B2B',
    'Sistemas CRM / ERP Propietarios', 'Administración y Telemetría Vehicular',
    'Confidencialidad & Acuerdos NDA'
  ];

  const matchedKeywords = allPotentialKeywords.filter((k) => {
    const kParts = k.toLowerCase().split(/[\s/()&,+-]+/);
    return kParts.some((part) => part.length > 2 && lower.includes(part));
  });

  if (matchedKeywords.length < 3) {
    if (isPlatformCloud) matchedKeywords.push('Distributed Systems', 'Python (FastAPI)', 'Google Cloud Platform (GCP)', 'Real-Time Telemetry', 'Production Operations');
    else if (isCgbotOrDevbot) matchedKeywords.push('Perforce (P4)', 'Jenkins (CI/CD)', 'Frostbite Engine', 'Confidencialidad & NDA');
    else if (isGaming) matchedKeywords.push('Frostbite Engine', 'Títulos AAA', 'Perforce', 'Jenkins');
    else if (isSimulation) matchedKeywords.push('Unreal Engine 5', 'Digital Twins', 'VR', 'FlexSim');
    else if (isCommercial) matchedKeywords.push('Ventas B2B', 'SaaS', 'CRM/ERP', 'Automatización Operativa');
  }

  // Calculate realistic match score
  let matchScore = 85 + Math.min(matchedKeywords.length * 3, 13);
  if (isPlatformCloud) matchScore = 97;
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
    if (isPlatformCloud) {
      suggestedTitle = 'Ingeniero Senior de Plataformas & Sistemas | Backend & Cloud Operations';
      suggestedSummary = `Ingeniero de Plataformas y Especialista en Operaciones de Producción con más de 8 años de trayectoria conectando software, sistemas telemáticos en tiempo real e infraestructura cloud, incluyendo más de 5 años de desarrollo en Python y operación de cargas empresariales en Google Cloud Platform (GCP). Experiencia probada en el ciclo de vida completo de producción: microservicios en contenedores (Cloud Run, Cloud SQL, GCS), pipelines automatizados de CI/CD, observabilidad en tiempo real y resolución de incidentes.`;

      opening = `Me dirijo a ustedes con gran entusiasmo para presentar mi candidatura a la posición de ${extractedTitle}${extractedCompany ? ` en ${extractedCompany}` : ''}. Con sólida experiencia desarrollando arquitecturas distribuidas en Python y operando infraestructura en Google Cloud Platform (GCP), mi perfil encaja de forma precisa con el enfoque de ingeniería y operaciones de producción que requiere esta posición.`;

      bodyParagraphs = [
        `Como Lead Platform & Automation Engineer, he liderado el diseño y desarrollo de pipelines telemáticos y servicios backend utilizando Python (FastAPI, Asyncio) y Google Cloud Platform (Cloud Run, Google Cloud Storage, BigQuery), conectando flujos GPS de alta frecuencia con bases de datos transaccionales y reduciendo los tiempos de procesamiento operativo en un 75%.`,
        `Cuento con amplia experiencia en la disciplina de operaciones (SRE / DevOps): despliegue mediante CI/CD automatizado (GitHub Actions y Jenkins) y monitoreo 24/7 con GCP Cloud Monitoring y Cloud Logging para resolución rápida de incidentes. Mi trayectoria previa desarrollando simulaciones para corporativos Fortune 500 y producciones AAA refuerza mi compromiso con la estabilidad y excelencia operativa.`
      ];

      closing = `Agradezco su tiempo y consideración. Será un placer conversar en detalle sobre cómo mi experiencia en Python, sistemas distribuidos y GCP aportará valor inmediato a sus operaciones de producción.`;
    } else if (isCgbotOrDevbot) {
      suggestedTitle = 'Artista Técnico Senior | Co-Desarrollo AAA & Pipelines de Producción';
      suggestedSummary = `Artista Técnico Senior con probada trayectoria previa en DEVBOT colaborando en producciones deportivas AAA de calibre internacional para publisher global líder. Especializado en arquitectura e integración de UI/UX fluida a 60+ FPS, motor Frostbite y Unreal Engine, control de versiones con Perforce (P4) y automatización CI con Jenkins. Firme compromiso con la confidencialidad, acuerdos de no divulgación (NDA) y respeto absoluto a la propiedad intelectual de clientes y socios.`;

      opening = `Me dirijo a ustedes con gran entusiasmo y genuina satisfacción para presentar mi postulación a la posición de ${extractedTitle} en CGBOT / DEVBOT. Habiendo colaborado previamente como Artista Técnico en su equipo para producciones deportivas AAA de máximo nivel, conozco de primera mano la excelencia de sus flujos de trabajo, los rigurosos estándares de entrega y el valor fundamental que representan la confidencialidad, los acuerdos de no divulgación (NDA) y la discreción profesional en el co-desarrollo.`;

      bodyParagraphs = [
        `En mi etapa anterior en DEVBOT, tuve la satisfacción de desarrollar, integrar y validar técnicamente los primeros builds jugables de producciones deportivas AAA globales insignia, especializándome en UI/UX interactiva y motor Frostbite a 60+ FPS estables. Mi día a día implicó una gestión disciplinada de ramas en Perforce (P4 Helix Core), pipelines de integración continua con Jenkins y un estricto respeto a las políticas de privacidad y datos confidenciales del publisher, principios éticos que he mantenido de manera intachable a lo largo de toda mi carrera profesional.`,
        `Adicionalmente, mi trayectoria desarrollando gemelos digitales industriales en Flex para corporativos Fortune 500 y plataformas SaaS de telemática vehicular full-stack me permite aportar una visión transversal y madura: capacidad de entrega técnica inmediata sin periodo de adaptación en sus flujos de trabajo, disponibilidad presencial en Zapopan y Guadalajara (o modalidad híbrida/remota), y la total tranquilidad ética de contar con un profesional que salvaguarda la reputación y acuerdos de privacidad del estudio.`
      ];

      closing = `Será un verdadero honor tener la oportunidad de conversar con el equipo directivo y técnico para evaluar mi reincorporación inmediata a CGBOT / DEVBOT. Agradezco de antemano su confianza y consideración.`;
    } else if (isGaming) {
      suggestedTitle = 'Artista Técnico Senior & Shipped AAA Titles | Frostbite & Unreal Engine';
      suggestedSummary = `Artista Técnico Senior con destacada experiencia en co-desarrollo para franquicias deportivas AAA de calibre internacional para publisher global líder (créditos verificados). Especializado en arquitectura e integración de UI/UX fluida a 60+ FPS en el motor Frostbite, gestión avanzada de control de versiones con Perforce (P4) y automatización CI mediante Jenkins. Riguroso respeto a los acuerdos de confidencialidad (NDA) y mejores prácticas de la industria.`;

      opening = `Me dirijo a ustedes con gran entusiasmo para presentar mi candidatura a la posición de ${extractedTitle}${extractedCompany ? ` en ${extractedCompany}` : ''}. Con más de 7 años de trayectoria integrando arte técnico, ingeniería de software y desarrollo interactivo de alto rendimiento, considero que mi experiencia se alinea plenamente con los desafíos y objetivos técnicos de su equipo.`;

      bodyParagraphs = [
        `Durante mi desempeño como Artista Técnico en producciones de co-desarrollo AAA a través de DEVBOT, tuve la responsabilidad directa de desarrollar, integrar y validar técnicamente los primeros builds jugables de títulos deportivos AAA de lanzamiento global para un publisher internacional de primer nivel. Me especialicé en el motor Frostbite, garantizando coherencia visual y fluidez estricta a 60+ FPS, administrando el flujo de ramas con Perforce (P4 Helix Core) y optimizando pipelines automatizados de CI mediante Jenkins, siempre bajo el más estricto apego a las normas de confidencialidad y protección de propiedad intelectual.`,
        `Complementariamente, mi experiencia en simulación industrial y Gemelos Digitales para corporativos globales Fortune 500 junto con el desarrollo de plataformas web full-stack me han dotado de una visión transversal única: combinar rigor técnico de bajo nivel, optimización de pipelines y una comunicación estratégica orientada a resultados medibles.`
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
      suggestedTitle = 'Full-Stack Platform & Automation Systems Engineer';
      suggestedSummary = `Desarrollador tecnológico de perfil integral con experiencia diseñando plataformas SaaS de telemática vehicular y sistemas CRM/ERP con automatización operativa. Dominio de TypeScript, React, Tailwind, Supabase y arquitecturas cloud, complementado con experiencia en corporativos multinacionales en simulación 3D e ingeniería interactiva.`;

      opening = `Me dirijo a ustedes para presentar mi postulación a la posición de ${extractedTitle}${extractedCompany ? ` en ${extractedCompany}` : ''}.`;

      bodyParagraphs = [
        `He diseñado e implementado plataformas full-stack de administración y telemetría vehicular, sistemas CRM/ERP y flujos automatizados de operación para optimizar seguimiento de activos y procesos de equipo.`,
        `Mi stack de producción abarca TypeScript, React, APIs REST, CSS/Tailwind, Supabase, Cloudflare, Vercel y Resend. Además, mi experiencia previa en corporativos multinacionales de manufactura y co-desarrollo AAA me brinda una disciplina metodológica y capacidad de ejecución excepcional en entornos de alta exigencia.`
      ];

      closing = `Agradezco de antemano el tiempo dedicado a revisar mi postulación. Quedo a su entera disposición para conversar sobre cómo mi perfil puede sumar valor a su equipo.`;
    }
  } else {
    // English Version
    if (isPlatformCloud) {
      suggestedTitle = 'Lead Platform & Telematics Systems Engineer | Cloud Operations';
      suggestedSummary = `Lead Platform & Telematics Systems Engineer with 8+ years of engineering experience designing, developing, and operating distributed backend pipelines, real-time telemetry ingestion, 5+ years of production Python development, and 2+ years deploying enterprise workloads on Google Cloud Platform (GCP). Proven expertise across containerized deployment (Cloud Run, BigQuery, GCS), automated CI/CD, real-time observability, and production incident resolution.`;

      opening = `I am writing with great enthusiasm to submit my application for the ${extractedTitle} position${extractedCompany ? ` with ${extractedCompany}` : ''}. With hands-on experience building distributed backend services in Python and deploying containerized enterprise solutions on Google Cloud Platform (GCP), my background directly matches your focus on engineering rigor, system reliability, and full-lifecycle production operations.`;

      bodyParagraphs = [
        `I have designed and deployed distributed telemetry pipelines and cloud microservices using Python (FastAPI, Asyncio) and Google Cloud Platform (Cloud Run, Google Cloud Storage, BigQuery) connecting real-time GPS streams to transactional databases and reducing operational latency by 75%.`,
        `Complementing backend engineering, I bring strong production operations and SRE discipline: establishing automated CI/CD pipelines (GitHub Actions and Jenkins) and 24/7 observability using GCP Cloud Monitoring and Cloud Logging for rapid incident triage. Coupled with my previous background engineering mission-critical digital twins for Fortune 500 enterprises and operating continuous integration pipelines on AAA game productions, I ensure systems run predictably, securely, and at scale.`
      ];

      closing = `Thank you for your time and consideration. I would welcome the opportunity to discuss how my expertise in distributed Python systems and GCP operations can deliver immediate impact to your engineering team.`;
    } else if (isCgbotOrDevbot) {
      suggestedTitle = 'Senior Technical Artist | AAA Co-Development & Production Pipelines';
      suggestedSummary = `Senior Technical Artist with proven prior production track record at DEVBOT collaborating on world-class AAA sports franchises for a leading global publisher. Specialized in 60+ FPS interactive UI/UX architecture, Frostbite and Unreal Engine, Perforce (P4) version control, and Jenkins automated CI. Deep professional dedication to client confidentiality, strict NDA compliance, and studio IP protection.`;

      opening = `I am writing with great enthusiasm to submit my application for the ${extractedTitle} position at CGBOT / DEVBOT. Having previously contributed as a Technical Artist within your team on premier world-class AAA sports productions, I understand firsthand the high-level craft, rigorous technical standards, and foundational value of strict client confidentiality and NDA compliance in AAA co-development.`;

      bodyParagraphs = [
        `During my prior tenure at DEVBOT, I was directly responsible for developing, integrating, and technically validating initial playable builds for global flagship AAA sports releases, specializing in interactive UI/UX and Frostbite engine pipelines targeting a solid 60+ FPS. My daily responsibilities demanded disciplined Perforce (P4 Helix Core) branch management, Jenkins CI automation, and an unwavering respect for client proprietary assets and privacy—principles I have rigorously upheld across every phase of my career.`,
        `In addition, my experience engineering modern SaaS platforms and industrial simulation digital twins at Flex brings cross-functional maturity: zero ramp-up time in your development environment, on-site presence in Zapopan and Guadalajara (or hybrid/remote flexibility), and total peace of mind regarding client data confidentiality.`
      ];

      closing = `It would be a privilege to reconnect with the leadership and production team at CGBOT / DEVBOT. Thank you for your time, consideration, and continued trust.`;
    } else if (isGaming) {
      suggestedTitle = 'Senior Technical Artist & Shipped AAA Titles | Frostbite & Unreal Engine';
      suggestedSummary = `Senior Technical Artist with proven AAA production track record in co-development on flagship sports titles for a leading global publisher (verified shipped credits). Specialized in interactive UI/UX architecture, Frostbite engine optimization, solid 60+ FPS compliance, enterprise Perforce (P4) branching, and automated Jenkins CI testing suites. Strict respect for client NDAs and industry privacy.`;

      opening = `I am writing to express my strong interest in the ${extractedTitle} role${extractedCompany ? ` with ${extractedCompany}` : ''}. With over seven years of professional experience bridging technical art, full-stack software development, and real-time interactive engineering, I am confident in my ability to make an immediate, meaningful impact on your team.`;

      bodyParagraphs = [
        `In my role as Technical Artist with DEVBOT for premier AAA releases, I was directly responsible for developing, integrating, and validating initial playable builds for world-class sports franchises. Working extensively within the proprietary Frostbite engine, I ensured high visual fidelity while maintaining a strict 60+ FPS performance target, managed complex branch merges using Perforce (P4 Helix Core), and maintained automated continuous integration (CI) pipelines using Jenkins—consistently adhering to strict client confidentiality.`,
        `In addition, my work engineering industrial digital twins for Fortune 500 enterprises and full-stack real-time telemetry platforms provides me with an exceptional balance of low-level technical discipline and strategic project execution.`
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
      suggestedTitle = 'Full-Stack Platform & Automation Systems Engineer';
      suggestedSummary = `Full-Stack Platform and Automation Engineer combining web applications and sensor telemetry with scalable backend integrations and 3D simulation engineering. Experienced building workflow automations, vehicle telematics infrastructure, and custom CRM/ERP applications (TypeScript, React, RESTful APIs, SQL Supabase, Cloudflare).`;

      opening = `I am writing to express my interest in the ${extractedTitle} position${extractedCompany ? ` with ${extractedCompany}` : ''}.`;

      bodyParagraphs = [
        `I have engineered cloud workflow automation pipelines, designed real-time vehicle telematics and telemetry data simulation systems, and built full-stack CRM/ERP web applications from scratch to optimize asset tracking and team workflows.`,
        `My production stack includes TypeScript, React, RESTful APIs, SQL (Supabase), Cloudflare, and Vercel. Combined with my prior engineering background in multinational enterprises and AAA co-development, I offer a unique combination of high-reliability automation and rigorous software craftsmanship.`
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
