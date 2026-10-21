import { ResumeData, StyleConfig } from '../types/resume';

export const resumeDataEs: ResumeData = {
  personalInfo: {
    fullName: 'Isaac Gómez Estrada',
    title: 'Lead Automation Engineer & Platform Developer | Orblite',
    email: 'isaacgestrada94@gmail.com',
    phone: '+52 33 1835 9421',
    location: 'Zapopan / Guadalajara, Jalisco, México (Presencial, Híbrido o Remoto)',
    linkedinUrl: 'https://www.linkedin.com/in/isaac-gomez-estrada-6959872a0/',
    websiteUrl: 'https://orb-lite.com',
    githubUrl: 'https://github.com/Orb-lite/Portafolio.git',
    portfolioUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    mobygamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    age: 32,
    summary:
      'Ingeniero de 32 años dedicado desde 2018 al desarrollo de entornos virtuales interactivos, simulación 3D en tiempo real y arquitectura de software. Lead Automation Engineer y Desarrollador de Plataformas con sólida experiencia en integración de APIs de Inteligencia Artificial (LLMs), sistemas telemáticos en tiempo real y aplicaciones web de alto rendimiento. Actualmente Lead Automation Engineer & Platform Developer en Orblite, liderando automatizaciones de flujos con IA, infraestructura telemática vehicular y desarrollo de sistemas ERP/CRM propietarios (TypeScript, React, APIs REST, SQL Supabase, Cloudflare). Experiencia previa destacada en simulación industrial y gemelos digitales para corporativos globales Fortune 500 (sectores automotriz, tecnología y farmacéutico bajo estricta confidencialidad) y como Artista Técnico en estudio de co-desarrollo para título deportivo AAA de clase mundial con crédito verificado en MobyGames (EA Sports College Football 25).',
    photoUrl: '',
  },
  experiences: [
    {
      id: 'exp-orblite',
      role: 'Lead Automation Engineer & Platform Developer',
      company: 'Orblite',
      location: 'México',
      startDate: 'Jun 2026',
      endDate: 'Presente',
      isCurrent: true,
      highlights: [
        'AI Workflow Automation: Diseñó y desplegó conjuntos de herramientas de producción a medida integrando APIs modernas de IA y Modelos de Lenguaje Grande (LLMs) para automatizar análisis de datos complejos y flujos de trabajo en pipeline.',
        'Telematics & Data Simulation: Diseñó la arquitectura de infraestructura full-stack de extremo a extremo para telemetría vehicular en tiempo real, procesando y simulando flujos de sensores de alta frecuencia y datos telemétricos.',
        'Internal Tooling: Desarrolló aplicaciones internas propietarias de ERP/CRM desde cero con TypeScript y React para optimizar el rastreo de activos, flujos de equipo y monitoreo de sistemas.',
        'Tech Stack: TypeScript, React, RESTful APIs, SQL (Supabase), AI/LLM API Integration, Cloudflare.',
      ],
    },
    {
      id: 'exp-flex',
      role: 'Desarrollador de Aplicaciones & Unreal Engine Specialist',
      company: 'Multinacional de Soluciones de Manufactura y Tecnología (Flex)',
      location: 'Zapopan, Jalisco, México (Híbrido)',
      startDate: 'Jun 2024',
      endDate: 'Abr 2026',
      isCurrent: false,
      highlights: [
        'Desarrollo de Gemelos Digitales (Digital Twins) de piso de producción industrial para corporativos globales Fortune 500 (sectores automotriz, tecnología avanzada y farmacéutica bajo acuerdos de confidencialidad y privacidad).',
        'Simulación en tiempo real de líneas de producción automatizadas con Unreal Engine 5 y FlexSim, detectando fallas de máquinas antes de su traspaso a estaciones de ensamble subsiguientes.',
        'Simulación de espacios óptimos considerando separación de líneas y maquinaria para prevención de sobrecalentamiento.',
        'Creación de simuladores inmersivos en Realidad Virtual (VR) para capacitación segura y efectiva de nuevos operarios en maquinaria especializada.',
      ],
    },
    {
      id: 'exp-devbot',
      role: 'Artista Técnico (Technical Artist)',
      company: 'DEVBOT (Estudio de Co-Desarrollo de Videojuegos AAA)',
      location: 'Monterrey, Nuevo León, México (Remoto)',
      startDate: 'Ene 2022',
      endDate: 'Ago 2023',
      isCurrent: false,
      highlights: [
        'Desempeño como Artista Técnico asignado a producción deportiva AAA de clase mundial (EA Sports College Football 25) para publisher internacional líder, especializándome en UI/UX interactiva y motor Frostbite (respetando acuerdos de confidencialidad y mejores prácticas de co-desarrollo; crédito público y verificable en MobyGames).',
        'Desarrollo, integración y validación técnica del primer build funcional y jugable para producciones deportivas AAA de lanzamiento global, asegurando fluidez a 60+ FPS y estricta fidelidad visual.',
        'Gestión integral del control de versiones y branching con Perforce (P4 Helix Core) en pipelines masivos de producción multicentro.',
        'Ejecución y mantenimiento de pruebas automatizadas de integración continua (CI) mediante Jenkins para validación de builds y aceleración de entregas.',
      ],
    },
    {
      id: 'exp-navi',
      role: 'Artista Técnico & Desarrollador 3D',
      company: 'Navi 3D - Realidad Virtual y Maquetas Virtuales',
      location: 'Guadalajara, Jalisco, México (Remoto)',
      startDate: 'Abr 2021',
      endDate: 'Ago 2021',
      isCurrent: false,
      highlights: [
        'Desarrollo de sistema interactivo 3D en Unreal Engine 4 para showrooms inmobiliarios con visualización de fichas técnicas y disponibilidad en tiempo real.',
        'Integración con SQL y APIs para cálculo de comisiones de vendedores e informes en tiempo real para gerencia de ventas.',
      ],
    },
    {
      id: 'exp-spinar',
      role: 'Artista Técnico & Unreal Engine Developer',
      company: 'Spinar',
      location: 'Guadalajara, Jalisco, México (Híbrido)',
      startDate: 'Ene 2020',
      endDate: 'Ago 2020',
      isCurrent: false,
      highlights: [
        'Desarrollo de simulación interactiva 3D en Unreal Engine 4 para campaña de concientización y sustentabilidad del uso de agua para entidad gubernamental estatal.',
      ],
    },
    {
      id: 'exp-larva',
      role: 'Artista Técnico & Programador de Videojuegos',
      company: 'Larva Game Studios',
      location: 'Guadalajara, Jalisco, México (Presencial)',
      startDate: 'Ago 2018',
      endDate: 'Nov 2019',
      isCurrent: false,
      highlights: [
        'Desarrollo de aplicaciones y videojuegos multiplataforma: Windows, móviles (iOS y Android), WebGL, HTML5 y VR (Meta Quest, HTC, Oculus Rift).',
        'Implementación de sistemas de IA para juegos en línea y proyectos interactivos para prestigiosa institución universitaria técnica y pymes regionales.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Ingeniería en Tecnologías Interactivas de Animación Digital',
      institution: 'Universidad del Valle de México (UVM)',
      location: 'México',
      graduationYear: '2013 - 2018',
      details: 'Formación especializada en ingeniería de software interactivo, simulación 3D en tiempo real, gráficos computacionales, animación digital y liderazgo de proyectos tecnológicos.',
    },
  ],
  skillCategories: [
    {
      id: 'skill-cat-1',
      name: 'Gestión Comercial & Dirección de Ventas',
      skills: [
        'Dirección y Estrategia Comercial',
        'Ventas B2B Corporativas',
        'Prospección con Inteligencia Artificial (IA)',
        'Sistemas CRM y ERP Propios',
        'Administración y Gestión Vehicular',
        'Negociación y Cierre de Cuentas',
      ],
    },
    {
      id: 'skill-cat-2',
      name: 'Desarrollo de Software & Plataformas Web',
      skills: [
        'TypeScript & JavaScript',
        'React',
        'Tailwind CSS & CSS Avanzado',
        'Supabase & SQL',
        'Integración de APIs REST',
        'Vercel & Cloudflare',
        'Resend (Automatización de Correo)',
      ],
    },
    {
      id: 'skill-cat-3',
      name: 'Motores 3D, Realidad Virtual & Simulación',
      skills: [
        'Unreal Engine 5 & UE4',
        'Digital Twins (Gemelos Digitales)',
        'Arch FlexSim (Simulación de Fábricas)',
        'Realidad Virtual (VR - Quest / HTC)',
        'Frostbite Engine (Títulos Deportivos AAA)',
        'Perforce (P4) & Jenkins (CI/CD)',
      ],
    },
  ],
  languages: [
    { id: 'lang-1', name: 'Español', level: 'Nativo' },
    { id: 'lang-2', name: 'Inglés', level: 'Profesional (Colaboración con Equipos Internacionales y Publishers Globales)' },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Desarrollo de Plataformas SaaS & Automatización con Inteligencia Artificial',
      issuer: 'Tecnología y Negocios Digitales',
      year: '2026',
    },
    {
      id: 'cert-2',
      name: 'Especialización en Unreal Engine 5: Gemelos Digitales & Blueprints',
      issuer: 'Epic Games / Simulación Industrial',
      year: '2024',
    },
    {
      id: 'cert-3',
      name: 'Gestión de Pipelines CI/CD y Control de Versiones (Perforce & Jenkins)',
      issuer: 'DevOps & Game Development Hub',
      year: '2022',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Franquicia AAA Shipped',
      metric: 'EA Sports CFB 25',
      description: 'Artista técnico en UI/UX y motor Frostbite (Crédito público verificado en MobyGames).',
    },
    {
      id: 'ach-2',
      title: 'Clientes Globales Fortune 500',
      metric: 'Automotriz, Tech & Pharma',
      description: 'Digital twins y simulación de producción industrial bajo acuerdos de confidencialidad.',
    },
    {
      id: 'ach-3',
      title: 'Plataforma Orblite',
      metric: 'CRM / ERP / SaaS',
      description: 'Plataforma integral de administración vehicular y prospección con IA.',
    },
  ],
};

export const resumeDataEn: ResumeData = {
  personalInfo: {
    fullName: 'Isaac Gómez Estrada',
    title: 'Lead Automation Engineer & Platform Developer | Orblite',
    email: 'isaacgestrada94@gmail.com',
    phone: '+52 33 1835 9421',
    location: 'Zapopan / Guadalajara, Jalisco, Mexico (On-site, Hybrid, or Remote)',
    linkedinUrl: 'https://www.linkedin.com/in/isaac-gomez-estrada-6959872a0/',
    websiteUrl: 'https://orb-lite.com',
    githubUrl: 'https://github.com/Orb-lite/Portafolio.git',
    portfolioUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    mobygamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    age: 32,
    summary:
      '32-year-old interactive virtual environment and real-time 3D simulation engineer dedicated since 2018 to building immersive virtual worlds, game development, and high-performance software architecture. Lead Automation Engineer and Platform Developer combining full-stack web and sensor telemetry with modern AI API integrations and 3D simulation engineering. Currently Lead Automation Engineer & Platform Developer at Orblite, engineering AI workflow automations, vehicle telematics infrastructure, and custom internal ERP/CRM applications (TypeScript, React, RESTful APIs, SQL Supabase, AI/LLM APIs, Cloudflare). Extensive background developing industrial Digital Twins for global Fortune 500 enterprise clients (automotive, tech, and pharmaceutical sectors under strict NDAs) and Technical Art for premier AAA sports franchise at an elite co-development studio (verified shipped credit on MobyGames for EA Sports College Football 25, interactive UI/UX in Frostbite, Perforce P4, and Jenkins CI).',
    photoUrl: '',
  },
  experiences: [
    {
      id: 'exp-orblite',
      role: 'Lead Automation Engineer & Platform Developer',
      company: 'Orblite',
      location: 'Mexico',
      startDate: 'Jun 2026',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'AI Workflow Automation: Engineered and deployed custom production toolsets integrating modern AI APIs and Large Language Models (LLMs) to automate complex data analysis and pipeline workflows.',
        'Telematics & Data Simulation: Architected the end-to-end full-stack infrastructure for real-time vehicle telematics, processing and simulating high-frequency sensor streams and vehicle telemetry data.',
        'Internal Tooling: Developed custom internal ERP/CRM applications from scratch using TypeScript and React to optimize asset tracking, team workflows, and system monitoring.',
        'Tech Stack: TypeScript, React, RESTful APIs, SQL (Supabase), AI/LLM API Integration, Cloudflare.',
      ],
    },
    {
      id: 'exp-flex',
      role: 'Applications Developer & Unreal Engine Specialist',
      company: 'Multinational Manufacturing & Technology (Flex - Industrial Simulation)',
      location: 'Zapopan, Jalisco, Mexico (Hybrid)',
      startDate: 'Jun 2024',
      endDate: 'Apr 2026',
      isCurrent: false,
      highlights: [
        'Engineered manufacturing Digital Twins for global Fortune 500 enterprise leaders (automotive, advanced tech, and pharmaceutical sectors under strict NDAs) using Unreal Engine 5 (UE5) and FlexSim.',
        'Simulated automated assembly line workflows in real time, detecting machine failures and bottlenecks before parts proceeded to subsequent workstations.',
        'Modeled optimal spatial floor layouts and thermal spacing between production lines and machinery to prevent overheating and maximize throughput.',
        'Created immersive Virtual Reality (VR) simulators for onboarding and safety training of plant operators handling specialized equipment.',
      ],
    },
    {
      id: 'exp-devbot',
      role: 'Technical Artist',
      company: 'DEVBOT (AAA Game Co-Development Studio)',
      location: 'Monterrey, Nuevo Leon, Mexico (Remote)',
      startDate: 'Jan 2022',
      endDate: 'Aug 2023',
      isCurrent: false,
      highlights: [
        'Served as Technical Artist assigned to world-class AAA sports franchise EA Sports College Football 25 for a leading global publisher, specializing in interactive UI/UX and Frostbite engine pipelines (strict NDA compliance; verified public credit on MobyGames).',
        'Engineered and validated initial playable game builds for world-class AAA sports titles, ensuring solid 60+ FPS performance and high visual fidelity.',
        'Managed large-scale source control, asset branching, and merge conflict resolution using Perforce (P4 Helix Core) in multi-site co-development pipelines.',
        'Maintained automated continuous integration (CI) test suites using Jenkins to streamline studio-wide deployments and milestone delivery.',
      ],
    },
    {
      id: 'exp-navi',
      role: 'Technical Artist & 3D Interactive Developer',
      company: 'Navi 3D - Virtual Reality & 3D Architectural Mockups',
      location: 'Guadalajara, Jalisco, Mexico (Remote)',
      startDate: 'Apr 2021',
      endDate: 'Aug 2021',
      isCurrent: false,
      highlights: [
        'Built an interactive real-time 3D showroom for luxury real estate developments utilizing Unreal Engine 4.',
        'Integrated backend SQL databases and REST APIs for real-time synchronization of inventory, sold vs. available apartments, unit specs, and sales commissions.',
      ],
    },
    {
      id: 'exp-spinar',
      role: 'Technical Artist & Unreal Engine Developer',
      company: 'Spinar',
      location: 'Guadalajara, Jalisco, Mexico (Hybrid)',
      startDate: 'Jan 2020',
      endDate: 'Ago 2020',
      isCurrent: false,
      highlights: [
        'Developed an interactive 3D simulation in Unreal Engine 4 for a public water conservation and sustainability initiative with a state government entity.',
      ],
    },
    {
      id: 'exp-larva',
      role: 'Technical Artist & Game Developer',
      company: 'Larva Game Studios',
      location: 'Guadalajara, Jalisco, Mexico (On-site)',
      startDate: 'Aug 2018',
      endDate: 'Nov 2019',
      isCurrent: false,
      highlights: [
        'Developed interactive cross-platform applications and video games for Windows, mobile (iOS & Android), WebGL, HTML5, and VR headsets (Meta Quest, HTC Vive, Oculus Rift).',
        'Implemented online game AI systems, technical animations, and interactive solutions for a prestigious technical university and regional enterprise clients.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Interactive Technologies & Digital Animation Engineering',
      institution: 'Universidad del Valle de México (UVM)',
      location: 'Mexico',
      graduationYear: '2013 - 2018',
      details: 'Specialized engineering degree in interactive software systems, 3D real-time simulation, computer graphics, digital animation pipelines, and technology project leadership.',
    },
  ],
  skillCategories: [
    {
      id: 'skill-cat-1',
      name: 'Commercial Leadership & Sales Strategy',
      skills: [
        'Commercial Strategy & Leadership',
        'B2B Enterprise Sales',
        'AI-Powered Prospecting & Automation',
        'Proprietary CRM & ERP Platforms',
        'Fleet Telematics & Vehicle Tracking',
        'Strategic Closing & Account Growth',
      ],
    },
    {
      id: 'skill-cat-2',
      name: 'Software Engineering & Web Platforms',
      skills: [
        'TypeScript & JavaScript',
        'React',
        'Tailwind CSS & Modern CSS',
        'Supabase & SQL Databases',
        'RESTful API Architecture',
        'Vercel & Cloudflare Deployment',
        'Resend (Email Automation)',
      ],
    },
    {
      id: 'skill-cat-3',
      name: '3D Engines, Virtual Reality & Simulation',
      skills: [
        'Unreal Engine 5 & UE4',
        'Digital Twins (Industrial Modeling)',
        'Arch FlexSim (Factory Floor Simulation)',
        'Virtual Reality (VR - Quest / HTC)',
        'Frostbite Engine (AAA Sports Titles)',
        'Perforce (P4) & Jenkins (CI/CD)',
      ],
    },
  ],
  languages: [
    { id: 'lang-1', name: 'Spanish', level: 'Native' },
    { id: 'lang-2', name: 'English', level: 'Professional Working Proficiency (International Collaboration with Global Teams & Publishers)' },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'SaaS Platform Development & AI Automation',
      issuer: 'Digital Business & Technology Institute',
      year: '2026',
    },
    {
      id: 'cert-2',
      name: 'Unreal Engine 5 Specialization: Industrial Digital Twins & Blueprints',
      issuer: 'Epic Games / Industrial Simulation',
      year: '2024',
    },
    {
      id: 'cert-3',
      name: 'Enterprise CI/CD Pipelines & Source Control (Perforce & Jenkins)',
      issuer: 'DevOps & Game Dev Hub',
      year: '2022',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'AAA Shipped Title',
      metric: 'EA Sports CFB 25',
      description: 'Technical Artist on UI/UX and Frostbite engine (Verified credit on MobyGames).',
    },
    {
      id: 'ach-2',
      title: 'Global Fortune 500 Clients',
      metric: 'Automotive, Tech & Pharma',
      description: 'Industrial digital twins and assembly line simulation under confidentiality agreements.',
    },
    {
      id: 'ach-3',
      title: 'Orblite Platform',
      metric: 'CRM / ERP / SaaS',
      description: 'End-to-end vehicle telematics platform and AI prospecting tools.',
    },
  ],
};

// Default export is Spanish
export const initialResumeData: ResumeData = resumeDataEs;

export const defaultStyleConfig: StyleConfig = {
  template: 'executive',
  accentColor: '#0284c7', // Sapphire / Tech Blue
  fontFamily: 'sans',
  spacing: 'compact',
  showPhoto: false,
  paperSize: 'a4',
  fontSize: 'sm',
};

export const COLOR_PALETTES = [
  { name: 'Azul Orblite / Tech', value: '#0284c7', bgClass: 'bg-sky-600', borderClass: 'border-sky-600' },
  { name: 'Azul Marino Ejecutivo', value: '#1e3a8a', bgClass: 'bg-blue-900', borderClass: 'border-blue-900' },
  { name: 'Grafito Pizarra', value: '#334155', bgClass: 'bg-slate-700', borderClass: 'border-slate-700' },
  { name: 'Esmeralda / Cyber', value: '#059669', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-600' },
  { name: 'Índigo Profundo', value: '#4338ca', bgClass: 'bg-indigo-700', borderClass: 'border-indigo-700' },
  { name: 'Negro Minimalista', value: '#0f172a', bgClass: 'bg-slate-900', borderClass: 'border-slate-900' },
];
