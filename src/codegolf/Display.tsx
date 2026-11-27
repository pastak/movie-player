import { formatTime, sortEntries, useCodegolfDisplayState, useRemainingSec } from "../libs/codegolf";
import { QrCode } from "./QrCode";
import styles from './Codegolf.module.css';

const rankingSize = 8;
// 残り時間がこの秒数以下になったら色を変える
const warningSec = 30;

export const Display = () => {
  const state = useCodegolfDisplayState();
  const remainingSec = useRemainingSec(state.timer);
  const ranking = sortEntries(state).slice(0, rankingSize);
  const timerClassName = [
    styles.panel,
    remainingSec === 0 ? styles.timerFinished : remainingSec <= warningSec ? styles.timerWarning : ''
  ].join(' ');

  return <div className={styles.screen}>
    <div className={styles.capture} />
    <section className={timerClassName}>
      <div className={styles.label}>残り</div>
      <div className={styles.timerValue}>{formatTime(remainingSec)}</div>
    </section>
    <section className={styles.panel}>
      <div className={styles.label}>現在の挑戦者</div>
      <div className={styles.challengerName}>{state.challenger || ' '}</div>
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
