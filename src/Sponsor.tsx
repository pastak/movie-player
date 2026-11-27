import { Card } from './yapc/Card';
import { SponsorPlan, sponsorPlans } from './yapc/sponsors';
import logo from './assets/yapc2026/horizontal_color.svg';
import styles from './yapc/Card.module.css';

const logoUrls = import.meta.glob<string>('./assets/yapc2026/sponsors/*.png', {eager: true, as: 'url'});

// 1 枚ごとに載せる区分。プラチナとゴールド、シルバーとブロンズを 1 枚にまとめる
export const sponsorSheets = {
  'perl': ['perl-sponsor'],
  'platinum-gold': ['platinum-sponsor', 'gold-sponsor'],
  'silver-bronze': ['silver-sponsor', 'bronze-sponsor'],
} as const;

// 2 区分を載せる画面での、ロゴの枠の一辺（px）。上位の区分ほど大きくする
const sponsorTile: Record<string, number> = {
  'platinum-sponsor': 180,
  'gold-sponsor': 144,
  'silver-sponsor': 128,
  'bronze-sponsor': 112,
};

function isSheetType(type: unknown): type is keyof typeof sponsorSheets {
  return typeof type === 'string' && type in sponsorSheets;
}

const Header = () => <header className={styles.head}>
  <img className={styles.logo} data-avoid="box" src={logo} alt="YAPC::Tokyo 2026" />
</header>

const Heading: React.FC<{plan: SponsorPlan}> = ({plan}) =>
  <h1 className={styles.heading} data-avoid="text">{plan.name}s<span>{plan.ja}</span></h1>

const Logos: React.FC<{plan: SponsorPlan, style?: React.CSSProperties}> = ({plan, style}) =>
  <ul className={styles.grid} style={style}>
    {
      plan.sponsors.map(([name, file]) => <li key={file} data-avoid="box">
        <img src={logoUrls[`./assets/yapc2026/sponsors/${file}`]} alt={name} />
      </li>)
    }
  </ul>

export const Sponsor = () => {
  const type = new URLSearchParams(location.search).get('type');
  if (!isSheetType(type)) return null;
  const plans = sponsorSheets[type].map(id => sponsorPlans.find(plan => plan.id === id)!);
  const seed = plans.map(plan => plan.id).join(' ');

  // 1 枚に 1 区分だけ載せる画面
  if (plans.length === 1) {
    const plan = plans[0];
    const cols = plan.sponsors.length > 4 ? 6 : 4;
    return <Card className={styles.sponsors} seed={seed}>
      <Header />
      <Heading plan={plan} />
      <Logos plan={plan} style={{'--cols': cols} as React.CSSProperties} />
    </Card>
  }

  // 2 区分を上下に載せる画面。区分ごとに見出しを左の列に置き、ロゴを右に並べる
  return <Card className={`${styles.sponsors} ${styles.merged}`} seed={seed}>
    <Header />
    <div className={styles.plans}>
      {
        plans.map(plan => <section
          key={plan.id}
          className={styles.plan}
          style={{'--tile': `${sponsorTile[plan.id]}px`, '--cols': Math.min(6, plan.sponsors.length)} as React.CSSProperties}
        >
          <Heading plan={plan} />
          <Logos plan={plan} />
        </section>)
      }
    </div>
  </Card>
};
