import { useEffect, useMemo, useState } from "react";
import { YapcBackground, yapcColors, yapcFontFamily } from './YapcBackground';

const endpoint = 'https://script.google.com/macros/s/AKfycbxT-x70e0ZKzDWAY8EN0zBqCL5jr8eOPBYazA30E8UvoQSmkbBz8VbvYgmJeY01UrL5oQ/exec'

const updateIntervalSec = 30;

type Content = Readonly<{
  start?: string,
  end?: string,
  title?: string,
  speaker?: string,
}>

type ApiResponse = Readonly<{
  notice: [string[], string[], string[]],
  timetable: {
    a: [Content, Content, Content],
    b: [Content, Content, Content],
  }
}>

const heading = {
  notice: '来場者の皆さまへ',
  timetable: 'このあとのスケジュール'
}

export const Slide = () => {
  const type = useMemo(() => {
    return (new URLSearchParams(location.search)).get('type') as 'notice' | 'timetable';
  }, []);

  const num = useMemo(() => {
    return (new URLSearchParams(location.search)).get('number') as '0' | '1';
  }, [])

  const [data, setData] = useState<ApiResponse>();
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(endpoint);
        const json = await res.json() as ApiResponse;
        if (!cancelled) setData(json);
      } catch {
        // 取得に失敗したら直前の表示を残し、次の更新で取り直す
      }
    }
    load();
    const timer = window.setInterval(load, updateIntervalSec * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    }
  }, [])

  const trackA = data?.timetable.a.filter(({title}) => !!title)
  const trackB = data?.timetable.b.filter(({title}) => !!title)

  return <section style={{
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    overflow: 'hidden',
    backgroundColor: yapcColors.cream,
    color: yapcColors.ink,
    fontFamily: yapcFontFamily,
  }}>
    <YapcBackground />
    {/* 上端の図形に重ならないよう、見出しを少し下げる */}
    <div style={{position: 'relative', zIndex: 1}}>
    <h1 style={{
      paddingTop: '11vh',
      paddingLeft: '8vw',
      margin: 0,
      textAlign: 'left',
      fontSize: '4.5vw'
    }}>
      {heading[type]}
    </h1>
    {
      type === 'notice' ? <div style={{padding: '0 10vw', fontSize: '3em', lineHeight: '1.8em'}}>
        <ul style={{textAlign: 'left'}}>
          {
            data?.notice[num].map((s, i) =>
              s.includes('gyazo.com') ? <img key={i} style={{width: '20%'}} src={s + '/raw'} /> :<li key={i}>{s}</li>
            )
          }
        </ul>
      </div> : <div className='timetable' style={{padding: '5vh 10vw', fontSize: '5em', lineHeight: '1.1em', textAlign: 'left'}}>
        {
          !!trackA?.length && <>
            <table>
              <tbody>
              {
                trackA.map(({start, end, title, speaker}, i) => <tr key={i}>
                  <td>{start} - {end}</td><td> <strong>{title}</strong> {speaker ? ` by ${speaker}` : ''}</td>
                </tr>)
              }
              </tbody>
            </table>
          </>
        }
        {
          !!trackB?.length && <>
            <h3 style={{
              marginTop: '0.5vh'
            }}>Track B</h3>
            <table>
              <tbody>
              {
                trackB.map(({start, end, title, speaker}, i) => <tr key={i}>
                  <td>{start} - {end}</td><td> <strong>{title}</strong> by {speaker}</td>
                </tr>)
              }
              </tbody>
            </table>
          </>
        }
      </div>
    }
    </div>
  </section>
}
