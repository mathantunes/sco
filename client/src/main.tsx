import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SessionProvider } from './providers/SessionProvider'

const deviceId = new URLSearchParams(window.location.search).get('deviceId') || 'device1'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider deviceId={deviceId}>
      <App />
    </SessionProvider>
  </StrictMode>,
)
