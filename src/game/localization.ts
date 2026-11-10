import { ComodinDefinition } from './comodines';

export type GameLanguage = 'en' | 'es';

const COMODIN_EN: Record<string, Pick<ComodinDefinition, 'name' | 'subtitle' | 'description' | 'tacticalAdvice' | 'tradeoff'>> = {
  iman_perimetro: { name: 'Perimeter Magnet', subtitle: 'Absorption range +40%', description: 'Increases runner suction range by 40% for 18 seconds so they can absorb slightly misaligned perimeter tiles.', tacticalAdvice: 'Use it when matching tiles in corners or along the edge keep escaping by a tiny margin.', tradeoff: 'It is useless if the conveyor has no runner matching a color visible on the edge.' },
  rotacion_tactica: { name: 'Tactical Shuffle', subtitle: 'Rearrange front queue', description: 'Immediately replaces the front row of the lower queue with runners matching colors exposed on the board.', tacticalAdvice: 'Use it when none of the four front options match the edge and you are close to getting stuck.', tradeoff: 'It spends your level power-up only to rearrange the queue; it does not absorb tiles directly.' },
  corredor_titan: { name: 'Titan Runner', subtitle: 'Capacity +8 / speed −20%', description: 'The next runner gains 8 extra absorption capacity, but moves 20% slower because of its added mass.', tacticalAdvice: 'Choose it when one color dominates an entire side and can be cleared in one pass.', tradeoff: 'It occupies a conveyor lane longer. Avoid launching it when three or four runners are already on the belt.' },
  amortiguador_emergencia: { name: 'Safety Net', subtitle: 'Prevents one fatal jam', description: 'If the conveyor reaches 5/5 runners with no active matches, it automatically removes the least active runner and returns its tiles to reserve.', tacticalAdvice: 'A strong safety net when you take risks by filling the conveyor with aggressive combinations.', tradeoff: 'It is passive protection. Precise play that never fills all five slots gets no offensive advantage from it.' },
  pulso_anticapsula: { name: 'Bubble-Breaker Pulse', subtitle: 'Breaks 4 shielded tiles', description: 'Sends a sonic wave that instantly bursts up to four protective capsules or crystals, freeing their tiles.', tacticalAdvice: 'Crucial in levels where shielded tiles are blocking progress.', tradeoff: 'Useless when the current level has no shielded tiles. Check the board before choosing it.' },
  impulso_conveyor: { name: 'Conveyor Surge', subtitle: 'Speed +80% for 12s', description: 'Increases the whole conveyor speed by 80% for 12 seconds, rapidly accelerating runner sweeps.', tacticalAdvice: 'Activate it when three or four runners on the belt have matching colors and are ready to sweep in a chain.', tradeoff: 'The faster pace demands quick decisions. Runners without tiles to absorb may circle pointlessly.' },
  transmutacion_borde: { name: 'Chromatic Transmutation', subtitle: 'Converts 3 edge tiles', description: 'Changes three blocking outer-edge tiles to match the color of the runner leading your conveyor, opening an immediate path.', tacticalAdvice: 'Use it to break through a wall of an awkward color that blocks access to a large inner group.', tradeoff: 'You must launch a runner of the desired color first so it can collect the converted tiles.' },
  despeje_estrategico: { name: 'Tactical Purge', subtitle: 'Removes 1 idle runner', description: 'Immediately removes the runner with the fewest absorptions or the longest idle time, freeing its conveyor slot without losing a life.', tacticalAdvice: 'Ideal for correcting a rushed launch that left a runner blocking the belt with no tiles to collect.', tradeoff: 'It only fixes a mistake; it does not directly speed up the board or earn points.' },
  corredor_prismatico: { name: 'Prismatic Runner', subtitle: 'Absorbs any color (cap. 12)', description: 'Launches a legendary iridescent runner that devours up to 12 exposed perimeter tiles of any color.', tacticalAdvice: 'Use it when the outer edge is crowded with a chaotic mosaic of isolated colors.', tradeoff: 'It absorbs only 12 tiles, then blocks its conveyor slot for a four-second cooldown.' },
  colapso_gravitacional: { name: 'Gravitational Collapse', subtitle: 'Pulls inner tiles to edge', description: 'Reverses the board polarity and pushes five tiles of the most common color from inner rows to accessible outer edges.', tacticalAdvice: 'Uncovers large color groups trapped in the center of a 10×10 or 12×12 board.', tradeoff: 'It rearranges the edge. If your queue has no matching runner, you may be temporarily stuck.' },
  paradoja_temporal: { name: 'Temporal Stasis', subtitle: 'Freezes jam timer 20s + 1.5× magnet', description: 'Slows jam detection for 20 seconds and gives all active runners a 1.5× magnetic field.', tacticalAdvice: 'The ultimate survival power-up for unsticking large boards in the most demanding levels.', tradeoff: 'It does not absorb tiles for you; it gives you time to think and execute your strategy.' },
};

export function localizeComodin(comodin: ComodinDefinition, language: GameLanguage): ComodinDefinition {
  return language === 'en' ? { ...comodin, ...COMODIN_EN[comodin.id] } : comodin;
}

export const GAME_TEXT = {
  en: {
    backToPortfolio: 'Back to Portfolio', gameEdition: 'Conveyor Realms 3D · Three.js Edition',
    used: 'Power-up used (1/1)', change: 'Change this level power-up', activate: 'Activate power-up', activateNow: 'Activate now!',
    choosePower: 'Choose 1 of 3 level power-ups', options: '3 options', powerTitle: 'Level Power-up', alreadyUsed: 'You already used a power-up this level',
    equip: 'Equip this power-up', equipped: 'Power-up equipped', chooseHint: 'Choose one power-up for this level. Activate it now or save it for the right moment.',
    hall: 'Hall of Fame', update: 'Refresh', editTag: 'Edit Gamertag', tiles: 'tiles',
  },
  es: {
    backToPortfolio: 'Regresar al Portafolio', gameEdition: 'Conveyor Realms 3D · Edición Three.js',
    used: 'Comodín usado (1/1)', change: 'Cambiar comodín de este nivel', activate: 'Activar comodín', activateNow: '¡Activar ahora!',
    choosePower: 'Elige 1 de 3 comodines para este nivel', options: '3 opciones', powerTitle: 'Comodín del nivel', alreadyUsed: 'Ya usaste 1 comodín este nivel',
    equip: 'Equipar este comodín', equipped: 'Comodín equipado', chooseHint: 'Elige 1 comodín para este nivel. Actívalo ahora o guárdalo para el momento adecuado.',
    hall: 'Salón de la Fama', update: 'Actualizar', editTag: 'Editar Gamertag', tiles: 'fichas',
  },
} as const;

