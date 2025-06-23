import React from "react";
import { useEffect, useMemo, useState } from "react";
import background from './assets/background.png';

const endpoint = 'https://script.google.com/macros/s/AKfycbz0YX57gmf55Ohxre122XtmDA0Es9tiSyaGPSWod9JcIoXqSEPui8GQzMry0P11ScqB/exec'

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
  const [updatekey, setUpdatekey] = useState<number>();
  useEffect(() => {
    (async () => {
      const res = await fetch(endpoint);
      const json = await res.json() as ApiResponse;
      setData(json);
      setTimeout(() => {
        setUpdatekey(Math.random())
      }, 30 * 1000);
    })()
  }, [updatekey])

  const trackA = data?.timetable.a.filter(({title}) => !!title)
  const trackB = data?.timetable.b.filter(({title}) => !!title)

  return <section style={{
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    width: '100vw',
    height: '100vh',
    color: 'black'
  }}>
    <h1 style={{
      paddingTop: '10vh',
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
            data?.notice[num].map((s) => 
              s.includes('gyazo.com') ? <img style={{width: '20%'}} src={s + '/raw'} /> :<li>{s}</li>
            )
          }
        </ul>
      </div> : <div className='timetable' style={{padding: '0 10vw', fontSize: '3em', lineHeight: '1.1em', textAlign: 'left'}}>
        {
          !!trackA?.length && <>
            <h3>Track A</h3>
            <table>
              {
                trackA.map(({start, end, title, speaker}) => <tr>
                  <td>{start} - {end}</td><td> <strong>{title}</strong> by {speaker}</td>
                </tr>)
              }
            </table>
          </>
        }
        {
          !!trackB?.length && <>
            <h3 style={{
              marginTop: '0.5vh'
            }}>Track B</h3>
            <table>
              {
                trackB.map(({start, end, title, speaker}) => <tr>
                  <td>{start} - {end}</td><td> <strong>{title}</strong> by {speaker}</td>
                </tr>)
              }
            </table>
          </>
        }
      </div>
    }
  </section>
}
