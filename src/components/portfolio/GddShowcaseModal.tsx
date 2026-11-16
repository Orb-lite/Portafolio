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
  Skull,
} from 'lucide-react';
import {
  GDD_META,
  GDD_IMAGES,
  GDD_ACTS,
  GDD_RARITIES,
  GDD_SEALS,
  GDD_POIS,
  GDD_MONSTER_TIERS,
} from '../../data/gddData';

interface GddShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'es' | 'en';
}

type GddTab = 'funnel' | 'loot' | 'monsters' | 'combat_arch';

export const GddShowcaseModal: React.FC<GddShowcaseModalProps> = ({
  isOpen,
  onClose,
  language = 'es',
}) => {
  const isEn = language === 'en';
  const t = (obj: { es: string; en: string }) => (isEn ? obj.en : obj.es);
  const [activeTab, setActiveTab] = useState<GddTab>('funnel');
  const [selectedActIdx, setSelectedActIdx] = useState<number>(3);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
              {GDD_META.version} · {t(GDD_META.workClassification)}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              {GDD_META.projectTitle}
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
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('funnel')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'funnel' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? '01. Lore & 5-Act Cycle' : '01. Lore y 5 Actos'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('loot')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'loot' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? '02. 5 Tiers & 8 Aether Seals' : '02. Tiers y Sellos de Éter'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('monsters')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'monsters' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? '03. PvE Monsters & Drops' : '03. Monstruos y Loot'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('combat_arch')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'combat_arch' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? '04. Valdris POIs & UE5' : '04. Valdris POIs y UE5'}
            </button>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            <span>{t(GDD_META.genre)}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Hero Key Art Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 aspect-video lg:aspect-auto lg:h-full">
              <img
                src={GDD_IMAGES.keyart.src}
                alt={t(GDD_IMAGES.keyart.title)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-slate-900">
                  {isEn ? 'Valdris: "From Siege to the Throne"' : 'Valdris: "Del Asedio al Salón del Trono"'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {isEn
                    ? 'Across Valdris, The Abyssal Ash forces 200 mercenaries toward The Iron Crown. Duos, Trios, and Quads NEVER split and win together as a company; only Wanderer Mode (1 vs 199) crowns 1 sole winner.'
                    : 'En Valdris, La Ceniza Abisal empuja a 200 mercenarios hacia La Corona de Hierro. Los Dúos, Tríos y Cuartetos NUNCA se separan y ganan en conjunto; únicamente el Modo Errante (1 vs 199) corona a 1 solo ganador.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Oath Mode' : 'Modo Juramento'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {isEn ? 'Duos, Trios & Quads (Co-op Win)' : 'Dúos, Tríos y Cuartetos (Juntos)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Wanderer Mode' : 'Modo Errante'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {isEn ? '1 vs 199 · 1 Sole Winner' : '1 vs 199 · 1 Único Ganador'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Class System' : 'Identidad'}</span>
                  <span className="font-bold text-slate-900">{isEn ? 'Zero Fixed Classes' : 'Sin Clases Fijas'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Target Engine' : 'Motor'}</span>
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
                  <span>{isEn ? '5-Act Match Cycle (15–18 Minutes)' : 'Ciclo de Partida en 5 Actos (15–18 Minutos)'}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {isEn ? 'Click any act row to inspect rules' : 'Haz clic en un acto para ver sus reglas'}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-100">
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Act' : 'Acto'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Time' : 'Tiempo'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Survivors' : 'Supervivientes'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'Allegiance' : 'Alianzas'}</th>
                      <th className="py-2.5 px-3 font-semibold">{isEn ? 'World Dynamic' : 'Dinámica del Mundo'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {GDD_ACTS.map((item, idx) => {
                      const active = selectedActIdx === idx;
                      return (
                        <tr
                          key={item.time}
                          onClick={() => setSelectedActIdx(idx)}
                          className={`cursor-pointer transition-colors ${
                            active ? 'bg-amber-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{t(item.act)}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">{item.time}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-amber-800 whitespace-nowrap">
                            {item.survivors}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{t(item.allegianceState)}</td>
                          <td className="py-2.5 px-3 text-slate-600">{t(item.dynamic)}</td>
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
                    <span>{t(GDD_ACTS[selectedActIdx].act)}</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>{isEn ? 'Squad Rule:' : 'Regla de Escuadrón:'}</strong>{' '}
                    {t(GDD_ACTS[selectedActIdx].allegianceState)}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{t(GDD_ACTS[selectedActIdx].dynamic)}</p>
                </div>

                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-1.5">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>
                      {isEn
                        ? 'Squad Victory, 60s Respawn & Act IV Lockout'
                        : 'Victoria Conjunta, Respawn de 60s y Cierre en Acto IV'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {isEn
                      ? 'Duos, Trios, and Quads never split and win together. In Acts I–III, fallen teammates respawn in 60s if 1+ ally stays alive (if all die during the timer, the squad is wiped). From Act IV onward, team respawns are permanently disabled. Wanderer Mode (1v199) crowns 1 sole winner.'
                      : 'Dúos, Tríos y Cuartetos nunca se separan y ganan en conjunto. En Actos I–III hay respawn de 60s si queda 1+ aliado vivo (si mueren los demás, el equipo es eliminado). A partir del Acto IV ya no hay respawn de equipo. Solo Modo Errante corona a 1 ganador.'}
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
                  <span>{isEn ? 'Valdris Quality Scale (5 Tiers)' : 'Escala de Calidad de Valdris (5 Tiers)'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {GDD_RARITIES.map((r) => (
                    <div key={r.swatchHex} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-xs shrink-0 border border-slate-300"
                          style={{ backgroundColor: r.swatchHex }}
                        />
                        <span className="text-xs font-bold text-slate-900">{t(r.tier)}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">{t(r.colorLabel)}</div>
                      <p className="text-xs text-slate-700 leading-snug">{t(r.desc)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-700" />
                    <span>{isEn ? 'Universal Character Slots' : 'Ranuras Universales de Personaje'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>
                      <strong>{isEn ? 'Two Quick-Swap Weapons:' : 'Dos Armas en Cambio Rápido:'}</strong>{' '}
                      {isEn
                        ? 'Instant toggle between melee & ranged (Executioner Greatsword + Repeating Crossbow or Ash Scepter).'
                        : 'Alterna al instante entre Mandoble de Verdugo + Ballesta de Repetición o Cetro de Ceniza.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Four Hybrid Armor Pieces:' : 'Cuatro Piezas de Armadura (Peso Híbrido):'}</strong>{' '}
                      {isEn
                        ? 'Helm, Cuirass, Greaves, Boots—combining plate and cloth adjusts physical mitigation, speed, and Aether regeneration.'
                        : 'Yelmo, Coraza, Grebas y Botas: combinar piezas pesadas con tela ajusta mitigación, velocidad y regeneración de Éter.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Vial Belt (Keys 1–4):' : 'Cinturón de Viales (Teclas 1–4):'}</strong>{' '}
                      {isEn
                        ? 'Crimson Vial (Vitality), Aether Vial (Seals), Vigor Tonic (Stamina), Purifying Elixir (cleanses poison, burn, slow).'
                        : 'Vial Carmesí (Vitalidad), Vial de Éter, Tónico de Vigor (Estamina) y Elixir Purificador (limpia venenos y quemaduras).'}
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>{isEn ? '8 Swappable Aether Seals (3 Active Slots)' : '8 Sellos de Éter (3 Ranuras Activas)'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {GDD_SEALS.map((seal) => (
                      <div key={seal.name.en} className="text-xs text-slate-700 leading-snug">
                        <strong className="text-slate-900">
                          {t(seal.name)} ({t(seal.subName)}):
                        </strong>{' '}
                        {t(seal.desc)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monsters' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Skull className="w-4 h-4 text-rose-700" />
                  <span>
                    {isEn
                      ? '4 Monster Difficulty Tiers for Looting (PvPvE Drops)'
                      : '4 Niveles de Dificultad de Monstruos para Lootear (PvPvE)'}
                  </span>
                </h3>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 h-48">
                <img
                  src={GDD_IMAGES.cryptBestiary.src}
                  alt={t(GDD_IMAGES.cryptBestiary.title)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GDD_MONSTER_TIERS.map((tier) => (
                  <div key={tier.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-[11px] font-semibold uppercase text-amber-800 block">
                          {t(tier.difficultyLabel)}
                        </span>
                        <h4 className="text-sm font-bold text-slate-950">
                          Tier {tier.tierLevel} · {t(tier.tierName)}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{t(tier.actsActive)}</span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>{isEn ? 'Chest / Vault:' : 'Cofre / Fuente:'}</strong> {t(tier.chestType)}
                      </div>
                      <div>
                        <strong>{isEn ? 'Unlock Rule:' : 'Condición de Saqueo:'}</strong> {t(tier.lootingRule)}
                      </div>
                      <div>
                        <strong>{isEn ? 'Mode Scaling:' : 'Escalado:'}</strong> {t(tier.squadScaling)}
                      </div>
                      <div>
                        <strong>{isEn ? 'PvP Risk:' : 'Riesgo PvP:'}</strong>{' '}
                        <span className="text-amber-900 font-semibold">{t(tier.pvpAlertRadius)}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {tier.monsters.map((m) => (
                        <div key={m.name.en} className="p-2 bg-white rounded-lg border border-slate-200 text-xs">
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>{t(m.name)}</span>
                            <span className="font-mono text-slate-600">{m.hp}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5 leading-snug">{t(m.combatBehavior)}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-700">
                      <strong>{isEn ? 'Guaranteed:' : 'Garantizado:'}</strong> {t(tier.lootGuarantee)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-100">
                      <th className="py-2 px-3 font-semibold">{isEn ? 'Difficulty Tier' : 'Nivel PvE'}</th>
                      <th className="py-2 px-2.5 font-semibold text-right">{isEn ? 'Rusted' : 'Forja Ox.'}</th>
                      <th className="py-2 px-2.5 font-semibold text-right">{isEn ? 'Tempered' : 'Acero T.'}</th>
                      <th className="py-2 px-2.5 font-semibold text-right">{isEn ? 'Astral' : 'Alquimia'}</th>
                      <th className="py-2 px-2.5 font-semibold text-right">{isEn ? 'Cursed' : 'Reliquia M.'}</th>
                      <th className="py-2 px-2.5 font-semibold text-right">{isEn ? 'Royal' : 'Vestigio R.'}</th>
                      <th className="py-2 px-3 font-semibold">{isEn ? 'Guaranteed Loot' : 'Botín Garantizado'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white tabular-nums">
                    {GDD_MONSTER_TIERS.map((tier) => (
                      <tr key={tier.id}>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          Tier {tier.tierLevel} · {t(tier.tierName)}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-600">{tier.dropRates.oxidized}</td>
                        <td className="py-2 px-2.5 text-right font-mono text-emerald-700">{tier.dropRates.tempered}</td>
                        <td className="py-2 px-2.5 text-right font-mono text-sky-700">{tier.dropRates.astral}</td>
                        <td className="py-2 px-2.5 text-right font-mono text-violet-700">{tier.dropRates.cursed}</td>
                        <td className="py-2 px-2.5 text-right font-mono font-bold text-amber-700">{tier.dropRates.royal}</td>
                        <td className="py-2 px-3 text-slate-700">{t(tier.lootGuarantee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'combat_arch' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-rose-600" />
                    <span>{isEn ? 'Tactical 3D Combat & Three-Bar Management' : 'Combate TPS Táctico y Tres Barras'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>
                      <strong>{isEn ? 'Real Hitboxes & Steel Parry:' : 'Hitboxes Reales y Parry de Acero:'}</strong>{' '}
                      {isEn
                        ? 'Sweeping Executioner Greatsword arcs cleave multiple targets; timed parries open critical riposte windows.'
                        : 'Arcos físicos con mandoble y parry preciso para abrir ventanas críticas en duelos 1 vs 1.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Vitality, Aether & Stamina:' : 'Vitalidad, Éter y Estamina:'}</strong>{' '}
                      {isEn
                        ? 'Balances crimson HP, arcane Aether for Seal casts, and Stamina for blocks, dodges, and charged cleaves.'
                        : 'Vitalidad Carmesí, Éter arcano para activar Sellos y Estamina para esquives y bloqueos pesados.'}
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>{isEn ? '200-Player Unreal Engine 5 Architecture' : 'Arquitectura UE5 para 200 Jugadores'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>
                      <strong>{isEn ? 'Replication Graph (50–80m):' : 'Replication Graph (50–80m):'}</strong>{' '}
                      {isEn
                        ? 'High-frequency melee/seal relevancy within combat range to lock 60+ FPS with 200 active players.'
                        : 'Replicación de alta frecuencia en radio cercano para sostener 60+ FPS con 200 jugadores y PvE activo.'}
                    </li>
                    <li>
                      <strong>{isEn ? 'Modular Skeletal Mesh + Niagara GPU:' : 'Skeletal Mesh Modular + Niagara GPU:'}</strong>{' '}
                      {isEn
                        ? 'Real-time 5-tier Valdris armor swapping paired with GPU-instanced Aether Seal VFX.'
                        : 'Intercambio modular en tiempo real de los 5 tiers de Valdris y VFX instanciados en GPU.'}
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-emerald-700" />
                  <span>{isEn ? 'Four Regions of Valdris (POIs)' : 'Los 4 Biomas Estratégicos de Valdris (POIs)'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GDD_POIS.map((poi) => (
                    <div key={poi.name.en} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="text-xs font-bold text-slate-900">{t(poi.name)}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{t(poi.desc)}</p>
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
                ? `${GDD_META.projectTitle} — Original Game Design Document`
                : `${GDD_META.projectTitle} — Documento Original de Diseño (GDD)`}
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
