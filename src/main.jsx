import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App title="¡BAM! ¡LOOK @ THAT BACON SIZZLE!" />
  </StrictMode>,
);
