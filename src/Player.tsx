import { useEffect, useMemo, useRef, useState } from "react";
import { FileInfo } from "./libs/files";
import futa from './assets/kanrk-futa.png';

export const Player = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const params = new URLSearchParams(location.search);
  const senario = useMemo(() => {
    const senarioJson = params.get('senario');
    let senario: FileInfo[];
    try {
      if (!senarioJson) return null;
      senario = JSON.parse(senarioJson) as FileInfo[];
    } catch {
      return null;
    }
    return senario;
  }, []);
  if (!senario) return null;
  const injected = useRef<'futa' | 'video' | null>(null);
  const next = () => {
    if (injected.current) return;
    setCurrentIndex((currentIndex + 1) % senario.length);
  }

  useEffect(() => {
    const target = senario[currentIndex];
      if (target.type === 'video') {
        try{
            const video = document.querySelector<HTMLVideoElement>('#video-'+ target.id);
            if (video) {
              video.playbackRate = 1.0;
              video.play();
            }
        } catch {}
      } else {
        const defaultDisplayDurationSec = 12;
        const durationSec = target.type === 'website' 
          ? target.url.includes('sponsor.html') ? 
            target.url.includes('Matz') ? 12 :
            target.url.includes("Take") ? 10 : 
            8 
          :defaultDisplayDurationSec
        : defaultDisplayDurationSec 
        window.setTimeout(next, durationSec * 1000);
      }
  }, [currentIndex]);

  const [forcedVideoUrl, setForcedVideoUrl] = useState<string | null>(null);


  const loadInjected: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    event.currentTarget.playbackRate = 1.0;
    event.currentTarget.play();
    event.currentTarget.onended = () => {
      window.setTimeout(() => {
        injected.current = null;
        setForcedVideoUrl(null);
        next();
      }, 10 * 1000)
    }
  }

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const stopVideo = (id: string) => {
        try{
          const video = document.querySelector<HTMLVideoElement>('#video-'+ id);
          if (video) {
            video.playbackRate = 1.0;
            video.pause();
          }
        } catch {}
      }

      if (event.data.action === 'reload') {
        location.reload();
      } else if (event.data.action === 'injection') {
        const video = `/techconf/${event.data.file}.mp4`
        const target = senario[currentIndex];
        if (target.type === 'video') {
          stopVideo(target.id);
        }
        injected.current = 'video';
        setForcedVideoUrl(video);
      } else if (event.data.action === 'futa') {
        const target = senario[currentIndex];
        if (target.type === 'video') {
          stopVideo(target.id);
        }
        injected.current = 'futa';
        setForcedVideoUrl(futa);
      } else if (event.data.action === 'default' && injected.current) {
        injected.current = null;
        setForcedVideoUrl(null);
        next();
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler);
  }, [currentIndex]);
  
  
  return <>
    {
      senario.map((target, index) => {
        const commonProps = {
          src: target.url,
          key: target.id,
          id: `${target.type}-${target.id}`
        }
        const display = !forcedVideoUrl && currentIndex === index ? 'block' : 'none'
        switch (target.type) {
          case 'image': {
            return <img {...commonProps} style={{
              maxHeight: '100vh',
              width: '100vw',
              margin: 'auto',
              display
            }} />
          }
          case 'video': {
            return <video {...commonProps} style={{width: '100vw', height: '100vh', display}} onEnded={next} />
          }
          case 'website': {
            return <iframe {...commonProps} style={{width: '100vw', height: '100vh', display}}/>
          }
        }
      })
    }
    {
      injected.current === 'video' && forcedVideoUrl && <video key='injected-video' onCanPlay={loadInjected} src={forcedVideoUrl} style={{width: '100vw', height: '100vh', display: 'block'}} />
    }
      <img key='injected-futa' src={futa} style={{width: '100vw', height: '100vh', display: injected.current === 'futa' ? 'block' : 'none'}} />
  </>
}
