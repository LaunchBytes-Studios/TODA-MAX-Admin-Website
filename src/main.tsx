import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { RealtimeProvider } from './providers/RealtimeProvider.tsx';
import { NotificationProvider } from './providers/NotificationProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <RealtimeProvider>
    <NotificationProvider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </NotificationProvider>
  </RealtimeProvider>,
);
