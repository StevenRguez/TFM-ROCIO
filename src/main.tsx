import './App.css'
import { StrictMode } from 'react'  /* Ayuda a detextar problemas durante
                                    el desarrollo. */
import { createRoot } from 'react-dom/client' /* Crea el punto desde el
                                              que React dibuja la 
                                              aplicación */
import App from './App.tsx' // Componente principal del sistema
import './index.css'        // Estilos generales

createRoot(document.getElementById('root')!).render(
  <StrictMode> 
    <App />
  </StrictMode>,
)