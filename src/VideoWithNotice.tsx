import { useEffect, useState } from "react"
import styles from './VideoWithNotice.module.css'

const params = new URLSearchParams(location.search);

const fixedMessage = params.get('fixedMessage') || '19:10頃の開始までしばらくお待ち下さい。';

const tables = params.get('fixedMessage') ? [] : [
  '感想や期待などをぜひ X で #個人開発祭り を付けて投稿してください！！'
  // '会場Wi-Fiはご自由にご利用ください。 SSID: toranomon / Pass: tnm00023',
  // 'X(旧Twitter)等で本日の様子をハッシュタグ #Helpfeel で発信していただけますと幸いです。',
  // '本日の内容については写真撮影もご自由に行っていただいて問題ございません。'
]
export const VideoWithNotice = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % tables.length)
    }, 1000 * 25)
    return () => clearInterval(timer);
  }, [])
  const info = tables[current]
  return <>
  <div className={styles.info}>
    {
      params.has('finished') ?
        (<div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 1.5em',
        }}>
          <div style={{
            fontSize: '.8em',
            lineHeight: '1.5em',
            textAlign: 'left',
          }}>
            配信は全て終了いたしました。ご視聴いただき誠にありがとうございました。<br />次回以降の開催の参考のために、アンケートへの回答をお願いします。右のQRコードまたは配信ページの概要欄のリンクから回答できます。
          </div>
          <img src='/slido-kojin-4.png' style={{
            maxHeight: '14.2vh'
          }} />
        </div>) :
        (<div>{fixedMessage}<br />{info}</div>)
    }
  </div>
  </>
}
