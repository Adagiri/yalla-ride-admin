import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Ant Design styles
import '@refinedev/antd/dist/reset.css';

// Import any custom styles
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
