import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  Film,
  Compass,
  GraduationCap,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Github,
  FolderOpen,
  Globe,
  Heart,
  CheckCircle2,
  Layers,
  Car,
  Activity,
  Clapperboard,
  Tv,
} from 'lucide-react';

interface AboutMeViewProps {
  onSwitchToPortfolio: () => void;
  onSwitchToCv: () => void;
}

export function AboutMeView({ onSwitchToPortfolio, onSwitchToCv }: AboutMeViewProps) {
  const [selectedPassion, setSelectedPassion] = useState<'all' | 'sports' | 'cars' | 'action' | 'games'>('all');

  const passionsData = [
    {
      id: 'games',
      title: 'Video Games',
      icon: Gamepad2,
      tagline: 'The Ultimate Creative Canvas & Interactive Worlds',
      color: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description:
        'Video games represent the peak synthesis of technology, art, design, physics, and storytelling. For me, gaming is not just entertainment—it is an interactive medium where players exercise agency, solve complex puzzles, experience emotional resonance, and push digital hardware to its absolute limits.',
      howItTranslates:
        'Translates into deep intuition for gameplay responsiveness, frame pacing (steady 60+ FPS), shader aesthetics, level design, and player feedback loops in Unreal Engine and Frostbite.',
      keySkills: ['Unreal Engine 4 & 5', 'Frostbite Engine', 'Gameplay Blueprints & C++', '60 FPS Pacing', 'Interactive UI/UX'],
    },
    {
      id: 'sports',
      title: 'Sports: Soccer, Football, Baseball & Basketball',
      icon: Trophy,
      tagline: 'Competitive Energy, Strategic Precision & Stadium Atmosphere',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      description:
        'I am deeply passionate about competitive athletics across major disciplines: Soccer (Fútbol), American Football, Baseball, and Basketball. I study team playbooks, athletic kinematic movements, match tension, dramatic momentum shifts, and the electric atmosphere of full stadiums.',
      howItTranslates:
        'Directly fueled my work on world-class AAA sports titles (verified public credit on MobyGames for EA Sports College Football 25). Understanding the nuances of football reads, route trees, clock management, and scoreboard mechanics allowed me to build and test gameplay systems with genuine athletic authenticity.',
      keySkills: ['EA Sports College Football 25', 'MobyGames Credited', 'Athletic Kinematics', 'Scoreboard Logic', 'Game Clocks'],
    },
    {
      id: 'cars',
      title: 'Automotive & Motorsports',
      icon: Car,
      tagline: 'Mechanical Engineering, Speed & Racing Simulation',
      color: 'from-red-500 to-rose-600',
      badgeColor: 'bg-red-100 text-red-900 border-red-200',
      description:
        'From high-performance sports cars and Formula racing to automotive design, aerodynamics, telemetry, and track physics. The visceral sensation of speed, precise tire grip limits, engine acoustic roar, and mechanical perfection has always fascinated me.',
      howItTranslates:
        'Connects directly to real-time vehicle simulations, telematics SaaS platforms at Orblite, automotive Digital Twins for Fortune 500 manufacturing plants, and vehicle physics modeling in game engines.',
      keySkills: ['Vehicle Telematics (Orblite)', 'Automotive Digital Twins', 'Physics Simulation', 'Torque & Gear Modeling'],
    },
    {
      id: 'action',
      title: 'Action Movies & Cinematic Series',
      icon: Clapperboard,
      tagline: 'High-Octane Staging, Dynamic Cameras & Visual Thrills',
      color: 'from-sky-500 to-blue-600',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-200',
      description:
        'A dedicated enthusiast of adrenaline-fueled action cinema, martial arts choreography, car chases, sci-fi epics, and serialized prestige action television. I closely analyze cinematography, camera composition, dramatic lighting, suspense builds, and dynamic visual effects.',
      howItTranslates:
        'Informs camera placement, cinematic sequencer tracks, volumetric OpenVDB lighting, particle impacts, and stylized visual pacing for interactive simulations and virtual scenes.',
      keySkills: ['Cinematic Sequencer', 'Dynamic Cameras', 'Volumetric VFX', 'Lighting & Color Grading', 'Staging'],
    },
  ];

  const filteredPassions =
    selectedPassion === 'all' ? passionsData : passionsData.filter((p) => p.id === selectedPassion);

  return (
    <div className="w-full flex flex-col space-y-10 animate-fade-in pb-16">
      {/* Hero Profile Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 md:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Passions, Story & Creative Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Hi, I'm Isaac Gómez Estrada.
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-light">
            I am <strong className="text-amber-400 font-semibold">32 years old</strong>, and since{' '}
            <strong className="text-sky-300 font-semibold">2018</strong> I have dedicated my career and life to the
            development of <span className="text-white font-medium underline decoration-sky-400 underline-offset-4">interactive virtual environments</span>,
            real-time 3D simulation, and game engineering.
          </p>

          {/* Key Facts Pill Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>32 Years Old · 8+ Years in Virtual Environments</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available On-Site: Zapopan & Guadalajara, Mexico</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800/80 text-amber-300 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Shipped AAA Titles Credited on MobyGames</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Manifesto: Why Game Development? */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-sky-500 via-indigo-600 to-amber-500" />

        <div className="max-w-4xl space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>My Core Manifesto</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Why I Love Game Development & Virtual Environments
          </h2>

          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              I am a passionate lover of <strong>video games, sports (Soccer, American Football, Baseball, Basketball), cars & motorsports, and action series & movies</strong>.
              For as long as I can remember, these disciplines have inspired me, captivated my imagination, and driven my curiosity.
            </p>
            <p className="bg-slate-50 p-4 sm:p-5 rounded-xl border-l-4 border-amber-500 italic text-slate-800 font-medium">
              "Game development is the one discipline in the universe where all my passions converge. When I build an interactive virtual environment, I am not just writing code—I am stepping inside the stadium, getting behind the wheel of a high-performance machine, and staging a high-octane cinematic action sequence. Game development lets me bring what I love to life."
            </p>
            <p>
              Whether it is capturing the split-second decision-making of a quarterback in a football simulation, perfecting the visual feedback of an interactive scoreboard, simulating the precise aerodynamics and floor layout of an automotive assembly line, or tuning a stylized watercolor shader so that exploring a 3D world feels like moving through living art—interactive technology turns my enthusiasm into tangible, memorable experiences for players and users.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 Passion Pillars */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              The 4 Fuel Pillars of My Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How my lifelong personal interests directly elevate my technical execution.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'all', label: 'All Pillars' },
              { id: 'games', label: 'Games' },
              { id: 'sports', label: 'Sports' },
              { id: 'cars', label: 'Cars' },
              { id: 'action', label: 'Action & Cinema' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPassion(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedPassion === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPassions.map((passion) => {
            const Icon = passion.icon;
            return (
              <div
                key={passion.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${passion.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${passion.badgeColor}`}>
                      {passion.title}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {passion.tagline}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {passion.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-1">
                      Direct Game & Tech Application:
                    </span>
                    <p className="text-xs text-slate-700 leading-normal">
                      {passion.howItTranslates}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {passion.keySkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Shipped Games Feature */}
      <section className="bg-gradient-to-br from-amber-500/15 via-white to-sky-500/10 rounded-2xl border border-amber-400/40 p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Trophy className="w-3.5 h-3.5" />
              <span>Verified Industry Credits</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Shipped AAA Sports Titles Verified on MobyGames
            </h2>
            <p className="text-sm text-slate-700 max-w-2xl">
              Isaac Gómez Estrada's work is officially documented on the premier game developer database MobyGames.
              Credited for Quality Assurance and Technical Artist support on two of the world's most recognized sports video games:
            </p>
          </div>

          <a
            href="https://www.mobygames.com/person/1727096/isaac-gomez/portfolio/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105 shrink-0"
          >
            <span>Open Verified MobyGames Profile</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-2">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                25
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-base">EA Sports College Football 25</h3>
                  <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    Publicly Credited on MobyGames
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Released 2024 · PlayStation 5, Xbox Series X/S · Electronic Arts (EA Sports)
                </p>
                <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                  Engineered interactive UI/UX architecture, validated initial playable game builds, optimized 60+ FPS performance, and managed Perforce pipelines in Frostbite Engine via DEVBOT co-development.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Quality Assurance & Tech Art Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Journey & Timeline */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Education & Professional Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From university foundations in animation and interactive tech to AAA game titles and enterprise platforms.
          </p>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6">
          {/* Milestone 1: Education */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-sky-600 border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                2013 - 2018 · Academic Degree
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Ingeniería en Tecnologías Interactivas de Animación Digital
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                Universidad del Valle de México (UVM) · Zapopan / Guadalajara, Jalisco
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Completed 5-year specialized engineering program centered on interactive virtual environments, real-time 3D graphics, procedural animation, computer graphics math, C++, and game engines.
              </p>
            </div>
          </div>

          {/* Milestone 2: 2018 Dedicated focus */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                2018 - 2022 · Virtual Environments & Real-Time Simulation
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Full Commitment to Interactive Virtual Environments (Unreal Engine)
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                Independent Projects & Spinar Plus · Interactive 3D Simulations
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Engineered classroom simulators (ClassSim), stylized NPR worlds (Acuarela), procedural terrain generators (RWGen), and interactive 3D simulations for government water conservation and education.
              </p>
            </div>
          </div>

          {/* Milestone 3: AAA Co-Development */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                2022 - 2023 · AAA Co-Development
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Technical Artist at DEVBOT (AAA Sports Games)
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                Shipped Credit on EA Sports College Football 25
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Built and stabilized initial playable builds in Frostbite Engine, handled interactive UI/UX, and managed Perforce branches and Jenkins builds under strict enterprise confidentiality standards.
              </p>
            </div>
          </div>

          {/* Milestone 4: Flex Digital Twins */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                2024 - 2026 · Industrial Simulation
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Applications Developer & Unreal Engine Specialist at Flex
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                Zapopan, Jalisco · Manufacturing Digital Twins for Fortune 500 Clients
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Built real-time assembly line Digital Twins with Unreal Engine 5 and FlexSim, simulated machine failures, optimized thermal spacing, and developed VR training modules for heavy industrial robotics.
              </p>
            </div>
          </div>

          {/* Milestone 5: Orblite Automation & Platform Engineering */}
          <div className="relative group">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                2026 - Present · AI Automation & Platform Engineering
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Lead Automation Engineer & Platform Developer at Orblite
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                Vehicle Telematics SaaS & Proprietary ERP/CRM (orb-lite.com)
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Engineering AI workflow automation pipelines, architecting real-time vehicle telematics & data simulation infrastructure, and building custom internal ERP/CRM applications using TypeScript, React, RESTful APIs, SQL (Supabase), and Cloudflare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location, Availability & Contact */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open to New Challenges in Games & Real-Time Tech</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Available On-Site in Zapopan & Guadalajara, or Globally Remote
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            I am physically located in the Guadalajara metropolitan area and readily available for <strong>on-site collaboration in Zapopan and Guadalajara</strong>, as well as hybrid setups or full remote work with international studios and publishers.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
            <span>📧 isaacgestrada94@gmail.com</span>
            <span>📱 +52 33 1835 9421</span>
            <span>📍 Zapopan / Guadalajara, Jalisco, México</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSwitchToPortfolio}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            Explore Portfolio Showcases
          </button>
          <button
            type="button"
            onClick={onSwitchToCv}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs border border-slate-600 shadow-md transition-all hover:scale-105"
          >
            View Complete CV / PDF
          </button>
        </div>
      </section>
    </div>
  );
}
