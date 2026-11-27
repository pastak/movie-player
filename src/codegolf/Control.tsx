import { useState } from "react";
import { formatTime, getRemainingSec, sortEntries, useCodegolfAdminState, useRemainingSec } from "../libs/codegolf";
import styles from './Codegolf.module.css';

const displayUrl = '/movie-player/codegolf.html';

export const Control = () => {
  const {state, update, connected, setDisplay} = useCodegolfAdminState();
  const openDisplay = () => {
    const display = window.open(displayUrl, 'codegolf-display', 'popup,width=1280,height=720');
    if (display) setDisplay(display);
  }
  const remainingSec = useRemainingSec(state.timer);
  const running = state.timer.endAt !== null;

  const [minutes, setMinutes] = useState(Math.floor(state.timer.durationSec / 60));
  const [seconds, setSeconds] = useState(state.timer.durationSec % 60);
  const setDuration = (e: React.FormEvent) => {
    e.preventDefault();
    const durationSec = Math.max(0, minutes * 60 + seconds);
    update(prev => ({...prev, timer: {durationSec, remainingSec: durationSec, endAt: null}}));
  }
  const startTimer = () => update(prev => {
    if (prev.timer.endAt !== null) return prev;
    return {...prev, timer: {...prev.timer, endAt: Date.now() + prev.timer.remainingSec * 1000}};
  });
  const pauseTimer = () => update(prev => ({
    ...prev,
    timer: {...prev.timer, remainingSec: getRemainingSec(prev.timer, Date.now()), endAt: null}
  }));
  const resetTimer = () => update(prev => ({
    ...prev,
    timer: {...prev.timer, remainingSec: prev.timer.durationSec, endAt: null}
  }));

  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entryName = name.trim() || state.challenger.trim();
    const entryScore = Number(score);
    if (!entryName || score.trim() === '' || !Number.isFinite(entryScore)) return;
    update(prev => ({
      ...prev,
      entries: [...prev.entries, {id: crypto.randomUUID(), name: entryName, score: entryScore}]
    }));
    setName('');
    setScore('');
  }
  const deleteEntry = (id: string) => () => update(prev => ({
    ...prev,
    entries: prev.entries.filter(entry => entry.id !== id)
  }));
  const clearEntries = () => {
    if (!confirm('ランキングを全て削除しますか？')) return;
    update(prev => ({...prev, entries: []}));
  }

  return <div className={styles.control}>
    <h2>コードゴルフ 操作画面</h2>
    <button onClick={openDisplay}>表示画面を開く</button>
    <span>{connected ? '表示画面に接続中' : '表示画面は未接続'}</span>

    <h3>タイマー</h3>
    <div>
      <span className={styles.controlTimer}>{formatTime(remainingSec)}</span>
      <button onClick={startTimer} disabled={running || remainingSec === 0}>スタート</button>
      <button onClick={pauseTimer} disabled={!running}>一時停止</button>
      <button onClick={resetTimer}>リセット</button>
    </div>
    <form onSubmit={setDuration} style={{marginTop: 8}}>
      <label>制限時間 <input type="number" min={0} value={minutes} onChange={e => setMinutes(Number(e.target.value))} />分</label>{' '}
      <label><input type="number" min={0} max={59} value={seconds} onChange={e => setSeconds(Number(e.target.value))} />秒</label>{' '}
      <button>設定してリセット</button>
    </form>

    <h3>現在の挑戦者</h3>
    <input
      type="text"
      value={state.challenger}
      onChange={e => update(prev => ({...prev, challenger: e.target.value}))}
    />
    <div style={{marginTop: 8}}>紹介文（1行が箇条書きの1項目。3行程度まで）</div>
    <textarea
      rows={3}
      value={state.intro}
      onChange={e => update(prev => ({...prev, intro: e.target.value}))}
    />
    <div>
      <button onClick={() => update(prev => ({...prev, showIntro: false}))} disabled={!state.showIntro}>名前を表示</button>
      <button onClick={() => update(prev => ({...prev, showIntro: true}))} disabled={state.showIntro}>紹介文を表示</button>
      <span>{state.showIntro ? '紹介文を表示中' : '名前を表示中'}</span>
    </div>

    <h3>ランキング</h3>
    <form onSubmit={addEntry}>
      <input type="text" placeholder={state.challenger || '名前'} value={name} onChange={e => setName(e.target.value)} />
      <input type="number" placeholder="pt" value={score} onChange={e => setScore(e.target.value)} />
      <button>追加</button>
      <span>名前が空なら現在の挑戦者で追加します</span>
    </form>
    <label style={{display: 'block', marginTop: 8}}>
      <input
        type="checkbox"
        checked={state.lowerIsBetter}
        onChange={e => update(prev => ({...prev, lowerIsBetter: e.target.checked}))}
      /> pt が少ない方を上位にする
    </label>
    <ol>
      {
        sortEntries(state).map(entry => <li key={entry.id}>
          {entry.name} {entry.score} pt <button onClick={deleteEntry(entry.id)}>Delete</button>
        </li>)
      }
    </ol>
    {state.entries.length > 0 && <button onClick={clearEntries}>ランキングを全て削除</button>}

    <h3>QRコードにするURL</h3>
    <input
      type="text"
      style={{width: '100%', maxWidth: 600, boxSizing: 'border-box'}}
      value={state.qrText}
      onChange={e => update(prev => ({...prev, qrText: e.target.value}))}
    />
  </div>
}
