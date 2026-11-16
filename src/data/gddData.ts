import lastRelicKeyart from '../assets/images/last_relic_oathbreaker_keyart.jpg';
import citadelSiegePanorama from '../assets/images/gdd_citadel_siege_panorama_1794852261078.jpg';
import factionsArmorTiers from '../assets/images/gdd_factions_armor_tiers_1794852262112.jpg';
import cryptMonstersBestiary from '../assets/images/gdd_crypt_monsters_bestiary_1794852262994.jpg';
import mireCanopyBiomes from '../assets/images/gdd_mire_canopy_biomes_1794852263823.jpg';
import lootRelicsRunes from '../assets/images/gdd_loot_relics_runes_1794852263944.jpg';
import combatDuelHud from '../assets/images/gdd_combat_duel_hud_1794852264257.jpg';

/**
 * SWITCH DE PUBLICACIÓN DEL GDD:
 * - false: Modo Registro Interno (INDAUTOR). Oculta el nombre ("SHATTERED OATH"), mecánicas y GDD completo
 *   del portafolio público (mostrando únicamente la miniatura como "Coming Soon") y restringe esta página
 *   a URL privada + autenticación.
 * - true: Una vez obtenido el certificado de registro en INDAUTOR, cambiar a `true` para publicar el GDD.
 */
export const IS_GDD_PUBLICLY_RELEASED = false;

export interface GddLocalizedText {
  es: string;
  en: string;
}

export interface GddReferenceImage {
  id: string;
  figureNumber: string;
  src: string;
  title: GddLocalizedText;
  caption: GddLocalizedText;
  aspect: '16:9' | '4:3';
}

export interface GddActItem {
  act: GddLocalizedText;
  time: string;
  survivors: string;
  dynamic: GddLocalizedText;
  allegianceState: GddLocalizedText;
}

export interface GddRarityTier {
  tier: GddLocalizedText;
  colorLabel: GddLocalizedText;
  swatchHex: string;
  desc: GddLocalizedText;
}

export interface GddMonsterEntry {
  id: string;
  tierLevel: 'I' | 'II' | 'III' | 'IV';
  tierName: GddLocalizedText;
  difficultyLabel: GddLocalizedText;
  actsActive: GddLocalizedText;
  biomeZone: GddLocalizedText;
  chestType: GddLocalizedText;
  lootingRule: GddLocalizedText;
  squadScaling: GddLocalizedText;
  pvpAlertRadius: GddLocalizedText;
  monsters: Array<{
    name: GddLocalizedText;
    hp: string;
    role: GddLocalizedText;
    combatBehavior: GddLocalizedText;
  }>;
  lootGuarantee: GddLocalizedText;
  dropRates: {
    oxidized: string;
    tempered: string;
    astral: string;
    cursed: string;
    royal: string;
  };
  notableDrops: GddLocalizedText;
}

export interface GddSealItem {
  category: GddLocalizedText;
  name: GddLocalizedText;
  subName: GddLocalizedText;
  cost: string;
  desc: GddLocalizedText;
}

export interface GddPoiItem {
  name: GddLocalizedText;
  zoneTag: GddLocalizedText;
  threatLevel: GddLocalizedText;
  desc: GddLocalizedText;
}

export interface GddPitchSlide {
  number: string;
  kicker: GddLocalizedText;
  title: GddLocalizedText;
  subtitle: GddLocalizedText;
  bullets: Array<{
    heading: GddLocalizedText;
    body: GddLocalizedText;
  }>;
  callout?: GddLocalizedText;
  imageKey: keyof typeof GDD_IMAGES;
}

export const GDD_IMAGES: Record<string, GddReferenceImage> = {
  keyart: {
    id: 'keyart',
    figureNumber: 'Fig. 1',
    src: lastRelicKeyart,
    aspect: '16:9',
    title: {
      es: 'Arte Principal — The Last Relic',
      en: 'Key Art — The Last Relic',
    },
    caption: {
      es: 'Ilustración conceptual principal de Valdris bajo la tormenta de La Ceniza Abisal y la lucha por La Corona de Hierro.',
      en: 'Primary conceptual key art of Valdris beneath the Abyssal Ash storm and the struggle for the Iron Crown.',
    },
  },
  citadelSiege: {
    id: 'citadelSiege',
    figureNumber: 'Fig. 2',
    src: citadelSiegePanorama,
    aspect: '16:9',
    title: {
      es: 'Acto III: El Asedio — La Ciudadela de Valdris',
      en: 'Act III: The Siege — Citadel of Valdris',
    },
    caption: {
      es: 'Convergencia de compañías sobre los puentes y murallas de La Ciudadela de Valdris mientras desciende La Ceniza Abisal.',
      en: 'Companies converging across the bridges and battlements of the Citadel of Valdris as the Abyssal Ash closes in.',
    },
  },
  armorTiers: {
    id: 'armorTiers',
    figureNumber: 'Fig. 3',
    src: factionsArmorTiers,
    aspect: '4:3',
    title: {
      es: 'Escala de Calidad de Valdris (5 Tiers de Equipamiento)',
      en: 'Valdris Quality Scale (5 Gear Tiers)',
    },
    caption: {
      es: 'Evolución visual sin clases fijas: Forja Oxidada, Acero Templado, Alquimia Astral, Reliquia Maldita y Vestigio Real.',
      en: 'Classless visual progression: Rusted Forge, Tempered Steel, Astral Alchemy, Cursed Relic, and Royal Vestige.',
    },
  },
  lootRelics: {
    id: 'lootRelics',
    figureNumber: 'Fig. 4',
    src: lootRelicsRunes,
    aspect: '4:3',
    title: {
      es: 'Vestigio Real, Sellos de Éter y Cinturón de Viales',
      en: 'Royal Vestige Gear, Aether Seals & Vial Belt',
    },
    caption: {
      es: 'Estudio de botín: Mandoble de Verdugo, Coraza pesada, Sellos de Éter grabados y Viales Carmesí / de Éter.',
      en: 'Loot lookdev study: Executioner Greatsword, heavy cuirass, engraved Aether Seals, and Crimson / Aether Vials.',
    },
  },
  cryptBestiary: {
    id: 'cryptBestiary',
    figureNumber: 'Fig. 5',
    src: cryptMonstersBestiary,
    aspect: '16:9',
    title: {
      es: 'Altar-Cofre Sellado y Guardianes PvE — Catacumbas del Rey Sin Nombre',
      en: 'Sealed Altar-Chest & PvE Guardians — Catacombs of the Nameless King',
    },
    caption: {
      es: 'Referencia de dificultad Tier III: Guardianes no-muertos y bestia espectral custodiando Reliquias Malditas en el subsuelo.',
      en: 'Tier III difficulty reference: Undead guardians and crypt beast defending Cursed Relics underground.',
    },
  },
  combatDuel: {
    id: 'combatDuel',
    figureNumber: 'Fig. 6',
    src: combatDuelHud,
    aspect: '16:9',
    title: {
      es: 'Acto IV–V: Tañido de la Campana Negra y El Juicio Final',
      en: 'Act IV–V: Toll of the Black Bell & Final Judgment',
    },
    caption: {
      es: 'Combate táctico en tercera persona con parry de acero y chispas frente al muro de La Ceniza Abisal en el Salón del Trono.',
      en: 'Third-person tactical melee combat with timed steel parry sparks inside the Abyssal Ash Throne Room perimeter.',
    },
  },
  biomesStudy: {
    id: 'biomesStudy',
    figureNumber: 'Fig. 7',
    src: mireCanopyBiomes,
    aspect: '4:3',
    title: {
      es: 'Biomas Contrastantes — Las Marismas del Miasma y El Bosque de las Agujas',
      en: 'Contrasting Biomes — Marshes of Miasma & Forest of Spires',
    },
    caption: {
      es: 'Aldeas hundidas con aguas tóxicas al oeste (izq.) y plataformas elevadas sobre puentes colgantes al este (der.).',
      en: 'Sunken marsh villages over toxic waters in the West (left) and elevated tree-bridge ambush lanes in the East (right).',
    },
  },
};

export const GDD_META = {
  projectTitle: 'The Last Relic',
  shortTitle: 'THE LAST RELIC',
  version: 'GDD v2.2 (Edición IP Original · INDAUTOR)',
  workClassification: {
    es: 'Obra Literaria / Documento Maestro de Diseño de Videojuego',
    en: 'Literary & Technical Game Design Document',
  },
  genre: {
    es: 'Battle Royale Táctico TPS / Acción Medieval Oscura / PvPvE',
    en: 'Tactical Third-Person Battle Royale / Dark Medieval Action / PvPvE',
  },
  scale: {
    es: '200 Jugadores (Modo Juramento: Dúos, Tríos y Cuartetos unidos | Modo Errante: 1 vs 199)',
    en: '200 Players (Oath Mode: Duos, Trios & Quads united | Wanderer Mode: 1 vs 199)',
  },
  targetEngine: 'Unreal Engine 5 (Replication Graph · Direct3D 12)',
};

export const GDD_ACTS: GddActItem[] = [
  {
    act: { es: 'Acto I: El Desembarco', en: 'Act I: The Landing' },
    time: '0:00 – 4:00',
    survivors: '200 → 130',
    dynamic: {
      es: 'Aparición en las costas y bosques exteriores de Valdris. Saqueo rápido de alijos básicos, caza de monstruos Tier I y primeras escaramuzas.',
      en: 'Deployment across outer coasts and woods of Valdris. Rapid scavenging of starter stashes, Tier I monster hunting, and early skirmishes.',
    },
    allegianceState: {
      es: 'Dúos/Tríos/Cuartetos unidos · Respawn 60s (1+ aliado vivo)',
      en: 'Duos/Trios/Quads united · 60s Respawn (1+ ally alive)',
    },
  },
  {
    act: { es: 'Acto II: La Cacería', en: 'Act II: The Hunt' },
    time: '4:00 – 9:00',
    survivors: '130 → 60',
    dynamic: {
      es: 'Primer cierre de La Ceniza Abisal. Emergen Altar-Cofres Sellados (Épicos) custodiados por guardianes espectrales y bestias PvE Tier II–III.',
      en: 'First Abyssal Ash contraction. Sealed Altar-Chests (Epic) emerge guarded by spectral sentinels and Tier II–III PvE beasts.',
    },
    allegianceState: {
      es: 'Respawn 60s (si todos mueren = eliminación) · Disputa PvPvE',
      en: '60s Respawn (all die = squad wipe) · PvPvE contest',
    },
  },
  {
    act: { es: 'Acto III: El Asedio', en: 'Act III: The Siege' },
    time: '9:00 – 14:00',
    survivors: '60 → 16',
    dynamic: {
      es: 'Convergencia en La Ciudadela de Valdris. Combate vertical en murallas, puentes levadizos, patios interiores y catacumbas subterráneas.',
      en: 'Convergence on the Citadel of Valdris. Vertical combat across battlements, drawbridges, courtyards, and catacombs.',
    },
    allegianceState: {
      es: 'Último acto con Respawn de 60s (requiere 1+ miembro vivo)',
      en: 'Final act with 60s Respawn (requires 1+ teammate alive)',
    },
  },
  {
    act: { es: 'Acto IV: La Campana Negra', en: 'Act IV: The Black Bell' },
    time: '14:00 – 16:00',
    survivors: '16 → Últimas Compañías / 4',
    dynamic: {
      es: 'Tañido de la Campana Negra: Se desactiva el respawn de miembros del equipo para el resto de la partida, se sellan las Catacumbas y emerge el Heraldo de Ceniza (Tier IV).',
      en: 'Toll of the Black Bell: Team member respawns are permanently disabled for the rest of the match, Catacombs seal, and the Ash Herald (Tier IV) spawns.',
    },
    allegianceState: {
      es: 'SIN RESPAWN desde Acto IV · Equipos unidos / Errante: Solo',
      en: 'NO RESPAWN from Act IV onward · Teams intact / Wanderer: Solo',
    },
  },
  {
    act: { es: 'Acto V: El Juicio', en: 'Act V: The Judgment' },
    time: '16:00 – Final',
    survivors: 'Final en Salón del Trono',
    dynamic: {
      es: 'Batalla decisiva sin respawn en el Salón del Trono bajo La Ceniza Abisal. En Dúos, Tríos o Cuartetos gana toda la compañía en conjunto; en Modo Errante sobrevive 1 único vencedor.',
      en: 'Decisive zero-respawn clash in the Throne Room under the closing Abyssal Ash. In Duos, Trios, or Quads the entire surviving squad wins together; in Wanderer Mode only 1 sole victor claims the crown.',
    },
    allegianceState: {
      es: 'Sin respawn · Equipos: Victoria conjunta · Errante: 1 ganador',
      en: 'No respawn · Teams: Co-op Victory · Wanderer: 1 sole victor',
    },
  },
];

export const GDD_RARITIES: GddRarityTier[] = [
  {
    tier: { es: '1. Forja Oxidada', en: '1. Rusted Forge' },
    colorLabel: { es: 'Gris · Común', en: 'Gray · Common' },
    swatchHex: '#64748b',
    desc: {
      es: 'Equipo común de supervivencia. Estadísticas base sin efectos pasivos.',
      en: 'Common survival gear. Baseline stats with zero passive perks.',
    },
  },
  {
    tier: { es: '2. Acero Templado', en: '2. Tempered Steel' },
    colorLabel: { es: 'Verde · Mejora', en: 'Green · Enhanced' },
    swatchHex: '#059669',
    desc: {
      es: '+15% en estadísticas base y mayor velocidad de recuperación de estamina.',
      en: '+15% base stats and faster stamina recovery rate.',
    },
  },
  {
    tier: { es: '3. Alquimia Astral', en: '3. Astral Alchemy' },
    colorLabel: { es: 'Azul · Elemental', en: 'Blue · Elemental' },
    swatchHex: '#0284c7',
    desc: {
      es: 'Imbuye el equipo con propiedades elementales: Ascuas, Escarcha, Miasma o Voltaje.',
      en: 'Infuses gear with elemental properties: Embers, Frost, Miasma, or Voltage.',
    },
  },
  {
    tier: { es: '4. Reliquia Maldita', en: '4. Cursed Relic' },
    colorLabel: { es: 'Morado · Pasivas', en: 'Purple · Passives' },
    swatchHex: '#7c3aed',
    desc: {
      es: 'Otorga pasivas que alteran las reglas del combate (absorber vida al ejecutar, volverse etéreo al esquivar).',
      en: 'Grants rule-bending combat passives (lifesteal on execution, ethereal dodge phase).',
    },
  },
  {
    tier: { es: '5. Vestigio Real', en: '5. Royal Vestige' },
    colorLabel: { es: 'Dorado · Único', en: 'Gold · Mythic' },
    swatchHex: '#b45309',
    desc: {
      es: 'Piezas legendarias únicas por partida que alteran la silueta visual del personaje y otorgan habilidades definitivas.',
      en: 'Match-unique legendary relics altering character silhouette and granting ultimate abilities.',
    },
  },
];

export const GDD_MONSTER_TIERS: GddMonsterEntry[] = [
  {
    id: 'tier-1',
    tierLevel: 'I',
    tierName: { es: 'Merodeadores de Valdris', en: 'Valdris Marauders' },
    difficultyLabel: { es: 'Dificultad I · Baja (Saqueo Temprano)', en: 'Difficulty I · Low (Early Looting)' },
    actsActive: { es: 'Actos I – II', en: 'Acts I – II' },
    biomeZone: {
      es: 'Costas Exteriores y Las Marismas del Miasma',
      en: 'Outer Coasts & Marshes of Miasma',
    },
    chestType: {
      es: 'Alijo de Campamento y Mochila de Patrulla',
      en: 'Outpost Cache & Patrol Satchel',
    },
    lootingRule: {
      es: 'Saqueo rápido (1.5s): caen piezas directas del cadáver y se libera el alijo cercano sin sello arcano.',
      en: 'Fast loot (1.5s): drops directly on kill and unlocks nearby camp stashes with no arcane lock.',
    },
    squadScaling: {
      es: 'Errante (1x HP · 1–2 enemigos) · Juramento (1.4x HP · patrulla de 3)',
      en: 'Wanderer (1x HP · 1–2 mobs) · Oath (1.4x HP · 3-mob patrol)',
    },
    pvpAlertRadius: {
      es: '25m (Ruido bajo, sin marca en mapa)',
      en: '25m (Low noise, no map ping)',
    },
    monsters: [
      {
        name: { es: 'Mercenario Consumido', en: 'Ash-Stricken Mercenary' },
        hp: '180 HP',
        role: { es: 'Hostigador Ligero PvE', en: 'Light PvE Skirmisher' },
        combatBehavior: {
          es: 'Deambula por aldeas exteriores y campamentos abandonados; embiste con acero oxidado y suelta viales básicos al caer.',
          en: 'Roams outer hamlets and ruined camps; lunges with rusted blades and drops starter vials on defeat.',
        },
      },
      {
        name: { es: 'Sanguijuela del Miasma', en: 'Miasma Lurker' },
        hp: '230 HP',
        role: { es: 'Acechador Tóxico', en: 'Toxic Ambusher' },
        combatBehavior: {
          es: 'Emerge bajo las pasarelas hundidas de Las Marismas del Miasma aplicando veneno acumulable; ideal para farmear Elixires Purificadores.',
          en: 'Ambushes beneath sunken Marshes of Miasma walkways, inflicting stacking poison; prime source of Purifying Elixirs.',
        },
      },
    ],
    lootGuarantee: {
      es: '1–2 piezas de equipo inicial + 1 Vial del Cinturón garantizado',
      en: '1–2 starter gear items + 1 guaranteed Belt Vial',
    },
    dropRates: {
      oxidized: '62%',
      tempered: '30%',
      astral: '8%',
      cursed: '0%',
      royal: '0%',
    },
    notableDrops: {
      es: 'Forja Oxidada / Acero Templado, Viales Carmesí, Elixir Purificador y Sello de Traslación inicial.',
      en: 'Rusted Forge / Tempered Steel gear, Crimson Vials, Purifying Elixir, and starter Relocation Seal.',
    },
  },
  {
    id: 'tier-2',
    tierLevel: 'II',
    tierName: { es: 'Guardianes Espectrales de Altar', en: 'Spectral Altar Guardians' },
    difficultyLabel: { es: 'Dificultad II · Media (Altar-Cofre Sellado)', en: 'Difficulty II · Medium (Sealed Altar-Chest)' },
    actsActive: { es: 'Actos II – III', en: 'Acts II – III' },
    biomeZone: {
      es: 'Altar-Cofres Sellados y El Bosque de las Agujas',
      en: 'Sealed Altar-Chests & Forest of Spires',
    },
    chestType: {
      es: 'Altar-Cofre Sellado (Bloqueo Rúnico)',
      en: 'Sealed Altar-Chest (Runic Lock)',
    },
    lootingRule: {
      es: 'Cofre invulnerable hasta abatir a los 2 guardianes; al morir el último, toma 3.0s romper el sello para lootear.',
      en: 'Chest stays locked until both guardians fall; once cleared, requires a 3.0s channel to break the seal.',
    },
    squadScaling: {
      es: 'Errante (1x HP · 2 guardianes) · Juramento (1.75x HP · +1 Vigía)',
      en: 'Wanderer (1x HP · 2 guards) · Oath (1.75x HP · +1 Stalker)',
    },
    pvpAlertRadius: {
      es: '70m (Haz de luz rúnica visible al abrir sello)',
      en: '70m (Runic beam visible when unsealing)',
    },
    monsters: [
      {
        name: { es: 'Centinela Espectral del Altar', en: 'Spectral Altar Sentinel' },
        hp: '540 HP',
        role: { es: 'Guardián de Cofre Sellado', en: 'Sealed Chest Warden' },
        combatBehavior: {
          es: 'Custodia los Altar-Cofres Sellados del Acto II; bloquea con escudo etéreo y solo cede ante parry, ataque cargado o Sello del Bastión.',
          en: 'Defends Act II Sealed Altar-Chests; guards with an ethereal shield broken by parries, charged cleaves, or Bastion Walls.',
        },
      },
      {
        name: { es: 'Vigía de las Agujas', en: 'Spire Canopy Stalker' },
        hp: '390 HP',
        role: { es: 'Tirador de Éter Elevado', en: 'Elevated Aether Marksman' },
        combatBehavior: {
          es: 'Dispara virotes imbuídos desde puentes colgantes en El Bosque de las Agujas, forzando cobertura o Traslación vertical.',
          en: 'Fires infused bolts from high Forest of Spires rope bridges, forcing Bastion cover or vertical Relocation.',
        },
      },
    ],
    lootGuarantee: {
      es: 'Altar-Cofre con Alquimia Astral garantizada + 1 Sello de Éter',
      en: 'Altar-Chest with guaranteed Astral Alchemy gear + 1 Aether Seal',
    },
    dropRates: {
      oxidized: '8%',
      tempered: '30%',
      astral: '44%',
      cursed: '15%',
      royal: '3%',
    },
    notableDrops: {
      es: 'Armas Alquimia Astral (Ascuas/Escarcha/Miasma/Voltaje), Botas anti-miasma y Sellos Ofensivos / de Control.',
      en: 'Astral Alchemy weapons (Embers/Frost/Miasma/Voltage), anti-miasma boots, and Offensive / Control Seals.',
    },
  },
  {
    id: 'tier-3',
    tierLevel: 'III',
    tierName: { es: 'Horrores del Rey Sin Nombre', en: 'Horrors of the Nameless King' },
    difficultyLabel: { es: 'Dificultad III · Alta (Jefes de Catacumba)', en: 'Difficulty III · High (Catacomb Bosses)' },
    actsActive: { es: 'Actos II – IV', en: 'Acts II – IV' },
    biomeZone: {
      es: 'Las Catacumbas del Rey Sin Nombre (Subterráneo)',
      en: 'Catacombs of the Nameless King (Underground)',
    },
    chestType: {
      es: 'Relicario del Rey Sin Nombre (3 Cofres)',
      en: 'Nameless King Reliquary (3 Vault Chests)',
    },
    lootingRule: {
      es: 'El Jefe suelta la Llave Osario al morir; abre la bóveda sellada (4.5s) con botín suficiente para todo un escuadrón.',
      en: 'Boss drops the Ossuary Key on death; unlocks the subterranean vault (4.5s) yielding full-squad upgrades.',
    },
    squadScaling: {
      es: 'Errante (1x HP · ataques telegrafiados) · Juramento (2.2x HP · fase enfurecida)',
      en: 'Wanderer (1x HP · solo openings) · Oath (2.2x HP · enrage phase)',
    },
    pvpAlertRadius: {
      es: '120m + Eco en Escalera (Atrae emboscadas PvPvE)',
      en: '120m + Stairwell Echo (Draws PvPvE third-parties)',
    },
    monsters: [
      {
        name: { es: 'Caballero Osario del Rey Sin Nombre', en: 'Nameless Ossuary Knight' },
        hp: '1,480 HP',
        role: { es: 'Jefe de Corredor Subterráneo', en: 'Subterranean Corridor Boss' },
        combatBehavior: {
          es: 'Ejecuta barridos de mandoble en arco y contraataques con escudo agrietado; su derrota abre el relicario de Reliquias Malditas.',
          en: 'Performs sweeping greatsword cleaves and shield counter-bashes; defeating it unseals Cursed Relic vaults.',
        },
      },
      {
        name: { es: 'Sierpe de las Catacumbas', en: 'Catacomb Ash-Wyrm' },
        hp: '2,250 HP',
        role: { es: 'Bestia Titánica de Subsuelo', en: 'Subterranean Apex Beast' },
        combatBehavior: {
          es: 'Exhala ráfagas de Miasma y Ceniza en espacios cerrados iluminados por antorchas, presionando la huida hacia las 3 escaleras.',
          en: 'Breathes Miasma and Ash cones through torch-lit vaults, pressuring squads before the storm seals the 3 exit stairs.',
        },
      },
    ],
    lootGuarantee: {
      es: 'Mínimo 1 Reliquia Maldita (Morada) + 18% Vestigio Real (Dorado)',
      en: 'At least 1 Cursed Relic (Purple) + 18% Royal Vestige (Gold) roll',
    },
    dropRates: {
      oxidized: '0%',
      tempered: '5%',
      astral: '32%',
      cursed: '45%',
      royal: '18%',
    },
    notableDrops: {
      es: 'Reliquias Malditas con pasivas de ejecución, Vestigio Real único, Sellos de Ejecución y Restauración.',
      en: 'Execution-passive Cursed Relics, match-unique Royal Vestige pieces, Execution & Restoration Seals.',
    },
  },
  {
    id: 'tier-4',
    tierLevel: 'IV',
    tierName: { es: 'Heraldo de La Ceniza Abisal', en: 'Herald of the Abyssal Ash' },
    difficultyLabel: { es: 'Dificultad IV · Extrema (Botín de Campana Negra)', en: 'Difficulty IV · Extreme (Black Bell Drop)' },
    actsActive: { es: 'Actos IV – V', en: 'Acts IV – V' },
    biomeZone: {
      es: 'Murallas Interiores y Borde del Salón del Trono',
      en: 'Inner Citadel & Throne Room Perimeter',
    },
    chestType: {
      es: 'Orbe de Vestigio Real (Drop Directo en Arena)',
      en: 'Royal Vestige Orb (Direct Arena Drop)',
    },
    lootingRule: {
      es: 'Drop directo e instantáneo al dar el golpe de gracia; otorga ventaja legendaria al jugador o equipo rumbo al Salón del Trono.',
      en: 'Instant drop awarded on killing blow, granting mythic gear to the player or squad entering the Throne Room.',
    },
    squadScaling: {
      es: 'Errante (1x HP) · Dúo (1.35x) · Trío (1.75x) · Cuarteto (2.2x HP, sin fuego amigo)',
      en: 'Wanderer (1x HP) · Duo (1.35x) · Trio (1.75x) · Quad (2.2x HP, no friendly fire)',
    },
    pvpAlertRadius: {
      es: 'Global (Marcador permanente en brújula de la Ciudadela)',
      en: 'Global (Live compass beacon inside the Citadel)',
    },
    monsters: [
      {
        name: { es: 'Verdugo de la Campana Negra', en: 'Black Bell Executioner' },
        hp: '3,100 HP',
        role: { es: 'Jefe de Cierre en Acto IV', en: 'Act IV Endgame Enforcer' },
        combatBehavior: {
          es: 'Emerge tras el Tañido de la Campana Negra; inmune a control ligero, patrulla el borde de La Ceniza Abisal empujando a los supervivientes hacia el Salón del Trono.',
          en: 'Spawns on the Toll of the Black Bell; immune to light stagger, sweeps the Ash edge to drive remaining teams and solo wanderers into the Throne Room.',
        },
      },
    ],
    lootGuarantee: {
      es: '1 Vestigio Real (Dorado) garantizado + recarga total de Viales',
      en: '1 guaranteed Royal Vestige (Gold) + full Vial Belt refill',
    },
    dropRates: {
      oxidized: '0%',
      tempered: '0%',
      astral: '0%',
      cursed: '52%',
      royal: '48%',
    },
    notableDrops: {
      es: 'Vestigio Real (arma o coraza definitiva), Sello de Égida (Manto de Éter) y recarga total de Viales Carmesí y de Éter.',
      en: 'Royal Vestige mythic weapon/cuirass, Aegis Seal (Aether Cloak), and full Crimson & Aether Vial refill.',
    },
  },
];

export const GDD_SEALS: GddSealItem[] = [
  {
    category: { es: 'Control y Terreno', en: 'Control & Terrain' },
    name: { es: 'Sello del Bastión', en: 'Bastion Seal' },
    subName: { es: 'Muro de Éter', en: 'Aether Wall' },
    cost: '8s · 35 Éter',
    desc: {
      es: 'Levanta una barrera sólida de cristal arcano durante 8 segundos para bloquear puertas de castillos, cortar flechas, aislar enemigos o crear cobertura abierta.',
      en: 'Raises a solid 8-second arcane crystal barrier to seal castle gates, block arrows, isolate enemies, or create open-field cover.',
    },
  },
  {
    category: { es: 'Control y Terreno', en: 'Control & Terrain' },
    name: { es: 'Sello de Gravedad', en: 'Gravity Seal' },
    subName: { es: 'Ancla Abisal', en: 'Abyssal Anchor' },
    cost: '6s · 40 Éter',
    desc: {
      es: 'Crea un campo circular en el suelo que ralentiza un 60% a los enemigos e impide el uso de habilidades de desplazamiento.',
      en: 'Creates a ground field slowing enemies by 60% and locking out movement/dash abilities.',
    },
  },
  {
    category: { es: 'Ofensivo', en: 'Offensive' },
    name: { es: 'Sello de Ejecución', en: 'Execution Seal' },
    subName: { es: 'Lanza Umbría', en: 'Umbral Lance' },
    cost: '18s CD · 40 Éter',
    desc: {
      es: 'Dispara un proyectil concentrado de energía oscura que ignora parte de la armadura; ideal para rematar objetivos debilitados en 1 vs 1.',
      en: 'Fires a concentrated void bolt ignoring a portion of armor; premier finisher in 1v1 duels.',
    },
  },
  {
    category: { es: 'Ofensivo', en: 'Offensive' },
    name: { es: 'Sello de Cataclismo', en: 'Cataclysm Seal' },
    subName: { es: 'Lluvia de Ascuas', en: 'Ember Rain' },
    cost: '24s CD · 45 Éter',
    desc: {
      es: 'Invoca una explosión de fuego en área que rompe formaciones de escuadrones y destruye coberturas de madera.',
      en: 'Calls down an AoE firestorm shattering squad formations and destroying wooden fortifications.',
    },
  },
  {
    category: { es: 'Ofensivo', en: 'Offensive' },
    name: { es: 'Sello de Tormenta', en: 'Storm Seal' },
    subName: { es: 'Cadena Voltaica', en: 'Voltaic Chain' },
    cost: '20s CD · 35 Éter',
    desc: {
      es: 'Lanza un arco eléctrico que rebota hasta entre 3 enemigos cercanos, castigando a los escuadrones que combaten agrupados.',
      en: 'Unleashes a lightning arc chaining across up to 3 nearby targets, punishing tightly clustered squads.',
    },
  },
  {
    category: { es: 'Movilidad y Supervivencia', en: 'Mobility & Survival' },
    name: { es: 'Sello de Traslación', en: 'Relocation Seal' },
    subName: { es: 'Paso Espectral', en: 'Spectral Step' },
    cost: '14s CD · 25 Éter',
    desc: {
      es: 'Teletransporta al jugador 8 metros hacia adelante para cruzar muros bajos, rejas o reubicarse detrás de un rival.',
      en: 'Teleports the caster 8 meters forward to clear low walls, iron gates, or flank behind an opponent.',
    },
  },
  {
    category: { es: 'Movilidad y Supervivencia', en: 'Mobility & Survival' },
    name: { es: 'Sello de Égida', en: 'Aegis Seal' },
    subName: { es: 'Manto de Éter', en: 'Aether Cloak' },
    cost: '6s · 30 Éter',
    desc: {
      es: 'Envuelve al usuario en una barrera arcana durante 6 segundos que absorbe todo el daño recibido consumiendo Éter en lugar de Vitalidad.',
      en: 'Wraps the caster in a 6-second arcane shield absorbing incoming damage using Aether instead of Vitality.',
    },
  },
  {
    category: { es: 'Movilidad y Supervivencia', en: 'Mobility & Survival' },
    name: { es: 'Sello de Restauración', en: 'Restoration Seal' },
    subName: { es: 'Pulso Vital', en: 'Vital Pulse' },
    cost: '28s CD · 55 Éter',
    desc: {
      es: 'Convierte una gran carga de Éter en una curación instantánea de emergencia en pleno combate.',
      en: 'Converts a large reserve of Aether into an instant emergency Vitality heal mid-combat.',
    },
  },
];

export const GDD_POIS: GddPoiItem[] = [
  {
    name: {
      es: 'La Ciudadela de Valdris (Centro)',
      en: 'The Citadel of Valdris (Center)',
    },
    zoneTag: { es: 'Centro · Actos III, IV y V', en: 'Center · Acts III, IV & V' },
    threatLevel: { es: 'PvP Extremo + Salón del Trono', en: 'Extreme PvP + Throne Room' },
    desc: {
      es: 'Fortaleza de tres niveles con murallas, puentes levadizos, patios interiores y un subsuelo conectado; escenario decisivo de El Asedio y El Juicio.',
      en: 'Three-tier fortress with battlements, drawbridges, inner courtyards, and connected catacombs; stage of The Siege and The Judgment.',
    },
  },
  {
    name: {
      es: 'Las Marismas del Miasma (Oeste)',
      en: 'Marshes of Miasma (West)',
    },
    zoneTag: { es: 'Flanco Oeste · Aguas Tóxicas', en: 'West Flank · Toxic Waters' },
    threatLevel: { es: 'Monstruos Tier I + Riesgo Ambiental', en: 'Tier I Mobs + Environmental Hazard' },
    desc: {
      es: 'Aldeas hundidas conectadas por pasarelas de madera sobre aguas tóxicas; exige Elixires Purificadores o botas de Alquimia Astral para cruzar sin daño continuo.',
      en: 'Sunken villages linked by timber walkways over toxic pools; demands Purifying Elixirs or Astral Alchemy boots to traverse safely.',
    },
  },
  {
    name: {
      es: 'Las Catacumbas del Rey Sin Nombre (Subterráneo)',
      en: 'Catacombs of the Nameless King (Underground)',
    },
    zoneTag: { es: 'Subsuelo · 3 Escaleras de Escape', en: 'Underground · 3 Exit Stairs' },
    threatLevel: { es: 'Jefes Tier III (Reliquias Malditas)', en: 'Tier III Bosses (Cursed Relics)' },
    desc: {
      es: 'Laberinto oscuro iluminado por antorchas y cofres; contiene Reliquias Malditas custodiadas por no-muertos y obliga a pelear por las únicas 3 escaleras al cerrar la Ceniza.',
      en: 'Torch-lit subterranean labyrinth housing Cursed Relics guarded by undead; forces brutal fights over the only 3 exit staircases when Ash seals the depths.',
    },
  },
  {
    name: {
      es: 'El Bosque de las Agujas (Este)',
      en: 'The Forest of Spires (East)',
    },
    zoneTag: { es: 'Flanco Este · Verticalidad', en: 'East Flank · Verticality' },
    threatLevel: { es: 'Monstruos Tier II + Emboscadas Aéreas', en: 'Tier II Stalkers + High-Ground' },
    desc: {
      es: 'Árboles colosales con plataformas de vigía y puentes colgantes, ideal para emboscadas con Ballesta de Repetición, arcos y Sellos de Traslación.',
      en: 'Colossal trees with lookout platforms and rope bridges engineered for Repeating Crossbow, longbow, and Relocation Seal ambushes.',
    },
  },
];

export const GDD_PITCH_SLIDES: GddPitchSlide[] = [
  {
    number: '01',
    kicker: { es: 'Diapositiva 01 · Concepto & Hook', en: 'Slide 01 · High Concept & Hook' },
    title: { es: 'The Last Relic', en: 'The Last Relic' },
    subtitle: {
      es: 'Battle Royale Táctico Medieval PvPvE para 200 Jugadores en Unreal Engine 5',
      en: '200-Player Tactical Medieval PvPvE Battle Royale in Unreal Engine 5',
    },
    bullets: [
      {
        heading: { es: 'El Gancho Único (Elevator Pitch)', en: 'The Core Hook (Elevator Pitch)' },
        body: {
          es: 'Combate en un continente devastado por un antiguo juramento roto: lucha unido en Dúos, Tríos o Cuartetos que jamás se separan y ganan juntos, o desafía Valdris en Modo Errante (Solo 1 vs 199) donde solo existe 1 vencedor.',
          en: 'Fight across a realm cursed by an ancient broken oath: stand loyal in Duos, Trios, or Quads that never split and win together, or brave Valdris in Wanderer Mode (Solo 1 vs 199) with a single survivor.',
        },
      },
      {
        heading: { es: 'Ficha Técnica de Producción', en: 'Production Specs' },
        body: {
          es: 'Tercera Persona Táctica · Partidas de 15–18 min · Modo Juramento (Dúos, Tríos y Cuartetos ganan en conjunto) y Modo Errante (Solo 1 vs 199, único ganador).',
          en: 'Tactical TPS · 15–18 min matches · Oath Mode (Duos, Trios & Quads win as a team) and Wanderer Mode (Solo 1 vs 199, 1 sole victor).',
        },
      },
    ],
    callout: {
      es: 'Propuesta de Valor: Hermandad táctica inquebrantable en equipos + supervivencia individual extrema en Errante, sin armas de fuego.',
      en: 'Value Proposition: Unbreakable squad synergy in team queues + pure 1v199 solo survival in medieval steel & arcane combat.',
    },
    imageKey: 'keyart',
  },
  {
    number: '02',
    kicker: { es: 'Diapositiva 02 · Oportunidad de Mercado', en: 'Slide 02 · Market Opportunity' },
    title: { es: 'El Vacío Entre Extraction PvPvE y Battle Royale', en: 'Bridging Extraction PvPvE & Mass Battle Royale' },
    subtitle: {
      es: 'Por qué los jugadores y streamers buscan el próximo giro sistémico del género',
      en: 'Why competitive players and creators crave the next systemic evolution',
    },
    bullets: [
      {
        heading: { es: 'Fatiga de Shooters Militares Tradicionales', en: 'Fatigue in Traditional Gunplay BRs' },
        body: {
          es: 'El público de Dark and Darker, Naraka: Bladepoint y Escape from Tarkov demanda letalidad medieval, lectura de parry y riesgo real al saquear, pero en sesiones rápidas de 15–18 min.',
          en: 'Audiences of Dark and Darker, Naraka: Bladepoint, and Tarkov crave lethal medieval steel, parry reads, and loot stakes inside brisk 15–18 minute match arcs.',
        },
      },
      {
        heading: { es: 'Escala Masiva + Sinergia de Compañía', en: 'Massive Scale + Co-Op Synergy' },
        body: {
          es: 'Dúos, Tríos y Cuartetos combinan armas, armaduras y Sellos de Éter sin temor a separarse para disputar Altar-Cofres y el Salón del Trono, mientras Modo Errante ofrece gloria individual pura.',
          en: 'Duos, Trios, and Quads combine weapons, armor weights, and Aether Seals together to contest Altar-Chests and the Throne Room, while Wanderer Mode satisfies hardcore solo players.',
        },
      },
    ],
    imageKey: 'citadelSiege',
  },
  {
    number: '03',
    kicker: { es: 'Diapositiva 03 · Universo & Fantasía', en: 'Slide 03 · World & Fantasy' },
    title: { es: 'Valdris, La Ceniza Abisal y La Corona de Hierro', en: 'Valdris, The Abyssal Ash & The Iron Crown' },
    subtitle: {
      es: 'Un mundo oscuro donde tu inventario define tu leyenda',
      en: 'A cursed realm where what you scavenge defines who you become',
    },
    bullets: [
      {
        heading: { es: 'Sin Clases, Gremios ni Linajes Fijos', en: 'No Fixed Classes, Guilds, or Bloodlines' },
        body: {
          es: 'Todos los mercenarios inician en igualdad absoluta: harapos de viajero, un cuchillo de hierro y 2 viales menores. El equipo hallado define tu identidad.',
          en: 'Every mercenary drops equal: traveler rags, an iron knife, and 2 minor vials. Looted steel and stone seals forge your combat role dynamically.',
        },
      },
      {
        heading: { es: 'Estética Realista Oscura en UE5', en: 'Grim Realistic UE5 Direction' },
        body: {
          es: 'Arquitectura medieval monumental, iluminación por antorchas en catacumbas y un muro envolvente de Ceniza Abisal que comprime la acción hacia el Salón del Trono.',
          en: 'Monumental medieval stone architecture, torch-lit catacombs, and an encroaching Abyssal Ash wall funneling survivors toward the Throne Room.',
        },
      },
    ],
    imageKey: 'keyart',
  },
  {
    number: '04',
    kicker: { es: 'Diapositiva 04 · El Loop Central (5 Actos)', en: 'Slide 04 · The 5-Act Core Loop' },
    title: { es: 'Del Desembarco al Salón del Trono en 18 Minutos', en: 'From The Landing to the Throne Room in 18 Minutes' },
    subtitle: {
      es: 'Ritmo escalonado de 200 jugadores: victoria conjunta en equipos o gloria individual en Errante',
      en: 'Escalating 200-player match arc: shared squad victory in team queues or 1 winner in Wanderer',
    },
    bullets: [
      {
        heading: { es: 'Actos I–III: Ventana de Respawn de 60s (0:00 – 14:00)', en: 'Acts I–III: 60s Squad Respawn Window (0:00 – 14:00)' },
        body: {
          es: 'Desembarco (200→130), Cacería (130→60) y Asedio (60→16). En equipos, un aliado caído reaparece en 60 segundos solo si al menos 1 compañero sigue vivo; si caen todos antes del tiempo, el equipo es eliminado.',
          en: 'Landing (200→130), Hunt (130→60), and Siege (60→16). Fallen squadmates respawn after 60s only while 1+ teammate remains alive; if all allies die during the timer, the squad is wiped.',
        },
      },
      {
        heading: { es: 'Actos IV–V: Sin Respawn y Juicio del Trono (14:00 – Fin)', en: 'Acts IV–V: Zero Respawn & Throne Judgment (14:00 – End)' },
        body: {
          es: 'A partir del Acto IV (Campana Negra) se desactiva todo respawn de equipo y emerge el Verdugo Tier IV. Los Dúos, Tríos y Cuartetos siguen unidos y ganan juntos; solo Modo Errante corona a 1 único vencedor.',
          en: 'From Act IV (Black Bell) onward, all team respawns are permanently disabled as the Tier IV Executioner spawns. Duos, Trios & Quads stay united and win together; only Wanderer Mode crowns 1 victor.',
        },
      },
    ],
    imageKey: 'combatDuel',
  },
  {
    number: '05',
    kicker: { es: 'Diapositiva 05 · Pilar 1: Zero-Class Loot Identity', en: 'Slide 05 · Pillar 1: Zero-Class Loot' },
    title: { es: 'Tu Inventario Es Tu Clase (5 Tiers de Valdris)', en: 'Your Inventory Is Your Class (5 Valdris Tiers)' },
    subtitle: {
      es: 'De Forja Oxidada a Vestigio Real: lectura visual inmediata en 3D',
      en: 'From Rusted Forge to Royal Vestige: instant 3D silhouette readability',
    },
    bullets: [
      {
        heading: { es: 'Progresión Modular en Tiempo Real', en: 'Real-Time Modular Build Pivots' },
        body: {
          es: 'Dos armas en cambio rápido (Mandoble de Verdugo + Ballesta de Repetición o Cetro de Ceniza), 4 piezas de armadura de peso híbrido y Cinturón de Viales (1–4).',
          en: 'Two quick-swap weapons (Executioner Greatsword + Repeating Crossbow or Ash Scepter), 4 hybrid-weight armor slots, and 1–4 Vial Belt.',
        },
      },
      {
        heading: { es: 'Piezas Legendarias Únicas (Vestigio Real)', en: 'Match-Unique Legendary Relics (Royal Vestige)' },
        body: {
          es: 'Alteran la silueta del personaje en el campo de batalla y otorgan definitivas que convierten al portador en objetivo prioritario de la partida.',
          en: 'Visually transform the wearer silhouette on the battlefield and grant ultimate powers, turning bearers into high-value targets.',
        },
      },
    ],
    imageKey: 'armorTiers',
  },
  {
    number: '06',
    kicker: { es: 'Diapositiva 06 · Pilar 2: Sellos de Éter', en: 'Slide 06 · Pillar 2: Aether Seals' },
    title: { es: '8 Sellos de Éter Intercambiables al Vuelo', en: '8 Swappable Aether Seals on the Fly' },
    subtitle: {
      es: 'Manipulación táctica del terreno, ofensiva arcana y supervivencia',
      en: 'Tactical terrain manipulation, arcane offense, and emergency survival',
    },
    bullets: [
      {
        heading: { es: 'Control de Terreno y Asedio', en: 'Terrain Control & Siege Manipulation' },
        body: {
          es: 'Sello del Bastión (muro sólido de cristal arcano de 8s para sellar puertas o aislar rivales) y Sello de Gravedad (Ancla Abisal que ralentiza un 60% y bloquea dashes).',
          en: 'Bastion Seal (8s solid crystal barrier sealing gates or splitting squads) and Gravity Seal (60% slow + movement-skill lockout).',
        },
      },
      {
        heading: { es: 'Ofensiva y Movilidad Táctica', en: 'Arcane Offense & Tactical Mobility' },
        body: {
          es: 'Lanza Umbría, Lluvia de Ascuas, Cadena Voltaica (rebote entre 3 enemigos), Paso Espectral (teletransporte de 8m), Manto de Éter y Pulso Vital.',
          en: 'Umbral Lance, Ember Rain, Voltaic Chain (3-target bounce), Spectral Step (8m blink), Aegis Cloak, and Vital Pulse.',
        },
      },
    ],
    imageKey: 'lootRelics',
  },
  {
    number: '07',
    kicker: { es: 'Diapositiva 07 · Pilar 3: Dificultad de Monstruos para Lootear', en: 'Slide 07 · Pillar 3: Monster Looting Tiers' },
    title: { es: 'Dificultad de Monstruos para Lootear y Riesgo PvPvE', en: 'Monster Difficulty for Looting & PvPvE Stakes' },
    subtitle: {
      es: 'Los mejores cofres y reliquias están sellados tras monstruos PvE que escalan de Tier I a Tier IV',
      en: 'Top-tier loot chests are sealed behind escalating Tier I–IV PvE monsters that expose your squad',
    },
    bullets: [
      {
        heading: { es: 'Saqueo Bloqueado por Combate (Seal Gating)', en: 'Combat-Gated Looting (Runic Seals & Keys)' },
        body: {
          es: 'Los Altar-Cofres y Relicarios permanecen invulnerables hasta derrotar a sus guardianes (Tier I: 1.5s directo → Tier II: 3.0s ruptura → Tier III: Llave Osario 4.5s → Tier IV: Orbe Legendario inmediato).',
          en: 'Altar-Chests and Reliquaries remain locked until guardians fall (Tier I: 1.5s cache → Tier II: 3.0s seal → Tier III: Boss Key 4.5s → Tier IV: Instant Mythic Orb).',
        },
      },
      {
        heading: { es: 'Escalado Dinámico y Alerta a Rivales', en: 'Mode Scaling & PvP Ambush Radius' },
        body: {
          es: 'La vida y oleadas escalan automáticamente entre Modo Errante (1x) y Modo Juramento (hasta 2.2x), mientras el ruido/haz rúnico alerta a escuadrones enemigos entre 25m y toda la Ciudadela.',
          en: 'Monster HP and waves scale cleanly from Wanderer Solo (1x) to Oath Squads (up to 2.2x), while combat echoes/beams ping rival squads from 25m up to Citadel-wide.',
        },
      },
    ],
    imageKey: 'cryptBestiary',
  },
  {
    number: '08',
    kicker: { es: 'Diapositiva 08 · Diseño de Mundo (Valdris)', en: 'Slide 08 · World & Biome Design' },
    title: { es: '4 Biomas Verticales Diseñados para Emboscadas', en: '4 Vertical Biomes Built for Tactical Ambush' },
    subtitle: {
      es: 'Cada zona exige equipamiento y lectura espacial distinta',
      en: 'Each region rewards distinct gear pairings and spatial positioning',
    },
    bullets: [
      {
        heading: { es: 'Centro y Subsuelo Conectados', en: 'Connected Citadel & Catacombs' },
        body: {
          es: 'La Ciudadela de Valdris (3 niveles con puentes levadizos) y Las Catacumbas del Rey Sin Nombre (donde el cierre obliga a pelear por solo 3 escaleras de salida).',
          en: 'The 3-tier Citadel of Valdris above and the Catacombs of the Nameless King below—where Ash closure forces desperate fights for 3 exit stairs.',
        },
      },
      {
        heading: { es: 'Flancos Contrastantes (Oeste / Este)', en: 'Contrasting Flanks (West / East)' },
        body: {
          es: 'Las Marismas del Miasma (aguas tóxicas que requieren Elixir Purificador o botas Astrales) vs. El Bosque de las Agujas (puentes colgantes y arcos en altura).',
          en: 'Marshes of Miasma (toxic waters demanding Purifying Elixirs or Astral boots) vs. Forest of Spires (rope bridges and vertical bow lanes).',
        },
      },
    ],
    imageKey: 'biomesStudy',
  },
  {
    number: '09',
    kicker: { es: 'Diapositiva 09 · Arquitectura Técnica UE5', en: 'Slide 09 · Unreal Engine 5 Tech' },
    title: { es: 'Ingeniería para 200 Jugadores a 60+ FPS', en: '200-Player Netcode & Rendering at 60+ FPS' },
    subtitle: {
      es: 'Arquitectura técnica multijugador en Unreal Engine 5',
      en: 'Unreal Engine 5 multiplayer systems architecture',
    },
    bullets: [
      {
        heading: { es: 'Replication Graph + Autoridad de Servidor', en: 'Replication Graph + Server Authority' },
        body: {
          es: 'Replicación de alta frecuencia en radio de 50–80m para parries y proyectiles, con validación autoritativa en servidor para evitar duplicación de botín en cofres y cadáveres.',
          en: 'High-frequency replication within 50–80m for melee parries & projectiles, paired with server-authoritative chest/loot validation.',
        },
      },
      {
        heading: { es: 'Skeletal Mesh Modular + Niagara Instanced', en: 'Modular Skeletal Mesh + Instanced Niagara' },
        body: {
          es: 'Un solo esqueleto base optimizado intercambia armaduras de los 5 tiers en vivo junto con partículas GPU instanciadas para Sellos de Éter masivos.',
          en: 'Single shared base Skeletal Mesh swaps all 5 armor tiers dynamically alongside GPU-instanced Niagara VFX for mass Seal casts.',
        },
      },
    ],
    imageKey: 'citadelSiege',
  },
  {
    number: '10',
    kicker: { es: 'Diapositiva 10 · Hoja de Ruta y Modelo Comercial', en: 'Slide 10 · Roadmap & Business Model' },
    title: { es: 'Ruta de Producción, Monetización Limpia y Alcance de Obra', en: 'Production Roadmap, Fair Monetization & IP Scope' },
    subtitle: {
      es: 'Diseño sistémico original de The Last Relic',
      en: 'Original systemic game design specification for The Last Relic',
    },
    bullets: [
      {
        heading: { es: 'Modelo Comercial Sostenible (Zero Pay-to-Win)', en: 'Sustainable Fair-Play Model (Zero Pay-to-Win)' },
        body: {
          es: 'Pase de Temporada de Ceniza y cosméticos heráldicos / acabados de acero que respetan la lectura silueta de los 5 tiers de Valdris sin vender estadísticas.',
          en: 'Abyssal Season Pass and heraldry/steel cosmetics preserving the gameplay silhouette readability of Valdris gear tiers without selling power.',
        },
      },
      {
        heading: { es: 'Fases de Producción (Vertical Slice → Closed Beta)', en: 'Production Milestones (Vertical Slice → Closed Beta)' },
        body: {
          es: 'Q1–Q2: Vertical Slice UE5 (Salón del Trono + 50 jugadores + 8 Sellos) · Q3: Mapa Valdris completo (200 jugadores + Jefes PvE) · Q4: Closed Beta y balance de Modo Juramento y Modo Errante.',
          en: 'Q1–Q2: UE5 Vertical Slice (Throne Room + 50 players + 8 Seals) · Q3: Full Valdris continent (200 players + PvE Bosses) · Q4: Closed Beta & balance tuning across Oath and Wanderer modes.',
        },
      },
    ],
    callout: {
      es: 'Documento Maestro estructurado para registro de Propiedad Intelectual y presentación integral del proyecto.',
      en: 'Master Design Document structured for Intellectual Property filing and complete product presentation.',
    },
    imageKey: 'combatDuel',
  },
];
