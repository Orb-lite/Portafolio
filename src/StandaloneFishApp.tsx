import React, { useState } from 'react';
import { TileAbsorberGame } from './components/game/TileAbsorberGame';
import { GameLanguage } from './game/localization';

function getInitialStandaloneLanguage(): GameLanguage {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang');
    if (paramLang === 'en' || paramLang === 'es') {
      return paramLang;
    }
    const browserLang = window.navigator?.language?.toLowerCase() || '';
    if (browserLang.startsWith('es')) {
      return 'es';
    }
  }
  return 'en';
}

export function StandaloneFishApp() {
  const [language, setLanguage] = useState<GameLanguage>(() => getInitialStandaloneLanguage());

  return (
    <main className="fixed inset-0 w-screen h-dvh overflow-hidden bg-[#119ad6]">
      <TileAbsorberGame
        mode="fish_of_fortune"
        language={language}
        isStandalone={true}
        onLanguageChange={setLanguage}
      />
    </main>
  );
}

export default StandaloneFishApp;
