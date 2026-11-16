import React, { useEffect, useState } from 'react';
import {
  X,
  Swords,
  Shield,
  Flame,
  Map as MapIcon,
  Cpu,
  Clock,
  Users,
  Sparkles,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import lastRelicKeyart from '../../assets/images/last_relic_oathbreaker_keyart.jpg';

interface GddShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'es' | 'en';
}

type GddTab = 'funnel' | 'loot' | 'combat_arch';

export const GddShowcaseModal: React.FC<GddShowcaseModalProps> = ({
  isOpen,
  onClose,
  language = 'es',
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<GddTab>('funnel');
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(2);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const phases = [
    {
      phase: isEn ? 'Phase 1: The Invasion' : 'Fase 1: La Invasión',
      time: '0:00 – 6:00',
      zone: isEn ? 'Full Continent (100%)' : 'Continente Completo (100%)',
      teams: isEn ? '100 vs 100 (2 Armies)' : '100 vs 100 (2 Ejércitos)',
      dynamic: isEn
        ? 'Opposite-corner deployment. Fast looting across towns/crypts and border skirmishes between Valenkor and Ironspire.'
        : 'Despliegue en extremos opuestos. Saqueo rápido en asentamientos/criptas y escaramuzas fronterizas entre Valenkor y Ferrum.',
      friendlyFire: isEn ? 'OFF (Army Protection)' : 'Desactivado (Protección de Facción)',
    },
    {
      phase: isEn ? 'Phase 2: The Siege' : 'Fase 2: El Asedio',
      time: '6:00 – 12:00',
      zone: isEn ? 'Central Region (50%)' : 'Región Central (50%)',
      teams: isEn ? '100 vs 100 (Frontline Clash)' : '100 vs 100 (Cierre de frente)',
      dynamic: isEn
        ? 'Massive frontline clash at Broken Crown Citadel. First Runic Chests (Epic / Legendary Relics) unlock.'
        : 'Choque masivo en la Ciudadela de Corona Rota. Aparecen los primeros Cofres Rúnicos (Reliquias Épicas/Legendarias).',
      friendlyFire: isEn ? 'OFF (Army Protection)' : 'Desactivado (Protección de Facción)',
    },
    {
      phase: isEn ? 'Phase 3: The Schism' : 'Fase 3: El Cisma',
      time: '12:00 – 16:00',
      zone: isEn ? 'Citadel / Ruins (20%)' : 'Ciudadela / Ruinas (20%)',
      teams: isEn ? 'Squads of 4 (Armies Break)' : 'Escuadrones de 4 (Se rompen los ejércitos)',
      dynamic: isEn
        ? 'Faction oath shatters. Former army comrades become enemies, leaving only your nearby 4-player squad.'
        : 'El juramento de facción se rompe. Tus antiguos compañeros de ejército ahora son enemigos, excepto tu escuadrón cercano.',
      friendlyFire: isEn ? 'Faction Friendly-Fire ACTIVE (Squad Safe)' : 'Fuego amigo de facción ACTIVO (Escuadrón seguro)',
    },
    {
      phase: isEn ? 'Phase 4: The Purge' : 'Fase 4: La Purga',
      time: '16:00 – 19:00',
      zone: isEn ? 'Inner Arena (5%)' : 'Arena Interior (5%)',
      teams: isEn ? 'Free-for-All (FFA)' : 'Todos contra Todos (FFA)',
      dynamic: isEn
        ? 'All squads dissolve. Individual hunting and tense betrayals among former teammates begin.'
        : 'Se desactivan todos los escuadrones. Empieza la cacería individual y las traiciones entre antiguos aliados.',
      friendlyFire: isEn ? 'ALL-OUT FFA (Zero Allies)' : 'Todos contra Todos (Sin aliados)',
    },
    {
      phase: isEn ? 'Phase 5: The Judgment' : 'Fase 5: El Juicio',
      time: '19:00 – End',
      zone: isEn ? 'Duel Circle (1%)' : 'Círculo de Duelo (1%)',
      teams: '1 vs 1',
      dynamic: isEn
        ? 'Final storm closure until only a single Oathbreaker claims The Last Relic.'
        : 'Cierre final hasta que quede un único vencedor para reclamar La Última Reliquia.',
      friendlyFire: isEn ? 'Final 1v1 Duel' : 'Duelo final 1 vs 1',
    },
  ];

  const rarities = [
    {
      tier: isEn ? 'Common' : 'Común',
      colorLabel: isEn ? 'Gray' : 'Gris',
      accent: 'border-slate-300 bg-slate-50 text-slate-800',
      desc: isEn
        ? 'Forged iron / rusted starter gear. Standard damage with no bonus perks.'
        : 'Equipo básico/oxidado. Daño estándar, sin efectos extra.',
    },
    {
      tier: isEn ? 'Uncommon' : 'Poco Común',
      colorLabel: isEn ? 'Green' : 'Verde',
      accent: 'border-emerald-300 bg-emerald-50 text-emerald-900',
      desc: isEn
        ? 'Upgrades base combat stats and reduces spell cooldowns by 10%.'
        : 'Mejora estadísticas base y reduce cooldowns en 10%.',
    },
    {
      tier: isEn ? 'Rare' : 'Raro',
      colorLabel: isEn ? 'Blue' : 'Azul',
      accent: 'border-sky-300 bg-sky-50 text-sky-900',
      desc: isEn
        ? 'Adds elemental infusions (ember, frost, venom, storm) and weapon VFX.'
        : 'Añade infusiones elementales (fuego, escarcha, veneno, rayo) y VFX en el arma.',
    },
    {
      tier: isEn ? 'Epic' : 'Épico',
      colorLabel: isEn ? 'Purple' : 'Morado',
      accent: 'border-violet-300 bg-violet-50 text-violet-900',
      desc: isEn
        ? 'Grants combat passives (e.g. lifesteal on hit, mana regen on parry/block).'
        : 'Otorga pasivas de combate (ej. robo de vida al golpear, regeneración de maná al bloquear).',
    },
    {
      tier: isEn ? 'Legendary' : 'Legendario',
      colorLabel: isEn ? 'Gold' : 'Dorado',
      accent: 'border-amber-400 bg-amber-50 text-amber-950',
      desc: isEn
        ? 'Mythic Relics of Valenkor with unique powers (Eternal Bastion Cuirass, Oathbreaker Greatsword, Executioner Seal).'
        : 'Reliquias míticas con habilidades únicas (Coraza del Bastión Eterno, Mandoble del Juramento Roto, Sello del Verdugo).',
    },
  ];

  const spells = [
    {
      name: isEn ? 'Runic Bastion Wall (Barricada Rúnica)' : 'Barricada Rúnica',
      desc: isEn
        ? 'Raises a solid 8-second arcane stone barrier ahead of you to sever sightlines, stop volleys, or trap rivals inside corridors.'
        : 'Levanta una pared de energía sólida frente a ti por 8 segundos para cortar líneas de visión, bloquear flechas o encerrar enemigos en pasillos.',
    },
    {
      name: isEn ? 'Doom Sigil (Marca de Condena)' : 'Marca de Condena',
      desc: isEn
        ? 'High-damage homing void bolt focused on a single target (premier finisher in 1v1 duels).'
        : 'Proyectil oscuro teledirigido de altísimo daño a un solo objetivo (ideal para rematar en el 1 vs 1).',
    },
    {
      name: isEn ? 'Cinder Nova (Cataclismo Ígneo)' : 'Cataclismo Ígneo',
      desc: isEn
        ? 'Heavy AoE firestorm burst engineered to shatter shield walls during 100v100 clashes.'
        : 'Explosión ígnea de área diseñada para romper formaciones cerradas en el 100 vs 100.',
    },
    {
      name: isEn ? 'Gale Surge (Impulso de Vendaval)' : 'Impulso de Vendaval',
      desc: isEn
        ? 'Burst of sprint velocity to flank backlines or outrun the closing Arcane Maelstrom.'
        : 'Ráfaga de velocidad para flanquear líneas enemigas o escapar de la tormenta.',
    },
    {
      name: isEn ? 'Crimson Mend (Plegaria Carmesí)' : 'Plegaria Carmesí',
      desc: isEn
        ? 'Channels a large chunk of mana to restore heavy health instantly under duel pressure.'
        : 'Consume una gran cantidad de maná para restaurar vida crítica al instante en combate.',
    },
  ];

  const pois = [
    {
      name: isEn ? 'Broken Crown Citadel (Map Center)' : 'Ciudadela de Corona Rota (Centro del Mapa)',
      desc: isEn
        ? 'Multi-tier fortress with battlements, drawbridges, and inner courtyards where armies collide in Phase 2 for Legendary Relics.'
        : 'Castillo de múltiples niveles con murallas, puentes levadizos y patios interiores donde convergen los ejércitos en Fase 2 por Reliquias Legendarias.',
    },
    {
      name: isEn ? 'Sulfur Mire (West Flank)' : 'Ciénaga de Azufre (Flanco Oeste)',
      desc: isEn
        ? 'Rotting timber walkways spanning toxic waters requiring antidotes or rare boots—built for tight squad ambushes.'
        : 'Pasarelas de madera sobre aguas tóxicas. Requiere antídotos o botas raras, ideal para emboscadas tácticas de escuadrones.',
    },
    {
      name: isEn ? 'Obsidian Crypts (Underground PvE)' : 'Criptas de Obsidiana (Subterráneo PvE)',
      desc: isEn
        ? 'Subterranean catacombs beneath the citadel guarded by AI skeletal knights and wyrms holding Epic chests; rising storm forces chaotic ascents.'
        : 'Red de túneles debajo de la ciudadela con monstruos PvE (esqueletos, wyrms) custodiando cofres Épicos; al cerrar el subsuelo obliga a luchar por subir.',
    },
    {
      name: isEn ? 'Elder Canopy (East Flank)' : 'Dosel de los Ancestros (Flanco Este)',
      desc: isEn
        ? 'Colossal ancient trees with elevated platforms linked by rope bridges favoring vertical bow and arcane staff duels.'
        : 'Árboles gigantes con plataformas elevadas conectadas por puentes colgantes, favoreciendo el combate vertical con arcos y magia.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-amber-400 font-semibold">
              Game Design Document (GDD v2.0) · {isEn ? 'Original Draft Game Concept' : 'Borrador Original de Diseño de Juego'}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              The Last Relic: Oathbreaker
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close GDD modal' : 'Cerrar GDD'}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('funnel')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'funnel' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? '01. War to Betrayal (100v100 → 1v1)' : '01. De la Guerra a la Traición'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('loot')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'loot' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? '02. Loot, 5 Tiers & Runes' : '02. Loot, Rarezas y Runas'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('combat_arch')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'combat_arch' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? '03. 3D Combat, Map & UE5 Tech' : '03. Combate 3D, Mapa y UE5'}
            </button>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            <span>{isEn ? 'Over-the-Shoulder TPS · 200 Players · PvPvE' : 'Tercera Persona · 200 Jugadores · PvPvE'}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Hero Key Art Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 aspect-video lg:aspect-auto lg:h-full">
              <img
                src={lastRelicKeyart}
                alt="The Last Relic: Oathbreaker Key Art"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-slate-900">
                  {isEn ? 'Core Concept: "From War to Betrayal"' : 'Concepto Central: "De la Guerra a la Traición"'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {isEn
                    ? 'A gritty 3D medieval Battle Royale built around lethal, loot-driven progression with zero fixed classes. Matches erupt as a 100v100 faction war (Covenant of Valenkor vs. Ironspire Legion) before the Arcane Maelstrom shrinks the continent and shatters alliances phase by phase into 4-player squads, free-for-all chaos, and a brutal 1v1 duel.'
                    : 'Un Battle Royale medieval en 3D con atmósfera cruda, letal y basada en loot puro, sin clases ni profesiones fijas. La partida arranca como una guerra masiva de 100 contra 100 (El Pacto de Valenkor vs. La Legión de Ferrum) mientras El Cataclismo Arcano encoge el continente y disuelve las alianzas por fases hasta forzar un duelo 1 vs 1.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Perspective' : 'Perspectiva'}</span>
                  <span className="font-bold text-slate-900">{isEn ? 'Over-the-Shoulder TPS' : 'Tercera Persona (TPS)'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Match Scale' : 'Escala'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">{isEn ? '200 Players → 1 Winner' : '200 Jugadores → 1'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Class System' : 'Clases'}</span>
                  <span className="font-bold text-slate-900">{isEn ? 'Classless (Gear-Defined)' : 'Cero Profesiones (Por Loot)'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Target Engine' : 'Arquitectura'}</span>
                  <span className="font-bold text-slate-900">Unreal Engine 5</span>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'funnel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{isEn ? 'Dynamic Match Funnel (5 Escalating Phases)' : 'El Embudo Dinámico (De 100 vs 100 a 1 vs 1)'}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {isEn ? 'Click any phase row to inspect allegiance rules' : 'Haz clic en una fase para ver sus reglas de alianza'}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-100">
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Phase' : 'Fase'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Time' : 'Tiempo'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Zone Size' : 'Tamaño de Zona'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Team Structure' : 'Estructura'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Gameplay Dynamic' : 'Dinámica de Juego'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {phases.map((p, idx) => {
                      const active = selectedPhaseIdx === idx;
                      return (
                        <tr
                          key={p.phase}
                          onClick={() => setSelectedPhaseIdx(idx)}
                          className={`cursor-pointer transition-colors ${
                            active ? 'bg-amber-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{p.phase}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">{p.time}</td>
                          <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{p.zone}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">{p.teams}</td>
                          <td className="py-2.5 px-3 text-slate-600">{p.dynamic}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>{phases[selectedPhaseIdx].phase}</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>{isEn ? 'Friendly Fire & Alliances:' : 'Fuego Amigo y Alianzas:'}</strong>{' '}
                    {phases[selectedPhaseIdx].friendlyFire}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{phases[selectedPhaseIdx].dynamic}</p>
                </div>

                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-1.5">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{isEn ? 'Transition Mechanic: "The Toll of the Bell"' : 'Mecánica de Transición ("El Toque de Campana")'}</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {isEn
                      ? '30 seconds before every phase shift (Army → Squad, and Squad → FFA), a global war bell tolls and an on-screen countdown alerts everyone—letting players reposition, slip away from "allies", or spring traps right before friendly fire turns on.'
                      : '30 segundos antes de cada cambio de fase (de Ejército a Escuadrón, y de Escuadrón a FFA), suena una campana global y aparece un contador en pantalla, permitiendo posicionarse, alejarse de sus "aliados" o preparar emboscadas antes de activar el fuego amigo.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loot' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isEn ? '5-Tier Rarity Scale & Visual Silhouette' : 'Escala de Rarezas (5 Tiers) y Silueta en 3D'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {rarities.map((r) => (
                    <div key={r.tier} className={`p-3.5 rounded-xl border ${r.accent} space-y-1.5`}>
                      <div className="text-xs font-bold">
                        {r.tier} ({r.colorLabel})
                      </div>
                      <p className="text-xs opacity-90 leading-snug">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-700" />
                    <span>{isEn ? 'Universal Character Equipment Slots' : 'Ranuras Universales de Personaje'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>
                      <strong>{isEn ? 'Primary & Secondary Weapon:' : 'Arma Principal y Secundaria:'}</strong>{' '}
                      {isEn
                        ? 'Real-time toggle between a 2-handed Greatsword (melee) and a Longbow or Arcane Staff (ranged).'
                        : 'Alterna en tiempo real entre Espada a dos manos (cuerpo a cuerpo) y Arco Largo o Báculo Arcano (distancia).'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Heavy Armor vs. Light Tunic:' : 'Armadura Pesada vs. Túnica Ligera:'}</strong>{' '}
                      {isEn
                        ? 'Weight defines speed & stamina drain. Heavy gives high defense with slower dodge rolls; Light offers weaker armor with fast mana regen and agile dodges.'
                        : 'Armadura (Casco, Pecho, Piernas, Botas) determina peso, velocidad y esquive: Pesada da alta defensa con mayor costo de estamina; Túnica Ligera regenera maná rápido y permite esquives ágiles.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Potion Belt (Quick Slots 1–4):' : 'Cinturón de Pociones (Acceso Rápido 1–4):'}</strong>{' '}
                      {isEn
                        ? 'Health, Mana, Stamina, and Antidote potions with fast drink-on-the-move animations.'
                        : 'Pociones de Vida, Maná, Estamina y Antídotos con animaciones rápidas de consumo en movimiento.'}
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>{isEn ? '3 Arcane Scroll / Rune Slots (Looted in World)' : '3 Ranuras de Poderes (Pergaminos / Runas en 3D)'}</span>
                  </h4>
                  <div className="space-y-2">
                    {spells.map((sp) => (
                      <div key={sp.name} className="text-xs text-slate-700 leading-snug">
                        <strong className="text-slate-900">{sp.name}:</strong> {sp.desc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'combat_arch' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-rose-600" />
                    <span>{isEn ? 'Tactical 3D Combat & Three-Bar Management' : 'Combate 3D Táctico y Gestión de Tres Barras'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>
                      <strong>{isEn ? 'Directional Aim & Real Hitboxes:' : 'Sistema Direccional y Apuntado Libre:'}</strong>{' '}
                      {isEn
                        ? 'Sweeping greatsword arcs cleave multiple targets; shield/weapon blocks and precision parries counter melee hits. Arrows & sigils feature ballistic drop and travel time.'
                        : 'Hitbox real cuerpo a cuerpo (golpea a varios enemigos en arco con mandoble), bloqueo y parry preciso. Proyectiles con caída balística y tiempo de viaje.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Resource Trifecta:' : 'Tres Barras de Gestión:'}</strong>{' '}
                      {isEn
                        ? 'Health (Red), Mana (Blue — fuels all arcane scrolls & magic shields), and Stamina (Green — sprint, dodge, heavy blocks, and charged swings).'
                        : 'Vida (Roja), Maná (Azul para poderes y escudos mágicos) y Estamina (Verde para esprintar, esquivar, bloquear pesado y cargar ataques).'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Body Loot Drops:' : 'Saqueo de Cadáveres (Loot Drop):'}</strong>{' '}
                      {isEn
                        ? 'Eliminated players drop a physical backpack/chest holding all gear and potions for rapid mid-fight upgrades.'
                        : 'Al morir un jugador deja caer su mochila/cofre en el suelo con todo su equipo y pociones para hacer upgrade en plena batalla.'}
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>{isEn ? '200-Player Unreal Engine 5 Architecture' : 'Arquitectura Técnica UE5 para 200 Jugadores'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>
                      <strong>{isEn ? 'Replication Graph / Relevancy:' : 'Replicación por Relevancia (Replication Graph):'}</strong>{' '}
                      {isEn
                        ? 'During 100v100 battles, server streams high-frequency updates (animations, exact projectiles) within 50–80m while throttling distant players to protect FPS and bandwidth.'
                        : 'En fase 100 vs 100 el servidor envía alta frecuencia solo en un radio de 50–80m y reduce la frecuencia a distancia para mantener FPS estables.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Server Authority + Client Prediction:' : 'Física de Proyectiles y Autoridad de Servidor:'}</strong>{' '}
                      {isEn
                        ? 'Server validates damage hits and chest opens (blocking loot-dupe exploits) while client prediction keeps movement and aim responsive.'
                        : 'Autoridad del servidor para daño y apertura de cofres (anti-duplicación) con predicción en cliente para respuesta instantánea.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Modular Character Optimization:' : 'Optimización Modular de Personajes:'}</strong>{' '}
                      {isEn
                        ? 'Single base Skeletal Mesh with swappable modular armor slots plus GPU instancing for mass faction spell VFX.'
                        : 'Skeletal Mesh base único con piezas intercambiables e instanciado para partículas masivas en batallas de facción.'}
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-emerald-700" />
                  <span>{isEn ? '3D Continent Points of Interest (POIs)' : 'Diseño de Mapa 3D y Puntos de Interés (POIs)'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pois.map((poi) => (
                    <div key={poi.name} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="text-xs font-bold text-slate-900">{poi.name}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{poi.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>
              {isEn
                ? 'Original Game Design Draft & Mechanics Specification by Isaac Gómez Estrada'
                : 'Borrador Original de Game Design & Mecánicas por Isaac Gómez Estrada'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {isEn ? 'Close Document' : 'Cerrar Documento'}
          </button>
        </div>
      </div>
    </div>
  );
};
