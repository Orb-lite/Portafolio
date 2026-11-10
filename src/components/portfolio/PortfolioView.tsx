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
  Heart,
  Zap,
  Award,
  Timer,
  RefreshCw,
  PlayCircle,
  Skull,
  Activity,
} from 'lucide-react';
import realGameScreenshot from '../../assets/images/regenerated_image_1794206153590.png';

export interface LocalizedString {
  en: string;
  es: string;
}

export interface LocalizedArray {
  en: string[];
  es: string[];
}

export type WorkClassification = 'aaa-studio' | 'personal-rnd' | 'enterprise-client' | 'proprietary-platform';

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
  galleryImages?: Array<{ src: string; caption?: LocalizedString }>;
  extraVideoSrc?: string;
  featured?: boolean;
}

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'tile-absorber-3d',
    title: {
      en: 'Conveyor Realms (Tile Absorber 3D)',
      es: 'Conveyor Realms (Tile Absorber 3D)',
    },
    subtitle: {
      en: 'Original Playable 3D Action-Puzzle Engine, Runners & Evolving Wildcard Architecture',
      es: 'Motor de Puzzle-Acción 3D Original Jugable, Runners y Arquitectura de Comodines',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Playable 3D Game & Engine',
      es: 'Videojuego 3D Jugable & Motor',
    },
    workClassification: 'personal-rnd',
    year: '2026',
    engine: 'Three.js / WebGL / TypeScript / React',
    mediaType: 'image',
    mediaSrc: realGameScreenshot,
    thumbnailSrc: realGameScreenshot,
    mediaNote: {
      en: 'Fully playable original 3D web game engineered by Isaac Gómez Estrada directly in browser with Three.js, orthogonal conveyor tracks, queue state machines, 3-tier tactical wildcards, and real-time Supabase cloud leaderboards.',
      es: 'Videojuego 3D original 100% jugable en navegador desarrollado por Isaac Gómez Estrada con Three.js, bandas transportadoras ortogonales, máquinas de estados de cola, comodines tácticos de 3 tiers y tablas de clasificación en la nube con Supabase.',
    },
    description: {
      en: 'A high-speed 3D spatial puzzle-action game designed, architected, and built from scratch. Features color-coded autonomous runners patrolling an isometric floating tile grid on elevated conveyor belts. Incorporates exposed-edge tile absorption algorithms, an evolving 3-tier wildcard system (1 per level) demanding tactical risk-reward calculations, a continuous streak XP scoring economy, an adventure pathway across 9 procedural WebGL biomes, and a 5-heart asynchronous life regeneration system.',
      es: 'Videojuego de puzzle-acción espacial en 3D de alta velocidad diseñado, arquitecturado e implementado desde cero. Incluye runners autónomos codificados por color que patrullan una cuadrícula isométrica suspendida sobre bandas transportadoras elevadas. Incorpora algoritmos de absorción de baldosas expuestas en perímetro, un sistema de comodines evolutivos de 3 tiers (1 por nivel) con equilibrio táctico de riesgo/beneficio, economía de puntuación y XP por rachas continuas, camino de aventura por 9 biomas WebGL procedurales y un sistema de vida y muerte de 5 corazones con regeneración asíncrona.',
    },
    highlights: {
      en: [
        'Autonomous 3D Runners & Orthogonal Conveyor Loop: Directional path routing with color queue state machine and collision detection',
        'Exposed-Edge Tile Absorption Algorithm: Evaluates real-time obstruction masks so only unblocked outer-tier tiles can be absorbed',
        '3-Tier Tactical Wildcard System: 9 balanced skills (Stasis Micro-discharge, Conveyor Surge, Magnetic Vortex, Ejection, Prismatic Runner, Polar Board Inversion) with strict 1-use-per-level limit',
        'Dynamic Streak XP & Star Ratings: Exponential combo multipliers, time-based 3-star ratings, and 9 procedural WebGL biomes (Cyber Grid, Banana Paradise, Golden Vault, Chess Kingdom, Sky Isles, etc.)',
        '5-Heart Life & Death Economy: 5-slot queue overflow penalty, 20-minute autonomous background regeneration clock, emergency rescue, and permadeath stakes',
        'Cloud Highscore & Session Caching: Supabase real-time leaderboard integration with cross-tab localStorage session persistence',
      ],
      es: [
        'Runners 3D Autónomos y Circuito Ortogonal: Ruteo direccional con máquina de estados de cola y trazado de colisiones perimetrales',
        'Algoritmo de Absorción Perimetral Expuesta: Evalúa máscaras de obstrucción en tiempo real para que solo las piezas sin bloqueo frontal sean absorbibles',
        'Sistema de Comodines Tácticos de 3 Tiers: 9 habilidades balanceadas (Micro-descarga Stasis, Sobrecarga de Banda, Vórtice Magnético, Eyección, Runner Prismático, Inversión de Polaridad) con límite estricto de 1 por nivel',
        'XP Dinámica por Rachas y Estrellas: Multiplicadores exponenciales de combo, evaluación de 1 a 3 estrellas por tiempo y 9 biomas procedurales en WebGL',
        'Economía de Vida y Muerte de 5 Corazones: Penalización por desbordamiento de cola, reloj de regeneración autónomo de 20 min en background y rescate de emergencia',
        'Récord Global en la Nube y Caché de Sesiones: Integración de leaderboards en Supabase con persistencia local multiventana',
      ],
    },
    techStack: [
      'Three.js',
      'WebGL',
      'TypeScript',
      'React 19',
      'Supabase Cloud',
      'Procedural Shaders',
      'Web Audio API',
      'Tailwind CSS',
    ],
    featured: true,
  },
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
      en: 'Sports Broadcast & Real-Time Scoreboard HUD System (scores.mp4)',
      es: 'Simulación de Transmisión Deportiva y Marcador HUD en Tiempo Real (scores.mp4)',
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
    mediaSrc: '/portfolio_assets/scores.mp4',
    youtubeId: '3Rkj6FlMcLU',
    thumbnailSrc: 'https://img.youtube.com/vi/3Rkj6FlMcLU/maxresdefault.jpg',
    mediaNote: {
      en: 'Screen recording (scores.mp4) & official broadcast: Dynasty Hub UI debug panels (ScreenKey, mcScreenManager, frametime graph) and sub-frame scoreboard updates engineered in ActionScript and high-performance C++ on Frostbite Engine architecture.',
      es: 'Grabación de pantalla (scores.mp4) y transmisión oficial: Paneles de depuración Dynasty Hub UI (ScreenKey, mcScreenManager, gráfica de frametime) y máquina de estados del marcador deportivo desarrollados en ActionScript y C++ sobre Frostbite Engine.',
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
    id: 'goblins-castle',
    title: {
      en: 'Goblins Castle - Medieval Dark Fantasy Action RPG',
      es: 'Goblins Castle - RPG de Acción y Fantasía Oscura Medieval',
    },
    subtitle: {
      en: '64-bit Development PCD3D_SM5 In-Engine Viewport Preview',
      es: 'Preview de Desarrollo en 64 bits (PCD3D_SM5) en Unreal Engine',
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
    mediaSrc: '/portfolio_assets/Goblins_Castle (64-bit Development PCD3D_SM5)  2022-10-26 17-21-27.mp4',
    mediaNote: {
      en: "Direct Unreal Engine 64-bit Development preview screen capture (Goblins_Castle 2022-10-26): Knight third-person locomotion, castle dungeon environment, sword combat combos, reactive AI enemies, dynamic torch lighting, and interactive quest HUD ('Compra una espada').",
      es: "Grabación directa de pantalla en Unreal Engine 64-bit Development preview (Goblins_Castle 2022-10-26): Locomoción en tercera persona con caballero, entorno de mazmorra y castillo medieval, combos de combate con espada, IA de enemigos reactiva, iluminación dinámica de antorchas y HUD de misiones ('Compra una espada').",
    },
    description: {
      en: 'Atmospheric third-person medieval action RPG prototype engineered in Unreal Engine (64-bit Development build). Features fluid knight character movement, sword collision tracing, responsive combat combos, dynamic lighting with torch flicker, quest objective HUD tracking, and dungeon modular architecture.',
      es: 'Prototipo de RPG de acción medieval en tercera persona desarrollado en Unreal Engine (build 64-bit Development). Cuenta con locomoción fluida de personaje caballero, trazado de colisiones para combate con espada, combos de ataque responsivos, iluminación dinámica con antorchas, seguimiento de misiones en HUD y arquitectura modular de mazmorra.',
    },
    highlights: {
      en: [
        'Custom third-person locomotion, sprint, dodge, and sword attack combo animation states',
        'DirectX Shader Model 5 dynamic point lights, volumetric dungeon shadows, and stone PBR materials',
        'Interactive player HUD with quest objective alerts and health/stamina monitoring',
        'Stable 60+ FPS performance in 64-bit Development in-editor viewport testing',
      ],
      es: [
        'Locomoción en tercera persona, carrera, esquive y máquina de estados para animaciones de combate con espada',
        'Luces dinámicas puntuales en DirectX SM5, sombras volumétricas de mazmorra y materiales PBR de piedra',
        'HUD interactivo del jugador con alertas de objetivos de misión y barras de salud/estamina',
        'Rendimiento sostenido a más de 60 FPS en pruebas de viewport 64-bit Development',
      ],
    },
    techStack: ['Unreal Engine', 'DirectX SM5', 'Combat Mechanics', 'Third-Person Locomotion', 'Level Design', 'Blueprints / C++'],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View in Drive Portfolio Folder',
      es: 'Ver en Carpeta Drive de Portafolio',
    },
    featured: true,
  },
  {
    id: 'gamejam-devbot',
    title: {
      en: 'DevBot Game Jam - Rapid Action Prototype Preview',
      es: 'DevBot Game Jam - Prototipo Rápido de Acción y Mecánicas',
    },
    subtitle: {
      en: 'NetMode Standalone 64-bit Windows Gameplay Loop & Physics',
      es: 'Ciclo de Jugabilidad y Físicas en NetMode Standalone (Windows 64 bits)',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Game Jam & Prototipado Rápido',
    },
    workClassification: 'personal-rnd',
    year: '2022',
    engine: 'Unreal Engine (Standalone NetMode)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/GameJam_DevBot Preview [NetMode_ Standalone]  (64-bit_Windows)  2022-10-13 18-32-24.mp4',
    mediaNote: {
      en: "Screen recording from Isaac's NetMode Standalone 64-bit Windows preview (GameJam_DevBot 2022-10-13): Rapid prototype mechanics engineered during the DEVBOT studio game jam, testing high-mobility locomotion, responsive physics, and level obstacle navigation.",
      es: "Grabación de pantalla desde el preview NetMode Standalone de 64 bits para Windows de Isaac (GameJam_DevBot 2022-10-13): Prototipo rápido de mecánicas desarrollado en el Game Jam del estudio DEVBOT, probando locomoción ágil, físicas reactivas y navegación de obstáculos.",
    },
    description: {
      en: 'Fast-paced game jam prototype engineered under rapid turnaround constraints at DEVBOT studio. Packaged as a standalone 64-bit Windows executable, testing character responsiveness, platform traversal physics, and spatial timing challenges.',
      es: 'Prototipo de acción ágil desarrollado bajo estrictas restricciones de tiempo en el Game Jam del estudio DEVBOT. Empaquetado como ejecutable Standalone para Windows de 64 bits, validando respuesta del personaje, físicas de movimiento en plataformas y desafíos espaciales de precisión.',
    },
    highlights: {
      en: [
        'Packaged and benchmarked as NetMode Standalone 64-bit Windows release',
        'High-velocity character movement physics, variable jumping, and obstacle collision',
        'Rapid level grayboxing, lighting pass, and responsive game loop completed under game jam deadline',
        'Co-development collaboration and agile prototyping inside DEVBOT pipeline',
      ],
      es: [
        'Empaquetado y validado en build ejecutable Standalone NetMode de 64 bits para Windows',
        'Físicas de movimiento de alta velocidad, salto variable y colisión precisa con obstáculos',
        'Grayboxing rápido de nivel, pase de iluminación y ciclo de juego interactivo completado en plazo de jam',
        'Colaboración y prototipado ágil dentro de la cultura de co-desarrollo de DEVBOT',
      ],
    },
    techStack: ['Unreal Engine', 'DEVBOT Game Jam', 'Standalone NetMode', 'Character Physics', 'Rapid Prototyping'],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View in Drive Portfolio Folder',
      es: 'Ver en Carpeta Drive de Portafolio',
    },
    featured: true,
  },
  {
    id: 'vdb-volumetric-sim',
    title: {
      en: 'OpenVDB Volumetric Smoke & Cloud Simulation (VDB.mp4)',
      es: 'Simulación Volumétrica de Humo y Nubes con OpenVDB (VDB.mp4)',
    },
    subtitle: {
      en: 'GPU-Accelerated Heterogeneous Volume Rendering & Niagara VFX',
      es: 'Renderizado de Volúmenes Heterogéneos Acelerado por GPU y Niagara VFX',
    },
    category: 'simulation',
    categoryLabel: {
      en: '3D Simulation & VFX',
      es: 'Simulación 3D & Efectos Visuales',
    },
    workClassification: 'personal-rnd',
    year: '2024',
    engine: 'Unreal Engine 5 (Niagara & OpenVDB)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/VDB (1).mp4',
    mediaNote: {
      en: "Isaac's personal technical R&D in Unreal Engine 5: Direct screen recording testing OpenVDB sparse voxel volume rendering, dynamic velocity advection, and real-time volumetric raymarching shaders.",
      es: 'I+D técnico personal de Isaac en Unreal Engine 5: Grabación directa de pantalla probando renderizado de volúmenes dispersos en OpenVDB, advección de velocidad y shaders de raymarching volumétrico en tiempo real.',
    },
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View in Drive Portfolio Folder',
      es: 'Ver en Carpeta Drive de Portafolio',
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
        'Niagara particle emitter integration with volumetric collision grids',
      ],
      es: [
        'Raymarching acelerado por GPU de mallas volumétricas 3D sin artefactos de horneado',
        'Dispersión física precisa mediante funciones de fase y penetración de sombras',
        'Ajustes interactivos de densidad, absorción y velocidad en tiempo real desde el viewport',
        'Integración de emisores de partículas Niagara con cuadrículas de colisión volumétrica',
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
      en: 'RWGen - Procedural World & Environment Generation (landscape.mp4)',
      es: 'RWGen - Generación Procedimental de Mundos y Terrenos (landscape.mp4)',
    },
    subtitle: {
      en: 'Algorithmic Terrain Biomes, Foliage Streaming & Environmental Flythrough',
      es: 'Biomas Algorítmicos de Terreno, Streaming de Vegetación y Recorrido de Paisaje',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Entornos Virtuales Interactivos',
    },
    workClassification: 'personal-rnd',
    year: '2022',
    engine: 'Unreal Engine Procedural Systems',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/landscape.mp4',
    mediaNote: {
      en: "Isaac's personal screen recording (landscape.mp4): Testing algorithmic terrain generation, procedural heightmaps, atmospheric lighting, and high-framerate landscape navigation in Unreal Engine.",
      es: 'Grabación de pantalla personal de Isaac (landscape.mp4): Pruebas de generación algorítmica de terrenos, mapas de altura procedimentales, iluminación atmosférica y navegación de paisajes en Unreal Engine.',
    },
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View in Drive Portfolio Folder',
      es: 'Ver en Carpeta Drive de Portafolio',
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
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/digital-twin-campus-standalone.mp4',
    thumbnailSrc: '/portfolio_assets/digital-twin-campus-thumb.jpg',
    mediaNote: {
      en: "Enterprise digital twin screen capture from Isaac's 64-bit D3D Shader Model 6 Standalone build at Flex: Real-time Guadalajara North campus navigation, building B29 monitoring, machine line telemetry, failure list triage, and live power consumption dashboards.",
      es: 'Grabación de pantalla del gemelo digital corporativo desde el build Standalone de 64 bits (D3D Shader Model 6) de Isaac en Flex: Navegación del campus Guadalajara Norte, monitoreo del edificio B29, telemetría de líneas de producción, lista de fallas y dashboards de consumo energético en tiempo real.',
    },
    description: {
      en: 'High-precision real-time 3D Digital Twin of industrial manufacturing facilities engineered with Unreal Engine 5, D3D Shader Model 6, and Arch FlexSim. Features interactive campus navigation (Guadalajara North campus), building-level telemetry (B29), real-time machine utilization dashboards, line failure alerts (AOI Zenith, Vitrox, Heller Reflow Oven), throughput tracking, yield metrics, and power consumption monitoring for Fortune 500 enterprise operations.',
      es: 'Gemelo Digital 3D en tiempo real de alta precisión para instalaciones de manufactura industrial desarrollado con Unreal Engine 5, D3D Shader Model 6 y Arch FlexSim. Incluye navegación interactiva de campus (Campus Guadalajara Norte), telemetría a nivel de edificio (B29), tableros de utilización de maquinaria en tiempo real, alertas y triage de fallas (AOI Zenith, Vitrox, Horno de Reflujo Heller), seguimiento de rendimiento de producción (Yield, Throughput) y monitoreo de consumo eléctrico para operaciones corporativas Fortune 500.',
    },
    highlights: {
      en: [
        'Standalone 64-bit D3D Shader Model 6 executable build running interactive campus flythrough',
        'Live IoT telematics integration: Temperature, Humidity, Energy, Water & Nitrogen consumption tracking',
        'Machine-level inspection (SIPLACE, AOI Zenith, Vitrox, Heller Reflow Oven) with live yield & failure triage',
        'Real-time power consumption gauge dashboard and workstation multi-monitor telemetry center setup',
        'Automated bottleneck detection & predictive simulation of automated lines prior to physical deployment',
      ],
      es: [
        'Build ejecutable Standalone de 64 bits en D3D Shader Model 6 con navegación interactiva por todo el campus',
        'Integración telemática de sensores IoT en vivo: temperatura, humedad, energía, agua y nitrógeno',
        'Inspección detallada de maquinaria (SIPLACE, AOI Zenith, Vitrox, Horno Heller) con yield y reporte de fallas en vivo',
        'Dashboard de consumo de energía con indicadores en tiempo real y estación de trabajo multi-monitor de telemetría',
        'Detección predictiva de cuellos de botella y simulación de líneas automatizadas antes de su despliegue físico',
      ],
    },
    techStack: [
      'Unreal Engine 5',
      'Arch FlexSim',
      'D3D Shader Model 6',
      'Industrial IoT',
      'Digital Twins',
      'Real-Time Telemetry',
      'C++ / Blueprints',
      'VR Simulation',
    ],
    galleryImages: [
      {
        src: '/portfolio_assets/digital-twin-workstation-setup.jpg',
        caption: {
          en: 'Engineering workstation setup: Real-time building power consumption meters, thermal heatmap, and live 3D production line viewport in Unreal Engine.',
          es: 'Estación de trabajo de ingeniería: Medidores de consumo eléctrico en tiempo real, mapa de calor térmico y viewport 3D de la línea de producción en Unreal Engine.',
        },
      },
      {
        src: '/portfolio_assets/digital-twin-campus-thumb.jpg',
        caption: {
          en: 'Guadalajara North Campus 3D overview with building markers (B-1, B-28, B-29) and interactive view controls.',
          es: 'Vista general 3D del Campus Guadalajara Norte con marcadores de edificios (B-1, B-28, B-29) y controles de navegación interactiva.',
        },
      },
    ],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Portfolio Drive Folder',
      es: 'Ver Carpeta de Portafolio en Drive',
    },
    featured: true,
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
    workClassification: 'proprietary-platform',
    year: '2026 - Present',
    engine: 'React / TypeScript / Leaflet / Supabase',
    mediaType: 'image',
    mediaSrc: '/portfolio_assets/orblite-rastreo-rutas-2.png',
    thumbnailSrc: '/portfolio_assets/orblite-rastreo-dashboard-1.png',
    mediaNote: {
      en: "Isaac's proprietary production platform (orb-lite.com): Real-time satellite GPS tracking across Mexico & US, 30 active units, 15 Wialon resources, Swarm APIs integration, and Smart Route Planner (Planificador Inteligente) with street-level route optimization.",
      es: 'Plataforma propietaria de Isaac (orb-lite.com - sin restricciones de confidencialidad): Sistema de rastreo satelital GPS en tiempo real para México y EE. UU., 30 unidades satelitales activas, 15 recursos Wialon, integración Swarm APIs y Planificador Inteligente de rutas optimizadas por calles.',
    },
    description: {
      en: "Proprietary commercial SaaS telematics platform architected and developed by Isaac Gómez Estrada for real-time fleet GPS tracking, telemetry streaming, and automated street routing. Features live multi-point Leaflet GIS maps, the Smart Route Planner (Planificador Inteligente) with multi-stop street routing optimization, geofences, unit telemetry inspection, and Wialon Lite protocol synchronization.",
      es: 'Plataforma SaaS comercial de telemática desarrollada y operada como proyecto propietario por Isaac Gómez Estrada para rastreo satelital GPS de flotas en tiempo real, transmisión de telemetría y ruteo automatizado. Incluye mapas interactivos Leaflet GIS, el Planificador Inteligente con optimización de rutas por calles punto a punto, geocercas, telemetría de unidades en vivo y sincronización con protocolos Wialon Lite.',
    },
    highlights: {
      en: [
        'Proprietary full-stack commercial platform (orb-lite.com) — zero client NDA constraints',
        'Interactive real-time GPS tracking dashboard with Leaflet GIS mapping covering Mexico and USA',
        'Smart Route Planner (Planificador Inteligente) with address geocoding and return-to-origin optimization',
        'Integration with Wialon Lite protocols and custom Swarm APIs for high-frequency telemetry data',
        'Multi-client route resource management (15 client resources, 30 active satellite units)',
        'Full-stack architecture with TypeScript, React, Tailwind CSS, and Supabase database backend',
      ],
      es: [
        'Plataforma comercial y plataforma propia (orb-lite.com) — 100% de propiedad directa, sin restricciones de NDA',
        'Dashboard interactivo de rastreo satelital GPS en tiempo real con mapeo Leaflet GIS para México y EE. UU.',
        'Planificador Inteligente con geocodificación de direcciones y optimización de rutas con retorno a origen',
        'Integración con protocolos Wialon Lite y Swarm APIs propietarias para telemetría de alta frecuencia',
        'Gestión de recursos de rutas por cliente (15 recursos en Wialon, 30 unidades satelitales activas)',
        'Arquitectura full-stack con TypeScript, React, Tailwind CSS y base de datos Supabase',
      ],
    },
    techStack: [
      'TypeScript',
      'React',
      'Leaflet GIS',
      'Swarm APIs',
      'Wialon Protocols',
      'Tailwind CSS',
      'Supabase SQL',
      'Fleet Telematics',
    ],
    galleryImages: [
      {
        src: '/portfolio_assets/orblite-rastreo-rutas-2.png',
        caption: {
          en: 'Production Interface: Planificador Inteligente (Smart Route Planner) with street-level optimization and Leaflet GIS mapping.',
          es: 'Interfaz en Producción: Planificador Inteligente con optimización de rutas por calles y mapa Leaflet GIS.',
        },
      },
      {
        src: '/portfolio_assets/orblite-rastreo-dashboard-1.png',
        caption: {
          en: 'Real-time Satellite Tracking Dashboard: 30 units across Mexico & US, Wialon Lite synchronization, and Swarm APIs.',
          es: 'Panel de Rastreo Satelital en Tiempo Real: 30 unidades en México y EE. UU., sincronización Wialon Lite y Swarm APIs.',
        },
      },
    ],
    externalUrl: 'https://orb-lite.com',
    externalLabel: {
      en: 'Visit orb-lite.com',
      es: 'Visitar orb-lite.com',
    },
    featured: true,
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
  onSwitchToGame?: () => void;
}

export function PortfolioView({ language = 'es', onSwitchToCv, onSwitchToAbout, onSwitchToGame }: PortfolioViewProps) {
  const isEn = language === 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [selectedArtIndex, setSelectedArtIndex] = useState<number>(0);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});
  const [modalVideoError, setModalVideoError] = useState<boolean>(false);

  const openProjectModal = (project: ProjectItem) => {
    setModalVideoError(false);
    setActiveModalProject(project);
  };

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

            {onSwitchToGame && (
              <button
                type="button"
                onClick={onSwitchToGame}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold transition-all hover:scale-[1.02] shadow-sm shadow-cyan-950/40"
              >
                <Gamepad2 className="w-4 h-4 text-cyan-300" />
                <span>{isEn ? '🎮 Play Tile Absorber' : '🎮 Jugar Tile Absorber'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
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

      {/* DEDICATED SHOWCASE SECTION: Tile Absorber 3D (Cyber Frontier) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-cyan-500/30 p-6 sm:p-8 md:p-10 shadow-2xl">
        {/* Glowing atmospheric backdrop */}
        <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-16 -mr-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>
                  {isEn
                    ? 'Featured Project • Original Playable 3D Game & Engine'
                    : 'Proyecto Destacado • Videojuego Jugable Original & Motor 3D'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-white/80 font-mono text-[10px]">WebGL / Three.js</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
                <span>Conveyor Realms (Tile Absorber 3D)</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono">
                  {isEn ? '100% Playable in Browser' : '100% Jugable en Navegador'}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isEn ? (
                  <>
                    An original 3D spatial puzzle-action game designed, architected, and coded from scratch by Isaac Gómez Estrada.
                    Combines high-framerate Three.js WebGL graphics, orthogonal conveyor loops, queue state machines, an evolving
                    3-tier tactical wildcard economy, and real-time cloud leaderboards with Supabase.
                  </>
                ) : (
                  <>
                    Videojuego original de puzzle-acción espacial en 3D diseñado, arquitecturado y programado desde cero por Isaac Gómez Estrada.
                    Combina gráficos WebGL en Three.js a 60 FPS, circuitos de cintas transportadoras ortogonales, máquinas de estados de cola,
                    economía de comodines tácticos en 3 tiers y tablas de clasificación en tiempo real con Supabase.
                  </>
                )}
              </p>
            </div>

            {/* Quick Play CTA */}
            {onSwitchToGame && (
              <div className="shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onSwitchToGame}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-950/60 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>{isEn ? 'Play Tile Absorber Live' : '▶ Jugar Tile Absorber Ahora'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Media Showcase & Quick Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Thumbnail Preview with Interactive Overlay */}
            <div className="lg:col-span-7 space-y-4">
              <div
                onClick={onSwitchToGame}
                className="group relative aspect-video rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-slate-950 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/20"
              >
                <img
                  src={realGameScreenshot}
                  alt={isEn ? "Conveyor Realms 3D Real Gameplay Screenshot" : "Captura Real del Juego Conveyor Realms en Acción"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                />

                {/* Cybernetic Grid Overlay & Play Prompt */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-5 pointer-events-none">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold bg-slate-900/90 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <span>60 FPS WebGL Engine</span>
                    </span>
                    <span className="text-[11px] font-bold bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full border border-indigo-400/30 backdrop-blur-md">
                      9 Biomes & Worlds
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-black text-lg sm:text-xl drop-shadow-md">
                        Tile Absorber 3D
                      </p>
                      <p className="text-cyan-300 text-xs font-mono drop-shadow-sm">
                        {isEn ? 'Click anywhere to launch playable build' : 'Haz clic para iniciar la partida en vivo'}
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-slate-950" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-strip metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Engine' : 'Motor'}</p>
                  <p className="text-white font-bold font-mono mt-0.5">Three.js / WebGL</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Wildcards' : 'Comodines'}</p>
                  <p className="text-amber-300 font-bold font-mono mt-0.5">9 (3 Tiers)</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Health Pool' : 'Vidas'}</p>
                  <p className="text-rose-400 font-bold font-mono mt-0.5">5 Corazones + Regen</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Cloud Data' : 'Persistencia'}</p>
                  <p className="text-cyan-300 font-bold font-mono mt-0.5">Supabase SQL</p>
                </div>
              </div>
            </div>

            {/* Quick Project Narrative & Actions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>{isEn ? 'Architecture & Technical Innovation' : 'Arquitectura e Innovación Técnica'}</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? (
                    <>
                      Built without heavy monolithic frameworks to achieve zero-latency loading and instant input response.
                      The custom render loop orchestrates geometric instancing, procedural shaders for tile surfaces, dynamic
                      directional light bounce, and a reactive state machine synchronizing 3D runner locomotion with React 19 UI overlays.
                    </>
                  ) : (
                    <>
                      Construido sin frameworks monolíticos pesados para lograr carga inmediata y respuesta de entrada sin latencia.
                      El bucle de renderizado personalizado coordina instanciación geométrica, shaders procedurales para las baldosas,
                      iluminación direccional reactiva y una máquina de estados que sincroniza la locomoción 3D con la interfaz de React 19.
                    </>
                  )}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Three.js', 'WebGL', 'TypeScript', 'React 19', 'Web Audio API', 'Supabase Realtime', 'LocalStorage Cache', 'Tailwind CSS'].map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-slate-800 text-cyan-200 px-2 py-0.5 rounded-md border border-slate-700/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {onSwitchToGame && (
                  <button
                    type="button"
                    onClick={onSwitchToGame}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-102"
                  >
                    <Gamepad2 className="w-4 h-4 text-slate-950" />
                    <span>{isEn ? 'Launch Playable Game' : 'Lanzar Partida Jugable'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const tileProject = PORTFOLIO_PROJECTS.find((p) => p.id === 'tile-absorber-3d');
                    if (tileProject) openProjectModal(tileProject);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all hover:scale-102"
                >
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>{isEn ? 'View Technical Specs Modal' : 'Ver Ficha Técnica'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* THREE TECHNICAL PILLARS: Particularidades, Mecánicas, Experiencia y Vida/Muerte */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>
                  {isEn
                    ? 'Deep-Dive: Core Mechanics, Experience & Life/Death Systems'
                    : 'Análisis a Fondo: Mecánicas Creadas, Sistema de Experiencia y Vida/Muerte'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isEn
                  ? 'Key gameplay innovations engineered to balance intuitive arcade fun with high-stakes spatial strategy.'
                  : 'Innovaciones de diseño de juego desarrolladas para equilibrar diversión arcade intuitiva con estrategia espacial de alto riesgo.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Mecánicas Creadas */}
              <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-cyan-400/60 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5" />
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isEn ? '1. Core Mechanics & 3D Conveyor Engine' : '1. Mecánicas Creadas & Motor de Cintas'}
                  </h4>

                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-cyan-300 font-semibold">{isEn ? 'Autonomous 3D Runners:' : 'Runners 3D Autónomos:'}</strong>{' '}
                        {isEn
                          ? 'Entities circulate around elevated perimeter conveyor tracks at constant velocity with animated stride cycles and emissive glow.'
                          : 'Entidades que recorren pistas perimetrales elevadas a velocidad sincrónica con ciclos de zancada y resplandor emisivo.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-cyan-300 font-semibold">{isEn ? 'Perimeter Exposure Logic:' : 'Algoritmo de Exposición Perimetral:'}</strong>{' '}
                        {isEn
                          ? 'The findExposedTile algorithm enforces that only unblocked outer-edge tiles can be absorbed, requiring sequential puzzle peeling.'
                          : 'El algoritmo findExposedTile garantiza que solo las baldosas libres de bloqueo frontal sean absorbibles, obligando a resolver de afuera hacia adentro.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-cyan-300 font-semibold">{isEn ? '3-Tier Tactical Wildcards:' : 'Comodines Tácticos en 3 Tiers:'}</strong>{' '}
                        {isEn
                          ? '1 wildcard use per level out of 3 evolving choices. Designed with deliberate trade-offs (e.g. Stasis delays queue, Magnetic Vortex accelerates conveyors) so the player must choose strategically rather than getting an easy pass.'
                          : '1 comodín por nivel a elegir entre 3 opciones evolutivas. Diseñados con ventajas y riesgos calculados (ej. Estasis frena la cola, Vórtice acelera la pista) para exigir lectura táctica y no regalar la partida.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-cyan-300 font-semibold">{isEn ? 'Shield Encapsulations:' : 'Encapsulaciones & Cristales:'}</strong>{' '}
                        {isEn
                          ? 'Crystal-locked tiles that cannot be extracted until surrounding perimeter tiles are completely absorbed.'
                          : 'Baldosas blindadas en cápsulas translúcidas que no se liberan hasta despejar las baldosas circundantes.'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-cyan-300/80 font-mono">
                  {isEn ? 'Three.js Matrix Transformations • Real-Time Raycasting' : 'Transformaciones Matriciales • Raycasting en Tiempo Real'}
                </div>
              </div>

              {/* Pillar 2: Sistema de Experiencia */}
              <div className="rounded-2xl bg-slate-900/90 border border-amber-500/30 p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-amber-400/60 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isEn ? '2. Experience (XP) & Progression Economy' : '2. Sistema de Experiencia (XP) & Progresión'}
                  </h4>

                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? 'Streak Bonus Multipliers:' : 'Multiplicadores de Racha (Streak):'}</strong>{' '}
                        {isEn
                          ? 'Consecutive matches without misclicks grant dynamic multipliers up to 5x XP, heavily rewarding fast and precise spatial recognition.'
                          : 'Absorciones consecutivas sin saturar la cola acumulan multiplicadores de hasta 5x XP, premiando la agilidad y el reconocimiento espacial.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? '9 Procedural Biomes Pathway:' : 'Pathway con 9 Biomas Procedurales:'}</strong>{' '}
                        {isEn
                          ? 'Adventure roadmap traversing 9 handcrafted themes (Cyber Grid, Banana Paradise, Golden Vault, Coral Cove, Chess Kingdom, Sky Isles, etc.) with procedural texture shaders.'
                          : 'Mapa de aventura a través de 9 mundos (Cyber Grid, Banana Paradise, Golden Vault, Coral Cove, Chess Kingdom, Sky Isles, etc.) con texturas procedurales.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? '3-Star Mastery Rating:' : 'Evaluación por Estrellas (1-3):'}</strong>{' '}
                        {isEn
                          ? 'Evaluates player performance based on elapsed level time, minimum moves, and total absorbed tiles.'
                          : 'Evalúa el desempeño del jugador según velocidad de resolución, economía de movimientos y total de baldosas recolectadas.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? 'Automatic Level-Pass Save (Zero Save Buttons):' : 'Autoguardado en Cada Nivel (Cero Botones):'}</strong>{' '}
                        {isEn
                          ? 'Progression is automatically saved in real time every time you beat a level. No manual save button exists or is needed; close or reload the browser at any moment and your unlocked frontier level is safe.'
                          : 'El progreso se guarda de forma 100% automática en segundo plano cada vez que pasas de nivel. No existe ni se necesita ningún botón de guardar; puedes cerrar o recargar el navegador y tu nivel alcanzado estará intacto.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? 'Persistent Cache vs Cloud Database:' : 'Caché de Usuario vs Base de Datos:'}</strong>{' '}
                        {isEn
                          ? 'Local browser cache retains your gamertag profile, hearts, and frontier level so you never lose progress unless you manually wipe cache. Meanwhile, highscores and wave records sync directly to the cloud Supabase database for global leaderboards.'
                          : 'La caché local retiene de forma persistente tu perfil de usuario (gamertag), corazones y nivel alcanzado sin perderse mientras no borres la caché. A su vez, los puntajes máximos se guardan en la base de datos de Supabase para los récords globales.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? 'Cloud Highscore Sync:' : 'Highscore en Nube & Pathway Widget:'}</strong>{' '}
                        {isEn
                          ? 'Real-time sync of personal best and global leaderboard via Supabase with offline session caching.'
                          : 'Sincronización en la nube del récord personal y tabla global mediante Supabase con persistencia en caché offline.'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-amber-300/80 font-mono">
                  {isEn ? 'Dynamic Scoring Algorithm • Supabase SQL Sync' : 'Algoritmo de Puntuación • Sincronización Supabase'}
                </div>
              </div>

              {/* Pillar 3: Sistema de Vida y Muerte */}
              <div className="rounded-2xl bg-slate-900/90 border border-rose-500/30 p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-rose-400/60 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isEn ? '3. Life & Death System (Health & Stakes)' : '3. Sistema de Vida y Muerte (Health & Game Over)'}
                  </h4>

                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-rose-300 font-semibold">{isEn ? '5-Heart Health Pool:' : 'Reserva de 5 Corazones:'}</strong>{' '}
                        {isEn
                          ? 'Visualized in real-time on the top HUD. Provides high-tension stakes where careless runner launches lead to damage.'
                          : 'Visible en el HUD superior en tiempo real. Otorga tensión y peso táctico a cada despliegue de runner.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-rose-300 font-semibold">{isEn ? 'Queue Saturation Damage:' : 'Daño por Saturación de Cola:'}</strong>{' '}
                        {isEn
                          ? 'The bottom buffer has exactly 5 slots. If a runner fails to match any exposed tile and the queue is full, a critical collision occurs and 1 life is lost.'
                          : 'La cola inferior tiene 5 casillas fijas. Si un runner no encuentra coincidencia y la cola ya está llena, colisiona críticamente y se pierde 1 vida.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-rose-300 font-semibold">{isEn ? '20-Min Background Regeneration:' : 'Regeneración Asíncrona (20 min):'}</strong>{' '}
                        {isEn
                          ? 'Real-time clock restores 1 heart every 20 minutes by comparing timestamp differentials in localStorage even when the browser is closed.'
                          : 'Reloj en tiempo real que regenera 1 corazón cada 20 minutos comparando timestamps en localStorage incluso con el navegador cerrado.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-rose-300 font-semibold">{isEn ? 'Emergency Rescue & Permadeath:' : 'Rescate de Emergencia & Game Over:'}</strong>{' '}
                        {isEn
                          ? 'Running out of lives blocks level attempts until hearts regenerate, with an interactive second-chance rescue mechanic to save critical streaks.'
                          : 'Agotar las vidas bloquea el juego hasta regenerar corazones, con opción de rescate interactivo de segunda oportunidad para salvar partidas críticas.'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-rose-300/80 font-mono">
                  {isEn ? 'Asynchronous Life Timer • Saturation Fail-Safe' : 'Temporizador Asíncrono • Control de Saturación'}
                </div>
              </div>
            </div>
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
          const isProprietary = project.workClassification === 'proprietary-platform';

          const badgeLabel = isAaa
            ? (isEn ? 'AAA Studio (NDA)' : 'Estudio AAA (NDA)')
            : isPersonalRnd
            ? (isEn ? 'Personal R&D' : 'I+D Personal')
            : isProprietary
            ? (isEn ? 'Proprietary Platform' : 'Plataforma Propia')
            : (isEn ? 'Enterprise (NDA)' : 'Corporativo (NDA)');

          const mediaBadgeText = project.youtubeId
            ? (isEn ? 'Official Gameplay Broadcast' : 'Transmisión Oficial AAA')
            : isProprietary
            ? (isEn ? 'Live Production SaaS' : 'Producción en Vivo (SaaS)')
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
                    onClick={() => openProjectModal(project)}
                  >
                    {project.mediaSrc && !videoErrors[project.id] ? (
                      <video
                        src={project.mediaSrc}
                        autoPlay
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        onError={() => setVideoErrors((prev) => ({ ...prev, [project.id]: true }))}
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
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-2">
                          <Film className="w-5 h-5" />
                        </div>
                        <span className="text-white text-xs font-bold line-clamp-1">{title}</span>
                        <span className="text-sky-300 text-[10px] font-mono mt-0.5 line-clamp-1">
                          {project.mediaSrc ? project.mediaSrc.split('/').pop() : project.engine}
                        </span>
                      </div>
                    )}

                    {/* Classification overlay pill */}
                    <div
                      className={`absolute top-2.5 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow ${
                        isAaa
                          ? 'bg-amber-500 text-slate-950'
                          : isPersonalRnd
                          ? 'bg-sky-500 text-slate-950'
                          : isProprietary
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {isAaa && <Trophy className="w-3 h-3" />}
                      {isPersonalRnd && <Monitor className="w-3 h-3" />}
                      {isProprietary && <Globe className="w-3 h-3" />}
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
                    className="w-full h-full relative cursor-pointer group-hover:scale-105 transition-transform duration-500 bg-slate-950 flex items-center justify-center overflow-hidden"
                    onClick={() => openProjectModal(project)}
                  >
                    <img
                      src={project.mediaSrc}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-2.5 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow ${
                        isEnterprise
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-pink-500 text-slate-950'
                      }`}
                    >
                      {isEnterprise ? <Globe className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                      <span>{isEnterprise ? (isEn ? 'Live Platform UI' : 'Interfaz en Vivo') : (isEn ? 'Visual Art' : 'Arte Visual')}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 pointer-events-none">
                      <ExternalLink className="w-3 h-3 text-sky-400" />
                      <span>{isEn ? 'View Platform Showcase' : 'Ver Interfaz & Detalles'}</span>
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
                    ) : activeModalProject.mediaSrc && !modalVideoError ? (
                      <video
                        key={activeModalProject.mediaSrc}
                        controls
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        onError={() => setModalVideoError(true)}
                        className="w-full h-full object-contain"
                      >
                        <source src={activeModalProject.mediaSrc} type="video/mp4" />
                        {isEn
                          ? 'Your browser does not support HTML5 video streaming.'
                          : 'Tu navegador no soporta reproducción de video HTML5.'}
                      </video>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-lg">
                          <Film className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base">
                            {activeModalProject.title[language] || activeModalProject.title.en}
                          </h4>
                          <p className="text-sky-300 text-xs font-mono mt-1">
                            {activeModalProject.mediaSrc?.split('/').pop()}
                          </p>
                        </div>
                        <p className="text-slate-300 text-xs max-w-md">
                          {isEn
                            ? 'Video clip indexed in Isaac Gómez Estrada portfolio archive. View direct media recordings, project files, and uncompressed footage in Google Drive.'
                            : 'Clip de video catalogado en el portafolio de Isaac Gómez Estrada. Puedes ver el archivo multimedia, grabaciones originales y proyectos completos en Google Drive.'}
                        </p>
                        <a
                          href={activeModalProject.externalUrl || 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
                        >
                          <FolderOpen className="w-4 h-4" />
                          <span>{isEn ? 'Open Project in Google Drive' : 'Abrir Proyecto en Google Drive'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
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
                  {activeModalProject.id === 'concept-artworks' ? (
                    <>
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
                    </>
                  ) : (
                    <div className="w-full flex flex-col items-center space-y-2">
                      <div className="w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                        <img
                          src={activeModalProject.mediaSrc || activeModalProject.thumbnailSrc}
                          alt={activeModalProject.title[language] || activeModalProject.title.en}
                          className="w-full h-auto max-h-[560px] object-contain mx-auto"
                        />
                      </div>
                      <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <Globe className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Production Telematics UI Interface' : 'Interfaz de Producción en Vivo'}</span>
                        </span>
                        {activeModalProject.externalUrl && (
                          <a
                            href={activeModalProject.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1 underline underline-offset-2"
                          >
                            <span>{isEn ? 'Launch Platform Live' : 'Abrir Plataforma en Vivo'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Gallery Images Strip (for projects that have photo attachments like Digital Twin workstation setup) */}
              {activeModalProject.galleryImages && activeModalProject.galleryImages.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-sky-500" />
                    <span>{isEn ? 'Production Workstation & Setup Visuals' : 'Capturas y Estación de Trabajo en Vivo'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeModalProject.galleryImages.map((img, i) => (
                      <div key={i} className="group/gal relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm flex flex-col">
                        <img
                          src={img.src}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-56 object-cover group-hover/gal:scale-105 transition-transform duration-300"
                        />
                        {img.caption && (
                          <div className="p-3 bg-slate-900 text-slate-300 text-xs leading-relaxed border-t border-slate-800">
                            {img.caption[language] || img.caption.en}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeModalProject.id === 'tile-absorber-3d' && onSwitchToGame && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalProject(null);
                          onSwitchToGame();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105"
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Play Game Now' : '🎮 Jugar Ahora'}</span>
                      </button>
                    )}
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
