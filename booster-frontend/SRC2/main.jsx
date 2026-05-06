import { BoosterProvider } from "./context/BoosterContext";
import 'index.css';
import App from "./App";
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BoosterProvider>
      <App />
    </BoosterProvider>
  </React.StrictMode>,
);