import React from 'react';
import { X, Sparkles, Crown, Fish, PawPrint, Bird, CarFront, Plane } from 'lucide-react';

interface DocModalProps {
  language?: 'en' | 'es';
  isOpen: boolean;
  onClose: () => void;
}

const worlds = [
  { icon: Crown, levels: '1–9', name: 'Chess Kingdom' },
  { icon: Fish, levels: '10–19', name: 'Fish of Fortune' },
  { icon: PawPrint, levels: '20–29', name: 'Land Animals' },
  { icon: Bird, levels: '30–39', name: 'Birds' },
  { icon: Sparkles, levels: '40–49', name: 'Humans' },
  { icon: CarFront, levels: '50–59', name: 'Cars' },
  { icon: Plane, levels: '60+', name: 'Aircraft' },
];

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose, language = 'en' }) => {
  const isEn = language === 'en';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">{isEn ? 'How to Play' : 'Cómo jugar'}</h2>
            <p className="text-xs text-slate-400">Conveyor Realms · By Dimpz Games</p>
          </div>
          <button onClick={onClose} aria-label={isEn ? 'Close game guide' : 'Cerrar guía del juego'} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
          <section className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4 text-amber-400" /> {isEn ? 'Clear the board' : 'Despeja el tablero'}
            </h3>
            <p className="leading-relaxed text-slate-300">
              {isEn ? 'Send a matching piece from the queue onto the conveyor. It collects exposed tiles of its color as it travels around the board. Plan your launches to open new paths and clear every tile to advance.' : 'Envía una pieza coincidente de la cola a la cinta. Recogerá las fichas expuestas de su color al recorrer el tablero. Planifica tus lanzamientos para abrir caminos y despejar todas las fichas para avanzar.'}
            </p>
            <ul className="mt-3 space-y-1.5 text-slate-300">
              <li>• {isEn ? 'Launch pieces from the four columns at the bottom.' : 'Lanza piezas desde las cuatro columnas de la parte inferior.'}</li>
              <li>• {isEn ? 'Up to five pieces can travel on the conveyor at once.' : 'Hasta cinco piezas pueden recorrer la cinta al mismo tiempo.'}</li>
              <li>• {isEn ? 'Clear one board to complete one level. XP is your score.' : 'Despeja un tablero para completar un nivel. Los XP son tu puntuación.'}</li>
              <li>• {isEn ? 'Crack layered capsules one shell at a time; the tile is exposed after the last shell breaks.' : 'Rompe las cápsulas por capas, una a la vez; la ficha queda expuesta al quebrar la última capa.'}</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-4">
            <h3 className="mb-2 text-sm font-bold text-cyan-200">
              {isEn ? 'Candy Crush Specials · Explosive Pearls & Cyber Tiles' : 'Especiales Candy Crush · Perlas Explosivas & Mosaicos Cyber'}
            </h3>
            <p className="mb-3 text-xs text-slate-300 leading-relaxed">
              {isEn
                ? 'Both games feature Candy Crush-style power items: aquatic pearls in Fish of Fortune and high-tech quantum tiles in Conveyor Realms!'
                : '¡Ambos juegos cuentan con poderes estilo Candy Crush: perlas marinas en Fish of Fortune y mosaicos cuánticos en Conveyor Realms!'}
            </p>
            <ul className="space-y-2 leading-relaxed text-slate-300 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">💥 {isEn ? 'Wrapped (Envolved X-Y):' : 'Envuelto (X-Y):'}</span>
                <span>{isEn ? 'Explodes along BOTH the entire row (X) and column (Y) with laser beams, PLUS a 3×3 radial blast with a signature double shockwave!' : '¡Estalla a lo largo de TODA la fila (X) y columna (Y) con rayos láser, MÁS un área radial de 3×3 con doble onda expansiva!'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">⚡ {isEn ? 'Cross-Axis (Striped):' : 'Raya Cruzada (X-Y):'}</span>
                <span>{isEn ? 'Fires high-intensity beams through its complete row and column, instantly clearing the entire crosshair.' : 'Dispara haces de alta energía a lo largo de su fila y columna completas, barriendo toda la cruz.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 font-bold shrink-0">🌈 {isEn ? 'Exploding Pearl / Color Bomb:' : 'Perla Explosiva / Bomba Arcoíris:'}</span>
                <span>{isEn ? 'Detonates every matching colored pearl/tile across the entire grid with a rainbow particle nova.' : 'Detona cada perla o mosaico de su mismo color en todo el tablero con una lluvia de partículas arcoíris.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold shrink-0">💣 {isEn ? '3×3 Burst Bomb:' : 'Bomba Sísmica 3×3:'}</span>
                <span>{isEn ? 'Clears a 3×3 cluster with ground shockwaves, cracking all surrounding shells.' : 'Despeja un área de 3×3 con ondas expansivas, quebrando todas las corazas circundantes.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 font-bold shrink-0">🔥 {isEn ? 'Chain Reactions:' : 'Reacciones en Cadena:'}</span>
                <span>{isEn ? 'If an explosion hits another special item, it cascades into combo chain explosions (Combo x2, x3...)!' : '¡Si una explosión alcanza a otro especial, detona en cascada con multiplicador de combo (Combo x2, x3...)!'}</span>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="mb-2 text-sm font-bold text-amber-200">
              {isEn ? '🛡️ Higher Levels · 1, 2, & 3 Armored Shells (Inclusive on Explosives!)' : '🛡️ Niveles Altos · 1, 2 y 3 Capas de Coraza (¡Incluso en Explosivos!)'}
            </h3>
            <ul className="space-y-1.5 leading-relaxed text-slate-300 text-xs sm:text-sm">
              <li>• <strong className="text-sky-300">{isEn ? '1 Shell (Layer 1):' : '1 Concha (Capa 1):'}</strong> {isEn ? 'Sea-glass / Cyan cyber-barrier (Level 3+). One crack frees the item.' : 'Burbuja de cristal marino / barrera cyber cian (Nivel 3+). Un impacto la libera.'}</li>
              <li>• <strong className="text-purple-300">{isEn ? '2 Shells (Layer 2):' : '2 Conchas (Capa 2):'}</strong> {isEn ? 'Mother-of-pearl / Violet plasma shield (Level 6+). Requires 2 consecutive hits or blasts.' : 'Concha nacarada / escudo de plasma violeta (Nivel 6+). Requiere 2 impactos o explosiones.'}</li>
              <li>• <strong className="text-amber-400">{isEn ? '3 Shells (Layer 3):' : '3 Conchas (Capa 3):'}</strong> {isEn ? 'Armored golden coral clam / Quantum fortress barrier (Level 10+). Heaviest protection requiring 3 hits!' : 'Almeja de coral dorado / barrera de fortaleza cuántica (Nivel 10+). ¡Máxima resistencia de 3 impactos!'}</li>
              <li>• <strong className="text-emerald-300">{isEn ? 'Armored Explosives:' : 'Explosivos Acorazados:'}</strong> {isEn ? 'At higher levels, explosive pearls and tiles themselves can be trapped inside 1, 2, or 3 shells! Crack the final shell to unleash their explosion in massive cascades!' : '¡En niveles altos, las perlas y mosaicos explosivos también pueden tener 1, 2 o 3 conchas! ¡Rompe la última capa para desatar su explosión en cascadas masivas!'}</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-700/70 bg-slate-950/30 p-4">
            <h3 className="mb-3 text-sm font-bold text-white">{isEn ? 'Worlds' : 'Mundos'}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {worlds.map(({ icon: Icon, levels, name }, index) => (
                <div key={name} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                  <Icon className="h-4 w-4 shrink-0 text-amber-300" />
                  <span className="font-semibold text-slate-100">{isEn ? name : ['Reino de Ajedrez', 'Peces de la Fortuna', 'Animales Terrestres', 'Aves', 'Humanos', 'Automóviles', 'Aeronaves'][index]}</span>
                  <span className="ml-auto font-mono text-[10px] text-slate-400">{levels}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4">
            <h3 className="mb-2 text-sm font-bold text-amber-300">{isEn ? 'Growing challenge' : 'Desafío creciente'}</h3>
            <p className="leading-relaxed text-slate-300">
              {isEn ? 'Boards expand from 8×8 up to 64×64. The camera pulls back as they grow, more colors join the puzzle, and protective shields appear more often. The world scenery changes as you enter each new level range.' : 'Los tableros crecen de 8×8 hasta 64×64. La cámara se aleja a medida que aumentan, se añaden colores y aparecen más escudos protectores. El paisaje cambia al entrar en cada nuevo bloque de niveles.'}
            </p>
          </section>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Sparkles className="h-3.5 w-3.5" /> By Dimpz Games
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-xl bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700">{isEn ? 'Close' : 'Cerrar'}</button>
        </div>
      </div>
    </div>
  );
};
