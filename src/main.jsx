import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/variables.css'
import './styles/global.css'
import './styles/App.css'
import './styles/components.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element not found. Asegúrate de tener <div id="root"></div> en index.html')
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
