// 操作画面からプレイヤーのウィンドウへ postMessage で送るメッセージ
export type PlayerMessage = Readonly<
  | {action: 'futa' | 'default' | 'reload'}
  | {action: 'injection', url?: string, file?: string}
>;
