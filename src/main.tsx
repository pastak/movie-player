import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Overlay } from './Overlay'
import { Player } from './Player'
import { Slide } from './Slide'
import { Sponsor } from './Sponsor'
import { VideoWithNotice } from './VideoWithNotice'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {
      location.pathname === '/movie-player/' ? <App /> :
      location.pathname.startsWith('/movie-player/player') ? <Player /> :
      location.pathname === '/movie-player/overlay.html' ? <Overlay /> :
      location.pathname === '/movie-player/video-with-notice.html' ? <VideoWithNotice />:
      location.pathname.startsWith('/movie-player/slide.html') ? <Slide />:
      location.pathname.startsWith('/movie-player/sponsor.html') ? <Sponsor />:
      null
    }
  </React.StrictMode>,
)
