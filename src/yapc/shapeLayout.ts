// YAPC::Tokyo 2026 映像用素材と同じ決まりで、背景の図形を 1920x1080 の画面に配置する。
//
// - 色付きの図形 10 種を SCALE 倍にして、COUNT 個を画面の外周に等間隔で配る
// - 並べ始める位置は、シードの文字列から決める（画面ごとに変わる）
// - そこから、外形の BLEED 割以上を画面の外に出し、中身（data-avoid の付いた要素）と
//   ほかの図形に重ならない一番近い位置へ動かす
// - どこにも置けないときは 0.85 倍に縮めて探し直し、MIN_W より小さくなったら置かない
//
// 値は素材側で調整して決められたものなので変えない

const P = { SCALE: 1.75, COUNT: 12, START: 400, SPIN: 6000, BLEED: 0.7, GAP: 0, SHAPE_GAP: 88 };
export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;
const PERIM = 2 * (STAGE_WIDTH + STAGE_HEIGHT);
const STEP = 16;
const MIN_W = 160;

// [ファイル名, 幅, 高さ, 回転]
const SITE_SHAPES: [string, number, number, number][] = [
  ['shape-gold-left-top', 210.6, 186.3, 8],
  ['shape-green-center-top', 193.5, 227.7, -6],
  ['shape-purple-right-small', 238.5, 108, -8],
  ['shape-orange-stroke-right', 383.4, 217.8, 6],
  ['shape-blue-right-top', 334.8, 259.2, 10],
  ['shape-gold-right', 320.4, 342.9, -12],
  ['shape-green-right-bottom', 263.7, 208.8, 8],
  ['shape-orange-stroke-center', 254.7, 347.4, -8],
  ['shape-gold-left-lower', 225, 141.3, 6],
  ['shape-blue-stroke-left', 312.3, 179.1, -10],
];

export type Shape = Readonly<{
  file: string,
  left: number,
  top: number,
  width: number,
  rotate: number,
}>;

type Box = { l: number, t: number, r: number, b: number };
type Obstacle = Box & { solid: boolean };

// 外周上の距離 t を、画面の座標に直す
function onPerimeter(t: number): [number, number] {
  t = ((t % PERIM) + PERIM) % PERIM;
  if (t < 1920) return [t, 0];
  if (t < 3000) return [1920, t - 1920];
  if (t < 4920) return [1920 - (t - 3000), 1080];
  return [0, 1080 - (t - 4920)];
}

// 文字列から 0 以上 1 未満の値を出す（FNV-1a でハッシュし、mulberry32 で 1 回まぜる）
function seed01(text: string): number {
  let a = 2166136261;
  for (const ch of text) {
    a ^= ch.codePointAt(0)!;
    a = Math.imul(a, 16777619);
  }
  a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// 外周に等間隔で配っただけの、動かす前の配置
export function initialShapes(seed: string): Shape[] {
  const start = P.START + seed01(seed) * P.SPIN;
  return Array.from({ length: P.COUNT }, (_, n) => {
    const [file, w, h, rot0] = SITE_SHAPES[n % SITE_SHAPES.length];
    const rotate = n < SITE_SHAPES.length ? rot0 : -rot0;
    const [x, y] = onPerimeter(start + n * PERIM / P.COUNT);
    return { file, width: w * P.SCALE, left: x - w * P.SCALE / 2, top: y - h * P.SCALE / 2, rotate };
  });
}

// 図形の画像は透明な余白を含むので、文字に対しては外形の 8 割を当たり判定にする。
// ロゴのような箱（solid）には図形の角が少しでも掛かると目立つので、外形いっぱいで判定する
function box(x: number, y: number, w: number, h: number, pad = 0, m = 0.1): Box {
  return { l: x + w * m - pad, t: y + h * m - pad, r: x + w * (1 - m) + pad, b: y + h * (1 - m) + pad };
}

const hits = (a: Box, b: Box) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;

// 端に沿って、元の位置 (x0, y0) に近い順に候補を出す
function candidates(x0: number, y0: number, w: number, h: number) {
  const edges = [
    { fixed: 'x', at: -w * P.BLEED, from: y0, min: -h, max: 1080 },
    { fixed: 'x', at: 1920 - w * (1 - P.BLEED), from: y0, min: -h, max: 1080 },
    { fixed: 'y', at: -h * P.BLEED, from: x0, min: -w, max: 1920 },
    { fixed: 'y', at: 1080 - h * (1 - P.BLEED), from: x0, min: -w, max: 1920 },
  ];
  const list: { cost: number, x: number, y: number }[] = [];
  for (const e of edges) {
    const base = Math.abs((e.fixed === 'x' ? x0 : y0) - e.at);
    for (let d = 0; d < 2000; d += STEP) {
      for (const v of d ? [e.from + d, e.from - d] : [e.from]) {
        if (v < e.min || v > e.max) continue;
        list.push({ cost: base + d, x: e.fixed === 'x' ? e.at : v, y: e.fixed === 'y' ? e.at : v });
      }
    }
  }
  return list.sort((a, b) => a.cost - b.cost);
}

// 画面の中で図形に避けさせる範囲を、1920x1080 の座標で集める。
// data-avoid="text" は文字の行ごとの範囲を、data-avoid="box" は要素の外形いっぱいを避ける
function obstacles(stage: HTMLElement): Obstacle[] {
  const origin = stage.getBoundingClientRect();
  const k = origin.width / STAGE_WIDTH;
  const rects: Obstacle[] = [];
  const add = (r: DOMRect, solid: boolean) => rects.push({
    solid,
    l: (r.left - origin.left) / k - P.GAP,
    t: (r.top - origin.top) / k - P.GAP,
    r: (r.right - origin.left) / k + P.GAP,
    b: (r.bottom - origin.top) / k + P.GAP,
  });
  for (const node of stage.querySelectorAll('[data-avoid="text"]')) {
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) add(r, false);
  }
  for (const node of stage.querySelectorAll('[data-avoid="box"]')) add(node.getBoundingClientRect(), true);
  return rects;
}

// 図形ごとの縦横比（高さ / 幅）を渡すと、中身を避けた配置を返す。置けなかった図形は含めない
export function layoutShapes(stage: HTMLElement, shapes: readonly Shape[], aspectRatios: readonly number[]): Shape[] {
  const avoid = obstacles(stage);
  const placed: Box[] = [];
  const result: Shape[] = [];
  shapes.forEach((shape, index) => {
    const fullWidth = shape.width;
    const fullHeight = fullWidth * aspectRatios[index];
    let w = fullWidth, h = fullHeight;
    while (w >= MIN_W) {
      const found = candidates(shape.left + (fullWidth - w) / 2, shape.top + (fullHeight - h) / 2, w, h).find(c => {
        const b = box(c.x, c.y, w, h), full = box(c.x, c.y, w, h, 0, 0);
        if (avoid.some(o => hits(o.solid ? full : b, o))) return false;
        return !placed.some(p => hits(box(c.x, c.y, w, h, P.SHAPE_GAP / 2), p));
      });
      if (found) {
        placed.push(box(found.x, found.y, w, h, P.SHAPE_GAP / 2));
        result.push({ ...shape, left: found.x, top: found.y, width: w });
        return;
      }
      w *= 0.85;
      h *= 0.85;
    }
  });
  return result;
}
