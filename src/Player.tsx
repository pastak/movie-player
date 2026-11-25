import { useEffect, useMemo, useRef, useState } from "react";
import { FileInfo } from "./libs/files";
import { incrementPlayCount } from "./libs/playCount";
import { PlayerMessage } from "./libs/playerMessage";

const futa = '/movie-player/futa.html';
const defaultDisplayDurationSec = 12;
// 差し込み動画の再生が終わってからループに戻るまでの待ち時間
const injectedVideoTailSec = 10;

const fullScreenStyle = {width: '100vw', height: '100vh'} as const;

// ループを中断して表示しているもの
// key は同じ動画を続けて差し込んだ場合にも再生し直すためのもの
type Injected = Readonly<{type: 'futa'} | {type: 'video', url: string, key: string}>;

function parseSenario(): FileInfo[] | null {
  try {
    const senario = JSON.parse(new URLSearchParams(location.search).get('senario') ?? 'null');
    return Array.isArray(senario) && senario.length > 0 ? senario : null;
  } catch {
    return null;
  }
}

// 動画以外のコンテンツを表示し続ける秒数
function getDisplayDurationSec(target: FileInfo): number {
  if (target.type === 'website' && target.url.includes('sponsor.html')) {
    if (target.url.includes('Matz')) return 12;
    if (target.url.includes('Take')) return 10;
    return 8;
  }
  return defaultDisplayDurationSec;
}

export const Player = () => {
  const senario = useMemo(parseSenario, []);
  if (!senario) return null;
  return <SenarioPlayer senario={senario} />;
}

const SenarioPlayer: React.FC<{senario: FileInfo[]}> = ({senario}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // コンテンツが1つだけでも繰り返し再生できるよう、次へ進むたびに増やす
  const [playKey, setPlayKey] = useState(0);
  const [injected, setInjected] = useState<Injected | null>(null);
  const videos = useRef(new Map<string, HTMLVideoElement>());

  const next = () => {
    setCurrentIndex(prev => (prev + 1) % senario.length);
    setPlayKey(prev => prev + 1);
  }

  // 現在のコンテンツを再生する。
  // 蓋や差し込み動画の表示中は止めておき、ループに戻ったら最初からやり直す
  useEffect(() => {
    if (injected) return;
    const target = senario[currentIndex];
    if (target.type === 'video') {
      const video = videos.current.get(target.id);
      if (!video) return;
      video.playbackRate = 1.0;
      video.currentTime = 0;
      video.play().catch(() => {});
      return () => video.pause();
    }
    const timer = window.setTimeout(next, getDisplayDurationSec(target) * 1000);
    return () => window.clearTimeout(timer);
  }, [currentIndex, playKey, injected]);

  // 差し込み動画が終わったら、少し待ってからループに戻る
  const [injectedEnded, setInjectedEnded] = useState(false);
  useEffect(() => {
    setInjectedEnded(false);
  }, [injected]);
  useEffect(() => {
    if (!injectedEnded) return;
    const timer = window.setTimeout(() => setInjected(null), injectedVideoTailSec * 1000);
    return () => window.clearTimeout(timer);
  }, [injectedEnded]);

  useEffect(() => {
    const handler = (event: MessageEvent<PlayerMessage>) => {
      const message = event.data;
      switch (message?.action) {
        case 'reload':
          location.reload();
          break;
        case 'injection':
          setInjected({
            type: 'video',
            url: message.url ?? `/techconf/${message.file}.mp4`,
            key: crypto.randomUUID()
          });
          break;
        case 'futa':
          setInjected({type: 'futa'});
          break;
        case 'default':
          setInjected(null);
          break;
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler);
  }, []);

  const showFuta = injected ? injected.type === 'futa' : senario[currentIndex].type === 'futa';

  return <>
    {
      senario.map((target, index) => {
        if (target.type === 'futa') return null;
        const commonProps = {
          src: target.url,
          id: `${target.type}-${target.id}`
        }
        const display = !injected && currentIndex === index ? 'block' : 'none'
        switch (target.type) {
          case 'image': {
            return <img key={target.id} {...commonProps} style={{
              maxHeight: '100vh',
              width: '100vw',
              margin: 'auto',
              display
            }} />
          }
          case 'video': {
            return <video
              key={target.id}
              {...commonProps}
              ref={(video) => {
                if (video) videos.current.set(target.id, video);
                else videos.current.delete(target.id);
              }}
              style={{...fullScreenStyle, display}}
              onEnded={() => {
                incrementPlayCount(target.url);
                next();
              }}
            />
          }
          case 'website': {
            return <iframe key={target.id} {...commonProps} style={{...fullScreenStyle, display}}/>
          }
          default:
            return null;
        }
      })
    }
    {
      injected?.type === 'video' && <video
        key={injected.key}
        src={injected.url}
        style={{...fullScreenStyle, display: 'block'}}
        onCanPlay={(event) => {
          if (event.currentTarget.ended) return;
          event.currentTarget.playbackRate = 1.0;
          event.currentTarget.play().catch(() => {});
        }}
        onEnded={() => setInjectedEnded(true)}
      />
    }
      <iframe key='futa' src={futa} style={{...fullScreenStyle, display: showFuta ? 'block' : 'none'}} />
  </>
}
