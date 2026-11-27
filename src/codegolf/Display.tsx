import { formatTime, getIntroLines, sortEntries, useCodegolfDisplayState, useRemainingSec } from "../libs/codegolf";
import { QrCode } from "./QrCode";
import styles from './Codegolf.module.css';

const rankingSize = 8;
// 残り時間がこの秒数以下になったら色を変える
const warningSec = 30;

const shapeUrls = import.meta.glob<string>('../assets/yapc2026/*.svg', {eager: true, as: 'url'});

// 背景の図形の配置。YAPC::Tokyo 2026 映像用素材の「配信背景 汎用 ロゴなし」と同じ並び。
// [ファイル名, 左端(画面幅に対する%), 上端(画面高さに対する%), 幅(画面幅に対する%), 回転(deg)]
const shapes: [string, number, number, number, number][] = [
  ['shape-gold-left-top', 94.24, 30.04, 19.2, 8],
  ['shape-green-center-top', 94.71, 72.98, 17.64, -6],
  ['shape-purple-right-small', 67.91, 94.75, 21.74, -8],
  ['shape-orange-stroke-right', 33.6, 89.41, 34.95, 6],
  ['shape-blue-right-top', 4.77, 87.4, 30.52, 10],
  ['shape-gold-right', -23.11, 83.33, 29.2, -12],
  ['shape-green-right-bottom', -16.82, 37.95, 24.04, 8],
  ['shape-orange-stroke-center', -16.25, -19.57, 23.21, -8],
  ['shape-gold-left-lower', 10.96, -16.03, 20.51, 6],
  ['shape-blue-stroke-left', 33.03, -20.31, 28.46, -10],
  ['shape-gold-left-top', 63.7, -21.13, 19.2, -8],
  ['shape-green-center-top', 90.53, -25.83, 17.64, 6],
];

export const Display = () => {
  const state = useCodegolfDisplayState();
  const remainingSec = useRemainingSec(state.timer);
  const ranking = sortEntries(state).slice(0, rankingSize);
  const timerClassName = [
    styles.panel,
    remainingSec === 0 ? styles.timerFinished : remainingSec <= warningSec ? styles.timerWarning : ''
  ].join(' ');
  const introLines = getIntroLines(state);
  const showIntro = state.showIntro && introLines.length > 0;

  return <div className={styles.screen}>
    {
      shapes.map(([file, left, top, width, rotate], index) => <img
        key={index}
        className={styles.shape}
        src={shapeUrls[`../assets/yapc2026/${file}.svg`]}
        alt=""
        style={{left: `${left}vw`, top: `${top}vh`, width: `${width}vw`, transform: `rotate(${rotate}deg)`}}
      />)
    }
    <div className={styles.capture} />
    <section className={timerClassName}>
      <div className={styles.label}>残り</div>
      <div className={styles.timerValue}>{formatTime(remainingSec)}</div>
    </section>
    <section className={styles.panel}>
      {
        showIntro ? <>
          <div className={styles.label}>{state.challenger || '現在の挑戦者'}</div>
          <ul className={styles.intro}>
            {introLines.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </> : <>
          <div className={styles.label}>現在の挑戦者</div>
          <div className={styles.challengerName}>{state.challenger || ' '}</div>
        </>
      }
    </section>
    <div className={styles.side}>
      <section className={`${styles.panel} ${styles.ranking}`}>
        <div className={styles.label}>ランキング</div>
        <ol className={styles.rankingList}>
          {
            ranking.map((entry, index) => <li key={entry.id}>
              <span className={styles.rank}>{index + 1}位</span>
              <span className={styles.name}>{entry.name}</span>
            </li>)
          }
        </ol>
      </section>
      <div className={styles.qr}>
        {state.qrText && <QrCode text={state.qrText} />}
      </div>
    </div>
  </div>
}
