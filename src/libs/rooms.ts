// 会場の部屋と、その部屋の Slido（質問の壁紙表示）の URL
export const rooms = [
  {id: 'track-a', name: 'TrackA', slidoUrl: 'https://wall.sli.do/event/8nr3XE3LR5xsr5AJZcTki9?section=0bac7a97-5173-4a8a-93c2-a2f2012a7f69'},
  {id: 'track-b', name: 'TrackB', slidoUrl: 'https://wall.sli.do/event/8nr3XE3LR5xsr5AJZcTki9?section=eba868e7-3b7c-4953-aad3-b8ea3110c5fb'},
  {id: 'track-c', name: 'TrackC', slidoUrl: 'https://wall.sli.do/event/8nr3XE3LR5xsr5AJZcTki9?section=d7d202e4-e4f3-4812-8a0c-df7d64de14c5'},
  {id: 'hands-on', name: 'ハンズオン', slidoUrl: 'https://wall.sli.do/event/8nr3XE3LR5xsr5AJZcTki9?section=2bfb29b0-f341-4d84-b7cb-ef9373131436'},
  {id: 'odoriba', name: '踊り場', slidoUrl: 'https://wall.sli.do/event/8nr3XE3LR5xsr5AJZcTki9?section=f37ac7e8-81f1-4456-823e-0f0f020b1a5b'},
] as const;

export type RoomId = typeof rooms[number]['id'];

const storageKey = 'room';

// この PC がどの部屋のものか。PC ごとのブラウザに保存する
export function loadRoomId(): RoomId | null {
  const saved = localStorage.getItem(storageKey);
  return rooms.find(room => room.id === saved)?.id ?? null;
}

export function saveRoomId(id: RoomId | null) {
  if (id) localStorage.setItem(storageKey, id);
  else localStorage.removeItem(storageKey);
}
