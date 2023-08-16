import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import App from './App.tsx';
import { UserProvider } from './context/userContext.tsx';
import { SharepointProvider } from './context/sharepointContext.tsx';

const queryClient = new QueryClient();

import 'react-datepicker/dist/react-datepicker.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <SharepointProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </SharepointProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
