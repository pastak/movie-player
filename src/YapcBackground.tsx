import styles from './YapcBackground.module.css';

// YAPC::Tokyo 2026 映像用素材の配色
export const yapcColors = {
  ink: '#222222',
  cream: '#fffaed',
  orange: '#ea5520',
} as const;

export const yapcFontFamily = '"Zen Maru Gothic", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif';

const shapeUrls = import.meta.glob<string>('./assets/yapc2026/*.svg', {eager: true, as: 'url'});

// 図形の配置。YAPC::Tokyo 2026 映像用素材の「配信背景 汎用 ロゴなし」と同じ並び。
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

// 画面いっぱいに敷く背景の図形。地の色（cream）は置く側で指定し、
// 中身は position: relative と z-index: 1 以上で図形より手前に出す
export const YapcBackground = () => <>
  {
    shapes.map(([file, left, top, width, rotate], index) => <img
      key={index}
      className={styles.shape}
      src={shapeUrls[`./assets/yapc2026/${file}.svg`]}
      alt=""
      style={{left: `${left}vw`, top: `${top}vh`, width: `${width}vw`, transform: `rotate(${rotate}deg)`}}
    />)
  }
</>
