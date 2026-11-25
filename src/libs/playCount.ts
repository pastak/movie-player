const storageKey = 'playCounts';

export type PlayCounts = Readonly<Record<string, number>>;

export function getPlayCounts(): PlayCounts {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

// 動画のURLをキーにして再生回数を記録する
export function incrementPlayCount(url: string) {
  const counts = getPlayCounts();
  localStorage.setItem(storageKey, JSON.stringify({...counts, [url]: (counts[url] ?? 0) + 1}));
}

export function resetPlayCounts() {
  localStorage.removeItem(storageKey);
}

// 他のウィンドウ（プレイヤー）での更新を購読する
export function subscribePlayCounts(callback: () => void) {
  const handler = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) callback();
  }
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
