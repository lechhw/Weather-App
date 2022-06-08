import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import Weather from './service/weather';

const root = ReactDOM.createRoot(document.getElementById('root'));
const weatherService = new Weather();
root.render(<App weatherService={weatherService} />);
