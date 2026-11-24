import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import { AppRoutes } from './app/routes';
import { logout } from './features/auth/authSlice';
import { setUnauthorizedHandler } from './services/api';
import './styles.css';

// A 401 from any protected call clears the session and the route guard sends the user to S1 (TRD section 8).
setUnauthorizedHandler(() => store.dispatch(logout()));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
