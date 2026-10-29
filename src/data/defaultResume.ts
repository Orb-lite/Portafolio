import { ResumeData, StyleConfig } from '../types/resume';

export const resumeDataEs: ResumeData = {
  personalInfo: {
    fullName: 'Isaac Gómez Estrada',
    title: 'Artista Técnico (Technical Artist)',
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
      'Artista Técnico e Ingeniero de Simulación 3D en Tiempo Real de 32 años con más de 8 años de trayectoria conectando arte, código y arquitectura de pipelines en desarrollo de videojuegos AAA, gemelos digitales industriales y entornos virtuales interactivos. Artista Técnico con crédito público verificado en MobyGames para el título deportivo AAA de clase mundial EA Sports College Football 25 con un publisher global líder, especializado en UI/UX interactiva en el motor Frostbite, optimización rigurosa a 60+ FPS, control de versiones con Perforce (P4 Helix Core) e integración continua automatizada con Jenkins. Extensa experiencia en Unreal Engine 5 (UE5) y Arch FlexSim desarrollando Gemelos Digitales (Digital Twins) de manufactura para corporativos globales Fortune 500 (sectores automotriz, tecnología y farmacéutico bajo estricta confidencialidad). Sólida capacidad de desarrollo de herramientas de pipeline y automatización (Python, TypeScript, C++, Blueprints, Shaders) y despliegue multiplataforma (PC, Consolas, VR, Móvil y WebGL).',
    photoUrl: '',
  },
  experiences: [
    {
      id: 'exp-devbot',
      role: 'Artista Técnico (Technical Artist)',
      company: 'DEVBOT (Estudio de Co-Desarrollo de Videojuegos AAA)',
      location: 'Monterrey, Nuevo León, México (Remoto)',
      startDate: 'Ene 2022',
      endDate: 'Ago 2023',
      isCurrent: false,
      highlights: [
        'Desempeño como Artista Técnico asignado a la producción deportiva AAA de clase mundial EA Sports College Football 25 para publisher internacional líder, especializándome en UI/UX interactiva y motor Frostbite (crédito público y verificable en MobyGames).',
        'Desarrollo, integración técnica y validación del primer build funcional y jugable para producciones deportivas AAA de lanzamiento global, asegurando estabilidad a 60+ FPS y estricta fidelidad visual.',
        'Gestión integral del control de versiones y branching con Perforce (P4 Helix Core) en pipelines masivos de co-desarrollo multicentro.',
        'Mantenimiento y ejecución de pruebas automatizadas de integración continua (CI) mediante Jenkins para validación de builds y aceleración de entregas.',
      ],
    },
    {
      id: 'exp-flex',
      role: 'Artista Técnico & Especialista en Unreal Engine 5 (Digital Twins)',
      company: 'Multinacional de Soluciones de Manufactura y Tecnología (Flex)',
      location: 'Zapopan, Jalisco, México (Híbrido)',
      startDate: 'Jun 2024',
      endDate: 'Abr 2026',
      isCurrent: false,
      highlights: [
        'Desarrollo de Gemelos Digitales (Digital Twins) de piso de producción industrial para corporativos globales Fortune 500 (sectores automotriz, tecnología avanzada y farmacéutica bajo acuerdos de confidencialidad).',
        'Simulación en tiempo real de líneas de producción automatizadas con Unreal Engine 5 y Arch FlexSim, detectando fallas de maquinaria y cuellos de botella antes del traspaso a estaciones de ensamble subsiguientes.',
        'Simulación de espacios óptimos considerando separación de líneas y maquinaria para prevención de sobrecalentamiento y maximización de flujo de piezas.',
        'Creación de simuladores inmersivos en Realidad Virtual (VR) para capacitación segura y efectiva de nuevos operarios en maquinaria especializada.',
      ],
    },
    {
      id: 'exp-orblite',
      role: 'Lead Automation Engineer & Platform Developer',
      company: 'Orblite',
      location: 'México',
      startDate: 'Jun 2026',
      endDate: 'Presente',
      isCurrent: true,
      highlights: [
        'Tooling & Automatización: Diseñó y desplegó herramientas internas y pipelines integrando APIs modernas de IA y Modelos de Lenguaje Grande (LLMs) para automatizar análisis de datos y flujos de trabajo.',
        'Simulación de Sensores & Telemática: Diseñó la arquitectura de extremo a extremo para telemetría vehicular en tiempo real, procesando y simulando flujos de sensores de alta frecuencia.',
        'Plataformas Propietarias: Desarrolló aplicaciones internas de ERP/CRM desde cero con TypeScript, React y Supabase SQL para monitoreo y rastreo de activos en tiempo real.',
        'Tech Stack: TypeScript, React, APIs REST, SQL (Supabase), Python, Cloudflare.',
      ],
    },
    {
      id: 'exp-navi',
      role: 'Artista Técnico & Desarrollador 3D Interactivo',
      company: 'Navi 3D - Realidad Virtual y Maquetas Virtuales',
      location: 'Guadalajara, Jalisco, México (Remoto)',
      startDate: 'Abr 2021',
      endDate: 'Ago 2021',
      isCurrent: false,
      highlights: [
        'Desarrollo de sistema interactivo 3D en tiempo real en Unreal Engine 4 para showrooms inmobiliarios con visualización de fichas técnicas y disponibilidad.',
        'Integración con bases de datos SQL y APIs para cálculo de comisiones e informes en tiempo real.',
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
        'Desarrollo de simulación interactiva 3D en Unreal Engine 4 para campaña de concientización y sustentabilidad del uso de agua para entidad gubernamental.',
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
        'Desarrollo de videojuegos y experiencias interactivas multiplataforma: PC Windows, móviles (iOS y Android), WebGL y cascos VR (Meta Quest, HTC Vive, Oculus Rift).',
        'Implementación de sistemas de IA, shaders, optimización de draw calls y animaciones técnicas para proyectos de universidades y empresas.',
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
      name: 'Motores 3D, Tiempo Real & Videojuegos AAA',
      skills: [
        'Unreal Engine 5 & UE4',
        'Frostbite Engine (Títulos Deportivos AAA)',
        'Blueprints & Shaders / HLSL',
        'Optimización de Rendimiento (60+ FPS)',
        'Perfiles de Memoria & Draw Calls',
        'UI/UX Interactiva en Motor',
      ],
    },
    {
      id: 'skill-cat-2',
      name: 'Pipelines, Control de Versiones & CI/CD',
      skills: [
        'Perforce (P4 Helix Core)',
        'Jenkins (CI/CD Automático)',
        'Pipelines de Assets 3D',
        'Git & GitHub',
        'Automatización con Python',
        'Herramientas Internas de Producción',
      ],
    },
    {
      id: 'skill-cat-3',
      name: 'Simulación Industrial, Gemelos Digitales & VR',
      skills: [
        'Digital Twins (Gemelos Digitales)',
        'Arch FlexSim (Simulación de Fábricas)',
        'Realidad Virtual (VR - Quest / HTC)',
        'Simulación de Sensores & Telemática',
        'Optimización Térmica y de Espacios',
        'Entornos Inmersivos de Capacitación',
      ],
    },
    {
      id: 'skill-cat-4',
      name: 'Programación & Stack Tecnológico',
      skills: [
        'C++',
        'Python',
        'TypeScript & JavaScript Moderno',
        'React & Tailwind CSS',
        'APIs RESTful & Supabase (SQL)',
        'Cloudflare & Despliegues Cloud',
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
      name: 'Especialización en Unreal Engine 5: Gemelos Digitales & Blueprints',
      issuer: 'Epic Games / Simulación Industrial',
      year: '2024',
    },
    {
      id: 'cert-2',
      name: 'Gestión de Pipelines CI/CD y Control de Versiones (Perforce & Jenkins)',
      issuer: 'DevOps & Game Development Hub',
      year: '2022',
    },
    {
      id: 'cert-3',
      name: 'Desarrollo de Plataformas SaaS & Automatización con Inteligencia Artificial',
      issuer: 'Tecnología y Negocios Digitales',
      year: '2026',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Título AAA Shipped',
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
      title: 'Herramientas & Simulación',
      metric: 'Pipelines & Telemática',
      description: 'Plataforma integral de sensores, simulación y herramientas internas para producción.',
    },
  ],
};

export const resumeDataEn: ResumeData = {
  personalInfo: {
    fullName: 'Isaac Gómez Estrada',
    title: 'Technical Artist',
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
      'Senior Technical Artist and Real-Time 3D Simulation Engineer with 8+ years of experience bridging art, interactive systems, and production pipelines across AAA game development, industrial digital twins, and virtual environments. Shipped Technical Artist on premier world-class sports franchise EA Sports College Football 25 for a leading global publisher (verified public credit on MobyGames), specializing in interactive UI/UX architecture, Frostbite engine pipelines, 60+ FPS performance optimization, Perforce P4 Helix Core branching, and Jenkins automated CI/CD validation. Extensive background building manufacturing Digital Twins and real-time assembly line simulations for Fortune 500 enterprise leaders (automotive, advanced tech, and pharmaceutical sectors under strict NDAs) with Unreal Engine 5 (UE5) and Arch FlexSim. Strong technical background in custom pipeline tooling (Python, TypeScript, C++, Blueprints, HLSL/Shaders) and cross-platform deployment (PC, Console, VR, Mobile, WebGL).',
    photoUrl: '',
  },
  experiences: [
    {
      id: 'exp-devbot',
      role: 'Technical Artist',
      company: 'DEVBOT (AAA Game Co-Development Studio)',
      location: 'Monterrey, Nuevo Leon, Mexico (Remote)',
      startDate: 'Jan 2022',
      endDate: 'Aug 2023',
      isCurrent: false,
      highlights: [
        'Served as Technical Artist assigned to premier AAA sports franchise EA Sports College Football 25 for a leading global publisher, specializing in interactive UI/UX architecture and Frostbite engine pipelines (verified public credit on MobyGames).',
        'Engineered and validated initial playable game builds for world-class AAA sports titles, ensuring solid 60+ FPS performance, memory budget adherence, and high visual fidelity.',
        'Managed large-scale source control, asset branching, and merge conflict resolution using Perforce (P4 Helix Core) in multi-site co-development pipelines.',
        'Maintained automated continuous integration (CI) test suites using Jenkins to streamline studio-wide deployments and milestone delivery.',
      ],
    },
    {
      id: 'exp-flex',
      role: 'Technical Artist & Unreal Engine Specialist (Digital Twins)',
      company: 'Multinational Manufacturing & Technology (Flex - Industrial Simulation)',
      location: 'Zapopan, Jalisco, Mexico (Hybrid)',
      startDate: 'Jun 2024',
      endDate: 'Apr 2026',
      isCurrent: false,
      highlights: [
        'Engineered manufacturing Digital Twins for global Fortune 500 enterprise leaders (automotive, advanced tech, and pharmaceutical sectors under strict NDAs) using Unreal Engine 5 (UE5) and Arch FlexSim.',
        'Simulated automated assembly line workflows in real time, detecting machine failures and bottlenecks before parts proceeded to subsequent workstations.',
        'Modeled optimal spatial floor layouts and thermal spacing between production lines and machinery to prevent overheating and maximize throughput.',
        'Created immersive Virtual Reality (VR) simulators for onboarding and safety training of plant operators handling specialized machinery.',
      ],
    },
    {
      id: 'exp-orblite',
      role: 'Lead Automation Engineer & Platform Developer',
      company: 'Orblite',
      location: 'Mexico',
      startDate: 'Jun 2026',
      endDate: 'Present',
      isCurrent: true,
      highlights: [
        'Tooling & Automation Pipelines: Engineered custom internal tools and automated workflows integrating modern AI APIs and LLMs to accelerate data analysis and pipeline efficiency.',
        'Real-Time Telemetry & Sensor Simulation: Architected end-to-end full-stack infrastructure for real-time vehicle telematics, simulating high-frequency sensor streams and vehicle telemetry.',
        'Systems & Internal Platforms: Developed internal ERP/CRM tooling and asset tracking platforms using TypeScript, React, RESTful APIs, and Supabase SQL.',
        'Tech Stack: TypeScript, React, RESTful APIs, SQL (Supabase), Python, Cloudflare.',
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
        'Developed an interactive real-time 3D simulation in Unreal Engine 4 for a public water conservation and sustainability initiative with a state government entity.',
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
      name: '3D Engines & Real-Time Tech',
      skills: [
        'Unreal Engine 5 & UE4',
        'Frostbite Engine (AAA Sports Titles)',
        'Blueprints & Shaders / HLSL',
        'Performance Profiling & 60+ FPS Optimization',
        'Memory Budgets & Draw Call Reduction',
        'Interactive In-Engine UI/UX',
      ],
    },
    {
      id: 'skill-cat-2',
      name: 'Pipeline, Version Control & CI/CD',
      skills: [
        'Perforce (P4 Helix Core)',
        'Jenkins (Automated CI/CD)',
        '3D Asset Pipelines & Importers',
        'Git & GitHub',
        'Python Pipeline Automation',
        'Custom Production Tooling',
      ],
    },
    {
      id: 'skill-cat-3',
      name: 'Industrial Simulation, Digital Twins & VR',
      skills: [
        'Industrial Digital Twins',
        'Arch FlexSim (Factory Floor Simulation)',
        'Virtual Reality (VR - Quest / HTC Vive)',
        'Sensor Telemetry & Physics Simulation',
        'Thermal & Spatial Layout Optimization',
        'Immersive Operator Training Environments',
      ],
    },
    {
      id: 'skill-cat-4',
      name: 'Programming & Platform Tech',
      skills: [
        'C++',
        'Python',
        'TypeScript & Modern JavaScript',
        'React & Tailwind CSS',
        'RESTful APIs & Supabase (SQL)',
        'Cloudflare & Cloud Deployments',
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
      name: 'Unreal Engine 5 Specialization: Industrial Digital Twins & Blueprints',
      issuer: 'Epic Games / Industrial Simulation',
      year: '2024',
    },
    {
      id: 'cert-2',
      name: 'Enterprise CI/CD Pipelines & Source Control (Perforce & Jenkins)',
      issuer: 'DevOps & Game Dev Hub',
      year: '2022',
    },
    {
      id: 'cert-3',
      name: 'SaaS Platform Development & AI Automation',
      issuer: 'Digital Business & Technology Institute',
      year: '2026',
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
      title: 'Simulation & Tooling',
      metric: 'Pipelines & Telematics',
      description: 'End-to-end telemetry, sensor simulation, and automated production tooling.',
    },
  ],
};

// Base profile is Technical Artist in English as requested by user
export const initialResumeData: ResumeData = resumeDataEn;

export const defaultStyleConfig: StyleConfig = {
  template: 'executive',
  accentColor: '#0284c7', // Sapphire / Tech Blue
  fontFamily: 'sans',
  spacing: 'compact',
  showPhoto: false,
  paperSize: 'letter',
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
