import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import './index.css';
import App from './App.tsx';
import { SharepointProvider } from './context/sharepointContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <SharepointProvider>
        <App />
      </SharepointProvider>
    </HashRouter>
  </React.StrictMode>,
);
