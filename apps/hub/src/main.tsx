import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RepositoryProvider } from './app/RepositoryContext';
import { AuthProvider } from './features/authentication/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RepositoryProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </RepositoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
