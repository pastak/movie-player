import { useEffect, useState } from "react";

const storageKey = 'codegolf';

export type CodegolfEntry = Readonly<{
  id: string,
  name: string,
  score: number,
}>;

export type CodegolfTimer = Readonly<{
  // 設定した制限時間
  durationSec: number,
  // 停止中の残り時間
  remainingSec: number,
  // 動作中のみ、0になる時刻（ミリ秒）
  endAt: number | null,
}>;

export type CodegolfState = Readonly<{
  qrText: string,
  challenger: string,
  entries: readonly CodegolfEntry[],
  // true ならスコアが小さい方を上位にする
  lowerIsBetter: boolean,
  timer: CodegolfTimer,
}>;

const defaultState: CodegolfState = {
  qrText: '',
  challenger: '',
  entries: [],
  lowerIsBetter: false,
  timer: {durationSec: 600, remainingSec: 600, endAt: null},
};

function loadState(): CodegolfState {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return {...defaultState, ...data, timer: {...defaultState.timer, ...data?.timer}};
  } catch {
    return defaultState;
  }
}

// 操作画面と表示画面の間で postMessage でやり取りするメッセージ
export type CodegolfMessage = Readonly<
  // 表示画面 → 操作画面: 状態を送ってほしい
  | {type: 'codegolf:ready'}
  // 操作画面 → 表示画面: 最新の状態
  | {type: 'codegolf:state', state: CodegolfState}
>;

function isCodegolfMessage(event: MessageEvent): event is MessageEvent<CodegolfMessage> {
  return event.origin === location.origin
    && typeof event.data?.type === 'string'
    && event.data.type.startsWith('codegolf:');
}

// 操作画面用。状態を保持し、変更のたびに表示画面へ送る。
// 再読み込みしても続きから使えるよう localStorage にも保存する
export function useCodegolfAdminState() {
  const [state, setState] = useState(loadState);
  const [display, setDisplay] = useState<WindowProxy | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
    const message: CodegolfMessage = {type: 'codegolf:state', state};
    display?.postMessage(message, location.origin);
  }, [state, display]);

  // 表示画面からの接続要求を受けたら、その画面を送信先にする
  // （操作画面を再読み込みした後もここで繋ぎ直される）
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!isCodegolfMessage(event) || event.data.type !== 'codegolf:ready') return;
      const source = event.source as WindowProxy | null;
      if (!source) return;
      const message: CodegolfMessage = {type: 'codegolf:state', state};
      source.postMessage(message, location.origin);
      setDisplay(source);
    }
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [state]);

  // 表示画面が閉じられたら接続中の表示を外す
  useEffect(() => {
    if (!display) return;
    const interval = window.setInterval(() => {
      if (display.closed) setDisplay(null);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [display]);

  return {state, update: setState, connected: display !== null, setDisplay};
}

// 表示画面が操作画面へ接続を知らせる間隔
const readyIntervalSec = 3;

// 表示画面用。開いた元の操作画面から状態を受け取る
export function useCodegolfDisplayState(): CodegolfState {
  const [state, setState] = useState(loadState);
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (isCodegolfMessage(event) && event.data.type === 'codegolf:state') setState(event.data.state);
    }
    window.addEventListener('message', handler);
    const opener = window.opener as WindowProxy | null;
    const notifyReady = () => {
      const message: CodegolfMessage = {type: 'codegolf:ready'};
      try {
        opener?.postMessage(message, location.origin);
      } catch {
        // 操作画面が閉じられている場合など
      }
    }
    notifyReady();
    const interval = window.setInterval(notifyReady, readyIntervalSec * 1000);
    return () => {
      window.removeEventListener('message', handler);
      window.clearInterval(interval);
    }
  }, []);
  return state;
}

export function getRemainingSec(timer: CodegolfTimer, now: number): number {
  if (timer.endAt === null) return timer.remainingSec;
  return Math.max(0, Math.ceil((timer.endAt - now) / 1000));
}

export function formatTime(sec: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
}

export function sortEntries(state: CodegolfState): CodegolfEntry[] {
  return [...state.entries].sort((a, b) => state.lowerIsBetter ? a.score - b.score : b.score - a.score);
}

// 動作中のタイマーに合わせて残り秒数を更新し続ける
export function useRemainingSec(timer: CodegolfTimer): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    setNow(Date.now());
    if (timer.endAt === null) return;
    const interval = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(interval);
  }, [timer.endAt]);
  return getRemainingSec(timer, now);
}
