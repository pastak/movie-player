// 操作画面からプレイヤーのウィンドウへ postMessage で送るメッセージ
export type PlayerMessage = Readonly<
  | {action: 'futa' | 'default' | 'reload'}
  | {action: 'injection', url?: string, file?: string}
  // ループを中断して、指定した Web ページを表示する
  | {action: 'website', url: string}
>;
