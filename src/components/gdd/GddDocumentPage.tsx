import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  FileCheck2,
  Loader2,
  Lock,
  Unlock,
  X,
  Maximize2,
  Shield,
  Swords,
  Skull,
  Sparkles,
  Map as MapIcon,
  Cpu,
  Presentation,
  BookOpen,
  Dices,
} from 'lucide-react';
import {
  GDD_IMAGES,
  GDD_META,
  GDD_ACTS,
  GDD_RARITIES,
  GDD_MONSTER_TIERS,
  GDD_SEALS,
  GDD_POIS,
  GDD_PITCH_SLIDES,
  IS_GDD_PUBLICLY_RELEASED,
  GddReferenceImage,
} from '../../data/gddData';
import { exportGddToPdf } from '../../utils/gddPdfExport';

interface GddDocumentPageProps {
  initialLanguage?: 'es' | 'en';
  onBackToPortfolio: () => void;
}

type DocumentViewMode = 'gdd' | 'pitch';

export const GddDocumentPage: React.FC<GddDocumentPageProps> = ({
  initialLanguage = 'es',
  onBackToPortfolio,
}) => {
  const [language, setLanguage] = useState<'es' | 'en'>(initialLanguage);
  const [viewMode, setViewMode] = useState<DocumentViewMode>('gdd');
  const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GddReferenceImage | null>(null);
  const [simTierId, setSimTierId] = useState<string>('tier-3');
  const [simMode, setSimMode] = useState<'errante' | 'juramento'>('juramento');
  const [simResult, setSimResult] = useState<Array<{
    item: string;
    tierName: string;
    swatchHex: string;
  }> | null>(null);
  const currentYear = new Date().getFullYear();
  const documentDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!lightboxImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxImage]);

  const handleSimulateMonsterLoot = (tierId: string) => {
    const tier = GDD_MONSTER_TIERS.find((item) => item.id === tierId) || GDD_MONSTER_TIERS[0];
    const parsePct = (val: string) => parseInt(val.replace('%', ''), 10) || 0;
    const weights = [
      { key: 'oxidized', pct: parsePct(tier.dropRates.oxidized), rarity: GDD_RARITIES[0] },
      { key: 'tempered', pct: parsePct(tier.dropRates.tempered), rarity: GDD_RARITIES[1] },
      { key: 'astral', pct: parsePct(tier.dropRates.astral), rarity: GDD_RARITIES[2] },
      { key: 'cursed', pct: parsePct(tier.dropRates.cursed), rarity: GDD_RARITIES[3] },
      { key: 'royal', pct: parsePct(tier.dropRates.royal), rarity: GDD_RARITIES[4] },
    ];

    const poolByRarity: Record<string, { es: string[]; en: string[] }> = {
      oxidized: {
        es: ['Cuchillo de Hierro Templado', 'Coraza de Cuero Raído', 'Ballesta Ligera Oxidada', 'Vial Carmesí Menor'],
        en: ['Tempered Iron Knife', 'Worn Leather Cuirass', 'Rusted Light Crossbow', 'Minor Crimson Vial'],
      },
      tempered: {
        es: ['Espada Bastarda Templada', 'Grebas de Acero Remachado', 'Elixir Purificador x2', 'Sello de Traslación'],
        en: ['Tempered Bastard Sword', 'Riveted Steel Greaves', 'Purifying Elixir x2', 'Relocation Seal'],
      },
      astral: {
        es: ['Mandoble de Ascuas Astral', 'Botas Anti-Miasma de Valdris', 'Ballesta de Repetición Voltaica', 'Sello del Bastión'],
        en: ['Astral Ember Greatsword', 'Valdris Anti-Miasma Boots', 'Voltaic Repeating Crossbow', 'Bastion Seal'],
      },
      cursed: {
        es: ['Mandoble del Juramento Roto (Ejecución)', 'Yelmo Etéreo de Catacumba', 'Sello de Ejecución (Lanza Umbría)', 'Sello de Restauración'],
        en: ['Oathbreaker Greatsword (Execution)', 'Ethereal Catacomb Helm', 'Execution Seal (Umbral Lance)', 'Restoration Seal'],
      },
      royal: {
        es: ['Vestigio Real: Corona de Ceniza (Único)', 'Vestigio Real: Mandoble del Rey Sin Nombre', 'Vestigio Real: Coraza del Trono Negro', 'Sello de Égida (Manto de Éter)'],
        en: ['Royal Vestige: Ash Crown (Unique)', 'Royal Vestige: Nameless King Greatsword', 'Royal Vestige: Black Throne Cuirass', 'Aegis Seal (Aether Cloak)'],
      },
    };

    const rollOnce = (forceMinIdx = 0) => {
      const rand = Math.random() * 100;
      let acc = 0;
      let chosenIdx = forceMinIdx;
      for (let i = 0; i < weights.length; i++) {
        acc += weights[i].pct;
        if (rand <= acc) {
          chosenIdx = Math.max(i, forceMinIdx);
          break;
        }
      }
      const chosen = weights[chosenIdx];
      const names = poolByRarity[chosen.key][language];
      const picked = names[Math.floor(Math.random() * names.length)];
      return {
        item: picked,
        tierName: isEn ? chosen.rarity.tier.en : chosen.rarity.tier.es,
        swatchHex: chosen.rarity.swatchHex,
      };
    };

    const dropCount = simMode === 'juramento' ? (tier.tierLevel === 'I' ? 2 : 3) : tier.tierLevel === 'I' ? 1 : 2;
    const minRarityIdx =
      tier.tierLevel === 'IV' ? 4 : tier.tierLevel === 'III' ? 3 : tier.tierLevel === 'II' ? 2 : 0;

    const drops = Array.from({ length: dropCount }, (_, idx) =>
      rollOnce(idx === 0 ? minRarityIdx : 0)
    );
    setSimResult(drops);
  };

  const isEn = language === 'en';
  const t = (obj: { es: string; en: string }) => (isEn ? obj.en : obj.es);

  const activeFilePrefix =
    viewMode === 'pitch'
      ? `PitchDeck_The_Last_Relic_${language.toUpperCase()}`
      : `GDD_The_Last_Relic_INDAUTOR_${language.toUpperCase()}`;

  const handleExportPdf = async () => {
    setIsExporting(true);
    setExportProgress(isEn ? 'Preparing pages...' : 'Preparando páginas...');
    const fileName = `${activeFilePrefix}.pdf`;

    await exportGddToPdf('gdd-print-sheet', {
      fileName,
      paperSize,
      onProgress: (curr, total) => {
        setExportProgress(
          isEn
            ? `Rendering ${viewMode === 'pitch' ? 'slide' : 'page'} ${curr} of ${total}...`
            : `Renderizando ${viewMode === 'pitch' ? 'diapositiva' : 'página'} ${curr} de ${total}...`
        );
      },
      onFinish: () => {
        setIsExporting(false);
        setExportProgress(null);
      },
      onError: () => {
        setIsExporting(false);
        setExportProgress(null);
      },
    });
  };

  const handleNativePrint = () => {
    const prevTitle = document.title;
    document.title = activeFilePrefix;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 5000);
  };

  const PageChrome: React.FC<{
    pageNumber: number;
    totalPages: number;
    unitLabel?: string;
    sectionLabel: string;
    children: React.ReactNode;
  }> = ({ pageNumber, totalPages, unitLabel, sectionLabel, children }) => {
    const resolvedUnit = unitLabel || (isEn ? 'Page' : 'Página');
    return (
      <section
        className="gdd-pdf-page bg-[#FBF9F5] text-stone-900 border border-stone-300 shadow-lg mx-auto flex flex-col justify-between print:border-0 print:shadow-none"
        style={{
          width: paperSize === 'letter' ? '215.9mm' : '210mm',
          minHeight: paperSize === 'letter' ? '279.4mm' : '297mm',
          padding: '15mm 16mm 14mm 16mm',
        }}
      >
        <div>
          <header className="flex items-center justify-between border-b border-stone-300 pb-2.5 mb-5 text-[11px] text-stone-500">
            <div className="flex items-center gap-2 font-medium tracking-wide uppercase">
              <span className="text-stone-900 font-semibold">{GDD_META.shortTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{sectionLabel}</span>
            </div>
            <div className="font-mono tabular-nums text-stone-600">{GDD_META.version}</div>
          </header>

          {children}
        </div>

        <footer className="mt-6 pt-2.5 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500">
          <div>
            <span>© {currentYear} {GDD_META.projectTitle}</span>
            <span aria-hidden="true"> · </span>
            <span>
              {isEn
                ? 'Original Game Design Document · Valdris Universe'
                : 'Documento Original de Diseño de Videojuego · Universo de Valdris'}
            </span>
          </div>
          <div className="font-mono tabular-nums text-stone-700 font-semibold">
            {resolvedUnit} {pageNumber} {isEn ? 'of' : 'de'} {totalPages}
          </div>
        </footer>
      </section>
    );
  };

  const ReferencePlate: React.FC<{
    image: GddReferenceImage;
    heightClass?: string;
  }> = ({ image, heightClass = 'h-48' }) => (
    <figure className="space-y-1.5">
      <div
        onClick={() => setLightboxImage(image)}
        className={`group relative w-full ${heightClass} bg-stone-900 border border-stone-300 overflow-hidden cursor-pointer`}
      >
        <img
          src={image.src}
          alt={t(image.title)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          aria-label={isEn ? 'Inspect full resolution' : 'Ampliar imagen'}
          className="no-print opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-2 p-1.5 bg-stone-950/85 text-stone-100 border border-stone-700 text-xs flex items-center gap-1"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <figcaption className="text-[10.5px] text-stone-600 leading-snug font-serif-custom italic">
        <strong className="not-italic font-sans text-stone-900">{image.figureNumber}</strong> — {t(image.title)}.{' '}
        {t(image.caption)}
      </figcaption>
    </figure>
  );

  return (
    <div className="min-h-screen bg-stone-200 text-stone-900 print:bg-white">
      {/* Top Control Bar */}
      <div className="no-print sticky top-0 z-40 bg-stone-950 text-stone-100 border-b border-stone-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Back */}
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-200 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to Portfolio' : 'Volver al Portafolio'}</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                  {IS_GDD_PUBLICLY_RELEASED ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span>
                    {IS_GDD_PUBLICLY_RELEASED
                      ? isEn
                        ? 'Published IP'
                        : 'IP Pública'
                      : isEn
                        ? 'Internal INDAUTOR Registry Mode (URL Only)'
                        : 'Registro Interno INDAUTOR (Solo URL)'}
                  </span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate text-stone-200 font-medium">{GDD_META.projectTitle}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* GDD vs 10-Slide Pitch Deck Switcher */}
            <div className="flex items-center p-0.5 bg-stone-900 border border-stone-700 rounded-md text-xs">
              <button
                type="button"
                onClick={() => setViewMode('gdd')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'gdd'
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isEn ? 'Master GDD (6 Pages)' : 'GDD Maestro (6 Págs.)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('pitch')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'pitch'
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>{isEn ? 'Pitch Deck (10 Slides)' : 'Pitch Deck (10 Diapositivas)'}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center p-0.5 bg-stone-900 border border-stone-700 rounded-md text-xs">
              <button
                type="button"
                onClick={() => setLanguage('es')}
                className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === 'es' ? 'bg-stone-100 text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === 'en' ? 'bg-stone-100 text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Paper Format */}
            <div className="flex items-center p-0.5 bg-stone-900 border border-stone-700 rounded-md text-xs">
              <button
                type="button"
                onClick={() => setPaperSize('letter')}
                className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  paperSize === 'letter'
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {isEn ? 'Letter' : 'Carta'}
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('a4')}
                className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  paperSize === 'a4'
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                A4
              </button>
            </div>

            {/* Native Print / Vector PDF */}
            <button
              type="button"
              onClick={handleNativePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEn ? 'Print PDF' : 'Imprimir PDF'}</span>
            </button>

            {/* Primary PDF Download */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-md transition-colors disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>
                {isExporting
                  ? exportProgress
                  : viewMode === 'pitch'
                    ? isEn
                      ? 'Export Pitch PDF'
                      : 'Exportar Pitch PDF'
                    : isEn
                      ? 'Export PDF (INDAUTOR)'
                      : 'Exportar PDF (INDAUTOR)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Page Print & PDF Canvas */}
      <main className="py-8 px-4 sm:px-6 overflow-x-auto print:p-0 print:overflow-visible">
        <div id="gdd-print-sheet" className="space-y-8 print:space-y-0">
          {viewMode === 'gdd' ? (
            <>
              {/* ================= PAGE 1: COVER & WORK TECHNICAL SHEET ================= */}
              <PageChrome
                pageNumber={1}
                totalPages={6}
                sectionLabel={isEn ? 'Cover & Work Technical Sheet' : 'Portada y Ficha Técnica de Obra'}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest">
                    <span>{t(GDD_META.workClassification)}</span>
                    <span className="font-mono tabular-nums">{documentDate}</span>
                  </div>

                  <div className="border-b border-stone-300 pb-4 space-y-2">
                    <h1 className="text-4xl font-serif-custom font-bold text-stone-950 tracking-tight leading-tight text-balance">
                      {GDD_META.projectTitle}
                    </h1>
                    <p className="text-sm text-stone-700 font-medium leading-relaxed max-w-3xl">
                      {isEn
                        ? 'Master Game Design Document — 200-Player Tactical Third-Person Medieval Battle Royale (PvPvE) in Unreal Engine 5. Oath Mode (Duos, Trios & Quads stay united and win together) & Wanderer Mode (Solo 1 vs 199, single victor).'
                        : 'Documento Maestro de Diseño de Videojuego (Edición IP Original) — Battle Royale Táctico en Tercera Persona / Acción Medieval Oscura / PvPvE para 200 Jugadores en Unreal Engine 5. Modo Juramento (Dúos, Tríos y Cuartetos nunca se separan y ganan en conjunto) y Modo Errante (Solo 1 vs 199, único ganador).'}
                    </p>
                  </div>

                  <ReferencePlate image={GDD_IMAGES.keyart} heightClass="h-60" />

                  <div className="border border-stone-300 bg-white p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-2">
                      <FileCheck2 className="w-4 h-4 text-amber-800" />
                      <span>
                        {isEn
                          ? 'Work Identification & Technical Specification Sheet'
                          : 'Ficha de Identificación de la Obra y Especificación Técnica'}
                      </span>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div className="flex justify-between gap-2 border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">{isEn ? 'Work Title' : 'Título de la Obra'}</dt>
                        <dd className="font-semibold text-stone-900 text-right">{GDD_META.projectTitle}</dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">{isEn ? 'Classification' : 'Clasificación'}</dt>
                        <dd className="font-semibold text-stone-900 text-right">{t(GDD_META.workClassification)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">{isEn ? 'Genre' : 'Género'}</dt>
                        <dd className="font-medium text-stone-800 text-right">{t(GDD_META.genre)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">{isEn ? 'Match Scale & Modes' : 'Escala y Modos'}</dt>
                        <dd className="font-medium text-stone-800 text-right">{t(GDD_META.scale)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">{isEn ? 'Target Engine' : 'Motor Objetivo'}</dt>
                        <dd className="font-medium text-stone-800 text-right">{GDD_META.targetEngine}</dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-stone-100 pb-1">
                        <dt className="text-stone-500">{isEn ? 'Edition' : 'Edición de Depósito'}</dt>
                        <dd className="font-mono text-[11px] text-stone-800 text-right">{GDD_META.version}</dd>
                      </div>
                    </dl>

                    <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
                      <strong className="text-stone-900">{isEn ? 'Scope of Work:' : 'Alcance de la Obra:'}</strong>{' '}
                      {isEn
                        ? `All original game mechanics, worldbuilding of Valdris, The Abyssal Ash storm loop, 5-act tactical cycle, 5 Quality Tiers, 8 Aether Seals, 4-tier PvE monster taxonomy, loot drop matrices, biomes, and visual reference plates compiled in this manuscript belong to the original IP ${GDD_META.projectTitle}.`
                        : `Todas las mecánicas originales de juego, el universo de Valdris, La Ceniza Abisal, el ciclo táctico de 5 actos, los 5 Tiers de Calidad, los 8 Sellos de Éter, el ecosistema de monstruos PvE por niveles de dificultad con tablas de botín, los 4 biomas estratégicos y las láminas conceptuales reunidos en este documento conforman la obra original ${GDD_META.projectTitle}.`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      {isEn ? 'Document Structure Index' : 'Índice General del Documento'}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs border-t border-stone-300 pt-2.5">
                      <div className="flex justify-between">
                        <span>01. {isEn ? 'Valdris Lore, Modes & 5-Act Cycle' : 'Universo Valdris, Modos y Ciclo de 5 Actos'}</span>
                        <span className="font-mono tabular-nums text-stone-500">Pág. 2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>02. {isEn ? '5 Quality Tiers, Slots & 8 Aether Seals' : '5 Tiers de Calidad, Ranuras y 8 Sellos de Éter'}</span>
                        <span className="font-mono tabular-nums text-stone-500">Pág. 3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>03. {isEn ? 'PvE Monster Difficulties & Loot Drops' : 'Dificultades (Monstruos PvE) y Tablas de Loot'}</span>
                        <span className="font-mono tabular-nums text-stone-500">Pág. 4</span>
                      </div>
                      <div className="flex justify-between">
                        <span>04. {isEn ? 'TPS Combat, Resources & 4 Valdris Biomes' : 'Combate TPS, Barras y 4 Biomas de Valdris'}</span>
                        <span className="font-mono tabular-nums text-stone-500">Pág. 5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>05. {isEn ? 'UE5 Netcode (200P) & Protected IP Summary' : 'Arquitectura UE5 (200J) y Síntesis de Obra'}</span>
                        <span className="font-mono tabular-nums text-stone-500">Pág. 6</span>
                      </div>
                      <div className="flex justify-between text-amber-900 font-medium">
                        <span>{isEn ? 'Companion Tab: Commercial Pitch Deck' : 'Pestaña Anexa: Pitch Deck Comercial'}</span>
                        <span className="font-mono tabular-nums">10 Slides</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PageChrome>

              {/* ================= PAGE 2: LORE, MODES & 5-ACT MATCH CYCLE ================= */}
              <PageChrome
                pageNumber={2}
                totalPages={6}
                sectionLabel={isEn ? '01. World, Modes & 5-Act Cycle' : '01. Universo, Modos y Ciclo de 5 Actos'}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-serif-custom font-bold text-stone-950">
                      {isEn
                        ? '01. Universe & Identity: The Cursed Continent of Valdris'
                        : '01. Universo e Identidad: El Continente Maldito de Valdris'}
                    </h2>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {isEn
                        ? 'Across the cursed continent of Valdris, every blood moon unleashes The Abyssal Ash—an encroaching arcane storm unleashed when the ancient kings broke their sacred oath. Two hundred mercenaries, fallen knights, and wandering sorcerers descend to claim The Iron Crown. Valdris recognizes no fixed classes or guilds: a warrior is forged by looted steel and Aether Seals. Fight side-by-side in loyal Duos, Trios, or Quads that win together as one company—or enter Wanderer Mode, where only 1 survivor claims the crown.'
                        : 'En el continente maldito de Valdris, cada luna de sangre desciende La Ceniza Abisal, una tormenta arcana liberada tras el antiguo juramento roto del reino. Doscientos mercenarios, caballeros caídos y hechiceros errantes descienden a las ruinas para reclamar La Corona de Hierro. En Valdris no existen clases ni linajes fijos: tu estilo nace del acero y los Sellos de Éter que saqueas. Combate unido en Dúos, Tríos o Cuartetos que jamás se separan y ganan en conjunto, o entra al Modo Errante, donde solo 1 vencedor reclama la corona.'}
                    </p>
                  </div>

                  <ReferencePlate image={GDD_IMAGES.citadelSiege} heightClass="h-48" />

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="border border-stone-300 bg-white p-3.5 space-y-1">
                      <div className="text-xs font-bold text-stone-950">
                        {isEn
                          ? 'Oath Mode: Duos, Trios & Quads (Team Victory)'
                          : 'Modo Juramento: Dúos, Tríos y Cuartetos (Victoria Conjunta)'}
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {isEn
                          ? 'Duos, Trios, and Quads NEVER split, have zero friendly fire, and win together. In Acts I–III, fallen teammates respawn in 60s if 1+ ally stays alive; if all allies die during the timer, the squad is eliminated.'
                          : 'Los Dúos, Tríos y Cuartetos NUNCA se separan, no tienen fuego amigo y ganan en conjunto. En Actos I–III, un caído reaparece en 60s si queda 1+ aliado vivo; si mueren los demás, el equipo es eliminado.'}
                      </p>
                    </div>
                    <div className="border border-stone-300 bg-white p-3.5 space-y-1">
                      <div className="text-xs font-bold text-stone-950">
                        {isEn ? 'Wanderer Mode (Solo · 1 vs 199 · Single Winner)' : 'Modo Errante (Solo · 1 vs 199 · Único Ganador)'}
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {isEn
                          ? 'Extreme individual survival with zero alliances from second zero. It is the only queue crowned by 1 sole survivor inside the Throne Room.'
                          : 'Supervivencia individual extrema sin alianzas desde el segundo cero. Es el único modo de juego donde solo existe 1 único ganador en el Salón del Trono.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-stone-900">
                      {isEn
                        ? '02. The 5-Act Match Cycle (15–18 Min)'
                        : '02. El Ciclo de Partida en 5 Actos (15–18 Min)'}
                    </h3>
                    <div className="border border-stone-300 bg-white overflow-hidden">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-stone-900 text-stone-100">
                            <th className="py-2 px-2.5 font-semibold">{isEn ? 'Act' : 'Acto'}</th>
                            <th className="py-2 px-2.5 font-semibold">{isEn ? 'Time' : 'Tiempo'}</th>
                            <th className="py-2 px-2.5 font-semibold">{isEn ? 'Survivors' : 'Supervivientes'}</th>
                            <th className="py-2 px-2.5 font-semibold">
                              {isEn ? 'World Rules & Dynamic' : 'Reglas y Dinámica del Mundo'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {GDD_ACTS.map((item) => (
                            <tr key={item.time} className="align-top">
                              <td className="py-2 px-2.5 font-semibold text-stone-900 whitespace-nowrap">
                                {t(item.act)}
                              </td>
                              <td className="py-2 px-2.5 font-mono tabular-nums text-stone-700 whitespace-nowrap">
                                {item.time}
                              </td>
                              <td className="py-2 px-2.5 font-mono tabular-nums font-semibold text-amber-900 whitespace-nowrap">
                                {item.survivors}
                              </td>
                              <td className="py-2 px-2.5 text-stone-600 leading-snug">
                                {t(item.dynamic)}{' '}
                                <span className="text-stone-900 font-medium">({t(item.allegianceState)})</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border border-stone-300 bg-stone-100 p-3 space-y-1">
                    <div className="text-xs font-bold text-stone-950">
                      {isEn
                        ? 'Respawn Rules: 60s Survival Window (Acts I–III) & Permanent Lock (Act IV+)'
                        : 'Regla de Respawn: Ventana de 60s (Actos I–III) y Cierre Definitivo (Desde Acto IV)'}
                    </div>
                    <p className="text-[11px] text-stone-700 leading-relaxed">
                      {isEn
                        ? 'During Acts I–III, a downed squadmate enters a 60-second respawn timer requiring at least 1 living teammate to survive until the countdown finishes—if all remaining allies die within those 60s, the entire squad is eliminated immediately. Starting in Act IV (14:00, Black Bell), all team respawns are permanently disabled until the Throne Room victory.'
                        : 'Durante los Actos I–III, un miembro abatido inicia un conteo de 60 segundos para hacer respawn, condición obligatoria mientras al menos 1 miembro del equipo permanezca vivo; si durante esos 60s mueren los demás integrantes, el equipo completo queda eliminado al instante. A partir del Acto IV (14:00, Campana Negra), no hay respawn de miembros del equipo hasta la victoria final en el Salón del Trono.'}
                    </p>
                  </div>
                </div>
              </PageChrome>

              {/* ================= PAGE 3: QUALITY TIERS, SLOTS & 8 AETHER SEALS ================= */}
              <PageChrome
                pageNumber={3}
                totalPages={6}
                sectionLabel={
                  isEn ? '03–04. Valdris Tiers, Equipment & Aether Seals' : '03–04. Tiers, Ranuras y Sellos de Éter'
                }
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-serif-custom font-bold text-stone-950">
                      {isEn
                        ? '03. Rarity System & Dynamic Identity (Zero Fixed Classes)'
                        : '03. Sistema de Rarezas y Equipamiento (Identidad Dinámica)'}
                    </h2>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {isEn
                        ? 'All 200 players drop identically armed: traveler rags, an iron knife, and 2 minor vials. Your combat identity transforms within seconds based on the gear scavenged and Aether Seals unlocked.'
                        : 'Todos los jugadores inician idénticos: harapos de viajero, un cuchillo de hierro y 2 viales menores. Tu estilo de combate se transforma en segundos según lo que saquees y los Sellos de Éter equipados.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ReferencePlate image={GDD_IMAGES.armorTiers} heightClass="h-40" />
                    <ReferencePlate image={GDD_IMAGES.lootRelics} heightClass="h-40" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                      <span>
                        {isEn ? 'Valdris Quality Scale (5 Tiers)' : 'Escala de Calidad (5 Tiers de Valdris)'}
                      </span>
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {GDD_RARITIES.map((r) => (
                        <div key={r.swatchHex} className="border border-stone-300 bg-white p-2 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 shrink-0 border border-stone-400"
                              style={{ backgroundColor: r.swatchHex }}
                            />
                            <span className="text-[10.5px] font-bold text-stone-950 leading-tight">
                              {t(r.tier)}
                            </span>
                          </div>
                          <div className="text-[9.5px] font-mono text-stone-500">{t(r.colorLabel)}</div>
                          <p className="text-[9.5px] text-stone-700 leading-snug">{t(r.desc)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3.5">
                    <div className="col-span-5 border border-stone-300 bg-white p-3 space-y-2">
                      <h4 className="text-xs font-bold text-stone-950 flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
                        <Shield className="w-3.5 h-3.5 text-stone-700" />
                        <span>
                          {isEn ? 'Universal Character Slots' : 'Ranuras Universales de Personaje'}
                        </span>
                      </h4>
                      <ul className="space-y-1.5 text-[10.5px] text-stone-700 leading-snug">
                        <li>
                          <strong className="text-stone-900">
                            {isEn ? 'Two Quick-Swap Weapons:' : 'Dos Armas en Cambio Rápido:'}
                          </strong>{' '}
                          {isEn
                            ? 'Instant toggle between melee and ranged (e.g., Executioner Greatsword + Repeating Crossbow or Ash Scepter).'
                            : 'Alterna al instante entre combate cercano y distancia (ej. Mandoble de Verdugo + Ballesta de Repetición o Cetro de Ceniza).'}
                        </li>
                        <li>
                          <strong className="text-stone-900">
                            {isEn ? 'Four Armor Pieces (Hybrid Weight):' : 'Cuatro Piezas de Armadura (Peso Híbrido):'}
                          </strong>{' '}
                          {isEn
                            ? 'Helm, Cuirass, Greaves, Boots. Mixing heavy plate and cloth dynamically shifts physical mitigation, movement speed, and Aether regen.'
                            : 'Yelmo, Coraza, Grebas y Botas. Combinar piezas pesadas y de tela ajusta dinámicamente mitigación física, velocidad y regeneración de Éter.'}
                        </li>
                        <li>
                          <strong className="text-stone-900">
                            {isEn ? 'Vial Belt (Keys 1–4):' : 'Cinturón de Viales (Teclas 1–4):'}
                          </strong>{' '}
                          {isEn
                            ? '1. Crimson Vial (Vitality), 2. Aether Vial (Arcane energy), 3. Vigor Tonic (Instant stamina for dodges/blocks), 4. Purifying Elixir (Clears poison, burn, slow).'
                            : '1. Vial Carmesí (Vitalidad), 2. Vial de Éter (Energía arcana), 3. Tónico de Vigor (Estamina instantánea), 4. Elixir Purificador (Limpia veneno/quemadura).'}
                        </li>
                      </ul>
                    </div>

                    <div className="col-span-7 border border-stone-300 bg-white p-3 space-y-1.5">
                      <h4 className="text-xs font-bold text-stone-950 border-b border-stone-200 pb-1.5">
                        {isEn
                          ? '04. 8 Aether Seals (3 Active Swappable Rune Slots)'
                          : '04. 8 Sellos de Éter (3 Ranuras Activas Intercambiables)'}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        {GDD_SEALS.map((seal) => (
                          <div key={seal.name.en} className="border-b border-stone-100 pb-1 space-y-0.5">
                            <div className="flex items-center justify-between gap-1 text-[10px]">
                              <strong className="text-stone-950">
                                {t(seal.name)} <span className="font-normal text-stone-500">({t(seal.subName)})</span>
                              </strong>
                            </div>
                            <div className="text-[9px] font-mono tabular-nums text-amber-900">
                              {t(seal.category)} · {seal.cost}
                            </div>
                            <p className="text-[9.5px] text-stone-600 leading-tight">{t(seal.desc)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PageChrome>

              {/* Interactive On-Screen Loot Simulator (Excluded from PDF & Print) */}
              <div
                className="no-print mx-auto bg-stone-900 text-stone-100 border border-stone-700 p-4 shadow-md space-y-3"
                style={{ width: paperSize === 'letter' ? '215.9mm' : '210mm' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Dices className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        {isEn
                          ? 'Interactive Preview: Monster Difficulty Loot Simulator (Screen Only)'
                          : 'Simulador Interactivo: Dificultad de Monstruos para Lootear (Solo Pantalla)'}
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {isEn
                          ? 'Test how Tier I–IV monster difficulties unlock chests and roll Valdris drops (does not appear in exported PDF).'
                          : 'Prueba qué botín tira cada dificultad de monstruo según la matriz de probabilidad (no se imprime en el PDF de INDAUTOR).'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-stone-950 border border-stone-700 p-0.5 rounded text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSimMode('errante')}
                        className={`px-2 py-1 rounded cursor-pointer ${
                          simMode === 'errante' ? 'bg-stone-100 text-stone-950 font-semibold' : 'text-stone-400'
                        }`}
                      >
                        {isEn ? 'Wanderer (Solo)' : 'Errante (Solo)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimMode('juramento')}
                        className={`px-2 py-1 rounded cursor-pointer ${
                          simMode === 'juramento' ? 'bg-stone-100 text-stone-950 font-semibold' : 'text-stone-400'
                        }`}
                      >
                        {isEn ? 'Oath (Squad 4)' : 'Juramento (Escuadrón)'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulateMonsterLoot(simTierId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded cursor-pointer"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Roll Loot Drop' : 'Simular Loot Drop'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {GDD_MONSTER_TIERS.map((tier) => {
                    const active = simTierId === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          setSimTierId(tier.id);
                          handleSimulateMonsterLoot(tier.id);
                        }}
                        className={`text-left p-2 border rounded transition-colors cursor-pointer ${
                          active
                            ? 'bg-stone-800 border-amber-500 text-white'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-amber-400">
                          Tier {tier.tierLevel} · {t(tier.actsActive)}
                        </div>
                        <div className="text-xs font-semibold truncate">{t(tier.tierName)}</div>
                      </button>
                    );
                  })}
                </div>

                {simResult && (
                  <div className="bg-stone-950 border border-stone-800 p-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-stone-400 font-medium">
                      {isEn ? 'Simulated Chest Yield:' : 'Botín Obtenido:'}
                    </span>
                    {simResult.map((drop, i) => (
                      <span
                        key={`${drop.item}-${i}`}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-stone-900 border border-stone-700 text-stone-100"
                      >
                        <span
                          className="w-2 h-2 shrink-0"
                          style={{ backgroundColor: drop.swatchHex }}
                        />
                        <span className="font-semibold">{drop.item}</span>
                        <span className="text-[10px] text-stone-400">({drop.tierName})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= PAGE 4: MONSTER DIFFICULTIES & LOOT DROPS ================= */}
              <PageChrome
                pageNumber={4}
                totalPages={6}
                sectionLabel={
                  isEn
                    ? '05. Monster Difficulty for Looting & PvE Drops'
                    : '05. Dificultad de Monstruos para Lootear y Drops PvE'
                }
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h2 className="text-xl font-serif-custom font-bold text-stone-950 flex items-center gap-2">
                      <Skull className="w-5 h-5 text-amber-800" />
                      <span>
                        {isEn
                          ? '05. Monster Difficulty for Looting (PvPvE Seal-Gated Drops)'
                          : '05. Dificultad de Monstruos para Lootear (Botín Sellado PvPvE)'}
                      </span>
                    </h2>
                    <p className="text-[11.5px] text-stone-700 leading-relaxed">
                      {isEn
                        ? 'High-tier Valdris chests and reliquaries cannot be opened freely: they are locked behind four escalating PvE Monster Difficulty Tiers. Monster HP and patrol counts dynamically scale between Wanderer Mode (Solo) and Oath Mode (4-player squads), while breaking higher-tier seals broadcasts noise/light pings that draw rival PvP ambushes.'
                        : 'En Valdris, los mejores cofres y relicarios no pueden abrirse gratis: están sellados por cuatro niveles progresivos de dificultad PvE. La vida y patrullas escalan dinámicamente entre Modo Errante (Solo) y Modo Juramento (Escuadrones de 4), y romper sellos superiores alerta a jugadores rivales.'}
                    </p>
                  </div>

                  <ReferencePlate image={GDD_IMAGES.cryptBestiary} heightClass="h-32" />

                  <div className="grid grid-cols-2 gap-2.5">
                    {GDD_MONSTER_TIERS.map((tier) => (
                      <div key={tier.id} className="border border-stone-300 bg-white p-2.5 space-y-1">
                        <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider font-semibold text-amber-900">
                              {t(tier.difficultyLabel)}
                            </div>
                            <h3 className="text-[11.5px] font-bold text-stone-950">
                              Tier {tier.tierLevel} · {t(tier.tierName)}
                            </h3>
                          </div>
                          <span className="text-[9px] font-mono tabular-nums text-stone-500">
                            {t(tier.actsActive)}
                          </span>
                        </div>

                        <div className="text-[9.5px] text-stone-700 leading-tight space-y-0.5">
                          <div>
                            <strong className="text-stone-950">{isEn ? 'Loot Source:' : 'Cofre / Botín:'}</strong>{' '}
                            {t(tier.chestType)}
                          </div>
                          <div>
                            <strong className="text-stone-950">{isEn ? 'Unlock Rule:' : 'Condición de Saqueo:'}</strong>{' '}
                            {t(tier.lootingRule)}
                          </div>
                          <div>
                            <strong className="text-stone-950">{isEn ? 'Scaling:' : 'Escalado:'}</strong>{' '}
                            <span className="tabular-nums">{t(tier.squadScaling)}</span>
                          </div>
                          <div>
                            <strong className="text-stone-950">{isEn ? 'PvP Risk:' : 'Riesgo PvP:'}</strong>{' '}
                            <span className="text-amber-900 font-medium">{t(tier.pvpAlertRadius)}</span>
                          </div>
                        </div>

                        <div className="space-y-1 pt-0.5">
                          {tier.monsters.map((m) => (
                            <div key={m.name.en} className="bg-stone-50 border border-stone-200 px-1.5 py-1 space-y-0.5">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-stone-900">{t(m.name)}</span>
                                <span className="font-mono tabular-nums text-[9px] font-semibold text-stone-700">
                                  {m.hp} · {t(m.role)}
                                </span>
                              </div>
                              <p className="text-[9px] text-stone-600 leading-tight">{t(m.combatBehavior)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      {isEn
                        ? 'Monster Loot Drop Probability Matrix (Valdris Quality Scale)'
                        : 'Matriz de Probabilidad de Drop por Dificultad (Escala de Valdris)'}
                    </h3>
                    <div className="border border-stone-300 bg-white overflow-hidden">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-stone-900 text-stone-100">
                            <th className="py-1.5 px-2 font-semibold">{isEn ? 'Difficulty Tier' : 'Nivel PvE'}</th>
                            <th className="py-1.5 px-1.5 font-semibold text-right">
                              {isEn ? 'Rusted' : 'Forja Ox.'}
                            </th>
                            <th className="py-1.5 px-1.5 font-semibold text-right">
                              {isEn ? 'Tempered' : 'Acero T.'}
                            </th>
                            <th className="py-1.5 px-1.5 font-semibold text-right">
                              {isEn ? 'Astral' : 'Alquimia'}
                            </th>
                            <th className="py-1.5 px-1.5 font-semibold text-right">
                              {isEn ? 'Cursed' : 'Reliquia M.'}
                            </th>
                            <th className="py-1.5 px-1.5 font-semibold text-right">
                              {isEn ? 'Royal' : 'Vestigio R.'}
                            </th>
                            <th className="py-1.5 px-2 font-semibold">
                              {isEn ? 'Guaranteed Rule' : 'Regla Garantizada'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 tabular-nums">
                          {GDD_MONSTER_TIERS.map((tier) => (
                            <tr key={tier.id}>
                              <td className="py-1.5 px-2 font-semibold text-stone-900">
                                Tier {tier.tierLevel} · {t(tier.tierName)}
                              </td>
                              <td className="py-1.5 px-1.5 text-right font-mono text-stone-600">
                                {tier.dropRates.oxidized}
                              </td>
                              <td className="py-1.5 px-1.5 text-right font-mono text-emerald-800">
                                {tier.dropRates.tempered}
                              </td>
                              <td className="py-1.5 px-1.5 text-right font-mono text-sky-800">
                                {tier.dropRates.astral}
                              </td>
                              <td className="py-1.5 px-1.5 text-right font-mono text-violet-800">
                                {tier.dropRates.cursed}
                              </td>
                              <td className="py-1.5 px-1.5 text-right font-mono font-bold text-amber-800">
                                {tier.dropRates.royal}
                              </td>
                              <td className="py-1.5 px-2 text-stone-700">{t(tier.lootGuarantee)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </PageChrome>

              {/* ================= PAGE 5: TPS COMBAT & 4 BIOMES OF VALDRIS ================= */}
              <PageChrome
                pageNumber={5}
                totalPages={6}
                sectionLabel={
                  isEn ? '06. Tactical Combat & Valdris Biomes (POIs)' : '06. Combate Táctico y Biomas de Valdris'
                }
              >
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-serif-custom font-bold text-stone-950 flex items-center gap-2">
                      <Swords className="w-5 h-5 text-amber-800" />
                      <span>
                        {isEn
                          ? '06. Tactical Third-Person Combat & Continent POIs'
                          : '06. Combate Táctico TPS y Diseño del Continente de Valdris'}
                      </span>
                    </h2>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {isEn
                        ? 'Over-the-shoulder combat balances lethal steel swings, precision parries, ballistic projectiles, and vertical terrain play across four distinct regions converging on the Throne Room.'
                        : 'El combate en tercera persona combina barridos físicos reales de acero, bloqueos y parries cronometrados, proyectiles balísticos y control vertical del terreno en cuatro biomas estratégicos que convergen en el Salón del Trono.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ReferencePlate image={GDD_IMAGES.combatDuel} heightClass="h-48" />
                    <ReferencePlate image={GDD_IMAGES.biomesStudy} heightClass="h-48" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-stone-300 bg-white p-3 space-y-1">
                      <div className="text-xs font-bold text-stone-900">
                        {isEn ? 'Directional Hitboxes & Parry' : 'Hitboxes Reales y Parry'}
                      </div>
                      <p className="text-[10.5px] text-stone-600 leading-snug">
                        {isEn
                          ? 'Executioner Greatsword arcs cleave multiple foes simultaneously; timed steel parries open critical riposte windows during Act IV–V duels.'
                          : 'Los mandobles trazan arcos reales que golpean varios objetivos; un parry preciso rompe la guardia enemiga y abre ejecución en duelos del Acto IV–V.'}
                      </p>
                    </div>
                    <div className="border border-stone-300 bg-white p-3 space-y-1">
                      <div className="text-xs font-bold text-stone-900">
                        {isEn ? 'Vitality, Aether & Stamina' : 'Tríada: Vitalidad, Éter y Estamina'}
                      </div>
                      <p className="text-[10.5px] text-stone-600 leading-snug">
                        {isEn
                          ? 'Fuel attacks, dodges, and Aether Seals alongside the 1–4 Vial Belt (Crimson Vial, Aether Vial, Vigor Tonic, Purifying Elixir).'
                          : 'Gestión simultánea de Vitalidad Carmesí, Éter arcano (Sellos) y Estamina, respaldada por el Cinturón de Viales (1–4) de consumo táctico.'}
                      </p>
                    </div>
                    <div className="border border-stone-300 bg-white p-3 space-y-1">
                      <div className="text-xs font-bold text-stone-900">
                        {isEn ? 'Corpse Satchels & Mid-Fight Swap' : 'Botín en Cadáveres y Cambio Vivo'}
                      </div>
                      <p className="text-[10.5px] text-stone-600 leading-snug">
                        {isEn
                          ? 'Slain players and PvE bosses drop physical loot caches allowing instant upgrades of armor weight, vials, and Aether Seals.'
                          : 'Cada baja deja un alijo físico en el suelo para intercambiar piezas de los 5 Tiers de Valdris y Sellos de Éter en pleno asedio.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-amber-800" />
                      <span>
                        {isEn
                          ? '07. Four Core Regions of Valdris (POIs)'
                          : '07. Biomas y Puntos Estratégicos de Valdris (POIs)'}
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {GDD_POIS.map((poi) => (
                        <div key={poi.name.en} className="border border-stone-300 bg-white p-3 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[10px] text-stone-500">
                            <span>{t(poi.zoneTag)}</span>
                            <span className="font-semibold text-amber-900">{t(poi.threatLevel)}</span>
                          </div>
                          <h4 className="text-xs font-bold text-stone-950">{t(poi.name)}</h4>
                          <p className="text-[10.5px] text-stone-600 leading-snug">{t(poi.desc)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PageChrome>

              {/* ================= PAGE 6: UE5 ARCHITECTURE & ORIGINAL IP SUMMARY ================= */}
              <PageChrome
                pageNumber={6}
                totalPages={6}
                sectionLabel={
                  isEn ? '08. UE5 Architecture & Protected IP Summary' : '08. Arquitectura UE5 y Síntesis de Obra'
                }
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-serif-custom font-bold text-stone-950 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-amber-800" />
                      <span>
                        {isEn
                          ? '08. Unreal Engine 5 Multiplayer & Anti-Cheat Architecture (200P + PvE)'
                          : '08. Arquitectura UE5, Red (200 Jugadores) y Sistema Anti-Cheat'}
                      </span>
                    </h2>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {isEn
                        ? 'Engineered to sustain 60+ FPS across 200 concurrent mercenaries, Sealed Altar-Chest guardians, Catacomb bosses, and competitive anti-cheat enforcement.'
                        : 'Diseñada para sostener 60+ FPS con 200 mercenarios simultáneos, guardianes de Altar-Cofres Sellados, jefes de Catacumbas y blindaje anti-cheat competitivo.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="border border-stone-300 bg-white p-3.5 space-y-1">
                      <h3 className="text-xs font-bold text-stone-950">
                        1.{' '}
                        {isEn
                          ? 'Replication Graph & Spatial Relevancy (50–80m Radius)'
                          : 'Replication Graph y Relevancia Espacial (Radio 50–80m)'}
                      </h3>
                      <p className="text-[11px] text-stone-700 leading-relaxed">
                        {isEn
                          ? 'Dedicated servers stream high-frequency melee parry states, ballistic bolts, and Aether Seal triggers within a 50–80 meter relevancy cone, while throttling distant squads and idle PvE encounters.'
                          : 'Los servidores dedicados transmiten animaciones de parry, virotes balísticos y activación de Sellos de Éter a alta frecuencia dentro de un radio de 50–80 metros, reduciendo el ancho de banda para zonas distantes de Valdris.'}
                      </p>
                    </div>

                    <div className="border border-stone-300 bg-white p-3.5 space-y-1">
                      <h3 className="text-xs font-bold text-stone-950">
                        2.{' '}
                        {isEn
                          ? 'Server-Authoritative Combat, Sealed Chests & Queue Rules'
                          : 'Autoridad de Servidor, Altar-Cofres y Reglas de Victoria por Modo'}
                      </h3>
                      <p className="text-[11px] text-stone-700 leading-relaxed">
                        {isEn
                          ? 'Hit detection, PvE drop rolls, Royal Vestige uniqueness, 60s squad respawn timers (requiring 1+ living teammate; instant wipe if all fall), Act IV respawn lockout, and mode victory rules are validated authoritatively on the server.'
                          : 'La detección de impactos, las tiradas de botín PvE, los temporizadores de respawn de 60s (con mínimo 1 miembro vivo o eliminación total del equipo), el bloqueo de respawn desde el Acto IV y las condiciones de victoria se validan en el servidor.'}
                      </p>
                    </div>

                    <div className="border border-stone-300 bg-white p-3.5 space-y-1">
                      <h3 className="text-xs font-bold text-stone-950">
                        3.{' '}
                        {isEn
                          ? 'Modular Skeletal Mesh Assembly & GPU-Instanced Abyssal VFX'
                          : 'Skeletal Mesh Modular y VFX Instanciados en GPU (Niagara)'}
                      </h3>
                      <p className="text-[11px] text-stone-700 leading-relaxed">
                        {isEn
                          ? 'A single optimized base Skeletal Mesh swaps all 4 hybrid-weight armor pieces across the 5 Valdris Quality Tiers in real time, paired with GPU-instanced Niagara emitters for Aether Seals and The Abyssal Ash.'
                          : 'Un único Skeletal Mesh base intercambia en tiempo real las 4 piezas de armadura de los 5 Tiers de Valdris, combinado con emisores GPU en Niagara para Sellos de Éter y La Ceniza Abisal.'}
                      </p>
                    </div>

                    <div className="border border-stone-300 bg-white p-3.5 space-y-1">
                      <h3 className="text-xs font-bold text-stone-950">
                        4.{' '}
                        {isEn
                          ? 'Multilayer Anti-Cheat: Kernel Guard, Anti-ESP Occlusion & Teaming Telemetry'
                          : 'Sistema Anti-Cheat Multicapa: Kernel Guard, Culling Anti-ESP y Telemetría'}
                      </h3>
                      <p className="text-[11px] text-stone-700 leading-relaxed">
                        {isEn
                          ? 'Combines kernel-level memory/DLL anti-tamper (EAC/BattlEye class), server-side anti-ESP fog-of-war culling (occluded enemies, Catacomb bosses, and chests are never replicated to the client before valid line-of-sight), server physics checks (anti-speed/fly/loot duplication), and behavioral telemetry flagging inhuman parry reaction times (<80ms) or illicit teaming in Wanderer Mode (1v199).'
                          : 'Combina protección en kernel contra inyección de memoria y DLLs, culling anti-ESP en servidor (enemigos, jefes de Catacumbas y cofres ocluidos no se replican al cliente hasta existir línea de visión o alerta válida), validación física anti-speedhack y anti-duplicación de botín, más telemetría heurística para detectar parries automatizados (<80ms) o teaming ilícito en Modo Errante (1 vs 199).'}
                      </p>
                    </div>
                  </div>

                  {/* Formal Work Scope & IP Registry Summary */}
                  <div className="border border-stone-400 bg-white p-4 space-y-2.5">
                    <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        {isEn
                          ? 'Summary of Original Design Elements (IP Deposit)'
                          : 'Síntesis de Elementos Originales de la Obra (Depósito IP)'}
                      </span>
                      <span className="font-mono text-[11px] text-stone-500 tabular-nums">
                        {documentDate}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-700 leading-relaxed">
                      {isEn
                        ? `This Game Design Document compiles the original IP "${GDD_META.projectTitle}", encompassing the fictional continent of Valdris, The Abyssal Ash & The Iron Crown lore, Oath Mode (Duos, Trios & Quads winning together with a 60s squad respawn requiring 1+ living member during Acts I–III and zero respawn from Act IV onward) & Wanderer Mode (Solo 1 vs 199 with 1 sole victor), the 5-Act match cycle, the 5 Valdris Quality Tiers, the 8 Aether Seals, the 4-tier PvE Monster Difficulty for Looting & Drop Matrix, the 4 Valdris POIs, and the Unreal Engine 5 multiplayer + anti-cheat architecture.`
                        : `Este Documento Maestro de Diseño reúne los elementos originales de la obra "${GDD_META.projectTitle}": el continente de Valdris, La Ceniza Abisal y La Corona de Hierro, los modos Modo Juramento (Dúos, Tríos y Cuartetos que ganan en conjunto, con respawn de 60s en Actos I–III condicionado a 1+ aliado vivo y sin respawn desde el Acto IV) y Modo Errante (Solo 1 vs 199 con 1 único ganador), el ciclo de 5 Actos, los 5 Tiers de Calidad, los 8 Sellos de Éter, la dificultad de monstruos PvE en 4 niveles con matriz de botín, los 4 biomas estratégicos y la arquitectura UE5 con sistema Anti-Cheat multicapa.`}
                    </p>
                  </div>
                </div>
              </PageChrome>
            </>
          ) : (
            /* ================= 10-SLIDE COMMERCIAL PITCH DECK ================= */
            <>
              {GDD_PITCH_SLIDES.map((slide, idx) => {
                const plateImage = GDD_IMAGES[slide.imageKey] || GDD_IMAGES.keyart;
                return (
                  <PageChrome
                    key={slide.number}
                    pageNumber={idx + 1}
                    totalPages={GDD_PITCH_SLIDES.length}
                    unitLabel={isEn ? 'Slide' : 'Diapositiva'}
                    sectionLabel={`${isEn ? 'Pitch Deck' : 'Pitch Comercial'} · ${slide.number}/10`}
                  >
                    <div className="space-y-5">
                      {/* Slide Header Block */}
                      <div className="border-b border-stone-300 pb-4 space-y-2">
                        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-amber-900 font-semibold">
                          <span>{t(slide.kicker)}</span>
                          <span className="font-mono tabular-nums text-stone-500">
                            {GDD_META.shortTitle} · {slide.number} / 10
                          </span>
                        </div>
                        <h1 className="text-3xl font-serif-custom font-bold text-stone-950 tracking-tight leading-tight text-balance">
                          {t(slide.title)}
                        </h1>
                        <p className="text-sm text-stone-700 font-medium leading-relaxed">
                          {t(slide.subtitle)}
                        </p>
                      </div>

                      {/* Large Conceptual Plate */}
                      <ReferencePlate image={plateImage} heightClass="h-64" />

                      {/* Slide Key Pillars */}
                      <div className="grid grid-cols-1 gap-3">
                        {slide.bullets.map((bullet) => (
                          <div
                            key={bullet.heading.en}
                            className="border border-stone-300 bg-white p-3.5 space-y-1"
                          >
                            <h2 className="text-sm font-bold text-stone-950">{t(bullet.heading)}</h2>
                            <p className="text-xs text-stone-700 leading-relaxed">{t(bullet.body)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Compact 4-Tier Monster Looting Table on Slide 07 */}
                      {slide.number === '07' && (
                        <div className="border border-stone-300 bg-white overflow-hidden">
                          <table className="w-full text-left border-collapse text-[10px]">
                            <thead>
                              <tr className="bg-stone-900 text-stone-100">
                                <th className="py-1.5 px-2 font-semibold">{isEn ? 'Difficulty' : 'Dificultad'}</th>
                                <th className="py-1.5 px-2 font-semibold">{isEn ? 'Chest / Lock' : 'Cofre / Sello'}</th>
                                <th className="py-1.5 px-2 font-semibold text-right">{isEn ? 'Cursed' : 'Reliquia M.'}</th>
                                <th className="py-1.5 px-2 font-semibold text-right">{isEn ? 'Royal' : 'Vestigio R.'}</th>
                                <th className="py-1.5 px-2 font-semibold">{isEn ? 'PvP Ping' : 'Alerta PvP'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200 tabular-nums">
                              {GDD_MONSTER_TIERS.map((tier) => (
                                <tr key={tier.id}>
                                  <td className="py-1.5 px-2 font-semibold text-stone-950">
                                    Tier {tier.tierLevel} · {t(tier.tierName)}
                                  </td>
                                  <td className="py-1.5 px-2 text-stone-700">{t(tier.chestType)}</td>
                                  <td className="py-1.5 px-2 text-right font-mono text-violet-800">
                                    {tier.dropRates.cursed}
                                  </td>
                                  <td className="py-1.5 px-2 text-right font-mono font-bold text-amber-800">
                                    {tier.dropRates.royal}
                                  </td>
                                  <td className="py-1.5 px-2 text-stone-600">{t(tier.pvpAlertRadius)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Optional Strategic Callout */}
                      {slide.callout && (
                        <div className="border border-stone-400 bg-stone-100 p-4">
                          <p className="text-xs font-semibold text-stone-900 leading-relaxed">
                            {t(slide.callout)}
                          </p>
                        </div>
                      )}

                      {/* Bottom Spec Strip on Slide 01 & Slide 10 */}
                      {idx === 0 && (
                        <div className="grid grid-cols-4 gap-3 border-t border-stone-300 pt-4 text-xs">
                          <div>
                            <span className="text-stone-500 block">{isEn ? 'Scale' : 'Escala'}</span>
                            <strong className="text-stone-950 tabular-nums">200 Jugadores</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 block">{isEn ? 'Modes' : 'Modos'}</span>
                            <strong className="text-stone-950">Juramento · Errante</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 block">{isEn ? 'Engine' : 'Motor'}</span>
                            <strong className="text-stone-950">Unreal Engine 5</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 block">{isEn ? 'Combat & PvE' : 'Combate y PvE'}</span>
                            <strong className="text-stone-950">5 Tiers · 8 Sellos · PvE 4 Niveles</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  </PageChrome>
                );
              })}
            </>
          )}
        </div>
      </main>

      {/* Lightbox Viewer */}
      {lightboxImage && (
        <div
          className="no-print fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxImage(null);
          }}
        >
          <div className="max-w-5xl w-full bg-stone-900 border border-stone-700 overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between gap-4 text-stone-100">
              <div className="text-xs font-medium truncate">
                <strong className="text-amber-400">{lightboxImage.figureNumber}</strong> · {t(lightboxImage.title)}
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 text-stone-400 hover:text-white cursor-pointer"
                aria-label={isEn ? 'Close image' : 'Cerrar imagen'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black flex items-center justify-center p-2">
              <img
                src={lightboxImage.src}
                alt={t(lightboxImage.title)}
                referrerPolicy="no-referrer"
                className="max-h-[78vh] w-auto object-contain"
              />
            </div>
            <div className="px-4 py-2.5 text-xs text-stone-300 border-t border-stone-800">
              {t(lightboxImage.caption)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
