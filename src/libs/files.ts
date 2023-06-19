export type FileInfo = Readonly<{
  url: string,
  type: 'image' | 'video' | 'website' | 'unknown',
  id: string
}>
