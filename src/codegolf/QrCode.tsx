import { useMemo } from "react";
import qrcode from "qrcode-generator";

// 周囲に確保する余白（セル数）
const quietZone = 2;

export const QrCode: React.FC<{text: string, className?: string}> = ({text, className}) => {
  const qr = useMemo(() => {
    try {
      const code = qrcode(0, 'M');
      code.addData(text);
      code.make();
      const size = code.getModuleCount();
      let path = '';
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (code.isDark(row, col)) path += `M${col} ${row}h1v1h-1z`;
        }
      }
      return {size, path};
    } catch {
      // 文字数が多すぎる場合など
      return null;
    }
  }, [text]);
  if (!qr) return null;
  const viewSize = qr.size + quietZone * 2;
  return <svg
    className={className}
    viewBox={`${-quietZone} ${-quietZone} ${viewSize} ${viewSize}`}
    shapeRendering="crispEdges"
    role="img"
    aria-label="QRコード"
  >
    <rect x={-quietZone} y={-quietZone} width={viewSize} height={viewSize} fill="#fff" />
    <path d={qr.path} fill="#000" />
  </svg>
}
