export type FileInfo = Readonly<{
  url: string,
  type: 'image' | 'video' | 'website' | 'unknown',
  id: string,
  // 動画以外で、表示し続ける秒数を個別に決めたいときに指定する
  durationSec?: number
} | {type: 'futa', id: string}>;
