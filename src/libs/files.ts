export type FileInfo = Readonly<{
  url: string,
  type: 'image' | 'video' | 'website' | 'unknown',
  id: string
} | {type: 'futa', id: string}>;
