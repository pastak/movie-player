import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Overlay } from './Overlay'
import { Player } from './Player'
import { Slide } from './Slide'
import { VideoWithNotice } from './VideoWithNotice'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {
      location.pathname === '/' ? <App /> :
      location.pathname.startsWith('/player') ? <Player /> :
      location.pathname === '/overlay.html' ? <Overlay /> :
      location.pathname === '/video-with-notice.html' ? <VideoWithNotice />:
      <Slide />
    }
  </React.StrictMode>,
)
