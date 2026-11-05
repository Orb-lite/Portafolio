import React, { useState, useRef, useEffect } from 'react';
import {
  Gamepad2,
  FolderOpen,
  Github,
  Globe,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
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
  Youtube,
} from 'lucide-react';
import { YouTubeUploaderModal } from '../modals/YouTubeUploaderModal';

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
    thumbnailSrc: '/portfolio_assets/watercolor-thumb.jpg',
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
    mediaSrc: '/portfolio_assets/scores-cfb25-debug.mp4',
    thumbnailSrc: '/portfolio_assets/scores-cfb25-thumb.jpg',
    mediaNote: {
      en: 'Direct in-engine screen capture: Dynasty Hub UI debug panels (ScreenKey, mcScreenManager, frametime graph) and sub-frame scoreboard updates engineered in ActionScript and high-performance C++ on Frostbite Engine architecture.',
      es: 'Grabación de pantalla directa in-engine: Paneles de depuración Dynasty Hub UI (ScreenKey, mcScreenManager, gráfica de frametime) y máquina de estados del marcador deportivo desarrollados en ActionScript y C++ sobre Frostbite Engine.',
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
    mediaSrc: '/portfolio_assets/goblins-castle-gameplay.mp4',
    thumbnailSrc: '/portfolio_assets/goblins-castle-thumb.jpg',
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
    mediaSrc: '/portfolio_assets/devbot-gamejam-combat.mp4',
    thumbnailSrc: '/portfolio_assets/devbot-gamejam-thumb.jpg',
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
    id: 'vdb-realestate-digitaltwin',
    title: {
      en: 'VDB - Interactive 3D Real Estate & Urban Master Plan',
      es: 'VDB - Master Plan y Torre Residencial 3D Interactiva',
    },
    subtitle: {
      en: 'Real-Time Day/Night Sun Simulation, Urban Amenities & Master Plan Navigation',
      es: 'Simulación de Ciclo Día/Noche, Telemetría Urbana y Navegación de Master Plan',
    },
    category: 'simulation',
    categoryLabel: {
      en: '3D Simulation & Digital Twins',
      es: 'Simulación 3D & Gemelos Digitales',
    },
    workClassification: 'personal-rnd',
    year: '2023 - 2024',
    engine: 'Unreal Engine Interactive 3D',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/vdb-realestate-digitaltwin.mp4',
    thumbnailSrc: '/portfolio_assets/vdb-realestate-thumb.jpg',
    mediaNote: {
      en: "Direct interactive screen capture (VDB): Real-time architectural visualization of 30+ story luxury tower, interactive day/night celestial lighting slider, surrounding urban points of interest (Andares, Hospital Puerta de Hierro), and master plan zoning.",
      es: 'Grabación directa de pantalla interactiva (VDB): Visualización arquitectónica en tiempo real de torre de 30+ pisos, control interactivo de iluminación solar día/noche, puntos de interés urbano en el entorno (Andares, Hospital Puerta de Hierro) y zonificación de master plan.',
    },
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View in Drive Portfolio Folder',
      es: 'Ver en Carpeta Drive de Portafolio',
    },
    description: {
      en: 'Interactive 3D real estate visualization and architectural digital twin engineered in Unreal Engine. Allows prospective buyers and city planners to freely orbit high-rise developments, inspect urban points of interest, toggle interactive time-of-day lighting from bright noon to illuminated night ambiance, and review master plan floorplates.',
      es: 'Visualización 3D interactiva de bienes raíces y gemelo digital arquitectónico desarrollado en Unreal Engine. Permite a inversionistas y planificadores urbanos orbitar desarrollos verticales en tiempo real, inspeccionar puntos de interés urbanos circundantes, alternar el ciclo de iluminación solar día/noche y revisar la distribución del master plan.',
    },
    highlights: {
      en: [
        'Dynamic real-time time-of-day sun trajectory with automated building interior/exterior illumination',
        'Interactive HUD with compass orientation, master plan floorplates, and urban service locators',
        'High-density foliage and realistic city environment optimized for steady 60 FPS performance',
        'Custom interactive UI controls for real estate client showcases',
      ],
      es: [
        'Trayectoria solar dinámica en tiempo real con encendido automático de iluminación interior y exterior',
        'HUD interactivo con brújula de orientación, master plan de niveles y localizador de servicios urbanos',
        'Vegetación de alta densidad y entorno urbano fotorrealista optimizado para 60 FPS sostenidos',
        'Controles de interfaz interactiva personalizados para salas de ventas y presentaciones inmobiliarias',
      ],
    },
    techStack: ['Unreal Engine', 'Architectural Visualization', 'Interactive 3D', 'Day/Night Simulation', 'UI/UX Blueprints'],
    featured: true,
  },
  {
    id: 'class-sim',
    title: {
      en: 'ClassSim - Interactive Classroom Virtual Simulation',
      es: 'ClassSim - Simulación Virtual Interactiva de Aulas',
    },
    subtitle: {
      en: 'Spatial Presence & Interactive Education Environment in Unreal Engine',
      es: 'Presencia Espacial y Entorno Interactivo de Educación en Unreal Engine',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive Virtual Environments',
      es: 'Entornos Virtuales Interactivos',
    },
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Engine (Standalone NetMode)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/class-sim-interactive-classroom.mp4',
    thumbnailSrc: '/portfolio_assets/class-sim-thumb.jpg',
    mediaNote: {
      en: "Direct in-engine screen recording from Isaac's 64-bit Windows Standalone build (ClassSim Preview 2020-11-13): Interactive 3D classroom for biology education, embedded blackboard video playback, holographic 3D science displays on student desks, and interactive information cards.",
      es: "Grabación de pantalla directa in-engine del build Standalone de 64 bits para Windows de Isaac (ClassSim Preview 2020-11-13): Aula virtual 3D interactiva para educación en biología, reproducción de video en pizarra digital, exhibiciones científicas holográficas 3D en pupitres y tarjetas informativas interactivas.",
    },
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Project in Drive Archive',
      es: 'Ver Proyecto en Carpeta Drive',
    },
    description: {
      en: 'Interactive 3D simulation of an academic classroom setting designed for training, multi-perspective spatial awareness, and interactive virtual education in Unreal Engine. Features an embedded blackboard video lecture player, interactive 3D biology exhibition cases (Gametes, Fertilization, Asexual and Sexual reproduction), first-person raycast interactions, and realistic interior lighting.',
      es: 'Simulación 3D interactiva de un aula académica diseñada para capacitación pedagógica, conciencia espacial y educación virtual interactiva en Unreal Engine. Incluye reproductor de lecciones en video integrado en la pizarra digital, vitrinas interactivas 3D de biología (Gametos, Fecundación, Reproducción Asexual y Sexual), interacción mediante raycast en primera persona e iluminación interior realista.',
    },
    highlights: {
      en: [
        'Interactive first-person controller with collision geometry, mouse look, and reticle interaction',
        'Blackboard video lecture streaming synchronization with classroom ambient acoustics',
        'Interactive 3D science exhibition vitrines with real-time popup educational cards',
        'Optimized 64-bit NetMode Standalone executable running smoothly on Windows',
      ],
      es: [
        'Controlador interactivo en primera persona con geometría de colisión, cursor y selección por raycast',
        'Sincronización de video en pizarra digital con acústica ambiental del aula',
        'Vitrinas interactivas 3D de biología con tarjetas educativas emergentes en tiempo real',
        'Build ejecutable Standalone NetMode de 64 bits optimizado con rendimiento fluido en Windows',
      ],
    },
    techStack: ['Unreal Engine', 'Interactive 3D', 'Educational Simulation', 'Standalone Build', 'C++ / Blueprints'],
    featured: true,
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
    mediaSrc: '/portfolio_assets/unreal-landscape-openworld.mp4',
    thumbnailSrc: '/portfolio_assets/unreal-landscape-thumb.jpg',
    mediaNote: {
      en: "Direct Unreal Engine screen recording (IWG Studios landscape.mp4): Third-person medieval RPG locomotion, dynamic open-world landscape, castle courtyard, quest HUD system ('Misiones: Compra una espada'), and vegetation wind simulation.",
      es: "Grabación directa de pantalla en Unreal Engine (IWG Studios landscape.mp4): Locomoción RPG medieval en tercera persona, paisaje de mundo abierto dinámico, patio de castillo, sistema de misiones ('Misiones: Compra una espada') y simulación de viento en vegetación.",
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
    thumbnailSrc: '/portfolio_assets/unreal-multiplayer-thumb.jpg',
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
    thumbnailSrc: '/portfolio_assets/unreal-editor-thumb.jpg',
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

interface CardVideoPlayerProps {
  project: ProjectItem;
  title: string;
  isEn: boolean;
  onOpenModal: () => void;
  badgeLabel: string;
  isAaa: boolean;
  isPersonalRnd: boolean;
  isProprietary: boolean;
  isEnterprise: boolean;
}

export function CardVideoPlayer({
  project,
  title,
  isEn,
  onOpenModal,
  badgeLabel,
  isAaa,
  isPersonalRnd,
  isProprietary,
  isEnterprise,
}: CardVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showYouTubeInline, setShowYouTubeInline] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !project.mediaSrc) return;

    video.defaultMuted = true;
    video.muted = true;
    setIsMuted(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [project.mediaSrc]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  // Badge classification component
  const BadgePill = () => (
    <div
      className={`absolute top-2.5 left-3 z-30 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow pointer-events-none ${
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
      <span>{badgeLabel}</span>
    </div>
  );

  // If YouTube and user clicked inline playback
  if (project.youtubeId && showYouTubeInline) {
    return (
      <div className="w-full relative aspect-video bg-black overflow-hidden group/vid">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <BadgePill />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-white text-xs z-30 backdrop-blur-xs shadow-md transition-all flex items-center gap-1"
          title={isEn ? 'View full case study' : 'Ver caso de estudio completo'}
        >
          <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[10px] font-semibold">{isEn ? 'Details' : 'Detalles'}</span>
        </button>
      </div>
    );
  }

  // If YouTube video waiting for user click
  if (project.youtubeId && !project.mediaSrc) {
    return (
      <div
        className="w-full relative aspect-video bg-slate-950 cursor-pointer group/vid overflow-hidden"
        onClick={() => setShowYouTubeInline(true)}
      >
        <img
          src={project.thumbnailSrc || `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover opacity-90 group-hover/vid:opacity-100 group-hover/vid:scale-105 transition-all duration-500"
          onError={(e) => {
            if (project.youtubeId && !e.currentTarget.src.includes('hqdefault')) {
              e.currentTarget.src = `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`;
            }
          }}
        />
        <BadgePill />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Big centered red YouTube play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl transition-all transform group-hover/vid:scale-110 active:scale-95">
            <Play className="w-6 h-6 ml-0.5 fill-white text-white" />
          </div>
        </div>

        {/* Quick controls bar */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-20">
          <span className="text-[11px] font-medium text-white/95 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
            <Film className="w-3 h-3 text-red-500" />
            <span>{isEn ? 'Click to Play Broadcast' : 'Clic para Reproducir'}</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-sky-600 text-white text-[11px] font-semibold backdrop-blur-xs transition-colors flex items-center gap-1 shadow-sm"
          >
            <Maximize2 className="w-3 h-3 text-sky-400" />
            <span>{isEn ? 'Details' : 'Detalles'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Interactive MP4 player with direct on-card playback and sound controls
  return (
    <div
      className="w-full relative aspect-video bg-slate-950 group/vid overflow-hidden cursor-pointer"
      onClick={togglePlay}
    >
      {project.mediaSrc && !hasError ? (
        <video
          ref={videoRef}
          src={project.mediaSrc}
          poster={project.thumbnailSrc}
          playsInline
          loop
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={project.thumbnailSrc || ''}
          alt={title}
          className="w-full h-full object-cover"
        />
      )}

      <BadgePill />

      {/* Progress timeline bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden">
        <div
          className="h-full bg-sky-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Center Play overlay when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px] transition-all z-10 pointer-events-none">
          <div className="w-13 h-13 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-2xl transition-transform transform scale-100 group-hover/vid:scale-110">
            <Play className="w-6 h-6 ml-0.5 fill-slate-950 text-slate-950" />
          </div>
        </div>
      )}

      {/* Top right floating sound and expand controls */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-30">
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors shadow-sm"
          title={isMuted ? (isEn ? 'Unmute audio' : 'Activar sonido') : (isEn ? 'Mute audio' : 'Silenciar')}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors shadow-sm"
          title={isEn ? 'Expand case study' : 'Ver caso de estudio completo'}
        >
          <Maximize2 className="w-4 h-4 text-slate-300 hover:text-white" />
        </button>
      </div>

      {/* Bottom control bar */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
        <button
          type="button"
          onClick={togglePlay}
          className="px-2.5 py-1 rounded-md bg-slate-900/85 hover:bg-slate-900 text-white text-xs flex items-center gap-1.5 backdrop-blur-xs shadow-sm transition-all"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{isEn ? 'Pause' : 'Pausar'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{isEn ? 'Play' : 'Reproducir'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className="px-2.5 py-1 rounded-md bg-slate-900/85 hover:bg-sky-600 text-white text-[10px] font-bold backdrop-blur-xs transition-colors flex items-center gap-1 shadow-sm"
        >
          <Film className="w-3 h-3 text-sky-400" />
          <span>{isEn ? 'Case Study' : 'Caso de Estudio'}</span>
        </button>
      </div>
    </div>
  );
}

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
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});
  const [modalVideoError, setModalVideoError] = useState<boolean>(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(PORTFOLIO_PROJECTS);

  const handleVideoUploaded = (projectId: string, youtubeId: string) => {
    setProjectsList((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              youtubeId,
              mediaType: 'video',
              thumbnailSrc: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            }
          : p
      )
    );
  };

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

  const filteredProjects = projectsList.filter((p) => {
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
              <div className="w-full relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                {project.mediaType === 'video' && (project.mediaSrc || project.youtubeId) ? (
                  <CardVideoPlayer
                  project={project}
                  title={title}
                  isEn={isEn}
                  onOpenModal={() => openProjectModal(project)}
                  badgeLabel={mediaBadgeText}
                  isAaa={isAaa}
                  isPersonalRnd={isPersonalRnd}
                  isProprietary={isProprietary}
                  isEnterprise={isEnterprise}
                />
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

                    <div className="flex items-center gap-2">
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
                        poster={activeModalProject.thumbnailSrc}
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

      {/* YouTube Uploader & Post Generator Studio Modal */}
      <YouTubeUploaderModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        language={language}
        onVideoUploaded={handleVideoUploaded}
      />
    </div>
  );
}
