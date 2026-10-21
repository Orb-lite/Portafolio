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
} from 'lucide-react';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'all' | 'virtual-env' | 'aaa-games' | 'simulation' | 'art';
  categoryLabel: string;
  year: string;
  engine: string;
  mediaType: 'video' | 'image' | 'external';
  mediaSrc?: string;
  thumbnailSrc?: string;
  description: string;
  highlights: string[];
  techStack: string[];
  externalUrl?: string;
  externalLabel?: string;
  mobyGamesUrl?: string;
  featured?: boolean;
}

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'shipped-aaa-titles',
    title: 'EA Sports College Football 25',
    subtitle: 'Shipped AAA Sports Title (MobyGames Verified Credit)',
    category: 'aaa-games',
    categoryLabel: 'AAA Games & Co-Dev',
    year: '2024',
    engine: 'Frostbite Engine',
    mediaType: 'external',
    description:
      'Verified public credit on MobyGames for flagship sports release EA Sports College Football 25. Co-developed at DEVBOT for premier global publisher Electronic Arts (EA Sports). Provided critical Technical Art and QA support across UI/UX systems, Frostbite engine pipelines, initial playable build performance, and console certification for PlayStation 5 and Xbox Series X/S.',
    highlights: [
      'Publicly verified credits on MobyGames database for Isaac Gómez',
      'Engineered & validated initial playable build ensuring steady 60+ FPS performance',
      'Interactive UI/UX implementation in proprietary Frostbite Engine',
      'Large-scale source control with Perforce (Helix Core) and automated Jenkins CI/CD',
    ],
    techStack: ['Frostbite Engine', 'Perforce Helix Core', 'Jenkins CI', 'C++', 'UI/UX', 'PS5', 'Xbox Series X/S'],
    externalUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    externalLabel: 'View Verified MobyGames Credits',
    mobyGamesUrl: 'https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/',
    featured: true,
  },
  {
    id: 'watercolor-sim',
    title: 'Acuarela - Stylized Interactive Virtual Environment',
    subtitle: 'Real-Time Non-Photorealistic Rendering (NPR) & Exploration in Unreal Engine',
    category: 'virtual-env',
    categoryLabel: 'Interactive Virtual Environments',
    year: '2022',
    engine: 'Unreal Engine (PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/watercolor-interactive-environment.mp4',
    description:
      'An expressive interactive 3D virtual environment built in Unreal Engine featuring custom stylized post-processing shaders mimicking traditional watercolor paintings. Players navigate an atmospheric architectural setting with real-time dynamic lighting, ambient audio, and responsive player movement.',
    highlights: [
      'Custom HLSL post-process material edge detection & watercolor pigment bleeding',
      'Smooth 60+ FPS navigation in 64-bit Standalone Windows preview',
      'Dynamic lighting, particle dust motes, and atmospheric depth cues',
    ],
    techStack: ['Unreal Engine', 'HLSL / Shaders', 'Post-Process Materials', 'DirectX SM5', 'C++ / Blueprints'],
    featured: true,
  },
  {
    id: 'scores-sports-sim',
    title: 'Sports Broadcast & Real-Time Scoreboard Simulation',
    subtitle: 'Dynamic In-Game Score Tracking, Clock & Broadcast Graphics System',
    category: 'aaa-games',
    categoryLabel: 'AAA Games & Co-Dev',
    year: '2022 - 2023',
    engine: 'Unreal Engine / Real-Time UI',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/sports-scoreboard-simulation.mp4',
    description:
      'Real-time sports game display and scoring simulation designed to mimic televised sports broadcast feeds and high-stakes match gameplay. Features sub-frame responsive scoreboard updates, game clock synchronizations, and event-triggered visual transitions.',
    highlights: [
      'Event-driven score state machine handling points, quarters/halves, and timer logic',
      'Broadcast-grade typography, responsive screen scaling, and team color theming',
      'Bridges the gap between athletic game passion and technical real-time programming',
    ],
    techStack: ['Unreal Engine', 'UMG UI / Slate', 'Sports Mechanics', 'C++', 'Event Driven State'],
    featured: true,
  },
  {
    id: 'vdb-volumetric-sim',
    title: 'OpenVDB Volumetric Smoke & Cloud Simulation',
    subtitle: 'GPU-Accelerated Heterogeneous Volume Rendering',
    category: 'simulation',
    categoryLabel: '3D Simulation & VFX',
    year: '2024',
    engine: 'Unreal Engine 5 (Niagara & OpenVDB)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/vdb-volumetric-simulation.mp4',
    description:
      'Cutting-edge volumetric simulation inside Unreal Engine 5 taking advantage of OpenVDB spatial data structures. Computes high-density smoke plumes, atmospheric scattering, and light absorption in real time.',
    highlights: [
      'GPU-accelerated raymarching of 3D density grids without baking artifacts',
      'Physically accurate phase function scattering and shadow penetration',
      'Interactive viewport parameter adjustments for density, absorption, and velocity',
    ],
    techStack: ['Unreal Engine 5', 'OpenVDB', 'Niagara VFX', 'Heterogeneous Volumes', 'GPU Shaders'],
    featured: true,
  },
  {
    id: 'class-sim',
    title: 'ClassSim - Interactive Classroom Virtual Simulation',
    subtitle: 'Spatial Presence & Interactive Education Environment',
    category: 'virtual-env',
    categoryLabel: 'Interactive Virtual Environments',
    year: '2020',
    engine: 'Unreal Engine (Standalone NetMode)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/interactive-classroom-simulation.mp4',
    description:
      'Interactive 3D simulation of an academic auditorium and classroom setting designed for training, multi-perspective spatial awareness, and interactive virtual navigation.',
    highlights: [
      'Interactive first-person controller with collision geometry and sightline testing',
      'Realistic architectural scaling, natural light bounce, and seating arrangements',
      'Optimized standalone Windows build for lightweight distribution',
    ],
    techStack: ['Unreal Engine', 'Architectural Visualization', 'Standalone Build', 'C++ / Blueprints'],
  },
  {
    id: 'procedural-world-gen',
    title: 'RWGen - Procedural World & Environment Generation',
    subtitle: 'Algorithmic Terrain Biomes & Runtime Spatial Streaming',
    category: 'virtual-env',
    categoryLabel: 'Interactive Virtual Environments',
    year: '2022',
    engine: 'Unreal Engine Procedural Systems',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/procedural-world-generation.mp4',
    description:
      'Algorithmic terrain generation and procedural landscape populating. Demonstrates runtime biome generation, rule-based vegetation scattering, and scalable level-of-detail (LOD) streaming.',
    highlights: [
      'Noise-based heightmap elevation blending and biome transition zones',
      'Foliage instance clustering optimized for high framerates on standard GPUs',
      'Procedural generation rules eliminating repetitive manual level placement',
    ],
    techStack: ['Unreal Engine', 'Procedural Algorithms', 'Landscape Tools', 'HLSL', 'LOD Streaming'],
  },
  {
    id: 'unreal-editor-multiplayer',
    title: 'Unreal Engine Multiplayer & Server Architecture Preview',
    subtitle: 'Client-Server Replication, RPCs & Network Synchronization',
    category: 'virtual-env',
    categoryLabel: 'Interactive Virtual Environments',
    year: '2020',
    engine: 'Unreal Engine (Server 64-bit PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/unreal-multiplayer-server-preview.mp4',
    description:
      'Dedicated server multiplayer simulation testing real-time client-to-server replication, authoritative state verification, position interpolation, and network debug tools in Unreal Engine.',
    highlights: [
      'Server-authoritative physics and network replication setup',
      'Multi-client window debugging with synchronized game state in real time',
      'Deep workflow familiarity with Unreal Editor internal build pipelines',
    ],
    techStack: ['Unreal Engine', 'Multiplayer Networking', 'Replication / RPCs', 'Server Architecture'],
  },
  {
    id: 'industrial-digital-twins',
    title: 'Industrial Manufacturing Digital Twins (Flex)',
    subtitle: 'Assembly Line Simulation & VR Training for Fortune 500 Enterprises',
    category: 'simulation',
    categoryLabel: '3D Simulation & VFX',
    year: '2024 - 2026',
    engine: 'Unreal Engine 5 & FlexSim',
    mediaType: 'external',
    description:
      'High-precision real-time 3D Digital Twins of industrial manufacturing floors for global Fortune 500 enterprises across automotive, advanced technology, and pharmaceutical sectors (under strict NDAs). Modeled assembly line throughput, automated failure detection, and thermal spacing.',
    highlights: [
      'Pre-empted physical machine assembly bottlenecks using predictive 3D simulations',
      'Calculated optimal machinery spacing to avoid thermal overheating on floor',
      'Created immersive VR training modules for safe operational onboarding on heavy robotics',
    ],
    techStack: ['Unreal Engine 5', 'FlexSim', 'Industrial IoT', 'VR (Virtual Reality)', 'Python', 'Digital Twins'],
    externalUrl: 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing',
    externalLabel: 'View Portfolio Drive Folder',
  },
  {
    id: 'orblite-platform',
    title: 'Orblite - SaaS Telematics & Vehicle Management Platform',
    subtitle: 'Full-Stack Fleet Monitoring, Sensor Telemetry & Internal ERP/CRM',
    category: 'simulation',
    categoryLabel: '3D Simulation & VFX',
    year: '2026 - Present',
    engine: 'React / TypeScript / Supabase',
    mediaType: 'external',
    description:
      'Commercial telematics SaaS platform engineered from the ground up for GPS tracking, telemetry analytics, and vehicle operations. Includes proprietary internal CRM and ERP systems, AI-powered prospecting tools, and high-performance cloud deployment.',
    highlights: [
      'End-to-end full-stack web architecture serving live fleets and enterprise clients',
      'Real-time telemetry map tracking, automated alerts, and financial reporting',
      'Source code publicly visible on GitHub organization repositories',
    ],
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Supabase', 'Vercel', 'Cloudflare', 'REST APIs'],
    externalUrl: 'https://orb-lite.com',
    externalLabel: 'Visit orb-lite.com',
  },
  {
    id: 'unreal-standalone-gameplay',
    title: 'Unreal Engine Standalone Game Simulation',
    subtitle: 'Real-Time Physics, Character Controller & Environmental Interaction',
    category: 'virtual-env',
    categoryLabel: 'Interactive Virtual Environments',
    year: '2020',
    engine: 'Unreal Engine (Standalone 64-bit PCD3D_SM5)',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/unreal-standalone-gameplay.mp4',
    description:
      'Direct gameplay recording from standalone client build featuring real-time collision detection, responsive third-person camera mechanics, and dynamic physics objects.',
    highlights: [
      '60 FPS gameplay validation in standalone Windows runtime',
      'Third-person character locomotion with acceleration and braking curves',
      'Engineered interactive mechanics using Blueprints and C++',
    ],
    techStack: ['Unreal Engine', 'Character Locomotion', 'Physics Simulation', 'C++ / Blueprints'],
  },
  {
    id: 'unreal-editor-project4',
    title: 'Unreal Engine Scene Assembly & Level Construction',
    subtitle: 'Lighting Setup, Material Instances & Viewport Profiling',
    category: 'virtual-env',
    categoryLabel: 'Interactive Virtual Environments',
    year: '2020',
    engine: 'Unreal Editor',
    mediaType: 'video',
    mediaSrc: '/portfolio_assets/unreal-project4-editor.mp4',
    description:
      'In-editor level construction session demonstrating asset placement, volumetric fog tuning, static and dynamic light building, and performance profiling across rendering passes.',
    highlights: [
      'Material instance parameters tuning for physically based rendering (PBR)',
      'Draw call and polygon budget optimization for target platforms',
      'Real-time editor viewport profiling and debugging',
    ],
    techStack: ['Unreal Engine', 'Level Design', 'PBR Materials', 'Profiling & Optimization'],
  },
  {
    id: 'concept-artworks',
    title: 'Digital Concept Art & Environment Visual Development',
    subtitle: 'Atmospheric Mood Studies & Creative Illustration',
    category: 'art',
    categoryLabel: 'Concept Art & Visual Development',
    year: '2018 - 2022',
    engine: 'Photoshop / Digital Painting',
    mediaType: 'image',
    mediaSrc: '/portfolio_assets/concept-artwork-1.png',
    thumbnailSrc: '/portfolio_assets/concept-artwork-1.png',
    description:
      'Digital illustration and visual development exploratory artworks capturing mood, lighting, perspective, and stylized environment design for interactive virtual experiences.',
    highlights: [
      'Exploration of color palettes, architectural silhouette, and lighting contrast',
      'Serves as visual target benchmarks before 3D environment grayboxing and shader authoring',
      'Original creative artworks from personal portfolio archive',
    ],
    techStack: ['Digital Painting', 'Concept Art', 'Lighting Theory', 'Color Scripts'],
  },
];

interface PortfolioViewProps {
  onSwitchToCv: () => void;
  onSwitchToAbout: () => void;
}

export function PortfolioView({ onSwitchToCv, onSwitchToAbout }: PortfolioViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [selectedArtIndex, setSelectedArtIndex] = useState<number>(0);

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (selectedCategory === 'all') return true;
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
            <span>Interactive Virtual Environments & AAA Real-Time 3D</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Isaac Gómez Estrada
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            <span className="text-amber-400 font-semibold">32-year-old engineer</span> dedicated since{' '}
            <span className="text-sky-300 font-semibold">2018</span> to creating interactive virtual environments,
            Unreal Engine simulations, and high-performance 3D graphics. Credited on shipped AAA sports titles verified
            on MobyGames.
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
              <span>GitHub: Portafolio.git</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>MobyGames (Shipped Credits)</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>

            <a
              href="https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-medium border border-slate-600/70 shadow-xs transition-all hover:scale-[1.02]"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>Drive Portfolio Folder</span>
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
              <span>My Passions & Bio</span>
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
                Shipped AAA Titles in Public Credits
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                Verified on MobyGames
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Isaac Gómez Estrada is officially credited on <strong>EA Sports College Football 25</strong> (PS5, Xbox
              Series X/S, 2024) developed in Frostbite Engine via co-development studio DEVBOT.
            </p>
          </div>
        </div>

        <a
          href="https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
        >
          <span>Open MobyGames Profile</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      {/* Category Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          {[
            { id: 'all', label: 'All Projects', icon: Layers },
            { id: 'virtual-env', label: 'Interactive Virtual Environments', icon: Monitor },
            { id: 'aaa-games', label: 'AAA Games & Co-Dev', icon: Gamepad2 },
            { id: 'simulation', label: '3D Simulation & Digital Twins', icon: Boxes },
            { id: 'art', label: 'Concept Art & Visual Dev', icon: Film },
          ].map((cat) => {
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
          Showing <strong>{filteredProjects.length}</strong> project showcases
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-sky-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Project Media Preview Area */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              {project.mediaType === 'video' && project.mediaSrc ? (
                <div
                  className="w-full h-full relative cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  onClick={() => setActiveModalProject(project)}
                >
                  <video
                    src={project.mediaSrc}
                    muted
                    playsInline
                    loop
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    onMouseEnter={(e) => {
                      try {
                        e.currentTarget.play();
                      } catch {
                        /* ignore */
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-lg group-hover:bg-sky-500 group-hover:scale-110 transition-all">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Film className="w-3 h-3 text-sky-400" />
                    <span>Watch Simulation Video</span>
                  </span>
                </div>
              ) : project.mediaType === 'image' && project.mediaSrc ? (
                <div
                  className="w-full h-full relative cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  onClick={() => setActiveModalProject(project)}
                >
                  <img
                    src={project.mediaSrc}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs">
                    View Full Art Canvas
                  </span>
                </div>
              ) : (
                <div
                  className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
                  onClick={() => setActiveModalProject(project)}
                >
                  {project.id === 'shipped-aaa-titles' ? (
                    <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
                  ) : (
                    <Globe className="w-12 h-12 text-sky-400 mb-2" />
                  )}
                  <h3 className="text-white font-bold text-sm">{project.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{project.engine}</p>
                  <span className="mt-3 text-[11px] font-semibold text-sky-300 underline decoration-sky-400">
                    Explore Details & Verification
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
                  <span className="font-semibold text-sky-700">{project.categoryLabel}</span>
                  <span>{project.year}</span>
                </div>

                <h3
                  onClick={() => setActiveModalProject(project)}
                  className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer leading-snug"
                >
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
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
                      +{project.techStack.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveModalProject(project)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
                  >
                    <span>View Showcase</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {project.externalUrl && (
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                    >
                      <span>External</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Callout to CV and About Me */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Need the comprehensive Curriculum Vitae or Personal Bio?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Explore Isaac's detailed experience timeline, education, 2-page print-ready PDF export, or read his story and
            passions in the About Me section.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSwitchToCv}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            Go to CV / Resume
          </button>
          <button
            type="button"
            onClick={onSwitchToAbout}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            Read About Me
          </button>
        </div>
      </section>

      {/* Media Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded">
                  {activeModalProject.engine}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                  {activeModalProject.title}
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
            <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Media Player / Viewer */}
              {activeModalProject.mediaType === 'video' && activeModalProject.mediaSrc ? (
                <div className="w-full bg-slate-950 rounded-xl overflow-hidden shadow-inner aspect-video">
                  <video
                    src={activeModalProject.mediaSrc}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : activeModalProject.mediaType === 'image' ? (
                <div className="w-full bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center p-3 sm:p-5 space-y-4">
                  <img
                    src={`/portfolio_assets/concept-artwork-${selectedArtIndex + 1}.png`}
                    alt={`${activeModalProject.title} ${selectedArtIndex + 1}`}
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
                        <span>Artwork #{idx + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Description & Specs */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Project Overview</h4>
                  <p className="text-sm text-slate-700 leading-relaxed mt-1">
                    {activeModalProject.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Technical Highlights</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                    {activeModalProject.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Tech Stack & Tools</h4>
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
                        <span>{activeModalProject.externalLabel || 'Open Link'}</span>
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
                      <span>Portfolio Repo</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalProject(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Close
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
