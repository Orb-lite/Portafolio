export interface WorldBlock {
  id: string;
  name: string;
  subtitle: string;
  levelsRange: [number, number];
  themeTexture: string; // seamless image path
  bgColor: number;
  floorColor: number;
  trackColor: number;
  curbColor: number;
  fogColor: number;
  lightColor: number;
  accentColor: string;
  badgeTag: string;
  description: string;
}

export const WORLD_BLOCKS: WorldBlock[] = [
  {
    id: 'chess_kingdom',
    name: 'Chess Kingdom',
    subtitle: 'Royal Marble & Golden Parquet',
    levelsRange: [1, 3],
    themeTexture: '/assets/worlds/chess_kingdom.jpg',
    bgColor: 0x1b1622,
    floorColor: 0x241d30,
    trackColor: 0xd97706, // Royal antique gold
    curbColor: 0x451a03, // Inlaid dark wood / brass
    fogColor: 0x1b1622,
    lightColor: 0xfffbeb,
    accentColor: '#facc15',
    badgeTag: 'ROYAL CHESS',
    description: 'Classic alternating chess checkerboard with polished marble, baroque gold filigree, and royal heraldic ornaments.',
  },
  {
    id: 'coral_cove',
    name: 'Coral Cove',
    subtitle: 'Sunlit Depths & Bio-Luminescence',
    levelsRange: [4, 6],
    themeTexture: '/assets/worlds/coral_cove.jpg',
    bgColor: 0x062033,
    floorColor: 0x082f49,
    trackColor: 0x0284c7, // Ocean azure
    curbColor: 0x0369a1,
    fogColor: 0x062033,
    lightColor: 0xe0f2fe,
    accentColor: '#38bdf8',
    badgeTag: 'AQUATIC REEF',
    description: 'Vibrant turquoise waters, golden sand with sun caustics, and swimming cartoon fish with wagging caudal fins.',
  },
  {
    id: 'cyber_grid',
    name: 'Cyber Grid',
    subtitle: 'Neon Synthwave & Laser Circuits',
    levelsRange: [7, 9],
    themeTexture: '/assets/worlds/cyber_grid.jpg',
    bgColor: 0x090d16,
    floorColor: 0x0f172a,
    trackColor: 0x8b5cf6, // Neon violet
    curbColor: 0x06b6d4, // Cyan laser
    fogColor: 0x090d16,
    lightColor: 0xfae8ff,
    accentColor: '#a855f7',
    badgeTag: 'CYBER TECH',
    description: 'Futuristic hexagonal tech plates, glowing cyan laser circuits, and high-frequency synthwave pulse aesthetics.',
  },
  {
    id: 'golden_vault',
    name: 'Golden Vault',
    subtitle: 'Ancient Emperor Sanctuary',
    levelsRange: [10, 999],
    themeTexture: '/assets/worlds/golden_vault.jpg',
    bgColor: 0x141e16,
    floorColor: 0x064e3b,
    trackColor: 0xf59e0b, // Amber gold
    curbColor: 0x047857, // Deep emerald
    fogColor: 0x141e16,
    lightColor: 0xfef9c3,
    accentColor: '#10b981',
    badgeTag: 'GOLDEN SANCTUARY',
    description: 'Opulent dark emerald marble with star-cut gold leaf mosaics and ancient imperial treasure ornaments.',
  },
];

export function getWorldForLevel(level: number): WorldBlock {
  for (const block of WORLD_BLOCKS) {
    if (level >= block.levelsRange[0] && level <= block.levelsRange[1]) {
      return block;
    }
  }
  return WORLD_BLOCKS[WORLD_BLOCKS.length - 1];
}
