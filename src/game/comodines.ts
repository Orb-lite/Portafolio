import { TileColor } from './types';

export type ComodinTier = 1 | 2 | 3;

export type ComodinCategory =
  | 'absorption'
  | 'queue'
  | 'board'
  | 'conveyor'
  | 'emergency';

export interface ComodinDefinition {
  id: string;
  name: string;
  subtitle: string;
  tier: ComodinTier;
  category: ComodinCategory;
  iconName: 'magnet' | 'shuffle' | 'shield-alert' | 'zap' | 'refresh-cw' | 'sparkles' | 'layers' | 'clock' | 'flame' | 'compass';
  color: string;
  badgeClass: string;
  borderClass: string;
  bgGradient: string;
  description: string;
  tacticalAdvice: string;
  tradeoff: string;
  requiresEncapsulation?: boolean;
}

export const COMODINES_CATALOG: ComodinDefinition[] = [
  // ==================== TIER 1: TÁCTICOS BÁSICOS (Niveles 1-4) ====================
  {
    id: 'iman_perimetro',
    name: 'Imán Perimetral',
    subtitle: 'Rango de Absorción +40%',
    tier: 1,
    category: 'absorption',
    iconName: 'magnet',
    color: '#06b6d4',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    borderClass: 'border-cyan-500/40 hover:border-cyan-400',
    bgGradient: 'from-cyan-950/60 to-slate-900',
    description: 'Aumenta el alcance de succión de los runners un 40% durante 18 segundos, permitiéndoles absorber fichas del perímetro ligeramente desalineadas.',
    tacticalAdvice: 'Úsalo cuando veas fichas del mismo color en esquinas o curvas del borde que a menudo se escapan por milímetros.',
    tradeoff: 'No sirve de nada si en la cinta no tienes el color que está visible en el borde.',
  },
  {
    id: 'rotacion_tactica',
    name: 'Rotación Táctica',
    subtitle: 'Reorganización de Cola Frontal',
    tier: 1,
    category: 'queue',
    iconName: 'shuffle',
    color: '#f59e0b',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    bgGradient: 'from-amber-950/60 to-slate-900',
    description: 'Reemplaza de inmediato la fila frontal de la cola inferior con corredores que coinciden exactamente con los colores expuestos en el tablero.',
    tacticalAdvice: 'Indispensable si ninguna de las 4 opciones frontales coincide con el borde y estás a punto de bloquearte.',
    tradeoff: 'Gasta tu comodín del nivel únicamente para recolocar la cola, sin absorber fichas directamente.',
  },
  {
    id: 'corredor_titan',
    name: 'Corredor Titán',
    subtitle: 'Capacidad +8 / Velocidad -20%',
    tier: 1,
    category: 'absorption',
    iconName: 'layers',
    color: '#3b82f6',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    borderClass: 'border-blue-500/40 hover:border-blue-400',
    bgGradient: 'from-blue-950/60 to-slate-900',
    description: 'El siguiente corredor lanzado adquiere +8 de capacidad extra de absorción, pero su velocidad se reduce un 20% debido a la masa que acumula.',
    tacticalAdvice: 'Elígelo si un color domina ampliamente un lateral entero para despejarlo de una sola pasada limpia.',
    tradeoff: 'Al moverse más lento, ocupa un carril de la cinta durante más tiempo. ¡No lo lances si la cinta ya tiene 3 o 4 corredores!',
  },
  {
    id: 'amortiguador_emergencia',
    name: 'Red de Salvamento',
    subtitle: 'Previene 1 Atasco Fatal',
    tier: 1,
    category: 'emergency',
    iconName: 'shield-alert',
    color: '#10b981',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    borderClass: 'border-emerald-500/40 hover:border-emerald-400',
    bgGradient: 'from-emerald-950/60 to-slate-900',
    description: 'Si la cinta llega al límite crítico de 5/5 corredores sin coincidencias activas, retira automáticamente al corredor más ocioso y devuelve sus fichas a la reserva.',
    tacticalAdvice: 'Excelente red de seguridad preventiva para jugadores que arriesgan llenando la cinta con combinaciones agresivas.',
    tradeoff: 'Es un comodín pasivo de protección; si juegas con precisión sin llenar la cinta a 5/5, no te aportará ventaja ofensiva.',
  },

  // ==================== TIER 2: TÁCTICOS AVANZADOS (Niveles 5-9) ====================
  {
    id: 'pulso_anticapsula',
    name: 'Pulso Rompe-Burbujas',
    subtitle: 'Destruye 4 Celdas Encapsuladas',
    tier: 2,
    category: 'board',
    iconName: 'zap',
    color: '#ec4899',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
    borderClass: 'border-pink-500/40 hover:border-pink-400',
    bgGradient: 'from-pink-950/60 to-slate-900',
    description: 'Emite una onda sonora que hace estallar instantáneamente hasta 4 cápsulas o cristales protectores del tablero, liberando sus fichas.',
    tacticalAdvice: '¡Crucial en niveles con alta densidad de fichas encapsuladas que bloquean el avance!',
    tradeoff: 'Completamente inútil si el nivel actual no tiene fichas encapsuladas. Debes observar el tablero antes de seleccionarlo.',
    requiresEncapsulation: true,
  },
  {
    id: 'impulso_conveyor',
    name: 'Sobrecarga de Cinta',
    subtitle: 'Velocidad +80% por 12s',
    tier: 2,
    category: 'conveyor',
    iconName: 'flame',
    color: '#f97316',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    borderClass: 'border-orange-500/40 hover:border-orange-400',
    bgGradient: 'from-orange-950/60 to-slate-900',
    description: 'Multiplica la velocidad de desplazamiento de toda la cinta un +80% durante 12 segundos, acelerando drásticamente el barrido de piezas.',
    tacticalAdvice: 'Actívalo cuando tengas 3 o 4 corredores en la cinta con colores coincidentes listos para barrer el tablero en cadena.',
    tradeoff: 'El ritmo frenético exige reflejos: si la cinta se mueve tan rápido sin piezas para absorber, los corredores darán vueltas inútiles.',
  },
  {
    id: 'transmutacion_borde',
    name: 'Transmutación Cromática',
    subtitle: 'Convierte 3 Fichas de Borde',
    tier: 2,
    category: 'board',
    iconName: 'sparkles',
    color: '#8b5cf6',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    borderClass: 'border-purple-500/40 hover:border-purple-400',
    bgGradient: 'from-purple-950/60 to-slate-900',
    description: 'Transforma 3 fichas bloqueantes del borde exterior al color del corredor que encabeza tu cinta, abriendo un túnel de absorción inmediato.',
    tacticalAdvice: 'La herramienta perfecta para romper una "pared" de un color molesto que te impide llegar a un gran cúmulo interior.',
    tradeoff: 'Debes tener lanzado previamente un corredor del color deseado para sincronizar la conversión con su paso.',
  },
  {
    id: 'despeje_estrategico',
    name: 'Purga Táctica',
    subtitle: 'Expulsa 1 Corredor Ocioso',
    tier: 2,
    category: 'conveyor',
    iconName: 'refresh-cw',
    color: '#14b8a6',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    borderClass: 'border-teal-500/40 hover:border-teal-400',
    bgGradient: 'from-teal-950/60 to-slate-900',
    description: 'Permite retirar inmediatamente de la pista al corredor con menos absorciones o más estancado, liberando su slot en la cinta sin penalización de vida.',
    tacticalAdvice: 'Ideal para corregir un lanzamiento apresurado que dejó un corredor estorbando sin fichas disponibles.',
    tradeoff: 'Solo mitiga un error propio; no acelera directamente el tablero ni genera puntos.',
  },

  // ==================== TIER 3: TÁCTICOS MAESTROS (Niveles 10+) ====================
  {
    id: 'corredor_prismatico',
    name: 'Corredor Prisma',
    subtitle: 'Absorbe CUALQUIER Color (Cap. 12)',
    tier: 3,
    category: 'absorption',
    iconName: 'sparkles',
    color: '#e11d48',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    borderClass: 'border-rose-500/40 hover:border-rose-400',
    bgGradient: 'from-rose-950/60 to-slate-900',
    description: 'Lanza a la pista un mítico Corredor Prisma iridiscente que devora hasta 12 fichas de CUALQUIER color expuestas en el perímetro.',
    tacticalAdvice: 'Úsalo cuando el perímetro exterior esté saturado de un mosaico caótico de múltiples colores aislados.',
    tradeoff: 'Solo puede absorber 12 fichas y tras retirarse bloquea ese slot de la cinta durante 4 segundos de enfriamiento.',
  },
  {
    id: 'colapso_gravitacional',
    name: 'Colapso Gravitacional',
    subtitle: 'Extrae Núcleos al Perímetro',
    tier: 3,
    category: 'board',
    iconName: 'compass',
    color: '#a855f7',
    badgeClass: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40',
    borderClass: 'border-fuchsia-500/40 hover:border-fuchsia-400',
    bgGradient: 'from-fuchsia-950/60 to-slate-900',
    description: 'Invierte la polaridad del tablero y empuja 5 fichas del color más abundante desde las filas interiores hacia los bordes externos accesibles.',
    tacticalAdvice: 'Te permite desenterrar grandes masas de color atrapadas en el corazón del tablero de 10x10 o 12x12.',
    tradeoff: 'Reorganiza el perímetro; si no calculaste qué colores tenías en cola, podrías quedar temporalmente sin corredor adecuado.',
  },
  {
    id: 'paradoja_temporal',
    name: 'Estasis Temporal',
    subtitle: 'Pausa Alerta 20s + Imán 1.5x',
    tier: 3,
    category: 'conveyor',
    iconName: 'clock',
    color: '#eab308',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
    borderClass: 'border-yellow-500/40 hover:border-yellow-400',
    bgGradient: 'from-yellow-950/60 to-slate-900',
    description: 'Ralentiza el tiempo de cálculo de atasco durante 20 segundos y otorga un campo magnético de 1.5x a todos tus corredores activos.',
    tacticalAdvice: 'El comodín supremo de supervivencia para desatascar tableros masivos en los niveles más exigentes.',
    tradeoff: 'No absorbe piezas por ti: solo te da una ventana de tiempo sagrada para pensar y ejecutar tu estrategia perfecta.',
  },
];

/**
 * Generates 3 curated Comodines for a given level based on its tier progression.
 * - Levels 1-4: Tier 1 (Novato Táctico)
 * - Levels 5-9: Tier 2 (Estratega Avanzado) with some Tier 1
 * - Levels 10+: Tier 3 (Maestro) with Tier 2
 */
export function generateComodinesForLevel(
  level: number,
  hasEncapsulations: boolean
): ComodinDefinition[] {
  // Filter out comodines requiring encapsulations if the level has none
  const eligible = COMODINES_CATALOG.filter((c) => {
    if (c.requiresEncapsulation && !hasEncapsulations) return false;
    return true;
  });

  let primaryTier: ComodinTier = 1;
  if (level >= 10) primaryTier = 3;
  else if (level >= 5) primaryTier = 2;

  // Weight options to favor current level tier, but allow adjacent tier variety
  const tierWeights = (item: ComodinDefinition) => {
    if (primaryTier === 1) {
      if (item.tier === 1) return 80;
      if (item.tier === 2) return 20;
      return 0;
    } else if (primaryTier === 2) {
      if (item.tier === 2) return 70;
      if (item.tier === 1) return 15;
      if (item.tier === 3) return 15;
      return 0;
    } else {
      if (item.tier === 3) return 70;
      if (item.tier === 2) return 30;
      return 0;
    }
  };

  const pool = [...eligible].sort((a, b) => tierWeights(b) - tierWeights(a));

  // Pick 3 diverse comodines with different categories if possible
  const selected: ComodinDefinition[] = [];
  const chosenCategories = new Set<ComodinCategory>();

  // Ensure at least one from the primary tier
  const primaryCandidates = pool.filter((c) => c.tier === primaryTier);
  if (primaryCandidates.length > 0) {
    const pickIndex = (level * 7 + 3) % primaryCandidates.length;
    const first = primaryCandidates[pickIndex];
    selected.push(first);
    chosenCategories.add(first.category);
  }

  // Pick remaining 2 from pool with diversity
  for (const item of pool) {
    if (selected.length >= 3) break;
    if (selected.some((s) => s.id === item.id)) continue;

    // Favor different category
    if (!chosenCategories.has(item.category) || selected.length >= 2) {
      selected.push(item);
      chosenCategories.add(item.category);
    }
  }

  // Fallback if needed to guarantee exactly 3 options
  while (selected.length < 3 && selected.length < eligible.length) {
    const remaining = eligible.filter((e) => !selected.some((s) => s.id === e.id));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  return selected;
}
