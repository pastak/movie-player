import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Player } from './Player'
import { Slide } from './Slide'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {
      location.pathname === '/' ? <App /> :
      location.pathname.startsWith('/player') ? <Player /> :
      <Slide />
    }
  </React.StrictMode>,
)
