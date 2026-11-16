import React, { useEffect, useState } from 'react';
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
  X,
  Compass,
  CheckCircle2,
  ChevronRight,
  Monitor,
  Flame,
  Boxes,
  ShieldCheck,
  Building2,
  Info,
  Heart,
  Award,
  Activity,
  Fish,
  Images,
  Palette,
  Volume2,
  VolumeX,
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

export type WorkClassification =
  | 'aaa-studio'
  | 'personal-rnd'
  | 'enterprise-client'
  | 'proprietary-platform';

export type ShowcaseTheme =
  | 'cyber'
  | 'ocean'
  | 'gold'
  | 'emerald'
  | 'architectural'
  | 'indigo'
  | 'sky'
  | 'magenta';

interface ThemePalette {
  label: LocalizedString;
  cardBorder: string;
  cardAccentTop: string;
  badgeBg: string;
  badgeText: string;
  pillBg: string;
  pillText: string;
  ctaText: string;
  modalHeader: string;
  modalBanner: string;
  modalIconBg: string;
}

const THEME_PALETTES: Record<ShowcaseTheme, ThemePalette> = {
  cyber: {
    label: { en: 'Cyber Arcade 3D', es: 'Arcade Cyber 3D' },
    cardBorder: 'border-cyan-200/90 hover:border-cyan-500 hover:shadow-cyan-500/15',
    cardAccentTop: 'from-cyan-500 via-sky-500 to-indigo-600',
    badgeBg: 'bg-cyan-400 text-slate-950',
    badgeText: 'bg-cyan-100 text-cyan-900 border border-cyan-300',
    pillBg: 'bg-cyan-50 text-cyan-800 border border-cyan-200/80',
    pillText: 'text-cyan-700',
    ctaText: 'text-cyan-600 hover:text-cyan-800',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-cyan-500/30',
    modalBanner: 'bg-cyan-50 border-cyan-200 text-cyan-950',
    modalIconBg: 'bg-cyan-500 text-slate-950',
  },
  ocean: {
    label: { en: 'Aquatic 3D Edition', es: 'Edición Acuática 3D' },
    cardBorder: 'border-teal-200/90 hover:border-teal-500 hover:shadow-teal-500/15',
    cardAccentTop: 'from-teal-400 via-emerald-500 to-cyan-500',
    badgeBg: 'bg-teal-400 text-slate-950',
    badgeText: 'bg-teal-100 text-teal-900 border border-teal-300',
    pillBg: 'bg-teal-50 text-teal-800 border border-teal-200/80',
    pillText: 'text-teal-700',
    ctaText: 'text-teal-600 hover:text-teal-800',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-teal-950 to-cyan-950 border-b border-teal-500/30',
    modalBanner: 'bg-teal-50 border-teal-200 text-teal-950',
    modalIconBg: 'bg-teal-500 text-slate-950',
  },
  gold: {
    label: { en: 'AAA Console Broadcast', es: 'Consola AAA & Broadcast' },
    cardBorder: 'border-amber-200/90 hover:border-amber-500 hover:shadow-amber-500/15',
    cardAccentTop: 'from-amber-400 via-orange-500 to-yellow-500',
    badgeBg: 'bg-amber-400 text-slate-950',
    badgeText: 'bg-amber-100 text-amber-900 border border-amber-300',
    pillBg: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    pillText: 'text-amber-700',
    ctaText: 'text-amber-700 hover:text-amber-900',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-amber-950/70 to-slate-900 border-b border-amber-500/30',
    modalBanner: 'bg-amber-50 border-amber-200 text-amber-950',
    modalIconBg: 'bg-amber-500 text-slate-950',
  },
  emerald: {
    label: { en: 'Industrial IoT Twin', es: 'Gemelo Digital IoT' },
    cardBorder: 'border-emerald-200/90 hover:border-emerald-500 hover:shadow-emerald-500/15',
    cardAccentTop: 'from-emerald-500 via-teal-500 to-green-600',
    badgeBg: 'bg-emerald-400 text-slate-950',
    badgeText: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    pillBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    pillText: 'text-emerald-700',
    ctaText: 'text-emerald-600 hover:text-emerald-800',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-emerald-950/70 to-slate-900 border-b border-emerald-500/30',
    modalBanner: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    modalIconBg: 'bg-emerald-500 text-slate-950',
  },
  architectural: {
    label: { en: 'ArchViz 3D Master Plan', es: 'ArchViz & Master Plan 3D' },
    cardBorder: 'border-violet-200/90 hover:border-violet-500 hover:shadow-violet-500/15',
    cardAccentTop: 'from-violet-500 via-purple-500 to-indigo-600',
    badgeBg: 'bg-violet-400 text-slate-950',
    badgeText: 'bg-violet-100 text-violet-900 border border-violet-300',
    pillBg: 'bg-violet-50 text-violet-800 border border-violet-200/80',
    pillText: 'text-violet-700',
    ctaText: 'text-violet-600 hover:text-violet-800',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-violet-950/80 to-slate-900 border-b border-violet-500/30',
    modalBanner: 'bg-violet-50 border-violet-200 text-violet-950',
    modalIconBg: 'bg-violet-500 text-white',
  },
  indigo: {
    label: { en: 'Simulation & EdTech 3D', es: 'Simulación & EdTech 3D' },
    cardBorder: 'border-indigo-200/90 hover:border-indigo-500 hover:shadow-indigo-500/15',
    cardAccentTop: 'from-indigo-500 via-blue-500 to-sky-500',
    badgeBg: 'bg-indigo-400 text-slate-950',
    badgeText: 'bg-indigo-100 text-indigo-900 border border-indigo-300',
    pillBg: 'bg-indigo-50 text-indigo-800 border border-indigo-200/80',
    pillText: 'text-indigo-700',
    ctaText: 'text-indigo-600 hover:text-indigo-800',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-b border-indigo-500/30',
    modalBanner: 'bg-indigo-50 border-indigo-200 text-indigo-950',
    modalIconBg: 'bg-indigo-500 text-white',
  },
  sky: {
    label: { en: 'Unreal R&D & Netcode', es: 'I+D Unreal & Netcode' },
    cardBorder: 'border-sky-200/90 hover:border-sky-500 hover:shadow-sky-500/15',
    cardAccentTop: 'from-sky-400 via-blue-500 to-cyan-600',
    badgeBg: 'bg-sky-400 text-slate-950',
    badgeText: 'bg-sky-100 text-sky-900 border border-sky-300',
    pillBg: 'bg-sky-50 text-sky-800 border border-sky-200/80',
    pillText: 'text-sky-700',
    ctaText: 'text-sky-600 hover:text-sky-800',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-sky-950/80 to-slate-900 border-b border-sky-500/30',
    modalBanner: 'bg-sky-50 border-sky-200 text-sky-950',
    modalIconBg: 'bg-sky-500 text-slate-950',
  },
  magenta: {
    label: { en: 'Concept Art & Visual Dev', es: 'Arte Conceptual & Visual Dev' },
    cardBorder: 'border-fuchsia-200/90 hover:border-fuchsia-500 hover:shadow-fuchsia-500/15',
    cardAccentTop: 'from-fuchsia-500 via-pink-500 to-rose-500',
    badgeBg: 'bg-fuchsia-400 text-slate-950',
    badgeText: 'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-300',
    pillBg: 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200/80',
    pillText: 'text-fuchsia-700',
    ctaText: 'text-fuchsia-600 hover:text-fuchsia-800',
    modalHeader: 'bg-gradient-to-r from-slate-950 via-fuchsia-950/70 to-slate-900 border-b border-fuchsia-500/30',
    modalBanner: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-950',
    modalIconBg: 'bg-fuchsia-500 text-white',
  },
};

export interface ProjectItem {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  category: 'all' | 'playable-games' | 'virtual-env' | 'aaa-games' | 'simulation' | 'art';
  categoryLabel: LocalizedString;
  theme: ShowcaseTheme;
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
  featured?: boolean;
}

const WORLD_THEMES = [
  { id: 'cyber_grid', name: 'Cyber Grid', tag: 'Neon Future', tagEs: 'Futuro Neón', src: '/assets/worlds/cyber_grid.jpg', game: 'conveyor' as const },
  { id: 'chess_kingdom', name: 'Chess Kingdom', tag: 'Royal Board', tagEs: 'Tablero Real', src: '/assets/worlds/chess_kingdom.jpg', game: 'conveyor' as const },
  { id: 'golden_vault', name: 'Golden Vault', tag: 'Bullion', tagEs: 'Bóveda Dorada', src: '/assets/worlds/golden_vault.jpg', game: 'conveyor' as const },
  { id: 'banana_paradise', name: 'Banana Paradise', tag: 'Tropics', tagEs: 'Trópico', src: '/assets/worlds/banana_paradise.jpg', game: 'conveyor' as const },
  { id: 'sky_isles', name: 'Sky Isles', tag: 'Cloudscape', tagEs: 'Nubes Celestiales', src: '/assets/worlds/sky_isles.jpg', game: 'conveyor' as const },
  { id: 'turbo_circuit', name: 'Turbo Circuit', tag: 'Velocity', tagEs: 'Velocidad', src: '/assets/worlds/turbo_circuit.jpg', game: 'conveyor' as const },
  { id: 'land_forest', name: 'Land Forest', tag: 'Timberland', tagEs: 'Bosque Maderero', src: '/assets/worlds/land_forest.jpg', game: 'conveyor' as const },
  { id: 'coral_cove', name: 'Coral Cove', tag: 'Fish Feeder', tagEs: 'Fish Feeder', src: '/assets/worlds/coral_cove.jpg', game: 'fish' as const },
];

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'tile-absorber-3d',
    title: {
      en: 'Conveyor Realms (Tile Absorber 3D)',
      es: 'Conveyor Realms (Tile Absorber 3D)',
    },
    subtitle: {
      en: 'Original Playable 3D Action-Puzzle Engine, Runners & 9 World Biomes',
      es: 'Motor Puzzle-Acción 3D Original Jugable, Runners y 9 Biomas Temáticos',
    },
    category: 'playable-games',
    categoryLabel: {
      en: 'Playable 3D Game & Engine',
      es: 'Videojuego 3D Jugable',
    },
    theme: 'cyber',
    workClassification: 'personal-rnd',
    year: '2026',
    engine: 'Three.js / WebGL / TypeScript',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/tile_absorber_64df8e71.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/tile-absorber-gameplay.jpg',
    mediaNote: {
      en: '1080p direct gameplay capture of Conveyor Realms (Level 8 • Chess Kingdom) + official Victory/Game Over pop-up screens and 9 procedural 3D world themes.',
      es: 'Captura directa en 1080p de Conveyor Realms (Nivel 8 • Chess Kingdom) + pantallas pop-up oficiales de Victoria/Derrota y 9 temas procedurales 3D.',
    },
    description: {
      en: 'A high-speed 3D spatial puzzle-action game designed, architected, and built from scratch. Features color-coded autonomous runners patrolling an isometric floating tile grid on elevated conveyor belts, exposed-edge tile absorption algorithms, a 3-tier tactical wildcard system, streak XP scoring, and Supabase cloud leaderboards.',
      es: 'Videojuego de puzzle-acción espacial en 3D diseñado, arquitecturado y programado desde cero. Incluye runners autónomos por color patrullando una cuadrícula flotante sobre bandas transportadoras, algoritmos de absorción perimetral, comodines tácticos de 3 tiers, economía de rachas XP y récords globales en Supabase.',
    },
    highlights: {
      en: [
        '1080p 60 FPS Three.js engine with orthogonal conveyor loops and spatial raycasting',
        'Exposed-edge tile absorption algorithm evaluating perimeter obstruction in real time',
        '3-tier evolving wildcard system (9 tactical abilities, 1 use per level)',
        '9 handcrafted world biomes (Cyber Grid, Chess Kingdom, Golden Vault, Sky Isles, etc.) & custom Victory/Defeat pop-ups',
      ],
      es: [
        'Motor Three.js a 60 FPS en 1080p con bandas transportadoras ortogonales y raycasting espacial',
        'Algoritmo de absorción perimetral expuesta evaluando bloqueos en tiempo real',
        'Comodines evolutivos en 3 tiers (9 habilidades tácticas con límite de 1 uso por nivel)',
        '9 biomas y temas de mundo (Cyber Grid, Chess Kingdom, Golden Vault, Sky Isles, etc.) con pop-ups ilustrados de Victoria/Derrota',
      ],
    },
    techStack: ['Three.js', 'WebGL', 'TypeScript', 'React 19', 'Supabase SQL', 'Procedural Shaders', 'Web Audio API'],
    galleryImages: [
      {
        src: '/portfolio_assets/thumbs/tile-absorber-gameplay.jpg',
        caption: {
          en: 'Live Gameplay Capture — Level 8 (Chess Kingdom) with special bombs/keys & conveyor queue',
          es: 'Gameplay en Vivo — Nivel 8 (Chess Kingdom) con piezas especiales y banda perimetral',
        },
      },
      {
        src: '/portfolio_assets/conveyor-realms-gameplay.png',
        caption: {
          en: 'Conveyor Realms Web HUD — Runner dock, progression bar, and tactical power-up bar',
          es: 'HUD Web de Conveyor Realms — Dock de runners, barra de progreso y comodines tácticos',
        },
      },
      {
        src: '/portfolio_assets/tile-absorber-thumb.jpg',
        caption: {
          en: 'Cyber Arcade Key Art — Promotional cover for Download Ads & Showcase banner',
          es: 'Arte Clave Arcade Cyber — Portada promocional para anuncios y vitrina',
        },
      },
      {
        src: '/portfolio_assets/conveyor-realms-mockup.png',
        caption: {
          en: 'Landscape Tablet & Mobile Viewport Presentation Mockup',
          es: 'Presentación en Viewport Landscape para Móvil y Tablet',
        },
      },
      {
        src: '/assets/popups/conveyor_win_es.png',
        caption: {
          en: 'Victory Pop-Up Artwork (3 Stars • Level Complete & Download CTA)',
          es: 'Pop-Up de Victoria (3 Estrellas • Nivel Completado y CTA de Descarga)',
        },
      },
      {
        src: '/assets/popups/conveyor_lose_es.png',
        caption: {
          en: 'Queue Overflow Defeat Pop-Up Artwork (Sad Black Tiles & Retry CTA)',
          es: 'Pop-Up de Derrota por Saturación (Fichas Negras Tristes y Reintento)',
        },
      },
    ],
    featured: true,
  },
  {
    id: 'fish-feeder-3d',
    title: {
      en: 'Fish Feeder - Aquatic 3D Pearl Edition',
      es: 'Fish Feeder - Edición Acuática 3D de Perlas',
    },
    subtitle: {
      en: 'Ocean Reef Theme, 3D Fish Runners, Combo Pearls & Animated Coral Track',
      es: 'Tema Arrecife de Coral, Peces 3D, Perlas Especiales y Pista Acuática',
    },
    category: 'playable-games',
    categoryLabel: {
      en: 'Playable 3D Game & Edition',
      es: 'Videojuego 3D Jugable (Acuático)',
    },
    theme: 'ocean',
    workClassification: 'personal-rnd',
    year: '2026',
    engine: 'Three.js / WebGL / TypeScript',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/Fish_feeder_6c148142.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/fish-feeder-gameplay.jpg',
    mediaNote: {
      en: '1080p direct gameplay capture of Fish Feeder (Level 11 • Coral Reef): 3D fish runners, iridescent pearls, water stream conveyor, and custom ocean pop-ups.',
      es: 'Captura directa en 1080p de Fish Feeder (Nivel 11 • Arrecife de Coral): Peces 3D en pista acuática, perlas iridiscentes especiales y pop-ups oceánicos propios.',
    },
    description: {
      en: 'Coastal underwater variant of the 3D Conveyor Engine re-themed around playful 3D fish runners collecting glowing ocean pearls across shallow reef sandbars. Includes pearl power-ups, 6-column feeder dock UI, Coral Cove ambient soundtrack, and dedicated Aquatic victory & defeat pop-ups.',
      es: 'Edición acuática y costera del motor Conveyor 3D ambientada con peces 3D animados recolectando perlas marinas brillantes sobre bancos de coral. Incluye perlas especiales explosivas, dock de 6 carriles, ambientación de Coral Cove y pop-ups temáticos propios.',
    },
    highlights: {
      en: [
        'Full 3D fish runner rigs replacing cubic bots with swimming fins & aquatic particle wakes',
        'Iridescent pearl shader materials, star-pearl wildcards, and underwater refraction vibe',
        'Dedicated Coral Cove theme with custom Victory / Defeat Ocean Pop-Ups (EN/ES)',
        'Shared Supabase leaderboard & landscape mobile rewarded ad showcase',
      ],
      es: [
        'Modelado y animación de peces 3D con aleteo continuo y estelas de burbujas en pista',
        'Materiales de perlas iridiscentes, perlas explosivas y ambientación submarina Coral Cove',
        'Tema visual Coral Cove dedicado con Pop-Ups oceánicos de Victoria y Derrota (ES/EN)',
        'Leaderboard en Supabase y formato móvil landscape integrado en Rewarded Ads',
      ],
    },
    techStack: ['Three.js', 'Aquatic Shaders', 'TypeScript', 'React 19', 'Supabase', 'Web Audio API'],
    galleryImages: [
      {
        src: '/portfolio_assets/thumbs/fish-feeder-gameplay.jpg',
        caption: {
          en: 'Live Gameplay Capture — Level 11 Ocean Pearls & Coral Sandbar Board',
          es: 'Gameplay en Vivo — Nivel 11 Perlas Oceánicas y Tablero de Coral',
        },
      },
      {
        src: '/assets/aistudio/image_d3be3235.png',
        caption: {
          en: 'Fish Feeder Key Art Thumbnail — Ocean Puzzle Promotion Banner',
          es: 'Miniatura Clave Fish Feeder — Banner Promocional del Océano',
        },
      },
      {
        src: '/assets/worlds/coral_cove.jpg',
        caption: {
          en: 'Coral Cove Biome Texture & Environmental Backdrop',
          es: 'Bioma Coral Cove — Textura de Arrecife y Fondo Marino',
        },
      },
      {
        src: '/assets/popups/fof_win_es.png',
        caption: {
          en: 'Aquatic Victory Pop-Up (3 Stars & Pearl Burst)',
          es: 'Pop-Up de Victoria Acuática (3 Estrellas y Explosión de Perlas)',
        },
      },
      {
        src: '/assets/popups/fof_lose_es.png',
        caption: {
          en: 'Aquatic Defeat Pop-Up (Queue Full & Retry)',
          es: 'Pop-Up de Derrota Acuática (Cola Llena y Reintento)',
        },
      },
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
      es: 'Videojuegos AAA & Co-Dev',
    },
    theme: 'gold',
    workClassification: 'aaa-studio',
    year: '2024',
    engine: 'Frostbite Engine',
    mediaType: 'video',
    youtubeId: 'ubRvxZC4jGI',
    thumbnailSrc: 'https://img.youtube.com/vi/ubRvxZC4jGI/hqdefault.jpg',
    mediaNote: {
      en: 'Shipped AAA console title co-developed under studio NDA at DEVBOT for EA Sports. Demonstrated via official EA gameplay showcase and verified MobyGames credits.',
      es: 'Título AAA de consola co-desarrollado bajo NDA en DEVBOT para EA Sports. Demostrado mediante gameplay oficial de EA y créditos verificados en MobyGames.',
    },
    description: {
      en: 'Verified public credit on MobyGames for flagship sports release EA Sports College Football 25. Provided critical Technical Art and QA support across UI/UX systems, Frostbite engine pipelines, initial playable build performance, and console certification for PS5 and Xbox Series X/S.',
      es: 'Crédito público verificado en MobyGames para el lanzamiento insignia EA Sports College Football 25. Soporte crítico como Artista Técnico y QA en sistemas de UI/UX, pipelines en Frostbite Engine, rendimiento a 60+ FPS y certificación para PS5 y Xbox Series X/S.',
    },
    highlights: {
      en: [
        'Publicly verified credits on MobyGames database for Isaac Gómez',
        'Engineered & validated initial playable build ensuring steady 60+ FPS performance',
        'Interactive UI/UX implementation in proprietary Frostbite Engine',
        'Large-scale source control with Perforce (Helix Core) and Jenkins CI/CD',
      ],
      es: [
        'Crédito verificado públicamente en MobyGames para Isaac Gómez',
        'Ingeniería y validación del primer build jugable sosteniendo 60+ FPS',
        'Implementación de sistemas UI/UX interactivos en Frostbite Engine',
        'Flujo con Perforce (Helix Core) y automatización CI/CD con Jenkins',
      ],
    },
    techStack: ['Frostbite Engine', 'Perforce Helix Core', 'Jenkins CI', 'C++', 'UI/UX', 'PS5 / Xbox Series X'],
    externalUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    externalLabel: {
      en: 'View Verified MobyGames Credits',
      es: 'Ver Créditos en MobyGames',
    },
    mobyGamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    featured: true,
  },
  {
    id: 'scores-sports-sim',
    title: {
      en: 'Sports Broadcast & Real-Time Scoreboard HUD System',
      es: 'Transmisión Deportiva y Marcador HUD en Tiempo Real',
    },
    subtitle: {
      en: 'Dynasty Hub Scores & Schedules UI, Conference Standings & Frostbite ActionScript',
      es: 'UI de Dynasty Hub Scores & Schedules, Tablas de Conferencia y Frostbite ActionScript',
    },
    category: 'aaa-games',
    categoryLabel: {
      en: 'AAA Dynasty UI / HUD',
      es: 'UI / HUD Dynasty AAA',
    },
    theme: 'gold',
    workClassification: 'aaa-studio',
    year: '2022 - 2024',
    engine: 'Frostbite Engine',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/scores_96d7bf7d.mp4',
    youtubeId: '3Rkj6FlMcLU',
    thumbnailSrc: '/portfolio_assets/thumbs/scores-thumb.jpg',
    mediaNote: {
      en: 'Direct internal engine recording (scores.mp4 • Dynasty Hub #3 Ohio State Buckeyes): Live ActionScript + C++ screens for Team Schedule, Scores & Schedules, and North/South Conference Standings on Frostbite Direct3D 12, paired with official broadcast trailer.',
      es: 'Grabación directa en motor (scores.mp4 • Dynasty Hub #3 Ohio State Buckeyes): Pantallas en ActionScript + C++ para Team Schedule, Scores & Schedules y Conference Standings sobre Frostbite Direct3D 12, más el tráiler oficial.',
    },
    description: {
      en: 'Dynasty Hub menu architecture, live Scores & Schedules explorer, Conference Standings spreadsheets (UcntlSpreadsheetModule), and broadcast UI engineered with ActionScript integrated with high-performance C++ runtime on Frostbite Engine for EA Sports College Football.',
      es: 'Arquitectura de menús Dynasty Hub, explorador de Scores & Schedules, tablas de Conference Standings (UcntlSpreadsheetModule) y HUD deportivo desarrollados con ActionScript integrado a runtime C++ en Frostbite Engine para EA Sports College Football.',
    },
    highlights: {
      en: [
        'Engineered in ActionScript integrated with C++ runtime & ScreenManager node hierarchies on Frostbite',
        'Interactive Scores & Schedules feed, Bye Week schedule grids & Conference Standings tables',
        'Live Direct3D 12 CPU/SIM/GPU UI performance budget profiling verified inside engine',
        'Certified for EA Sports AAA presentation pipelines on PS5 and Xbox Series X/S',
      ],
      es: [
        'Desarrollado en ActionScript integrado a runtime C++ y jerarquías ScreenManager en Frostbite',
        'Módulos interactivos de Scores & Schedules, calendario por semana y Conference Standings',
        'Perfilado en vivo de latencia UI (CPU/SIM/GPU) validado directamente sobre Direct3D 12',
        'Certificado para pipelines AAA de presentación en consolas PS5 y Xbox Series X/S',
      ],
    },
    techStack: ['ActionScript', 'C++', 'Frostbite Engine', 'Dynasty Hub UI', 'Direct3D 12'],
    galleryImages: [
      {
        src: '/portfolio_assets/thumbs/scores-thumb.jpg',
        caption: {
          en: 'Direct Capture (scores.mp4) — Dynasty Hub Scores & Schedules ActionScript ScreenManager',
          es: 'Captura Directa (scores.mp4) — Dynasty Hub Scores & Schedules en ActionScript ScreenManager',
        },
      },
      {
        src: 'https://img.youtube.com/vi/3Rkj6FlMcLU/hqdefault.jpg',
        caption: {
          en: 'Official Broadcast Scorebug & Gameplay Presentation (YouTube)',
          es: 'Presentación Oficial Broadcast y Gameplay (YouTube)',
        },
      },
    ],
    externalUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    externalLabel: {
      en: 'View Verified MobyGames Credits',
      es: 'Ver Créditos en MobyGames',
    },
    mobyGamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    featured: true,
  },
  {
    id: 'rwgen-gameplay-telemetry',
    title: {
      en: 'College Football - Frostbite D3D12 Telemetry & Gameplay Profiling',
      es: 'College Football - Telemetría Frostbite D3D12 y Perfilado In-Game',
    },
    subtitle: {
      en: 'Real-Time CPU/SIM/GPU Frame Graphs, Playbooks & Safety Detection (rwgen)',
      es: 'Gráficas CPU/SIM/GPU en Vivo, Rutas de Jugada y Validación de Reglas (rwgen)',
    },
    category: 'aaa-games',
    categoryLabel: {
      en: 'AAA Telemetry & QA',
      es: 'Telemetría AAA & QA',
    },
    theme: 'gold',
    workClassification: 'aaa-studio',
    year: '2022',
    engine: 'Frostbite Engine (Direct3D 12)',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/orl1-rwgen-a115_2022-08-15_14-24-34_Trim_02d311bd.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/orl1-rwgen-thumb.jpg',
    mediaNote: {
      en: 'Direct internal engine capture (orl1-rwgen-a115 2022-08-15): Direct3D 12 frame profiling (CPU/SIM/GPU), asset streaming counters, receiver route markers, and end-zone safety detection.',
      es: 'Captura directa en motor (orl1-rwgen-a115 2022-08-15): Perfilado de cuadros en Direct3D 12 (CPU/SIM/GPU), contadores de streaming, marcadores de ruta y validación de safety en zona de anotación.',
    },
    description: {
      en: 'Real-time technical QA and performance profiling capture inside the Frostbite Direct3D 12 sports simulation environment. Demonstrates live CPU/SIM/GPU frame-time telemetry graphs, asset streaming diagnostics, play route UI markers (Q/R/F/E), and end-zone tackle/safety rule verification.',
      es: 'Captura técnica de QA y perfilado de rendimiento en vivo dentro del entorno Frostbite Direct3D 12. Muestra gráficas de latencia CPU/SIM/GPU en tiempo real, diagnóstico de carga de assets, marcadores tácticos de rutas y validación de reglas de safety en zona de anotación.',
    },
    highlights: {
      en: [
        'Live Direct3D 12 CPU, SIM & GPU millisecond budget monitoring under full stadium loads',
        'Streaming pool telemetry & gameplay entity event logging during active scrimmage plays',
        'Scorebug state transitions (Safety +2 PTS, PUNT indicator) synchronized with on-field physics',
      ],
      es: [
        'Monitoreo en tiempo real de presupuestos CPU, SIM y GPU en Direct3D 12 con estadio completo',
        'Telemetría de streaming de recursos y registro de eventos de entidades en tiempo de jugada',
        'Validación de marcador en vivo (Safety +2 PTS, PUNT) sincronizado con físicas de tacleo',
      ],
    },
    techStack: ['Frostbite Engine', 'Direct3D 12', 'CPU/GPU Profiling', 'Telemetry HUD', 'AAA Sports QA'],
    galleryImages: [
      {
        src: '/portfolio_assets/thumbs/orl1-rwgen-thumb.jpg',
        caption: {
          en: 'Direct3D 12 Telemetry Overlay — End-zone safety tackle & CPU/SIM/GPU frame-time histograms',
          es: 'Overlay de Telemetría Direct3D 12 — Tacleo safety en zona de anotación e histogramas CPU/SIM/GPU',
        },
      },
    ],
    mobyGamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    externalUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    externalLabel: {
      en: 'View Verified MobyGames Credits',
      es: 'Ver Créditos en MobyGames',
    },
    featured: true,
  },
  {
    id: 'industrial-digital-twins',
    title: {
      en: 'Industrial Manufacturing Digital Twins (Flex)',
      es: 'Gemelos Digitales de Manufactura Industrial (Flex)',
    },
    subtitle: {
      en: 'Assembly Line Telemetry, Campus Twin & VR Training (Guad North)',
      es: 'Telemetría de Líneas, Campus 3D Guadalajara Norte y Capacitación VR',
    },
    category: 'simulation',
    categoryLabel: {
      en: 'Industrial Digital Twin',
      es: 'Gemelo Digital Industrial',
    },
    theme: 'emerald',
    workClassification: 'enterprise-client',
    year: '2024 - 2026',
    engine: 'Unreal Engine 5 & FlexSim',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/digital-twin-campus-standalone.mp4',
    thumbnailSrc: '/portfolio_assets/digital-twin-campus-thumb.jpg',
    mediaNote: {
      en: 'Standalone 64-bit D3D Shader Model 6 build capture at Flex: Guadalajara North campus navigation, Building B29 monitoring, SMT line telemetry, and power dashboards.',
      es: 'Captura del build Standalone de 64 bits (D3D Shader Model 6) en Flex: Navegación del campus Guadalajara Norte, monitoreo edificio B29, telemetría de líneas y consumo eléctrico.',
    },
    description: {
      en: 'High-precision real-time 3D Digital Twin of industrial manufacturing facilities engineered with Unreal Engine 5, D3D Shader Model 6, and Arch FlexSim. Features interactive campus navigation, machine utilization dashboards (SIPLACE, AOI Zenith, Vitrox, Heller Reflow), and live energy telemetry.',
      es: 'Gemelo Digital 3D en tiempo real para instalaciones de manufactura industrial construido con Unreal Engine 5, D3D Shader Model 6 y Arch FlexSim. Incluye navegación de campus, tableros de maquinaria SMT, alertas de fallas y monitoreo energético para Fortune 500.',
    },
    highlights: {
      en: [
        'Standalone 64-bit D3D Shader Model 6 executable running interactive campus flythrough',
        'Live IoT telematics: Temperature, Humidity, Energy, Water & Nitrogen tracking',
        'Machine-level inspection (SIPLACE, AOI Zenith, Vitrox, Heller) with yield & failure triage',
        'Multi-monitor engineering workstation telemetry center',
      ],
      es: [
        'Build Standalone de 64 bits (D3D SM6) con recorrido interactivo por todo el campus industrial',
        'Telemetría IoT en tiempo real: Temperatura, Humedad, Energía, Agua y Nitrógeno',
        'Inspección por máquina (SIPLACE, AOI Zenith, Vitrox, Horno Heller) y triage de fallas',
        'Centro de monitoreo multi-monitor con gráficas de rendimiento en tiempo real',
      ],
    },
    techStack: ['Unreal Engine 5', 'Arch FlexSim', 'D3D SM6', 'Industrial IoT', 'Digital Twins', 'C++ / Blueprints'],
    galleryImages: [
      {
        src: '/portfolio_assets/digital-twin-campus-thumb.jpg',
        caption: {
          en: 'Guadalajara North Campus 3D overview with building markers (B-1, B-28, B-29) and orbital view controls.',
          es: 'Vista aérea 3D del Campus Guadalajara Norte con marcadores de edificios (B-1, B-28, B-29) y control de vista.',
        },
      },
      {
        src: '/portfolio_assets/digital-twin-workstation-setup.jpg',
        caption: {
          en: 'Engineering workstation setup: Building power consumption gauges, thermal heatmap, and live 3D production viewport.',
          es: 'Estación de ingeniería: Medidores de consumo eléctrico, mapa térmico y viewport 3D de la línea en vivo.',
        },
      },
    ],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Portfolio Drive Folder',
      es: 'Ver Carpeta de Portafolio',
    },
    featured: true,
  },
  {
    id: 'acuarela-archviz',
    title: {
      en: 'Acuarela - Interactive 3D Master Plan & Availability Twin',
      es: 'Acuarela - Gemelo Digital 3D Arquitectónico & Disponibilidad',
    },
    subtitle: {
      en: 'Real-Time Tower Availability Filter, Amenities & Surroundings in Unreal',
      es: 'Filtro Interactivo de Departamentos, Amenidades y Alrededores en Unreal Engine',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'ArchViz Digital Twin 3D',
      es: 'ArchViz & Gemelo Inmobiliario',
    },
    theme: 'architectural',
    workClassification: 'personal-rnd',
    year: '2022',
    engine: 'Unreal Engine (PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/watercolor-development-viewport.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/acuarela-archviz-thumb.jpg',
    mediaNote: {
      en: 'Direct screen capture (Acuarela1 64-bit PCD3D_SM5): Interactive 3D residential tower with live Disponibilidad filters (m², typology A–PG, Disponible/Vendido), Master Plan, Amenidades & Alrededores.',
      es: 'Grabación directa (Acuarela1 64-bit PCD3D_SM5): Maqueta digital 3D interactiva con filtros en vivo de Disponibilidad (superficie m², tipología A–PG, estatus), Master Plan, Amenidades y Alrededores.',
    },
    description: {
      en: 'Interactive 3D architectural visualization and real estate availability explorer built in Unreal Engine. Features orbital camera controls, elevation floor highlighting, real-time filtering by square footage and unit typology (A, B, C, D, E, PG), Master Plan views, Amenities inspection, and Surroundings context.',
      es: 'Visualización arquitectónica 3D interactiva y explorador de disponibilidad inmobiliaria desarrollado en Unreal Engine. Incluye cámara orbital suave, iluminación dinámica de pisos disponibles, filtros en tiempo real por superficie (65–210 m²) y tipología, vistas de Master Plan, Amenidades y Alrededores.',
    },
    highlights: {
      en: [
        'Dynamic 3D building unit highlighting synchronized with Surface & Typology filters',
        'Five dedicated navigation modes: Master Plan, Amenidades, Disponibilidad, Alrededores, Galería',
        'Compass bearing HUD, altitude slider, and smooth orbital camera damping at 60 FPS',
      ],
      es: [
        'Iluminación dinámica de unidades 3D sincronizada con filtros de Superficie y Tipología',
        'Cinco módulos de navegación: Master Plan, Amenidades, Disponibilidad, Alrededores y Galería',
        'HUD con brújula de orientación, control vertical de altura y órbita suave a 60 FPS',
      ],
    },
    techStack: ['Unreal Engine', 'ArchViz 3D', 'UMG Interactive UI', 'DirectX SM5', 'Blueprints / C++'],
    galleryImages: [
      {
        src: '/portfolio_assets/thumbs/acuarela-archviz-thumb.jpg',
        caption: {
          en: 'Disponibilidad Mode — Live filtering by surface (m²), typology (A–PG), and illuminated 3D units.',
          es: 'Modo Disponibilidad — Filtro en vivo por superficie (m²), tipología y departamentos iluminados en 3D.',
        },
      },
    ],
    featured: true,
  },
  {
    id: 'class-sim',
    title: {
      en: 'ClassSim - Interactive Classroom Virtual Simulation',
      es: 'ClassSim - Simulación Virtual Interactiva de Aulas',
    },
    subtitle: {
      en: 'First-Person Educational Modules & Interactive 3D Lab Environment',
      es: 'Módulos Educativos Interactivos y Entorno 3D en Primera Persona',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'EdTech Virtual Environment',
      es: 'Entorno Educativo 3D',
    },
    theme: 'indigo',
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Engine (Standalone NetMode)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/class-sim-preview.mp4',
    thumbnailSrc: '/portfolio_assets/class-sim-thumb.jpg',
    mediaNote: {
      en: 'Direct screen capture (ClassSim Preview NetMode Standalone): Interactive 3D biology classroom featuring holographic diagrams, blackboard video lessons, and spatial navigation.',
      es: 'Grabación directa (ClassSim Preview NetMode Standalone): Aula virtual 3D interactiva con paneles holográficos de biología, pizarrón multimedia y navegación libre en primera persona.',
    },
    description: {
      en: 'Interactive 3D simulation of a digital classroom and STEM learning laboratory designed for immersive spatial education. Features holographic 3D study stations (Reproducción Sexual / Asexual, Espermatozoide, Bipartición, Gemación), embedded chalkboard video playback, and lightweight standalone Windows delivery.',
      es: 'Simulación 3D interactiva de aula digital y laboratorio educativo diseñada para enseñanza inmersiva. Integra estaciones holográficas de contenido STEM, reproducción de video en el pizarrón principal y empaquetado Standalone optimizado para Windows.',
    },
    highlights: {
      en: [
        'Holographic translucent info boards and interactive trigger stations inside the classroom',
        'Synchronized media player embedded onto the main virtual chalkboard mesh',
        'First-person walkthrough with natural indirect lighting and standalone Windows optimization',
      ],
      es: [
        'Paneles holográficos translúcidos y estaciones de estudio interactivas dentro del salón',
        'Reproductor multimedia sincronizado directamente sobre la malla del pizarrón virtual',
        'Recorrido fluido en primera persona con iluminación global natural y build Standalone',
      ],
    },
    techStack: ['Unreal Engine', 'EdTech 3D', 'Media Textures', 'UMG HUD', 'Standalone Build'],
    galleryImages: [
      {
        src: '/portfolio_assets/class-sim-thumb.jpg',
        caption: {
          en: 'Holographic translucent study panels & 3D biological cellular models inside ClassSim.',
          es: 'Paneles holográficos de estudio y modelos biológicos 3D dentro de ClassSim.',
        },
      },
    ],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'View Project in Drive Archive',
      es: 'Ver Proyecto en Carpeta Drive',
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
      en: 'Full-Stack Fleet Monitoring, Wialon Telemetry & Smart Route Planner',
      es: 'Monitoreo Satelital GPS, Telemetría Wialon y Planificador Inteligente de Rutas',
    },
    category: 'simulation',
    categoryLabel: {
      en: 'SaaS Platform & GIS',
      es: 'Plataforma SaaS & GIS',
    },
    theme: 'cyber',
    workClassification: 'proprietary-platform',
    year: '2026 - Present',
    engine: 'React / TypeScript / Leaflet / Supabase',
    mediaType: 'image',
    mediaSrc: '/portfolio_assets/orblite-rastreo-rutas-2.png',
    thumbnailSrc: '/portfolio_assets/orblite-rastreo-dashboard-1.png',
    mediaNote: {
      en: "Isaac's proprietary production platform (orb-lite.com): Live satellite GPS tracking across Mexico & US, 30 active units, 15 Wialon resources, Swarm APIs, and Smart Route Planner.",
      es: 'Plataforma propietaria de Isaac en producción (orb-lite.com): Rastreo satelital GPS en vivo para México y EE. UU., 30 unidades activas, 15 recursos Wialon y Planificador Inteligente.',
    },
    description: {
      en: 'Proprietary commercial SaaS telematics platform architected and operated by Isaac Gómez Estrada for real-time fleet GPS tracking, telemetry streaming, and automated street routing with Leaflet GIS, Swarm APIs, Wialon Lite protocols, and Supabase.',
      es: 'Plataforma SaaS comercial de telemática diseñada y operada por Isaac Gómez Estrada para rastreo GPS de flotas en tiempo real y optimización de rutas. Integra mapas Leaflet GIS, Swarm APIs, protocolos Wialon Lite y base de datos Supabase.',
    },
    highlights: {
      en: [
        'Proprietary full-stack production platform (orb-lite.com) with zero NDA restrictions',
        'Interactive real-time GPS tracking with Leaflet GIS covering Mexico and USA',
        'Smart Route Planner with multi-stop optimization and return-to-origin routing',
        'Wialon Lite & Swarm API integration managing 30 satellite units across 15 client accounts',
      ],
      es: [
        'Plataforma comercial propia en producción (orb-lite.com) sin restricciones de NDA',
        'Dashboard GPS en tiempo real con Leaflet GIS para México y EE. UU.',
        'Planificador Inteligente con geocodificación y optimización de rutas por calle',
        'Integración Wialon Lite y Swarm APIs gestionando 30 unidades y 15 cuentas activas',
      ],
    },
    techStack: ['TypeScript', 'React', 'Leaflet GIS', 'Swarm APIs', 'Wialon Protocols', 'Supabase SQL'],
    galleryImages: [
      {
        src: '/portfolio_assets/orblite-rastreo-rutas-2.png',
        caption: {
          en: 'Smart Route Planner (Planificador Inteligente) with street-level optimization and Leaflet GIS.',
          es: 'Planificador Inteligente con optimización de rutas por calle y mapa Leaflet GIS.',
        },
      },
      {
        src: '/portfolio_assets/orblite-rastreo-dashboard-1.png',
        caption: {
          en: 'Live Satellite Telemetry Dashboard: 30 units across Mexico & US with Wialon & Swarm sync.',
          es: 'Panel de Telemetría Satelital en Vivo: 30 unidades activas con Wialon y Swarm APIs.',
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
    id: 'unreal-editor-multiplayer',
    title: {
      en: 'Unreal Engine Multiplayer & Server Architecture Preview',
      es: 'Arquitectura Multijugador y Servidor Dedicado en Unreal',
    },
    subtitle: {
      en: 'Client-Server Replication, Projectile Physics & Dedicated Server Mode',
      es: 'Replicación Cliente-Servidor, Físicas de Proyectiles y Servidor Dedicado',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Netcode & Multiplayer R&D',
      es: 'Netcode & Multijugador',
    },
    theme: 'sky',
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Engine (Server 64-bit PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/unreal-multiplayer-server-preview.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/unreal-multiplayer-thumb.jpg',
    mediaNote: {
      en: 'Screen capture from NetMode Dedicated Server test (MyProject3 64-bit PCD3D_SM5): Client-server replication, server-authoritative projectile impulses, and synchronization.',
      es: 'Captura en modo Servidor Dedicado (MyProject3 64-bit PCD3D_SM5): Pruebas de replicación cliente-servidor, impulsos físicos autoritativos y sincronización en red.',
    },
    description: {
      en: 'Dedicated server multiplayer simulation testing real-time client-to-server replication, authoritative state verification, projectile physics impulse synchronization, and network debug tooling in Unreal Engine.',
      es: 'Simulación multijugador con servidor dedicado validando replicación en tiempo real de cliente a servidor, verificación de estado autoritativo, físicas sincronizadas de proyectiles y herramientas de depuración de red en Unreal Engine.',
    },
    highlights: {
      en: [
        'Server-authoritative physics and reliable RPC replication setup',
        'Multi-client viewport testing with synchronized world transform updates',
        'Clean modular Blueprint + C++ gameplay framework debugging',
      ],
      es: [
        'Configuración de físicas con autoridad de servidor y RPCs confiables',
        'Pruebas multiventana con sincronización continua de transformaciones en red',
        'Depuración modular del gameplay framework con Blueprints y C++',
      ],
    },
    techStack: ['Unreal Engine', 'Multiplayer Netcode', 'Replication / RPCs', 'Dedicated Server'],
  },
  {
    id: 'unreal-editor-project4',
    title: {
      en: 'Unreal Engine Scene Assembly & Top-Down Level Workflow',
      es: 'Montaje de Escenarios y Flujo de Niveles en Unreal Editor',
    },
    subtitle: {
      en: 'Editor Viewport Profiling, Lighting Rebuild & AI NavMesh Architecture',
      es: 'Perfilado en Viewport, Iluminación y Arquitectura de NavMesh en Editor',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Unreal Editor Workflow',
      es: 'Flujo de Trabajo en Editor',
    },
    theme: 'sky',
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Editor (PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/unreal-editor-workflow.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/unreal-editor-thumb.jpg',
    mediaNote: {
      en: 'Direct screen recording inside Unreal Editor: TopDown character testing, NavMeshBoundsVolume navigation, lighting setup, and Outliner hierarchy organization.',
      es: 'Grabación directa dentro de Unreal Editor: Pruebas de locomoción Top-Down, volumen NavMeshBoundsVolume, jerarquía en World Outliner y configuración de iluminación.',
    },
    description: {
      en: 'In-editor level construction and profiling workflow session demonstrating modular geometry blocking, NavMesh pathfinding configuration, LightmassImportanceVolume setup, and real-time PIE (Play-In-Editor) iteration.',
      es: 'Sesión de construcción de nivel y perfilado en vivo dentro de Unreal Editor mostrando bloqueo modular de geometría, configuración de rutas NavMesh, volúmenes de iluminación Lightmass e iteración Play-In-Editor.',
    },
    highlights: {
      en: [
        'Organized World Outliner hierarchy with Lighting, SkyLight, and Navigation volumes',
        'NavMesh click-to-move controller validation and cursor decal feedback',
        'Draw call and lightmap optimization workflows inside Unreal Editor',
      ],
      es: [
        'Jerarquía limpia en World Outliner con volúmenes de iluminación y navegación',
        'Validación de controlador Top-Down con NavMesh y cursor decal interactivo',
        'Optimización de draw calls y mapas de luz dentro del flujo nativo de Unreal',
      ],
    },
    techStack: ['Unreal Editor', 'NavMesh AI', 'Lightmass', 'Top-Down Controller', 'Optimization'],
  },
  {
    id: 'concept-artworks',
    title: {
      en: 'Digital Concept Art & Environment Visual Development',
      es: 'Arte Conceptual Digital y Desarrollo Visual de Entornos',
    },
    subtitle: {
      en: '3-Piece Gallery: Atmospheric Matte Painting, Cinema 4D & VFX Typography',
      es: 'Galería de 3 Obras: Matte Painting Atmosférico, Cinema 4D y Composición VFX',
    },
    category: 'art',
    categoryLabel: {
      en: 'Concept Art & Visual Dev',
      es: 'Arte Conceptual & Visual Dev',
    },
    theme: 'magenta',
    workClassification: 'personal-rnd',
    year: '2018 - 2022',
    engine: 'Photoshop / Cinema 4D / Matte Painting',
    mediaType: 'image',
    mediaSrc: '/portfolio_assets/concept-artwork-1.png',
    thumbnailSrc: '/portfolio_assets/concept-artwork-1.png',
    mediaNote: {
      en: "Isaac's original visual development gallery (3 full artworks available below & inside the modal viewer).",
      es: 'Galería original de desarrollo visual y composición digital de Isaac (3 obras completas explorables en la ficha y modal).',
    },
    description: {
      en: 'Digital illustration, 3D typography rendering, and atmospheric matte painting artworks exploring mood, dramatic sky lighting, volumetric haze, and silhouette composition.',
      es: 'Obras de ilustración digital, composición 3D y matte painting atmosférico explorando dramatismo lumínico, cielos tormentosos, neblina volumétrica y teoría del color.',
    },
    highlights: {
      en: [
        'Artwork #1: Mountain monolith VFX/GFX key art with dramatic cloudscape lighting',
        'Artwork #2: Textured molten crackle 3D emblem & surface shader study',
        'Artwork #3: High-contrast amber ember composition blending Photoshop & Cinema 4D',
      ],
      es: [
        'Obra #1: Key Art monolítico de montaña con iluminación dramática de nubes y partículas',
        'Obra #2: Emblema 3D con textura magmática fracturada y estudio de reflejos metálicos',
        'Obra #3: Composición de alto contraste con chispas e integración Photoshop + Cinema 4D',
      ],
    },
    techStack: ['Photoshop', 'Cinema 4D', 'Concept Art', 'Matte Painting', 'Lighting Theory'],
    galleryImages: [
      {
        src: '/portfolio_assets/concept-artwork-1.png',
        caption: {
          en: 'Artwork #1 — VFX / GFX Monolith Mountain Atmosphere Study',
          es: 'Obra #1 — Estudio Atmosférico de Montaña Monolítica VFX / GFX',
        },
      },
      {
        src: '/portfolio_assets/concept-artwork-2.png',
        caption: {
          en: 'Artwork #2 — Molten Crackle Obsidian 3D Typography Benchmark',
          es: 'Obra #2 — Tipografía 3D de Obsidiana y Fisuras Incandescentes',
        },
      },
      {
        src: '/portfolio_assets/concept-artwork-3.png',
        caption: {
          en: 'Artwork #3 — Amber Shatter Cinema 4D + Photoshop Composite',
          es: 'Obra #3 — Composición Ámbar en Cinema 4D y Photoshop',
        },
      },
    ],
  },
  {
    id: 'goblins-castle',
    title: {
      en: 'Goblins Castle - Gothic Dungeon Action RPG',
      es: 'Goblins Castle - RPG de Acción en Mazmorra Gótica',
    },
    subtitle: {
      en: '64-bit Development Dual-Blade Combat, VFX Slashes & XP Wave Progression',
      es: 'Combate con Doble Katana, VFX de Impacto y Progresión XP en Mazmorra',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Interactive 3D RPG',
      es: 'RPG de Acción 3D',
    },
    theme: 'architectural',
    workClassification: 'personal-rnd',
    year: '2022',
    engine: 'Unreal Engine (PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/Goblins_Castle__64-bit_Development_PCD3D_SM5___2022-10-26_17-21-27_721806ae.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/goblins-castle-thumb.jpg',
    mediaNote: {
      en: 'Direct Unreal Engine 64-bit Development capture (Goblins_Castle 2022-10-26): Dual-blade dungeon combat, emerald AoE slash VFX, XP level-ups, and torchlit prison halls.',
      es: 'Grabación directa en Unreal Engine 64-bit Development (Goblins_Castle 2022-10-26): Combate doble katana, VFX de ondas esmeralda, subida de niveles XP y calabozos iluminados.',
    },
    description: {
      en: 'Atmospheric third-person gothic dungeon action RPG built in Unreal Engine (64-bit PCD3D_SM5). Features agile dual-sword combo combat, emerald circular impact VFX, XP progression HUD ("Exp to level • Kill them all enemies"), enemy encounters across iron-barred prison cells, and dynamic torchlight shadows.',
      es: 'RPG de acción gótico en tercera persona desarrollado en Unreal Engine (64-bit PCD3D_SM5). Incluye combate ágil con dos espadas, efectos de partículas AoE esmeralda, HUD dinámico de experiencia ("Exp to level • Kill them all enemies"), combates en celdas y calabozos con iluminación de antorchas en tiempo real.',
    },
    highlights: {
      en: [
        'Dual-katana melee combo state machine with camera zoom & directional slash traces',
        'Custom Niagara emerald shockwave VFX and dynamic fire/torch point lights',
        'Live XP progression bar and enemy elimination counter HUD ("Kill them all enemies")',
      ],
      es: [
        'Máquina de estados de combate con doble katana, cámara dinámica y trazado de golpes',
        'Efectos visuales de ondas esmeralda en Niagara y luces puntuales de antorchas en SM5',
        'Barra de experiencia en vivo con subida de niveles y contador de eliminación de enemigos',
      ],
    },
    techStack: ['Unreal Engine', 'Niagara VFX', 'Combat Mechanics', 'DirectX SM5', 'Blueprints / C++'],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'Open Video in Google Drive',
      es: 'Abrir Video en Google Drive',
    },
    featured: true,
  },
  {
    id: 'gamejam-devbot',
    title: {
      en: 'DevBot Game Jam - Dungeon Wraith Combat Prototype',
      es: 'DevBot Game Jam - Combate Táctico en Mazmorra (Standalone)',
    },
    subtitle: {
      en: 'NetMode Standalone 64-bit Windows Gameplay & Spectral Boss Encounter',
      es: 'Build NetMode Standalone (64-bit Windows) y Enfrentamiento contra Espectro',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Game Jam Prototype',
      es: 'Game Jam & Prototipado',
    },
    theme: 'indigo',
    workClassification: 'personal-rnd',
    year: '2022',
    engine: 'Unreal Engine (Standalone NetMode)',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/GameJam_DevBot_Preview__NetMode__Standalone____64-bit_Windows___2022-10-13_18-32-24_7aee93f0.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/gamejam-devbot-thumb.jpg',
    mediaNote: {
      en: 'Direct NetMode Standalone 64-bit Windows capture from DEVBOT game jam (GameJam_DevBot 2022-10-13): Stealth assassin navigation, AI spectral wraith fight, and dungeon exploration.',
      es: 'Grabación directa NetMode Standalone 64-bit Windows del Game Jam de DEVBOT (GameJam_DevBot 2022-10-13): Combate con doble espada contra espectro con IA en mazmorra oscura.',
    },
    description: {
      en: 'Fast-paced third-person dungeon combat prototype engineered under game jam time constraints at DEVBOT studio and packaged in NetMode Standalone 64-bit Windows. Showcases agile sword combat against an AI-driven floating spectral wraith, overhead health bars, hit effects, and atmospheric castle corridors.',
      es: 'Prototipo rápido de combate en tercera persona desarrollado bajo tiempo límite en el Game Jam del estudio DEVBOT y empaquetado como NetMode Standalone 64-bit Windows. Muestra combate contra un espectro flotante con IA, barras de salud dinámicas y corredores medievales iluminados con antorchas.',
    },
    highlights: {
      en: [
        'Packaged as NetMode Standalone 64-bit Windows executable within game jam sprint',
        'AI spectral boss enemy with patrol aggro, health bar widget, and death dissolve VFX',
        'Fluid third-person sprinting, combat dodge angles, and high-contrast castle lighting',
      ],
      es: [
        'Empaquetado como ejecutable Standalone de 64 bits dentro del sprint del Game Jam',
        'Espectro enemigo con IA de persecución, barra de vida espacial y efecto de disolución',
        'Locomoción ágil en tercera persona y ambientación lumínica de alto contraste',
      ],
    },
    techStack: ['Unreal Engine', 'DEVBOT Game Jam', 'Standalone NetMode', 'Enemy AI', 'Combat Prototyping'],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'Open Video in Google Drive',
      es: 'Abrir Video en Google Drive',
    },
    featured: true,
  },
  {
    id: 'vistas-del-bosque-archviz',
    title: {
      en: 'Vistas Del Bosque (VDB) - 3D ArchViz & Urban Surroundings Twin',
      es: 'Vistas Del Bosque (VDB) - Gemelo Arquitectónico 3D & Alrededores',
    },
    subtitle: {
      en: 'Interactive Real-Time Sky Solar Slider, 3D Urban POIs & Glowing Highway Splines',
      es: 'Slider Solar Día/Noche en Vivo, POIs Urbanos 3D y Vialidades Luminosas en Unreal',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'ArchViz & Urban Twin 3D',
      es: 'ArchViz & Gemelo Urbano 3D',
    },
    theme: 'emerald',
    workClassification: 'personal-rnd',
    year: '2021',
    engine: 'Unreal Engine (UMG & Sky Atmosphere)',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/VDB__1__7df7a179.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/vistas-del-bosque-thumb.jpg',
    mediaNote: {
      en: 'Direct Unreal Editor capture (VDB.mp4 • Vistas Del Bosque): Real-time 3D tower over Guadalajara/Zapopan skyline featuring glowing expressways (Av. Patria, Av. Acueducto), floating Alrededores POIs, and dynamic day-to-night solar time slider.',
      es: 'Captura directa en Unreal Editor (VDB.mp4 • Vistas Del Bosque): Torre residencial 3D en Guadalajara/Zapopan con trazado luminoso de avenidas (Av. Patria, Av. Acueducto), marcadores flotantes de Alrededores y ciclo solar interactivo día/noche.',
    },
    description: {
      en: 'Interactive 3D architectural visualization and urban context digital twin for Vistas Del Bosque (Zapopan/Guadalajara). Combines floating 3D city Points of Interest (Educación, Compras, Salud, Servicios, Vialidad), glowing arterial road splines, orbital camera navigation, and a real-time Sun/Sky Time-of-Day lighting slider.',
      es: 'Visualización arquitectónica 3D interactiva y gemelo urbano para el desarrollo Vistas Del Bosque (zona Los Colomos / Andares). Integra puntos de interés flotantes por categoría (Educación, Compras, Salud, Servicios, Vialidad), trazados luminosos sobre avenidas principales, control orbital y transición dinámica día-atardecer-noche.',
    },
    highlights: {
      en: [
        'Real-time Sky Atmosphere & Sun Slider scrubbing cleanly from daylight sunset glow into starry night illumination',
        '3D Urban Context Alrededores system mapping Bosque Los Colomos, Andares, The Landmark & main avenues',
        'Five full interactive modules: Master Plan, Amenidades, Disponibilidad, Alrededores & Galería with compass HUD',
      ],
      es: [
        'Control solar dinámico (Sky Atmosphere) con transición suave de día a atardecer y cielo nocturno estrellado',
        'Sistema urbano de Alrededores con POIs 3D georreferenciados (Los Colomos, Andares, Av. Patria, Acueducto)',
        'Cinco módulos interactivos completos (Master Plan, Amenidades, Disponibilidad, Alrededores, Galería) y brújula',
      ],
    },
    techStack: ['Unreal Engine', 'ArchViz Digital Twin', 'UMG Interactive UI', 'Sky Atmosphere', 'Spline VFX'],
    galleryImages: [
      {
        src: '/portfolio_assets/thumbs/vistas-del-bosque-thumb.jpg',
        caption: {
          en: 'Alrededores Urban Context — 3D Floating POIs & Glowing Arterial Splines (Av. Patria / Acueducto)',
          es: 'Modo Alrededores — POIs Flotantes 3D y Vialidades Iluminadas (Av. Patria / Acueducto)',
        },
      },
      {
        src: '/portfolio_assets/thumbs/vistas-del-bosque-sunset.jpg',
        caption: {
          en: 'Real-Time Solar Time Slider (6:56 Sunset) — Dynamic Volumetric Clouds & Tower Lighting',
          es: 'Slider Solar en Tiempo Real (6:56 Atardecer) — Nubes Volumétricas e Iluminación de Torre',
        },
      },
    ],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'Open Video in Google Drive',
      es: 'Abrir Video en Google Drive',
    },
    featured: true,
  },
  {
    id: 'procedural-world-gen',
    title: {
      en: 'IWG Studios - Epic Medieval Castle & Open-World Landscape',
      es: 'IWG Studios - Castillo Medieval y Paisajes Épicos Open-World',
    },
    subtitle: {
      en: 'Third-Person Action RPG Traversal, Quest HUD, Compass & Alpine Biomes',
      es: 'Exploración RPG en Tercera Persona, HUD de Misiones, Brújula y Biomas Alpinos',
    },
    category: 'virtual-env',
    categoryLabel: {
      en: 'Open-World Landscape 3D',
      es: 'Paisajes & RPG Open-World',
    },
    theme: 'emerald',
    workClassification: 'personal-rnd',
    year: '2020',
    engine: 'Unreal Engine 4 (IWG Studios)',
    mediaType: 'video',
    mediaSrc: '/assets/aistudio/landscape_977261be.mp4',
    thumbnailSrc: '/portfolio_assets/thumbs/landscape-iwg-thumb.jpg',
    mediaNote: {
      en: 'Direct Unreal Engine 60 FPS capture (landscape.mp4 • IWG Studios): Custom Unreal shatter intro, stone fortress courtyard, Misiones quest tracker, compass HUD, and rolling alpine meadows.',
      es: 'Captura directa a 60 FPS en Unreal Engine (landscape.mp4 • IWG Studios): Intro personalizada de cristal fracturado, patio medieval de piedra, panel de Misiones, brújula y valles alpinos.',
    },
    description: {
      en: 'Original third-person medieval action RPG prototype ("IWG Studios • Paisajes Épicos y Aventuras Épicas") built in Unreal Engine at 60 FPS. Opens with a custom gold-lit fractured Unreal logo cinematic before transitioning into seamless traversal from dungeon corridors out through fortress gates into sunlit pine and wildflower mountain landscapes.',
      es: 'Prototipo original de RPG medieval en tercera persona ("IWG Studios • Paisajes Épicos y Aventuras Épicas") construido en Unreal Engine a 60 FPS. Inicia con una intro cinemática personalizada del emblema de Unreal y transiciona sin cortes desde calabozos y murallas del castillo hasta extensos valles alpinos con pinos, flores silvestres y brújula en vivo.',
    },
    highlights: {
      en: [
        'Custom gold-fracture particle & audio intro sequence for IWG Studios branding',
        'Live UMG Quest HUD ("Misiones"), directional compass ribbon, health/XP bars & dodge roll traversal',
        'Lush outdoor landscape blending cobblestone fortresses, grass wind shaders, wildflowers & distant peaks',
      ],
      es: [
        'Intro cinemática personalizada con fractura metálica dorada para IWG Studios',
        'HUD de Misiones en UMG, brújula direccional superior, barras de vida/XP y animación de esquive/rodada',
        'Entorno exterior amplio que integra murallas de piedra, pastizales con viento, flores y montañas',
      ],
    },
    techStack: ['Unreal Engine', 'Landscape & Foliage', 'UMG Quest HUD', 'Locomotion BlendSpace', 'Cinematics'],
    galleryImages: [
      {
        src: '/portfolio_assets/thumbs/landscape-iwg-thumb.jpg',
        caption: {
          en: 'Outside the Castle Walls — Quest Tracker ("Misiones"), Compass HUD & Alpine Landscape',
          es: 'Exteriores de la Fortaleza — Panel de Misiones, Brújula HUD y Paisajes Alpinos',
        },
      },
    ],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: {
      en: 'Open Video in Google Drive',
      es: 'Abrir Video en Google Drive',
    },
  },
];

interface PortfolioViewProps {
  language?: 'es' | 'en';
  onSwitchToCv: () => void;
  onSwitchToAbout: () => void;
  onSwitchToGame?: () => void;
  onSwitchToFishFeeder?: () => void;
}

export function PortfolioView({
  language = 'es',
  onSwitchToCv,
  onSwitchToAbout,
  onSwitchToGame,
  onSwitchToFishFeeder,
}: PortfolioViewProps) {
  const isEn = language === 'en';
  const resolvePopupSrc = (src: string) =>
    isEn ? src.replace('_es.png', '_en.png') : src.replace('_en.png', '_es.png');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredGame, setFeaturedGame] = useState<'conveyor' | 'fish'>('conveyor');
  const [featuredMediaTab, setFeaturedMediaTab] = useState<'video' | 'thumb' | 'popup'>('video');
  const [featuredMuted, setFeaturedMuted] = useState<boolean>(true);
  const [selectedBiomeIndex, setSelectedBiomeIndex] = useState<number>(0);

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [modalViewMode, setModalViewMode] = useState<'primary' | 'gallery'>('primary');
  const [modalVideoSource, setModalVideoSource] = useState<'youtube' | 'local'>('youtube');
  const [selectedArtIndex, setSelectedArtIndex] = useState<number>(0);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});
  const [modalVideoError, setModalVideoError] = useState<boolean>(false);

  const openProjectModal = (
    project: ProjectItem,
    initialMode: 'primary' | 'gallery' = 'primary',
    initialArtIdx = 0
  ) => {
    setModalVideoError(false);
    setModalViewMode(initialMode);
    setModalVideoSource(project.mediaSrc ? 'local' : 'youtube');
    setSelectedArtIndex(initialArtIdx);
    setActiveModalProject(project);
  };

  useEffect(() => {
    if (!activeModalProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalProject]);

  const categories = [
    {
      id: 'all',
      label: isEn ? 'All Works' : 'Todos los Trabajos',
      icon: Layers,
    },
    {
      id: 'playable-games',
      label: isEn ? 'Playable 3D Games' : 'Juegos 3D Jugables',
      icon: Gamepad2,
    },
    {
      id: 'aaa-studio',
      label: isEn ? 'AAA Studio (NDA)' : 'Estudio AAA (NDA)',
      icon: Trophy,
    },
    {
      id: 'simulation',
      label: isEn ? 'Digital Twins & SaaS' : 'Gemelos Digitales & SaaS',
      icon: Boxes,
    },
    {
      id: 'virtual-env',
      label: isEn ? 'Unreal & 3D Worlds' : 'Entornos & Unreal 3D',
      icon: Compass,
    },
    {
      id: 'art',
      label: isEn ? 'Concept Art' : 'Arte Conceptual',
      icon: Palette,
    },
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'aaa-studio') return p.workClassification === 'aaa-studio';
    return p.category === selectedCategory;
  });

  const isFeaturedFish = featuredGame === 'fish';
  const featuredProjectId = isFeaturedFish ? 'fish-feeder-3d' : 'tile-absorber-3d';
  const featuredVideoSrc = isFeaturedFish
    ? '/assets/aistudio/Fish_feeder_6c148142.mp4'
    : '/assets/aistudio/tile_absorber_64df8e71.mp4';
  const featuredPosterSrc = isFeaturedFish
    ? '/portfolio_assets/thumbs/fish-feeder-gameplay.jpg'
    : '/portfolio_assets/thumbs/tile-absorber-gameplay.jpg';
  const featuredThumbSrc = isFeaturedFish
    ? '/assets/aistudio/image_d3be3235.png'
    : realGameScreenshot;
  const featuredPopupSrc = isFeaturedFish
    ? isEn
      ? '/assets/popups/fof_win_en.png'
      : '/assets/popups/fof_win_es.png'
    : isEn
    ? '/assets/popups/conveyor_win_en.png'
    : '/assets/popups/conveyor_win_es.png';

  const modalTheme = activeModalProject ? THEME_PALETTES[activeModalProject.theme] : THEME_PALETTES.cyber;

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
                <span>{isEn ? 'Play Conveyor Realms' : 'Jugar Conveyor Realms'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {onSwitchToFishFeeder && (
              <button
                type="button"
                onClick={onSwitchToFishFeeder}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold transition-all hover:scale-[1.02] shadow-sm shadow-teal-950/40"
              >
                <Fish className="w-4 h-4 text-emerald-200" />
                <span>{isEn ? 'Play Fish Feeder' : 'Jugar Fish Feeder'}</span>
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
                  <span className="text-amber-300 font-semibold">AAA Studio & Client Projects (EA Sports / DEVBOT / Flex):</span> Protected by corporate NDAs. Shipped console systems are demonstrated through authorized official broadcasts and verified MobyGames credits.
                  <br />
                  <span className="text-sky-300 font-semibold">Direct Captures & Live 3D Games:</span> Gameplay recordings, Unreal Engine viewports, and browser-playable 3D titles showcase Isaac&apos;s own engineering and technical art pipelines.
                </>
              ) : (
                <>
                  <span className="text-amber-300 font-semibold">Títulos AAA y Proyectos de Estudio (EA Sports / DEVBOT / Flex):</span> Protegidos por acuerdos de confidencialidad (NDA). Los sistemas lanzados se demuestran con transmisiones oficiales autorizadas y créditos verificados en MobyGames.
                  <br />
                  <span className="text-sky-300 font-semibold">Capturas Directas y Juegos 3D Propios:</span> Los videos de gameplay, simulaciones en Unreal Engine y versiones 3D jugables en navegador corresponden al desarrollo e I+D técnico directo de Isaac.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* DEDICATED DUAL-EDITION SHOWCASE SECTION: Conveyor Realms & Fish Feeder */}
      <section
        className={`relative overflow-hidden rounded-3xl text-white border-2 p-6 sm:p-8 md:p-10 shadow-2xl transition-colors duration-500 ${
          isFeaturedFish
            ? 'bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-950 border-teal-400/40'
            : 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-cyan-500/35'
        }`}
      >
        {/* Glowing atmospheric backdrop */}
        <div
          className={`absolute top-0 right-1/4 -mt-16 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isFeaturedFish ? 'bg-teal-400/15' : 'bg-cyan-500/10'
          }`}
        />
        <div
          className={`absolute bottom-0 right-0 -mb-16 -mr-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            isFeaturedFish ? 'bg-emerald-500/15' : 'bg-indigo-500/15'
          }`}
        />

        <div className="relative z-10 space-y-8">
          {/* Edition Selector Bar + Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-white/10 pb-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                    isFeaturedFish
                      ? 'bg-teal-500/20 border-teal-400/40 text-teal-200'
                      : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                  }`}
                >
                  {isFeaturedFish ? (
                    <Fish className="w-4 h-4 text-teal-300" />
                  ) : (
                    <Gamepad2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  )}
                  <span>
                    {isEn
                      ? 'Featured 3D Engine • Dual Playable Editions'
                      : 'Showcase Estelar • Ediciones 3D Jugables'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <span className="text-white/80 font-mono text-[10px]">Three.js / WebGL</span>
                </div>

                {/* Version Switcher Buttons */}
                <div className="inline-flex items-center rounded-xl bg-slate-900/90 border border-white/15 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedGame('conveyor');
                      setFeaturedMediaTab('video');
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      !isFeaturedFish
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Conveyor Realms</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedGame('fish');
                      setFeaturedMediaTab('video');
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isFeaturedFish
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Fish className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Fish Feeder (Aquatic)' : 'Fish Feeder (Acuático)'}</span>
                  </button>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
                <span>
                  {isFeaturedFish
                    ? 'Fish Feeder (Aquatic 3D Pearl Edition)'
                    : 'Conveyor Realms (Tile Absorber 3D)'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono">
                  {isEn ? '100% Playable in Browser' : '100% Jugable en Navegador'}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isFeaturedFish
                  ? isEn
                    ? 'Aquatic Coral Reef edition powered by the same custom Three.js conveyor engine: swimming 3D fish runners, iridescent pearls, water tracks, explosive pearl wildcards, and bespoke coastal Victory & Game Over pop-ups.'
                    : 'Edición acuática Coral Reef sobre el motor Conveyor Three.js: peces 3D animados nadando en pista marina, perlas iridiscentes especiales, comodines oceánicos y pop-ups temáticos de Victoria y Derrota.'
                  : isEn
                  ? 'An original 3D spatial puzzle-action game designed, architected, and coded from scratch by Isaac Gómez Estrada. Combines 60 FPS Three.js WebGL graphics, orthogonal conveyor loops, queue state machines, an evolving 3-tier wildcard economy, and Supabase cloud leaderboards.'
                  : 'Videojuego original de puzzle-acción espacial en 3D diseñado y programado desde cero por Isaac Gómez Estrada. Combina WebGL en Three.js a 60 FPS, bandas transportadoras ortogonales, comodines tácticos en 3 tiers y récords en la nube con Supabase.'}
              </p>
            </div>

            {/* Quick Play CTAs */}
            <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
              {onSwitchToGame && (
                <button
                  type="button"
                  onClick={onSwitchToGame}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${
                    !isFeaturedFish
                      ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 shadow-cyan-950/60'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-white/15'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'Play Conveyor Realms' : 'Jugar Conveyor Realms'}</span>
                </button>
              )}
              {onSwitchToFishFeeder && (
                <button
                  type="button"
                  onClick={onSwitchToFishFeeder}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${
                    isFeaturedFish
                      ? 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 shadow-teal-950/60'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                  }`}
                >
                  <Fish className="w-4 h-4" />
                  <span>{isEn ? 'Play Fish Feeder' : 'Jugar Fish Feeder'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Video + Media Selector + Quick Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              {/* Main 16:9 Stage (Live Video / Key Art Thumbnail / Pop-Up Artwork) */}
              <div
                className={`relative aspect-video rounded-2xl overflow-hidden border-2 shadow-2xl bg-slate-950 ${
                  isFeaturedFish ? 'border-teal-400/45' : 'border-cyan-500/40'
                }`}
              >
                {featuredMediaTab === 'video' ? (
                  <>
                    <video
                      key={featuredVideoSrc}
                      src={featuredVideoSrc}
                      poster={featuredPosterSrc}
                      autoPlay
                      loop
                      muted={featuredMuted}
                      playsInline
                      controls
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedMuted((m) => !m)}
                      className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white text-[11px] font-semibold border border-white/20 backdrop-blur-md transition-colors"
                    >
                      {featuredMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-300" />}
                      <span>{featuredMuted ? (isEn ? 'Muted' : 'Sin audio') : (isEn ? 'Audio On' : 'Con audio')}</span>
                    </button>
                  </>
                ) : featuredMediaTab === 'thumb' ? (
                  <img
                    src={featuredThumbSrc}
                    alt={isFeaturedFish ? 'Fish Feeder Key Art' : 'Conveyor Realms Screenshot'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={featuredPopupSrc}
                    alt={isFeaturedFish ? 'Fish Feeder Victory Pop-Up' : 'Conveyor Realms Victory Pop-Up'}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Top Left Status Pill */}
                <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
                  <span
                    className={`text-[11px] font-mono font-bold bg-slate-950/85 px-3 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 ${
                      isFeaturedFish ? 'text-teal-300 border-teal-400/40' : 'text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>
                      {isFeaturedFish
                        ? isEn
                          ? 'Fish Feeder • 1080p Gameplay'
                          : 'Fish Feeder • Gameplay 1080p'
                        : isEn
                        ? 'Conveyor Realms • 1080p Gameplay'
                        : 'Conveyor Realms • Gameplay 1080p'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Media Switcher Strip: Video / Miniatura / Pop-Up */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFeaturedMediaTab('video')}
                  className={`group flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    featuredMediaTab === 'video'
                      ? isFeaturedFish
                        ? 'bg-teal-500/20 border-teal-400 text-white'
                        : 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={featuredPosterSrc}
                    alt={isEn ? 'Video preview' : 'Vista previa de video'}
                    className="w-12 h-8 rounded object-cover shrink-0 border border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">{isEn ? 'Gameplay Video' : 'Video Gameplay'}</p>
                    <p className="text-[10px] text-slate-400 truncate">1080p MP4</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFeaturedMediaTab('thumb')}
                  className={`group flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    featuredMediaTab === 'thumb'
                      ? isFeaturedFish
                        ? 'bg-teal-500/20 border-teal-400 text-white'
                        : 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={featuredThumbSrc}
                    alt={isEn ? 'Thumbnail key art' : 'Miniatura arte clave'}
                    className="w-12 h-8 rounded object-cover shrink-0 border border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">{isEn ? 'Key Art / HUD' : 'Miniatura / HUD'}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {isFeaturedFish ? (isEn ? 'Coral Banner' : 'Banner Coral') : isEn ? 'Cyber Frontier' : 'Frontera Cyber'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFeaturedMediaTab('popup')}
                  className={`group flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    featuredMediaTab === 'popup'
                      ? isFeaturedFish
                        ? 'bg-teal-500/20 border-teal-400 text-white'
                        : 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={featuredPopupSrc}
                    alt={isEn ? 'Victory popup artwork' : 'Arte pop-up de victoria'}
                    className="w-12 h-8 rounded object-cover shrink-0 border border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">{isEn ? 'Game Pop-Ups' : 'Pop-Ups UI'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{isEn ? 'Win / Defeat' : 'Victoria / Derrota'}</p>
                  </div>
                </button>
              </div>

              {/* Sub-strip metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Engine' : 'Motor'}</p>
                  <p className="text-white font-bold font-mono mt-0.5">Three.js / WebGL</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Wildcards' : 'Comodines'}</p>
                  <p className="text-amber-300 font-bold font-mono mt-0.5">{isEn ? '9 (3 Tiers)' : '9 (3 Niveles)'}</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Health Pool' : 'Vidas'}</p>
                  <p className="text-rose-400 font-bold font-mono mt-0.5">
                    {isEn ? '5 Hearts + Regen' : '5 Corazones + Regen'}
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{isEn ? 'Cloud Data' : 'Persistencia'}</p>
                  <p className="text-cyan-300 font-bold font-mono mt-0.5">Supabase SQL</p>
                </div>
              </div>
            </div>

            {/* Right Column: Architecture + World Themes Strip + Modal Trigger */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className={`w-4 h-4 ${isFeaturedFish ? 'text-teal-300' : 'text-cyan-400'}`} />
                  <span>{isEn ? 'Architecture & Technical Innovation' : 'Arquitectura e Innovación Técnica'}</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? (
                    <>
                      Built without heavy monolithic frameworks for instant load times and zero input latency.
                      The custom render loop coordinates instanced geometry, procedural biome shaders, orbital conveyor physics,
                      and React 19 UI pop-ups & modals synchronized with Supabase cloud scores.
                    </>
                  ) : (
                    <>
                      Construido sin frameworks monolíticos pesados para lograr carga inmediata y cero latencia de entrada.
                      El render loop coordina geometría instanciada, shaders de biomas, física orbital de cintas/peces y
                      pop-ups interactivos en React 19 sincronizados con Supabase.
                    </>
                  )}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Three.js', 'WebGL', 'TypeScript', 'React 19', 'Web Audio API', 'Supabase Realtime', 'Tailwind CSS'].map((tech, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-semibold bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/80 ${
                        isFeaturedFish ? 'text-teal-200' : 'text-cyan-200'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* World Biomes & Visual Themes Preview Grid */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'World Themes & Biomes (Procedural)' : 'Temas y Biomas de Mundo (Procedurales)'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {WORLD_THEMES[selectedBiomeIndex].name}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {WORLD_THEMES.map((biome, idx) => {
                    const active = selectedBiomeIndex === idx;
                    return (
                      <button
                        key={biome.id}
                        type="button"
                        onClick={() => {
                          setSelectedBiomeIndex(idx);
                          setFeaturedGame(biome.game);
                        }}
                        className={`group relative aspect-video rounded-lg overflow-hidden border transition-all ${
                          active
                            ? 'border-amber-400 ring-2 ring-amber-400/40 scale-[1.03]'
                            : 'border-slate-700 hover:border-slate-500 opacity-85 hover:opacity-100'
                        }`}
                        title={`${biome.name} (${isEn ? biome.tag : biome.tagEs})`}
                      >
                        <img src={biome.src} alt={biome.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-1">
                          <span className="text-[9px] font-bold text-white leading-tight truncate w-full text-left">
                            {biome.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                {isFeaturedFish && onSwitchToFishFeeder ? (
                  <button
                    type="button"
                    onClick={onSwitchToFishFeeder}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all"
                  >
                    <Fish className="w-4 h-4 text-slate-950" />
                    <span>{isEn ? 'Launch Fish Feeder 3D' : 'Lanzar Fish Feeder 3D'}</span>
                  </button>
                ) : onSwitchToGame ? (
                  <button
                    type="button"
                    onClick={onSwitchToGame}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all"
                  >
                    <Gamepad2 className="w-4 h-4 text-slate-950" />
                    <span>{isEn ? 'Launch Conveyor Realms' : 'Lanzar Conveyor Realms'}</span>
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    const target = PORTFOLIO_PROJECTS.find((p) => p.id === featuredProjectId);
                    if (target) openProjectModal(target, 'gallery', 4);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <Images className="w-4 h-4" />
                  <span>{isEn ? 'Pop-Ups & Thumbs' : 'Pop-Ups y Galería'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = PORTFOLIO_PROJECTS.find((p) => p.id === featuredProjectId);
                    if (target) openProjectModal(target, 'primary', 0);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>{isEn ? 'Full Specs' : 'Ficha Completa'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* THREE TECHNICAL PILLARS: Mechanics, XP Progression, Life/Death */}
          <div className="space-y-4 pt-4 border-t border-white/10">
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
                  ? 'Gameplay systems shared across Conveyor Realms and Fish Feeder to balance arcade accessibility with tactical strategy.'
                  : 'Sistemas compartidos entre Conveyor Realms y Fish Feeder para equilibrar accesibilidad arcade con estrategia táctica.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
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
                        <strong className="text-cyan-300 font-semibold">{isEn ? '3D Runners & Swimming Fish:' : 'Runners 3D & Peces Animados:'}</strong>{' '}
                        {isEn
                          ? 'Autonomous entities travel synchronized perimeter loops around floating boards.'
                          : 'Entidades autónomas que recorren pistas perimetrales sincronizadas alrededor del tablero.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-cyan-300 font-semibold">{isEn ? 'Perimeter Exposure Logic:' : 'Algoritmo de Exposición Perimetral:'}</strong>{' '}
                        {isEn
                          ? 'Only unblocked outer-edge tiles/pearls can be absorbed, forcing sequential peeling.'
                          : 'Solo baldosas o perlas sin bloqueo frontal pueden absorberse, exigiendo planeación.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-cyan-300 font-semibold">{isEn ? '3-Tier Tactical Wildcards:' : 'Comodines en 3 Tiers:'}</strong>{' '}
                        {isEn
                          ? 'Evolving wildcards and special explosive bombs/pearls with strict 1-use tactical trade-offs.'
                          : 'Comodines evolutivos y tiles/perlas explosivas especiales con equilibrio táctico de riesgo.'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-cyan-300/80 font-mono">
                  Three.js Matrix Transforms • Raycasting
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-2xl bg-slate-900/90 border border-amber-500/30 p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-amber-400/60 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isEn ? '2. Experience (XP) & Cloud Leaderboards' : '2. Sistema de Experiencia (XP) & Nube'}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? 'Streak Bonus Multipliers:' : 'Multiplicadores de Racha:'}</strong>{' '}
                        {isEn
                          ? 'Consecutive absorptions scale combo multipliers up to 5x XP.'
                          : 'Absorciones consecutivas acumulan multiplicadores dinámicos de hasta 5x XP.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? 'Automatic Level-Pass Save:' : 'Autoguardado Instantáneo:'}</strong>{' '}
                        {isEn
                          ? 'Zero manual save buttons; progression persists locally while highscores sync to Supabase.'
                          : 'Cero botones de guardado; la frontera y estrellas se guardan al instante junto al récord en Supabase.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-amber-300 font-semibold">{isEn ? '3-Star Mastery Pop-Ups:' : 'Pop-Ups de 3 Estrellas:'}</strong>{' '}
                        {isEn
                          ? 'Dedicated illustrated Victory and Loss pop-ups tailored per edition.'
                          : 'Pop-ups dedicados con estrellas alineadas para Victoria y Derrota en cada edición.'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-amber-300/80 font-mono">
                  Dynamic Scoring • Supabase SQL Sync
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-2xl bg-slate-900/90 border border-rose-500/30 p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-rose-400/60 transition-colors">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isEn ? '3. Life & Death System (Health & Stakes)' : '3. Sistema de Vida y Muerte (Health & Stakes)'}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-rose-300 font-semibold">{isEn ? 'Queue Saturation Penalty:' : 'Daño por Saturación de Cola:'}</strong>{' '}
                        {isEn
                          ? 'Overflowing the 5-slot buffer triggers critical loss and sad black tile / pearl states.'
                          : 'Desbordar la cola de 5 ranuras provoca derrota y muestra los pop-ups de fichas/peces perdidos.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-rose-300 font-semibold">{isEn ? '20-Min Background Regen:' : 'Regeneración Asíncrona:'}</strong>{' '}
                        {isEn
                          ? 'Real-time clock restores hearts automatically via localStorage timestamps.'
                          : 'Reloj en segundo plano que regenera corazones automáticamente por timestamp.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-rose-300 font-semibold">{isEn ? 'Landscape Mobile Rewarded Ads:' : 'Anuncios Landscape In-Game:'}</strong>{' '}
                        {isEn
                          ? 'Interactive widescreen smartphone frame previews with version-specific gameplay videos.'
                          : 'Preview en teléfono horizontal (landscape) con video propio para Fish Feeder y Tile Absorber.'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-rose-300/80 font-mono">
                  Async Life Timer • Landscape Ad Preview
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
            <>
              Showing <strong>{filteredProjects.length}</strong> project showcases
            </>
          ) : (
            <>
              Mostrando <strong>{filteredProjects.length}</strong> proyectos
            </>
          )}
        </span>
      </div>

      {/* Showcases Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const title = project.title[language] || project.title.en;
          const categoryLabel = project.categoryLabel[language] || project.categoryLabel.en;
          const description = project.description[language] || project.description.en;
          const palette = THEME_PALETTES[project.theme];

          const isAaa = project.workClassification === 'aaa-studio';
          const isPersonalRnd = project.workClassification === 'personal-rnd';
          const isEnterprise = project.workClassification === 'enterprise-client';
          const isProprietary = project.workClassification === 'proprietary-platform';

          const badgeLabel = isAaa
            ? isEn
              ? 'AAA Studio (NDA)'
              : 'Estudio AAA (NDA)'
            : isPersonalRnd
            ? isEn
              ? 'Personal R&D'
              : 'I+D Personal'
            : isProprietary
            ? isEn
              ? 'Proprietary SaaS'
              : 'Plataforma Propia'
            : isEn
            ? 'Enterprise (NDA)'
            : 'Corporativo (NDA)';

          const mediaBadgeText =
            project.youtubeId && project.mediaSrc
              ? isEn
                ? 'HD Video + Broadcast'
                : 'Video + Oficial'
              : project.youtubeId
              ? isEn
                ? 'Official Broadcast'
                : 'Transmisión Oficial'
            : isProprietary
            ? isEn
              ? 'Live SaaS'
              : 'SaaS en Vivo'
            : project.mediaType === 'video' && project.mediaSrc
            ? isEn
              ? 'HD Video Capture'
              : 'Video Directo'
            : project.mediaType === 'image'
            ? isEn
              ? 'Gallery & Art'
              : 'Galería Visual'
            : isEn
            ? 'Drive Archive'
            : 'Archivo Drive';

          const isHovered = hoveredCardId === project.id;
          const hasPlayableLocalVideo = project.mediaType === 'video' && Boolean(project.mediaSrc) && !videoErrors[project.id];
          const hasGallery = Boolean(project.galleryImages && project.galleryImages.length > 0);

          return (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredCardId(project.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={`group bg-white rounded-2xl border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${palette.cardBorder}`}
            >
              {/* Themed top accent bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${palette.cardAccentTop}`} />

              {/* Project Media Thumbnail & Hover Video Preview */}
              <div
                className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => openProjectModal(project, 'primary', 0)}
              >
                {project.mediaType === 'video' && (project.mediaSrc || project.youtubeId) ? (
                  <div className="w-full h-full relative bg-slate-950">
                    {/* Always-crisp thumbnail layer */}
                    {project.thumbnailSrc && (
                      <img
                        src={project.thumbnailSrc}
                        alt={title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          hasPlayableLocalVideo && isHovered ? 'opacity-0' : 'opacity-90 group-hover:opacity-100'
                        }`}
                        onError={(e) => {
                          if (project.youtubeId && !e.currentTarget.src.includes('hqdefault')) {
                            e.currentTarget.src = `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`;
                          }
                        }}
                      />
                    )}

                    {/* Hover auto-playing preview for local MP4s */}
                    {hasPlayableLocalVideo && (isHovered || !project.thumbnailSrc) && (
                      <video
                        src={project.mediaSrc}
                        poster={project.thumbnailSrc}
                        autoPlay
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        onError={() => setVideoErrors((prev) => ({ ...prev, [project.id]: true }))}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}

                    {/* Center Play Button Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className={`w-12 h-12 rounded-full text-slate-950 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110 ${palette.badgeBg}`}
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>
                ) : project.mediaType === 'image' && (project.mediaSrc || project.thumbnailSrc) ? (
                  <div className="w-full h-full relative bg-slate-950 overflow-hidden">
                    <img
                      src={project.mediaSrc || project.thumbnailSrc}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className={`w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-lg ${palette.badgeBg}`}>
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-bold text-sm line-clamp-1">{title}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{project.engine}</p>
                    <span className="mt-2.5 text-[11px] font-semibold text-sky-300 underline decoration-sky-400">
                      {isEn ? 'Explore Specs & Drive Link' : 'Explorar Ficha y Enlace Drive'}
                    </span>
                  </div>
                )}

                {/* Top-Left Media Badge */}
                <div
                  className={`absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow ${palette.badgeBg}`}
                >
                  {isAaa && <Trophy className="w-3 h-3" />}
                  {isPersonalRnd && !isAaa && (project.id === 'fish-feeder-3d' ? <Fish className="w-3 h-3" /> : <Monitor className="w-3 h-3" />)}
                  {isProprietary && <Globe className="w-3 h-3" />}
                  {isEnterprise && <Building2 className="w-3 h-3" />}
                  <span>{mediaBadgeText}</span>
                </div>

                {/* Top-Right Engine Pill */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="text-[10px] font-bold text-white bg-slate-900/90 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-700/80">
                    {project.engine}
                  </span>
                </div>

                {/* Bottom Strip: Theme Label + Gallery / Pop-Ups Count */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="text-[10px] font-semibold text-white/95 bg-slate-900/85 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 border border-white/10">
                    <Palette className="w-3 h-3 text-sky-300" />
                    <span>{palette.label[language] || palette.label.en}</span>
                  </span>

                  {hasGallery && (
                    <span className="text-[10px] font-bold text-amber-200 bg-slate-900/85 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 border border-amber-400/30">
                      <Images className="w-3 h-3" />
                      <span>
                        {project.galleryImages!.length} {isEn ? 'Visuals' : 'Miniaturas'}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Project Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${palette.pillText}`}>{categoryLabel}</span>
                      <span className="text-slate-300">•</span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${palette.badgeText}`}>
                        {isAaa && <ShieldCheck className="w-2.5 h-2.5" />}
                        {isPersonalRnd && <Monitor className="w-2.5 h-2.5" />}
                        {isEnterprise && <Building2 className="w-2.5 h-2.5" />}
                        {isProprietary && <Globe className="w-2.5 h-2.5" />}
                        <span>{badgeLabel}</span>
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{project.year}</span>
                  </div>

                  <h3
                    onClick={() => openProjectModal(project, 'primary', 0)}
                    className={`text-base font-bold text-slate-900 transition-colors cursor-pointer leading-snug ${palette.ctaText}`}
                  >
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{description}</p>

                  {/* Mini Clickable Thumbnail Strip inside Card when Gallery Exists */}
                  {hasGallery && (
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                      {project.galleryImages!.slice(0, 4).map((g, gIdx) => (
                        <button
                          key={gIdx}
                          type="button"
                          onClick={() => openProjectModal(project, 'gallery', gIdx)}
                          className="relative w-12 h-8 rounded-md overflow-hidden border border-slate-200 hover:border-sky-500 shrink-0 transition-transform hover:scale-105"
                          title={g.caption?.[language] || g.caption?.en || `${isEn ? 'Thumbnail' : 'Miniatura'} ${gIdx + 1}`}
                        >
                          <img
                            src={resolvePopupSrc(g.src)}
                            alt={`${isEn ? 'Thumbnail' : 'Miniatura'} ${gIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      {project.galleryImages!.length > 4 && (
                        <button
                          type="button"
                          onClick={() => openProjectModal(project, 'gallery', 4)}
                          className="h-8 px-2 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 shrink-0 border border-slate-200"
                        >
                          +{project.galleryImages!.length - 4}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Tech Stack & Footer Links */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${palette.pillBg}`}>
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
                      onClick={() => openProjectModal(project, 'primary', 0)}
                      className={`text-xs font-bold flex items-center gap-1 transition-colors ${palette.ctaText}`}
                    >
                      <span>{isEn ? 'Open Pop-Up Showcase' : 'Abrir Showcase & Video'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.id === 'tile-absorber-3d' && onSwitchToGame && (
                        <button
                          type="button"
                          onClick={onSwitchToGame}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 transition-colors"
                        >
                          {isEn ? 'Play' : 'Jugar'}
                        </button>
                      )}
                      {project.id === 'fish-feeder-3d' && onSwitchToFishFeeder && (
                        <button
                          type="button"
                          onClick={onSwitchToFishFeeder}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors"
                        >
                          {isEn ? 'Play' : 'Jugar'}
                        </button>
                      )}
                      {project.externalUrl && (
                        <a
                          href={project.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                        >
                          <span>{isEn ? 'Link' : 'Enlace'}</span>
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

      {/* Media Detail Pop-Up Modal */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveModalProject(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Themed Modal Header */}
            <div className={`px-5 py-3.5 text-white flex items-center justify-between ${modalTheme.modalHeader}`}>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="text-xs font-semibold text-white/90 bg-white/10 border border-white/20 px-2 py-0.5 rounded">
                  {activeModalProject.engine}
                </span>
                <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${modalTheme.badgeBg}`}>
                  {activeModalProject.workClassification === 'aaa-studio' && <Trophy className="w-3 h-3" />}
                  {activeModalProject.workClassification === 'personal-rnd' && <Monitor className="w-3 h-3" />}
                  {activeModalProject.workClassification === 'enterprise-client' && <Building2 className="w-3 h-3" />}
                  {activeModalProject.workClassification === 'proprietary-platform' && <Globe className="w-3 h-3" />}
                  <span>{modalTheme.label[language] || modalTheme.label.en}</span>
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                  {activeModalProject.title[language] || activeModalProject.title.en}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label={isEn ? 'Close modal' : 'Cerrar modal'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Media Attribution Banner */}
              {activeModalProject.mediaNote && (
                <div className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${modalTheme.modalBanner}`}>
                  <div className={`p-1.5 rounded-lg shrink-0 ${modalTheme.modalIconBg}`}>
                    {activeModalProject.workClassification === 'aaa-studio' ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : activeModalProject.workClassification === 'enterprise-client' ? (
                      <Building2 className="w-4 h-4" />
                    ) : activeModalProject.workClassification === 'proprietary-platform' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <Monitor className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold block">
                      {activeModalProject.workClassification === 'aaa-studio'
                        ? isEn
                          ? 'Studio NDA & Official Verification Disclosure'
                          : 'Aviso de Confidencialidad (NDA) de Estudio y Verificación'
                        : activeModalProject.workClassification === 'enterprise-client'
                        ? isEn
                          ? 'Enterprise Client Confidentiality Notice'
                          : 'Aviso de Confidencialidad Corporativa'
                        : activeModalProject.workClassification === 'proprietary-platform'
                        ? isEn
                          ? 'Proprietary Production Platform (orb-lite.com)'
                          : 'Plataforma Comercial Propia (orb-lite.com)'
                        : isEn
                        ? "Isaac Gómez's Direct Capture & Technical R&D"
                        : 'Captura Directa e I+D Técnico de Isaac Gómez'}
                    </span>
                    <p className="opacity-90">
                      {activeModalProject.mediaNote[language] || activeModalProject.mediaNote.en}
                    </p>
                  </div>
                </div>
              )}

              {/* Mode Switcher inside Pop-Up when project has BOTH video and galleryImages */}
              {activeModalProject.mediaType === 'video' &&
                activeModalProject.galleryImages &&
                activeModalProject.galleryImages.length > 0 && (
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setModalViewMode('primary')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          modalViewMode === 'primary'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Video Player' : 'Reproductor de Video'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalViewMode('gallery')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          modalViewMode === 'gallery'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Images className="w-3.5 h-3.5" />
                        <span>
                          {isEn
                            ? `Thumbnails & Pop-Ups (${activeModalProject.galleryImages.length})`
                            : `Miniaturas y Pop-Ups (${activeModalProject.galleryImages.length})`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

              {/* Primary Stage: Gallery Viewer OR Video Player OR Image */}
              {modalViewMode === 'gallery' &&
              activeModalProject.galleryImages &&
              activeModalProject.galleryImages.length > 0 ? (
                <div className="w-full bg-slate-950 rounded-xl overflow-hidden p-3 sm:p-5 space-y-4">
                  <div className="w-full flex flex-col items-center space-y-2">
                    <img
                      src={resolvePopupSrc(
                        (activeModalProject.galleryImages[selectedArtIndex] ||
                          activeModalProject.galleryImages[0]).src
                      )}
                      alt={`${isEn ? 'Gallery' : 'Galería'} ${selectedArtIndex + 1}`}
                      className="w-full max-h-[480px] object-contain rounded-lg border border-slate-800 shadow-2xl"
                    />
                    {(activeModalProject.galleryImages[selectedArtIndex] ||
                      activeModalProject.galleryImages[0]).caption && (
                      <p className="text-xs text-slate-300 text-center pt-1">
                        {
                          (
                            activeModalProject.galleryImages[selectedArtIndex] ||
                            activeModalProject.galleryImages[0]
                          ).caption![language] ||
                          (
                            activeModalProject.galleryImages[selectedArtIndex] ||
                            activeModalProject.galleryImages[0]
                          ).caption!.en
                        }
                      </p>
                    )}
                  </div>

                  {/* Clickable Thumbnail Strip */}
                  <div className="flex items-center justify-center flex-wrap gap-2.5 pt-1">
                    {activeModalProject.galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedArtIndex(idx)}
                        className={`relative w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedArtIndex === idx
                            ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-500/30'
                            : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={resolvePopupSrc(img.src)}
                          alt={`${isEn ? 'Thumbnail' : 'Miniatura'} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : activeModalProject.mediaType === 'video' &&
                (activeModalProject.mediaSrc || activeModalProject.youtubeId) ? (
                <div className="space-y-2.5">
                  {activeModalProject.youtubeId && activeModalProject.mediaSrc && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setModalVideoSource('youtube')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          modalVideoSource === 'youtube'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isEn ? 'Official Broadcast (YouTube)' : 'Transmisión Oficial (YouTube)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalVideoSource('local')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          modalVideoSource === 'local'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isEn ? 'Local MP4 Recording' : 'Grabación Local MP4'}
                      </button>
                    </div>
                  )}

                  <div className="w-full bg-slate-950 rounded-xl overflow-hidden shadow-inner aspect-video relative flex items-center justify-center">
                    {activeModalProject.youtubeId &&
                    (modalVideoSource === 'youtube' || !activeModalProject.mediaSrc) ? (
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
                        poster={activeModalProject.thumbnailSrc}
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
                        <Film className="w-10 h-10 text-sky-400" />
                        <p className="text-white font-bold text-sm">
                          {activeModalProject.title[language] || activeModalProject.title.en}
                        </p>
                        <a
                          href={
                            activeModalProject.externalUrl ||
                            'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing'
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                        >
                          <FolderOpen className="w-4 h-4" />
                          <span>{isEn ? 'Open Project in Google Drive' : 'Abrir en Google Drive'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 px-1">
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-sky-500" />
                      <span>
                        {activeModalProject.youtubeId && modalVideoSource === 'youtube'
                          ? isEn
                            ? 'Official broadcast presentation & gameplay stream.'
                            : 'Transmisión oficial y presentación broadcast.'
                          : isEn
                          ? 'Direct MP4 capture. Unmute using player controls if needed.'
                          : 'Captura MP4 directa. Puedes activar el audio en los controles del reproductor.'}
                      </span>
                    </span>
                    {activeModalProject.youtubeId && modalVideoSource === 'youtube' ? (
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
                  <div className="w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                    <img
                      src={resolvePopupSrc(
                        activeModalProject.galleryImages && activeModalProject.galleryImages[selectedArtIndex]
                          ? activeModalProject.galleryImages[selectedArtIndex].src
                          : activeModalProject.mediaSrc || activeModalProject.thumbnailSrc || ''
                      )}
                      alt={activeModalProject.title[language] || activeModalProject.title.en}
                      className="w-full h-auto max-h-[500px] object-contain mx-auto"
                    />
                  </div>
                  {activeModalProject.galleryImages && activeModalProject.galleryImages.length > 0 && (
                    <>
                      {activeModalProject.galleryImages[selectedArtIndex]?.caption && (
                        <p className="text-xs text-slate-300 text-center">
                          {activeModalProject.galleryImages[selectedArtIndex].caption![language] ||
                            activeModalProject.galleryImages[selectedArtIndex].caption!.en}
                        </p>
                      )}
                      <div className="flex items-center justify-center flex-wrap gap-2">
                        {activeModalProject.galleryImages.map((g, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedArtIndex(idx)}
                            className={`relative w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedArtIndex === idx
                                ? 'border-fuchsia-400 scale-105 shadow-lg'
                                : 'border-slate-700 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={resolvePopupSrc(g.src)}
                              alt={`${isEn ? 'Slide' : 'Diapositiva'} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : null}

              {/* Always show compact clickable Thumbnails & Pop-Ups strip below Video when in Video mode */}
              {modalViewMode === 'primary' &&
                activeModalProject.mediaType === 'video' &&
                activeModalProject.galleryImages &&
                activeModalProject.galleryImages.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                      <Images className="w-4 h-4 text-sky-500" />
                      <span>
                        {isEn
                          ? 'Thumbnails, Captures & Pop-Up Screens (Click to Inspect)'
                          : 'Miniaturas, Capturas y Pantallas Pop-Up (Haz clic para ampliar)'}
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeModalProject.galleryImages.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedArtIndex(i);
                            setModalViewMode('gallery');
                          }}
                          className="group/gal text-left relative rounded-xl overflow-hidden border border-slate-200 hover:border-sky-500 bg-slate-950 shadow-sm flex flex-col transition-all"
                        >
                          <img
                            src={resolvePopupSrc(img.src)}
                            alt={`${isEn ? 'Gallery' : 'Galería'} ${i + 1}`}
                            className="w-full h-32 object-cover group-hover/gal:scale-105 transition-transform duration-300"
                          />
                          {img.caption && (
                            <div className="p-2 bg-slate-900 text-slate-300 text-[11px] leading-snug border-t border-slate-800 line-clamp-2 w-full">
                              {img.caption[language] || img.caption.en}
                            </div>
                          )}
                        </button>
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
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${modalTheme.pillBg}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links Footer */}
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
                        <span>{isEn ? 'Play Conveyor Realms' : 'Jugar Conveyor Realms'}</span>
                      </button>
                    )}
                    {activeModalProject.id === 'fish-feeder-3d' && onSwitchToFishFeeder && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalProject(null);
                          onSwitchToFishFeeder();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105"
                      >
                        <Fish className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Play Fish Feeder' : 'Jugar Fish Feeder'}</span>
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
