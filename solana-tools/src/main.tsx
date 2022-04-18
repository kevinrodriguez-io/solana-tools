import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
