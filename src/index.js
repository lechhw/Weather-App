import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import Weather from './service/weather';
import '@fortawesome/fontawesome-free/js/all.js';
import AuthService from './service/auth_service';

const root = ReactDOM.createRoot(document.getElementById('root'));
const weatherService = new Weather();
const authService = new AuthService();
root.render(<App authService={authService} weatherService={weatherService} />);
