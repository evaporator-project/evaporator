import 'antd/dist/antd.css';
import './locales/i18n'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import './pages/userWorker'
import './libs/monaco/userWorker';

import App from './App';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App></App>
  </BrowserRouter>,
);
