import React from 'react';
import { GameVersion } from '../../game/types';
import { GameLanguage } from '../../game/localization';
import { GameResultModal } from './GameResultModal';

interface LifeModalProps {
  level: number;
  lives: number;
  maxLives: number;
  nextLifeAt: number | null;
  adProgress: number;
  adsPerLife: number;
  adsReady: boolean;
  now: number;
  adMessage: string;
  version?: GameVersion;
  language?: GameLanguage;
  onRetry: () => void;
  onWatchAd: () => void;
  onBackToPath?: () => void;
}

export const LifeModal: React.FC<LifeModalProps> = ({
  level,
  lives,
  maxLives,
  nextLifeAt,
  adProgress,
  adsPerLife,
  adsReady,
  now,
  adMessage,
  version = 'chess',
  language = 'es',
  onRetry,
  onWatchAd,
  onBackToPath,
}) => {
  return (
    <GameResultModal
      type="die"
      version={version}
      language={language}
      level={level}
      lives={lives}
      maxLives={maxLives}
      nextLifeAt={nextLifeAt}
      adProgress={adProgress}
      adsPerLife={adsPerLife}
      adsReady={adsReady}
      now={now}
      adMessage={adMessage}
      onRetry={onRetry}
      onWatchAd={onWatchAd}
      onBackToPath={onBackToPath}
    />
  );
};
