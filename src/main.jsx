import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Leaderboard from './components/Leaderboard'
import './index.css'
import DeviceProvider from './contexts/DeviceContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DeviceProvider>
      <App />
    </DeviceProvider>
  </React.StrictMode>
)
