import { Card } from './yapc/Card';
import logo from './assets/yapc2026/vertical_color.svg';
import date from './assets/yapc2026/date.svg';
import styles from './yapc/Card.module.css';

// 蓋絵：縦組みのロゴと日程を画面の中央に置く
export const Lid = () => <Card className={styles.lid} seed="lid">
  <img className={styles.lidLogo} data-avoid="box" src={logo} alt="YAPC::Tokyo 2026" />
  <img className={styles.lidDate} data-avoid="box" src={date} alt="11.27 FRI → 11.29 SUN @東京ビッグサイト" />
</Card>
