import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Overlay } from './Overlay'
import { Player } from './Player'
import { Slide } from './Slide'
import { Sponsor } from './Sponsor'
import { VideoWithNotice } from './VideoWithNotice'
import { baseUrl } from './libs/baseUrl';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {
      location.pathname === baseUrl ? <App /> :
      location.pathname.startsWith(`${baseUrl}player`) ? <Player /> :
      location.pathname === `${baseUrl}overlay.html` ? <Overlay /> :
      location.pathname === `${baseUrl}video-with-notice.html` ? <VideoWithNotice />:
      location.pathname.startsWith(`${baseUrl}slide.html`) ? <Slide />:
      location.pathname.startsWith(`${baseUrl}sponsor.html`) ? <Sponsor />:
      null
    }
  </React.StrictMode>,
)
