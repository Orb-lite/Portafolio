import React from 'react';
import { GameVersion } from '../../game/types';
import { GameLanguage } from '../../game/localization';
import { GameResultModal } from './GameResultModal';

interface WinModalProps {
  version: GameVersion;
  level: number;
  frontierLevel?: number;
  timeElapsed: number;
  totalTiles: number;
  xpEarned: number;
  language?: GameLanguage;
  onBackToPath: () => void;
  onNextLevel: () => void;
  onJumpToFrontier?: () => void;
  onRestart: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  version,
  level,
  frontierLevel,
  timeElapsed,
  totalTiles,
  xpEarned,
  language = 'es',
  onBackToPath,
  onNextLevel,
  onJumpToFrontier,
  onRestart,
}) => {
  return (
    <GameResultModal
      type="win"
      version={version}
      language={language}
      level={level}
      frontierLevel={frontierLevel}
      timeElapsed={timeElapsed}
      totalTiles={totalTiles}
      xpEarned={xpEarned}
      onBackToPath={onBackToPath}
      onNextLevel={onNextLevel}
      onJumpToFrontier={onJumpToFrontier}
      onRestart={onRestart}
    />
  );
};
