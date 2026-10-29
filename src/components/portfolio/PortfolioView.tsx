import React, { useState } from 'react';
import {
  Gamepad2,
  FolderOpen,
  Github,
  Globe,
  ExternalLink,
  Play,
  Film,
  Sparkles,
  Layers,
  Cpu,
  Trophy,
  Maximize2,
  X,
  Compass,
  CheckCircle2,
  ChevronRight,
  Filter,
  Monitor,
  Flame,
  Boxes,
  ShieldCheck,
  Building2,
  Lock,
  Info,
} from 'lucide-react';

export interface LocalizedString {
  en: string;
  es: string;
}

export interface LocalizedArray {
  en: string[];
  es: string[];
}

export type WorkClassification = 'aaa-studio' | 'personal-rnd' | 'enterprise-client';

export interface ProjectItem {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  category: 'all' | 'virtual-env' | 'aaa-games' | 'simulation' | 'art';
  categoryLabel: LocalizedString;
  workClassification: WorkClassification;
  year: string;
  engine: string;
  mediaType: 'video' | 'image' | 'external';
  mediaSrc?: string;
  youtubeId?: string;
  thumbnailSrc?: string;
  mediaNote?: LocalizedString;
  description: LocalizedString;
  highlights: LocalizedArray;
  techStack: string[];
  externalUrl?: string;
  externalLabel?: LocalizedString;
  mobyGamesUrl?: string;
  featured?: boolean;
}

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'shipped-aaa-titles',
    title: {
      en: 'EA Sports College Football 25',
      es: 'EA Sports College Football 25',
    },
    subtitle: {
      en: 'Shipped AAA Sports Title (MobyGames Verified Credit)',
      es: 'Título Deportivo AAA Lanzado (Crédito Verificado en MobyGames)',
    },
    category: 'aaa-games',
    categoryLabel: {
      en: 'AAA Games & Co-Dev',
      es: 'Videojuegos AAA & Co-Desarrollo',
    },
    workClassification: 'aaa-studio',
    year: '2024',
    engine: 'Frostbite Engine',
    mediaType: 'video',
    youtubeId: 'ubRvxZC4jGI',
    thumbnailSrc: 'https://img.youtube.com/vi/ubRvxZC4jGI/maxresdefault.jpg',
    mediaNote: {
      en: 'Shipped AAA console title co-developed under studio NDA at DEVBOT for EA Sports. Publicly demonstrated via official EA gameplay showcase and verified MobyGames credits.',
      es: 'Título AAA de consola co-desarrollado bajo estricto acuerdo de confidencialidad (NDA) en DEVBOT para EA Sports. Demostrado mediante gameplay oficial de EA y créditos verificados en MobyGames.',
    },
    description: {
      en: 'Verified public credit on MobyGames for flagship sports release EA Sports College Football 25. Co-developed at DEVBOT for premier global publisher Electronic Arts (EA Sports). Provided critical Technical Art and QA support across UI/UX systems, Frostbite engine pipelines, initial playable build performance, and console certification for PlayStation 5 and Xbox Series X/S.',
      es: 'Crédito público verificado en MobyGames para el lanzamiento deportivo insignia EA Sports College Football 25. Co-desarrollado en DEVBOT para el publisher líder global Electronic Arts (EA Sports). Soporte crítico como Artista Técnico y QA en sistemas de UI/UX, pipelines en Frostbite Engine, rendimiento en builds jugables iniciales y certificación de consola para PlayStation 5 y Xbox Series X/S.',
    },
    highlights: {
      en: [
        'Publicly verified credits on MobyGames database for Isaac Gómez',
        'Engineered & validated initial playable build ensuring steady 60+ FPS performance',
        'Interactive UI/UX implementation in proprietary Frostbite Engine',
        'Large-scale source control with Perforce (Helix Core) and automated Jenkins CI/CD',
      ],
      es: [
        'Crédito verificado públicamente en la base de datos de MobyGames para Isaac Gómez',
        'Ingeniería y validación del primer build jugable asegurando rendimiento sostenido a 60+ FPS',
        'Implementación de sistemas de UI/UX interactiva en el motor propietario Frostbite',
        'Control de versiones a gran escala con Perforce (Helix Core) y automatización CI/CD con Jenkins',
      ],
    },
    techStack: ['Frostbite Engine', 'Perforce Helix Core', 'Jenkins CI', 'C++', 'UI/UX', 'PS5', 'Xbox Series X/S'],
    externalUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    externalLabel: {
      en: 'View Verified MobyGames Credits',
      es: 'Ver Créditos Verificados en MobyGames',
    },
    mobyGamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    featured: true,
  },
  {
    id: 'watercolor-sim',
    title: {
      en: 'Acuarela - Stylized Interactive Virtual Environment',
      es: 'Acuarela - Entorno Virtual Interactivo Estilizado',
    },
    subtitle: {
      en: 'Real-Time Non-Photorealistic Rendering (NPR) & Exploration in Unreal Engine',
      es: 'Renderizado No Fotorrealista (NPR) en Tiempo Real y Exploración en Unreal Engine',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Entornos Virtuales Interactivos',
    },
    workClassification: 'personal-rnd',
    year: '2022',
    engine: 'Unreal Engine (PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/watercolor-development-viewport.mp4',
    mediaNote: {
      en: "Isaac's personal technical R&D in Unreal Engine: Direct screen recording from Isaac's independent development workstation testing custom watercolor HLSL post-process shaders.",
      es: 'I+D técnico personal de Isaac en Unreal Engine: Grabación de pantalla directa desde su estación de desarrollo independiente probando shaders de post-proceso en HLSL estilo acuarela.',
    },
    description: {
      en: 'An expressive interactive 3D virtual environment built in Unreal Engine featuring custom stylized post-processing shaders mimicking traditional watercolor paintings. Players navigate an atmospheric architectural setting with real-time dynamic lighting, ambient audio, and responsive player movement.',
      es: 'Entorno virtual 3D interactivo y expresivo desarrollado en Unreal Engine con shaders de post-procesamiento estilizados personalizados que emulan pinturas en acuarela tradicionales. Permite navegar por un escenario arquitectónico atmosférico con iluminación dinámica en tiempo real, audio ambiental y locomoción reactiva.',
    },
    highlights: {
      en: [
        'Custom HLSL post-process material edge detection & watercolor pigment bleeding',
        'Smooth 60+ FPS navigation in 64-bit Standalone Windows preview',
        'Dynamic lighting, particle dust motes, and atmospheric depth cues',
      ],
      es: [
        'Material de post-proceso en HLSL con detección de bordes y dispersión de pigmentos de acuarela',
        'Navegación fluida a 60+ FPS en preview ejecutable Standalone para Windows de 64 bits',
        'Iluminación dinámica, partículas de polvo en suspensión y efectos atmosféricos de profundidad',
      ],
    },
    techStack: ['Unreal Engine', 'HLSL / Shaders', 'Post-Process Materials', 'DirectX SM5', 'C++ / Blueprints'],
    featured: true,
  },
  {
    id: 'scores-sports-sim',
    title: {
      en: 'Sports Broadcast & Real-Time Scoreboard HUD System',
      es: 'Simulación de Transmisión Deportiva y Marcador HUD en Tiempo Real',
    },
    subtitle: {
      en: 'ActionScript, C++ & Frostbite Engine Broadcast Scorebug Pipeline',
      es: 'Pipeline de Scorebug y Gráficos de Transmisión en ActionScript, C++ y Frostbite',
    },
    category: 'aaa-games',
    categoryLabel: {
      en: 'AAA Games & Co-Dev',
      es: 'Videojuegos AAA & Co-Desarrollo',
    },
    workClassification: 'aaa-studio',
    year: '2022 - 2024',
    engine: 'Frostbite Engine',
    mediaType: 'video',
    youtubeId: '3Rkj6FlMcLU',
    thumbnailSrc: 'https://img.youtube.com/vi/3Rkj6FlMcLU/maxresdefault.jpg',
    mediaNote: {
      en: 'AAA broadcast scoreboard system engineered on Frostbite under studio NDA. Publicly demonstrated via official game broadcast footage and verified MobyGames credits.',
      es: 'Sistema de HUD y marcador televisivo desarrollado en Frostbite bajo acuerdo de confidencialidad de estudio. Demostrado mediante metraje oficial de transmisión y créditos verificados en MobyGames.',
    },
    description: {
      en: 'Real-time sports game broadcast scoreboard and HUD system engineered using ActionScript integrated with high-performance C++ runtime on Frostbite Engine architecture for EA Sports College Football 25 title pipelines. Features sub-frame responsive scoreboard state machines, live clock synchronization, and broadcast-grade visual transitions.',
      es: 'Sistema de marcador y HUD de transmisión deportiva en tiempo real desarrollado con ActionScript integrado con tiempo de ejecución de alto rendimiento en C++ sobre la arquitectura de Frostbite Engine para pipelines de EA Sports College Football 25. Incluye máquinas de estados de marcador con actualización instantánea cuadro a cuadro, sincronización de reloj en vivo y transiciones visuales con estándares televisivos.',
    },
    highlights: {
      en: [
        'Engineered in ActionScript integrated with C++ runtime on Frostbite Engine architecture',
        'Sub-frame responsive scorebug state machine handling quarters/halves, points, and game timers',
        'Broadcast-grade typography, dynamic score tracking, and team branding color theming',
        'Engineered for EA Sports AAA game presentation pipelines and console certification',
      ],
      es: [
        'Desarrollado en ActionScript integrado con tiempo de ejecución en C++ sobre Frostbite Engine',
        'Máquina de estados de scorebug con respuesta instantánea manejando cuartos/tiempos, puntos y cronómetros',
        'Tipografía con estándares de transmisión televisiva, control dinámico de marcador y paletas de equipo',
        'Diseñado para pipelines de presentación AAA de EA Sports y certificación en consolas',
      ],
    },
    techStack: ['ActionScript', 'C++', 'Frostbite Engine', 'EA Sports UI/HUD', 'Perforce Helix Core', 'Broadcast Graphics'],
    externalUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    externalLabel: {
      en: 'View Verified MobyGames Credits',
      es: 'Ver Créditos Verificados en MobyGames',
    },
    mobyGamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    featured: true,
  },
  {
    id: 'vdb-volumetric-sim',
    title: {
      en: 'OpenVDB Volumetric Smoke & Cloud Simulation',
      es: 'Simulación Volumétrica de Humo y Nubes con OpenVDB',
    },
    subtitle: {
      en: 'GPU-Accelerated Heterogeneous Volume Rendering',
      es: 'Renderizado de Volúmenes Heterogéneos Acelerado por GPU',
    },
    category: 'simulation',
    categoryLabel: {
      en: '3D Simulation & VFX',
      es: 'Simulación 3D & Efectos Visuales',
    },
    workClassification: 'personal-rnd',
    year: '2024',
    engine: 'Unreal Engine 5 (Niagara & OpenVDB)',
    mediaType: 'external',
    mediaNote: {
      en: "Personal research project exploring OpenVDB sparse voxel volume rendering and Niagara in Unreal Engine 5.",
      es: 'Proyecto de investigación personal explorando renderizado de volúmenes OpenVDB y Niagara en Unreal Engine 5.',
    },
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Project in Drive Archive',
      es: 'Ver Proyecto en Carpeta Drive',
    },
    description: {
      en: 'Cutting-edge volumetric simulation inside Unreal Engine 5 taking advantage of OpenVDB spatial data structures. Computes high-density smoke plumes, atmospheric scattering, and light absorption in real time.',
      es: 'Simulación volumétrica de vanguardia en Unreal Engine 5 utilizando estructuras de datos espaciales OpenVDB. Calcula plumas de humo de alta densidad, dispersión atmosférica y absorción lumínica en tiempo real.',
    },
    highlights: {
      en: [
        'GPU-accelerated raymarching of 3D density grids without baking artifacts',
        'Physically accurate phase function scattering and shadow penetration',
        'Interactive viewport parameter adjustments for density, absorption, and velocity',
      ],
      es: [
        'Raymarching acelerado por GPU de mallas volumétricas 3D sin artefactos de horneado',
        'Dispersión física precisa mediante funciones de fase y penetración de sombras',
        'Ajustes interactivos de densidad, absorción y velocidad en tiempo real desde el viewport',
      ],
    },
    techStack: ['Unreal Engine 5', 'OpenVDB', 'Niagara VFX', 'Heterogeneous Volumes', 'GPU Shaders'],
    featured: true,
  },
  {
    id: 'class-sim',
    title: {
      en: 'ClassSim - Interactive Classroom Virtual Simulation',
      es: 'ClassSim - Simulación Virtual Interactiva de Aulas',
    },
    subtitle: {
      en: 'Spatial Presence & Interactive Education Environment',
      es: 'Presencia Espacial y Entorno Interactivo de Educación',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Entornos Virtuales Interactivos',
    },
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Engine (Standalone NetMode)',
    mediaType: 'external',
    mediaNote: {
      en: 'Personal interactive 3D virtual environment and spatial navigation study built in Unreal Engine.',
      es: 'Estudio y entorno virtual 3D interactivo personal de navegación espacial desarrollado en Unreal Engine.',
    },
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Project in Drive Archive',
      es: 'Ver Proyecto en Carpeta Drive',
    },
    description: {
      en: 'Interactive 3D simulation of an academic auditorium and classroom setting designed for training, multi-perspective spatial awareness, and interactive virtual navigation.',
      es: 'Simulación 3D interactiva de un auditorio y aula académica diseñada para capacitación, conciencia espacial multiperspectiva y navegación virtual interactiva.',
    },
    highlights: {
      en: [
        'Interactive first-person controller with collision geometry and sightline testing',
        'Realistic architectural scaling, natural light bounce, and seating arrangements',
        'Optimized standalone Windows build for lightweight distribution',
      ],
      es: [
        'Controlador interactivo en primera persona con geometría de colisión y análisis visual',
        'Escala arquitectónica realista, rebote de luz natural y distribución ergonómica',
        'Build ejecutable Standalone para Windows altamente optimizado para distribución ligera',
      ],
    },
    techStack: ['Unreal Engine', 'Architectural Visualization', 'Standalone Build', 'C++ / Blueprints'],
  },
  {
    id: 'procedural-world-gen',
    title: {
      en: 'RWGen - Procedural World & Environment Generation',
      es: 'RWGen - Generación Procedimental de Mundos y Terrenos',
    },
    subtitle: {
      en: 'Algorithmic Terrain Biomes & Runtime Spatial Streaming',
      es: 'Biomas Algorítmicos de Terreno y Streaming Espacial en Tiempo de Ejecución',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Entornos Virtuales Interactivos',
    },
    workClassification: 'personal-rnd',
    year: '2022',
    engine: 'Unreal Engine Procedural Systems',
    mediaType: 'external',
    mediaNote: {
      en: 'Personal algorithmic terrain generation and biome scattering research in Unreal Engine.',
      es: 'Investigación personal de generación algorítmica de terrenos y biomas procedimentales en Unreal Engine.',
    },
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Project in Drive Archive',
      es: 'Ver Proyecto en Carpeta Drive',
    },
    description: {
      en: 'Algorithmic terrain generation and procedural landscape populating. Demonstrates runtime biome generation, rule-based vegetation scattering, and scalable level-of-detail (LOD) streaming.',
      es: 'Generación algorítmica de terrenos y poblamiento procedimental de paisajes. Demuestra generación de biomas en tiempo de ejecución, distribución de vegetación basada en reglas y streaming escalable por nivel de detalle (LOD).',
    },
    highlights: {
      en: [
        'Noise-based heightmap elevation blending and biome transition zones',
        'Foliage instance clustering optimized for high framerates on standard GPUs',
        'Procedural generation rules eliminating repetitive manual level placement',
      ],
      es: [
        'Fusión de elevaciones por mapa de alturas con ruido y zonas de transición entre biomas',
        'Agrupamiento de instancias de vegetación optimizado para altos framerates en GPUs comunes',
        'Reglas procedimentales que eliminan la colocación manual repetitiva en niveles masivos',
      ],
    },
    techStack: ['Unreal Engine', 'Procedural Algorithms', 'Landscape Tools', 'HLSL', 'LOD Streaming'],
  },
  {
    id: 'unreal-editor-multiplayer',
    title: {
      en: 'Unreal Engine Multiplayer & Server Architecture Preview',
      es: 'Arquitectura Multijugador y Servidor Dedicado en Unreal Engine',
    },
    subtitle: {
      en: 'Client-Server Replication, RPCs & Network Synchronization',
      es: 'Replicación Cliente-Servidor, RPCs y Sincronización en Red',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Entornos Virtuales Interactivos',
    },
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Engine (Server 64-bit PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/unreal-multiplayer-server-preview.mp4',
    mediaNote: {
      en: "Isaac's personal R&D screen capture: Testing client-server replication, authoritative physics, and network debug tools in Unreal Engine.",
      es: 'Grabación de pantalla de I+D personal de Isaac: Pruebas de replicación cliente-servidor, físicas autoritativas y depuración de red en Unreal Engine.',
    },
    description: {
      en: 'Dedicated server multiplayer simulation testing real-time client-to-server replication, authoritative state verification, position interpolation, and network debug tools in Unreal Engine.',
      es: 'Simulación multijugador con servidor dedicado probando replicación de cliente a servidor en tiempo real, verificación de estado autoritativo, interpolación de posiciones y herramientas de depuración de red en Unreal Engine.',
    },
    highlights: {
      en: [
        'Server-authoritative physics and network replication setup',
        'Multi-client window debugging with synchronized game state in real time',
        'Deep workflow familiarity with Unreal Editor internal build pipelines',
      ],
      es: [
        'Físicas con servidor autoritativo y configuración de replicación en red',
        'Depuración en múltiples ventanas con clientes simultáneos y estado sincronizado',
        'Dominio profundo de pipelines de compilación interna de Unreal Editor',
      ],
    },
    techStack: ['Unreal Engine', 'Multiplayer Networking', 'Replication / RPCs', 'Server Architecture'],
  },
  {
    id: 'industrial-digital-twins',
    title: {
      en: 'Industrial Manufacturing Digital Twins (Flex)',
      es: 'Gemelos Digitales de Manufactura Industrial (Flex)',
    },
    subtitle: {
      en: 'Assembly Line Simulation & VR Training for Fortune 500 Enterprises',
      es: 'Simulación de Líneas de Ensamble y Capacitación VR para Clientes Fortune 500',
    },
    category: 'simulation',
    categoryLabel: {
      en: '3D Simulation & VFX',
      es: 'Simulación 3D & Gemelos Digitales',
    },
    workClassification: 'enterprise-client',
    year: '2024 - 2026',
    engine: 'Unreal Engine 5 & FlexSim',
    mediaType: 'external',
    mediaNote: {
      en: 'Enterprise industrial simulation and VR training at Flex for Fortune 500 manufacturing plants (proprietary client data protected by NDA).',
      es: 'Simulación industrial corporativa y entrenamiento VR en Flex para plantas de manufactura Fortune 500 (datos propietarios de clientes protegidos por NDA).',
    },
    description: {
      en: 'High-precision real-time 3D Digital Twins of industrial manufacturing floors for global Fortune 500 enterprises across automotive, advanced technology, and pharmaceutical sectors (under strict NDAs). Modeled assembly line throughput, automated failure detection, and thermal spacing.',
      es: 'Gemelos Digitales 3D en tiempo real de alta precisión para plantas industriales de empresas Fortune 500 globales en sectores automotriz, tecnología avanzada y farmacéutica (bajo estricta confidencialidad). Modelado de capacidad de ensamble, detección automática de fallas y espaciado térmico.',
    },
    highlights: {
      en: [
        'Pre-empted physical machine assembly bottlenecks using predictive 3D simulations',
        'Calculated optimal machinery spacing to avoid thermal overheating on floor',
        'Created immersive VR training modules for safe operational onboarding on heavy robotics',
      ],
      es: [
        'Detección anticipada de cuellos de botella en ensamble mediante simulaciones predictivas 3D',
        'Cálculo de separación óptima de maquinaria para prevenir sobrecalentamiento en planta',
        'Módulos inmersivos de capacitación en Realidad Virtual para inducción segura en robótica pesada',
      ],
    },
    techStack: ['Unreal Engine 5', 'FlexSim', 'Industrial IoT', 'VR (Virtual Reality)', 'Python', 'Digital Twins'],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Portfolio Drive Folder',
      es: 'Ver Carpeta de Portafolio en Drive',
    },
  },
  {
    id: 'orblite-platform',
    title: {
      en: 'Orblite - SaaS Telematics & Vehicle Management Platform',
      es: 'Orblite - Plataforma SaaS de Telemática y Gestión Vehicular',
    },
    subtitle: {
      en: 'Full-Stack Fleet Monitoring, Sensor Telemetry & Internal ERP/CRM',
      es: 'Monitoreo de Flotas Full-Stack, Telemetría de Sensores y ERP/CRM Interno',
    },
    category: 'simulation',
    categoryLabel: {
      en: '3D Simulation & VFX',
      es: 'Arquitectura de Software & Telemática',
    },
    workClassification: 'enterprise-client',
    year: '2026 - Present',
    engine: 'React / TypeScript / Supabase',
    mediaType: 'external',
    mediaNote: {
      en: 'Commercial SaaS telematics platform and vehicle tracking portal engineered for active fleet operations.',
      es: 'Plataforma SaaS comercial de telemática y portal de monitoreo vehicular para operaciones de flotas en vivo.',
    },
    description: {
      en: 'Commercial telematics SaaS platform engineered from the ground up for GPS tracking, telemetry analytics, and vehicle operations. Includes proprietary internal CRM and ERP systems, AI-powered prospecting tools, and high-performance cloud deployment.',
      es: 'Plataforma SaaS comercial de telemática desarrollada desde cero para rastreo GPS, analítica telemática y operaciones vehiculares. Incluye sistemas CRM y ERP propietarios, automatización de prospección con IA y despliegue cloud de alto rendimiento.',
    },
    highlights: {
      en: [
        'End-to-end full-stack web architecture serving live fleets and enterprise clients',
        'Real-time telemetry map tracking, automated alerts, and financial reporting',
        'Source code publicly visible on GitHub organization repositories',
      ],
      es: [
        'Arquitectura web full-stack de extremo a extremo para flotas activas y clientes corporativos',
        'Rastreo telemático en mapa en tiempo real, alertas automatizadas y reportes financieros',
        'Repositorios de código estructurados y visibles en la organización de GitHub',
      ],
    },
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Supabase', 'Vercel', 'Cloudflare', 'REST APIs'],
    externalUrl: 'https://orb-lite.com',
    externalLabel: {
      en: 'Visit orb-lite.com',
      es: 'Visitar orb-lite.com',
    },
  },
  {
    id: 'unreal-editor-project4',
    title: {
      en: 'Unreal Engine Scene Assembly & Level Construction',
      es: 'Montaje de Escenarios y Construcción de Niveles en Unreal Engine',
    },
    subtitle: {
      en: 'Lighting Setup, Material Instances & Viewport Profiling',
      es: 'Iluminación, Instancias de Materiales y Perfilado en Viewport',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Entornos Virtuales Interactivos',
    },
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Editor',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/unreal-editor-workflow.mp4',
    mediaNote: {
      en: "Isaac's personal screen recording inside Unreal Editor: Level assembly, material instancing, lighting building, and viewport profiling.",
      es: 'Grabación de pantalla personal de Isaac dentro de Unreal Editor: Montaje de nivel, instancias de materiales, cálculo de iluminación y perfilado en viewport.',
    },
    description: {
      en: 'In-editor level construction session demonstrating asset placement, volumetric fog tuning, static and dynamic light building, and performance profiling across rendering passes.',
      es: 'Sesión de construcción de nivel en editor demostrando colocación de assets, niebla volumétrica, cálculo de iluminación estática y dinámica, y perfilado de rendimiento en passes de render.',
    },
    highlights: {
      en: [
        'Material instance parameters tuning for physically based rendering (PBR)',
        'Draw call and polygon budget optimization for target platforms',
        'Real-time editor viewport profiling and debugging',
      ],
      es: [
        'Ajuste fino de instancias de materiales para renderizado basado en física (PBR)',
        'Optimización de presupuesto de polígonos y draw calls para plataformas de destino',
        'Depuración y perfilado de rendimiento en tiempo real en viewport del editor',
      ],
    },
    techStack: ['Unreal Engine', 'Level Design', 'PBR Materials', 'Profiling & Optimization'],
  },
  {
    id: 'concept-artworks',
    title: {
      en: 'Digital Concept Art & Environment Visual Development',
      es: 'Arte Conceptual Digital y Desarrollo Visual de Entornos',
    },
    subtitle: {
      en: 'Atmospheric Mood Studies & Creative Illustration',
      es: 'Estudios Atmosféricos de Iluminación e Ilustración Creativa',
    },
    category: 'art',
    categoryLabel: {
      en: 'Concept Art & Visual Dev',
      es: 'Arte Conceptual & Desarrollo Visual',
    },
    workClassification: 'personal-rnd',
    year: '2018 - 2022',
    engine: 'Photoshop / Digital Painting',
    mediaType: 'image',
    mediaSrc: '/portfolio_assets/concept-artwork-1.png',
    thumbnailSrc: '/portfolio_assets/concept-artwork-1.png',
    mediaNote: {
      en: "Isaac's personal visual development illustrations, color scripts, and atmospheric environment benchmarks.",
      es: 'Ilustraciones de desarrollo visual, guiones de color y estudios atmosféricos personales de Isaac.',
    },
    description: {
      en: 'Digital illustration and visual development exploratory artworks capturing mood, lighting, perspective, and stylized environment design for interactive virtual experiences.',
      es: 'Ilustraciones digitales y desarrollo visual exploratorio capturando atmósfera, iluminación, perspectiva y diseño estilizado de entornos para experiencias virtuales interactivas.',
    },
    highlights: {
      en: [
        'Exploration of color palettes, architectural silhouette, and lighting contrast',
        'Serves as visual target benchmarks before 3D environment grayboxing and shader authoring',
        'Original creative artworks from personal portfolio archive',
      ],
      es: [
        'Exploración de paletas de color, siluetas arquitectónicas y contraste lumínico',
        'Funciona como estándar visual previo al modelado 3D (grayboxing) y shaders',
        'Obras creativas originales del archivo de portafolio personal',
      ],
    },
    techStack: ['Digital Painting', 'Concept Art', 'Lighting Theory', 'Color Scripts'],
  },
];

interface PortfolioViewProps {
  language?: 'es' | 'en';
  onSwitchToCv: () => void;
  onSwitchToAbout: () => void;
}

export function PortfolioView({ language = 'es', onSwitchToCv, onSwitchToAbout }: PortfolioViewProps) {
  const isEn = language === 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [selectedArtIndex, setSelectedArtIndex] = useState<number>(0);

  const categories = [
    {
      id: 'all',
      label: isEn ? 'All Works' : 'Todos los Trabajos',
      icon: Layers,
    },
    {
      id: 'aaa-studio',
      label: isEn ? 'AAA Studio Titles (NDA)' : 'Títulos AAA de Estudio (NDA)',
      icon: Trophy,
    },
    {
      id: 'personal-rnd',
      label: isEn ? 'Personal R&D Screen Captures' : 'I+D Personal (Screen Recordings)',
      icon: Monitor,
    },
    {
      id: 'virtual-env',
      label: isEn ? 'Interactive Environments' : 'Entornos Interactivos',
      icon: Compass,
    },
    {
      id: 'simulation',
      label: isEn ? '3D Simulation & Digital Twins' : 'Simulación & Gemelos Digitales',
      icon: Boxes,
    },
    {
      id: 'art',
      label: isEn ? 'Concept Art' : 'Arte Conceptual',
      icon: Film,
    },
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'aaa-studio') return p.workClassification === 'aaa-studio';
    if (selectedCategory === 'personal-rnd') return p.workClassification === 'personal-rnd';
    return p.category === selectedCategory;
  });

  return (
    <div className="w-full flex flex-col space-y-8 animate-fade-in pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 md:p-10 border border-slate-700/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {isEn
                ? 'Interactive Virtual Environments & AAA Real-Time 3D'
                : 'Entornos Virtuales Interactivos & 3D en Tiempo Real'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Isaac Gómez Estrada
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {isEn ? (
              <>
                <span className="text-amber-400 font-semibold">32-year-old engineer</span> dedicated since{' '}
                <span className="text-sky-300 font-semibold">2018</span> to creating interactive virtual environments,
                Unreal Engine simulations, and high-performance 3D graphics. Credited on shipped AAA sports titles verified
                on MobyGames.
              </>
            ) : (
              <>
                <span className="text-amber-400 font-semibold">Ingeniero de 32 años</span> dedicado desde{' '}
                <span className="text-sky-300 font-semibold">2018</span> a la creación de entornos virtuales interactivos,
                simulaciones en Unreal Engine y gráficos 3D de alto rendimiento. Acreditado en títulos deportivos AAA lanzados
                al mercado y verificados en MobyGames.
              </>
            )}
          </p>

          {/* Quick Hub Links */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
            <a
              href="https://github.com/Orb-lite/Portafolio.git"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-medium border border-slate-600/70 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Github className="w-4 h-4 text-slate-200" />
              <span>GitHub: Portafolio</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>MobyGames ({isEn ? 'Shipped Credits' : 'Créditos AAA'})</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>

            <a
              href="https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-medium border border-slate-600/70 shadow-xs transition-all hover:scale-[1.02]"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Drive Portfolio Folder' : 'Carpeta de Portafolio en Drive'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://orb-lite.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium border border-slate-600/70 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>orb-lite.com</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={onSwitchToAbout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/70 hover:bg-indigo-600 text-white font-semibold transition-all hover:scale-[1.02]"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{isEn ? 'My Passions & Bio' : 'Mis Pasiones & Historia'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Verified Shipped AAA Highlight Banner */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isEn ? 'Shipped AAA Titles in Public Credits' : 'Títulos AAA Lanzados con Crédito Público'}
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                {isEn ? 'Verified on MobyGames' : 'Verificado en MobyGames'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {isEn ? (
                <>
                  Isaac Gómez Estrada is officially credited on <strong>EA Sports College Football 25</strong> (PS5, Xbox
                  Series X/S, 2024) developed in Frostbite Engine via co-development studio DEVBOT.
                </>
              ) : (
                <>
                  Isaac Gómez Estrada cuenta con crédito oficial en <strong>EA Sports College Football 25</strong> (PS5, Xbox
                  Series X/S, 2024) desarrollado con el motor Frostbite a través del estudio de co-desarrollo DEVBOT.
                </>
              )}
            </p>
          </div>
        </div>

        <a
          href="https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
        >
          <span>{isEn ? 'Open MobyGames Profile' : 'Ver Perfil en MobyGames'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      {/* Media Attribution & Studio NDA Disclosure Banner */}
      <section className="bg-slate-900 text-white border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {isEn ? 'Media Attribution & Studio Non-Disclosure Policies' : 'Atribución de Medios y Política de Confidencialidad (NDA)'}
              </h3>
              <span className="text-[10px] bg-slate-800 text-sky-300 font-semibold px-2 py-0.5 rounded border border-slate-700 font-mono">
                {isEn ? 'Verified Credits & Personal R&D' : 'Créditos Verificados & I+D Personal'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {isEn ? (
                <>
                  <span className="text-amber-300 font-semibold">AAA Studio & Client Projects (EA Sports / DEVBOT / Flex):</span> Protected by strict corporate NDAs. Internal workstation screen recordings are not published. Shipped game systems are demonstrated through authorized official broadcasts and verified MobyGames credits.
                  <br />
                  <span className="text-sky-300 font-semibold">Screen Recording Videos:</span> The direct viewport recordings in this portfolio showcase Isaac&apos;s personal technical R&amp;D and independent Unreal Engine experiments (watercolor NPR shaders, dedicated server multiplayer networking, and editor tooling).
                </>
              ) : (
                <>
                  <span className="text-amber-300 font-semibold">Títulos AAA y Proyectos de Estudio (EA Sports / DEVBOT / Flex):</span> Protegidos por estrictos acuerdos de confidencialidad (NDA). Las grabaciones de pantalla de estaciones internas de estudio no se divulgan. Los sistemas lanzados se demuestran con transmisiones oficiales y créditos verificados en MobyGames.
                  <br />
                  <span className="text-sky-300 font-semibold">Videos de Grabación de Pantalla (Screen):</span> Las grabaciones de pantalla directa corresponden exclusivamente al I+D técnico personal e independiente de Isaac en Unreal Engine (shaders NPR de acuarela, arquitectura multijugador con servidor dedicado y workflow de Unreal Editor).
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 bg-white border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {isEn ? (
            <>Showing <strong>{filteredProjects.length}</strong> project showcases</>
          ) : (
            <>Mostrando <strong>{filteredProjects.length}</strong> proyectos</>
          )}
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const title = project.title[language] || project.title.en;
          const subtitle = project.subtitle[language] || project.subtitle.en;
          const categoryLabel = project.categoryLabel[language] || project.categoryLabel.en;
          const description = project.description[language] || project.description.en;

          const isAaa = project.workClassification === 'aaa-studio';
          const isPersonalRnd = project.workClassification === 'personal-rnd';
          const isEnterprise = project.workClassification === 'enterprise-client';

          const badgeLabel = isAaa
            ? (isEn ? 'AAA Studio (NDA)' : 'Estudio AAA (NDA)')
            : isPersonalRnd
            ? (isEn ? 'Personal R&D' : 'I+D Personal')
            : (isEn ? 'Enterprise (NDA)' : 'Corporativo (NDA)');

          const mediaBadgeText = project.youtubeId
            ? (isEn ? 'Official Gameplay Broadcast' : 'Transmisión Oficial AAA')
            : project.mediaSrc
            ? (isEn ? "Isaac's Screen Recording" : 'Grabación de Pantalla (Isaac)')
            : (isEn ? 'Project Showcase' : 'Muestra del Proyecto');

          return (
            <div
              key={project.id}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-sky-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Project Media Preview Area */}
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                {project.mediaType === 'video' && (project.mediaSrc || project.youtubeId) ? (
                  <div
                    className="w-full h-full relative cursor-pointer group-hover:scale-105 transition-transform duration-500 bg-slate-950"
                    onClick={() => setActiveModalProject(project)}
                  >
                    {project.mediaSrc ? (
                      <video
                        src={project.mediaSrc}
                        autoPlay
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                      />
                    ) : project.youtubeId ? (
                      <div className="w-full h-full relative overflow-hidden">
                        <img
                          src={project.thumbnailSrc || `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                          alt={title}
                          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            if (project.youtubeId && !e.currentTarget.src.includes('hqdefault')) {
                              e.currentTarget.src = `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`;
                            }
                          }}
                        />
                      </div>
                    ) : null}

                    {/* Classification overlay pill */}
                    <div
                      className={`absolute top-2.5 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow ${
                        isAaa
                          ? 'bg-amber-500 text-slate-950'
                          : isPersonalRnd
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {isAaa && <Trophy className="w-3 h-3" />}
                      {isPersonalRnd && <Monitor className="w-3 h-3" />}
                      {isEnterprise && <Building2 className="w-3 h-3" />}
                      <span>{mediaBadgeText}</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-lg group-hover:bg-sky-500 group-hover:scale-110 transition-all">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 pointer-events-none">
                      <Film className="w-3 h-3 text-sky-400" />
                      <span>{project.youtubeId ? (isEn ? 'Watch Official Video' : 'Ver Transmisión Oficial') : (isEn ? 'Watch Screen Recording' : 'Ver Grabación de Pantalla')}</span>
                    </span>
                  </div>
                ) : project.mediaType === 'image' && project.mediaSrc ? (
                  <div
                    className="w-full h-full relative cursor-pointer group-hover:scale-105 transition-transform duration-500"
                    onClick={() => setActiveModalProject(project)}
                  >
                    <img
                      src={project.mediaSrc}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow bg-pink-500 text-slate-950">
                      <Sparkles className="w-3 h-3" />
                      <span>{isEn ? 'Visual Art' : 'Arte Visual'}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs">
                      {isEn ? 'View Full Art Canvas' : 'Ver Galería de Arte'}
                    </span>
                  </div>
                ) : (
                  <div
                    className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
                    onClick={() => setActiveModalProject(project)}
                  >
                    {isAaa ? (
                      <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
                    ) : (
                      <Globe className="w-12 h-12 text-sky-400 mb-2" />
                    )}
                    <h3 className="text-white font-bold text-sm">{title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{project.engine}</p>
                    <span className="mt-3 text-[11px] font-semibold text-sky-300 underline decoration-sky-400">
                      {isEn ? 'Explore Details & Verification' : 'Explorar Detalles y Créditos'}
                    </span>
                  </div>
                )}

                {/* Engine Badge on top-right */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="text-[10px] font-bold text-white bg-slate-900/90 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-700/80">
                    {project.engine}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sky-700">{categoryLabel}</span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isAaa
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isPersonalRnd
                            ? 'bg-sky-100 text-sky-900 border border-sky-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {isAaa && <ShieldCheck className="w-2.5 h-2.5" />}
                        {isPersonalRnd && <Monitor className="w-2.5 h-2.5" />}
                        {isEnterprise && <Building2 className="w-2.5 h-2.5" />}
                        <span>{badgeLabel}</span>
                      </span>
                    </div>
                    <span>{project.year}</span>
                  </div>

                  <h3
                    onClick={() => setActiveModalProject(project)}
                    className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer leading-snug"
                  >
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {description}
                  </p>

                  {project.mediaNote && (
                    <p className="text-[11px] text-slate-500 italic border-l-2 pl-2 border-slate-300 leading-normal">
                      {project.mediaNote[language] || project.mediaNote.en}
                    </p>
                  )}
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-medium px-1">
                        +{project.techStack.length - 4} {isEn ? 'more' : 'más'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(project)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
                    >
                      <span>{isEn ? 'View Showcase' : 'Ver Detalles'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {project.externalUrl && (
                      <a
                        href={project.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                      >
                        <span>{isEn ? 'External' : 'Enlace'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Callout to CV and About Me */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {isEn
              ? 'Need the comprehensive Curriculum Vitae or Personal Bio?'
              : '¿Deseas ver el Currículum Vitae completo o la historia personal?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {isEn
              ? "Explore Isaac's detailed experience timeline, education, 2-page print-ready PDF export, or read his story and passions in the About Me section."
              : 'Explora la trayectoria profesional detallada, educación, exportación a PDF de 2 páginas o conoce sus motivaciones y pasiones en la sección Sobre Mí.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSwitchToCv}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            {isEn ? 'Go to CV / Resume' : 'Ver Currículum Vitae'}
          </button>
          <button
            type="button"
            onClick={onSwitchToAbout}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            {isEn ? 'Read About Me' : 'Leer Sobre Mí'}
          </button>
        </div>
      </section>

      {/* Media Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded">
                  {activeModalProject.engine}
                </span>
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                    activeModalProject.workClassification === 'aaa-studio'
                      ? 'bg-amber-500 text-slate-950'
                      : activeModalProject.workClassification === 'personal-rnd'
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {activeModalProject.workClassification === 'aaa-studio' && <Trophy className="w-3 h-3" />}
                  {activeModalProject.workClassification === 'personal-rnd' && <Monitor className="w-3 h-3" />}
                  {activeModalProject.workClassification === 'enterprise-client' && <Building2 className="w-3 h-3" />}
                  <span>
                    {activeModalProject.workClassification === 'aaa-studio'
                      ? (isEn ? 'AAA Studio Work (NDA)' : 'Estudio AAA (NDA)')
                      : activeModalProject.workClassification === 'personal-rnd'
                      ? (isEn ? 'Personal R&D' : 'I+D Personal')
                      : (isEn ? 'Enterprise Client (NDA)' : 'Corporativo (NDA)')}
                  </span>
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                  {activeModalProject.title[language] || activeModalProject.title.en}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Media Attribution & NDA Disclosure Note */}
              {activeModalProject.mediaNote && (
                <div
                  className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                    activeModalProject.workClassification === 'aaa-studio'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : activeModalProject.workClassification === 'personal-rnd'
                      ? 'bg-sky-50 border-sky-200 text-sky-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      activeModalProject.workClassification === 'aaa-studio'
                        ? 'bg-amber-500 text-slate-950'
                        : activeModalProject.workClassification === 'personal-rnd'
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {activeModalProject.workClassification === 'aaa-studio' && <ShieldCheck className="w-4 h-4" />}
                    {activeModalProject.workClassification === 'personal-rnd' && <Monitor className="w-4 h-4" />}
                    {activeModalProject.workClassification === 'enterprise-client' && <Building2 className="w-4 h-4" />}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">
                      {activeModalProject.workClassification === 'aaa-studio'
                        ? (isEn ? 'Studio NDA & Official Verification Disclosure' : 'Aviso de Confidencialidad (NDA) de Estudio y Verificación')
                        : activeModalProject.workClassification === 'personal-rnd'
                        ? (isEn ? "Isaac Gómez's Personal Workstation Screen Recording" : 'Grabación de Pantalla de I+D Personal de Isaac Gómez')
                        : (isEn ? 'Enterprise Client Confidentiality Notice' : 'Aviso de Confidencialidad de Cliente Corporativo')}
                    </span>
                    <p className="text-slate-700">
                      {activeModalProject.mediaNote[language] || activeModalProject.mediaNote.en}
                    </p>
                  </div>
                </div>
              )}

              {/* Media Player / Viewer */}
              {activeModalProject.mediaType === 'video' && (activeModalProject.mediaSrc || activeModalProject.youtubeId) ? (
                <div className="space-y-2">
                  <div className="w-full bg-slate-950 rounded-xl overflow-hidden shadow-inner aspect-video relative group flex items-center justify-center">
                    {activeModalProject.youtubeId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${activeModalProject.youtubeId}?autoplay=1&rel=0`}
                        title={activeModalProject.title[language] || activeModalProject.title.en}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : activeModalProject.mediaSrc ? (
                      <video
                        key={activeModalProject.mediaSrc}
                        controls
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain"
                      >
                        <source src={activeModalProject.mediaSrc} type="video/mp4" />
                        {isEn
                          ? 'Your browser does not support HTML5 video streaming.'
                          : 'Tu navegador no soporta reproducción de video HTML5.'}
                      </video>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 px-1">
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-sky-500" />
                      <span>
                        {activeModalProject.youtubeId
                          ? isEn
                            ? 'Official broadcast presentation & gameplay stream (shipped title credits on MobyGames).'
                            : 'Transmisión oficial de jugabilidad y presentación broadcast (créditos lanzados en MobyGames).'
                          : isEn
                          ? "Isaac's personal screen recording (MP4). Toggle unmute in player controls for audio."
                          : 'Grabación de pantalla personal de Isaac (MP4). Activa el sonido en la barra de control.'}
                      </span>
                    </span>
                    {activeModalProject.youtubeId ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${activeModalProject.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1 underline underline-offset-2"
                      >
                        <span>{isEn ? 'Watch on YouTube' : 'Ver en YouTube'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : activeModalProject.mediaSrc ? (
                      <a
                        href={activeModalProject.mediaSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-1 underline underline-offset-2"
                      >
                        <span>{isEn ? 'Open video directly' : 'Abrir video directamente'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : activeModalProject.mediaType === 'image' ? (
                <div className="w-full bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center p-3 sm:p-5 space-y-4">
                  <img
                    src={`/portfolio_assets/concept-artwork-${selectedArtIndex + 1}.png`}
                    alt={`${activeModalProject.title[language] || activeModalProject.title.en} ${selectedArtIndex + 1}`}
                    className="max-h-[520px] w-auto max-w-full object-contain rounded-lg shadow-xl"
                  />
                  <div className="flex items-center gap-2 pt-2">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedArtIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                          selectedArtIndex === idx
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isEn ? `Artwork #${idx + 1}` : `Ilustración #${idx + 1}`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Description & Specs */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    {isEn ? 'Project Overview' : 'Descripción del Proyecto'}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mt-1">
                    {activeModalProject.description[language] || activeModalProject.description.en}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    {isEn ? 'Technical Highlights' : 'Puntos Técnicos Destacados'}
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                    {(activeModalProject.highlights[language] || activeModalProject.highlights.en).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    {isEn ? 'Tech Stack & Tools' : 'Stack Tecnológico y Herramientas'}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeModalProject.techStack.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External Action Links */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {activeModalProject.externalUrl && (
                      <a
                        href={activeModalProject.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <span>
                          {activeModalProject.externalLabel
                            ? activeModalProject.externalLabel[language] || activeModalProject.externalLabel.en
                            : isEn
                            ? 'Open Link'
                            : 'Abrir Enlace'}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href="https://github.com/Orb-lite/Portafolio.git"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Portfolio Repo' : 'Repositorio Portafolio'}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalProject(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    {isEn ? 'Close' : 'Cerrar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
