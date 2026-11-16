import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import StandaloneFishApp from './StandaloneFishApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StandaloneFishApp />
  </StrictMode>
);
