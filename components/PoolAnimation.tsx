// components/PoolAnimation.tsx
import React, { useMemo, useState } from "react";

type Props = {
  /** 直径 */
  size?: number;
  /** 0~1 的水位（0=空，1=满），默认 0.5 */
  level?: number;
  /** 波动幅度（像素），默认 36，值越大波浪越夸张 */
  amplitude?: number;
  /** 波动速度（秒），默认 3 */
  speedSec?: number;
  /** 波浪主色 */
  color?: string;
  /** 背景色（池壁颜色） */
  bg?: string;
  /** 边框色 */
  borderColor?: string;
};

export default function PoolAnimation({
  size = 260,
  level = 0.5,
  amplitude = 36,
  speedSec = 3,
  color = "#00aaff",
  bg = "#e6f7ff",
  borderColor = "#0099ff",
}: Props) {
  // 鼠标悬停 & 位置（用于在鼠标处渲染漩涡）
  const [hover, setHover] = useState(false);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  // 计算尺寸
  const w = size;
  const h = size;
  const r = size / 2;

  // 水面高度（从底部向上）
  const waterH = useMemo(() => Math.max(0, Math.min(1, level)) * h, [level, h]);

  // 生成一条可动画的波浪路径（三段贝塞尔 Q + T 平滑）
  const makeWaveValues = (phase: number) => {
    // phase 影响初始上下偏移，做两条波让效果更饱满
    const y = h - waterH + phase * (amplitude / 2);
    const up = y - amplitude;
    const down = y + amplitude;

    return `
      M0 ${y}
      Q ${w / 4} ${up} ${w / 2} ${y}
      T ${w} ${y}
      V ${h} H0 Z;

      M0 ${y}
      Q ${w / 4} ${down} ${w / 2} ${y}
      T ${w} ${y}
      V ${h} H0 Z;

      M0 ${y}
      Q ${w / 4} ${up} ${w / 2} ${y}
      T ${w} ${y}
      V ${h} H0 Z
    `;
  };

  // 旋涡形状：用若干同心圆 + 旋转的虚线圆，制造“漩涡感”
  const swirl = (
    <g transform={`translate(${mx} ${my})`}>
      {/* 淡淡的同心圆 */}
      {[1, 0.7, 0.45, 0.25].map((k, i) => (
        <circle
          key={i}
          r={20 * k}
          fill="none"
          stroke={color}
          strokeOpacity={0.35 - i * 0.06}
          strokeWidth={1.6 - i * 0.2}
        />
      ))}
      {/* 旋转的虚线环，造成“吸入”视觉 */}
      <circle
        r={22}
        fill="none"
        stroke={color}
        strokeOpacity={0.55}
        strokeWidth={1.8}
        strokeDasharray="6 10"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        r={12}
        fill="none"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={1.6}
        strokeDasharray="4 8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360"
          to="0"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </circle>
      {/* 中心波点 */}
      <circle r={2.4} fill={color} fillOpacity={0.9} />
    </g>
  );

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        border: `2px solid ${borderColor}`,
        background: bg,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08) inset",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setMx(e.clientX - rect.left);
        setMy(e.clientY - rect.top);
      }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        style={{ display: "block" }}
        aria-hidden
      >
        {/* 用 clipPath 把所有内容裁剪成圆形（双保险） */}
        <defs>
          <clipPath id="pool-clip">
            <circle cx={r} cy={r} r={r} />
          </clipPath>
          {/* 顶部高光 */}
          <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g clipPath="url(#pool-clip)">
          {/* 浅色底水（让色彩更有层次） */}
          <rect x="0" y={h - waterH} width={w} height={waterH} fill={color} opacity={0.55} />

          {/* 主波浪（更大幅度、更明显） */}
          <path fill={color} fillOpacity={0.9}>
            <animate
              attributeName="d"
              dur={`${speedSec}s`}
              repeatCount="indefinite"
              values={makeWaveValues(+1)}
            />
          </path>

          {/* 第二层波浪（相位不同，透明一些） */}
          <path fill={color} fillOpacity={0.55}>
            <animate
              attributeName="d"
              dur={`${speedSec * 1.6}s`}
              repeatCount="indefinite"
              values={makeWaveValues(-1)}
            />
          </path>

          {/* 顶部高光 */}
          <rect x="0" y="0" width={w} height={h * 0.6} fill="url(#gloss)" />

          {/* 旋涡（仅在 hover 时显示，且只在水面之上才渲染） */}
          {hover && my > h - waterH - amplitude * 1.5 && swirl}
        </g>
      </svg>
    </div>
  );
}
