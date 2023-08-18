import { useEffect, useMemo, useState } from "react";
import { FileInfo } from "./libs/files";

export const Player = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const params = new URLSearchParams(location.search);
  const senario = useMemo(() => {
    const senarioJson = params.get('senario');
    let senario: FileInfo[];
    console.log(senarioJson)
    try {
      if (!senarioJson) return null;
      senario = JSON.parse(senarioJson) as FileInfo[];
    } catch {
      return null;
    }
    return senario;
  }, []);
  if (!senario) return null;
  const next = () => {
    setCurrentIndex((currentIndex + 1) % senario.length);
  }

  useEffect(() => {
    const target = senario[currentIndex];
    console.log(target);
      if (target.type === 'video') {
        try{
            const video = document.querySelector<HTMLVideoElement>('#video-'+ target.id);
            if (video) {
              video.playbackRate = 1.0;
              video.play();
            }
        } catch {}
      } else {
        window.setTimeout(next, 20 * 1000);
      }
  }, [currentIndex]);
  
  
  return <>
    {
      senario.map((target, index) => {
        const commonProps = {
          src: target.url,
          key: target.id,
          id: `${target.type}-${target.id}`
        }
        switch (target.type) {
          case 'image': {
            return <img {...commonProps} style={{
              maxHeight: '100vh',
              width: '100vw',
              margin: 'auto',
              display: currentIndex === index ? 'block' : 'none'
            }} />
          }
          case 'video': {
            return <video {...commonProps} style={{width: '100vw', height: '100vh', display: currentIndex === index ? 'block' : 'none'}} onEnded={next} />
          }
          case 'website': {
            return <iframe {...commonProps} style={{width: '100vw', height: '100vh', display: currentIndex === index ? 'block' : 'none'}}/>
          }
        }
      })
    }
  </>
}
