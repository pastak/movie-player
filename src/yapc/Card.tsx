import { useEffect, useRef, useState } from "react";
import { initialShapes, layoutShapes, Shape, STAGE_HEIGHT, STAGE_WIDTH } from "./shapeLayout";
import styles from './Card.module.css';

const shapeUrls = import.meta.glob<string>('../assets/yapc2026/shape-*.svg', {eager: true, as: 'url'});

// 表示する大きさに対する 1920x1080 の画面の倍率
function useStageScale(): number {
  const getScale = () => Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT);
  const [scale, setScale] = useState(getScale);
  useEffect(() => {
    const handler = () => setScale(getScale());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return scale;
}

// YAPC::Tokyo 2026 映像用素材の 1 枚の画面。背景の図形は seed ごとに決まった位置に並び、
// 中身のうち data-avoid="box"（外形）と data-avoid="text"（文字の行）の付いた要素を避ける
export const Card: React.FC<{
  className?: string,
  seed: string,
  children?: React.ReactNode,
}> = ({className, seed, children}) => {
  const scale = useStageScale();
  const stageRef = useRef<HTMLElement>(null);
  // 中身の位置が決まってから並べるので、それまでは図形を出さない
  const [shapes, setShapes] = useState<Shape[] | null>(null);
  const [aspectRatios, setAspectRatios] = useState<number[] | null>(null);

  // 図形の縦横比は画像を読まないと分からないので、先に調べておく
  useEffect(() => {
    let cancelled = false;
    Promise.all(initialShapes(seed).map(shape => new Promise<number>(resolve => {
      const img = new Image();
      img.onload = () => resolve(img.naturalHeight / img.naturalWidth);
      img.onerror = () => resolve(1);
      img.src = shapeUrls[`../assets/yapc2026/${shape.file}.svg`];
    }))).then(ratios => {
      if (!cancelled) setAspectRatios(ratios);
    });
    return () => {
      cancelled = true;
    }
  }, [seed]);

  // フォントと中身の画像が揃って位置が決まってから、図形を並べる
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !aspectRatios) return;
    let cancelled = false;
    const images = [...stage.querySelectorAll('img')].map(img => img.decode().catch(() => {}));
    Promise.all([document.fonts.ready, ...images]).then(() => requestAnimationFrame(() => {
      if (!cancelled) setShapes(layoutShapes(stage, initialShapes(seed), aspectRatios));
    }));
    return () => {
      cancelled = true;
    }
  }, [seed, aspectRatios]);

  return <div className={styles.viewport}>
    <article
      ref={stageRef}
      lang="ja"
      className={`${styles.card} ${className ?? ''}`}
      style={{transform: `scale(${scale})`}}
    >
      {
        shapes?.map((shape, index) => <img
          key={index}
          className={styles.shape}
          src={shapeUrls[`../assets/yapc2026/${shape.file}.svg`]}
          alt=""
          style={{
            width: shape.width,
            left: shape.left,
            top: shape.top,
            transform: `rotate(${shape.rotate}deg)`,
          }}
        />)
      }
      {children}
    </article>
  </div>
}
