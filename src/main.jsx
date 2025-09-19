import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Thay thế BrowserRouter bằng HashRouter
import { HashRouter } from 'react-router-dom';
import App from './App';
import './firebase'; // Import và khởi tạo Firebase
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Sử dụng HashRouter. Nó không cần basename. */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
