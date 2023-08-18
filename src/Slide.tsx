import React from "react";
import { useEffect, useMemo, useState } from "react";
import background from './assets/background.png';

const endpoint = 'https://script.google.com/macros/s/AKfycbzp9g8U0v3c725g04DpNEHL0tkGKjiQEQgGbZ9Op6JWdqokNpPfZ-7glvpxpKGO0mlx/exec'

type ApiResponse = Readonly<{
  notice: [string[], string[], string[]],
  timetable: {
    lt: {time: string, title: string, speaker: string},
    talk: {time: string, title: string, speaker: string}
  }
}>

const heading = {
  notice: '来場者の皆さまへ',
  timetable: 'Coming Up Next'
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
    (async () => {
      const res = await fetch(endpoint);
      const json = await res.json() as ApiResponse;
      setData(json);
    })()
  }, [])

  return <section style={{
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    width: '100vw',
    height: '100vh',
    color: 'white'
  }}>
    <h1 style={{
      paddingTop: '12vh',
      margin: 0,
      textAlign: 'center',
      fontSize: '4.2em'
    }}>
      {heading[type]}
    </h1>
    {
      type === 'notice' ? <div style={{padding: '0 10vw', fontSize: '3em', lineHeight: '1.8em'}}>
        <ul style={{textAlign: 'left'}}>
          {
            data?.notice[num].map((s) => <li>{s}</li>)
          }
        </ul>
      </div> : <div style={{padding: '0 10vw', fontSize: '3em', lineHeight: '1.1em', textAlign: 'left'}}>
          <h3>{data?.timetable.lt.time}: {data?.timetable.lt.title}</h3>
          <h4>{data?.timetable.lt.speaker}</h4>
          <h3>{data?.timetable.talk.time}: {data?.timetable.talk.title}</h3>
          <h4>{data?.timetable.talk.speaker}</h4>
      </div>
    }
  </section>
}
