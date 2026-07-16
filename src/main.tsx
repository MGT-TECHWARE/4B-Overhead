import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Build stamp. Also forces a new content hash on the entry chunk so browsers
// that cached a poisoned copy of an older entry URL (2026-07-15 Cloudflare
// edge-cache incident) fetch a fresh file.
document.documentElement.dataset.build = '2026-07-15a';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
