import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import { SharepointProvider } from './context/sharepointContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SharepointProvider>
      <App />
    </SharepointProvider>
  </React.StrictMode>,
);
