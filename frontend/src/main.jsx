import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { KindeProvider } from '@kinde-oss/kinde-auth-react'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

// Unregister any existing service workers to prevent conflicts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister()
      console.log('Service worker unregistered:', registration.scope)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain={import.meta.env.VITE_KINDE_DOMAIN}
      redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
      logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URI}
      onRedirectCallback={(user, appState) => {
        console.log('Kinde redirect callback triggered:', { user, appState })
        // This will be handled by the Callback component
      }}
    >
      <ConvexProvider client={convex}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </BrowserRouter>
      </ConvexProvider>
    </KindeProvider>
  </React.StrictMode>,
)